/**
 * 游戏配置文件
 * 包含关卡配置、知识库配置、Agent配置等
 */

// 关卡配置
export const LEVEL_CONFIG = {
  1: {
    name: '新手训练',
    description: '学习基本的网络安全概念',
    threats: ['phishing'],
    maxThreats: 10,
    securityLevelTarget: 80,
    knowledgePointsRequired: 0,
    agentTypes: ['firewall'],
    background: 'images/bg.jpg'
  },
  2: {
    name: '恶意软件防护',
    description: '识别和防御恶意软件攻击',
    threats: ['phishing', 'malware'],
    maxThreats: 15,
    securityLevelTarget: 75,
    knowledgePointsRequired: 50,
    agentTypes: ['firewall', 'detection'],
    background: 'images/bg.jpg'
  },
  3: {
    name: 'DDoS攻击防御',
    description: '应对分布式拒绝服务攻击',
    threats: ['ddos', 'malware'],
    maxThreats: 20,
    securityLevelTarget: 70,
    knowledgePointsRequired: 100,
    agentTypes: ['firewall', 'detection', 'encryption'],
    background: 'images/bg.jpg'
  },
  4: {
    name: '数据泄露防护',
    description: '保护敏感数据不被泄露',
    threats: ['data_leak', 'phishing', 'malware'],
    maxThreats: 25,
    securityLevelTarget: 65,
    knowledgePointsRequired: 200,
    agentTypes: ['firewall', 'detection', 'encryption', 'education'],
    background: 'images/bg.jpg'
  }
};

// 威胁类型配置
export const THREAT_CONFIG = {
  phishing: {
    name: '钓鱼攻击',
    description: '伪装成可信来源的恶意链接或邮件',
    health: 80,
    speed: 1.5,
    damage: 15,
    knowledgeTip: '警惕不明来源的链接，验证发件人身份',
    color: '#e74c3c',
    spawnRate: 0.3
  },
  malware: {
    name: '恶意软件',
    description: '病毒、木马、勒索软件等恶意程序',
    health: 100,
    speed: 2,
    damage: 20,
    knowledgeTip: '不要下载来源不明的文件，保持软件更新',
    color: '#8e44ad',
    spawnRate: 0.25
  },
  ddos: {
    name: 'DDoS攻击',
    description: '分布式拒绝服务攻击，使服务不可用',
    health: 150,
    speed: 1,
    damage: 25,
    knowledgeTip: '使用CDN和负载均衡来防护DDoS攻击',
    color: '#f39c12',
    spawnRate: 0.2
  },
  data_leak: {
    name: '数据泄露',
    description: '敏感信息被未授权访问或泄露',
    health: 120,
    speed: 2.5,
    damage: 30,
    knowledgeTip: '加密存储敏感数据，定期备份重要信息',
    color: '#e67e22',
    spawnRate: 0.15
  }
};

// Agent配置
export const AGENT_CONFIG = {
  firewall: {
    name: '防火墙守护者',
    description: '网络边界的第一道防线，阻挡恶意流量',
    type: 'firewall',
    level: 1,
    energy: 100,
    maxEnergy: 100,
    defensePower: 15,
    range: 120,
    maxCooldown: 25,
    specialAbility: 'firewall_boost',
    specialAbilityName: '防御增强',
    specialAbilityDescription: '临时提升所有Agent的防御力',
    cost: 30,
    color: '#ff6b6b'
  },
  encryption: {
    name: '数据加密师',
    description: '保护敏感数据，确保信息安全传输',
    type: 'encryption',
    level: 1,
    energy: 100,
    maxEnergy: 100,
    defensePower: 12,
    range: 100,
    maxCooldown: 30,
    specialAbility: 'encryption_field',
    specialAbilityName: '加密力场',
    specialAbilityDescription: '创建加密保护区域',
    cost: 30,
    color: '#4ecdc4'
  },
  detection: {
    name: '威胁检测者',
    description: '实时监控网络，识别潜在威胁',
    type: 'detection',
    level: 1,
    energy: 100,
    maxEnergy: 100,
    defensePower: 10,
    range: 150,
    maxCooldown: 35,
    specialAbility: 'threat_scan',
    specialAbilityName: '威胁扫描',
    specialAbilityDescription: '扫描并标记所有威胁',
    cost: 30,
    color: '#45b7d1'
  },
  education: {
    name: '用户教育官',
    description: '提升用户安全意识，预防人为错误',
    type: 'education',
    level: 1,
    energy: 100,
    maxEnergy: 100,
    defensePower: 8,
    range: 80,
    maxCooldown: 40,
    specialAbility: 'education_burst',
    specialAbilityName: '知识传播',
    specialAbilityDescription: '提升安全等级和知识点数',
    cost: 30,
    color: '#96ceb4'
  }
};

// 知识库配置
export const KNOWLEDGE_BASE = {
  phishing: {
    title: '钓鱼攻击防护',
    content: [
      '钓鱼攻击是指攻击者伪装成可信的个人或公司，通过电子邮件、短信等方式诱导受害者点击恶意链接或下载恶意文件。',
      '防护措施：',
      '1. 仔细检查发件人地址，注意拼写错误',
      '2. 不要点击来源不明的链接',
      '3. 不要下载来源不明的附件',
      '4. 使用安全软件进行防护',
      '5. 定期更新密码，启用双因素认证',
      '6. 提升用户安全意识（用户教育官）',
      '7. 培训员工识别钓鱼攻击特征'
    ],
    category: 'social_engineering',
    difficulty: 'easy',
    recommendedAgent: 'education'
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
      '5. 使用防火墙和入侵检测系统',
      '6. 实时监控网络流量（威胁检测者）',
      '7. 部署端点检测和响应系统'
    ],
    category: 'malware',
    difficulty: 'medium',
    recommendedAgent: 'detection'
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
      '5. 监控网络流量异常',
      '6. 部署防火墙阻挡恶意流量（防火墙守护者）',
      '7. 配置网络边界防护'
    ],
    category: 'network_attack',
    difficulty: 'hard',
    recommendedAgent: 'firewall'
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
      '5. 员工安全培训',
      '6. 数据加密传输（数据加密师）',
      '7. 实施数据分类和标记'
    ],
    category: 'data_protection',
    difficulty: 'hard',
    recommendedAgent: 'encryption'
  }
};

// 游戏设置
export const GAME_SETTINGS = {
  // 基础设置
  maxAgents: 4,
  maxEnergy: 100,
  energyRegenRate: 0.2,
  
  // 分数设置
  threatDestroyScore: 10,
  knowledgePointReward: 5,
  securityLevelBonus: 2,
  
  // 难度设置
  threatSpawnInterval: 30, // 缩短威胁生成间隔，从60帧改为30帧
  threatSpeedMultiplier: 1.5, // 增加威胁速度倍数
  agentDefenseCooldown: 20, // 减少Agent防御冷却时间
  
  // 音效设置
  bgmVolume: 0.3,
  sfxVolume: 0.5,
  
  // UI设置
  sidebarWidth: 200,
  topBarHeight: 60,
  bottomBarHeight: 80
};

// 成就系统配置
export const ACHIEVEMENTS = {
  firstDefense: {
    id: 'firstDefense',
    name: '初次防御',
    description: '成功防御第一个威胁',
    condition: 'defendFirstThreat',
    reward: 50
  },
  agentMaster: {
    id: 'agentMaster',
    name: 'Agent大师',
    description: '部署所有类型的Agent',
    condition: 'deployAllAgentTypes',
    reward: 100
  },
  securityGuardian: {
    id: 'securityGuardian',
    name: '安全守护者',
    description: '保持安全等级在90%以上持续60秒',
    condition: 'maintainHighSecurity',
    reward: 200
  },
  knowledgeSeeker: {
    id: 'knowledgeSeeker',
    name: '知识探索者',
    description: '获得1000个知识点',
    condition: 'earnKnowledgePoints',
    reward: 300
  }
}; 