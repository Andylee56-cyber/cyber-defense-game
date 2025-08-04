import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';

/**
 * 游戏结束和成就系统
 * 处理游戏结束、成就解锁和知识普及页面访问
 */
export default class GameEnd {
  constructor() {
    this.isVisible = false;
    this.isGameOver = false;
    this.showPasswordInput = false;
    this.password = '';
    this.correctPassword = '123';
    this.passwordError = false;
    this.achievementUnlocked = false;
    this.achievementTitle = '';
    this.achievementDescription = '';
    
    // 成就配置
    this.achievements = {
      agentGuardian: {
        title: 'Agent卫士',
        description: '在游戏中表现出色，获得Agent卫士称号',
        condition: (stats) => stats.score >= 500,
        unlocked: false
      },
      knowledgeMaster: {
        title: '知识大师',
        description: '解锁所有网络安全知识内容',
        condition: (stats) => stats.unlockedKnowledge >= 4,
        unlocked: false
      },
      securityExpert: {
        title: '安全专家',
        description: '保持高安全等级完成游戏',
        condition: (stats) => stats.securityLevel >= 80,
        unlocked: false
      },
      comboKing: {
        title: '连击之王',
        description: '达到高连击数',
        condition: (stats) => stats.maxCombo >= 10,
        unlocked: false
      }
    };
  }

  /**
   * 显示游戏结束界面
   * @param {Object} gameStats - 游戏统计信息
   */
  showGameOver(gameStats) {
    this.isVisible = true;
    this.isGameOver = true;
    this.showPasswordInput = false;
    this.password = '';
    this.passwordError = false;
    
    // 检查成就
    this.checkAchievements(gameStats);
    
    console.log('🎮 游戏结束！');
  }

  /**
   * 检查成就解锁
   * @param {Object} gameStats - 游戏统计信息
   */
  checkAchievements(gameStats) {
    let unlockedCount = 0;
    
    Object.keys(this.achievements).forEach(key => {
      const achievement = this.achievements[key];
      if (!achievement.unlocked && achievement.condition(gameStats)) {
        achievement.unlocked = true;
        unlockedCount++;
        
        // 设置当前解锁的成就
        this.achievementUnlocked = true;
        this.achievementTitle = achievement.title;
        this.achievementDescription = achievement.description;
        
        console.log(`🏆 解锁成就: ${achievement.title}`);
      }
    });
    
    if (unlockedCount > 0) {
      console.log(`🎉 本次游戏解锁了 ${unlockedCount} 个成就！`);
    }
  }

  /**
   * 显示密码输入界面
   */
  showPasswordInput() {
    this.showPasswordInput = true;
    this.password = '';
    this.passwordError = false;
  }

  /**
   * 显示荣誉授予界面
   * @param {Object} honorData - 荣誉数据
   */
  showHonorAward(honorData) {
    this.isVisible = true;
    this.isGameOver = false;
    this.showPasswordInput = false;
    this.honorData = honorData;
    this.isFinalHonor = false;
    
    console.log('🎖️ 显示荣誉授予界面');
  }

  /**
   * 显示最终荣誉授予界面
   * @param {Object} honorData - 荣誉数据
   */
  showFinalHonorAward(honorData) {
    this.isVisible = true;
    this.isGameOver = false;
    this.showPasswordInput = false;
    this.honorData = honorData;
    this.isFinalHonor = true;
    
    console.log('🎖️ 显示最终荣誉授予界面');
  }

  /**
   * 隐藏界面
   */
  hide() {
    this.isVisible = false;
    this.isGameOver = false;
    this.showPasswordInput = false;
    this.password = '';
    this.passwordError = false;
    this.achievementUnlocked = false;
  }

  /**
   * 处理触摸事件
   * @param {number} x - 触摸X坐标
   * @param {number} y - 触摸Y坐标
   */
  handleTouch(x, y) {
    if (!this.isVisible) return;

    if (this.showPasswordInput) {
      this.handlePasswordInputTouch(x, y);
    } else if (this.honorData) {
      this.handleHonorAwardTouch(x, y);
    } else {
      this.handleGameOverTouch(x, y);
    }
  }

  /**
   * 处理游戏结束界面触摸
   */
  handleGameOverTouch(x, y) {
    const centerX = SCREEN_WIDTH / 2;
    const buttonY = SCREEN_HEIGHT / 2 + 100;
    const buttonWidth = 200;
    const buttonHeight = 50;

    // 重新开始按钮
    if (x >= centerX - buttonWidth/2 && x <= centerX + buttonWidth/2 &&
        y >= buttonY && y <= buttonY + buttonHeight) {
      this.hide();
      if (GameGlobal.main) {
        GameGlobal.main.start();
      }
    }

    // 知识普及按钮
    if (x >= centerX - buttonWidth/2 && x <= centerX + buttonWidth/2 &&
        y >= buttonY + 70 && y <= buttonY + 70 + buttonHeight) {
      this.showPasswordInput();
    }
  }

  /**
   * 处理荣誉授予界面触摸事件
   * @param {number} x - 触摸X坐标
   * @param {number} y - 触摸Y坐标
   */
  handleHonorAwardTouch(x, y) {
    const centerX = SCREEN_WIDTH / 2;
    const centerY = SCREEN_HEIGHT / 2;
    const panelWidth = 450;
    const panelHeight = 350;
    const panelX = centerX - panelWidth / 2;
    const panelY = centerY - panelHeight / 2;

    // 继续游戏按钮
    const buttonWidth = 200;
    const buttonHeight = 50;
    const buttonX = centerX - buttonWidth / 2;
    const buttonY = panelY + 250;

    // 重新开始游戏按钮（仅最终荣誉时显示）
    const restartButtonY = panelY + 310;

    if (x >= buttonX && x <= buttonX + buttonWidth &&
        y >= buttonY && y <= buttonY + buttonHeight) {
      console.log('▶️ 点击了继续游戏按钮');
      this.hide();
      
      // 恢复游戏
      if (GameGlobal.main) {
        GameGlobal.main.isPaused = false;
      }
      if (GameGlobal.gameInfo) {
        GameGlobal.gameInfo.emit('resumeGame');
      }
    }

    // 最终荣誉时显示重新开始按钮
    if (this.isFinalHonor && 
        x >= buttonX && x <= buttonX + buttonWidth &&
        y >= restartButtonY && y <= restartButtonY + buttonHeight) {
      console.log('🔄 点击了重新开始游戏按钮');
      this.hide();
      
      // 重新开始游戏
      if (GameGlobal.main) {
        GameGlobal.main.start();
      }
    }
  }

  /**
   * 处理密码输入界面触摸
   */
  handlePasswordInputTouch(x, y) {
    const centerX = SCREEN_WIDTH / 2;
    const buttonY = SCREEN_HEIGHT / 2 + 150;
    const buttonWidth = 200;
    const buttonHeight = 50;

    // 确认按钮
    if (x >= centerX - buttonWidth/2 && x <= centerX + buttonWidth/2 &&
        y >= buttonY && y <= buttonY + buttonHeight) {
      this.verifyPassword();
    }

    // 取消按钮
    if (x >= centerX - buttonWidth/2 && x <= centerX + buttonWidth/2 &&
        y >= buttonY + 70 && y <= buttonY + 70 + buttonHeight) {
      this.showPasswordInput = false;
      this.password = '';
      this.passwordError = false;
    }
  }

  /**
   * 验证密码
   */
  verifyPassword() {
    if (this.password === this.correctPassword) {
      console.log('✅ 密码正确，进入知识普及页面');
      this.hide();
      if (GameGlobal.knowledgePage) {
        GameGlobal.knowledgePage.show();
      }
    } else {
      this.passwordError = true;
      console.log('❌ 密码错误');
    }
  }

  /**
   * 处理键盘输入
   * @param {string} key - 按键
   */
  handleKeyInput(key) {
    if (!this.showPasswordInput) return;

    if (key === 'Enter') {
      this.verifyPassword();
    } else if (key === 'Backspace') {
      this.password = this.password.slice(0, -1);
    } else if (key.length === 1 && /[0-9]/.test(key)) {
      if (this.password.length < 10) {
        this.password += key;
      }
    }
  }

  /**
   * 更新状态
   */
  update() {
    // 成就解锁动画
    if (this.achievementUnlocked) {
      // 这里可以添加成就解锁动画效果
    }
  }

  /**
   * 渲染游戏结束界面
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   */
  render(ctx) {
    if (!this.isVisible) return;

    if (this.showPasswordInput) {
      this.renderPasswordInput(ctx);
    } else if (this.honorData) {
      if (this.isFinalHonor) {
        this.renderFinalHonorAward(ctx);
      } else {
        this.renderHonorAward(ctx);
      }
    } else {
      this.renderGameOver(ctx);
    }
  }

  /**
   * 渲染游戏结束界面
   */
  renderGameOver(ctx) {
    // 绘制背景遮罩
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    const centerX = SCREEN_WIDTH / 2;
    const centerY = SCREEN_HEIGHT / 2;

    // 绘制主面板
    const panelWidth = 400;
    const panelHeight = 300;
    const panelX = centerX - panelWidth / 2;
    const panelY = centerY - panelHeight / 2;

    // 面板背景
    const gradient = ctx.createLinearGradient(panelX, panelY, panelX, panelY + panelHeight);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
    gradient.addColorStop(1, 'rgba(0, 20, 40, 0.9)');
    ctx.fillStyle = gradient;
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);

    // 面板边框
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 3;
    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

    // 游戏结束标题
    ctx.fillStyle = '#e74c3c';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#e74c3c';
    ctx.shadowBlur = 10;
    ctx.fillText('游戏结束', centerX, panelY + 50);
    ctx.shadowBlur = 0;

    // 成就解锁提示
    if (this.achievementUnlocked) {
      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 20px Arial';
      ctx.fillText(`🏆 解锁成就: ${this.achievementTitle}`, centerX, panelY + 90);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.fillText(this.achievementDescription, centerX, panelY + 120);
    }

    // 按钮
    this.renderGameOverButtons(ctx, centerX, panelY + 180);

    ctx.restore();
  }

  /**
   * 渲染荣誉授予界面
   */
  renderHonorAward(ctx) {
    // 绘制背景遮罩
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    const centerX = SCREEN_WIDTH / 2;
    const centerY = SCREEN_HEIGHT / 2;

    // 绘制主面板
    const panelWidth = 450;
    const panelHeight = 350;
    const panelX = centerX - panelWidth / 2;
    const panelY = centerY - panelHeight / 2;

    // 面板背景 - 金色主题
    const gradient = ctx.createLinearGradient(panelX, panelY, panelX, panelY + panelHeight);
    gradient.addColorStop(0, 'rgba(255, 215, 0, 0.9)');
    gradient.addColorStop(1, 'rgba(255, 165, 0, 0.9)');
    ctx.fillStyle = gradient;
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);

    // 面板边框
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 4;
    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

    // 荣誉标题
    ctx.fillStyle = '#8b4513';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 15;
    ctx.fillText('🎖️ 荣誉授予', centerX, panelY + 60);
    ctx.shadowBlur = 0;

    // 荣誉类型
    ctx.fillStyle = '#8b4513';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(this.honorData.honorType, centerX, panelY + 100);

    // 荣誉描述
    ctx.fillStyle = '#8b4513';
    ctx.font = '16px Arial';
    ctx.fillText(this.honorData.honorDescription, centerX, panelY + 140);

    // 游戏统计
    ctx.fillStyle = '#8b4513';
    ctx.font = '14px Arial';
    ctx.fillText(`得分: ${this.honorData.score}`, centerX - 80, panelY + 180);
    ctx.fillText(`安全等级: ${this.honorData.securityLevel}%`, centerX + 80, panelY + 180);
    ctx.fillText(`知识点: ${this.honorData.knowledgePoints}`, centerX, panelY + 200);

    // 继续游戏按钮
    const buttonWidth = 200;
    const buttonHeight = 50;
    const buttonX = centerX - buttonWidth / 2;
    const buttonY = panelY + 250;

    const buttonGradient = ctx.createLinearGradient(buttonX, buttonY, buttonX, buttonY + buttonHeight);
    buttonGradient.addColorStop(0, '#27ae60');
    buttonGradient.addColorStop(1, '#2ecc71');
    
    ctx.fillStyle = buttonGradient;
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('继续游戏', centerX, buttonY + buttonHeight/2 + 7);

    ctx.restore();
  }

  /**
   * 渲染最终荣誉授予界面
   */
  renderFinalHonorAward(ctx) {
    // 绘制背景遮罩
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    const centerX = SCREEN_WIDTH / 2;
    const centerY = SCREEN_HEIGHT / 2;

    // 绘制主面板
    const panelWidth = 500;
    const panelHeight = 400;
    const panelX = centerX - panelWidth / 2;
    const panelY = centerY - panelHeight / 2;

    // 面板背景 - 特殊金色主题
    const gradient = ctx.createLinearGradient(panelX, panelY, panelX, panelY + panelHeight);
    gradient.addColorStop(0, 'rgba(255, 215, 0, 0.95)');
    gradient.addColorStop(0.5, 'rgba(255, 165, 0, 0.95)');
    gradient.addColorStop(1, 'rgba(255, 140, 0, 0.95)');
    ctx.fillStyle = gradient;
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);

    // 面板边框 - 更粗的金色边框
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 6;
    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

    // 最终荣誉标题
    ctx.fillStyle = '#8b4513';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 20;
    ctx.fillText('🏆 最终荣誉授予', centerX, panelY + 70);
    ctx.shadowBlur = 0;

    // 荣誉类型
    ctx.fillStyle = '#8b4513';
    ctx.font = 'bold 28px Arial';
    ctx.fillText(this.honorData.honorType, centerX, panelY + 120);

    // 荣誉描述
    ctx.fillStyle = '#8b4513';
    ctx.font = '18px Arial';
    ctx.fillText(this.honorData.honorDescription, centerX, panelY + 170);

    // 游戏统计
    ctx.fillStyle = '#8b4513';
    ctx.font = '16px Arial';
    ctx.fillText(`最终得分: ${this.honorData.score}`, centerX - 100, panelY + 210);
    ctx.fillText(`安全等级: ${this.honorData.securityLevel}%`, centerX + 100, panelY + 210);
    ctx.fillText(`知识点: ${this.honorData.knowledgePoints}`, centerX, panelY + 240);

    // 继续游戏按钮
    const buttonWidth = 200;
    const buttonHeight = 50;
    const buttonX = centerX - buttonWidth / 2;
    const buttonY = panelY + 280;

    const buttonGradient = ctx.createLinearGradient(buttonX, buttonY, buttonX, buttonY + buttonHeight);
    buttonGradient.addColorStop(0, '#27ae60');
    buttonGradient.addColorStop(1, '#2ecc71');
    
    ctx.fillStyle = buttonGradient;
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('继续游戏', centerX, buttonY + buttonHeight/2 + 7);

    // 重新开始游戏按钮
    const restartButtonY = panelY + 340;
    
    const restartGradient = ctx.createLinearGradient(buttonX, restartButtonY, buttonX, restartButtonY + buttonHeight);
    restartGradient.addColorStop(0, '#e74c3c');
    restartGradient.addColorStop(1, '#c0392b');
    
    ctx.fillStyle = restartGradient;
    ctx.fillRect(buttonX, restartButtonY, buttonWidth, buttonHeight);
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(buttonX, restartButtonY, buttonWidth, buttonHeight);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('重新开始', centerX, restartButtonY + buttonHeight/2 + 7);

    ctx.restore();
  }

  /**
   * 渲染游戏结束按钮
   */
  renderGameOverButtons(ctx, centerX, buttonY) {
    const buttonWidth = 200;
    const buttonHeight = 50;
    const buttonSpacing = 20;

    // 重新开始按钮
    const restartGradient = ctx.createLinearGradient(centerX - buttonWidth/2, buttonY, centerX + buttonWidth/2, buttonY);
    restartGradient.addColorStop(0, '#27ae60');
    restartGradient.addColorStop(1, '#2ecc71');
    
    ctx.fillStyle = restartGradient;
    ctx.fillRect(centerX - buttonWidth/2, buttonY, buttonWidth, buttonHeight);
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(centerX - buttonWidth/2, buttonY, buttonWidth, buttonHeight);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('重新开始', centerX, buttonY + buttonHeight/2 + 7);

    // 知识普及按钮
    const knowledgeGradient = ctx.createLinearGradient(centerX - buttonWidth/2, buttonY + buttonHeight + buttonSpacing, centerX + buttonWidth/2, buttonY + buttonHeight + buttonSpacing);
    knowledgeGradient.addColorStop(0, '#ffd700');
    knowledgeGradient.addColorStop(1, '#ffed4e');
    
    ctx.fillStyle = knowledgeGradient;
    ctx.fillRect(centerX - buttonWidth/2, buttonY + buttonHeight + buttonSpacing, buttonWidth, buttonHeight);
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(centerX - buttonWidth/2, buttonY + buttonHeight + buttonSpacing, buttonWidth, buttonHeight);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('📚 知识普及', centerX, buttonY + buttonHeight + buttonSpacing + buttonHeight/2 + 7);
  }

  /**
   * 渲染密码输入界面
   */
  renderPasswordInput(ctx) {
    // 绘制背景遮罩
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    const centerX = SCREEN_WIDTH / 2;
    const centerY = SCREEN_HEIGHT / 2;

    // 绘制主面板
    const panelWidth = 350;
    const panelHeight = 200;
    const panelX = centerX - panelWidth / 2;
    const panelY = centerY - panelHeight / 2;

    // 面板背景
    const gradient = ctx.createLinearGradient(panelX, panelY, panelX, panelY + panelHeight);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
    gradient.addColorStop(1, 'rgba(0, 20, 40, 0.9)');
    ctx.fillStyle = gradient;
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);

    // 面板边框
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 3;
    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

    // 标题
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 5;
    ctx.fillText('🔐 访问验证', centerX, panelY + 40);
    ctx.shadowBlur = 0;

    // 提示文字
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.fillText('请输入访问密码:', centerX, panelY + 80);

    // 密码输入框
    const inputWidth = 200;
    const inputHeight = 40;
    const inputX = centerX - inputWidth / 2;
    const inputY = panelY + 100;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(inputX, inputY, inputWidth, inputHeight);
    
    ctx.strokeStyle = this.passwordError ? '#ff0000' : '#ffd700';
    ctx.lineWidth = 2;
    ctx.strokeRect(inputX, inputY, inputWidth, inputHeight);

    // 密码显示
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    const displayPassword = '*'.repeat(this.password.length);
    ctx.fillText(displayPassword, centerX, inputY + inputHeight/2 + 7);

    // 错误提示
    if (this.passwordError) {
      ctx.fillStyle = '#ff0000';
      ctx.font = '14px Arial';
      ctx.fillText('密码错误，请重试', centerX, inputY + inputHeight + 20);
    }

    // 按钮
    this.renderPasswordButtons(ctx, centerX, panelY + 170);

    ctx.restore();
  }

  /**
   * 渲染密码输入按钮
   */
  renderPasswordButtons(ctx, centerX, buttonY) {
    const buttonWidth = 120;
    const buttonHeight = 40;
    const buttonSpacing = 20;

    // 确认按钮
    const confirmGradient = ctx.createLinearGradient(centerX - buttonWidth - buttonSpacing/2, buttonY, centerX - buttonSpacing/2, buttonY);
    confirmGradient.addColorStop(0, '#27ae60');
    confirmGradient.addColorStop(1, '#2ecc71');
    
    ctx.fillStyle = confirmGradient;
    ctx.fillRect(centerX - buttonWidth - buttonSpacing/2, buttonY, buttonWidth, buttonHeight);
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(centerX - buttonWidth - buttonSpacing/2, buttonY, buttonWidth, buttonHeight);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('确认', centerX - buttonSpacing/2, buttonY + buttonHeight/2 + 5);

    // 取消按钮
    const cancelGradient = ctx.createLinearGradient(centerX + buttonSpacing/2, buttonY, centerX + buttonWidth + buttonSpacing/2, buttonY);
    cancelGradient.addColorStop(0, '#e74c3c');
    cancelGradient.addColorStop(1, '#c0392b');
    
    ctx.fillStyle = cancelGradient;
    ctx.fillRect(centerX + buttonSpacing/2, buttonY, buttonWidth, buttonHeight);
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(centerX + buttonSpacing/2, buttonY, buttonWidth, buttonHeight);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('取消', centerX + buttonWidth/2 + buttonSpacing, buttonY + buttonHeight/2 + 5);
  }
} 