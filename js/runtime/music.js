/**
 * 音乐管理器
 * 负责管理游戏中的音效和背景音乐
 */
export default class Music {
  constructor() {
    this.bgmAudio = null; // 背景音乐
    this.shootAudio = null; // 射击音效
    this.defenseAudio = null; // 防御音效
    this.explosionAudio = null; // 爆炸音效
    this.agentDeployAudio = null; // Agent部署音效
    this.threatAlertAudio = null; // 威胁警报音效
    this.securityLevelAudio = null; // 安全等级变化音效

    this.isMuted = false; // 是否静音
    this.bgmVolume = 0.3; // 背景音乐音量
    this.sfxVolume = 0.5; // 音效音量

    this.init();
  }

  /**
   * 初始化音频
   */
  init() {
    try {
      // 初始化背景音乐
      this.bgmAudio = wx.createInnerAudioContext();
      this.bgmAudio.src = 'audio/bgm.mp3';
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = this.bgmVolume;

      // 初始化射击音效
      this.shootAudio = wx.createInnerAudioContext();
      this.shootAudio.src = 'audio/bullet.mp3';
      this.shootAudio.volume = this.sfxVolume;

      // 初始化防御音效（使用现有音效作为替代）
      this.defenseAudio = wx.createInnerAudioContext();
      this.defenseAudio.src = 'audio/bullet.mp3'; // 使用子弹音效作为防御音效
      this.defenseAudio.volume = this.sfxVolume;

      // 初始化爆炸音效
      this.explosionAudio = wx.createInnerAudioContext();
      this.explosionAudio.src = 'audio/boom.mp3';
      this.explosionAudio.volume = this.sfxVolume;

      // 初始化Agent部署音效（使用现有音效作为替代）
      this.agentDeployAudio = wx.createInnerAudioContext();
      this.agentDeployAudio.src = 'audio/bullet.mp3'; // 使用子弹音效作为部署音效
      this.agentDeployAudio.volume = this.sfxVolume;

      // 初始化威胁警报音效（使用现有音效作为替代）
      this.threatAlertAudio = wx.createInnerAudioContext();
      this.threatAlertAudio.src = 'audio/boom.mp3'; // 使用爆炸音效作为警报音效
      this.threatAlertAudio.volume = this.sfxVolume;

      // 初始化安全等级变化音效（使用现有音效作为替代）
      this.securityLevelAudio = wx.createInnerAudioContext();
      this.securityLevelAudio.src = 'audio/bullet.mp3'; // 使用子弹音效作为等级音效
      this.securityLevelAudio.volume = this.sfxVolume;

    } catch (error) {
      console.warn('音频初始化失败:', error);
    }
  }

  /**
   * 播放背景音乐
   */
  playBGM() {
    if (this.isMuted || !this.bgmAudio) return;
    
    try {
      this.bgmAudio.play();
    } catch (error) {
      console.warn('播放背景音乐失败:', error);
    }
  }

  /**
   * 停止背景音乐
   */
  stopBGM() {
    if (!this.bgmAudio) return;
    
    try {
      this.bgmAudio.stop();
    } catch (error) {
      console.warn('停止背景音乐失败:', error);
    }
  }

  /**
   * 播放射击音效
   */
  playShootSound() {
    if (this.isMuted || !this.shootAudio) return;
    
    try {
      this.shootAudio.stop();
      this.shootAudio.play();
    } catch (error) {
      console.warn('播放射击音效失败:', error);
    }
  }

  /**
   * 播放防御音效
   */
  playDefenseSound() {
    if (this.isMuted || !this.defenseAudio) return;
    
    try {
      this.defenseAudio.stop();
      this.defenseAudio.play();
    } catch (error) {
      console.warn('播放防御音效失败:', error);
    }
  }

  /**
   * 播放爆炸音效
   */
  playExplosion() {
    if (this.isMuted || !this.explosionAudio) return;
    
    try {
      this.explosionAudio.stop();
      this.explosionAudio.play();
    } catch (error) {
      console.warn('播放爆炸音效失败:', error);
    }
  }

  /**
   * 播放Agent部署音效
   */
  playDeploySound() {
    if (this.isMuted || !this.agentDeployAudio) return;
    
    try {
      this.agentDeployAudio.stop();
      this.agentDeployAudio.play();
    } catch (error) {
      console.warn('播放部署音效失败:', error);
    }
  }

  /**
   * 播放威胁警报音效
   */
  playAlertSound() {
    if (this.isMuted || !this.threatAlertAudio) return;
    
    try {
      this.threatAlertAudio.stop();
      this.threatAlertAudio.play();
    } catch (error) {
      console.warn('播放警报音效失败:', error);
    }
  }

  /**
   * 播放安全等级变化音效
   */
  playLevelSound() {
    if (this.isMuted || !this.securityLevelAudio) return;
    
    try {
      this.securityLevelAudio.stop();
      this.securityLevelAudio.play();
    } catch (error) {
      console.warn('播放等级音效失败:', error);
    }
  }

  /**
   * 设置静音状态
   * @param {boolean} muted - 是否静音
   */
  setMuted(muted) {
    this.isMuted = muted;
    
    if (muted) {
      this.stopBGM();
    } else {
      this.playBGM();
    }
  }

  /**
   * 设置背景音乐音量
   * @param {number} volume - 音量 (0-1)
   */
  setBGMVolume(volume) {
    this.bgmVolume = Math.max(0, Math.min(1, volume));
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.bgmVolume;
    }
  }

  /**
   * 设置音效音量
   * @param {number} volume - 音量 (0-1)
   */
  setSFXVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    
    const audioContexts = [
      this.shootAudio,
      this.defenseAudio,
      this.explosionAudio,
      this.agentDeployAudio,
      this.threatAlertAudio,
      this.securityLevelAudio
    ];

    audioContexts.forEach(audio => {
      if (audio) {
        audio.volume = this.sfxVolume;
      }
    });
  }

  /**
   * 销毁音频资源
   */
  destroy() {
    const audioContexts = [
      this.bgmAudio,
      this.shootAudio,
      this.defenseAudio,
      this.explosionAudio,
      this.agentDeployAudio,
      this.threatAlertAudio,
      this.securityLevelAudio
    ];

    audioContexts.forEach(audio => {
      if (audio) {
        try {
          audio.destroy();
        } catch (error) {
          console.warn('销毁音频失败:', error);
        }
      }
    });
  }
}
