import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';

export default class DefenseIntro {
  constructor() {
    this.isVisible = false;
    this.currentDefense = null;
    this.fadeInTime = 0;
    this.isFadingIn = false;

    // 防御方式配置
    this.defenseInfo = {
      firewall: {
        name: '防火墙守护者',
        title: '网络安全的第一道防线',
        description: [
          '防火墙是网络安全的基础设施，负责监控和控制网络流量。',
          '',
          '主要功能：',
          '• 阻止未授权的网络访问',
          '• 过滤恶意流量和攻击',
          '• 保护内部网络免受外部威胁',
          '• 记录和分析网络活动',
          '',
          '适用威胁：',
          '• 钓鱼攻击',
          '• 恶意网站访问',
          '• 未授权连接尝试',
          '• 网络扫描攻击'
        ],
        color: '#ff6b6b',
        icon: '🛡️',
        effectiveness: '钓鱼攻击、网络入侵',
        weakness: '内部威胁、加密攻击'
      },
      encryption: {
        name: '数据加密师',
        title: '数据安全的守护神',
        description: [
          '数据加密师负责保护敏感数据的机密性和完整性。',
          '',
          '主要功能：',
          '• 加密存储和传输数据',
          '• 生成和管理加密密钥',
          '• 实施端到端加密',
          '• 保护数据免受窃取',
          '',
          '适用威胁：',
          '• DDoS攻击',
          '• 数据窃取',
          '• 中间人攻击',
          '• 数据泄露'
        ],
        color: '#4ecdc4',
        icon: '🔐',
        effectiveness: 'DDoS攻击、数据泄露',
        weakness: '密钥管理、量子计算'
      },
      detection: {
        name: '威胁检测者',
        title: '智能威胁识别专家',
        description: [
          '威胁检测者使用先进技术识别和分析各种网络威胁。',
          '',
          '主要功能：',
          '• 实时监控系统活动',
          '• 识别异常行为和模式',
          '• 分析恶意软件特征',
          '• 提供威胁情报',
          '',
          '适用威胁：',
          '• 恶意软件',
          '• 病毒和木马',
          '• 勒索软件',
          '• 间谍软件'
        ],
        color: '#45b7d1',
        icon: '🔍',
        effectiveness: '恶意软件、病毒攻击',
        weakness: '零日攻击、高级持续性威胁'
      },
      education: {
        name: '安全教育官',
        title: '网络安全意识传播者',
        description: [
          '安全教育官负责提升用户的安全意识和技能。',
          '',
          '主要功能：',
          '• 提供安全培训和教育',
          '• 制定安全政策和规范',
          '• 进行安全意识评估',
          '• 推广最佳安全实践',
          '',
          '适用威胁：',
          '• 社会工程学攻击',
          '• 人为错误',
          '• 安全意识不足',
          '• 内部威胁'
        ],
        color: '#96ceb4',
        icon: '📚',
        effectiveness: '数据泄露、人为错误',
        weakness: '技术性攻击、自动化威胁'
      }
    };
  }

  show(defenseType) {
    this.currentDefense = defenseType;
    this.isVisible = true;
    this.isFadingIn = true;
    this.fadeInTime = 0;
  }

  hide() {
    this.isVisible = false;
    this.currentDefense = null;
    
    // 恢复游戏
    if (GameGlobal.gameInfo) {
      GameGlobal.gameInfo.isPaused = false;
      GameGlobal.gameInfo.emit('resumeGame');
      console.log('▶️ 关闭防御介绍，游戏已恢复');
    }
  }

  handleTouch(x, y) {
    if (!this.isVisible) return;

    // 检查关闭按钮
    const closeButtonX = SCREEN_WIDTH - 60;
    const closeButtonY = 60;
    const closeButtonSize = 40;

    if (x >= closeButtonX && x <= closeButtonX + closeButtonSize &&
        y >= closeButtonY && y <= closeButtonY + closeButtonSize) {
      this.hide();
      return;
    }
  }

  update() {
    if (this.isFadingIn) {
      this.fadeInTime += 0.02;
      if (this.fadeInTime >= 1) {
        this.isFadingIn = false;
      }
    }
  }

  render(ctx) {
    if (!this.isVisible) return;

    const alpha = this.isFadingIn ? this.fadeInTime : 1;

    // 绘制背景遮罩
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.7})`;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    this.renderMainPanel(ctx, alpha);
    this.renderCloseButton(ctx, alpha);
  }

  renderMainPanel(ctx, alpha) {
    const panelWidth = SCREEN_WIDTH * 0.8;
    const panelHeight = SCREEN_HEIGHT * 0.7;
    const panelX = (SCREEN_WIDTH - panelWidth) / 2;
    const panelY = (SCREEN_HEIGHT - panelHeight) / 2;

    // 绘制主面板背景
    const gradient = ctx.createLinearGradient(panelX, panelY, panelX + panelWidth, panelY + panelHeight);
    gradient.addColorStop(0, `rgba(20, 40, 80, ${alpha})`);
    gradient.addColorStop(1, `rgba(10, 20, 40, ${alpha})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);

    // 绘制边框
    ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
    ctx.lineWidth = 2;
    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

    // 绘制发光效果
    ctx.shadowColor = 'rgba(0, 255, 255, 0.5)';
    ctx.shadowBlur = 10;
    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);
    ctx.shadowBlur = 0;

    const defense = this.defenseInfo[this.currentDefense];
    if (!defense) return;

    // 绘制标题
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${defense.icon} ${defense.name}`, panelX + panelWidth / 2, panelY + 50);

    // 绘制副标题
    ctx.font = '16px Arial';
    ctx.fillStyle = `rgba(200, 200, 200, ${alpha})`;
    ctx.fillText(defense.title, panelX + panelWidth / 2, panelY + 80);

    // 绘制描述
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    
    let y = panelY + 120;
    defense.description.forEach((line, index) => {
      if (line === '') {
        y += 10;
        return;
      }
      
      // 处理长文本换行
      const maxWidth = panelWidth - 40;
      const words = line.split('');
      let currentLine = '';
      
      for (let i = 0; i < words.length; i++) {
        const testLine = currentLine + words[i];
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && currentLine !== '') {
          ctx.fillText(currentLine, panelX + 20, y);
          y += 20;
          currentLine = words[i];
        } else {
          currentLine = testLine;
        }
      }
      
      if (currentLine !== '') {
        ctx.fillText(currentLine, panelX + 20, y);
        y += 20;
      }
    });

    // 绘制效果信息
    y += 20;
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
    ctx.fillText('有效防御:', panelX + 20, y);
    ctx.font = '14px Arial';
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fillText(defense.effectiveness, panelX + 20, y + 20);

    y += 40;
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = `rgba(255, 100, 100, ${alpha})`;
    ctx.fillText('弱点:', panelX + 20, y);
    ctx.font = '14px Arial';
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fillText(defense.weakness, panelX + 20, y + 20);
  }

  renderCloseButton(ctx, alpha) {
    const buttonX = SCREEN_WIDTH - 60;
    const buttonY = 60;
    const buttonSize = 40;

    // 绘制关闭按钮背景
    ctx.fillStyle = `rgba(255, 100, 100, ${alpha})`;
    ctx.fillRect(buttonX, buttonY, buttonSize, buttonSize);

    // 绘制X符号
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(buttonX + 10, buttonY + 10);
    ctx.lineTo(buttonX + buttonSize - 10, buttonY + buttonSize - 10);
    ctx.moveTo(buttonX + buttonSize - 10, buttonY + 10);
    ctx.lineTo(buttonX + 10, buttonY + buttonSize - 10);
    ctx.stroke();
  }
} 