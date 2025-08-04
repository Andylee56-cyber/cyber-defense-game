import Sprite from '../base/sprite';
import DataBus from '../databus';

/**
 * Agent基类
 * 所有AI Agent的基类，提供基础防御功能
 */
export default class Agent extends Sprite {
  constructor() {
    super();

    this.type = 'firewall'; // Agent类型
    this.name = '未知Agent'; // Agent名称
    this.level = 1; // 等级
    this.energy = 100; // 能量
    this.maxEnergy = 100; // 最大能量
    this.defensePower = 10; // 防御力
    this.range = 100; // 攻击范围
    this.cooldown = 0; // 冷却时间
    this.maxCooldown = 30; // 最大冷却时间
    this.specialAbility = ''; // 特殊能力
    this.isActive = true; // 是否活跃
    this.target = null; // 当前目标

    // 粒子效果
    this.particles = [];
    this.maxParticles = 5;

    this.init();
  }

  /**
   * 初始化Agent
   * @param {Object} config - 配置对象
   */
  init(config = {}) {
    // 设置Agent属性
    this.type = config.type || this.type;
    this.name = config.name || this.name;
    this.level = config.level || this.level;
    this.energy = config.energy || this.maxEnergy;
    this.maxEnergy = config.maxEnergy || this.maxEnergy;
    this.defensePower = config.defensePower || this.defensePower;
    this.range = config.range || this.range;
    this.cooldown = 0;
    this.maxCooldown = config.maxCooldown || this.maxCooldown;
    this.specialAbility = config.specialAbility || this.specialAbility;

    // 设置位置
    this.x = config.x || this.x;
    this.y = config.y || this.y;

    // 初始化粒子效果
    this.initParticles();

    console.log(`部署Agent: ${this.name} (${this.type})`);
  }

  /**
   * 初始化粒子效果
   */
  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push({
        x: this.x + (Math.random() - 0.5) * 30,
        y: this.y + (Math.random() - 0.5) * 30,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.3,
        life: Math.random() * 60 + 30
      });
    }
  }

  /**
   * 更新Agent状态
   */
  update() {
    if (!this.isActive) return;

    // 更新冷却时间
    if (this.cooldown > 0) {
      this.cooldown--;
    }

    // 更新粒子效果
    this.updateParticles();

    // 自动恢复能量
    if (this.energy < this.maxEnergy) {
      this.energy += 0.5;
      if (this.energy > this.maxEnergy) {
        this.energy = this.maxEnergy;
      }
    }
  }

  /**
   * 更新粒子效果
   */
  updateParticles() {
    this.particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life--;
      particle.alpha = particle.life / 90;

      // 移除死亡的粒子
      if (particle.life <= 0) {
        this.particles.splice(index, 1);
      }
    });

    // 补充新粒子
    if (this.particles.length < this.maxParticles) {
      this.particles.push({
        x: this.x + (Math.random() - 0.5) * 30,
        y: this.y + (Math.random() - 0.5) * 30,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.3,
        life: Math.random() * 60 + 30
      });
    }
  }

  /**
   * 检查是否可以防御
   * @returns {boolean} 是否可以防御
   */
  canDefend() {
    return this.isActive && this.cooldown <= 0 && this.energy >= 10;
  }

  /**
   * 寻找目标
   * @param {Array} threats - 威胁列表
   * @returns {Object|null} 目标威胁
   */
  findTarget(threats) {
    if (!threats || threats.length === 0) return null;

    // 寻找在攻击范围内的威胁
    const targets = threats.filter(threat => {
      const distance = Math.sqrt(
        Math.pow(this.x - threat.x, 2) + Math.pow(this.y - threat.y, 2)
      );
      return distance <= this.range && threat.isActive;
    });

    if (targets.length === 0) return null;

    // 优先攻击最近的威胁
    targets.sort((a, b) => {
      const distA = Math.sqrt(
        Math.pow(this.x - a.x, 2) + Math.pow(this.y - a.y, 2)
      );
      const distB = Math.sqrt(
        Math.pow(this.x - b.x, 2) + Math.pow(this.y - b.y, 2)
      );
      return distA - distB;
    });

    return targets[0];
  }

  /**
   * 防御攻击
   * @param {Object} target - 目标威胁
   */
  defend(target) {
    if (!this.canDefend() || !target) return;

    // 消耗能量
    this.energy -= 10;
    
    // 设置冷却时间
    this.cooldown = this.maxCooldown;
    
    // 设置目标
    this.target = target;
    
    // 创建防御效果
    this.createDefenseEffect(target);
    
    console.log(`${this.name} 正在防御 ${target.name}`);
  }

  /**
   * 创建防御效果
   * @param {Object} target - 目标威胁
   */
  createDefenseEffect(target) {
    // 创建防御光束效果
    if (GameGlobal.databus) {
      const effect = {
        x: this.x,
        y: this.y,
        targetX: target.x,
        targetY: target.y,
        life: 30,
        maxLife: 30,
        color: this.getAgentColor(),
        render: (ctx) => {
          const alpha = effect.life / effect.maxLife;
          ctx.save();
          ctx.strokeStyle = `${effect.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
          ctx.lineWidth = 3;
          ctx.globalAlpha = alpha;
          ctx.shadowColor = effect.color;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.moveTo(effect.x, effect.y);
          ctx.lineTo(effect.targetX, effect.targetY);
          ctx.stroke();
          ctx.restore();
        }
      };
      
      GameGlobal.databus.animations.push(effect);
    }
  }

  /**
   * 使用特殊能力
   */
  useSpecialAbility() {
    if (this.energy < 30) return false;

    this.energy -= 30;
    
    switch (this.specialAbility) {
      case 'firewall_boost':
        this.firewallBoost();
        break;
      case 'encryption_field':
        this.encryptionField();
        break;
      case 'threat_scan':
        this.threatScan();
        break;
      case 'education_burst':
        this.educationBurst();
        break;
    }
    
    return true;
  }

  /**
   * 防火墙增强
   */
  firewallBoost() {
    this.defensePower *= 2;
    this.range *= 1.5;
    console.log(`${this.name} 使用防火墙增强！`);
  }

  /**
   * 加密领域
   */
  encryptionField() {
    // 创建加密保护罩
    console.log(`${this.name} 展开加密领域！`);
  }

  /**
   * 威胁扫描
   */
  threatScan() {
    // 扫描并标记所有威胁
    if (GameGlobal.databus && GameGlobal.databus.threats) {
      GameGlobal.databus.threats.forEach(threat => {
        threat.isMarked = true;
      });
    }
    console.log(`${this.name} 执行威胁扫描！`);
  }

  /**
   * 教育爆发
   */
  educationBurst() {
    // 提升所有Agent的能力
    if (GameGlobal.databus && GameGlobal.databus.agents) {
      GameGlobal.databus.agents.forEach(agent => {
        agent.defensePower += 5;
      });
    }
    console.log(`${this.name} 发动教育爆发！`);
  }

  /**
   * 获取Agent颜色
   * @returns {string} 颜色值
   */
  getAgentColor() {
    switch (this.type) {
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
   * 渲染Agent
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   */
  render(ctx) {
    if (!this.isActive) return;

    // 渲染粒子效果
    this.renderParticles(ctx);
    
    // 渲染Agent主体
    this.drawAgentBody(ctx);
    
    // 渲染状态信息
    this.drawAgentStatus(ctx);
    
    // 渲染攻击范围
    if (this.target) {
      this.drawAttackRange(ctx);
    }
  }

  /**
   * 渲染粒子效果
   */
  renderParticles(ctx) {
    this.particles.forEach(particle => {
      ctx.save();
      ctx.globalAlpha = particle.alpha;
      ctx.fillStyle = this.getAgentColor();
      ctx.shadowColor = this.getAgentColor();
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  /**
   * 绘制Agent主体
   */
  drawAgentBody(ctx) {
    ctx.save();
    ctx.fillStyle = this.getAgentColor();
    ctx.shadowColor = this.getAgentColor();
    ctx.shadowBlur = 10;
    
    const size = 20;
    
    // 绘制Agent图标
    ctx.beginPath();
    ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制冷却指示器
    if (this.cooldown > 0) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.5;
      const progress = 1 - (this.cooldown / this.maxCooldown);
      ctx.beginPath();
      ctx.arc(this.x, this.y, size + 5, -Math.PI/2, -Math.PI/2 + progress * Math.PI * 2);
      ctx.stroke();
    }
    
    ctx.restore();
  }

  /**
   * 绘制Agent状态
   */
  drawAgentStatus(ctx) {
    // 绘制能量条
    const barWidth = 40;
    const barHeight = 4;
    const barX = this.x - barWidth / 2;
    const barY = this.y - 30;
    
    // 背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    // 能量
    const energyPercentage = this.energy / this.maxEnergy;
    const energyColor = energyPercentage > 0.6 ? '#27ae60' : 
                       energyPercentage > 0.3 ? '#f39c12' : '#e74c3c';
    
    ctx.fillStyle = energyColor;
    ctx.fillRect(barX, barY, barWidth * energyPercentage, barHeight);
    
    // 边框
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
  }

  /**
   * 绘制攻击范围
   */
  drawAttackRange(ctx) {
    ctx.save();
    ctx.strokeStyle = this.getAgentColor();
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  /**
   * 销毁Agent
   */
  destroy() {
    this.isActive = false;
    this.visible = false;
    
    // 从DataBus中移除
    if (GameGlobal.databus) {
      GameGlobal.databus.removeAgent(this);
    }
  }
} 