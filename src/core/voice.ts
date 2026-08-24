import { Sound } from './audio';

export interface VoicePhrase {
  id: string;
  text: string;
  category: 'play' | 'bomb' | 'pass' | 'taunt' | 'cheer';
}

export const POPULAR_PHRASES: VoicePhrase[] = [
  { id: 'v_pass_1', text: '要不起！', category: 'pass' },
  { id: 'v_pass_2', text: '过！过！过！', category: 'pass' },
  { id: 'v_bomb_1', text: '炸你没商量！', category: 'bomb' },
  { id: 'v_bomb_2', text: '天王盖地虎，开炸！', category: 'bomb' },
  { id: 'v_bomb_3', text: '枪打出头鸟！', category: 'bomb' },
  { id: 'v_play_1', text: '对家漂亮！走你！', category: 'cheer' },
  { id: 'v_play_2', text: '逢人配走起！', category: 'play' },
  { id: 'v_play_3', text: '这把稳了，看我冲头游！', category: 'play' },
  { id: 'v_taunt_1', text: '快点吧，等得我花都谢了！', category: 'taunt' },
  { id: 'v_taunt_2', text: '手气太顺，挡都挡不住！', category: 'taunt' },
];

export const POPULAR_EMOJIS = [
  { emoji: '💣', label: '开炸', sound: 'bomb' },
  { emoji: '💥', label: '暴击', sound: 'bomb' },
  { emoji: '👑', label: '冲头游', sound: 'fanfare' },
  { emoji: '🔥', label: '绝杀', sound: 'fanfare' },
  { emoji: '👏', label: '为对家鼓掌', sound: 'cheer' },
  { emoji: '😭', label: '要不起', sound: 'pass' },
  { emoji: '🚀', label: '急速冲刺', sound: 'deal' },
  { emoji: '😎', label: '这把稳了', sound: 'click' },
  { emoji: '💤', label: '快点出牌', sound: 'click' },
  { emoji: '🍺', label: '敬一杯', sound: 'cheer' },
];

class VoiceEngine {
  private isVoiceEnabled: boolean = true;

  constructor() {
    const saved = localStorage.getItem('guandan_voice_enabled');
    this.isVoiceEnabled = saved !== 'false';
  }

  public toggleVoice(): boolean {
    this.isVoiceEnabled = !this.isVoiceEnabled;
    localStorage.setItem('guandan_voice_enabled', String(this.isVoiceEnabled));
    return this.isVoiceEnabled;
  }

  public getIsVoiceEnabled(): boolean {
    return this.isVoiceEnabled;
  }

  /**
   * Speak Chinese Guandan voice banter
   */
  public speak(text: string) {
    if (!this.isVoiceEnabled) return;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel(); // cancel previous speaking

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        utterance.rate = 1.15; // Natural lively poker pace
        utterance.pitch = 1.05;

        // Try to pick a natural Chinese voice if available
        const voices = window.speechSynthesis.getVoices();
        const zhVoice = voices.find((v) => v.lang.includes('zh') || v.lang.includes('cmn'));
        if (zhVoice) {
          utterance.voice = zhVoice;
        }

        window.speechSynthesis.speak(utterance);
      } catch (e) {
        // Ignore fallback
      }
    }
  }

  /**
   * Play matching sound & speak voice line
   */
  public triggerPhrase(phrase: VoicePhrase) {
    if (phrase.category === 'bomb') {
      Sound.playBomb();
    } else if (phrase.category === 'pass') {
      Sound.playPass();
    } else if (phrase.category === 'cheer') {
      Sound.playFanfare();
    } else {
      Sound.playCardPlay();
    }

    this.speak(phrase.text);
  }
}

export const Voice = new VoiceEngine();
