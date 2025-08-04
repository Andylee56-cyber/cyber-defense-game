import Pool from './base/pool';

let instance;

/**
 * 全局状态管理器
 * 管理游戏中的各种数据
 */
export default class DataBus {
  constructor() {
    if (instance) return instance;

    instance = this;

    this.pool = new Pool();
    this.reset();
  }

  reset() {
    this.frame = 0;
    this.score = 0;
    this.bullets = [];
    this.threats = [];
    this.agents = [];
    this.animations = [];
    this.gameOver = false;
    this.isGameOver = false;

    // 游戏核心数据 - 优化初始值
    this.securityLevel = 100; // 安全等级，游戏核心指标
    this.energy = 300; // 初始能量值，给予充足能量开始游戏
    this.maxEnergy = 300; // 最大能量值
    this.energyRegenRate = 1.0; // 能量恢复速率，加快恢复
    this.knowledgePoints = []; // 知识点数组，确保是数组类型
    this.currentLevel = 1; // 当前关卡

    // 分数系统
    this.scoreMultiplier = 1; // 分数倍数
    this.comboCount = 0; // 连击数
    this.maxCombo = 0; // 最大连击数

    // 知识普及系统
    this.knowledgeBase = {
      phishing: {
        title: '钓鱼攻击防护',
        content: [
          '钓鱼攻击是指攻击者伪装成可信的个人或公司，通过电子邮件、短信等方式诱导受害者点击恶意链接或下载恶意文件。',
          '防护措施：',
          '1. 仔细检查发件人地址，注意拼写错误',
          '2. 不要点击来源不明的链接',
          '3. 不要下载来源不明的附件',
          '4. 使用安全软件进行防护',
          '5. 定期更新密码，启用双因素认证'
        ],
        unlocked: false,
        pointsRequired: 50
      },
      malware: {
        title: '恶意软件防护',
        content: [
          '恶意软件包括病毒、木马、勒索软件等，会窃取信息、破坏系统或勒索钱财。',
          '防护措施：',
          '1. 安装并更新防病毒软件',
          '2. 不要下载来源不明的文件',
          '3. 保持操作系统和软件更新',
          '4. 定期备份重要数据',
          '5. 使用防火墙和入侵检测系统'
        ],
        unlocked: false,
        pointsRequired: 100
      },
      ddos: {
        title: 'DDoS攻击防护',
        content: [
          'DDoS（分布式拒绝服务）攻击通过大量请求使目标服务器无法正常提供服务。',
          '防护措施：',
          '1. 使用CDN服务分散流量',
          '2. 配置负载均衡器',
          '3. 实施流量清洗',
          '4. 使用DDoS防护服务',
          '5. 监控网络流量异常'
        ],
        unlocked: false,
        pointsRequired: 200
      },
      data_leak: {
        title: '数据泄露防护',
        content: [
          '数据泄露是指敏感信息被未授权访问或泄露，可能导致隐私泄露和财务损失。',
          '防护措施：',
          '1. 加密存储敏感数据',
          '2. 实施访问控制策略',
          '3. 定期备份重要数据',
          '4. 监控数据访问日志',
          '5. 员工安全培训'
        ],
        unlocked: false,
        pointsRequired: 300
      }
    };

    // 知识记录系统
    this.knowledgeRecords = []; // 知识点记录
    this.wrongAnswers = []; // 错误答案记录
    this.correctAnswers = []; // 正确答案记录
    this.currentThreatType = null; // 当前威胁类型
    this.wrongAnswerCount = 0;
    this.correctAnswerCount = 0;
    
    // 荣誉系统
    this.honorAwarded = false; // 网络守护者荣誉是否已授予
    this.agentGuardAwarded = false; // Agent卫士荣誉是否已授予
    this.finalHonorAwarded = false; // 最终荣誉是否已授予（200分）

    // 添加一些测试知识记录
    this.addTestKnowledgeRecords();

    // Agent相关
    this.agentTypes = {
      FIREWALL: 'firewall',
      ENCRYPTION: 'encryption', 
      DETECTION: 'detection',
      EDUCATION: 'education'
    };

    // 威胁类型
    this.threatTypes = {
      PHISHING: 'phishing',
      MALWARE: 'malware',
      DDOS: 'ddos',
      DATA_LEAK: 'data_leak'
    };

    // 游戏设置 - 优化成本
    this.maxAgents = 4; // 最大Agent数量
    this.agentDeployCost = 50; // Agent部署成本，降低门槛
    this.bulletShootCost = 3; // 子弹发射成本，降低门槛
    this.agentSpecialCost = 30; // 特殊技能成本，降低门槛
  }

  /**
   * 回收敌人，进入对象池
   */
  removeThreat(threat) {
    let temp = this.threats.shift();
    temp.visible = false;
    this.pool.recover('threat', temp);
  }

  /**
   * 回收子弹，进入对象池
   */
  removeBullets(bullet) {
    let temp = this.bullets.shift();
    temp.visible = false;
    this.pool.recover('bullet', temp);
  }

  /**
   * 添加Agent
   */
  addAgent(agent) {
    this.agents.push(agent);
  }

  /**
   * 移除Agent
   */
  removeAgent(agent) {
    const index = this.agents.indexOf(agent);
    if (index > -1) {
      this.agents.splice(index, 1);
    }
  }

  /**
   * 添加威胁
   */
  addThreat(threat) {
    this.threats.push(threat);
  }

  /**
   * 移除威胁
   */
  removeThreat(threat) {
    const index = this.threats.indexOf(threat);
    if (index > -1) {
      this.threats.splice(index, 1);
      
      // 如果所有威胁都被消灭，重置Agent选择状态
      if (this.threats.length === 0) {
        console.log('🎉 当前类型威胁已全部消灭！');
        console.log('⏸️ 等待下一类威胁出现，请重新选择Agent');
        
        // 重置指挥官的选择状态
        if (GameGlobal.commander) {
          GameGlobal.commander.selectedAgentType = null;
        }
        
        // 清除当前威胁类型
        this.currentThreatType = null;
      }
    }
  }

  /**
   * 添加子弹
   */
  addBullets(bullet) {
    this.bullets.push(bullet);
  }

  /**
   * 更新安全等级
   * @param {number} delta - 安全等级变化值
   */
  updateSecurityLevel(delta) {
    this.securityLevel = Math.max(0, Math.min(100, this.securityLevel + delta));
    
    // 如果安全等级降到0，游戏结束
    if (this.securityLevel <= 0) {
      this.isGameOver = true;
      this.gameOver = true;
    }
  }

  /**
   * 更新能量值
   * @param {number} delta - 能量变化值
   */
  updateEnergy(delta) {
    this.energy = Math.max(0, Math.min(this.maxEnergy, this.energy + delta));
  }

  /**
   * 增加知识点数
   * @param {number} points - 增加的点数
   */
  addKnowledgePoints(points) {
    this.knowledgePoints += points;
    
    // 检查是否解锁新的知识内容
    this.checkKnowledgeUnlock();
  }

  /**
   * 检查知识解锁
   */
  checkKnowledgeUnlock() {
    Object.keys(this.knowledgeBase).forEach(key => {
      const knowledge = this.knowledgeBase[key];
      if (!knowledge.unlocked && this.knowledgePoints >= knowledge.pointsRequired) {
        knowledge.unlocked = true;
        console.log(`🎉 解锁新知识: ${knowledge.title}`);
        this.showKnowledgeNotification(knowledge.title);
      }
    });
  }

  /**
   * 显示知识解锁通知
   * @param {string} title - 知识标题
   */
  showKnowledgeNotification(title) {
    // 这里可以添加UI通知
    console.log(`📚 新知识已解锁: ${title}`);
  }

  /**
   * 获取分数
   * @param {string} action - 动作类型
   * @param {number} baseScore - 基础分数
   */
  addScore(action, baseScore = 1) {
    let score = baseScore;
    
    // 根据动作类型调整分数
    switch (action) {
      case 'threat_destroy':
        score = 10; // 消灭威胁得分10分
        this.comboCount++; // 增加连击
        break;
      case 'agent_deploy':
        score = 20; // 部署Agent分数
        break;
      case 'security_maintain':
        score = Math.floor(this.securityLevel / 10); // 安全等级奖励
        break;
      case 'combo_bonus':
        score = this.comboCount * 5; // 连击奖励
        break;
    }
    
    // 应用倍数
    score *= this.scoreMultiplier;
    
    this.score += score;
    
    // 更新最大连击数
    if (this.comboCount > this.maxCombo) {
      this.maxCombo = this.comboCount;
    }
    
    console.log(`得分: +${score} (${action})`);
  }

  /**
   * 重置连击
   */
  resetCombo() {
    this.comboCount = 0;
  }

  /**
   * 检查是否有足够能量部署Agent
   * @returns {boolean} 是否有足够能量
   */
  canDeployAgent() {
    return this.energy >= this.agentDeployCost && this.agents.length < this.maxAgents;
  }

  /**
   * 检查是否有足够能量发射子弹
   * @returns {boolean} 是否有足够能量
   */
  canShootBullet() {
    return this.energy >= this.bulletShootCost;
  }

  /**
   * 检查是否有足够能量使用特殊技能
   * @returns {boolean} 是否有足够能量
   */
  canUseSpecialAbility() {
    return this.energy >= this.agentSpecialCost;
  }

  /**
   * 消耗能量部署Agent
   * @returns {boolean} 是否成功部署
   */
  consumeEnergyForAgent() {
    if (this.canDeployAgent()) {
      this.updateEnergy(-this.agentDeployCost);
      return true;
    }
    return false;
  }

  /**
   * 消耗能量发射子弹
   * @returns {boolean} 是否成功发射
   */
  consumeEnergyForBullet() {
    if (this.canShootBullet()) {
      this.updateEnergy(-this.bulletShootCost);
      return true;
    }
    return false;
  }

  /**
   * 消耗能量使用特殊技能
   * @returns {boolean} 是否成功使用
   */
  consumeEnergyForSpecial() {
    if (this.canUseSpecialAbility()) {
      this.updateEnergy(-this.agentSpecialCost);
      return true;
    }
    return false;
  }

  /**
   * 自动恢复能量
   */
  regenerateEnergy() {
    if (this.energy < this.maxEnergy) {
      this.updateEnergy(this.energyRegenRate);
    }
  }

  /**
   * 获取知识普及内容
   * @returns {Object} 知识库内容
   */
  getKnowledgeBase() {
    return this.knowledgeBase;
  }

  /**
   * 获取已解锁的知识
   * @returns {Array} 已解锁的知识列表
   */
  getUnlockedKnowledge() {
    return Object.values(this.knowledgeBase).filter(knowledge => knowledge.unlocked);
  }

  /**
   * 获取游戏统计信息
   * @returns {Object} 游戏统计
   */
  getGameStats() {
    return {
      score: this.score,
      securityLevel: this.securityLevel,
      knowledgePoints: this.knowledgePoints,
      maxCombo: this.maxCombo,
      agentsDeployed: this.agents.length,
      threatsDestroyed: this.score / 10, // 估算消灭的威胁数
      unlockedKnowledge: this.getUnlockedKnowledge().length
    };
  }

  /**
   * 添加错误记录
   * @param {Object} record - 错误记录
   */
  addWrongAnswer(record) {
    // 添加时间戳
    record.timestamp = new Date().toLocaleString();
    record.id = Date.now();
    
    this.wrongAnswers.push(record);
    this.wrongAnswerCount++;
    
    // 添加到知识记录
    const knowledgeRecord = {
      id: Date.now(),
      point: record.knowledgeTip,
      timestamp: record.timestamp,
      type: 'error',
      threatName: record.threatName,
      wrongDefense: record.wrongDefense,
      correctDefense: record.correctDefense
    };
    
    this.knowledgeRecords.push(knowledgeRecord);
    
    console.log(`❌ 错误记录: ${record.threatName} - 错误防御: ${record.wrongDefense}, 正确防御: ${record.correctDefense}`);
  }

  /**
   * 添加知识点
   * @param {string} point - 知识点
   */
  addKnowledgePoint(point) {
    // 添加到知识点记录
    const record = {
      id: Date.now(),
      point: point,
      timestamp: new Date().toLocaleString(),
      type: 'knowledge'
    };
    
    this.knowledgeRecords.push(record);
    
    if (!this.knowledgePoints.includes(point)) {
      this.knowledgePoints.push(point);
      console.log(`💡 新增知识点: ${point}`);
    }
  }

  /**
   * 获取错误记录
   * @returns {Array} 错误记录数组
   */
  getWrongAnswers() {
    return this.wrongAnswers;
  }

  /**
   * 获取知识点
   * @returns {Array} 知识点数组
   */
  getKnowledgePoints() {
    return this.knowledgePoints;
  }

  /**
   * 获取错误次数
   * @returns {number} 错误次数
   */
  getWrongAnswerCount() {
    return this.wrongAnswerCount;
  }

  /**
   * 获取正确次数
   * @returns {number} 正确次数
   */
  getCorrectAnswerCount() {
    return this.correctAnswerCount;
  }

  /**
   * 添加测试知识记录
   */
  addTestKnowledgeRecords() {
    // 不再添加固定的测试记录，而是基于游戏表现动态生成
    console.log('📚 知识库系统已初始化，将基于游戏表现生成记录');
  }

  /**
   * 基于游戏表现生成知识记录
   * @param {string} threatType - 威胁类型
   * @param {string} defenseType - 防御类型
   * @param {boolean} isCorrect - 是否正确防御
   */
  generateKnowledgeRecord(threatType, defenseType, isCorrect) {
    const threatNames = {
      'phishing': '钓鱼攻击',
      'malware': '恶意软件',
      'ddos': 'DDoS攻击',
      'data_leak': '数据泄露'
    };

    const defenseNames = {
      'firewall': '防火墙守护者',
      'detection': '威胁检测者',
      'education': '用户教育官',
      'encryption': '数据加密师'
    };

    const threatName = threatNames[threatType] || threatType;
    const defenseName = defenseNames[defenseType] || defenseType;

    if (isCorrect) {
      // 正确防御记录
      const knowledgeTips = {
        'phishing': '钓鱼攻击主要通过社会工程学手段，用户教育官能够提升用户安全意识，有效识别和防范钓鱼攻击。',
        'malware': '恶意软件需要实时检测和隔离，威胁检测者能够监控网络流量并识别潜在威胁。',
        'ddos': 'DDoS攻击通过大量请求使服务器瘫痪，防火墙守护者能够阻挡恶意流量并保护网络边界。',
        'data_leak': '数据泄露需要严格的访问控制和加密保护，数据加密师能够保护敏感数据并确保信息安全传输。'
      };

      const record = {
        id: Date.now(),
        point: knowledgeTips[threatType] || `成功防御了${threatName}，使用了正确的${defenseName}策略。`,
        timestamp: new Date().toLocaleString(),
        type: 'correct',
        threatName: threatName,
        defenseType: defenseName
      };

      this.knowledgeRecords.push(record);
      console.log(`✅ 正确防御记录: ${threatName} - ${defenseName}`);
    } else {
      // 错误防御记录
      const correctDefenses = {
        'phishing': 'education',
        'malware': 'detection',
        'ddos': 'firewall',
        'data_leak': 'encryption'
      };

      const correctDefenseName = defenseNames[correctDefenses[threatType]] || '未知';

      const record = {
        id: Date.now(),
        point: `防御${threatName}时使用了错误的${defenseName}，应该使用${correctDefenseName}。`,
        timestamp: new Date().toLocaleString(),
        type: 'wrong',
        threatName: threatName,
        wrongDefense: defenseName,
        correctDefense: correctDefenseName
      };

      this.knowledgeRecords.push(record);
      console.log(`❌ 错误防御记录: ${threatName} - 错误使用${defenseName}，应该使用${correctDefenseName}`);
    }
  }

  /**
   * 添加威胁遭遇记录
   * @param {string} threatType - 威胁类型
   */
  addThreatEncounter(threatType) {
    const threatNames = {
      'phishing': '钓鱼攻击',
      'malware': '恶意软件',
      'ddos': 'DDoS攻击',
      'data_leak': '数据泄露'
    };

    const threatName = threatNames[threatType] || threatType;
    
    // 检查是否已有相同威胁的记录
    const existingRecord = this.knowledgeRecords.find(r => 
      r.type === 'knowledge' && r.point.includes(threatName)
    );

    if (!existingRecord) {
      const knowledgePoints = {
        'phishing': '钓鱼攻击是最常见的网络威胁之一，攻击者伪装成可信来源诱导用户点击恶意链接或提供敏感信息。用户教育官能够提升用户安全意识，有效防范此类攻击。',
        'malware': '恶意软件包括病毒、木马、勒索软件等，会窃取信息、破坏系统或勒索用户。威胁检测者能够实时监控网络流量，识别并隔离恶意软件。',
        'ddos': 'DDoS攻击通过大量请求使目标服务器无法正常提供服务，影响业务连续性。防火墙守护者能够阻挡恶意流量，保护网络边界安全。',
        'data_leak': '数据泄露是指敏感信息被未授权访问或泄露，可能导致隐私泄露和合规问题。数据加密师能够保护敏感数据，确保信息安全传输和存储。'
      };

      const record = {
        id: Date.now(),
        point: knowledgePoints[threatType] || `发现了新的威胁类型: ${threatName}`,
        timestamp: new Date().toLocaleString(),
        type: 'knowledge',
        threatType: threatType
      };

      this.knowledgeRecords.push(record);
      console.log(`📚 新增威胁知识: ${threatName}`);
    }
  }

  /**
   * 检查防御类型是否正确
   * @param {string} threatType - 威胁类型
   * @param {string} defenseType - 防御类型
   * @returns {boolean} 是否正确
   */
  isCorrectDefense(threatType, defenseType) {
    const correctDefenses = {
      'phishing': 'education',
      'malware': 'detection',
      'ddos': 'firewall',
      'data_leak': 'encryption'
    };
    
    return correctDefenses[threatType] === defenseType;
  }

  /**
   * 添加防御成功记录
   * @param {string} defenseType - 防御类型
   */
  addDefenseSuccess(defenseType) {
    if (this.currentThreatType && this.isCorrectDefense(this.currentThreatType, defenseType)) {
      this.generateKnowledgeRecord(this.currentThreatType, defenseType, true);
      this.correctAnswerCount++;
    }
  }

  /**
   * 添加防御失败记录
   * @param {string} defenseType - 防御类型
   */
  addDefenseFailure(defenseType) {
    if (this.currentThreatType && !this.isCorrectDefense(this.currentThreatType, defenseType)) {
      this.generateKnowledgeRecord(this.currentThreatType, defenseType, false);
      this.wrongAnswerCount++;
    }
  }
}
