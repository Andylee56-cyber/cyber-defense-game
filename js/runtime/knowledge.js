import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';

/**
 * 知识库页面类
 * 负责显示知识记录、统计信息和学习历史
 */
export default class KnowledgePage {
  constructor() {
    this.isVisible = false;
    this.records = [];
    this.currentPage = 0;
    this.recordsPerPage = 8;
    this.scrollOffset = 0;
    this.maxScrollOffset = 0;
  }

  /**
   * 显示知识库页面
   */
  show() {
    this.isVisible = true;
    this.records = GameGlobal.databus ? GameGlobal.databus.knowledgeRecords : [];
    this.currentPage = 0;
    this.scrollOffset = 0;
    this.calculateMaxScrollOffset();
    console.log('📚 知识库页面已打开');
    console.log('📊 知识记录数量:', this.records.length);
  }

  /**
   * 隐藏知识库页面
   */
  hide() {
    this.isVisible = false;
    console.log('📚 知识库页面已关闭');
  }

  /**
   * 计算最大滚动偏移量
   */
  calculateMaxScrollOffset() {
    const totalHeight = this.records.length * 60; // 每条记录60px高度
    const visibleHeight = SCREEN_HEIGHT - 200; // 减去顶部和底部空间
    this.maxScrollOffset = Math.max(0, totalHeight - visibleHeight);
  }

  /**
   * 处理触摸事件
   * @param {number} x - 触摸X坐标
   * @param {number} y - 触摸Y坐标
   */
  handleTouch(x, y) {
    if (!this.isVisible) return;

    // 关闭按钮
    const closeButtonWidth = 120;
    const closeButtonHeight = 40;
    const closeButtonX = SCREEN_WIDTH - closeButtonWidth - 20;
    const closeButtonY = 80; // 下移到合适位置，避免与右上角重叠

    if (x >= closeButtonX && x <= closeButtonX + closeButtonWidth &&
        y >= closeButtonY && y <= closeButtonY + closeButtonHeight) {
      // 直接关闭知识库并回到主游戏界面，不跳转到任何其他界面
      this.hide();
      if (GameGlobal.main) {
        GameGlobal.main.isPaused = false; // 确保游戏恢复
        console.log('📚 知识库已关闭，直接回到主游戏界面');
      }
      return;
    }

    // 上一页按钮
    const prevButtonWidth = 80;
    const prevButtonHeight = 30;
    const prevButtonX = 20;
    const prevButtonY = SCREEN_HEIGHT - 50;

    if (x >= prevButtonX && x <= prevButtonX + prevButtonWidth &&
        y >= prevButtonY && y <= prevButtonY + prevButtonHeight) {
      if (this.currentPage > 0) {
        this.currentPage--;
        console.log('📄 上一页');
      }
      return;
    }

    // 下一页按钮
    const nextButtonWidth = 80;
    const nextButtonHeight = 30;
    const nextButtonX = SCREEN_WIDTH - nextButtonWidth - 20;
    const nextButtonY = SCREEN_HEIGHT - 50;

    if (x >= nextButtonX && x <= nextButtonX + nextButtonWidth &&
        y >= nextButtonY && y <= nextButtonY + nextButtonHeight) {
      const maxPage = Math.ceil(this.records.length / this.recordsPerPage) - 1;
      if (this.currentPage < maxPage) {
        this.currentPage++;
        console.log('📄 下一页');
      }
      return;
    }

    // 滚动区域
    const scrollAreaX = 20;
    const scrollAreaY = 80;
    const scrollAreaWidth = SCREEN_WIDTH - 40;
    const scrollAreaHeight = SCREEN_HEIGHT - 200;

    if (x >= scrollAreaX && x <= scrollAreaX + scrollAreaWidth &&
        y >= scrollAreaY && y <= scrollAreaY + scrollAreaHeight) {
      // 处理滚动
      const relativeY = y - scrollAreaY;
      const scrollRatio = relativeY / scrollAreaHeight;
      this.scrollOffset = scrollRatio * this.maxScrollOffset;
      console.log('📜 滚动到:', Math.round(this.scrollOffset));
    }
  }

  /**
   * 渲染知识库页面
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   */
  render(ctx) {
    if (!this.isVisible) return;

    // 绘制背景遮罩
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // 绘制主面板
    const panelWidth = SCREEN_WIDTH - 40;
    const panelHeight = SCREEN_HEIGHT - 40;
    const panelX = 20;
    const panelY = 20;

    // 面板背景
    const gradient = ctx.createLinearGradient(panelX, panelY, panelX + panelWidth, panelY + panelHeight);
    gradient.addColorStop(0, 'rgba(0, 20, 40, 0.95)');
    gradient.addColorStop(1, 'rgba(0, 40, 80, 0.9)');
    ctx.fillStyle = gradient;
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);

    // 面板边框
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 3;
    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

    // 标题
    ctx.fillStyle = '#00ffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('📚 知识库', SCREEN_WIDTH / 2, 50);

    // 统计信息
    this.renderStatistics(ctx);

    // 知识记录列表
    this.renderRecords(ctx);

    // 分页信息
    this.renderPagination(ctx);

    // 关闭按钮
    this.renderCloseButton(ctx);

    // 导航按钮
    this.renderNavigationButtons(ctx);

    ctx.restore();
  }

  /**
   * 渲染统计信息
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   */
  renderStatistics(ctx) {
    const statsY = 70;
    const statsHeight = 40;

    // 统计背景
    ctx.fillStyle = 'rgba(0, 100, 200, 0.3)';
    ctx.fillRect(30, statsY, SCREEN_WIDTH - 60, statsHeight);

    // 统计文字
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';

    const totalRecords = this.records.length;
    const correctRecords = this.records.filter(r => r.type === 'correct').length;
    const wrongRecords = this.records.filter(r => r.type === 'wrong').length;
    const knowledgeRecords = this.records.filter(r => r.type === 'knowledge').length;

    ctx.fillText(`总记录: ${totalRecords}`, 50, statsY + 15);
    ctx.fillText(`正确: ${correctRecords}`, 200, statsY + 15);
    ctx.fillText(`错误: ${wrongRecords}`, 300, statsY + 15);
    ctx.fillText(`知识点: ${knowledgeRecords}`, 400, statsY + 15);
  }

  /**
   * 渲染知识记录列表
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   */
  renderRecords(ctx) {
    const startY = 130;
    const recordHeight = 80; // 增加记录高度以容纳多行文本
    const visibleRecords = Math.floor((SCREEN_HEIGHT - 250) / recordHeight);

    // 计算显示的记录范围
    const startIndex = Math.floor(this.scrollOffset / recordHeight);
    const endIndex = Math.min(startIndex + visibleRecords, this.records.length);

    ctx.save();
    ctx.beginPath();
    ctx.rect(30, startY, SCREEN_WIDTH - 60, SCREEN_HEIGHT - 250);
    ctx.clip();

    for (let i = startIndex; i < endIndex; i++) {
      const record = this.records[i];
      const y = startY + (i - startIndex) * recordHeight - this.scrollOffset;

      if (y < startY - recordHeight || y > startY + SCREEN_HEIGHT - 250) continue;

      // 记录背景
      const recordColor = record.type === 'correct' ? 'rgba(0, 255, 0, 0.2)' :
                         record.type === 'wrong' ? 'rgba(255, 0, 0, 0.2)' :
                         'rgba(0, 100, 255, 0.2)';
      ctx.fillStyle = recordColor;
      ctx.fillRect(40, y, SCREEN_WIDTH - 80, recordHeight - 10);

      // 记录边框
      ctx.strokeStyle = record.type === 'correct' ? '#00ff00' :
                       record.type === 'wrong' ? '#ff0000' : '#0066ff';
      ctx.lineWidth = 1;
      ctx.strokeRect(40, y, SCREEN_WIDTH - 80, recordHeight - 10);

      // 记录内容
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';

      // 类型图标
      const typeIcon = record.type === 'correct' ? '✅' :
                      record.type === 'wrong' ? '❌' : '📚';
      ctx.fillText(typeIcon, 50, y + 20);

      // 记录文本
      let displayText = '';
      if (record.type === 'knowledge') {
        displayText = `知识点: ${record.point}`;
      } else if (record.type === 'wrong') {
        displayText = `错误防御: ${record.threatName} - 使用了${record.wrongDefense}，应该使用${record.correctDefense}`;
      } else {
        displayText = `正确防御: ${record.point || '成功防御威胁'}`;
      }

      // 文本换行处理
      this.renderWrappedText(ctx, displayText, 80, y + 20, SCREEN_WIDTH - 120, 16);

      // 时间戳
      if (record.timestamp) {
        const date = new Date(record.timestamp);
        const timeStr = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
        ctx.fillStyle = '#888888';
        ctx.font = '10px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(timeStr, SCREEN_WIDTH - 50, y + recordHeight - 15);
      }
    }

    ctx.restore();
  }

  /**
   * 渲染换行文本
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   * @param {string} text - 要渲染的文本
   * @param {number} x - 起始X坐标
   * @param {number} y - 起始Y坐标
   * @param {number} maxWidth - 最大宽度
   * @param {number} lineHeight - 行高
   */
  renderWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split('');
    let line = '';
    let currentY = y;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i];
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && line !== '') {
        ctx.fillText(line, x, currentY);
        line = words[i];
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    
    // 渲染最后一行
    if (line) {
      ctx.fillText(line, x, currentY);
    }
  }

  /**
   * 渲染分页信息
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   */
  renderPagination(ctx) {
    const maxPage = Math.ceil(this.records.length / this.recordsPerPage) - 1;
    const currentPage = this.currentPage + 1;
    const totalPages = maxPage + 1;

    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`第 ${currentPage} 页，共 ${totalPages} 页`, SCREEN_WIDTH / 2, SCREEN_HEIGHT - 80);
  }

  /**
   * 渲染关闭按钮
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   */
  renderCloseButton(ctx) {
    const buttonWidth = 120;
    const buttonHeight = 40;
    const buttonX = SCREEN_WIDTH - buttonWidth - 20;
    const buttonY = 80; // 下移到合适位置，避免与右上角重叠

    // 按钮背景
    const gradient = ctx.createLinearGradient(buttonX, buttonY, buttonX + buttonWidth, buttonY + buttonHeight);
    gradient.addColorStop(0, '#ff6b6b');
    gradient.addColorStop(1, '#c44569');
    ctx.fillStyle = gradient;
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

    // 按钮边框
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);

    // 按钮文字
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('关闭', buttonX + buttonWidth / 2, buttonY + buttonHeight / 2 + 5);
  }

  /**
   * 渲染导航按钮
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   */
  renderNavigationButtons(ctx) {
    const buttonWidth = 80;
    const buttonHeight = 30;
    const buttonY = SCREEN_HEIGHT - 50;

    // 上一页按钮
    const prevButtonX = 20;
    const prevGradient = ctx.createLinearGradient(prevButtonX, buttonY, prevButtonX + buttonWidth, buttonY + buttonHeight);
    prevGradient.addColorStop(0, this.currentPage > 0 ? '#4ecdc4' : '#666666');
    prevGradient.addColorStop(1, this.currentPage > 0 ? '#44a08d' : '#444444');
    ctx.fillStyle = prevGradient;
    ctx.fillRect(prevButtonX, buttonY, buttonWidth, buttonHeight);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(prevButtonX, buttonY, buttonWidth, buttonHeight);

    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('上一页', prevButtonX + buttonWidth / 2, buttonY + buttonHeight / 2 + 5);

    // 下一页按钮
    const maxPage = Math.ceil(this.records.length / this.recordsPerPage) - 1;
    const nextButtonX = SCREEN_WIDTH - buttonWidth - 20;
    const nextGradient = ctx.createLinearGradient(nextButtonX, buttonY, nextButtonX + buttonWidth, buttonY + buttonHeight);
    nextGradient.addColorStop(0, this.currentPage < maxPage ? '#4ecdc4' : '#666666');
    nextGradient.addColorStop(1, this.currentPage < maxPage ? '#44a08d' : '#444444');
    ctx.fillStyle = nextGradient;
    ctx.fillRect(nextButtonX, buttonY, buttonWidth, buttonHeight);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(nextButtonX, buttonY, buttonWidth, buttonHeight);

    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('下一页', nextButtonX + buttonWidth / 2, buttonY + buttonHeight / 2 + 5);
  }
} 