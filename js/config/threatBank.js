/**
 * 威胁题库系统
 * 包含各种网络安全威胁的详细信息，像考试题库一样
 */

export const THREAT_BANK = {
  phishing: {
    name: '钓鱼攻击题库',
    description: '通过伪装成可信来源来窃取敏感信息的攻击',
    threats: [
      {
        name: '钓鱼邮件攻击',
        description: '攻击者发送伪装成银行、公司等可信机构的邮件',
        defense: 'firewall',
        knowledge: '仔细检查发件人地址，注意拼写错误和域名',
        difficulty: 1
      },
      {
        name: '虚假银行网站',
        description: '攻击者创建与真实银行网站相似的假网站',
        defense: 'firewall',
        knowledge: '检查网址是否正确，不要点击来源不明的链接',
        difficulty: 2
      },
      {
        name: '假冒登录页面',
        description: '攻击者创建假的登录页面来窃取用户凭据',
        defense: 'firewall',
        knowledge: '使用书签访问重要网站，不要点击邮件中的登录链接',
        difficulty: 1
      },
      {
        name: '恶意链接陷阱',
        description: '攻击者在社交媒体或聊天中发送恶意链接',
        defense: 'firewall',
        knowledge: '不要点击来源不明的链接，特别是短链接',
        difficulty: 2
      },
      {
        name: '社交工程攻击',
        description: '利用人性弱点进行心理操纵的攻击',
        defense: 'education',
        knowledge: '提高安全意识，不要轻易相信陌生人的请求',
        difficulty: 3
      }
    ]
  },
  malware: {
    name: '恶意软件题库',
    description: '各种恶意软件攻击，包括病毒、木马、勒索软件等',
    threats: [
      {
        name: '勒索软件攻击',
        description: '加密用户文件并要求支付赎金的恶意软件',
        defense: 'detection',
        knowledge: '定期备份重要数据，安装防病毒软件',
        difficulty: 3
      },
      {
        name: '木马病毒入侵',
        description: '伪装成正常程序但实际具有恶意功能的软件',
        defense: 'detection',
        knowledge: '不要下载来源不明的文件，使用可信的下载源',
        difficulty: 2
      },
      {
        name: '键盘记录器',
        description: '记录用户键盘输入以窃取密码等敏感信息',
        defense: 'detection',
        knowledge: '使用虚拟键盘输入重要信息，定期更换密码',
        difficulty: 2
      },
      {
        name: '后门程序植入',
        description: '在系统中植入后门以便后续入侵',
        defense: 'detection',
        knowledge: '定期扫描系统，监控异常活动',
        difficulty: 3
      },
      {
        name: '蠕虫病毒传播',
        description: '能够自我复制并在网络中传播的病毒',
        defense: 'detection',
        knowledge: '及时安装系统补丁，使用防火墙',
        difficulty: 2
      }
    ]
  },
  ddos: {
    name: 'DDoS攻击题库',
    description: '分布式拒绝服务攻击，通过大量请求使服务不可用',
    threats: [
      {
        name: 'SYN洪水攻击',
        description: '利用TCP三次握手的漏洞进行攻击',
        defense: 'encryption',
        knowledge: '使用SYN cookies，配置防火墙规则',
        difficulty: 3
      },
      {
        name: 'UDP洪水攻击',
        description: '发送大量UDP数据包消耗服务器资源',
        defense: 'encryption',
        knowledge: '限制UDP流量，使用流量清洗服务',
        difficulty: 2
      },
      {
        name: 'HTTP洪水攻击',
        description: '发送大量HTTP请求使Web服务器过载',
        defense: 'encryption',
        knowledge: '使用CDN服务，实施请求频率限制',
        difficulty: 2
      },
      {
        name: 'DNS放大攻击',
        description: '利用DNS服务器的放大效应进行攻击',
        defense: 'encryption',
        knowledge: '配置DNS服务器，限制递归查询',
        difficulty: 3
      },
      {
        name: 'Slowloris攻击',
        description: '通过保持大量慢速连接耗尽服务器资源',
        defense: 'encryption',
        knowledge: '设置连接超时，使用负载均衡器',
        difficulty: 3
      }
    ]
  },
  data_leak: {
    name: '数据泄露题库',
    description: '敏感信息被未授权访问或泄露的安全事件',
    threats: [
      {
        name: '数据库泄露事件',
        description: '数据库被攻击者入侵导致数据泄露',
        defense: 'education',
        knowledge: '加密存储敏感数据，实施访问控制',
        difficulty: 3
      },
      {
        name: '用户信息泄露',
        description: '用户个人信息被意外或恶意泄露',
        defense: 'education',
        knowledge: '实施数据分类，定期安全审计',
        difficulty: 2
      },
      {
        name: '密码明文存储',
        description: '密码以明文形式存储，容易被窃取',
        defense: 'education',
        knowledge: '使用强密码哈希算法，实施密码策略',
        difficulty: 1
      },
      {
        name: 'API密钥泄露',
        description: 'API密钥被意外暴露或被恶意获取',
        defense: 'education',
        knowledge: '定期轮换密钥，使用密钥管理服务',
        difficulty: 2
      },
      {
        name: '源代码泄露',
        description: '源代码被意外暴露或被恶意获取',
        defense: 'education',
        knowledge: '使用私有代码仓库，实施代码审查',
        difficulty: 2
      }
    ]
  }
};

/**
 * 获取随机威胁
 * @param {string} category - 威胁类别
 * @returns {Object} 威胁对象
 */
export function getRandomThreat(category = null) {
  if (category && THREAT_BANK[category]) {
    const threats = THREAT_BANK[category].threats;
    return threats[Math.floor(Math.random() * threats.length)];
  }
  
  // 随机选择类别
  const categories = Object.keys(THREAT_BANK);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const threats = THREAT_BANK[randomCategory].threats;
  const threat = threats[Math.floor(Math.random() * threats.length)];
  
  return {
    ...threat,
    category: randomCategory
  };
}

/**
 * 获取所有威胁类别
 * @returns {Array} 威胁类别数组
 */
export function getAllThreatCategories() {
  return Object.keys(THREAT_BANK);
}

/**
 * 获取威胁类别信息
 * @param {string} category - 威胁类别
 * @returns {Object} 类别信息
 */
export function getThreatCategoryInfo(category) {
  return THREAT_BANK[category] || null;
} 