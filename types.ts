/**
 * 规则集类型定义
 *
 * sing-box 文档: https://sing-box.sagernet.org/zh/configuration/rule-set/source-format/
 * mihomo 文档: https://wiki.metacubex.one/config/rule-providers/
 */

/** 规则集行为类型 */
export type RuleSetBehavior = 'domain' | 'classical'

/** 规则条目定义 */
export interface RuleDefinition {
  /** 精确匹配的域名 */
  domain?: string[]
  /** 后缀匹配的域名 */
  domain_suffix?: string[]
  /** 关键字匹配的域名 */
  domain_keyword?: string[]
  /** 正则匹配的域名 */
  domain_regex?: string[]
  /** IP CIDR */
  ip_cidr?: string[]
  /** 源 IP CIDR */
  source_ip_cidr?: string[]
  /** 目标端口 */
  port?: number[]
  /** 源端口 */
  source_port?: number[]
}

/** 规则集配置 */
export interface RuleSetConfig {
  /** 规则集名称 */
  name: string
  /** mihomo 行为类型 */
  behavior: RuleSetBehavior
  /** 规则定义 */
  rules: RuleDefinition
}

/** sing-box 规则集格式 */
export interface SingBoxRuleSet {
  version: number
  rules: SingBoxRule[]
}

/** sing-box 规则 */
export interface SingBoxRule {
  domain?: string[]
  domain_suffix?: string[]
  domain_keyword?: string[]
  domain_regex?: string[]
  ip_cidr?: string[]
  source_ip_cidr?: string[]
  port?: number[]
  source_port?: number[]
}

