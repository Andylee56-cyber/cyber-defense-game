import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';

/**
 * 背景类
 * 提供游戏背景
 */
export default class BackGround {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.time = 0;
    
    // 网格参数
    this.gridSize = 40;
    this.gridAlpha = 0.3;
    
    // 粒子系统
    this.particles = [];
    this.maxParticles = 50;
    
    // 扫描线效果
    this.scanLineY = 0;
    this.scanLineSpeed = 2;
    
    // 数据流效果
    this.dataStreams = [];
    this.maxDataStreams = 8;
    
    // 初始化
    this.init();
  }

  init() {
    // 初始化粒子
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push({
        x: Math.random() * SCREEN_WIDTH,
        y: Math.random() * SCREEN_HEIGHT,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.5 + 0.2,
        color: this.getRandomTechColor()
      });
    }

    // 初始化数据流
    for (let i = 0; i < this.maxDataStreams; i++) {
      this.dataStreams.push({
        x: Math.random() * SCREEN_WIDTH,
        y: -50,
        speed: Math.random() * 3 + 2,
        width: Math.random() * 100 + 50,
        height: Math.random() * 20 + 10,
        alpha: Math.random() * 0.3 + 0.1,
        color: this.getRandomTechColor()
      });
    }
  }

  getRandomTechColor() {
    const colors = [
      '#00ffff', // 青色
      '#0080ff', // 蓝色
      '#8000ff', // 紫色
      '#ff0080', // 粉色
      '#00ff80', // 绿色
      '#ff8000', // 橙色
      '#ffff00'  // 黄色
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.time += 0.016;
    
    // 更新扫描线
    this.scanLineY += this.scanLineSpeed;
    if (this.scanLineY > SCREEN_HEIGHT) {
      this.scanLineY = -50;
    }

    // 更新粒子
    this.particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // 边界检查
      if (particle.x < 0 || particle.x > SCREEN_WIDTH) particle.vx *= -1;
      if (particle.y < 0 || particle.y > SCREEN_HEIGHT) particle.vy *= -1;
      
      // 闪烁效果
      particle.alpha = 0.2 + 0.3 * Math.sin(this.time * 2 + particle.x * 0.01);
    });

    // 更新数据流
    this.dataStreams.forEach(stream => {
      stream.y += stream.speed;
      if (stream.y > SCREEN_HEIGHT + 100) {
        stream.y = -100;
        stream.x = Math.random() * SCREEN_WIDTH;
      }
    });
  }

  render(ctx) {
    // 绘制渐变背景
    this.drawGradientBackground(ctx);
    
    // 绘制网格
    this.drawGrid(ctx);
    
    // 绘制分区线
    this.drawDivisionLine(ctx);
    
    // 绘制粒子
    this.drawParticles(ctx);
    
    // 绘制数据流
    this.drawDataStreams(ctx);
    
    // 绘制扫描线
    this.drawScanLine(ctx);
    
    // 绘制边缘光效
    this.drawEdgeGlow(ctx);
  }

  drawGradientBackground(ctx) {
    // 左半边 - 科技蓝渐变
    const leftGradient = ctx.createLinearGradient(0, 0, SCREEN_WIDTH/2, 0);
    leftGradient.addColorStop(0, 'rgba(0, 20, 40, 0.8)');
    leftGradient.addColorStop(1, 'rgba(0, 40, 80, 0.6)');
    
    ctx.fillStyle = leftGradient;
    ctx.fillRect(0, 0, SCREEN_WIDTH/2, SCREEN_HEIGHT);

    // 右半边 - 更科幻的渐变背景，包含多种颜色层次
    const rightGradient = ctx.createLinearGradient(SCREEN_WIDTH/2, 0, SCREEN_WIDTH, 0);
    rightGradient.addColorStop(0, 'rgba(30, 15, 60, 0.8)');
    rightGradient.addColorStop(0.3, 'rgba(50, 25, 100, 0.7)');
    rightGradient.addColorStop(0.6, 'rgba(80, 40, 150, 0.6)');
    rightGradient.addColorStop(0.8, 'rgba(100, 50, 200, 0.5)');
    rightGradient.addColorStop(1, 'rgba(120, 60, 250, 0.6)');
    
    ctx.fillStyle = rightGradient;
    ctx.fillRect(SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2, SCREEN_HEIGHT);
    
    // 添加科幻光效层
    const glowGradient = ctx.createRadialGradient(SCREEN_WIDTH * 0.75, SCREEN_HEIGHT * 0.3, 0, SCREEN_WIDTH * 0.75, SCREEN_HEIGHT * 0.3, 200);
    glowGradient.addColorStop(0, 'rgba(0, 255, 255, 0.1)');
    glowGradient.addColorStop(0.5, 'rgba(100, 100, 255, 0.05)');
    glowGradient.addColorStop(1, 'rgba(200, 100, 255, 0)');
    
    ctx.fillStyle = glowGradient;
    ctx.fillRect(SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2, SCREEN_HEIGHT);
  }

  drawGrid(ctx) {
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    
    // 绘制垂直线
    for (let x = 0; x <= SCREEN_WIDTH; x += this.gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, SCREEN_HEIGHT);
      ctx.stroke();
    }
    
    // 绘制水平线
    for (let y = 0; y <= SCREEN_HEIGHT; y += this.gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(SCREEN_WIDTH, y);
      ctx.stroke();
    }
  }

  drawDivisionLine(ctx) {
    // 绘制中央分割线
    const centerX = SCREEN_WIDTH / 2;
    
    // 主分割线
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, SCREEN_HEIGHT);
    ctx.stroke();
    
    // 分割线光效
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX - 2, 0);
    ctx.lineTo(centerX - 2, SCREEN_HEIGHT);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(centerX + 2, 0);
    ctx.lineTo(centerX + 2, SCREEN_HEIGHT);
    ctx.stroke();
  }

  drawParticles(ctx) {
    this.particles.forEach(particle => {
      ctx.save();
      ctx.globalAlpha = particle.alpha;
      ctx.fillStyle = particle.color;
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  drawDataStreams(ctx) {
    this.dataStreams.forEach(stream => {
      ctx.save();
      ctx.globalAlpha = stream.alpha;
      ctx.fillStyle = stream.color;
      ctx.shadowColor = stream.color;
      ctx.shadowBlur = 10;
      ctx.fillRect(stream.x, stream.y, stream.width, stream.height);
      ctx.restore();
    });
  }

  drawScanLine(ctx) {
    // 绘制扫描线
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.moveTo(0, this.scanLineY);
    ctx.lineTo(SCREEN_WIDTH, this.scanLineY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // 扫描线光效
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, this.scanLineY - 1);
    ctx.lineTo(SCREEN_WIDTH, this.scanLineY - 1);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, this.scanLineY + 1);
    ctx.lineTo(SCREEN_WIDTH, this.scanLineY + 1);
    ctx.stroke();
  }

  drawEdgeGlow(ctx) {
    // 绘制边缘光效
    const glowGradient = ctx.createLinearGradient(0, 0, 0, SCREEN_HEIGHT);
    glowGradient.addColorStop(0, 'rgba(0, 255, 255, 0.1)');
    glowGradient.addColorStop(0.5, 'rgba(0, 255, 255, 0)');
    glowGradient.addColorStop(1, 'rgba(0, 255, 255, 0.1)');
    
    ctx.fillStyle = glowGradient;
    ctx.fillRect(0, 0, 20, SCREEN_HEIGHT);
    ctx.fillRect(SCREEN_WIDTH - 20, 0, 20, SCREEN_HEIGHT);
  }
}
