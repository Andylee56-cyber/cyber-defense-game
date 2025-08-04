import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';

/**
 * Agent介绍系统
 * 显示每个Agent的详细信息和介绍
 */
export default class AgentIntro {
  constructor() {
    this.isVisible = false;
    this.currentAgent = null;
    this.fadeInTime = 0;
    this.isFadingIn = false;
    
    // Agent信息配置
    this.agentInfo = {
      firewall: {
        name: '防火墙守护者',
        title: '网络安全的第一道防线',
        description: [
          '防火墙守护者是网络安全的核心防御力量，',
          '能够有效拦截各种网络攻击，保护系统安全。',
          '',
          '主要功能：',
          '• 拦截恶意流量和攻击',
          '• 过滤危险的数据包',
          '• 监控网络连接状态',
          '• 阻止未授权访问',
          '',
          '适用场景：',
          '• 钓鱼攻击防护',
          '• 恶意软件拦截',
          '• 网络入侵检测',
          '• 访问控制管理'
        ],
        color: '#ff6b6b',
        icon: '🛡️',
        cost: 50,
        range: 120,
        damage: 15
      },
      encryption: {
        name: '数据加密师',
        title: '数据安全的守护神',
        description: [
          '数据加密师专门负责保护敏感数据的安全，',
          '通过强大的加密技术确保信息不被窃取。',
          '',
          '主要功能：',
          '• 数据加密保护',
          '• 密钥管理',
          '• 安全通信保障',
          '• 隐私数据防护',
          '',
          '适用场景：',
          '• DDoS攻击防护',
          '• 数据传输加密',
          '• 敏感信息保护',
          '• 安全通信建立'
        ],
        color: '#4ecdc4',
        icon: '🔐',
        cost: 50,
        range: 100,
        damage: 12
      },
      detection: {
        name: '威胁检测者',
        title: '智能威胁识别专家',
        description: [
          '威胁检测者拥有敏锐的感知能力，',
          '能够快速识别和定位各种网络安全威胁。',
          '',
          '主要功能：',
          '• 实时威胁检测',
          '• 异常行为分析',
          '• 攻击模式识别',
          '• 安全事件响应',
          '',
          '适用场景：',
          '• 恶意软件检测',
          '• 入侵行为识别',
          '• 异常流量分析',
          '• 安全事件处理'
        ],
        color: '#45b7d1',
        icon: '🔍',
        cost: 50,
        range: 150,
        damage: 10
      },
      education: {
        name: '安全教育官',
        title: '网络安全意识传播者',
        description: [
          '安全教育官致力于提升用户的安全意识，',
          '通过教育和培训减少人为安全风险。',
          '',
          '主要功能：',
          '• 安全知识普及',
          '• 用户行为指导',
          '• 安全意识培训',
          '• 最佳实践推广',
          '',
          '适用场景：',
          '• 数据泄露防护',
          '• 社交工程防护',
          '• 安全意识提升',
          '• 安全文化建设'
        ],
        color: '#96ceb4',
        icon: '📚',
        cost: 50,
        range: 80,
        damage: 8
      }
    };
  }

  /**
   * 显示Agent介绍
   * @param {string} agentType - Agent类型
   */
  show(agentType) {
    this.currentAgent = this.agentInfo[agentType];
    if (this.currentAgent) {
      this.isVisible = true;
      this.isFadingIn = true;
      this.fadeInTime = 0;
      console.log(`📖 显示 ${this.currentAgent.name} 介绍`);
    }
  }

  /**
   * 隐藏Agent介绍
   */
  hide() {
    this.isVisible = false;
    this.currentAgent = null;
  }

  /**
   * 处理触摸事件
   * @param {number} x - 触摸X坐标
   * @param {number} y - 触摸Y坐标
   */
  handleTouch(x, y) {
    if (!this.isVisible) return;

    // 检查关闭按钮
    const closeButtonX = SCREEN_WIDTH - 60;
    const closeButtonY = 60;
    const closeButtonSize = 40;

    if (x >= closeButtonX && x <= closeButtonX + closeButtonSize &&
        y >= closeButtonY && y <= closeButtonY + closeButtonSize) {
      this.hide();
    }
  }

  /**
   * 更新状态
   */
  update() {
    if (this.isFadingIn) {
      this.fadeInTime += 0.016;
      if (this.fadeInTime >= 0.3) {
        this.isFadingIn = false;
      }
    }
  }

  /**
   * 渲染Agent介绍
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   */
  render(ctx) {
    if (!this.isVisible || !this.currentAgent) return;

    const alpha = this.isFadingIn ? (this.fadeInTime / 0.3) : 1;

    // 绘制背景遮罩
    ctx.save();
    ctx.fillStyle = `rgba(0, 0, 0, ${0.8 * alpha})`;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // 绘制主面板
    this.renderMainPanel(ctx, alpha);

    // 绘制关闭按钮
    this.renderCloseButton(ctx, alpha);

    ctx.restore();
  }

  /**
   * 渲染主面板
   */
  renderMainPanel(ctx, alpha) {
    const panelWidth = SCREEN_WIDTH - 100;
    const panelHeight = SCREEN_HEIGHT - 120;
    const panelX = 50;
    const panelY = 60;

    // 绘制面板背景
    const gradient = ctx.createLinearGradient(panelX, panelY, panelX, panelY + panelHeight);
    gradient.addColorStop(0, `rgba(0, 0, 0, ${0.9 * alpha})`);
    gradient.addColorStop(1, `rgba(0, 20, 40, ${0.9 * alpha})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);

    // 绘制边框
    ctx.strokeStyle = this.currentAgent.color;
    ctx.lineWidth = 3;
    ctx.globalAlpha = alpha;
    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

    // 绘制标题
    ctx.fillStyle = this.currentAgent.color;
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = this.currentAgent.color;
    ctx.shadowBlur = 5;
    ctx.fillText(`${this.currentAgent.icon} ${this.currentAgent.name}`, panelX + panelWidth/2, panelY + 40);
    ctx.shadowBlur = 0;

    // 绘制副标题
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.fillText(this.currentAgent.title, panelX + panelWidth/2, panelY + 70);

    // 绘制属性信息
    this.renderAgentStats(ctx, panelX, panelY, alpha);

    // 绘制描述内容
    this.renderDescription(ctx, panelX, panelY, alpha);
  }

  /**
   * 渲染Agent属性
   */
  renderAgentStats(ctx, panelX, panelY, alpha) {
    const statsY = panelY + 100;
    const statsSpacing = 30;

    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';

    // 部署成本
    ctx.fillText(`部署成本: ${this.currentAgent.cost} 能量`, panelX + 20, statsY);
    
    // 攻击范围
    ctx.fillText(`攻击范围: ${this.currentAgent.range} 像素`, panelX + 20, statsY + statsSpacing);
    
    // 攻击伤害
    ctx.fillText(`攻击伤害: ${this.currentAgent.damage} 点`, panelX + 20, statsY + statsSpacing * 2);

    // 绘制属性条
    this.drawStatBar(ctx, panelX + 120, statsY - 10, this.currentAgent.cost / 100, '#ff6b6b');
    this.drawStatBar(ctx, panelX + 120, statsY + statsSpacing - 10, this.currentAgent.range / 200, '#4ecdc4');
    this.drawStatBar(ctx, panelX + 120, statsY + statsSpacing * 2 - 10, this.currentAgent.damage / 20, '#45b7d1');
  }

  /**
   * 绘制属性条
   */
  drawStatBar(ctx, x, y, percentage, color) {
    const barWidth = 100;
    const barHeight = 8;

    // 背景
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(x, y, barWidth, barHeight);

    // 填充
    ctx.fillStyle = color;
    ctx.fillRect(x, y, barWidth * percentage, barHeight);

    // 边框
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, barWidth, barHeight);
  }

  /**
   * 渲染描述内容
   */
  renderDescription(ctx, panelX, panelY, alpha) {
    const startY = panelY + 200;
    const lineHeight = 18;
    const maxWidth = SCREEN_WIDTH - 140;

    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';

    this.currentAgent.description.forEach((line, index) => {
      const y = startY + index * lineHeight;
      
      if (y < SCREEN_HEIGHT - 80) {
        ctx.fillText(line, panelX + 20, y);
      }
    });
  }

  /**
   * 渲染关闭按钮
   */
  renderCloseButton(ctx, alpha) {
    const buttonSize = 40;
    const x = SCREEN_WIDTH - 60;
    const y = 60;

    // 绘制按钮背景
    ctx.fillStyle = `rgba(255, 100, 100, ${0.8 * alpha})`;
    ctx.fillRect(x, y, buttonSize, buttonSize);

    // 绘制边框
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, buttonSize, buttonSize);

    // 绘制X符号
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + 10, y + 10);
    ctx.lineTo(x + buttonSize - 10, y + buttonSize - 10);
    ctx.moveTo(x + buttonSize - 10, y + 10);
    ctx.lineTo(x + 10, y + buttonSize - 10);
    ctx.stroke();
  }
} 