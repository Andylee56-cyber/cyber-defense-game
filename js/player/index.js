import Sprite from '../base/sprite';
import Bullet from './bullet';
import DataBus from '../databus';
import Agent from '../npc/agent';

/**
 * 指挥官类
 * 玩家控制的角色，负责部署Agent和管理防御
 */
export default class Commander extends Sprite {
  constructor() {
    super();
    
    this.x = 0;
    this.y = 0;
    this.width = 40;
    this.height = 40;
    
    this.selectedAgentType = null;
    this.deployedAgents = [];
    this.maxAgents = 4;
    
    this.energy = 100;
    this.maxEnergy = 100;
    this.energyRegenRate = 1;
    
    this.shootCooldown = 0;
    this.maxShootCooldown = 10; // 减少射击冷却时间，确保子弹能正常发射
    
    this.isTouching = false;
    this.touchStartX = 0;
    this.touchStartY = 0;
    
    this.bindTouchEvents();
  }

  init() {
    // 设置初始位置
    this.x = canvas.width / 2;
    this.y = canvas.height - 100;

    // 同步DataBus能量
    if (GameGlobal.databus) {
      this.energy = GameGlobal.databus.energy;
      this.maxEnergy = GameGlobal.databus.maxEnergy;
    }

    // 重置状态
    this.deployedAgents = [];
    this.selectedAgentType = null;
    this.shootCooldown = 0;
    this.isTouching = false;

    // 绑定触摸事件
    this.bindTouchEvents();

    console.log('指挥官初始化完成');
  }

  /**
   * 绑定触摸事件
   */
  bindTouchEvents() {
    canvas.addEventListener('touchstart', this.onTouchStart.bind(this));
    canvas.addEventListener('touchmove', this.onTouchMove.bind(this));
    canvas.addEventListener('touchend', this.onTouchEnd.bind(this));
  }

  /**
   * 触摸开始事件
   */
  onTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    this.isTouching = true;
    this.touchStartX = x;
    this.touchStartY = y;

    // 检查UI按钮点击
    if (GameGlobal.gameInfo) {
      GameGlobal.gameInfo.handleTouch(x, y);
    }
    
    // 检查防御介绍界面点击
    if (GameGlobal.defenseIntro && GameGlobal.defenseIntro.isVisible) {
      GameGlobal.defenseIntro.handleTouch(x, y);
    }
    
    // 检查游戏结束界面点击
    if (GameGlobal.gameEnd && GameGlobal.gameEnd.isVisible) {
      GameGlobal.gameEnd.handleTouch(x, y);
    }
    
    // 检查知识库页面点击
    if (GameGlobal.knowledgePage && GameGlobal.knowledgePage.isVisible) {
      GameGlobal.knowledgePage.handleTouch(x, y);
    }

    // 如果选择了Agent类型，尝试部署
    if (this.selectedAgentType) {
      this.deployAgent(this.selectedAgentType, x, y);
    }
  }

  /**
   * 触摸移动事件
   */
  onTouchMove(e) {
    e.preventDefault();
    if (!this.isTouching) return;

    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    // 移动指挥官
    this.x = Math.max(30, Math.min(canvas.width - 30, x));
    this.y = Math.max(30, Math.min(canvas.height - 100, y));
  }

  /**
   * 触摸结束事件
   */
  onTouchEnd(e) {
    e.preventDefault();
    this.isTouching = false;
  }

  /**
   * 处理Agent选择
   * @param {string} agentType - Agent类型
   */
  handleAgentSelection(agentType) {
    // 检查当前威胁类型，确保选择正确的Agent
    if (GameGlobal.databus.threats.length > 0) {
      const currentThreat = GameGlobal.databus.threats[0];
      const correctAgentType = this.getCorrectAgentType(currentThreat.category);
      
      if (agentType !== correctAgentType) {
        console.log(`⚠️ 当前威胁需要 ${correctAgentType} 类型Agent，请选择正确的Agent！`);
        return; // 不允许选择错误的Agent
      }
    }
    
    // 允许随时切换Agent类型
    this.selectedAgentType = agentType;
    console.log(`🎯 切换到 ${agentType} Agent类型`);
    
    // 显示选择提示
    if (GameGlobal.gameInfo) {
      GameGlobal.gameInfo.showAgentSelectionMessage(agentType);
    }
  }

  /**
   * 部署Agent
   * @param {string} agentType - Agent类型
   * @param {number} x - X坐标
   * @param {number} y - Y坐标
   */
  deployAgent(agentType, x, y) {
    // 移除能量检查，实现无限部署
    // if (!GameGlobal.databus.canDeployAgent()) {
    //   console.log('能量不足，无法部署Agent');
    //   return;
    // }

    // 检查是否超过最大Agent数量
    if (GameGlobal.databus.agents.length >= this.maxAgents) {
      console.log('已达到最大Agent数量');
      return;
    }

    const agentConfig = this.getAgentConfig(agentType);
    const agent = GameGlobal.databus.pool.getItemByClass('agent', Agent);
    agent.init({
      type: agentType,
      name: agentConfig.name,
      x: x,
      y: y,
      defensePower: agentConfig.defensePower,
      range: agentConfig.range,
      maxEnergy: agentConfig.maxEnergy,
      maxCooldown: agentConfig.maxCooldown,
      specialAbility: agentConfig.specialAbility
    });

    GameGlobal.databus.addAgent(agent);
    this.deployedAgents.push(agent);

    // 移除能量消耗
    // if (GameGlobal.databus.consumeEnergyForAgent()) {
    //   this.energy = GameGlobal.databus.energy;
    GameGlobal.databus.addScore('agent_deploy', 20);
    //   console.log(`成功部署 ${agent.name}，获得20分！`);
    // } else {
    //   console.log('部署失败，能量不足');
    // }

    // 播放部署音效
    if (GameGlobal.musicManager) {
      GameGlobal.musicManager.playDeploySound();
    }

    console.log(`成功部署 ${agent.name}，获得20分！`);
  }

  /**
   * 获取Agent配置
   * @param {string} agentType - Agent类型
   * @returns {Object} Agent配置
   */
  getAgentConfig(agentType) {
    const configs = {
      firewall: {
        type: 'firewall',
        name: '防火墙守护者',
        energy: 100,
        maxEnergy: 100,
        defensePower: 15,
        range: 120,
        maxCooldown: 25,
        specialAbility: 'firewall_boost'
      },
      encryption: {
        type: 'encryption',
        name: '数据加密师',
        energy: 100,
        maxEnergy: 100,
        defensePower: 12,
        range: 100,
        maxCooldown: 30,
        specialAbility: 'encryption_field'
      },
      detection: {
        type: 'detection',
        name: '威胁检测者',
        energy: 100,
        maxEnergy: 100,
        defensePower: 10,
        range: 150,
        maxCooldown: 35,
        specialAbility: 'threat_scan'
      },
      education: {
        type: 'education',
        name: '安全教育官',
        energy: 100,
        maxEnergy: 100,
        defensePower: 8,
        range: 80,
        maxCooldown: 40,
        specialAbility: 'education_burst'
      }
    };

    return configs[agentType];
  }

  /**
   * 射击
   */
  shoot() {
    // 只有在选择了Agent类型时才能射击
    if (!this.selectedAgentType) {
      console.log('⚠️ 请先选择防御Agent类型');
      return;
    }

    // 检查是否有威胁存在
    if (GameGlobal.databus.threats.length === 0) {
      console.log('⚠️ 当前没有威胁需要防御');
      return;
    }

    // 检查是否选择了正确的Agent类型
    const currentThreat = GameGlobal.databus.threats[0];
    if (currentThreat) {
      const correctAgentType = this.getCorrectAgentType(currentThreat.category);
      if (this.selectedAgentType !== correctAgentType) {
        console.log(`⚠️ 请选择正确的Agent类型！当前威胁需要 ${correctAgentType}，您选择了 ${this.selectedAgentType}`);
        return; // 只有选择正确Agent才能射击
      }
    }

    if (this.shootCooldown > 0) return;

    const bullet = GameGlobal.databus.pool.getItemByClass('bullet', Bullet);
    bullet.init(this.x, this.y, this.selectedAgentType);
    GameGlobal.databus.addBullets(bullet);

    this.shootCooldown = this.maxShootCooldown;

    // 播放射击音效
    if (GameGlobal.musicManager) {
      GameGlobal.musicManager.playShootSound();
    }

    console.log(`🎯 发射子弹，类型: ${this.selectedAgentType}`);
    console.log(`✅ 选择了正确的Agent类型，将获得更高奖励！`);
  }

  /**
   * 获取正确的Agent类型
   * @param {string} threatType - 威胁类型
   * @returns {string} 正确的Agent类型
   */
  getCorrectAgentType(threatType) {
    const agentMapping = {
      phishing: 'education', // 修复：钓鱼攻击对应用户教育官
      malware: 'detection',
      ddos: 'firewall', // 修复：DDoS攻击对应防火墙守护者
      data_leak: 'encryption'
    };
    
    return agentMapping[threatType] || 'firewall';
  }

  /**
   * 更新指挥官状态
   */
  update() {
    // 同步DataBus能量
    if (GameGlobal.databus) {
      this.energy = GameGlobal.databus.energy;
      this.maxEnergy = GameGlobal.databus.maxEnergy;
    }

    // 更新射击冷却
    if (this.shootCooldown > 0) {
      this.shootCooldown--;
    }

    // 自动射击
    if (this.shootCooldown === 0) {
      this.shoot();
    }

    // 更新已部署的Agent
    this.deployedAgents = this.deployedAgents.filter(agent => agent.isActive);
  }

  /**
   * 渲染指挥官
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   */
  render(ctx) {
    if (!this.visible) return;

    // 绘制指挥官
    ctx.save();
    
    // 指挥官主体 - 科幻亮色圆圈效果
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    const size = this.width / 2;
    
    // 创建径向渐变 - 科幻亮色效果
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size);
    gradient.addColorStop(0, '#00ffff'); // 中心青色
    gradient.addColorStop(0.3, '#0080ff'); // 蓝色
    gradient.addColorStop(0.7, '#0040ff'); // 深蓝色
    gradient.addColorStop(1, '#002080'); // 边缘深蓝
    
    // 绘制主体圆圈
    ctx.fillStyle = gradient;
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制发光边框
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
    ctx.stroke();
    
    // 绘制内部装饰环
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 5;
    ctx.beginPath();
    ctx.arc(centerX, centerY, size * 0.6, 0, Math.PI * 2);
    ctx.stroke();
    
    // 绘制中心点
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制动态光点效果
    const time = Date.now() * 0.005;
    const pulseSize = size * 0.3 + Math.sin(time) * 3;
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.7 + Math.sin(time) * 0.2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
    ctx.stroke();
    
    // 绘制指挥官标识
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.fillText('CMD', centerX, centerY + 5);
    
    ctx.restore();
  }

  /**
   * 销毁指挥官
   */
  destroy() {
    this.isActive = false;
    this.visible = false;

    // 移除触摸事件监听器
    canvas.removeEventListener('touchstart', this.onTouchStart.bind(this));
    canvas.removeEventListener('touchmove', this.onTouchMove.bind(this));
    canvas.removeEventListener('touchend', this.onTouchEnd.bind(this));
  }
}
