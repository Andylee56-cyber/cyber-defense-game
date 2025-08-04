import './render'; // 初始化Canvas
import Commander from './player/index'; // 导入指挥官类
import Threat from './npc/enemy'; // 导入威胁类
import BackGround from './runtime/background'; // 导入背景类
import GameInfo from './runtime/gameinfo'; // 导入游戏UI类
import DefenseIntro from './runtime/defenseIntro'; // 导入防御介绍界面
import GameEnd from './runtime/gameEnd'; // 导入游戏结束界面
import KnowledgePage from './runtime/knowledge'; // 导入知识库页面
import LoginPage from './runtime/login'; // 导入登录界面
import DataBus from './databus'; // 导入数据类

GameGlobal.databus = new DataBus();

/**
 * 游戏主函数 - 智能守护者联盟
 */
export default class Main {
  aniId = 0;
  bg = new BackGround();
  commander = new Commander();
  gameInfo = new GameInfo();
  defenseIntro = new DefenseIntro();
  gameEnd = new GameEnd();
  knowledgePage = new KnowledgePage();
  loginPage = new LoginPage(); // 登录界面
  isPaused = false; // 游戏暂停状态
  gameStarted = false; // 游戏是否已开始

  constructor() {
    GameGlobal.gameInfo = this.gameInfo;
    GameGlobal.commander = this.commander;
    GameGlobal.defenseIntro = this.defenseIntro;
    GameGlobal.gameEnd = this.gameEnd;
    GameGlobal.knowledgePage = this.knowledgePage;
    GameGlobal.loginPage = this.loginPage;
    GameGlobal.main = this;

    this.gameInfo.on('restart', this.start.bind(this));
    this.gameInfo.on('agentSelected', this.handleAgentSelection.bind(this));
    this.gameInfo.on('agentDeselected', this.handleAgentDeselection.bind(this));
    this.gameInfo.on('showDefenseIntro', this.showDefenseIntro.bind(this));
    this.gameInfo.on('pauseGame', this.pauseGame.bind(this));
    this.gameInfo.on('resumeGame', this.resumeGame.bind(this));
    this.gameInfo.on('showKnowledgeBase', this.showKnowledgeBase.bind(this));

    // 直接启动游戏，跳过登录界面
    this.gameStarted = true;
    this.start();
    this.loop();
  }

  handleAgentSelection(agentType) {
    this.commander.handleAgentSelection(agentType);
  }

  handleAgentDeselection(agentType) {
    this.commander.selectedAgentType = null;
  }

  showDefenseIntro(defenseType) {
    this.defenseIntro.show(defenseType);
  }

  showKnowledgeBase() {
    this.knowledgePage.show();
    // 暂停游戏
    this.isPaused = true;
    console.log('📚 知识库已打开，游戏已暂停');
  }

  /**
   * 关闭知识库并恢复游戏
   */
  closeKnowledgeBase() {
    this.knowledgePage.hide();
    // 恢复游戏
    this.isPaused = false;
    console.log('📚 知识库已关闭，游戏已恢复');
  }

  pauseGame() {
    this.isPaused = true;
    console.log('⏸️ 游戏已暂停');
  }

  resumeGame() {
    this.isPaused = false;
    console.log('▶️ 游戏已恢复');
  }

  start() {
    GameGlobal.databus.reset();
    this.commander.init();
    this.defenseIntro.hide();
    this.gameStarted = true;
    // 确保登录界面被隐藏
    if (this.loginPage) {
      this.loginPage.hide();
    }
    console.log('🎮 游戏开始！');
  }

  threatGenerate() {
    // 游戏开始时立即生成威胁，每15帧生成一个威胁，进一步缩短生成间隔
    if (GameGlobal.databus.frame % 15 === 0) {
      // 确保同一时间只生成一个威胁
      if (GameGlobal.databus.threats.length === 0) { // 只有当前没有威胁时才生成新威胁
        const threat = GameGlobal.databus.pool.getItemByClass('threat', Threat);
        
        // 按顺序生成威胁类型
        const threatTypes = ['phishing', 'malware', 'ddos', 'data_leak'];
        const currentThreatType = threatTypes[Math.floor(GameGlobal.databus.frame / 180) % threatTypes.length];
        
        threat.init({ type: currentThreatType });
        GameGlobal.databus.addThreat(threat);
        
        // 设置当前威胁类型，用于Agent选择验证
        GameGlobal.databus.currentThreatType = currentThreatType;
        
        // 添加威胁遭遇记录
        GameGlobal.databus.addThreatEncounter(currentThreatType);
        
        console.log(`🔄 生成威胁: ${currentThreatType}`);
        console.log(`💡 提示: 请选择对应的Agent类型来防御`);
        console.log(`📊 当前威胁数量: ${GameGlobal.databus.threats.length}`);
      }
    }
    
    // 移除额外的随机威胁生成，确保只有一种类型的威胁
  }

  collisionDetection() {
    GameGlobal.databus.bullets.forEach((bullet) => {
      GameGlobal.databus.threats.forEach((threat) => {
        // 简化碰撞检测，减少调试信息，提高性能
        if (threat.isCollideWith(bullet)) {
          // 只要击中就能造成伤害，不再检查防御类型匹配
          const defenseType = this.commander.selectedAgentType;
          const damageDealt = threat.takeDamage(bullet.damage, defenseType);
          
          // 检查防御类型是否正确并生成知识记录
          if (GameGlobal.databus.currentThreatType) {
            if (GameGlobal.databus.isCorrectDefense(GameGlobal.databus.currentThreatType, defenseType)) {
              GameGlobal.databus.addDefenseSuccess(defenseType);
            } else {
              GameGlobal.databus.addDefenseFailure(defenseType);
            }
          }
          
          // 如果威胁被消灭，给予奖励并处理重置逻辑
          if (damageDealt && threat.health <= 0) {
            console.log(`💥 威胁被消灭! 防御类型: ${defenseType}`);
            // 移除这里的得分逻辑，避免重复计算
            GameGlobal.databus.removeThreat(threat); // 这会触发重置逻辑
          }
          
          bullet.destroy();
        }
      });
    });

    // 指挥官与威胁碰撞检测
    GameGlobal.databus.threats.forEach((threat) => {
      if (this.commander.isCollideWith(threat)) {
        this.commander.destroy();
        GameGlobal.databus.updateSecurityLevel(-10);
        GameGlobal.databus.removeThreat(threat);
      }
    });

    // 威胁超出边界检测
    GameGlobal.databus.threats.forEach((threat) => {
      if (threat.y >= canvas.height) {
        GameGlobal.databus.updateSecurityLevel(-2); // 减少扣分
        GameGlobal.databus.removeThreat(threat);
      }
    });

    // 检查游戏结束条件
    this.checkGameEnd();
  }

  checkGameEnd() {
    const wrongCount = GameGlobal.databus.getWrongAnswerCount();
    const correctCount = GameGlobal.databus.getCorrectAnswerCount();

    // 错误10次以上停止游戏
    if (wrongCount >= 10) {
      console.log('❌ 错误次数过多，游戏结束！');
      // 显示游戏结束界面
      this.gameEnd.showGameOver({
        score: GameGlobal.databus.score,
        securityLevel: GameGlobal.databus.securityLevel,
        knowledgePoints: GameGlobal.databus.knowledgePoints,
        wrongCount: wrongCount,
        correctCount: correctCount
      });
    }

    // 得分超过100分获得荣誉
    if (GameGlobal.databus.score >= 100 && !GameGlobal.databus.honorAwarded) {
      console.log('🏆 恭喜得分超过100分，获得"网络守护者"荣誉！');
      GameGlobal.databus.honorAwarded = true;
      this.showHonorAward();
    }

    // 得分超过200分获得最终荣誉
    if (GameGlobal.databus.score >= 200 && !GameGlobal.databus.finalHonorAwarded) {
      console.log('🏆 恭喜得分超过200分，获得"网络安全大师"最终荣誉！');
      GameGlobal.databus.finalHonorAwarded = true;
      this.showFinalHonorAward();
    }

    // 正确15次以上获得荣誉
    if (correctCount >= 15 && !GameGlobal.databus.agentGuardAwarded) {
      console.log('🏆 恭喜获得"Agent卫士"荣誉！');
      GameGlobal.databus.agentGuardAwarded = true;
      GameGlobal.databus.addScore('honor', 100);
    }
  }

  /**
   * 显示荣誉授予界面
   */
  showHonorAward() {
    console.log('🎖️ 显示荣誉授予界面');
    
    // 暂停游戏
    this.isPaused = true;
    
    // 显示荣誉授予界面
    this.gameEnd.showHonorAward({
      score: GameGlobal.databus.score,
      securityLevel: GameGlobal.databus.securityLevel,
      knowledgePoints: GameGlobal.databus.knowledgePoints,
      honorType: '网络守护者',
      honorDescription: '恭喜您成功防御了100分以上的威胁，展现了卓越的网络安全意识！'
    });
  }

  /**
   * 显示最终荣誉授予界面
   */
  showFinalHonorAward() {
    console.log('🎖️ 显示最终荣誉授予界面');
    
    // 暂停游戏
    this.isPaused = true;
    
    // 显示最终荣誉授予界面
    this.gameEnd.showFinalHonorAward({
      score: GameGlobal.databus.score,
      securityLevel: GameGlobal.databus.securityLevel,
      knowledgePoints: GameGlobal.databus.knowledgePoints,
      honorType: '网络安全大师',
      honorDescription: '恭喜您成功防御了200分以上的威胁，您已成为网络安全领域的真正大师！'
    });
  }

  render() {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 直接渲染游戏界面，跳过登录界面
    this.bg.render(ctx);
    this.commander.render(ctx);
    GameGlobal.databus.bullets.forEach((item) => item.render(ctx));
    GameGlobal.databus.threats.forEach((item) => item.render(ctx));
    this.gameInfo.render(ctx);
    this.defenseIntro.render(ctx);
    this.gameEnd.render(ctx);
    this.knowledgePage.render(ctx);
  }

  update() {
    // 如果游戏暂停，只更新背景和UI，不更新游戏逻辑
    if (this.isPaused) {
      this.bg.update();
      this.defenseIntro.update();
      this.gameEnd.update();
      return;
    }

    GameGlobal.databus.frame++;

    if (GameGlobal.databus.isGameOver) {
      return;
    }

    this.bg.update();
    this.commander.update();
    GameGlobal.databus.bullets.forEach((item) => item.update());
    GameGlobal.databus.threats.forEach((item) => item.update());
    this.defenseIntro.update();
    this.gameEnd.update();

    this.threatGenerate();
    this.collisionDetection();
  }

  loop() {
    this.update();
    this.render();
    this.aniId = requestAnimationFrame(this.loop.bind(this));
  }
}
