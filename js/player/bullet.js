import Sprite from '../base/sprite';
import DataBus from '../databus';

const BULLET_IMG_SRC = 'images/bullet.png';
const BULLET_WIDTH = 16;
const BULLET_HEIGHT = 30;

const BULLET_SPEED = 12; // 提高子弹速度，增强可操作性

/**
 * 防御子弹类
 * 指挥官发射的防御武器，用于拦截网络威胁
 */
export default class Bullet extends Sprite {
  constructor() {
    super(BULLET_IMG_SRC, BULLET_WIDTH, BULLET_HEIGHT);

    this.damage = 15; // 伤害值
    this.type = 'normal'; // 子弹类型
    this.isActive = false; // 是否激活
    this.trail = []; // 子弹轨迹
    this.maxTrailLength = 5; // 最大轨迹长度

    this.init();
  }

  init(x, y, type = 'normal') {
    this.x = x;
    this.y = y;
    this.type = type;
    this.isActive = true;
    this.visible = true; // 确保子弹可见
    this.trail = [];

    // 根据类型设置属性
    this.setupBulletType();
    
    console.log(`💥 子弹初始化: 位置(${x}, ${y}), 类型: ${type}, 伤害: ${this.damage}, 尺寸: ${this.width}x${this.height}, 可见: ${this.visible}`);
  }

  /**
   * 根据子弹类型设置属性
   */
  setupBulletType() {
    switch (this.type) {
      case 'firewall':
        this.damage = 25; // 提高伤害值
        this.width = 20;
        this.height = 35;
        break;
      case 'encryption':
        this.damage = 20; // 提高伤害值
        this.width = 18;
        this.height = 32;
        break;
      case 'detection':
        this.damage = 18; // 提高伤害值
        this.width = 16;
        this.height = 30;
        break;
      case 'education':
        this.damage = 15; // 提高伤害值
        this.width = 14;
        this.height = 28;
        break;
      default:
        this.damage = 20; // 提高默认伤害值
        this.width = 16;
        this.height = 30;
    }
  }

  /**
   * 更新子弹状态
   */
  update() {
    if (!this.isActive) return;

    // 更新轨迹
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift();
    }

    // 向上移动
    this.y -= BULLET_SPEED;

    // 检查是否超出边界
    if (this.y < -this.height) {
      this.destroy();
    }
  }

  /**
   * 渲染子弹
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   */
  render(ctx) {
    if (!this.isActive || !this.visible) return;

    // 绘制轨迹
    this.renderTrail(ctx);

    // 绘制子弹主体
    ctx.save();
    ctx.translate(this.x + this.width/2, this.y + this.height/2);

    // 根据类型绘制不同颜色
    switch (this.type) {
      case 'firewall':
        ctx.fillStyle = '#ff6b6b'; // 红色
        break;
      case 'encryption':
        ctx.fillStyle = '#4ecdc4'; // 青色
        break;
      case 'detection':
        ctx.fillStyle = '#45b7d1'; // 蓝色
        break;
      case 'education':
        ctx.fillStyle = '#96ceb4'; // 绿色
        break;
      default:
        ctx.fillStyle = '#feca57'; // 黄色
    }

    // 绘制子弹形状
    this.drawBulletShape(ctx);

    ctx.restore();
  }

  /**
   * 绘制子弹形状
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   */
  drawBulletShape(ctx) {
    switch (this.type) {
      case 'firewall':
        // 绘制防火墙子弹（盾牌形状）
        ctx.beginPath();
        ctx.moveTo(0, -this.height/2);
        ctx.lineTo(this.width/2, -this.height/4);
        ctx.lineTo(this.width/2, this.height/4);
        ctx.lineTo(0, this.height/2);
        ctx.lineTo(-this.width/2, this.height/4);
        ctx.lineTo(-this.width/2, -this.height/4);
        ctx.closePath();
        ctx.fill();
        break;
      case 'encryption':
        // 绘制加密子弹（锁形状）
        ctx.beginPath();
        ctx.arc(0, 0, this.width/3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(-this.width/4, -this.height/4, this.width/2, this.height/2);
        break;
      case 'detection':
        // 绘制检测子弹（雷达形状）
        ctx.beginPath();
        ctx.arc(0, 0, this.width/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, this.width/3, 0, Math.PI);
        ctx.stroke();
        break;
      case 'education':
        // 绘制教育子弹（书本形状）
        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(-this.width/2, -this.height/2, this.width, this.height);
        break;
      default:
        // 绘制普通子弹（矩形）
        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
    }
  }

  /**
   * 绘制子弹轨迹
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   */
  renderTrail(ctx) {
    if (this.trail.length < 2) return;

    ctx.save();
    ctx.strokeStyle = this.getTrailColor();
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    ctx.beginPath();
    this.trail.forEach((point, index) => {
      const alpha = index / this.trail.length;
      ctx.strokeStyle = this.getTrailColor(alpha);
      
      if (index === 0) {
        ctx.moveTo(point.x + this.width/2, point.y + this.height/2);
      } else {
        ctx.lineTo(point.x + this.width/2, point.y + this.height/2);
      }
    });
    ctx.stroke();
    ctx.restore();
  }

  /**
   * 获取轨迹颜色
   * @param {number} alpha - 透明度
   * @returns {string} 颜色值
   */
  getTrailColor(alpha = 1) {
    const baseColor = this.getBulletColor();
    return alpha < 1 ? `${baseColor}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}` : baseColor;
  }

  /**
   * 获取子弹颜色
   * @returns {string} 颜色值
   */
  getBulletColor() {
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
   * 销毁子弹
   */
  destroy() {
    this.isActive = false;
    GameGlobal.databus.removeBullets(this);
  }
}
