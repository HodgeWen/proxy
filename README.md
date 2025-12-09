# Sing-box 1.12 规则集（Source Format）

适配 sing-box v1.12.x 的 `route.rule_set` Source Format，用于补充主配置，不包含节点信息。规则格式与字段以官方文档为准：https://sing-box.sagernet.org/configuration/rule-set/source-format/ 。

## 适用版本

- 建议 sing-box v1.12.x 及以上。
- 源规则集 `version` 建议使用 `3`（1.11 引入；1.13 起有 `4`，若需兼容 1.12 请保持 `3`）。

## 仓库文件（不展示具体域名）

- `ai.json`：AI/LLM 域名集合（走代理）。
- `default.json`：常用开发/工具站点集合（走代理）。
- `direct.json`：自定义直连白名单（域名/IP）。

## 在 [GUI.for.SingBox](https://github.com/GUI-for-Cores/GUI.for.SingBox) 中添加

```text
https://raw.githubusercontent.com/HodgeWen/rulesets/main/ai.json
```

```text
https://raw.githubusercontent.com/HodgeWen/rulesets/main/default.json
```

```text
https://raw.githubusercontent.com/HodgeWen/rulesets/main/direct.json
```

> 使用当前仓库 main 分支的 raw 地址，供远程 rule-set 引用或同步。

## 规则集字段要点（基于 Source Format 与 Headless Rule 默认字段）

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
