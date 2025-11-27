# Proxy Rules

这是一个个人维护的代理规则集仓库，用于配置代理软件（如 Sing-box 等）的分流规则。

## 规则文件说明

本项目包含以下规则集文件：

### 1. AI 服务代理规则 (`ai_proxy_rule_set.json`)

包含主流 AI 助手及相关服务的域名规则，建议走代理节点。

- **包含域名**: ChatGPT, Claude, Gemini (Google), Zed AI, Anthropic 等。

### 2. 开发工具代理规则 (`custom_proxy_rule_set.json`)

包含开发过程中常用的工具、文档、技术社区等域名，建议走代理节点以加速访问。

- **包含域名**: Turborepo, Prisma, ElysiaJS, Rollup, Rolldown 等。

### 3. 自定义直连规则 (`custom_direct_rule_set.json`)

包含个人站点或明确不需要代理的域名，建议配置为直连。

- **包含域名**: 个人博客及相关服务。

## 格式说明

所有规则文件均采用 JSON 格式，结构如下：

```json
{
  "version": 1,
  "rules": [
    {
      "domain_suffix": ["example.com"],
      "domain": ["exact.example.com"]
    }
  ]
}
```
