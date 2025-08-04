import DataBus from '../databus';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';

/**
 * 游戏信息显示类
 * 负责显示分数、安全等级、知识点数、Agent信息等
 */
export default class GameInfo {
  constructor() {
    this.score = 0; // 分数
    this.securityLevel = 100; // 安全等级
    this.knowledgePoints = 0; // 知识点数
    this.energy = 300; // 能量值，与DataBus同步
    this.maxEnergy = 300; // 最大能量值
    this.currentLevel = 1; // 当前关卡
    this.isGameOver = false; // 游戏是否结束
    this.isPaused = false; // 游戏是否暂停

    // 事件监听器
    this.listeners = {};

    // UI动画参数
    this.time = 0;
    this.pulseSpeed = 0.05;
    this.glowIntensity = 0.5;

    // 按钮状态
    this.buttonStates = {
      firewall: false,
      encryption: false,
      detection: false,
      education: false
    };

    // 知识普及按钮
    this.showKnowledgeButton = false;
    this.knowledgeButtonPulse = 0;

    // 初始化
    this.init();
  }

  init() {
    this.score = 0;
    this.securityLevel = 100;
    this.knowledgePoints = 0;
    this.energy = 300; // 初始能量值
    this.maxEnergy = 300; // 最大能量值
    this.currentLevel = 1;
    this.isGameOver = false;
    this.isPaused = false;
    this.time = 0;
    this.showKnowledgeButton = false;
    this.knowledgeButtonPulse = 0;
  }

  /**
   * 添加事件监听器
   * @param {string} event - 事件名称
   * @param {Function} callback - 回调函数
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  /**
   * 触发事件
   * @param {string} event - 事件名称
   * @param {*} data - 事件数据
   */
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  /**
   * 渲染游戏信息
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   */
  render(ctx) {
    this.updateGameInfo();
    this.time += 0.016; // 更新时间

    // 绘制顶部信息栏
    this.renderTopBar(ctx);
    
    // 绘制侧边信息栏
    this.renderSideBar(ctx);

    // 绘制底部控制栏
    this.renderBottomBar(ctx);

    // 绘制知识普及按钮
    this.renderKnowledgeButton(ctx);

    // 如果游戏结束，绘制结算界面
    if (this.isGameOver) {
      this.renderGameOver(ctx);
    }

    // 如果游戏暂停，绘制暂停界面
    if (this.isPaused) {
      this.renderPauseOverlay(ctx);
    }
  }

  /**
   * 更新游戏信息
   */
  updateGameInfo() {
    if (GameGlobal.databus) {
      this.score = GameGlobal.databus.score;
      this.securityLevel = GameGlobal.databus.securityLevel;
      this.knowledgePoints = GameGlobal.databus.knowledgePoints;
      this.energy = GameGlobal.databus.energy;
      this.maxEnergy = GameGlobal.databus.maxEnergy;
      this.currentLevel = GameGlobal.databus.currentLevel;
      this.isGameOver = GameGlobal.databus.isGameOver;

      // 检查是否有新的知识点记录，如果有则显示知识库按钮
      if (GameGlobal.databus.knowledgeRecords && GameGlobal.databus.knowledgeRecords.length > 0) {
        this.showKnowledgeButton = true;
      } else {
        this.showKnowledgeButton = this.knowledgePoints > 0;
      }
      
      if (this.showKnowledgeButton) {
        this.knowledgeButtonPulse = 0.5 + 0.3 * Math.sin(this.time * 3);
      }
    }
  }

  /**
   * 渲染顶部信息栏
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   */
  renderTopBar(ctx) {
    const barHeight = 80; // 增加顶部栏高度从60到80
    
    // 绘制顶部信息栏背景
    const gradient = ctx.createLinearGradient(0, 0, SCREEN_WIDTH, 0);
    gradient.addColorStop(0, 'rgba(0, 20, 40, 0.9)');
    gradient.addColorStop(1, 'rgba(0, 40, 80, 0.8)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, SCREEN_WIDTH, barHeight);

    // 绘制发光边框
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, SCREEN_WIDTH, barHeight);

    // 绘制左侧信息 - 调整Y坐标，增加间距
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`分数: ${this.score}`, 20, 30);
    ctx.fillText(`知识点: ${this.knowledgePoints}`, 20, 50);

    // 绘制中间信息 - 调整Y坐标
    const securityColor = this.securityLevel > 70 ? '#00ff00' : 
                         this.securityLevel > 30 ? '#ffff00' : '#ff0000';
    ctx.fillStyle = securityColor;
    ctx.fillText(`安全等级: ${this.securityLevel}%`, 150, 30);

    // 绘制右侧信息 - 调整位置避免被遮挡，增加间距
    ctx.fillStyle = '#ff6b6b';
    ctx.fillText(`错误: ${GameGlobal.databus ? GameGlobal.databus.getWrongAnswerCount() : 0}`, 280, 30);
    ctx.fillStyle = '#00ff00';
    ctx.fillText(`正确: ${GameGlobal.databus ? GameGlobal.databus.getCorrectAnswerCount() : 0}`, 380, 30);

    // 绘制右侧按钮区域
    this.renderTopButtons(ctx);
  }

  renderTopButtons(ctx) {
    const buttonWidth = 70;
    const buttonHeight = 30; // 增加按钮高度从25到30
    const buttonSpacing = 8;
    const startX = SCREEN_WIDTH - (buttonWidth + buttonSpacing) * 4 - 10;
    const buttonY = 25; // 调整按钮Y坐标，增加间距

    // 防御介绍按钮
    const defenseButtons = [
      { text: '🛡️', type: 'firewall', color: '#ff6b6b', name: '防火墙' },
      { text: '🔐', type: 'encryption', color: '#4ecdc4', name: '加密师' },
      { text: '🔍', type: 'detection', color: '#45b7d1', name: '检测者' },
      { text: '📚', type: 'education', color: '#96ceb4', name: '教育官' }
    ];

    defenseButtons.forEach((button, index) => {
      const x = startX + index * (buttonWidth + buttonSpacing);

      // 绘制按钮背景
      const buttonGradient = ctx.createLinearGradient(x, buttonY, x + buttonWidth, buttonY + buttonHeight);
      buttonGradient.addColorStop(0, button.color);
      buttonGradient.addColorStop(1, this.darkenColor(button.color, 0.3));
      ctx.fillStyle = buttonGradient;
      ctx.fillRect(x, buttonY, buttonWidth, buttonHeight);

      // 绘制发光边框
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, buttonY, buttonWidth, buttonHeight);

      // 绘制按钮图标和文字 - 调整文字位置
      ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(button.text, x + buttonWidth / 2, buttonY + 18);
      ctx.font = '10px Arial';
      ctx.fillText(button.name, x + buttonWidth / 2, buttonY + 28);
    });
  }

  /**
   * 渲染侧边信息栏
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   */
  renderSideBar(ctx) {
    ctx.save();

    const sidebarWidth = 200;
    const sidebarX = SCREEN_WIDTH - sidebarWidth;

    // 绘制背景 - 科幻亮色面板
    const gradient = ctx.createLinearGradient(sidebarX, 0, sidebarX + sidebarWidth, 0);
    gradient.addColorStop(0, 'rgba(0, 255, 255, 0.15)'); // 科幻青色半透明
    gradient.addColorStop(0.5, 'rgba(0, 128, 255, 0.2)'); // 科幻蓝色半透明
    gradient.addColorStop(1, 'rgba(0, 64, 255, 0.25)'); // 科幻深蓝半透明
    ctx.fillStyle = gradient;
    ctx.fillRect(sidebarX, 80, sidebarWidth, SCREEN_HEIGHT - 160);

    // 绘制发光边框
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 8;
    ctx.strokeRect(sidebarX, 80, sidebarWidth, SCREEN_HEIGHT - 160);

    // 绘制装饰性网格
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    for (let y = 90; y < SCREEN_HEIGHT - 170; y += 20) {
      ctx.beginPath();
      ctx.moveTo(sidebarX + 10, y);
      ctx.lineTo(sidebarX + sidebarWidth - 10, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // 绘制标题 - 科幻亮色
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 5;
    ctx.fillText('已部署的Agent', sidebarX + sidebarWidth/2, 105);
    ctx.shadowBlur = 0;

    // 绘制当前选择的Agent信息
    const selectedAgentType = GameGlobal.commander ? GameGlobal.commander.selectedAgentType : 'firewall';
    const agentConfig = this.getSelectedAgentConfig(selectedAgentType);
    
    if (agentConfig) {
      const y = 130;
      
      // 绘制Agent容器 - 科幻亮色
      const containerGradient = ctx.createLinearGradient(sidebarX + 10, y, sidebarX + sidebarWidth - 10, y + 50);
      containerGradient.addColorStop(0, 'rgba(0, 255, 255, 0.2)');
      containerGradient.addColorStop(1, 'rgba(0, 128, 255, 0.3)');
      ctx.fillStyle = containerGradient;
      ctx.fillRect(sidebarX + 10, y, sidebarWidth - 20, 50);

      // 绘制Agent图标 - 科幻圆圈
      const iconX = sidebarX + 35;
      const iconY = y + 25;
      const iconSize = 20;
      
      // 创建径向渐变
      const iconGradient = ctx.createRadialGradient(iconX, iconY, 0, iconX, iconY, iconSize);
      iconGradient.addColorStop(0, this.getAgentColor(selectedAgentType));
      iconGradient.addColorStop(0.7, this.darkenColor(this.getAgentColor(selectedAgentType), 0.3));
      iconGradient.addColorStop(1, this.darkenColor(this.getAgentColor(selectedAgentType), 0.6));
      
      ctx.fillStyle = iconGradient;
      ctx.shadowColor = this.getAgentColor(selectedAgentType);
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(iconX, iconY, iconSize, 0, Math.PI * 2);
      ctx.fill();
      
      // 绘制发光边框
      ctx.strokeStyle = this.getAgentColor(selectedAgentType);
      ctx.lineWidth = 2;
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(iconX, iconY, iconSize, 0, Math.PI * 2);
      ctx.stroke();

      // 绘制Agent名称 - 科幻亮色
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 3;
      ctx.fillText(agentConfig.name, sidebarX + 65, y + 25);

      // 绘制Agent属性 - 科幻亮色
      ctx.fillStyle = '#e0e0e0';
      ctx.font = '12px Arial';
      ctx.shadowBlur = 0;
      ctx.fillText(`防御力: ${agentConfig.defensePower}`, sidebarX + 65, y + 40);
      ctx.fillText(`射程: ${agentConfig.range}`, sidebarX + 65, y + 52);
      
      // 绘制状态指示器 - 科幻亮色
      const statusGradient = ctx.createLinearGradient(sidebarX + 15, y + 5, sidebarX + 55, y + 5);
      statusGradient.addColorStop(0, '#00ff00');
      statusGradient.addColorStop(1, '#00cc00');
      ctx.fillStyle = statusGradient;
      ctx.fillRect(sidebarX + 15, y + 5, 40, 4);
    }

    ctx.restore();
  }

  /**
   * 渲染底部控制栏
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   */
  renderBottomBar(ctx) {
    ctx.save();

    const barHeight = 100; // 增加底部栏高度从80到100
    const barY = SCREEN_HEIGHT - barHeight;

    // 绘制背景 - 科技感面板
    const gradient = ctx.createLinearGradient(0, barY, 0, SCREEN_HEIGHT);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, barY, SCREEN_WIDTH, barHeight);

    // 绘制Agent选择按钮
    const buttonWidth = 80;
    const buttonHeight = 45; // 增加按钮高度从40到45
    const buttonSpacing = 20;
    const startX = 20;

    const agentTypes = [
      { type: 'firewall', name: '防火墙', color: '#ff6b6b', key: 'firewall' },
      { type: 'encryption', name: '加密师', color: '#4ecdc4', key: 'encryption' },
      { type: 'detection', name: '检测者', color: '#45b7d1', key: 'detection' },
      { type: 'education', name: '教育官', color: '#96ceb4', key: 'education' }
    ];

    agentTypes.forEach((agent, index) => {
      const x = startX + index * (buttonWidth + buttonSpacing);
      const y = barY + 25; // 调整按钮Y坐标，增加间距
      const isSelected = this.buttonStates[agent.key];

      // 绘制按钮背景 - 科技感
      const buttonGradient = ctx.createLinearGradient(x, y, x, y + buttonHeight);
      if (isSelected) {
        buttonGradient.addColorStop(0, agent.color);
        buttonGradient.addColorStop(1, this.darkenColor(agent.color, 0.3));
        // 绘制选中光效
        ctx.shadowColor = agent.color;
        ctx.shadowBlur = 10;
      } else {
        buttonGradient.addColorStop(0, this.darkenColor(agent.color, 0.3));
        buttonGradient.addColorStop(1, this.darkenColor(agent.color, 0.6));
      }
      
      ctx.fillStyle = buttonGradient;
      ctx.fillRect(x, y, buttonWidth, buttonHeight);
      ctx.shadowBlur = 0;

      // 绘制按钮边框
      ctx.strokeStyle = agent.color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.8;
      ctx.strokeRect(x, y, buttonWidth, buttonHeight);
      ctx.globalAlpha = 1;

      // 绘制按钮文字
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(agent.name, x + buttonWidth/2, y + buttonHeight/2 + 4);
    });

    // 绘制能量条 - 科技感
    const energyBarWidth = 200;
    const energyBarHeight = 25; // 增加能量条高度从20到25
    const energyBarX = startX + 4 * (buttonWidth + buttonSpacing) + 40;
    const energyBarY = barY + 30; // 调整能量条Y坐标，增加间距

    // 能量条背景
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(energyBarX, energyBarY, energyBarWidth, energyBarHeight);
    
    // 能量条填充
    const energyPercentage = this.energy / this.maxEnergy;
    const energyColor = energyPercentage > 0.5 ? '#27ae60' : 
                       energyPercentage > 0.25 ? '#f39c12' : '#e74c3c';
    
    const energyGradient = ctx.createLinearGradient(energyBarX, energyBarY, energyBarX + energyBarWidth, energyBarY);
    energyGradient.addColorStop(0, energyColor);
    energyGradient.addColorStop(1, this.darkenColor(energyColor, 0.3));
    
    ctx.fillStyle = energyGradient;
    ctx.fillRect(energyBarX, energyBarY, energyBarWidth * energyPercentage, energyBarHeight);

    // 能量条边框
    ctx.strokeStyle = energyColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(energyBarX, energyBarY, energyBarWidth, energyBarHeight);

    // 绘制能量文字
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = energyColor;
    ctx.shadowBlur = 3;
    ctx.fillText(`能量: ${Math.floor(this.energy)}/${this.maxEnergy}`, energyBarX + energyBarWidth/2, energyBarY + 18); // 调整文字位置
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  /**
   * 渲染知识普及按钮
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   */
  renderKnowledgeButton(ctx) {
    // 始终显示知识库按钮
    ctx.save();

    const buttonWidth = 120;
    const buttonHeight = 40;
    const x = SCREEN_WIDTH - buttonWidth - 20;
    const y = 90; // 调整知识库按钮Y坐标，避免与顶部栏重叠

    // 绘制按钮背景 - 科幻亮色效果
    const buttonGradient = ctx.createLinearGradient(x, y, x, y + buttonHeight);
    buttonGradient.addColorStop(0, 'rgba(0, 255, 255, 0.8)'); // 科幻青色
    buttonGradient.addColorStop(0.5, 'rgba(0, 128, 255, 0.9)'); // 科幻蓝色
    buttonGradient.addColorStop(1, 'rgba(0, 64, 255, 0.8)'); // 科幻深蓝
    
    ctx.fillStyle = buttonGradient;
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 15;
    ctx.fillRect(x, y, buttonWidth, buttonHeight);
    ctx.shadowBlur = 0;

    // 绘制发光边框
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 8;
    ctx.strokeRect(x, y, buttonWidth, buttonHeight);

    // 绘制动态光点效果
    const time = Date.now() * 0.005;
    const pulseAlpha = 0.6 + Math.sin(time) * 0.2;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.globalAlpha = pulseAlpha;
    ctx.strokeRect(x + 2, y + 2, buttonWidth - 4, buttonHeight - 4);
    ctx.globalAlpha = 1;

    // 绘制文字 - 科幻亮色
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 5;
    ctx.fillText('📚 知识库', x + buttonWidth/2, y + buttonHeight/2 + 5);
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  /**
   * 渲染游戏结束界面
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   */
  renderGameOver(ctx) {
    ctx.save();

    // 绘制半透明背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // 绘制游戏结束标题 - 科技感
    ctx.fillStyle = '#e74c3c';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#e74c3c';
    ctx.shadowBlur = 10;
    ctx.fillText('游戏结束', SCREEN_WIDTH/2, SCREEN_HEIGHT/2 - 100);
    ctx.shadowBlur = 0;

    // 绘制最终分数
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.fillText(`最终分数: ${this.score}`, SCREEN_WIDTH/2, SCREEN_HEIGHT/2 - 50);

    // 绘制安全等级
    ctx.fillText(`安全等级: ${this.securityLevel}%`, SCREEN_WIDTH/2, SCREEN_HEIGHT/2 - 20);

    // 绘制知识点数
    ctx.fillText(`获得知识点: ${this.knowledgePoints}`, SCREEN_WIDTH/2, SCREEN_HEIGHT/2 + 10);

    // 绘制重新开始按钮 - 科技感
    const buttonWidth = 200;
    const buttonHeight = 50;
    const buttonX = SCREEN_WIDTH/2 - buttonWidth/2;
    const buttonY = SCREEN_HEIGHT/2 + 50;

    const buttonGradient = ctx.createLinearGradient(buttonX, buttonY, buttonX, buttonY + buttonHeight);
    buttonGradient.addColorStop(0, '#27ae60');
    buttonGradient.addColorStop(1, '#2ecc71');
    
    ctx.fillStyle = buttonGradient;
    ctx.shadowColor = '#27ae60';
    ctx.shadowBlur = 10;
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
    ctx.shadowBlur = 0;

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial';
    ctx.fillText('重新开始', SCREEN_WIDTH/2, buttonY + buttonHeight/2 + 7);

    ctx.restore();
  }

  /**
   * 绘制装饰线条
   */
  drawDecorativeLines(ctx, x, y) {
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    
    // 绘制水平装饰线
    for (let i = 0; i < 5; i++) {
      const lineY = y + i * 10;
      ctx.beginPath();
      ctx.moveTo(x, lineY);
      ctx.lineTo(x + 50, lineY);
      ctx.stroke();
    }
    
    ctx.globalAlpha = 1;
  }

  /**
   * 获取Agent颜色
   * @param {string} agentType - Agent类型
   * @returns {string} 颜色值
   */
  getAgentColor(agentType) {
    switch (agentType) {
      case 'firewall':
        return '#ff6b6b';
      case 'encryption':
        return '#4ecdc4';
      case 'detection':
        return '#45b7d1';
      case 'education':
        return '#96ceb4';
      default:
        return '#feca57';
    }
  }

  /**
   * 加深颜色
   * @param {string} color - 原始颜色
   * @param {number} factor - 加深因子
   * @returns {string} 加深后的颜色
   */
  darkenColor(color, factor) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    const newR = Math.floor(r * (1 - factor));
    const newG = Math.floor(g * (1 - factor));
    const newB = Math.floor(b * (1 - factor));
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }

  /**
   * 处理触摸事件
   * @param {number} x - 触摸X坐标
   * @param {number} y - 触摸Y坐标
   */
  handleTouch(x, y) {
    // 如果游戏暂停，检查暂停界面的点击
    if (this.isPaused) {
      // 检查继续游戏按钮
      const boxWidth = 300;
      const boxHeight = 200;
      const boxX = (SCREEN_WIDTH - boxWidth) / 2;
      const boxY = (SCREEN_HEIGHT - boxHeight) / 2;
      
      const closeButtonWidth = 120;
      const closeButtonHeight = 40;
      const closeButtonX = (SCREEN_WIDTH - closeButtonWidth) / 2;
      const closeButtonY = boxY + 130;

      if (x >= closeButtonX && x <= closeButtonX + closeButtonWidth &&
          y >= closeButtonY && y <= closeButtonY + closeButtonHeight) {
        console.log('▶️ 点击了继续游戏按钮');
        this.isPaused = false;
        this.emit('resumeGame');
        return;
      }

      // 点击暂停界面的任意位置都可以继续游戏
      if (x >= boxX && x <= boxX + boxWidth &&
          y >= boxY && y <= boxY + boxHeight) {
        console.log('▶️ 点击了暂停界面，继续游戏');
        this.isPaused = false;
        this.emit('resumeGame');
        return;
      }
    }

    // 检查游戏结束界面的重新开始按钮
    if (this.isGameOver) {
      const buttonWidth = 200;
      const buttonHeight = 50;
      const buttonX = SCREEN_WIDTH/2 - buttonWidth/2;
      const buttonY = SCREEN_HEIGHT/2 + 50;

      if (x >= buttonX && x <= buttonX + buttonWidth &&
          y >= buttonY && y <= buttonY + buttonHeight) {
        console.log('🔄 点击了重新开始按钮');
        this.emit('restart');
        return;
      }
    }

    // 检查知识库按钮 - 始终可点击
    const knowledgeButtonWidth = 120;
    const knowledgeButtonHeight = 40;
    const knowledgeButtonX = SCREEN_WIDTH - knowledgeButtonWidth - 20;
    const knowledgeButtonY = 90; // 更新Y坐标以匹配新的渲染位置

    if (x >= knowledgeButtonX && x <= knowledgeButtonX + knowledgeButtonWidth &&
        y >= knowledgeButtonY && y <= knowledgeButtonY + knowledgeButtonHeight) {
      console.log('📚 点击了知识库按钮');
      this.showKnowledgeBase();
      return;
    }

    // 检查顶部按钮区域
    if (y >= 0 && y <= 80) { // 更新检查区域以匹配新的顶部栏高度
      const buttonWidth = 70;
      const buttonHeight = 30; // 更新按钮高度以匹配新的渲染
      const buttonSpacing = 8;
      const startX = SCREEN_WIDTH - (buttonWidth + buttonSpacing) * 4 - 20;
      const buttonY = 25; // 更新按钮Y坐标以匹配新的渲染位置

      // 检查防御介绍按钮
      const defenseButtons = [
        { type: 'firewall' },
        { type: 'encryption' },
        { type: 'detection' },
        { type: 'education' }
      ];

      defenseButtons.forEach((button, index) => {
        const buttonX = startX + index * (buttonWidth + buttonSpacing);

        if (x >= buttonX && x <= buttonX + buttonWidth &&
            y >= buttonY && y <= buttonY + buttonHeight) {
          // 显示防御介绍信息
          this.showDefenseInfo(button.type);
          // 触发防御介绍事件
          this.emit('showDefenseIntro', button.type);
          // 暂停游戏
          this.isPaused = true;
          this.emit('pauseGame');
          console.log(`🔍 点击了 ${button.type} 防御介绍按钮，游戏已暂停`);
          return;
        }
      });
    }

    // 检查底部Agent选择按钮
    const barHeight = 100; // 更新底部栏高度以匹配新的渲染
    const barY = SCREEN_HEIGHT - barHeight;

    if (y >= barY + 20 && y <= barY + 60) {
      const buttonWidth = 80;
      const buttonSpacing = 20;
      const startX = 20;
      const agentTypes = ['firewall', 'encryption', 'detection', 'education'];

      agentTypes.forEach((agentType, index) => {
        const buttonX = startX + index * (buttonWidth + buttonSpacing);
        const buttonY = barY + 20;
        if (x >= buttonX && x <= buttonX + buttonWidth && y >= buttonY && y <= buttonY + 40) {
          const currentTime = Date.now();
          if (!this.lastClickTime || currentTime - this.lastClickTime > 500) {
            // 单击 - 切换按钮状态
            this.buttonStates[agentType] = !this.buttonStates[agentType];
            if (this.buttonStates[agentType]) {
              this.emit('agentSelected', agentType);
            } else {
              this.emit('agentDeselected', agentType);
            }
            this.lastClickTime = currentTime;
          }
        }
      });
    }
  }

  /**
   * 渲染暂停界面
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   */
  renderPauseOverlay(ctx) {
    // 半透明背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // 暂停提示框
    const boxWidth = 300;
    const boxHeight = 200;
    const boxX = (SCREEN_WIDTH - boxWidth) / 2;
    const boxY = (SCREEN_HEIGHT - boxHeight) / 2;

    // 绘制提示框背景
    ctx.fillStyle = 'rgba(0, 20, 40, 0.95)';
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    // 使用兼容的圆角矩形绘制方法
    this.drawRoundedRect(ctx, boxX, boxY, boxWidth, boxHeight, 10);
    ctx.fill();
    ctx.stroke();

    // 绘制标题
    ctx.fillStyle = '#00ffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('游戏已暂停', SCREEN_WIDTH / 2, boxY + 50);

    // 绘制提示文字
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.fillText('点击任意位置继续游戏', SCREEN_WIDTH / 2, boxY + 100);

    // 绘制关闭按钮
    const closeButtonWidth = 120;
    const closeButtonHeight = 40;
    const closeButtonX = (SCREEN_WIDTH - closeButtonWidth) / 2;
    const closeButtonY = boxY + 130;

    // 按钮背景
    ctx.fillStyle = '#27ae60';
    ctx.beginPath();
    // 使用兼容的圆角矩形绘制方法
    this.drawRoundedRect(ctx, closeButtonX, closeButtonY, closeButtonWidth, closeButtonHeight, 5);
    ctx.fill();

    // 按钮文字
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('继续游戏', SCREEN_WIDTH / 2, closeButtonY + 25);
  }

  /**
   * 绘制圆角矩形的兼容方法
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   * @param {number} x - x坐标
   * @param {number} y - y坐标
   * @param {number} width - 宽度
   * @param {number} height - 高度
   * @param {number} radius - 圆角半径
   */
  drawRoundedRect(ctx, x, y, width, height, radius) {
    // 如果浏览器支持roundRect，使用原生方法
    if (ctx.roundRect) {
      try {
        ctx.roundRect(x, y, width, height, radius);
        return;
      } catch (e) {
        // 如果roundRect失败，使用手动绘制
        console.log('⚠️ roundRect方法不可用，使用手动绘制圆角矩形');
      }
    }

    // 手动绘制圆角矩形
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  showDefenseInfo(defenseType) {
    const defenseInfo = {
      firewall: {
        name: '防火墙守护者',
        description: '网络安全的第一道防线，阻止未授权访问和恶意流量',
        effectiveness: '钓鱼攻击、网络入侵',
        weakness: '内部威胁、加密攻击'
      },
      encryption: {
        name: '数据加密师',
        description: '数据安全的守护神，加密存储和传输敏感数据',
        effectiveness: 'DDoS攻击、数据泄露',
        weakness: '密钥管理、量子计算'
      },
      detection: {
        name: '威胁检测者',
        description: '智能威胁识别专家，实时监控和分析安全威胁',
        effectiveness: '恶意软件、病毒攻击',
        weakness: '零日攻击、高级持续性威胁'
      },
      education: {
        name: '安全教育官',
        description: '网络安全意识传播者，提升用户安全意识和技能',
        effectiveness: '数据泄露、人为错误',
        weakness: '技术性攻击、自动化威胁'
      }
    };

    const info = defenseInfo[defenseType];
    if (info) {
      console.log(`📖 ${info.name}`);
      console.log(`📝 ${info.description}`);
      console.log(`✅ 有效防御: ${info.effectiveness}`);
      console.log(`❌ 弱点: ${info.weakness}`);
    }
  }

  /**
   * 获取选中Agent的配置
   * @param {string} agentType - Agent类型
   * @returns {Object} Agent配置
   */
  getSelectedAgentConfig(agentType) {
    const configs = {
      firewall: {
        name: '防火墙守护者',
        defensePower: 15,
        range: 120,
        specialAbility: 'firewall_boost'
      },
      encryption: {
        name: '数据加密师',
        defensePower: 12,
        range: 100,
        specialAbility: 'encryption_field'
      },
      detection: {
        name: '威胁检测者',
        defensePower: 10,
        range: 150,
        specialAbility: 'threat_scan'
      },
      education: {
        name: '安全教育官',
        defensePower: 8,
        range: 80,
        specialAbility: 'knowledge_share'
      }
    };
    
    return configs[agentType] || configs.firewall;
  }

  /**
   * 显示Agent选择提示
   * @param {string} agentType - Agent类型
   */
  showAgentSelectionMessage(agentType) {
    console.log(`🎯 已选择 ${agentType} Agent`);
    
    // 显示选择提示
    const agentNames = {
      firewall: '防火墙守护者',
      encryption: '数据加密师',
      detection: '威胁检测者',
      education: '安全教育官'
    };
    
    const agentName = agentNames[agentType] || agentType;
    console.log(`✅ 当前选择: ${agentName}`);
  }

  /**
   * 显示知识库 - 动态更新版本
   */
  showKnowledgeBase() {
    console.log('📚 显示知识库');
    
    // 获取当前游戏状态
    const currentThreats = GameGlobal.databus ? GameGlobal.databus.threats : [];
    const currentAgents = GameGlobal.databus ? GameGlobal.databus.agents : [];
    const currentScore = this.score;
    const currentSecurityLevel = this.securityLevel;
    
    console.log(`🎮 当前游戏状态:`);
    console.log(`   分数: ${currentScore}`);
    console.log(`   安全等级: ${currentSecurityLevel}%`);
    console.log(`   当前威胁数量: ${currentThreats.length}`);
    console.log(`   已部署Agent数量: ${currentAgents.length}`);
    
    // 获取知识记录
    if (GameGlobal.databus && GameGlobal.databus.knowledgeRecords) {
      const records = GameGlobal.databus.knowledgeRecords;
      console.log(`📖 知识库记录数量: ${records.length}`);
      
      // 分析最近的错误记录
      const recentErrors = records.filter(record => record.type === 'error').slice(-5);
      if (recentErrors.length > 0) {
        console.log(`⚠️ 最近的错误记录:`);
        recentErrors.forEach((record, index) => {
          console.log(`   ${index + 1}. 威胁: ${record.threatName}`);
          console.log(`      错误防御: ${record.wrongDefense}`);
          console.log(`      正确防御: ${record.correctDefense}`);
        });
      }
      
      // 分析成功防御记录
      const successRecords = records.filter(record => record.type === 'success').slice(-5);
      if (successRecords.length > 0) {
        console.log(`✅ 最近的成功防御:`);
        successRecords.forEach((record, index) => {
          console.log(`   ${index + 1}. 威胁: ${record.threatName}`);
          console.log(`      正确防御: ${record.correctDefense}`);
        });
      }
    } else {
      console.log('📚 暂无知识库记录');
    }
    
    // 显示当前威胁建议
    if (currentThreats.length > 0) {
      console.log(`🎯 当前威胁建议:`);
      currentThreats.forEach((threat, index) => {
        const correctDefense = this.getCorrectDefenseForThreat(threat.category);
        console.log(`   ${index + 1}. ${threat.name} - 建议使用: ${correctDefense}`);
      });
    }
    
    // 触发知识库显示事件
    this.emit('showKnowledgeBase');
  }
  
  /**
   * 获取威胁的正确防御方式
   * @param {string} threatType - 威胁类型
   * @returns {string} 正确的防御方式
   */
  getCorrectDefenseForThreat(threatType) {
    const defenseMapping = {
      phishing: '防火墙守护者',
      malware: '威胁检测者',
      ddos: '数据加密师',
      data_leak: '安全教育官'
    };
    
    return defenseMapping[threatType] || '防火墙守护者';
  }
}
