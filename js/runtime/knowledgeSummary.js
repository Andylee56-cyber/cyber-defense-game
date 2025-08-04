import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';

export default class KnowledgeSummary {
  constructor() {
    this.isVisible = false;
    this.fadeInTime = 0;
    this.isFadingIn = false;
    this.scrollY = 0;
    this.maxScrollY = 0;
    this.wrongAnswers = [];
    this.knowledgePoints = [];
  }

  show() {
    this.isVisible = true;
    this.isFadingIn = true;
    this.fadeInTime = 0;
    this.scrollY = 0;
    this.updateContent();
  }

  hide() {
    this.isVisible = false;
  }

  updateContent() {
    if (GameGlobal.databus) {
      this.wrongAnswers = GameGlobal.databus.getWrongAnswers() || [];
      this.knowledgePoints = GameGlobal.databus.getKnowledgePoints() || [];
    }
  }

  handleTouch(x, y) {
    if (!this.isVisible) return;

    const closeButtonX = SCREEN_WIDTH - 60;
    const closeButtonY = 60;
    const closeButtonSize = 40;

    if (x >= closeButtonX && x <= closeButtonX + closeButtonSize &&
        y >= closeButtonY && y <= closeButtonY + closeButtonSize) {
      this.hide();
      return;
    }

    const panelWidth = SCREEN_WIDTH * 0.8;
    const panelHeight = SCREEN_HEIGHT * 0.7;
    const panelX = (SCREEN_WIDTH - panelWidth) / 2;
    const panelY = (SCREEN_HEIGHT - panelHeight) / 2;

    if (x >= panelX && x <= panelX + panelWidth &&
        y >= panelY && y <= panelY + panelHeight) {
      const scrollSpeed = 20;
      if (y < panelY + panelHeight / 2) {
        this.scrollY = Math.max(0, this.scrollY - scrollSpeed);
      } else {
        this.scrollY = Math.min(this.maxScrollY, this.scrollY + scrollSpeed);
      }
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

    const gradient = ctx.createLinearGradient(panelX, panelY, panelX + panelWidth, panelY + panelHeight);
    gradient.addColorStop(0, `rgba(20, 40, 80, ${alpha})`);
    gradient.addColorStop(1, `rgba(10, 20, 40, ${alpha})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);

    ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
    ctx.lineWidth = 2;
    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

    ctx.shadowColor = 'rgba(0, 255, 255, 0.5)';
    ctx.shadowBlur = 10;
    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);
    ctx.shadowBlur = 0;

    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('📚 知识点总结', panelX + panelWidth / 2, panelY + 40);

    ctx.save();
    ctx.beginPath();
    ctx.rect(panelX + 20, panelY + 60, panelWidth - 40, panelHeight - 80);
    ctx.clip();

    let y = panelY + 80 - this.scrollY;

    if (this.wrongAnswers.length > 0) {
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'left';
      ctx.fillStyle = `rgba(255, 100, 100, ${alpha})`;
      ctx.fillText('❌ 错误记录:', panelX + 30, y);
      y += 30;

      ctx.font = '14px Arial';
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;

      this.wrongAnswers.forEach((record, index) => {
        if (y > panelY + panelHeight - 20) return;

        ctx.fillText(`${index + 1}. ${record.threatName}`, panelX + 30, y);
        y += 20;
        ctx.fillText(`   错误防御: ${record.wrongDefense}`, panelX + 50, y);
        y += 20;
        ctx.fillText(`   正确防御: ${record.correctDefense}`, panelX + 50, y);
        y += 20;
        ctx.fillText(`   知识点: ${record.knowledgeTip}`, panelX + 50, y);
        y += 30;
      });
    }

    if (this.knowledgePoints.length > 0) {
      y += 20;
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'left';
      ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
      ctx.fillText('💡 学习要点:', panelX + 30, y);
      y += 30;

      ctx.font = '14px Arial';
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;

      this.knowledgePoints.forEach((point, index) => {
        if (y > panelY + panelHeight - 20) return;

        ctx.fillText(`${index + 1}. ${point}`, panelX + 30, y);
        y += 25;
      });
    }

    y += 30;
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = `rgba(255, 255, 0, ${alpha})`;
    ctx.fillText(`总错误次数: ${this.wrongAnswers.length}`, panelX + 30, y);
    y += 25;
    ctx.fillText(`学习要点数: ${this.knowledgePoints.length}`, panelX + 30, y);

    this.maxScrollY = Math.max(0, y - panelY - panelHeight + 100);

    ctx.restore();
  }

  renderCloseButton(ctx, alpha) {
    const buttonX = SCREEN_WIDTH - 60;
    const buttonY = 60;
    const buttonSize = 40;

    ctx.fillStyle = `rgba(255, 100, 100, ${alpha})`;
    ctx.fillRect(buttonX, buttonY, buttonSize, buttonSize);

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