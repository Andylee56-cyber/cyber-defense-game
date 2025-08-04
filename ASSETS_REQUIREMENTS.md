# 智能守护者联盟 - 游戏素材需求清单

## 音频素材

### 背景音乐
- `audio/bgm.mp3` - 主背景音乐（科技感、紧张但不恐怖）
- `audio/menu_bgm.mp3` - 菜单背景音乐（轻松、科技感）

### 音效
- `audio/bullet.mp3` - 射击音效（已有）
- `audio/boom.mp3` - 爆炸音效（已有）
- `audio/defense.mp3` - 防御音效（新增）
- `audio/deploy.mp3` - Agent部署音效（新增）
- `audio/alert.mp3` - 威胁警报音效（新增）
- `audio/level.mp3` - 安全等级变化音效（新增）
- `audio/button.mp3` - 按钮点击音效（新增）
- `audio/achievement.mp3` - 成就解锁音效（新增）

## 图片素材

### 角色素材
- `images/hero.png` - 指挥官角色（已有）
- `images/agent_firewall.png` - 防火墙Agent图标（新增）
- `images/agent_encryption.png` - 加密Agent图标（新增）
- `images/agent_detection.png` - 检测Agent图标（新增）
- `images/agent_education.png` - 教育Agent图标（新增）

### 威胁素材
- `images/threat_phishing.png` - 钓鱼攻击图标（新增）
- `images/threat_malware.png` - 恶意软件图标（新增）
- `images/threat_ddos.png` - DDoS攻击图标（新增）
- `images/threat_data_leak.png` - 数据泄露图标（新增）

### UI素材
- `images/bg.jpg` - 背景图片（已有）
- `images/ui_button.png` - 按钮背景（新增）
- `images/ui_panel.png` - 面板背景（新增）
- `images/ui_energy_bar.png` - 能量条背景（新增）
- `images/ui_security_bar.png` - 安全等级条背景（新增）

### 特效素材
- `images/explosion1.png` - 爆炸特效（已有）
- `images/explosion2.png` - 爆炸特效（已有）
- `images/explosion3.png` - 爆炸特效（已有）
- `images/explosion4.png` - 爆炸特效（已有）
- `images/explosion5.png` - 爆炸特效（已有）
- `images/explosion6.png` - 爆炸特效（已有）
- `images/explosion7.png` - 爆炸特效（已有）
- `images/explosion8.png` - 爆炸特效（已有）
- `images/explosion9.png` - 爆炸特效（已有）
- `images/explosion10.png` - 爆炸特效（已有）
- `images/explosion11.png` - 爆炸特效（已有）
- `images/explosion12.png` - 爆炸特效（已有）
- `images/explosion13.png` - 爆炸特效（已有）
- `images/explosion14.png` - 爆炸特效（已有）
- `images/explosion15.png` - 爆炸特效（已有）
- `images/explosion16.png` - 爆炸特效（已有）
- `images/explosion17.png` - 爆炸特效（已有）
- `images/explosion18.png` - 爆炸特效（已有）
- `images/explosion19.png` - 爆炸特效（已有）

### 子弹素材
- `images/bullet.png` - 基础子弹（已有）
- `images/bullet_firewall.png` - 防火墙子弹（新增）
- `images/bullet_encryption.png` - 加密子弹（新增）
- `images/bullet_detection.png` - 检测子弹（新增）
- `images/bullet_education.png` - 教育子弹（新增）

## 素材规格要求

### 图片规格
- **角色素材**: 80x80px, PNG格式，透明背景
- **威胁素材**: 60x60px, PNG格式，透明背景
- **Agent图标**: 40x40px, PNG格式，透明背景
- **子弹素材**: 16x30px, PNG格式，透明背景
- **UI素材**: 根据实际需要，PNG格式
- **特效素材**: 64x64px, PNG格式，透明背景

### 音频规格
- **背景音乐**: MP3格式，128kbps，时长2-3分钟
- **音效**: MP3格式，128kbps，时长0.5-2秒

### 设计风格
- **整体风格**: 科技感、现代、简洁
- **色彩方案**: 
  - 主色调：蓝色系 (#3498db)
  - 辅助色：绿色 (#27ae60)、橙色 (#f39c12)、红色 (#e74c3c)
  - 背景色：深色系 (#2c3e50)
- **图标风格**: 扁平化设计，简洁明了
- **字体**: 系统默认字体，确保清晰度

## 优先级

### 高优先级（必需）
1. Agent图标素材
2. 威胁图标素材
3. 基础UI素材
4. 新增音效

### 中优先级（重要）
1. 子弹素材
2. 按钮和面板UI
3. 能量条和安全等级条

### 低优先级（可选）
1. 更多特效素材
2. 菜单背景音乐
3. 成就图标

## 注意事项

1. **文件大小**: 单个图片文件不超过50KB，音频文件不超过500KB
2. **兼容性**: 确保在微信小程序环境中正常显示
3. **性能**: 图片素材尽量使用PNG格式，音频使用MP3格式
4. **命名规范**: 使用英文命名，下划线分隔
5. **版权**: 确保所有素材拥有合法使用权

## 替代方案

如果无法获得专业素材，可以使用以下替代方案：

1. **图标**: 使用Unicode符号或CSS绘制简单图标
2. **音效**: 使用Web Audio API生成简单音效
3. **背景**: 使用CSS渐变或纯色背景
4. **特效**: 使用Canvas绘制简单动画效果

这样可以确保游戏的基本功能正常运行，后续再逐步替换为专业素材。 