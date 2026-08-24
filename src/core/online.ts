import Peer, { DataConnection } from 'peerjs';
import { GameState, PlayerSeat, Combo } from './types';
import { initMatch, playMove, passMove, startRound } from './engine';
import { chooseAIAction } from './ai';

export interface RoomPlayer {
  seat: PlayerSeat;
  peerId: string;
  name: string;
  isHost: boolean;
  isAI: boolean;
}

export type NetworkMessage =
  | { type: 'join'; name: string }
  | { type: 'room_state'; players: RoomPlayer[]; gameState: GameState }
  | { type: 'game_update'; gameState: GameState }
  | { type: 'player_action'; seat: PlayerSeat; action: 'play' | 'pass'; combo?: Combo }
  | { type: 'chat_emoji'; seat: PlayerSeat; emoji: string; text?: string };

export class OnlineManager {
  private peer: Peer | null = null;
  private connections: Map<string, DataConnection> = new Map();
  private hostConnection: DataConnection | null = null;
  public myPeerId: string = '';
  public isHost: boolean = false;
  public mySeat: PlayerSeat = 0;
  public players: RoomPlayer[] = [];
  public gameState: GameState = initMatch('2');

  public onStateUpdate?: (state: GameState, players: RoomPlayer[]) => void;
  public onEmojiReceived?: (seat: PlayerSeat, emoji: string, text?: string) => void;
  public onError?: (msg: string) => void;

  /**
   * Host creates a new room
   */
  public async createRoom(roomCode: string, hostName: string = '房主'): Promise<string> {
    this.isHost = true;
    this.mySeat = 0;

    const peerId = `guandan_${roomCode.trim().toUpperCase()}`;
    return new Promise((resolve, reject) => {
      try {
        this.peer = new Peer(peerId);

        this.peer.on('open', (id) => {
          this.myPeerId = id;
          this.players = [
            { seat: 0, peerId: id, name: hostName, isHost: true, isAI: false },
            { seat: 1, peerId: 'ai_1', name: '东家 (AI·大师)', isHost: false, isAI: true },
            { seat: 2, peerId: 'ai_2', name: '北家·搭档 (AI·大师)', isHost: false, isAI: true },
            { seat: 3, peerId: 'ai_3', name: '西家 (AI·大师)', isHost: false, isAI: true },
          ];
          this.gameState = initMatch('2');
          if (this.onStateUpdate) this.onStateUpdate(this.gameState, this.players);
          resolve(roomCode);
        });

        this.peer.on('connection', (conn) => {
          this.handleIncomingConnection(conn);
        });

        this.peer.on('error', (err) => {
          if (this.onError) this.onError(`房间创建失败或房间码已存在: ${err.message}`);
          reject(err);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Join an existing room
   */
  public async joinRoom(roomCode: string, playerName: string = '牌友'): Promise<void> {
    this.isHost = false;
    const targetPeerId = `guandan_${roomCode.trim().toUpperCase()}`;

    return new Promise((resolve, reject) => {
      try {
        this.peer = new Peer();

        this.peer.on('open', (myId) => {
          this.myPeerId = myId;
          const conn = this.peer!.connect(targetPeerId);
          this.hostConnection = conn;

          conn.on('open', () => {
            conn.send({ type: 'join', name: playerName } as NetworkMessage);
            resolve();
          });

          conn.on('data', (data) => {
            this.handleClientMessage(data as NetworkMessage);
          });

          conn.on('error', (err) => {
            if (this.onError) this.onError(`连接房间失败: ${err.message}`);
            reject(err);
          });
        });

        this.peer.on('error', (err) => {
          if (this.onError) this.onError(`P2P 连接错误: ${err.message}`);
          reject(err);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Host handles new joining client
   */
  private handleIncomingConnection(conn: DataConnection) {
    conn.on('data', (data) => {
      const msg = data as NetworkMessage;
      if (msg.type === 'join') {
        // Assign first available AI seat to human
        const availableSeat = this.players.findIndex((p) => p.isAI);
        if (availableSeat !== -1) {
          this.players[availableSeat] = {
            seat: availableSeat as PlayerSeat,
            peerId: conn.peer,
            name: msg.name || `牌友${availableSeat}`,
            isHost: false,
            isAI: false,
          };
          this.connections.set(conn.peer, conn);

          // Broadcast updated room state
          this.broadcast({
            type: 'room_state',
            players: this.players,
            gameState: this.gameState,
          });

          if (this.onStateUpdate) this.onStateUpdate(this.gameState, this.players);
        }
      } else if (msg.type === 'player_action') {
        this.executeMove(msg.seat, msg.action, msg.combo);
      } else if (msg.type === 'chat_emoji') {
        this.broadcast(msg);
        if (this.onEmojiReceived) this.onEmojiReceived(msg.seat, msg.emoji, msg.text);
      }
    });

    conn.on('close', () => {
      // Revert seat to AI
      const playerIdx = this.players.findIndex((p) => p.peerId === conn.peer);
      if (playerIdx !== -1) {
        this.players[playerIdx] = {
          seat: playerIdx as PlayerSeat,
          peerId: `ai_${playerIdx}`,
          name: `${['南', '东', '北', '西'][playerIdx]}家 (AI·替补)`,
          isHost: false,
          isAI: true,
        };
        this.connections.delete(conn.peer);
        this.broadcast({ type: 'room_state', players: this.players, gameState: this.gameState });
        if (this.onStateUpdate) this.onStateUpdate(this.gameState, this.players);
      }
    });
  }

  /**
   * Client receives host message
   */
  private handleClientMessage(msg: NetworkMessage) {
    if (msg.type === 'room_state') {
      this.players = msg.players;
      this.gameState = msg.gameState;
      const me = msg.players.find((p) => p.peerId === this.myPeerId);
      if (me) this.mySeat = me.seat;
      if (this.onStateUpdate) this.onStateUpdate(this.gameState, this.players);
    } else if (msg.type === 'game_update') {
      this.gameState = msg.gameState;
      if (this.onStateUpdate) this.onStateUpdate(this.gameState, this.players);
    } else if (msg.type === 'chat_emoji') {
      if (this.onEmojiReceived) this.onEmojiReceived(msg.seat, msg.emoji, msg.text);
    }
  }

  /**
   * Broadcast message to all connected peers
   */
  public broadcast(msg: NetworkMessage) {
    if (this.isHost) {
      for (const conn of this.connections.values()) {
        conn.send(msg);
      }
    } else if (this.hostConnection) {
      this.hostConnection.send(msg);
    }
  }

  /**
   * Submit move
   */
  public submitMove(action: 'play' | 'pass', combo?: Combo) {
    if (this.isHost) {
      this.executeMove(this.mySeat, action, combo);
    } else if (this.hostConnection) {
      this.hostConnection.send({
        type: 'player_action',
        seat: this.mySeat,
        action,
        combo,
      } as NetworkMessage);
    }
  }

  /**
   * Send Emoji reaction
   */
  public sendEmoji(emoji: string, text?: string) {
    const msg: NetworkMessage = {
      type: 'chat_emoji',
      seat: this.mySeat,
      emoji,
      text,
    };
    if (this.isHost) {
      this.broadcast(msg);
      if (this.onEmojiReceived) this.onEmojiReceived(this.mySeat, emoji, text);
    } else if (this.hostConnection) {
      this.hostConnection.send(msg);
    }
  }

  /**
   * Host authoritative state machine
   */
  private executeMove(seat: PlayerSeat, action: 'play' | 'pass', combo?: Combo) {
    if (!this.isHost) return;

    let res: { nextState: GameState; error?: string };
    if (action === 'play' && combo) {
      res = playMove(this.gameState, seat, combo);
    } else {
      res = passMove(this.gameState, seat);
    }

    if (!res.error) {
      this.gameState = res.nextState;
      this.broadcast({ type: 'game_update', gameState: this.gameState });
      if (this.onStateUpdate) this.onStateUpdate(this.gameState, this.players);

      // Check if next turn is AI
      this.triggerAIIfNeeded();
    }
  }

  /**
   * Host AI Automation for vacant seats
   */
  private triggerAIIfNeeded() {
    if (!this.isHost || this.gameState.phase !== 'playing') return;

    const currentSeat = this.gameState.currentTurn;
    const player = this.players[currentSeat];
    if (player && player.isAI) {
      setTimeout(() => {
        const hand = this.gameState.hands[currentSeat];
        const decision = chooseAIAction(currentSeat, hand, this.gameState, 'master');
        if (decision.action === 'play' && decision.combo) {
          this.executeMove(currentSeat, 'play', decision.combo);
        } else {
          this.executeMove(currentSeat, 'pass');
        }
      }, 800);
    }
  }

  public disconnect() {
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
    this.connections.clear();
    this.hostConnection = null;
  }
}

export const onlineManager = new OnlineManager();
