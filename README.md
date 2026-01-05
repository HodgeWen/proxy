# 代理规则集（Sing-box & Mihomo）

本仓库提供 **sing-box** 和 **mihomo (Clash Meta)** 两种格式的规则集，用于补充主配置，不包含节点信息。

## 目录结构

```
rulesets/
├── sing-box/          # sing-box 规则集 (Source Format JSON)
│   ├── ai.json
│   ├── default.json
│   ├── direct.json
│   └── gemini.json
└── clash/             # mihomo 规则集 (Classical YAML)
    ├── ai.yaml
    ├── default.yaml
    ├── direct.yaml
    └── gemini.yaml
```

## 规则集说明

| 文件名    | 用途                                                  | mihomo behavior |
| --------- | ----------------------------------------------------- | --------------- |
| `ai`      | AI/LLM 域名集合（ChatGPT、Claude、Cursor 等，走代理） | `domain`        |
| `default` | 常用开发/工具站点集合（走代理）                       | `domain`        |
| `direct`  | 自定义直连白名单（域名/IP）                           | `classical`     |
| `gemini`  | Google Gemini 相关域名（走代理）                      | `domain`        |

---

# Sing-box 规则集

适配 sing-box v1.12.x 的 `route.rule_set` Source Format。规则格式与字段以官方文档为准：https://sing-box.sagernet.org/configuration/rule-set/source-format/

## 适用版本

- 建议 sing-box v1.12.x 及以上。
- 源规则集 `version` 建议使用 `3`（1.11 引入；1.13 起有 `4`，若需兼容 1.12 请保持 `3`）。

## 在 [GUI.for.SingBox](https://github.com/GUI-for-Cores/GUI.for.SingBox) 中添加

默认代理

```text
https://raw.githubusercontent.com/HodgeWen/rulesets/main/sing-box/default.json
```

人工智能

```text
https://raw.githubusercontent.com/HodgeWen/rulesets/main/sing-box/ai.json
```

直连

```text
https://raw.githubusercontent.com/HodgeWen/rulesets/main/sing-box/direct.json
```

gemini

```text
https://raw.githubusercontent.com/HodgeWen/rulesets/main/sing-box/gemini.json
```

> 使用当前仓库 main 分支的 raw 地址，供远程 rule-set 引用或同步。

## Sing-box 规则集字段要点（基于 Source Format 与 Headless Rule 默认字段）

- `version`：规则集版本（1.12 建议 `3`；若未来升级到 1.13 可用 `4`）[#source-format](https://sing-box.sagernet.org/configuration/rule-set/source-format/)。
- `rules`：Headless Rule 列表，常用匹配字段（详见默认字段说明：[headless-rule](https://sing-box.sagernet.org/configuration/rule-set/headless-rule/#default-fields)）：
  - 域名：`domain`（精确）、`domain_suffix`（后缀）、`domain_keyword`（包含关键字）、`domain_regex`（正则）。
  - IP：`ip_cidr`（目标 IP/CIDR）、`ip_is_private`（匹配私网）。
  - 来源 IP/端口：`source_ip_cidr`、`source_ip_is_private`、`source_port`、`source_port_range`。
  - 端口：`port`（单值）、`port_range`（如 `"1000:2000"`, `":443"`）。
  - 网络/入口：`network`（`tcp`/`udp`/`icmp`），`inbound`（入站 tag），`protocol`（嗅探到的协议），`ip_version`（4/6）。
  - 进程/客户端（平台相关）：`process_name`，`process_path`，`process_path_regex`，`package_name`（Android）。
  - 逻辑与反转：`type: "logical"`，`mode: "and"|"or"`，`rules`（子规则）；`invert` 可反转匹配结果。
- 动作/出口：在路由规则中使用 `action: "route"` 并指定 `outbound`（1.11 起迁移到动作字段；1.12 仍需写明出口标签）。

> Source Format / Headless Rule 默认字段本身不含 `rule_set` 相关键；`rule_set` 的引用在主配置的 `route.rules` 中书写（下文示例即此）。

## 规则集基础模板

```json
{
  "version": 3,
  "rules": [
    {
      "domain_suffix": ["example.com"],
      "ip_cidr": ["203.0.113.1/32"]
    }
  ]
}
```

## 在 sing-box 中引用规则集（示例）

```json
{
  "route": {
    "rule_set": [
      { "tag": "ai", "type": "local", "format": "source", "path": "ai.json" },
      {
        "tag": "dev",
        "type": "local",
        "format": "source",
        "path": "default.json"
      },
      {
        "tag": "direct-custom",
        "type": "local",
        "format": "source",
        "path": "direct.json"
      }
    ],
    "rules": [
      {
        "rule_set": ["direct-custom"],
        "action": "route",
        "outbound": "direct"
      },
      {
        "rule_set": ["ai", "dev"],
        "network": ["tcp", "udp"],
        "action": "route",
        "outbound": "proxy"
      },
      { "action": "route", "outbound": "direct" }
    ]
  }
}
```

> 请按实际出口命名替换 `outbound`，并确保最后有兜底规则（direct/block/proxy）。

---

# Mihomo (Clash Meta) 规则集

适配 mihomo (Clash Meta) 的 `rule-providers` Classical 格式。规则格式以官方文档为准：https://wiki.metacubex.one/en/config/rule-providers/

## 适用版本

- mihomo (Clash Meta) 全版本
- 规则集格式：`classical`（支持多种规则类型）

## 在 GUI 客户端中添加

默认代理

```text
https://raw.githubusercontent.com/HodgeWen/rulesets/main/clash/default.yaml
```

人工智能

```text
https://raw.githubusercontent.com/HodgeWen/rulesets/main/clash/ai.yaml
```

直连

```text
https://raw.githubusercontent.com/HodgeWen/rulesets/main/clash/direct.yaml
```

Gemini

```text
https://raw.githubusercontent.com/HodgeWen/rulesets/main/clash/gemini.yaml
```

## Mihomo 规则集字段要点

Classical 格式支持以下规则类型：

- `DOMAIN`：精确匹配域名
- `DOMAIN-SUFFIX`：匹配域名后缀（等同于 sing-box 的 `domain_suffix`）
- `DOMAIN-KEYWORD`：匹配包含关键字的域名
- `IP-CIDR`：匹配目标 IP/CIDR
- `SRC-IP-CIDR`：匹配来源 IP
- `DST-PORT`：匹配目标端口
- `SRC-PORT`：匹配来源端口
- `GEOIP`：匹配 GeoIP 数据库

## 规则集基础模板

**domain behavior**（仅域名规则，更高效）：

```yaml
# behavior: domain
payload:
  - +.example.com # 后缀匹配（等同于 DOMAIN-SUFFIX）
  - api.example.com # 精确匹配（等同于 DOMAIN）
```

**classical behavior**（支持所有规则类型）：

```yaml
# behavior: classical
payload:
  - DOMAIN-SUFFIX,example.com
  - DOMAIN,api.example.com
  - DOMAIN-KEYWORD,example
  - IP-CIDR,203.0.113.1/32
```

## 在 mihomo 中引用规则集（示例）

```yaml
rule-providers:
  ai:
    type: http
    url: 'https://raw.githubusercontent.com/HodgeWen/rulesets/main/clash/ai.yaml'
    interval: 86400
    behavior: domain
    format: yaml

  default:
    type: http
    url: 'https://raw.githubusercontent.com/HodgeWen/rulesets/main/clash/default.yaml'
    interval: 86400
    behavior: domain
    format: yaml

  direct-custom:
    type: http
    url: 'https://raw.githubusercontent.com/HodgeWen/rulesets/main/clash/direct.yaml'
    interval: 86400
    behavior: classical
    format: yaml

  gemini:
    type: http
    url: 'https://raw.githubusercontent.com/HodgeWen/rulesets/main/clash/gemini.yaml'
    interval: 86400
    behavior: domain
    format: yaml

rules:
  - RULE-SET,direct-custom,DIRECT
  - RULE-SET,ai,Proxy
  - RULE-SET,default,Proxy
  - RULE-SET,gemini,Proxy
  - MATCH,DIRECT
```

> 请按实际代理组命名替换 `Proxy`，并确保最后有 `MATCH` 兜底规则。
