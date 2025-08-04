/**
 * 威胁配置系统
 * 定义各种网络安全威胁的类型、名称和属性
 */

export const THREAT_TYPES = {
  PHISHING: 'phishing',
  MALWARE: 'malware',
  DDOS: 'ddos',
  DATA_LEAK: 'data_leak'
};

export const THREAT_NAMES = {
  phishing: [
    '钓鱼邮件攻击',
    '虚假银行网站',
    '假冒登录页面',
    '恶意链接陷阱',
    '社交工程攻击',
    '虚假中奖信息',
    '假冒客服诈骗',
    '虚假安全警告'
  ],
  malware: [
    '勒索软件攻击',
    '木马病毒入侵',
    '键盘记录器',
    '后门程序植入',
    '蠕虫病毒传播',
    '间谍软件监控',
    '广告软件弹窗',
    '挖矿病毒占用'
  ],
  ddos: [
    'SYN洪水攻击',
    'UDP洪水攻击',
    'HTTP洪水攻击',
    'DNS放大攻击',
    'Slowloris攻击',
    'Ping洪水攻击',
    'ICMP洪水攻击',
    'NTP放大攻击'
  ],
  data_leak: [
    '数据库泄露事件',
    '用户信息泄露',
    '密码明文存储',
    'API密钥泄露',
    '源代码泄露',
    '配置文件泄露',
    '日志信息泄露',
    '备份文件泄露'
  ]
};

export const THREAT_PROPERTIES = {
  phishing: {
    color: '#ff6b9d', // 科幻粉色 - 钓鱼攻击
    shape: 'triangle',
    speed: 2.5, // 加快速度
    health: 30,
    damage: 5,
    description: '钓鱼攻击通过伪装成可信来源来窃取敏感信息',
    defenseType: 'firewall', // 只能用防火墙防御
    knowledgeTip: '仔细检查发件人地址，不要点击来源不明的链接'
  },
  malware: {
    color: '#ffb366', // 科幻橙色 - 恶意软件
    shape: 'square',
    speed: 2.0, // 加快速度
    health: 50,
    damage: 8,
    description: '恶意软件会破坏系统或窃取数据',
    defenseType: 'detection', // 只能用检测者防御
    knowledgeTip: '安装防病毒软件，不要下载来源不明的文件'
  },
  ddos: {
    color: '#66ccff', // 科幻青色 - DDoS攻击
    shape: 'circle',
    speed: 3.0, // 加快速度
    health: 40,
    damage: 10,
    description: 'DDoS攻击通过大量请求使服务不可用',
    defenseType: 'encryption', // 只能用加密师防御
    knowledgeTip: '使用CDN服务，配置负载均衡器'
  },
  data_leak: {
    color: '#cc99ff', // 科幻紫色 - 数据泄露
    shape: 'diamond',
    speed: 1.8, // 加快速度
    health: 60,
    damage: 15,
    description: '数据泄露会导致敏感信息被未授权访问',
    defenseType: 'education', // 只能用教育官防御
    knowledgeTip: '加密存储敏感数据，实施访问控制策略'
  }
};

/**
 * 获取随机威胁名称
 * @param {string} type - 威胁类型
 * @returns {string} 威胁名称
 */
export function getRandomThreatName(type) {
  const names = THREAT_NAMES[type];
  if (names && names.length > 0) {
    return names[Math.floor(Math.random() * names.length)];
  }
  return '未知威胁';
}

/**
 * 获取威胁属性
 * @param {string} type - 威胁类型
 * @returns {Object} 威胁属性
 */
export function getThreatProperties(type) {
  return THREAT_PROPERTIES[type] || {
    color: '#ffffff',
    shape: 'circle',
    speed: 1.0,
    health: 30,
    damage: 5,
    description: '未知威胁类型',
    defenseType: 'firewall',
    knowledgeTip: '请使用适当的防御措施'
  };
}

/**
 * 检查防御类型是否匹配
 * @param {string} threatType - 威胁类型
 * @param {string} defenseType - 防御类型
 * @returns {boolean} 是否匹配
 */
export function isDefenseMatch(threatType, defenseType) {
  const properties = getThreatProperties(threatType);
  return properties.defenseType === defenseType;
}

/**
 * 获取所有威胁类型
 * @returns {Array} 威胁类型数组
 */
export function getAllThreatTypes() {
  return Object.values(THREAT_TYPES);
}

/**
 * 获取威胁类型的中文名称
 * @param {string} type - 威胁类型
 * @returns {string} 中文名称
 */
export function getThreatTypeName(type) {
  const typeNames = {
    phishing: '钓鱼攻击',
    malware: '恶意软件',
    ddos: 'DDoS攻击',
    data_leak: '数据泄露'
  };
  return typeNames[type] || '未知类型';
} 