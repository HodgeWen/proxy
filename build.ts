/**
 * 规则集构建脚本
 *
 * 从统一的规则定义生成 sing-box 和 mihomo (Clash) 两种格式的规则集
 *
 * sing-box 文档: https://sing-box.sagernet.org/zh/configuration/rule-set/source-format/
 * mihomo 文档: https://wiki.metacubex.one/config/rule-providers/
 */

import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { rulesets } from './rules'
import type {
  RuleDefinition,
  RuleSetConfig,
  SingBoxRule,
  SingBoxRuleSet
} from './types'

// ============================================================================
// 生成器函数
// ============================================================================

/**
 * 生成 sing-box 规则集 JSON
 *
 * @see https://sing-box.sagernet.org/zh/configuration/rule-set/source-format/
 */
function generateSingBoxRuleSet(config: RuleSetConfig): SingBoxRuleSet {
  const rule: SingBoxRule = {}

  // 复制所有非空规则字段
  const ruleFields: (keyof RuleDefinition)[] = [
    'domain',
    'domain_suffix',
    'domain_keyword',
    'domain_regex',
    'ip_cidr',
    'source_ip_cidr',
    'port',
    'source_port'
  ]

  for (const field of ruleFields) {
    const value = config.rules[field]
    if (value && value.length > 0) {
      ;(rule as Record<string, unknown>)[field] = value
    }
  }

  return {
    version: 3,
    rules: [rule]
  }
}

/**
 * 生成 mihomo (Clash) 规则集 YAML
 *
 * @see https://wiki.metacubex.one/config/rule-providers/
 */
function generateMihomoRuleSet(config: RuleSetConfig): string {
  const lines: string[] = []

  // 添加 behavior 注释
  lines.push(`# behavior: ${config.behavior}`)
  lines.push('payload:')

  const { rules, behavior } = config

  if (behavior === 'domain') {
    // domain behavior: 使用简化格式
    // +.example.com 表示后缀匹配 (DOMAIN-SUFFIX)
    // example.com 表示精确匹配 (DOMAIN)
    if (rules.domain_suffix) {
      for (const d of rules.domain_suffix) {
        lines.push(`  - +.${d}`)
      }
    }
    if (rules.domain) {
      for (const d of rules.domain) {
        lines.push(`  - ${d}`)
      }
    }
  } else {
    // classical behavior: 使用完整规则格式
    if (rules.domain_suffix) {
      for (const d of rules.domain_suffix) {
        lines.push(`  - DOMAIN-SUFFIX,${d}`)
      }
    }
    if (rules.domain) {
      for (const d of rules.domain) {
        lines.push(`  - DOMAIN,${d}`)
      }
    }
    if (rules.domain_keyword) {
      for (const k of rules.domain_keyword) {
        lines.push(`  - DOMAIN-KEYWORD,${k}`)
      }
    }
    if (rules.domain_regex) {
      for (const r of rules.domain_regex) {
        lines.push(`  - DOMAIN-REGEX,${r}`)
      }
    }
    if (rules.ip_cidr) {
      for (const cidr of rules.ip_cidr) {
        lines.push(`  - IP-CIDR,${cidr}`)
      }
    }
    if (rules.source_ip_cidr) {
      for (const cidr of rules.source_ip_cidr) {
        lines.push(`  - SRC-IP-CIDR,${cidr}`)
      }
    }
    if (rules.port) {
      for (const p of rules.port) {
        lines.push(`  - DST-PORT,${p}`)
      }
    }
    if (rules.source_port) {
      for (const p of rules.source_port) {
        lines.push(`  - SRC-PORT,${p}`)
      }
    }
  }

  return lines.join('\n') + '\n'
}

// ============================================================================
// 构建流程
// ============================================================================

async function build() {
  console.log('🚀 开始构建规则集...\n')

  const singboxDir = join(import.meta.dirname, 'sing-box')
  const clashDir = join(import.meta.dirname, 'clash')

  // 确保输出目录存在
  await mkdir(singboxDir, { recursive: true })
  await mkdir(clashDir, { recursive: true })

  for (const config of rulesets) {
    // 生成 sing-box JSON
    const singboxRuleSet = generateSingBoxRuleSet(config)
    const singboxPath = join(singboxDir, `${config.name}.json`)
    await writeFile(singboxPath, JSON.stringify(singboxRuleSet, null, 2) + '\n')
    console.log(`✅ sing-box/${config.name}.json`)

    // 生成 mihomo YAML
    const mihomoRuleSet = generateMihomoRuleSet(config)
    const mihomoPath = join(clashDir, `${config.name}.yaml`)
    await writeFile(mihomoPath, mihomoRuleSet)
    console.log(`✅ clash/${config.name}.yaml`)
  }

  console.log('\n🎉 构建完成！')
  console.log(`   共生成 ${rulesets.length * 2} 个文件`)
}

// 执行构建
build().catch(err => {
  console.error('❌ 构建失败:', err)
  process.exit(1)
})
