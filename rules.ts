/**
 * 规则集定义
 *
 * 在此处添加、修改、删除规则集配置
 */

import type { RuleSetConfig } from './types'

export const rulesets: RuleSetConfig[] = [
  {
    name: 'ai',
    behavior: 'domain',
    rules: {
      domain_suffix: [
        'chatgpt.com',
        'claude.ai',
        'zed.dev',
        'anthropic.com',
        'claude.com',
        'cursor.sh'
      ]
    }
  },
  {
    name: 'default',
    behavior: 'domain',
    rules: {
      domain_suffix: [
        'turborepo.com',
        'turbo.build',
        'rolldown.rs',
        'prisma.io',
        'prisma-data.net',
        'elysiajs.com',
        'rollupjs.org'
      ]
    }
  },
  {
    name: 'direct',
    behavior: 'classical',
    rules: {
      domain_suffix: ['wd-gold.com', 'wenhongjie.tech'],
      domain_keyword: ['tagxx', 'tagss'],
      ip_cidr: ['104.168.21.132/32', '43.154.3.205/32'],
      domain: ['api.ikuncode.cc', "aihubmix.com"]
    }
  },
  {
    name: 'gemini',
    behavior: 'domain',
    rules: {
      domain: [
        'gemini.google.com',
        'one.google.com',
        'aistudio.google.com',
        'ai.google.dev',
        'apis.google.com',
        'www.google-analytics.com'
      ],
      domain_suffix: [
        'googleapis.com',
        'makersuite.google.com',
        'generativeai.google',
        'clients6.google.com',
        "gemini.google",
        "deepmind.google",
        "opal.google",
        "labs.google",
        "jules.google",
        "deepmind.com",
        "notebooklm.google",
        "ai.studio",
        "opal.google.com",
        "jules.google.com",
      ],
      domain_keyword: ['antigravity']
    }
  }
]
