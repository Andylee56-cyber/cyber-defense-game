import DataBus from '../databus';

/**
 * 登录界面类
 */
export default class LoginPage {
  constructor() {
    this.visible = true;
    this.username = '';
    this.password = '';
    this.errorMessage = '';
    this.showError = false;
    this.errorTimer = 0;
    this.loginSuccess = false;
    this.successTimer = 0;
    
    // 输入框状态 - 默认聚焦用户名输入框
    this.usernameFocused = true;
    this.passwordFocused = false;
    this.currentInput = 'username'; // 'username' 或 'password'
    
    // 动画相关
    this.particles = [];
    this.createParticles();
    
    // 绑定事件
    this.bindEvents();
    
    console.log('🔐 登录界面初始化完成，默认聚焦用户名输入框');
  }

  /**
   * 创建粒子效果
   */
  createParticles() {
    for (let i = 0; i < 30; i++) {
      this.particles.push({
        x: Math.random() * GameGlobal.canvas.width,
        y: Math.random() * GameGlobal.canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.5 + 0.3
      });
    }
  }

  /**
   * 绑定触摸事件
   */
  bindEvents() {
    // 微信小游戏使用 wx.onTouchStart
    if (typeof wx !== 'undefined') {
      wx.onTouchStart(this.handleTouch.bind(this));
      // 添加键盘事件监听
      wx.onKeyboardInput && wx.onKeyboardInput(this.handleKeydown.bind(this));
    } else {
      // 浏览器环境
      GameGlobal.canvas.addEventListener('touchstart', this.handleTouch.bind(this));
      GameGlobal.canvas.addEventListener('click', this.handleClick.bind(this));
      
      // 确保键盘事件绑定到document上
      document.removeEventListener('keydown', this.handleKeydown.bind(this));
      document.addEventListener('keydown', this.handleKeydown.bind(this));
      
      // 确保canvas可以获得焦点
      GameGlobal.canvas.tabIndex = 1;
      GameGlobal.canvas.style.outline = 'none';
      
      console.log('🔧 键盘事件已绑定到document');
    }
  }

  /**
   * 处理触摸事件
   */
  handleTouch(e) {
    if (!this.visible) return;
    
    let x, y;
    
    if (typeof wx !== 'undefined') {
      // 微信小游戏环境
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else {
      // 浏览器环境
      const touch = e.touches[0];
      const rect = GameGlobal.canvas.getBoundingClientRect();
      x = touch.clientX - rect.left;
      y = touch.clientY - rect.top;
    }
    
    this.handleClickAt(x, y);
  }

  /**
   * 处理点击事件
   */
  handleClick(e) {
    if (!this.visible) return;
    
    const rect = GameGlobal.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    this.handleClickAt(x, y);
  }

  /**
   * 处理指定坐标的点击
   */
  handleClickAt(x, y) {
    // 检查用户名输入框
    if (this.isInUsernameInput(x, y)) {
      this.currentInput = 'username';
      this.usernameFocused = true;
      this.passwordFocused = false;
      console.log('🔍 点击用户名输入框');
      return;
    }
    
    // 检查密码输入框
    if (this.isInPasswordInput(x, y)) {
      this.currentInput = 'password';
      this.passwordFocused = true;
      this.usernameFocused = false;
      console.log('🔍 点击密码输入框，密码长度:', this.password.length);
      return;
    }
    
    // 检查登录按钮
    if (this.isInLoginButton(x, y)) {
      this.handleLogin();
      return;
    }
    
    // 点击其他地方，取消焦点
    this.usernameFocused = false;
    this.passwordFocused = false;
    console.log('🔍 点击其他区域，取消焦点');
  }

  /**
   * 处理键盘事件
   */
  handleKeydown(e) {
    if (!this.visible) return;
    
    console.log('⌨️ 键盘事件:', e.key, '当前输入框:', this.currentInput, '事件类型:', e.type);
    
    // 阻止默认行为，防止页面滚动等
    e.preventDefault();
    
    if (e.key === 'Enter') {
      this.handleLogin();
      return;
    }
    
    if (e.key === 'Tab') {
      // 切换输入框
      this.currentInput = this.currentInput === 'username' ? 'password' : 'username';
      this.usernameFocused = this.currentInput === 'username';
      this.passwordFocused = this.currentInput === 'password';
      console.log('🔄 切换到输入框:', this.currentInput);
      return;
    }
    
    // 处理字符输入 - 放宽限制，允许更多字符
    if (e.key.length === 1 && e.key.charCodeAt(0) >= 32) {
      if (this.currentInput === 'username') {
        this.username += e.key;
        console.log('📝 用户名输入:', this.username);
      } else if (this.currentInput === 'password') {
        this.password += e.key;
        console.log('📝 密码输入:', '*'.repeat(this.password.length), '密码长度:', this.password.length);
      }
    }
    
    // 处理退格键
    if (e.key === 'Backspace') {
      if (this.currentInput === 'username') {
        this.username = this.username.slice(0, -1);
        console.log('🗑️ 删除用户名字符:', this.username);
      } else if (this.currentInput === 'password') {
        this.password = this.password.slice(0, -1);
        console.log('🗑️ 删除密码字符:', '*'.repeat(this.password.length), '密码长度:', this.password.length);
      }
    }
    
    // 处理删除键
    if (e.key === 'Delete') {
      if (this.currentInput === 'username') {
        this.username = '';
        console.log('🗑️ 清空用户名');
      } else if (this.currentInput === 'password') {
        this.password = '';
        console.log('🗑️ 清空密码');
      }
    }
  }

  /**
   * 检查是否在用户名输入框内
   */
  isInUsernameInput(x, y) {
    const centerX = GameGlobal.canvas.width / 2;
    const centerY = GameGlobal.canvas.height / 2 + 30;
    return x >= centerX - 150 && x <= centerX + 150 &&
           y >= centerY - 25 && y <= centerY + 25;
  }

  /**
   * 检查是否在密码输入框内
   */
  isInPasswordInput(x, y) {
    const centerX = GameGlobal.canvas.width / 2;
    const centerY = GameGlobal.canvas.height / 2 + 100;
    return x >= centerX - 150 && x <= centerX + 150 &&
           y >= centerY - 25 && y <= centerY + 25;
  }

  /**
   * 检查是否在登录按钮内
   */
  isInLoginButton(x, y) {
    const centerX = GameGlobal.canvas.width / 2;
    const centerY = GameGlobal.canvas.height / 2 + 180;
    return x >= centerX - 100 && x <= centerX + 100 &&
           y >= centerY - 25 && y <= centerY + 25;
  }

  /**
   * 处理登录
   */
  handleLogin() {
    if (this.username === 'user' && this.password === '123') {
      // 登录成功
      this.loginSuccess = true;
      this.successTimer = 60; // 60帧的动画
      console.log('🔐 登录成功！');
      
      // 延迟后隐藏登录界面
      setTimeout(() => {
        this.visible = false;
        GameGlobal.main.start();
      }, 2000);
    } else {
      // 登录失败
      this.errorMessage = '用户名或密码错误';
      this.showError = true;
      this.errorTimer = 180; // 3秒后隐藏错误信息
      console.log('❌ 登录失败：', this.username, this.password);
    }
  }

  /**
   * 更新
   */
  update() {
    if (!this.visible) return;
    
    // 更新粒子
    this.particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      if (particle.x < 0 || particle.x > GameGlobal.canvas.width) {
        particle.vx = -particle.vx;
      }
      if (particle.y < 0 || particle.y > GameGlobal.canvas.height) {
        particle.vy = -particle.vy;
      }
    });
    
    // 更新错误信息显示
    if (this.errorTimer > 0) {
      this.errorTimer--;
      if (this.errorTimer === 0) {
        this.showError = false;
      }
    }
    
    // 更新成功动画
    if (this.successTimer > 0) {
      this.successTimer--;
    }
  }

  /**
   * 渲染
   */
  render(ctx) {
    if (!this.visible) return;
    
    // 绘制背景
    this.renderBackground(ctx);
    
    // 绘制粒子
    this.renderParticles(ctx);
    
    // 绘制标题
    this.renderTitle(ctx);
    
    // 绘制登录表单
    this.renderLoginForm(ctx);
    
    // 绘制错误信息
    if (this.showError) {
      this.renderError(ctx);
    }
    
    // 绘制成功动画
    if (this.loginSuccess) {
      this.renderSuccess(ctx);
    }
  }

  /**
   * 渲染背景
   */
  renderBackground(ctx) {
    // 渐变背景
    const gradient = ctx.createLinearGradient(0, 0, 0, GameGlobal.canvas.height);
    gradient.addColorStop(0, '#0a0a2a');
    gradient.addColorStop(0.5, '#1a1a4a');
    gradient.addColorStop(1, '#0a0a2a');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, GameGlobal.canvas.width, GameGlobal.canvas.height);
    
    // 网格背景
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    for (let x = 0; x <= GameGlobal.canvas.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, GameGlobal.canvas.height);
      ctx.stroke();
    }
    
    for (let y = 0; y <= GameGlobal.canvas.height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(GameGlobal.canvas.width, y);
      ctx.stroke();
    }
  }

  /**
   * 渲染粒子
   */
  renderParticles(ctx) {
    this.particles.forEach(particle => {
      ctx.save();
      ctx.globalAlpha = particle.alpha;
      ctx.fillStyle = '#00ffff';
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  /**
   * 渲染标题
   */
  renderTitle(ctx) {
    const centerX = GameGlobal.canvas.width / 2;
    const centerY = GameGlobal.canvas.height / 2 - 200;
    
    // 主标题
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 10;
    ctx.fillText('网络安全防御系统', centerX, centerY);
    
    // 副标题
    ctx.fillStyle = '#00ffff';
    ctx.font = '16px Arial';
    ctx.shadowBlur = 5;
    ctx.fillText('CYBER SECURITY DEFENSE SYSTEM', centerX, centerY + 30);
    
    ctx.shadowBlur = 0;
  }

  /**
   * 渲染登录表单
   */
  renderLoginForm(ctx) {
    const centerX = GameGlobal.canvas.width / 2;
    const centerY = GameGlobal.canvas.height / 2;
    
    // 表单背景
    ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 10;
    
    const formWidth = 320;
    const formHeight = 280;
    const formX = centerX - formWidth / 2;
    const formY = centerY - formHeight / 2;
    
    ctx.fillRect(formX, formY, formWidth, formHeight);
    ctx.strokeRect(formX, formY, formWidth, formHeight);
    
    ctx.shadowBlur = 0;
    
    // 用户名输入框
    this.renderInput(ctx, centerX, centerY + 30, '用户名', this.username, this.usernameFocused);
    
    // 密码输入框
    this.renderInput(ctx, centerX, centerY + 100, '密码', '*'.repeat(this.password.length), this.passwordFocused);
    
    // 登录按钮
    this.renderLoginButton(ctx, centerX, centerY + 180);
  }

  /**
   * 渲染输入框
   */
  renderInput(ctx, x, y, label, value, focused) {
    const inputWidth = 200;
    const inputHeight = 40;
    
    // 标签
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(label, x - inputWidth / 2, y - 15);
    
    // 输入框背景
    ctx.fillStyle = focused ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.3)';
    ctx.strokeStyle = focused ? '#ffffff' : '#00ffff';
    ctx.lineWidth = focused ? 2 : 1;
    
    ctx.fillRect(x - inputWidth / 2, y - 10, inputWidth, inputHeight);
    ctx.strokeRect(x - inputWidth / 2, y - 10, inputWidth, inputHeight);
    
    // 输入内容
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    
    // 调试信息：如果是密码框，显示调试信息
    if (label === '密码') {
      console.log('🔍 渲染密码框:', {
        value: value,
        valueLength: value.length,
        passwordLength: this.password.length,
        focused: focused,
        password: this.password
      });
    }
    
    ctx.fillText(value, x - inputWidth / 2 + 10, y + 10);
    
    // 光标
    if (focused) {
      const textWidth = ctx.measureText(value).width;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - inputWidth / 2 + 10 + textWidth, y - 5);
      ctx.lineTo(x - inputWidth / 2 + 10 + textWidth, y + 5);
      ctx.stroke();
    }
  }

  /**
   * 渲染登录按钮
   */
  renderLoginButton(ctx, x, y) {
    const buttonWidth = 200;
    const buttonHeight = 50;
    
    // 按钮背景
    const gradient = ctx.createLinearGradient(x - buttonWidth / 2, y, x + buttonWidth / 2, y);
    gradient.addColorStop(0, '#00ffff');
    gradient.addColorStop(1, '#0080ff');
    
    ctx.fillStyle = gradient;
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 10;
    ctx.fillRect(x - buttonWidth / 2, y - buttonHeight / 2, buttonWidth, buttonHeight);
    ctx.shadowBlur = 0;
    
    // 按钮文字
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('登录系统', x, y + 5);
  }

  /**
   * 渲染错误信息
   */
  renderError(ctx) {
    const centerX = GameGlobal.canvas.width / 2;
    const centerY = GameGlobal.canvas.height / 2 + 280;
    
    ctx.fillStyle = '#ff6b6b';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(this.errorMessage, centerX, centerY);
  }

  /**
   * 渲染成功动画
   */
  renderSuccess(ctx) {
    const centerX = GameGlobal.canvas.width / 2;
    const centerY = GameGlobal.canvas.height / 2 + 200;
    
    // 成功文字
    ctx.fillStyle = '#00ff00';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('登录成功...', centerX, centerY);
    
    // 进度条
    const progress = 1 - (this.successTimer / 60);
    const barWidth = 200;
    const barHeight = 10;
    
    ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
    ctx.fillRect(centerX - barWidth / 2, centerY + 20, barWidth, barHeight);
    
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(centerX - barWidth / 2, centerY + 20, barWidth * progress, barHeight);
  }

  /**
   * 隐藏登录界面
   */
  hide() {
    this.visible = false;
  }

  /**
   * 显示登录界面
   */
  show() {
    this.visible = true;
    this.username = '';
    this.password = '';
    this.errorMessage = '';
    this.showError = false;
    this.loginSuccess = false;
    this.usernameFocused = true;
    this.passwordFocused = false;
    this.currentInput = 'username';
    
    console.log('🔐 登录界面已显示，聚焦用户名输入框');
  }
} 