import Emitter from '../libs/tinyemitter';

/**
 * 游戏基础的精灵类
 */
export default class Sprite extends Emitter {
  visible = true; // 是否可见
  isActive = true; // 是否可碰撞

  constructor(imgSrc = '', width = 0, height = 0, x = 0, y = 0) {
    super();
    
    this.img = wx.createImage();
    this.img.src = imgSrc;

    this.width = width;
    this.height = height;

    this.x = x;
    this.y = y;

    this.visible = true;
  }

  /**
   * 将精灵图绘制在canvas上
   */
  render(ctx) {
    if (!this.visible) return;

    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * 改进的碰撞检测定义：
   * 使用矩形碰撞检测，检查两个矩形是否重叠
   * 增加容错性，提高射击精度
   * @param{Sprite} sp: Sprite的实例
   */
  isCollideWith(sp) {
    // 不可见则不检测
    if (!this.visible || !sp.visible) return false;
    // 不可碰撞则不检测
    if (!this.isActive || !sp.isActive) return false;

    // 矩形碰撞检测：检查两个矩形是否重叠
    const thisLeft = this.x;
    const thisRight = this.x + this.width;
    const thisTop = this.y;
    const thisBottom = this.y + this.height;

    const spLeft = sp.x;
    const spRight = sp.x + sp.width;
    const spTop = sp.y;
    const spBottom = sp.y + sp.height;

    // 增加容错性，稍微扩大碰撞范围
    const tolerance = 2; // 2像素的容错范围
    
    const expandedThisLeft = thisLeft - tolerance;
    const expandedThisRight = thisRight + tolerance;
    const expandedThisTop = thisTop - tolerance;
    const expandedThisBottom = thisBottom + tolerance;
    
    const expandedSpLeft = spLeft - tolerance;
    const expandedSpRight = spRight + tolerance;
    const expandedSpTop = spTop - tolerance;
    const expandedSpBottom = spBottom + tolerance;

    // 如果两个矩形不重叠，则没有碰撞
    const hasCollision = !(
      expandedThisRight < expandedSpLeft ||
      expandedThisLeft > expandedSpRight ||
      expandedThisBottom < expandedSpTop ||
      expandedThisTop > expandedSpBottom
    );
    
    // 添加调试信息
    if (hasCollision) {
      console.log(`🎯 精确碰撞检测成功!`);
      console.log(`   子弹范围: (${thisLeft}, ${thisTop}) 到 (${thisRight}, ${thisBottom})`);
      console.log(`   威胁范围: (${spLeft}, ${spTop}) 到 (${spRight}, ${spBottom})`);
      console.log(`   容错范围: ${tolerance}px`);
    }
    
    return hasCollision;
  }
}
