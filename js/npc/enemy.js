import Sprite from '../base/sprite';
import DataBus from '../databus';
import { getRandomThreat, getThreatCategoryInfo } from '../config/threatBank';

/**
 * 威胁类
 * 继承自精灵基类，提供威胁的基本功能
 */
export default class Threat extends Sprite {
  constructor() {
    super();

    // 威胁配置
    this.threatConfig = {
      phishing: {
        color: '#ff6b6b',
        shape: 'triangle',
        speed: 0.6, // 降低速度，提高可操作性
        health: 12, // 进一步降低生命值
        damage: 5
      },
      malware: {
        color: '#ff8c00',
        shape: 'square',
        speed: 0.5, // 降低速度
        health: 15, // 进一步降低生命值
        damage: 8
      },
      ddos: {
        color: '#ff1493',
        shape: 'circle',
        speed: 0.7, // 降低速度
        health: 18, // 进一步降低生命值
        damage: 10
      },
      data_leak: {
        color: '#9932cc',
        shape: 'diamond',
        speed: 0.4, // 降低速度
        health: 20, // 进一步降低生命值
        damage: 15
      }
    };

    this.type = 'phishing'; // 威胁类型
    this.name = '未知威胁'; // 威胁名称
    this.health = 30; // 生命值
    this.maxHealth = 30; // 最大生命值
    this.speed = 1.0; // 移动速度
    this.damage = 5; // 伤害值
    this.isActive = true; // 是否活跃
    this.isMarked = false; // 是否被标记
    this.description = ''; // 威胁描述
    this.knowledgeTip = ''; // 知识点提示
    this.defenseType = 'firewall'; // 对应的防御类型
    this.category = ''; // 威胁类别
    this.difficulty = 1; // 难度等级

    // 粒子效果
    this.particles = [];
    this.maxParticles = 8;

    this.init();
  }

  /**
   * 初始化威胁
   * @param {Object} config - 配置对象
   */
  init(config = {}) {
    // 如果指定了威胁类型，使用指定类型；否则从题库获取随机威胁
    let threatData;
    if (config.type) {
      // 根据指定类型获取威胁数据
      threatData = this.getThreatByType(config.type);
      this.category = config.type;
    } else {
      // 从题库获取随机威胁
      threatData = getRandomThreat();
      this.category = threatData.category;
    }
    
    // 设置威胁属性
    this.name = threatData.name;
    this.description = threatData.description;
    this.defenseType = threatData.defense;
    this.knowledgeTip = threatData.knowledge;
    this.difficulty = threatData.difficulty;
    
    // 根据类别设置视觉属性
    const visualConfig = this.threatConfig[this.category];
    this.color = visualConfig.color;
    this.shape = visualConfig.shape;
    // 降低下落速度，提高可玩性
    this.speed = visualConfig.speed * 0.5; // 速度减半
    this.health = visualConfig.health + (this.difficulty - 1) * 10; // 难度影响生命值
    this.maxHealth = this.health;
    this.damage = visualConfig.damage;

    // 设置尺寸 - 修复碰撞检测问题
    this.width = 40;  // 威胁的宽度
    this.height = 40; // 威胁的高度

    // 设置位置 - 修正为左上角坐标
    const centerX = config.x || Math.random() * (canvas.width - 60) + 30;
    const centerY = config.y || -50;
    
    // 将中心点坐标转换为左上角坐标
    this.x = centerX - this.width / 2;
    this.y = centerY - this.height / 2;

    console.log(`📍 威胁位置: (${this.x}, ${this.y}), 尺寸: ${this.width}x${this.height}, 类型: ${this.category}, 速度: ${this.speed}`);
  }

  /**
   * 根据威胁类型获取威胁数据
   * @param {string} type - 威胁类型
   * @returns {Object} 威胁数据
   */
  getThreatByType(type) {
    const threatDatabase = {
      phishing: {
        name: '钓鱼攻击',
        description: '伪装成可信来源的恶意链接或邮件',
        defense: 'firewall',
        knowledge: '不要点击来源不明的链接，注意URL拼写',
        category: 'phishing',
        difficulty: 1
      },
      malware: {
        name: '恶意软件',
        description: '病毒、木马等恶意程序',
        defense: 'detection',
        knowledge: '及时更新杀毒软件，不下载来源不明的文件',
        category: 'malware',
        difficulty: 2
      },
      ddos: {
        name: 'DDoS攻击',
        description: '分布式拒绝服务攻击，使服务不可用',
        defense: 'encryption',
        knowledge: '使用CDN和负载均衡来防护DDoS攻击',
        category: 'ddos',
        difficulty: 3
      },
      data_leak: {
        name: '数据泄露',
        description: '敏感信息被意外或恶意泄露',
        defense: 'education',
        knowledge: '加强员工安全意识培训，实施数据分类管理',
        category: 'data_leak',
        difficulty: 2
      }
    };

    return threatDatabase[type] || threatDatabase.phishing;
  }

  /**
   * 初始化粒子效果
   */
  initParticles() {
    this.particles = [];
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push({
        x: centerX + (Math.random() - 0.5) * 40,
        y: centerY + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.5 + 0.3,
        life: Math.random() * 60 + 30
      });
    }
  }

  /**
   * 更新威胁状态
   */
  update() {
    if (!this.isActive) return;

    // 增加下落速度
    this.y += this.speed * 3.0; // 增加200%的下落速度，让威胁下落更快
    
    // 更新粒子效果
    this.updateParticles();

    // 检查是否超出屏幕
    if (this.y > canvas.height) {
      this.destroy();
    }
    
    // 检查是否沉到指挥官射击范围以下，调整范围
    const commanderY = canvas.height - 120; // 指挥官位置，增加射击范围
    if (this.y > commanderY + 80) { // 增加射击范围
      // 威胁沉到指挥官射击范围以下，扣分
      GameGlobal.databus.updateSecurityLevel(-2); // 减少扣分
      console.log(`⚠️ 威胁 ${this.name} 沉到射击范围以下，扣分！`);
      this.destroy();
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
      const centerX = this.x + this.width / 2;
      const centerY = this.y + this.height / 2;
      
      this.particles.push({
        x: centerX + (Math.random() - 0.5) * 40,
        y: centerY + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.5 + 0.3,
        life: Math.random() * 60 + 30
      });
    }
  }

  /**
   * 检查防御类型是否匹配
   * @param {string} threatType - 威胁类型
   * @param {string} defenseType - 防御类型
   * @returns {boolean} 是否匹配
   */
  isDefenseMatch(threatType, defenseType) {
    // 根据威胁类型和防御类型的对应关系进行匹配
    const defenseMapping = {
      phishing: 'firewall',
      malware: 'detection',
      ddos: 'encryption',
      data_leak: 'education'
    };
    
    const expectedDefense = defenseMapping[threatType];
    return expectedDefense === defenseType;
  }

  /**
   * 受到伤害
   * @param {number} damage - 伤害值
   * @param {string} defenseType - 防御类型（可选）
   */
  takeDamage(damage, defenseType = null) {
    // 只要击中就能造成伤害
    this.health -= damage;
    console.log(`💥 ${this.name} 受到 ${damage} 点伤害，剩余生命值: ${this.health}`);
    
    if (this.health <= 0) {
      this.destroy();
      
      // 检查防御类型是否匹配，给予不同奖励
      if (defenseType && this.isDefenseMatch(this.category, defenseType)) {
        // 正确的防御类型，给予更高奖励
        GameGlobal.databus.addScore('correct_defense', 20);
        GameGlobal.databus.addKnowledgePoints(15);
        GameGlobal.databus.updateSecurityLevel(5);
        GameGlobal.databus.correctAnswerCount++;
        console.log(`✅ 完美防御！${this.name} 被 ${defenseType} 成功拦截`);
      } else {
        // 普通消灭，给予基础奖励
        GameGlobal.databus.addScore('threat_destroy', 10); // 修改为10分
        GameGlobal.databus.addKnowledgePoints(5);
        GameGlobal.databus.updateSecurityLevel(2);
        console.log(`🎯 威胁被消灭！${this.name}`);
      }
      
      this.showKnowledgeTip();
      return true;
    }
    
    return false;
  }

  /**
   * 显示知识点提示
   */
  showKnowledgeTip() {
    console.log(`💡 知识点: ${this.knowledgeTip}`);
  }

  /**
   * 渲染威胁
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   */
  render(ctx) {
    if (!this.isActive) return;

    // 渲染粒子效果
    this.renderParticles(ctx);
    
    // 渲染威胁主体
    this.drawThreatBody(ctx);
    
    // 渲染生命值条
    this.drawHealthBar(ctx);
    
    // 渲染标记效果
    if (this.isMarked) {
      this.drawMarkEffect(ctx);
    }
    
    // 渲染威胁名称
    this.drawThreatName(ctx);
  }

  /**
   * 渲染粒子效果
   */
  renderParticles(ctx) {
    this.particles.forEach(particle => {
      ctx.save();
      ctx.globalAlpha = particle.alpha;
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  /**
   * 绘制威胁主体
   */
  drawThreatBody(ctx) {
    ctx.save();
    
    const size = 15;
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    
    // 所有威胁都使用科幻效果，根据类型使用不同颜色
    this.drawSciFiThreat(ctx, centerX, centerY, size, this.color, this.shape);
    
    ctx.restore();
  }

  /**
   * 绘制三角形
   */
  drawTriangle(ctx, x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x - size, y + size);
    ctx.lineTo(x + size, y + size);
    ctx.closePath();
    ctx.fill();
  }

  /**
   * 绘制菱形
   */
  drawDiamond(ctx, x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x, y + size);
    ctx.lineTo(x - size, y);
    ctx.closePath();
    ctx.fill();
  }

  /**
   * 绘制科幻威胁 - 所有威胁类型都使用科幻效果
   */
  drawSciFiThreat(ctx, x, y, size, color, shape) {
    // 创建径向渐变 - 使用威胁自身的颜色
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, color); // 中心使用威胁颜色
    gradient.addColorStop(0.3, this.darkenColor(color, 0.2));
    gradient.addColorStop(0.7, this.darkenColor(color, 0.4));
    gradient.addColorStop(1, this.darkenColor(color, 0.6));
    
    // 绘制主体形状
    ctx.fillStyle = gradient;
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    
    switch (shape) {
      case 'triangle':
        this.drawSciFiTriangle(ctx, x, y, size, color);
        break;
      case 'square':
        this.drawSciFiSquare(ctx, x, y, size, color);
        break;
      case 'circle':
        this.drawSciFiCircle(ctx, x, y, size, color);
        break;
      case 'diamond':
        this.drawSciFiDiamond(ctx, x, y, size, color);
        break;
      default:
        this.drawSciFiCircle(ctx, x, y, size, color);
    }
    
    // 绘制动态光点效果
    const time = Date.now() * 0.005;
    const pulseSize = size * 0.4 + Math.sin(time) * 3;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.7 + Math.sin(time) * 0.2;
    ctx.beginPath();
    ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
    ctx.stroke();
    
    // 绘制内部装饰环
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.shadowBlur = 5;
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
    ctx.stroke();
    
    // 绘制中心点
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 3;
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.globalAlpha = 1;
  }
  
  /**
   * 绘制科幻三角形
   */
  drawSciFiTriangle(ctx, x, y, size, color) {
    // 绘制主体三角形
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x - size, y + size);
    ctx.lineTo(x + size, y + size);
    ctx.closePath();
    ctx.fill();
    
    // 绘制发光边框
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 8;
    ctx.stroke();
    
    // 绘制内部装饰线
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.shadowBlur = 3;
    ctx.beginPath();
    ctx.moveTo(x, y - size * 0.3);
    ctx.lineTo(x, y + size * 0.3);
    ctx.stroke();
  }
  
  /**
   * 绘制科幻正方形
   */
  drawSciFiSquare(ctx, x, y, size, color) {
    // 绘制主体正方形
    ctx.fillRect(x - size, y - size, size * 2, size * 2);
    
    // 绘制发光边框
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 8;
    ctx.strokeRect(x - size, y - size, size * 2, size * 2);
    
    // 绘制内部装饰线
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.shadowBlur = 3;
    ctx.beginPath();
    ctx.moveTo(x - size * 0.5, y);
    ctx.lineTo(x + size * 0.5, y);
    ctx.moveTo(x, y - size * 0.5);
    ctx.lineTo(x, y + size * 0.5);
    ctx.stroke();
  }
  
  /**
   * 绘制科幻圆圈
   */
  drawSciFiCircle(ctx, x, y, size, color) {
    // 绘制主体圆圈
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制发光边框
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  /**
   * 绘制科幻菱形
   */
  drawSciFiDiamond(ctx, x, y, size, color) {
    // 绘制主体菱形
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x, y + size);
    ctx.lineTo(x - size, y);
    ctx.closePath();
    ctx.fill();
    
    // 绘制发光边框
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 8;
    ctx.stroke();
    
    // 绘制内部装饰线
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.shadowBlur = 3;
    ctx.beginPath();
    ctx.moveTo(x - size * 0.5, y);
    ctx.lineTo(x + size * 0.5, y);
    ctx.moveTo(x, y - size * 0.5);
    ctx.lineTo(x, y + size * 0.5);
    ctx.stroke();
  }
  
  /**
   * 颜色变暗函数
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
   * 绘制生命值条
   */
  drawHealthBar(ctx) {
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    
    const barWidth = 30;
    const barHeight = 4;
    const barX = centerX - barWidth / 2;
    const barY = centerY - 25;
    
    // 背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    // 生命值
    const healthPercentage = this.health / this.maxHealth;
    const healthColor = healthPercentage > 0.6 ? '#00ff00' : 
                       healthPercentage > 0.3 ? '#ffff00' : '#ff0000';
    
    ctx.fillStyle = healthColor;
    ctx.fillRect(barX, barY, barWidth * healthPercentage, barHeight);
    
    // 边框
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
  }

  /**
   * 绘制标记效果
   */
  drawMarkEffect(ctx) {
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    
    ctx.save();
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  /**
   * 绘制威胁名称
   */
  drawThreatName(ctx) {
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 2;
    ctx.fillText(this.name, centerX, centerY + 35);
    ctx.restore();
  }

  /**
   * 销毁威胁
   */
  destroy() {
    this.isActive = false;
    this.visible = false;
    
    // 从DataBus中移除
    if (GameGlobal.databus) {
      GameGlobal.databus.removeThreat(this);
    }
  }
}