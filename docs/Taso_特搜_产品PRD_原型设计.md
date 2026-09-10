# Taso 特搜｜美食旅游社交 + 会员卡权益平台 PRD 与原型设计

> 文档类型：产品需求文档（PRD）+ 信息架构 + 页面交互说明 + UI 设计规范 + Mermaid 原型
>
> 产品代号：Taso 特搜
>
> 产品定位：面向全球用户的「美食 / 旅游 / 本地生活内容社交平台 + 会员卡权益平台」
>
> 版本：V1.2 产品设计稿（含 V0.1 高保真原型交付记录 + V1.2 好友与消息模块）
>
> 版本历史：
>
> | 版本 | 日期 | 变更 |
> |---|---|---|
> | V1.0 | 2026-09 | 产品需求文档 + 信息架构 + 页面交互说明 + UI 设计规范 + Mermaid 原型 |
> | V1.1 | 2026-09-09 | 新增 §72「手机端高保真原型 · Vue 3 实现状态」：V0.1 全部 31 个 P0/P1 页面已按设计令牌落地为 Vue 3 工程；§8.1 页面清单增加实现状态列；§69 V0.1 标记为已交付；§48/§62 补充设计系统与前端基线落地说明 |
> | V1.2 | 2026-09-09 | 新增 §73「好友与即时消息」模块：好友关系状态机、P601–P603 页面规格、加好友/消息收发时序、消息类型演进、数据模型、API、安全风控与验收标准，并在原型中落地（好友/消息/聊天三屏 + 添加好友弹层 + 未读角标联动）；§6 信息架构、§8.1 页面清单、§45 数据模型、§52 通知、§57 埋点、§61 API、§68 验收标准及附录优先级/KPI 同步更新 |
> | V1.2.1 | 2026-09-09 | 新增 P604「我的二维码名片」：参考微信「我的」页设计，顶栏二维码图标入口 + 名片展示页 + 扫一扫/保存（演示态）；§73 新增 §73.8 页面规格，后续小节顺延至 §73.9–§73.16 |
> | V1.3 | 2026-09-10 | 新增 §75「注册与登录」模块：按《TASO 注册与登录 PRD v1.0》重构 P003 为「继续使用 TASO」统一入口（Apple/Google/X + 邮箱/手机号），新增 OAuth 授权、Email/Phone OTP、登录异常、新用户昵称、账号与安全、登录方式管理、设备会话、删除账号等 AUTH 系列页面并全部落地原型（9 个新屏幕 + P003 重构）；§8.1 页面清单同步更新 |
>
> 适用团队：产品、UI/UX、Web 前端、iOS、Android、后端、支付/卡业务、风控、审核、运营、财务
>
> 重要说明：本文将用户提出的会员卡、充值、USDT/USDC、消费报销、推广佣金等业务纳入产品架构，但不将其视为已经取得监管许可的既定业务事实。涉及支付、储值、银行卡发行、数字资产、资金托管、消费者返还、推荐佣金等部分，必须在实际运营地由持牌机构/律师确认业务边界后上线。特别是香港的储值支付工具、稳定币及多层级推广存在明确的监管要求和法律风险，本文对此采用“合规前置 + 规则可配置”的产品方案。

---

## 1. 产品概述

### 1.1 产品一句话

**Taso 特搜 = “发现世界吃喝玩乐” + “真实消费内容分享” + “会员卡优惠” + “消费权益账户” + “全球多语言社交”。**

### 1.2 核心用户价值

| 用户 | 核心价值 |
|---|---|
| 普通会员 | 找美食、找旅行体验、看真实消费内容、获得商家优惠 |
| 内容创作者 | 发布消费内容、获得流量与创作激励、积累粉丝 |
| 会员卡用户 | 使用 Taso 会员卡消费、享合作商家权益、管理充值/消费/报销 |
| 推广大使 | 分享产品并获得符合当地法律及平台规则的推广奖励 |
| 合作商家 | 获取流量、获得会员消费、经营会员优惠活动 |
| 平台运营 | 管理内容、商户、会员、账务、报销、佣金、风控 |

### 1.3 产品定位建议

不建议将产品包装成单纯“返现/赚钱 App”。产品主叙事应为：

> **全球美食旅行社交平台 + 会员专属消费权益。**

“消费后产生内容 → 内容帮助其他人决策 → 用户获得会员权益 → 在合作商家产生消费 → 产生可验证消费凭证 → 平台根据公开规则结算权益”形成完整闭环。

### 1.4 核心闭环

```mermaid
flowchart LR
    A[注册 Taso] --> B[选择语言/地区/兴趣]
    B --> C[浏览首页 Feed]
    C --> D[查看商家/攻略/帖子]
    D --> E[关注创作者]
    E --> F[到商家消费]
    F --> G[使用 Taso 会员卡]
    G --> H[上传消费凭证]
    H --> I[审核]
    I --> J[权益账户按规则结算]
    J --> K[余额/权益明细]
    K --> L[消费/提现/再次使用]
    C --> M[发布内容]
    M --> N[创作激励]
    N --> K
    B --> O[申请会员卡]
    O --> P[充值]
    P --> G
```

---

# 2. 产品原则

## 2.1 社交优先

首页首先服务“看内容”和“找信息”，不能让钱包、充值、报销等金融模块压过社交内容。

## 2.2 消费凭证优先

报销/权益结算必须建立在可验证消费事实之上：商户、时间、订单号、金额、支付方式、凭证图像等形成证据链。

## 2.3 钱包账务与社交账户解耦

社交余额、会员权益、可提现余额、推广佣金、创作收益必须使用独立账本字段和流水类型，不能只用一个 `balance` 字段。

## 2.4 所有收益规则可配置

将“116%、0.05%/日、16%手续费、30%/5%/1%推广奖励”等做成后台配置项，而不是写死在 App。

## 2.5 合规优先于增长

任何“收益、报销、佣金、USDT/USDC、银行卡提现”页面都必须显示规则、条件、地区限制、审核状态和风险提示，禁止用模糊文案暗示“稳赚”或“保本”。

---

# 3. 参考产品与可借鉴设计

## 3.1 X / Twitter：信息流、翻译、关注关系

X 目前支持帖子翻译：当帖子有可用翻译时，会在原文字下方提供翻译入口；X 同时区分显示语言与内容推荐语言，并允许根据用户语言偏好影响推荐内容。^1 ^2

**Taso 借鉴：**

- 原文 + “翻译成中文/日本語/English”
- 默认显示用户偏好语言
- “查看原文”随时可切换
- 单独维护“App 界面语言”和“内容偏好语言”
- 根据地区、语言、互动行为调整 Feed

## 3.2 Threads：For You + Following

Threads 已采用“为你推荐”和“关注中”两种 Feed，并支持按帖子语言与查看者语言自动翻译的机制。^3

**Taso 借鉴：**

- 推荐流：适合发现美食、旅行、商家
- 关注流：适合跟踪熟悉创作者
- 商家/地点也应成为内容实体，而非只有用户账号

## 3.3 Reddit：社区、帖子、评论、投票

Reddit 的核心机制是围绕兴趣社区进行发帖、评论、投票，让高价值内容获得更多可见性。^4

**Taso 借鉴：**

- 城市社区：Tokyo / Hong Kong / Bangkok / Seoul
- 主题社区：火锅、咖啡、烧肉、温泉、海岛等
- “有帮助”而非单纯“点赞”
- 评论区支持二级/多级回复

## 3.4 Tripadvisor：消费体验评价

Tripadvisor 的评价功能以“分享体验、帮助后来旅行者”为核心，并允许用户新增缺失地点。^5

**Taso 借鉴：**

- 每条内容可以绑定商家/地点
- 商家详情页集中呈现真实消费内容
- “我去过”与“我推荐”分开
- 评论应允许附照片/视频/人均消费/时间等结构化信息

## 3.5 Visa 联名卡

Visa 对联名卡的官方说明显示，联名卡可以由品牌与发卡机构合作提供，卡片可能是信用卡、借记卡或预付卡；Visa 也明确说明，发卡、BIN、处理等环节需要银行/发卡机构等合作伙伴参与。Visa 规则还要求联名项目由发卡机构拥有和控制，并涉及审批与责任边界。^6 ^7

**Taso 借鉴：**

App 内的“会员卡”必须设计成一个独立金融产品域，由实际发卡/支付服务商提供 API 和合规控制；Taso App 只做体验层和会员权益层。

---

# 4. 商业模式与产品闭环

## 4.1 收入来源

### A. 会员卡办理费

业务设定：**HK$1,000 / 张实体会员卡**。

产品：

- 卡片介绍
- 申请
- 身份认证（实际所需程度由合作发卡机构决定）
- 卡片费支付
- 卡片制作
- 发货
- 激活

### B. 充值手续费

业务设定：充值手续费 **16%**，产品侧必须明确展示：

```text
充值金额：HK$10,000
手续费：HK$1,600
实际支付：HK$11,600
到账权益/资金：以合作金融机构实际规则为准
```

**注意：**“16%手续费”到底属于平台服务费、支付通道费或其他费用，必须由法务/财务确认，不能在 PRD 中自行定义会计含义。

### C. 商家服务/营销

- 合作商家入驻
- 会员专属套餐
- 首页推荐
- 地区精选
- 商家活动页
- 达人合作

### D. 创作激励

创作者的收益池由平台预算或商户营销预算决定。

### E. 合规后的推广奖励

用户提出：直推 30%、二级 5%、三级 1%。

**产品设计不能直接将这组数字作为“上线即执行”的商业承诺。**

后台必须支持：

```text
佣金方案状态：Draft / Under Review / Enabled / Suspended
适用国家：...
适用用户类型：...
计佣基数：...
一级比例：...
二级比例：...
三级比例：...
结算周期：...
退款冲正：...
```

香港《禁止层压式计划条例》对以参加新成员所产生的利益作为主要诱因的金字塔计划设有禁止规定；官方说明还指出，明知相关利益主要来自介绍新参与者而诱导他人参与可能构成犯罪。^8 因此推广奖励必须由律师按实际合同、收费、商品/服务价值、计佣来源及实际运营地区审查后再决定是否使用多层级结构。

---

# 5. 核心用户角色

| Role | 权限 |
|---|---|
| Guest | 浏览公开内容、商家、登录注册 |
| Member | 发帖、关注、评论、点赞、收藏、商家消费内容 |
| Card Member | 会员卡、充值、消费、权益、账单、报销、提现 |
| Creator | 创作、创作收益、数据中心 |
| Merchant | 商户主页、优惠、订单/验证、营销 |
| Promoter | 推广链接、邀请、奖励、结算 |
| Moderator | 内容审核、投诉处理 |
| Finance | 报销、账务、提现审核 |
| Admin | 全局运营配置 |
| Compliance | KYC、AML、风险策略、规则审核 |

---

# 6. App 信息架构

```mermaid
flowchart TD
    A[Taso App]
    A --> B[首页]
    A --> C[发现]
    A --> D[发布]
    A --> E[权益]
    A --> F[我的]

    B --> B1[For You]
    B --> B2[Following]
    B --> B3[地区精选]
    B --> B4[内容卡片]
    B --> B5[消息入口]

    C --> C1[搜索]
    C --> C2[地点]
    C --> C3[商家]
    C --> C4[话题]
    C --> C5[城市]

    D --> D1[文字]
    D --> D2[图片]
    D --> D3[视频]
    D --> D4[评分]
    D --> D5[绑定商家]
    D --> D6[消费凭证]

    E --> E1[会员卡]
    E --> E2[钱包]
    E --> E3[充值]
    E --> E4[消费记录]
    E --> E5[消费报销]
    E --> E6[提现]
    E --> E7[推广]
    E --> E8[创作收益]

    F --> F1[个人主页]
    F --> F2[我的帖子]
    F --> F3[收藏]
    F --> F4[关注/粉丝]
    F --> F5[设置]
    F --> F6[安全/KYC]
    F --> F7[语言/地区]
    F --> F8[好友]
    F --> F9[消息]
```

---

# 7. 一级导航设计

## 7.1 底部 Tab

```text
┌─────────────────────────────────────┐
│              Taso Logo              │
│                                     │
│             页面内容                 │
│                                     │
├─────────────────────────────────────┤
│ 首页   发现       ＋       权益   我的 │
└─────────────────────────────────────┘
```

### Tab 规则

| Tab | icon | 默认页 |
|---|---|---|
| 首页 | Home | For You |
| 发现 | Compass/Search | 探索 |
| + | Plus | 发布内容 |
| 权益 | Card/Wallet | 会员卡/钱包 |
| 我的 | User | 个人主页 |

发布按钮采用中间突出设计，但不能覆盖成传统“红包/赚钱”视觉语言。

---

# 8. 页面清单

## 8.1 P0 核心页面

原型状态列为高保真原型（Vue 3）中的落地情况，工程结构见 §72.2；「演示态」指 UI 与交互已实现，数据为静态演示数据（详见 §72.5）。P601–P604 为 V1.2 新增模块页面（§73），实现记录见 §73.16；AUTH-002–AUTH-017 为 V1.3 注册登录模块页面（设计规格见《TASO 注册与登录 PRD v1.0》），实现记录见 §75。

| ID | 页面 | 优先级 | 原型状态 |
|---|---|---|---|
| P001 | 启动页 | P0 | ✅ 已实现（ScreenSplash） |
| P002 | 欢迎/语言/地区 | P0 | ✅ 已实现（ScreenWelcome · V1.3 起接至登录页） |
| P003 | 登录/注册 | P0 | ✅ 已实现（V1.3 重构 · ScreenLogin：统一「继续使用 TASO」，Apple/Google/X + 邮箱/手机号 + 条款/语言入口，见 §75） |
| P004 | 兴趣选择 | P0 | ✅ 已实现（ScreenInterests · V1.3 起支持跳过） |
| P101 | 首页-For You | P0 | ✅ 已实现（ScreenHome · For You Tab） |
| P102 | 首页-Following | P0 | ✅ 已实现（ScreenHome · Following Tab） |
| P103 | 帖子详情 | P0 | ✅ 已实现（ScreenPost） |
| P104 | 评论区 | P0 | ✅ 已实现，底部弹层形态（CommentsSheet） |
| P105 | 用户主页 | P0 | ✅ 已实现（ScreenProfile） |
| P201 | 发现首页 | P0 | ✅ 已实现（ScreenDiscover） |
| P202 | 搜索结果 | P0 | ✅ 已实现，实时过滤 + 分类 Tab + 空态（ScreenSearch） |
| P203 | 商家详情 | P0 | ✅ 已实现（ScreenMerchant） |
| P204 | 地点详情 | P0 | ✅ 已实现（ScreenPlace） |
| P301 | 发布文字/图片 | P0 | ✅ 已实现，发布器 Tab 1（ComposerSheet） |
| P302 | 发布视频 | P0 | ✅ 已实现，发布器 Tab 2（ComposerSheet） |
| P303 | 商家打卡/评分 | P0 | ✅ 已实现，发布器 Tab 3，含星级评分（ComposerSheet） |
| P401 | 会员卡首页 | P0 | ✅ 已实现（ScreenBenefits） |
| P402 | 申请实体卡 | P0 | ✅ 已实现（ScreenCardApply） |
| P403 | 卡片详情 | P0 | ✅ 已实现，含冻结/解冻（ScreenCardDetail） |
| P404 | 充值 | P0 | ✅ 已实现，含 16% 手续费实时计算（ScreenTopup） |
| P405 | 钱包 | P0 | ✅ 已实现，多账本拆分展示（ScreenWallet） |
| P406 | 交易明细 | P0 | ✅ 已实现，含分类筛选（ScreenTransactions） |
| P407 | 消费报销 | P0 | ✅ 已实现，演示态（ScreenReimburse） |
| P408 | 报销详情 | P0 | ✅ 已实现，含结算进度（ScreenReimburseDetail） |
| P409 | 提现 | P0 | ✅ 已实现，含超额校验（ScreenWithdraw） |
| P410 | 推广中心 | P0* | ✅ 已实现，演示态（ScreenReferral） |
| P411 | 创作收益 | P0 | ✅ 已实现，演示态（ScreenCreator） |
| P501 | 我的 | P0 | ✅ 已实现（ScreenMe） |
| P502 | 设置 | P0 | ✅ 已实现（ScreenSettings） |
| P503 | 语言与地区 | P0 | ✅ 已实现（ScreenLanguage） |
| P504 | 通知中心 | P1 | ✅ 已实现（ScreenNotifications） |
| P505 | 安全与隐私 | P0 | ✅ 已实现（ScreenSecurity） |
| P506 | 实名/KYC 状态 | P0 | ✅ 已实现（ScreenKyc） |
| P601 | 好友 | P0 | ✅ 已实现（V1.2 新增 · ScreenFriends + AddFriendSheet：好友/新请求/推荐三 Tab、申请接受/拒绝/撤回） |
| P602 | 消息中心 | P0 | ✅ 已实现（V1.2 新增 · ScreenMessages：会话列表 + 好友申请横幅 + 未读角标 + 空态） |
| P603 | 聊天 | P0 | ✅ 已实现（V1.2 新增 · ScreenChat：双向气泡 / 日期分隔 / 已读状态 / 底部输入栏 / 本地模拟回复） |
| P604 | 我的二维码名片 | P1 | ✅ 已实现（V1.2.1 新增 · ScreenMyQrcode：「我的」顶栏二维码入口 + 名片 + 扫一扫/保存演示） |
| AUTH-002 | 注册登录首页 | P0 | ✅ 已实现（V1.3 · ScreenLogin：品牌置顶 + 三方按钮沉底 + 「或」分隔 + 邮箱/手机号入口） |
| AUTH-003 | Email 输入 | P0 | ✅ 已实现（V1.3 · ScreenAuthEntry：Email/Phone 分段切换 + 格式校验） |
| AUTH-004 | Email OTP | P0 | ✅ 已实现（V1.3 · ScreenAuthOtp：6 位输入框 + 自动跳格/粘贴 + 60s 重发倒计时） |
| AUTH-005 | 手机号输入 | P1 | ✅ 已实现（V1.3 · ScreenAuthEntry · Phone：区号预选 + E.164 组装） |
| AUTH-006 | 手机 OTP | P1 | ✅ 已实现（V1.3 · ScreenAuthOtp 复用，按目的地展示） |
| AUTH-007 | 第三方授权中 | P0 | ✅ 已实现（V1.3 · ScreenAuthOauth：Google/Apple/X 品牌化模拟授权页 + Loading + 取消） |
| AUTH-008 | 新用户昵称 | P0 | ✅ 已实现（V1.3 · ScreenAuthNickname：2–30 字符实时校验 + 非法字符过滤） |
| AUTH-009 | 兴趣选择 | P1 | ✅ 已实现（V1.3 · 复用 P004 并补「跳过」） |
| AUTH-010 | 登录异常 | P0 | ✅ 已实现（V1.3 · ScreenAuthError：OTP 连错 3 次进入 + Try again + 无法登录帮助） |
| AUTH-011 | 账号被锁定 | P1 | ⬜ 未实现（原型以 AUTH-010 覆盖提示，锁定态留待接入真实风控） |
| AUTH-012 | 账号与安全 | P0 | ✅ 已实现（V1.3 · ScreenAccount：账号信息/登录方式/设备会话/删除账号） |
| AUTH-013 | 登录方式管理 | P0 | ✅ 已实现（V1.3 · ScreenAuthMethods：绑定/解绑 + 最后一个身份解绑拦截） |
| AUTH-014 | 设备会话管理 | P1 | ✅ 已实现（V1.3 · ScreenAuthSessions：设备列表 + 退出其他设备） |
| AUTH-015 | 绑定新登录方式 | P1 | ✅ 已实现（V1.3 · 并入 ScreenAuthMethods：点击未绑定项即时绑定演示） |
| AUTH-016 | 删除账号 | P0 | ✅ 已实现（V1.3 · ScreenAuthDelete：删除范围/恢复窗口提示 + 二次确认） |
| AUTH-017 | 账号删除确认 | P0 | ✅ 已实现（V1.3 · 确认对话框 + 本地数据全量重置回首启） |

---

# 9. P001 启动页

## UI

```text
┌────────────────────────┐
│                        │
│                        │
│        TASO            │
│       特  搜           │
│                        │
│   Explore · Share · Go │
│                        │
│                        │
│        加载中…         │
│                        │
└────────────────────────┘
```

### 行为

- 冷启动检查版本
- 检查地区
- 检查登录态
- 检查维护公告
- 检查风控状态
- 拉取语言包
- 拉取 Feed 配置

### 异常

网络失败 → 显示“离线重试”；
版本过低 → 强制升级；
服务维护 → 展示公告页。

---

# 10. P002 欢迎 / 语言 / 地区

## 核心目标

第一次打开就确定：

1. App 显示语言
2. 内容推荐语言
3. 所在国家/地区
4. 兴趣

## UI

```text
┌────────────────────────┐
│ Skip                   │
│                        │
│  Welcome to Taso       │
│  发现世界的每一次体验   │
│                        │
│  App Language           │
│  [ 简体中文        ▾ ] │
│                        │
│  Content Languages      │
│  ☑ 中文  ☑ English     │
│  ☐ 日本語 ☐ 한국어      │
│                        │
│  Region                 │
│  [ Hong Kong      ▾ ]  │
│                        │
│  [        开始探索      ]│
└────────────────────────┘
```

## 规则

语言分为：

- `ui_language`
- `content_languages`
- `translation_target_language`
- `region`

不要将它们合并成一个字段。

---

# 11. P003 注册 / 登录

## 登录方式

- 手机号
- Email
- Apple
- Google
- 可选第三方 OAuth

## 交互

输入手机号 → 获取验证码 → 验证 → 创建账号。

首次注册：

```text
语言 → 地区 → 兴趣 → 推荐创作者 → 首页
```

## 风控

- 同设备批量注册检测
- 验证码频率限制
- IP 风险
- 设备指纹
- 黑名单

---

# 12. P101 首页 For You

## 目标

打造“打开 App 就能刷”的消费内容 Feed。

## UI 原型

```text
┌─────────────────────────────────────┐
│ Taso       For You | Following   🔍 │
├─────────────────────────────────────┤
│ @tokyofood · 2h ago                 │
│ Shibuya这家烧肉真的值得来吗？         │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │            图片/视频              │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 📍 Shibuya · 焼肉Taso               │
│ ¥3,800 / 人 · ★4.7                  │
│                                     │
│ ❤️ 1.2K   💬 82   ↗ 分享   🔖 收藏    │
│                                     │
│ 查看翻译 · View original             │
├─────────────────────────────────────┤
│     Home  Explore  +  Benefits Me   │
└─────────────────────────────────────┘
```

## 帖子类型

### 普通社交帖

文字 + 图/视频。

### 消费体验帖

增加：

- 商家
- 地点
- 消费金额
- 人均
- 消费时间
- 评分
- 推荐指数

### 攻略帖

可包含多个地点。

### 旅行日志

时间轴形式。

---

# 13. Feed 推荐机制

## 推荐信号

```text
基础分
+ 兴趣匹配
+ 语言匹配
+ 地理位置
+ 用户关注
+ 内容质量
+ 新鲜度
+ 评论质量
+ 商家相关性
+ 消费真实性
- 举报
- 重复内容
- 广告疲劳
- 风险账号
```

## 内容池

```text
Following Pool
Recommended Pool
Local Pool
Trending Pool
Merchant Pool
Creator Pool
```

## 冷启动

新用户没有行为时：

```text
地区 40%
兴趣 30%
热门 20%
语言 10%
```

后续随着行为数据逐步切换到个性化推荐。

---

# 14. P102 Following

严格展示关注对象内容。

顶部：

```text
For You | Following
```

长按 Feed 卡片：

- 不感兴趣
- 屏蔽该账号
- 屏蔽该商家
- 举报
- 分享

---

# 15. P103 帖子详情

## 页面结构

```text
作者
 ↓
原文
 ↓
翻译
 ↓
图片/视频
 ↓
商家/地点卡
 ↓
互动
 ↓
评论
 ↓
相关推荐
```

## 翻译

默认：

```text
原文：This ramen is surprisingly good.
[翻译成中文]
```

点击后：

```text
原文
This ramen is surprisingly good.

中文
这家拉面出乎意料地好吃。

[查看原文]
```

翻译服务需要保留原文，不修改原帖子内容。X 的官方产品设计就是在原文下方提供翻译，而非直接覆盖原文。^1

---

# 16. P104 评论区

## UI

```text
评论 82

@alex
这里排队多久？
  ↳ @tom：大概30分钟
  ❤️ 23    回复

@mia
人均大概多少？
  ↳ 作者：3800日元
```

## 排序

- 热门
- 最新
- 作者回复

## 评论功能

- 点赞
- 回复
- 翻译
- 举报
- 引用

---

# 17. P105 用户主页

```text
┌─────────────────────────────┐
│ ←                 ⋯         │
│                             │
│         [Avatar]            │
│       Alex · Tokyo          │
│       Creator               │
│                             │
│  12.8K Followers  1,243     │
│                             │
│ [关注]                      │
│                             │
│ Posts | Reviews | Media     │
│                             │
│ 图片网格 / 内容列表          │
└─────────────────────────────┘
```

用户可以被定义为：

- 普通会员
- Creator
- Merchant
- Official

认证徽章必须和身份类别绑定。

---

# 18. P201 发现首页

## 核心模块

```text
搜索框

附近
城市
美食
旅行
热门
商家优惠

[Tokyo]
[Hong Kong]
[Bangkok]
[Seoul]

今日热门

大家都在搜：
拉面 / 烧肉 / 酒店 / 温泉
```

## Discovery 推荐

按地区生成：

```text
距离 + 热度 + 用户兴趣 + 商家质量 + 内容新鲜度
```

---

# 19. P202 搜索

搜索支持：

- 用户
- 帖子
- 商家
- 地点
- 话题
- 城市

## 搜索结果 Tab

```text
全部 | 用户 | 商家 | 帖子 | 地点 | 话题
```

## 搜索建议

支持多语言联想：

```text
拉面
ramen
ラーメン
```

可统一召回。

---

# 20. P203 商家详情

这是 Taso 与普通 Twitter 类产品最核心的差异页面。

```text
┌──────────────────────────────┐
│ 图片轮播                      │
│                              │
│ 焼肉Taso                     │
│ ★4.7  2,381 reviews          │
│ 📍 Tokyo Shibuya             │
│                              │
│ [导航] [收藏] [分享]          │
│                              │
│ Taso Card Benefit             │
│ 会员专享：95折 + 饮品1杯      │
│                              │
│ 今日营业 11:00 - 23:00        │
│                              │
│ Posts | Reviews | Offers      │
│                              │
│ [合作商家]                    │
└──────────────────────────────┘
```

## 商家详情数据

- Logo
- 封面
- 商家名
- 多语言名
- 地址
- 经纬度
- 营业时间
- 电话
- 类目
- 评分
- 评论数
- Taso 会员权益
- 是否合作商家
- 优惠有效期
- 用户内容

---

# 21. P204 地点详情

与商家解耦。

例：

```text
Shibuya

热度 98

热门内容
热门商家
附近活动
附近创作者
```

地点本身也可以成为社交对象。

---

# 22. P301 发布文字 / 图片

## 发布流程

```mermaid
flowchart LR
    A[点击 +] --> B[选择图片/视频/文字]
    B --> C[编辑内容]
    C --> D[绑定地点/商家]
    D --> E[设置语言]
    E --> F[选择可见范围]
    F --> G[发布前检查]
    G --> H[发布]
```

## 编辑器

```text
┌────────────────────────────┐
│ 取消             发布       │
│                            │
│ 今天去了一家很不错的烧肉店… │
│                            │
│ [图片] [图片] [+]          │
│                            │
│ 📍 添加地点                 │
│ 🏪 添加商家                 │
│ ⭐ 添加评分                 │
│ 💴 添加消费金额             │
│                            │
│ 谁可以看：所有人 ▾          │
└────────────────────────────┘
```

## 自动能力

- AI 推荐话题
- 自动识别商家
- OCR 可选识别消费金额
- 图片质量检测
- NSFW 检测
- 烟火、暴力、广告等内容审核
- 自动生成翻译

---

# 23. P303 消费体验发布

这是平台“社交 + 商业”的重要差异化入口。

## 表单

```text
商家：焼肉Taso
地点：Shibuya
消费时间：2026-09-08 19:30
人均：¥3,800
评分：★★★★☆
推荐：值得

体验：
________________________________

照片/视频
[+] [image]

是否使用 Taso 会员卡：
[✓] 是

消费凭证：
[上传，可选]

[发布体验]
```

如果后续涉及报销资格，应在该页面明确：

> “发布内容 ≠ 自动获得报销；报销必须另行提交符合要求的消费凭证并完成审核。”

---

# 24. P401 会员卡首页

## 定位

“权益中心”而非“钱包中心”。

```text
┌────────────────────────────┐
│ 我的会员卡           设置   │
│                            │
│ ┌────────────────────────┐ │
│ │        TASO CARD       │ │
│ │                        │ │
│ │ **** **** **** 3812    │ │
│ │ VISA                   │ │
│ └────────────────────────┘ │
│                            │
│ 可用余额                    │
│ HK$ 12,580.00              │
│                            │
│ [充值]   [消费记录]         │
│                            │
│ 本月权益                    │
│ 优惠 HK$ 382               │
│ 待结算 HK$ 96              │
│                            │
│ ───────────────────────── │
│ 报销中心                    │
│ 推广中心                    │
│ 创作收益                    │
└────────────────────────────┘
```

## 重要状态

- Card Applying
- Card Pending Verification
- Card Issued
- Card Shipping
- Card Active
- Card Frozen
- Card Expired

---

# 25. P402 申请实体会员卡

## 页面

```text
Taso Visa 联名会员卡

实体卡办理费
HK$ 1,000

会员权益
✓ 合作商家优惠
✓ 会员活动
✓ 消费权益
✓ 全球支付能力（以发卡机构支持范围为准）

[立即申请]
```

## Step

```text
产品说明
→ 条款同意
→ 身份验证
→ 地址信息
→ 申请支付
→ 审核
→ 制卡
→ 配送
→ 激活
```

不要在 Taso App 内保存完整卡号、CVV 等高敏感支付数据；优先使用发卡机构 Tokenization/SDK/API。

---

# 26. P403 卡片详情

```text
卡状态：已激活

额度/余额：HK$ 12,580

本月消费：HK$ 3,920

合作商家节省：HK$ 280

[冻结卡片]
[设置交易通知]
[查看完整卡号*]
[更换/补卡]
```

*完整卡信息仅由符合 PCI DSS 与发卡行安全规范的卡组件提供。

---

# 27. P404 充值

## 页面

```text
充值

选择币种
[HKD] [USD] [USDT] [USDC]

充值金额
[ 10,000.00 ]

费用
充值金额         HK$10,000
手续费 16%        HK$1,600
预计支付          HK$11,600

到账规则：以实际合作机构处理结果为准

[确认充值]
```

## USDT / USDC

必须增加：

```text
Network
○ ERC-20
○ TRC-20
○ Solana
...

钱包地址
[***************]

[复制地址]

风险提示
发送至错误网络可能导致资产无法追回。
```

香港自 2025 年 8 月 1 日起实施稳定币发行人监管制度；HKMA 亦说明稳定币业务受到客户保护、反洗钱、金融稳定等监管关注。2026 年 5 月 SFC/HKMA 又针对“持牌稳定币发行人发行的相关稳定币”的相关活动发布了进一步要求。因此，Taso 不应简单地把“支持 USDT/USDC 充值”当成普通支付功能，应通过持牌合作方完成钱包、托管、兑换、合规筛查及链上风控。^9 ^10 ^11

---

# 28. P405 钱包

## 余额必须拆账

```text
可用消费余额         HK$ 10,500
创作收益             HK$ 620
推广奖励             HK$ 180
待结算报销           HK$ 1,240
冻结金额             HK$ 300
可提现余额            HK$ 800
```

禁止显示一个笼统“总余额”让用户误以为所有余额均可立即提现。

## 余额状态

- Available
- Pending
- Frozen
- Locked
- Withdrawable
- Reversed

---

# 29. P406 交易明细

筛选：

```text
全部 | 充值 | 消费 | 报销 | 创作 | 推广 | 提现 | 手续费
```

每条流水：

```text
2026-09-08
会员卡充值
+HK$10,000
手续费 HK$1,600
交易完成
```

必须支持交易 ID、时间、币种、金额、状态、关联单号。

---

# 30. P407 消费报销

## 首页

```text
消费报销

可提交单据
已审核 12 张
结算中 8 张
已完成 21 张

[+ 提交消费账单]

结算中

餐厅 A
消费：HK$ 800
可结算上限：HK$ 928
已结算：HK$ 120
剩余：HK$ 808
日结规则：按平台公布规则执行

[查看详情]
```

## 核心规则

用户提出：

- 最高报销比例：116%
- 每日结算：0.05%
- 每张账单独立结算
- 余额可提现至数字钱包或绑定银行卡

产品必须将它拆成四个可配置字段：

```text
eligible_ratio = 116%
daily_settlement_rate = 0.05%
settlement_base = original_eligible_amount
max_settlement = original_eligible_amount * 116%
```

若 `daily_settlement_rate = 0.05%` 且按原始合规金额每日线性结算，则达到 116% 总额理论上需要：

`116% / 0.05% = 2320 天 ≈ 6.36 年`

因此如果商业上希望用户在明显更短时间内完成结算，必须增加其他合法机制（例如不同档位、活动加速、非线性计算或更改比例），不能在交互上隐藏这一时间跨度。

同时，**不建议页面使用“收益”“投资回报”“稳赚”等措辞**。应根据实际法律结构使用“消费权益结算”“平台补贴”“会员权益”等经法务确认后的定义。

---

# 31. P408 报销详情

## 页面

```text
消费报销 #R202609081288

商家：焼肉Taso
消费日期：2026-09-08
原始消费：HK$800
审核金额：HK$800
权益上限：HK$928

结算进度
████████░░  62%

已结算：HK$120
今日预计：HK$0.40
剩余：HK$808

结算记录
09/09  HK$0.40  已入账
09/08  HK$0.40  已入账
...

[查看原始凭证]
```

## 状态

```text
DRAFT
SUBMITTED
UNDER_REVIEW
APPROVED
REJECTED
SETTLING
COMPLETED
FROZEN
REVERSED
```

审核失败必须明确原因：

- 凭证模糊
- 商家不符合资格
- 金额不一致
- 重复提交
- 超过时限
- 风控命中
- 非本人消费
- 其他

---

# 32. P409 提现

## 首页

```text
提现

可提现余额：HK$ 800

提现至
○ 绑定银行卡
○ 数字钱包

金额
[ 500 ]

手续费
HK$ X

到账时间
预计 X 个工作日

[提交提现]
```

## 风控

- 首次提现需要实名/加强验证
- 新绑定银行卡冷却期
- 高金额人工审核
- 黑名单钱包地址拦截
- AML 风险筛查
- 资金来源/单据关联

数字资产提现只能在实际持牌/合规的支付或虚拟资产合作架构下开放。

---

# 33. P410 推广中心

## 页面

```text
推广中心

我的邀请人数      128
直接邀请           32
总奖励          HK$ 2,380
待结算             HK$ 420

我的推广链接
https://taso.app/r/A8K29
[复制] [分享]

奖励结构（仅展示当前适用规则）
一级     xx%
二级     xx%
三级     xx%

[查看详细规则]
```

产品设计原则：**奖励规则以后台审核通过的地区/方案为准，不直接在客户端硬编码 30% / 5% / 1%。**

## 推荐关系树

```text
我
├── A
│   ├── A1
│   └── A2
├── B
│   ├── B1
│   └── B2
└── C
```

前台只展示合法、必要的信息，不展示完整层级用户的隐私数据。

---

# 34. P411 创作收益

```text
创作中心

本月内容收益        HK$ 620
待结算               HK$ 180
已结算             HK$ 440

内容表现
帖子 1   124K views   收益 HK$ 120
帖子 2    62K views   收益 HK$ 80
帖子 3    18K views   收益 HK$ 23

[收益规则]
```

## 创作收益模型建议

第一阶段不要按“曝光=固定现金”简单发钱。建议：

```text
有效曝光
+ 阅读完成率
+ 收藏
+ 评论质量
+ 真实消费带来的商户价值
+ 内容原创性
- 刷量
- 互刷
- 垃圾内容
```

形成“创作质量分”。

---

# 35. P501 我的

```text
┌────────────────────────────┐
│ 设置                         │
│                             │
│ [Avatar] Alex                │
│ Creator · Tokyo              │
│                             │
│ 12.8K Followers              │
│                             │
│ Posts     Reviews    Likes   │
│                             │
│ ──────────────────────────  │
│ 我的帖子                     │
│ 我的收藏                     │
│ 我的关注                     │
│ 我的足迹                     │
│ 创作中心                     │
│ 会员卡                       │
│ 钱包                         │
│ 消费报销                     │
│ 推广中心                     │
│ 设置                         │
└────────────────────────────┘
```

---

# 36. P503 语言与地区

## 设置页面

```text
语言与地区

App 显示语言
中文（简体）

内容语言
✓ 中文
✓ English
✓ 日本語

自动翻译
[ON]

自动翻译到
中文

显示地区
Hong Kong

本地内容优先级
[高]
```

## 自动翻译策略

每条内容：

```text
language_detected
↓
user_content_languages
↓
translation_target_language
↓
是否已有缓存
↓
机器翻译
↓
翻译质量/敏感词检测
↓
展示
```

支持：

- 原文
- 自动翻译
- 查看原文
- 纠正翻译

---

# 37. P505 安全与隐私

模块：

- 登录设备
- 修改密码
- 2FA
- 手机/邮箱
- 提现安全
- 钱包地址管理
- 银行卡管理
- 授权管理
- 隐私设置
- 拉黑/屏蔽
- 下载个人数据
- 注销账户

金融相关操作建议强制启用 2FA。

---

# 38. P506 实名/KYC 状态

```text
身份验证

当前状态：已通过

姓名：******
地区：Hong Kong

可用功能
✓ 会员卡
✓ 充值
✓ 报销
✓ 提现
✓ 数字资产
```

状态：

```text
NOT_STARTED
PENDING
VERIFIED
REJECTED
EXPIRED
REVIEW_REQUIRED
```

KYC 所需字段由实际牌照方/发卡行/支付机构决定，Taso 不应凭产品设计自行扩大个人敏感资料收集范围。

---

# 39. 关键交互 01：用户发帖

```mermaid
sequenceDiagram
    participant U as 用户
    participant App as Taso App
    participant M as Media Service
    participant Mod as Moderation
    participant Feed as Feed Service

    U->>App: 点击发布
    App->>M: 上传图片/视频
    M-->>App: media_id
    U->>App: 编辑文字、商家、地点
    App->>Mod: 内容审核
    Mod-->>App: PASS / REVIEW / REJECT
    alt PASS
        App->>Feed: 创建帖子
        Feed-->>U: 发布成功
    else REVIEW
        App-->>U: 审核中
    else REJECT
        App-->>U: 拒绝 + 原因
    end
```

---

# 40. 关键交互 02：消费账单报销

```mermaid
sequenceDiagram
    participant U as 用户
    participant App as Taso
    participant OCR as OCR
    participant Risk as Risk Engine
    participant Audit as Audit
    participant Ledger as Ledger

    U->>App: 提交消费账单
    App->>OCR: OCR识别
    OCR-->>App: 商家/日期/金额/订单号
    App->>Risk: 重复/金额/商户/用户风险检查
    Risk-->>App: Risk Score
    alt 低风险
        App->>Audit: 自动审核或进入抽检
    else 高风险
        App->>Audit: 人工审核
    end
    Audit-->>App: APPROVED / REJECTED
    alt APPROVED
        App->>Ledger: 创建独立结算账本
        Ledger-->>App: settlement_id
        App-->>U: 开始结算
    else REJECTED
        App-->>U: 驳回原因
    end
```

---

# 41. 关键交互 03：会员卡充值

```mermaid
sequenceDiagram
    participant U as 用户
    participant App as Taso
    participant PSP as 支付服务商
    participant Card as 发卡/卡处理方
    participant Ledger as Taso Ledger

    U->>App: 输入充值金额
    App-->>U: 展示费用、汇率、最终应付
    U->>App: 确认
    App->>PSP: 创建支付
    PSP-->>App: 支付结果
    PSP->>Card: 入账/充值
    Card-->>PSP: 成功
    PSP->>Ledger: 交易通知
    Ledger-->>App: 更新余额/流水
    App-->>U: 充值成功
```

---

# 42. 关键交互 04：USDT/USDC 充值

```mermaid
sequenceDiagram
    participant U as 用户
    participant App as Taso
    participant Crypto as 合规数字资产服务商
    participant Chain as Blockchain
    participant Risk as AML/Risk
    participant Ledger as Ledger

    U->>App: 选择 USDT/USDC
    App->>Crypto: 创建充值订单
    Crypto-->>App: 地址 + Network + Expiry
    App-->>U: 展示充值地址/网络
    U->>Chain: 链上转账
    Chain-->>Crypto: Tx detected
    Crypto->>Risk: 钱包风险筛查
    Risk-->>Crypto: PASS / HOLD / BLOCK
    alt PASS
        Crypto->>Ledger: 入账
        Ledger-->>App: 更新
    else HOLD/BLOCK
        Crypto-->>App: 风险处理
    end
```

---

# 43. 商家系统

虽然主要是消费者 App，但商家生态必须同时建设。

## Merchant Portal

### 商家首页

- 今日会员消费
- 今日订单
- 会员权益使用
- 用户评价
- 内容曝光
- 核销
- 活动

### 商家详情管理

- 基础信息
- 门店
- 营业时间
- 菜单/商品
- 地图
- 多语言
- 会员权益

### 优惠创建

```text
活动名称
优惠类型
折扣
开始时间
结束时间
适用门店
适用会员等级
每日上限
```

### 商家核销

用户出示：

```text
Taso Membership QR
```

商家扫码后：

```text
会员身份
优惠规则
订单金额
优惠金额
最终金额
```

---

# 44. 后台运营系统

## Dashboard

```text
DAU
MAU
注册用户
活跃创作者
内容发布量
商家数
会员卡数
充值金额
消费金额
报销申请
报销待结算
提现申请
推广奖励
风险订单
```

## 内容后台

- 内容审核
- 举报
- 用户申诉
- 敏感词
- AI 审核
- 人工审核
- 商家投诉

## 商家后台

- 商户审核
- 门店管理
- 优惠管理
- 商家结算
- 用户评论

## 金融/账务后台

- 充值
- 手续费
- 消费
- 报销
- 创作收益
- 推广佣金
- 提现
- 冲正
- 冻结

## 风控后台

- 用户风险
- 设备风险
- IP 风险
- 钱包风险
- 重复凭证
- 多账号关联
- 异常推广
- 异常提现

---

# 45. 核心数据模型

## User

```text
id
username
nickname
avatar
country_code
region
ui_language
content_languages
translation_language
email
phone
status
kyc_status
creator_status
merchant_status
risk_level
created_at
```

## Post

```text
id
author_id
post_type
text
language
visibility
location_id
merchant_id
consumption_id
like_count
comment_count
share_count
bookmark_count
status
created_at
```

## Merchant

```text
id
name
localized_names
category
address
country
city
lat
lng
business_hours
rating
review_count
partner_status
```

## Card

```text
id
user_id
issuer_id
card_product_id
masked_pan
status
activated_at
expiry_at
```

## WalletAccount

```text
id
user_id
currency
account_type
available_balance
pending_balance
locked_balance
withdrawable_balance
status
```

## Transaction

```text
id
user_id
account_id
type
sub_type
currency
amount
fee
net_amount
source_id
status
created_at
```

## Reimbursement

```text
id
user_id
merchant_id
consumption_time
original_amount
approved_amount
eligible_ratio
max_settlement_amount
settlement_rate
settled_amount
remaining_amount
status
risk_score
review_reason
```

## Referral

```text
id
user_id
parent_user_id
level
commission_plan_id
commission_rate
commission_base
commission_amount
status
```

## Translation

```text
id
content_id
source_language
target_language
source_text
translated_text
engine
quality_score
status
```

## Friendship（V1.2 新增，详见 §73.12）

```text
id
user_id
friend_id
status        (REQUESTED / ACCEPTED / BLOCKED)
source        (SEARCH / QR / CONTACTS / RECOMMEND / PROFILE)
request_note
created_at
accepted_at
```

## Conversation（V1.2 新增）

```text
id
type          (DIRECT)
member_ids
last_message_id
updated_at
```

## Message（V1.2 新增）

```text
id
conversation_id
sender_id
msg_type      (TEXT / IMAGE / POST_SHARE / MERCHANT_SHARE)
text
payload
status        (SENT / DELIVERED / READ)
created_at
```

---

# 46. 账务设计原则

**不要使用“改余额”的方式实现业务账务。**

采用复式或准复式 Ledger 思路：

```text
Transaction
   ↓
Ledger Entry
   ↓
Account Balance Projection
```

所有钱/权益都有来源：

```text
TOPUP
CARD_PAYMENT
REIMBURSEMENT_SETTLEMENT
CREATOR_REWARD
REFERRAL_REWARD
WITHDRAWAL
FEE
REVERSAL
FREEZE
UNFREEZE
```

### 幂等

任何支付/报销/提现接口必须使用：

```text
idempotency_key
```

避免重复入账。

---

# 47. 报销风控规则

建议 V1 即加入：

### 47.1 重复凭证

图片 Hash + OCR 字段 + 用户 + 商家 + 日期联合判断。

### 47.2 金额篡改

OCR 金额与用户填写金额不一致 → 人工审核。

### 47.3 商家真实性

商家必须存在于 Taso Merchant Master 或可验证交易来源。

### 47.4 频率异常

```text
同用户
24小时提交 50 单
→ Risk High
```

### 47.5 多账户关联

同设备 / 同支付来源 / 同钱包 / 同收款账户关联。

### 47.6 时间异常

消费时间与票据时间不一致。

---

# 48. UI 设计系统

## 48.1 视觉方向

关键词：

**Premium / Travel / Editorial / Social / Fintech-lite**

不建议使用典型“金融理财 App”视觉。

## 48.2 色彩

```text
Primary       #111111
Background    #F7F7F5
Card          #FFFFFF
Text          #111111
Secondary     #666666
Divider       #E8E8E8
Success       #16803C
Warning       #B7791F
Danger        #C53030
Accent        #C8A96B
```

品牌金建议只作为会员卡、权益、认证等少量强调，不要满屏金色。

## 48.3 字体

中文：Noto Sans CJK / PingFang SC

英文：Inter / SF Pro

日文：Noto Sans JP

## 48.4 圆角

```text
Button     12px
Card       16px
Avatar     50%
Input      12px
BottomSheet 20px
```

## 48.5 间距

采用 4pt Grid：

```text
4 / 8 / 12 / 16 / 20 / 24 / 32 / 40
```

## 48.6 设计令牌落地状态（V1.1）

以上设计系统已在 V0.1 高保真原型中以 CSS 自定义属性落地（`src/style.css`），raw hex 仅允许出现在令牌区：

```css
:root{
  --bg:#F7F7F5; --surface:#FFFFFF; --fg:#111111; --muted:#666666;
  --border:#E8E8E8; --accent:#C8A96B; --ok:#16803C; --warn:#B7791F; --danger:#C53030;
  --accent-soft / --ok-soft / --warn-soft / --danger-soft / --fg-soft（color-mix 派生）
  --font-display / --font-body / --font-mono
  --r-sm:12px; --r-md:16px; --r-lg:20px;
}
```

圆角令牌与 §48.4 一致（Button=--r-sm、Card=--r-md、BottomSheet=20px 硬编码同值）。动效：屏幕切换 fadein .22s、底部弹层 cubic-bezier(.32,.72,.28,1) .28s、Toast .2s。组件类（card/chip/li/seg/kv/badge/switch/sheet/dialog/toast 等）与状态（hover/active/focus-visible/disabled）已全部随令牌实现，后续 iOS/Android 与 Web 端应直接复用该令牌表，不得另起配色。

---

# 49. 首页 UI 建议

首页整体视觉建议接近：

```text
X 的文本信息密度
+
Instagram 的图片表达
+
TikTok 的沉浸式视频
+
Tripadvisor 的消费信息
+
Taso 自己的商家/权益卡片
```

### 关键组件

1. Post Card
2. Media Carousel
3. Merchant Mini Card
4. Location Chip
5. Translation Row
6. Social Action Bar
7. Offer Card
8. Creator Badge
9. Consumption Badge

---

# 50. 内容可信度设计

这是 Taso 与普通社交平台差异最大的地方之一。

建议提供：

### 用户标签

```text
✓ Verified Member
✓ Verified Purchase
✓ Local Creator
✓ Frequent Traveler
```

其中“Verified Purchase”只能在平台或可信数据源验证消费后展示。

例如：

```text
Alex · Tokyo
✓ Verified Purchase

这家寿司值得去吗？
```

比单纯显示“达人”更有说服力。

---

# 51. 内容商业化

创作者可以：

```text
普通帖子
↓
高质量内容
↓
商家合作
↓
品牌合作
↓
创作激励
```

商家推广内容必须有明确广告/合作标识，例如：

```text
Sponsored
合作内容
```

避免把商业推广伪装成普通用户真实体验。

---

# 52. 通知中心

通知分类：

```text
全部
互动
关注
订单/权益
审核
系统
```

### 示例

```text
❤️ Alex liked your post

🏪 Taso 消费凭证审核已通过

💰 今日消费权益 HK$0.40 已入账

💳 会员卡充值 HK$10,000 已成功

👥 Sora 请求添加你为好友

🌏 Your post has been translated into Japanese
```

---

# 53. 举报 / 内容安全

举报原因：

```text
垃圾广告
诈骗
虚假消费
虚假评价
色情
暴力
仇恨
盗用内容
冒充
其他
```

高风险金融内容额外增加：

```text
虚假收益承诺
投资诈骗
虚假提现
虚假充值
诱导转账
```

---

# 54. 多语言产品架构

## 支持语言

V1 建议：

- 简体中文
- 繁体中文
- English
- 日本語
- 한국어

V2：

- Thai
- Spanish
- French
- Indonesian
- Vietnamese

## Translation Cache

同一帖子对同一语言只翻译一次：

```text
content_id + target_language + content_version
```

避免重复调用翻译服务。

---

# 55. 地区化

地区不是只有 IP。

建议综合：

```text
用户手动设置
+
设备系统地区
+
GPS（用户授权）
+
IP 粗粒度地区
+
消费地点
```

对于金融/卡功能，地区判断必须使用合规定义，而不是单纯 IP 判断。

---

# 56. 首页 Feed Ranking V1

推荐分可设计为：

```text
score =
  0.25 * interest_match
+ 0.15 * social_affinity
+ 0.15 * local_relevance
+ 0.15 * content_quality
+ 0.10 * freshness
+ 0.10 * merchant_relevance
+ 0.10 * creator_quality
```

V2 加入：

- watch time
- completion rate
- save probability
- follow probability
- conversion

模型不直接使用“消费金额”决定曝光，避免把平台内容生态异化为“花钱越多越容易获得流量”。

---

# 57. 推荐系统事件

App 埋点：

```text
feed_impression
post_open
post_like
post_comment
post_share
post_save
post_follow
post_not_interested
translation_open
merchant_open
merchant_save
direction_click
card_view
card_apply
card_topup
card_payment
reimbursement_submit
reimbursement_approve
withdraw_submit
friend_request_send（V1.2）
friend_request_accept（V1.2）
friend_request_reject（V1.2）
chat_open（V1.2）
message_send（V1.2）
message_read（V1.2）
```

---

# 58. MVP 范围

## Phase 1：社交内容

必须上线：

- 注册登录
- 多语言
- Feed
- Following
- 发帖
- 图片/视频
- 评论
- 点赞
- 收藏
- 分享
- 用户主页
- 搜索
- 商家
- 地点
- 自动翻译

## Phase 2：会员权益

- 会员卡
- 申请卡
- 卡片状态
- 充值
- 消费记录
- 商家优惠

## Phase 3：资金/权益

- 消费凭证
- 报销
- 结算
- 提现
- 风控

## Phase 4：增长

- Creator Economy
- Referral
- 商户营销
- 活动中心

## Phase 5：数字资产

- USDT
- USDC
- 网络选择
- 地址管理
- 链上确认
- AML 风险

数字资产应放在独立合规项目中，不建议为了“功能完整”与社交 MVP 同批上线。

---

# 59. 核心用户故事

## US-001 浏览

作为用户，我希望根据我的地区和语言看到适合我的美食/旅行内容。

## US-002 分享

作为会员，我希望上传图片和视频分享我的消费体验。

## US-003 翻译

作为日本用户，我希望阅读中文用户发布的内容，并能够自动翻译成日语。

## US-004 找商家

作为游客，我希望通过真实用户内容找到附近值得去的餐厅。

## US-005 会员卡

作为会员，我希望在合作商家消费时享受专属优惠。

## US-006 账单

作为会员，我希望上传合格的消费凭证申请相应的平台权益结算。

## US-007 提现

作为有可提现余额的用户，我希望查看手续费和到账时间，再决定是否提现。

## US-008 创作者

作为创作者，我希望了解内容产生了多少有效互动和创作收益。

## US-009 商家

作为商家，我希望知道我的门店获得了多少曝光、会员消费和内容推荐。

---

# 60. 关键状态机

## 报销状态机

```mermaid
stateDiagram-v2
    [*] --> DRAFT
    DRAFT --> SUBMITTED
    SUBMITTED --> UNDER_REVIEW
    UNDER_REVIEW --> APPROVED
    UNDER_REVIEW --> REJECTED
    APPROVED --> SETTLING
    SETTLING --> COMPLETED
    SETTLING --> FROZEN
    FROZEN --> SETTLING
    SETTLING --> REVERSED
    REJECTED --> [*]
    COMPLETED --> [*]
```

## 会员卡状态机

```mermaid
stateDiagram-v2
    [*] --> APPLYING
    APPLYING --> PENDING_VERIFICATION
    PENDING_VERIFICATION --> APPROVED
    PENDING_VERIFICATION --> REJECTED
    APPROVED --> ISSUING
    ISSUING --> SHIPPING
    SHIPPING --> ACTIVE
    ACTIVE --> FROZEN
    FROZEN --> ACTIVE
    ACTIVE --> EXPIRED
```

---

# 61. API 模块建议

## Auth

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/otp
POST /api/v1/auth/logout
```

## Feed

```text
GET /api/v1/feed/for-you
GET /api/v1/feed/following
POST /api/v1/posts
GET /api/v1/posts/{id}
POST /api/v1/posts/{id}/like
POST /api/v1/posts/{id}/bookmark
```

## Translation

```text
GET /api/v1/posts/{id}/translations
POST /api/v1/translations
```

## Merchant

```text
GET /api/v1/merchants
GET /api/v1/merchants/{id}
GET /api/v1/merchants/{id}/offers
```

## Card

```text
POST /api/v1/cards/application
GET /api/v1/cards
GET /api/v1/cards/{id}
POST /api/v1/cards/{id}/freeze
POST /api/v1/cards/{id}/activate
```

## Wallet

```text
GET /api/v1/wallets
GET /api/v1/wallets/{currency}
GET /api/v1/transactions
POST /api/v1/topups
```

## Reimbursement

```text
POST /api/v1/reimbursements
GET /api/v1/reimbursements
GET /api/v1/reimbursements/{id}
```

## Withdrawal

```text
POST /api/v1/withdrawals
GET /api/v1/withdrawals
```

## Referral

```text
GET /api/v1/referral/summary
GET /api/v1/referral/tree
GET /api/v1/referral/transactions
```

## Friends / IM（V1.2 新增，详见 §73）

```text
GET    /api/v1/friends
POST   /api/v1/friends/requests
GET    /api/v1/friends/requests?dir=in|out
POST   /api/v1/friends/requests/{id}/accept
POST   /api/v1/friends/requests/{id}/reject
DELETE /api/v1/friends/requests/{id}
DELETE /api/v1/friends/{friend_id}
GET    /api/v1/conversations
GET    /api/v1/conversations/{id}/messages?before_cursor=
POST   /api/v1/conversations/{id}/messages
POST   /api/v1/conversations/{id}/read
WS     /api/v1/ws
```

---

# 62. 技术架构建议

> **V1.1 状态**：Client 中 Web 端基线已建立 —— `demo-taso-vue`（Vite 8 + Vue 3.5 + TypeScript，零额外运行时依赖），31 个页面组件 + 栈式路由 + 设计令牌全部落地，可作为 Web 端迭代起点与 iOS/Android UI 对照基准，详见 §72。后端各服务、Gateway 与数据层尚未启动。

```mermaid
flowchart TB
    Client[iOS / Android / Web]
    Gateway[API Gateway]

    Auth[Auth Service]
    User[User Service]
    Feed[Feed Service]
    Content[Content Service]
    Merchant[Merchant Service]
    Card[Card Integration Service]
    Wallet[Wallet/Ledger Service]
    Reimburse[Reimbursement Service]
    Referral[Referral Service]
    Translate[Translation Service]
    Risk[Risk/AML Service]
    Notify[Notification Service]

    DB[(MySQL)]
    Redis[(Redis)]
    MQ[(Kafka/Queue)]
    Object[(Object Storage)]
    Search[(OpenSearch)]

    Client --> Gateway
    Gateway --> Auth
    Gateway --> User
    Gateway --> Feed
    Gateway --> Content
    Gateway --> Merchant
    Gateway --> Card
    Gateway --> Wallet
    Gateway --> Reimburse
    Gateway --> Referral

    Feed --> Redis
    Feed --> Search
    Content --> Object
    Content --> MQ
    Reimburse --> OCR[OCR Service]
    Reimburse --> Risk
    Wallet --> DB
    Wallet --> MQ
    Card --> Bank[Issuer / PSP]
    Risk --> KYC[KYC/AML Provider]
    Translate --> TranslateVendor[Translation Provider]
    Notify --> MQ
```

---

# 63. 非功能需求

## 性能

| 场景 | SLA |
|---|---|
| 首页首屏 | P95 < 1.5s |
| Feed 翻页 | P95 < 800ms |
| 帖子详情 | P95 < 1.2s |
| 搜索 | P95 < 800ms |
| 钱包余额 | P95 < 700ms |
| 交易明细 | P95 < 1s |

## 可用性

核心社交：99.9%

资金/钱包：建议 > 99.95%，并有降级策略。

## 安全

- TLS
- OAuth 2.0 / OIDC
- JWT + Refresh Token
- 2FA
- Device binding
- Rate Limit
- WAF
- Anti-bot
- Audit Log
- 数据加密
- 敏感字段脱敏

---

# 64. 财务与风控必须独立设计

建议系统存在三个域：

```text
Social Domain
   ↓
Membership Domain
   ↓
Financial Domain
```

而不是：

```text
User.balance = xxx
```

金融数据应当以不可变流水为主，余额是投影值。

### 对账

至少需要：

- Taso Ledger
- PSP
- Issuer
- Bank
- Crypto Provider

五方日终对账。

---

# 65. 合规架构重点

## 65.1 Visa / 卡

Visa 官方资料表明，要启动卡项目通常需要银行关系、Issuer Processor，并可能需要 Program Manager；BIN Sponsor 通常是持有 BIN 的发卡机构，负责资金、风险及当地法规等。Visa 的联名卡规则也要求 issuer 对项目拥有和控制相应责任。^6 ^7

**设计结论：**

Taso 不应在自己的后端“模拟发卡”，而应接入：

```text
Issuer / BIN Sponsor
        ↓
Issuer Processor
        ↓
Card API / SDK
        ↓
Taso App
```

## 65.2 储值/钱包

HKMA 说明，储值工具（包括电子钱包和预付卡等）受储值支付工具监管框架管理；香港亦存在 SVF 牌照制度。^12 ^13

**设计结论：**

“用户充值 → 平台余额 → 用于消费/支付/提现”不能仅根据互联网 App 的普通账户逻辑实现，要先确定业务究竟落入何种支付/储值安排。

## 65.3 数字资产

HKMA 说明香港稳定币发行人监管制度于 2025 年 8 月 1 日生效；2026 年相关监管文件进一步涉及持牌稳定币发行人相关稳定币活动及数字资产托管等安排。^9 ^10 ^11

**设计结论：**

USDT/USDC 功能建议采用：

```text
Taso
 ↓
Licensed / compliant crypto service provider
 ↓
Wallet / custody / conversion / screening
```

而不是自己管理用户私钥。

## 65.4 推广分佣

多级分佣功能的产品风险不只来自支付，还可能涉及消费者保护、营销和禁止层压式计划等问题。香港政府对 Cap. 617 的官方解释特别强调“参加新成员所产生的利益”这一诱因结构。^8

因此 PRD 采用：

> **Referral Plan Engine**

而不是硬编码“三级返佣系统”。

---

# 66. 产品文案建议

## 品牌主标题

> **Taso 特搜｜发现真实的世界。**

## App 首页

> 今天，去哪里？

## 商家

> 真实用户，真实体验。

## 会员卡

> 一张卡，连接更多本地权益。

## 消费内容

> 吃过、玩过、住过，再分享。

## 创作者

> 让每一次真实体验，都有价值。

## 报销/权益

不要使用：

> “消费就能赚钱”
> “躺赚”
> “稳赚”
> “保本回报”

建议使用经法律审核后的中性描述，例如：

> “符合条件的消费凭证可申请会员权益结算。”

---

# 67. 页面原型总览

> **V1.1 状态**：下图全部节点均已在高保真原型（Vue 3）中实现并可点击走通；「发布 → 审核」与「报销提交 → 审核 → 结算」在原型中以演示态交互（Toast/对话框/进度条）表达，详见 §72。

```mermaid
flowchart TD
    Start[启动] --> Onboard[语言/地区/兴趣]
    Onboard --> Login[注册/登录]
    Login --> Home[首页]

    Home --> Post[帖子详情]
    Home --> Merchant[商家详情]
    Home --> Profile[用户主页]
    Home --> Discover[发现]
    Home --> Publish[发布]
    Home --> Benefits[权益]
    Home --> Me[我的]

    Publish --> Draft[编辑]
    Draft --> Moderation[审核]
    Moderation --> Home

    Benefits --> Card[会员卡]
    Benefits --> Wallet[钱包]
    Benefits --> Reimburse[消费报销]
    Benefits --> Referral[推广]
    Benefits --> Creator[创作收益]

    Card --> Apply[办卡]
    Card --> Topup[充值]
    Wallet --> Transactions[流水]
    Reimburse --> Submit[提交账单]
    Submit --> Review[审核]
    Review --> Settlement[结算]
    Wallet --> Withdraw[提现]

    Me --> Settings[设置]
    Settings --> Language[语言/地区]
    Settings --> Security[安全/隐私]
```

---

# 68. MVP 验收标准

## 社交

- [ ] 新用户 30 秒内完成注册并进入 Feed
- [ ] 可选择 App 语言和内容语言
- [ ] Feed 支持 For You / Following
- [ ] 可发文字、图片、视频
- [ ] 可绑定商家、地点
- [ ] 支持评论、点赞、收藏、分享
- [ ] 支持翻译/查看原文
- [ ] 支持关注
- [ ] 支持举报/屏蔽

## 商家

- [ ] 商家可搜索
- [ ] 商家详情
- [ ] 用户内容聚合
- [ ] 会员优惠展示
- [ ] 门店信息

## 会员卡

- [ ] 会员卡申请
- [ ] 卡状态
- [ ] 激活
- [ ] 冻结
- [ ] 充值
- [ ] 消费明细
- [ ] 卡权益

## 报销

- [ ] 上传凭证
- [ ] OCR
- [ ] 审核
- [ ] 状态
- [ ] 独立结算
- [ ] 结算记录
- [ ] 冻结/冲正

## 钱包

- [ ] 多账户
- [ ] 账务流水
- [ ] 可提现余额
- [ ] 提现
- [ ] 风险控制

## 推广

- [ ] 邀请链接
- [ ] 关系绑定
- [ ] 奖励明细
- [ ] 结算状态
- [ ] 地区/方案可配置

## 好友与消息（V1.2 新增，详见 §73）

- [ ] 好友申请发送 / 接受 / 拒绝 / 撤回
- [ ] 仅好友之间可以私信
- [ ] 会话列表与未读角标（会话级 + 全局级）
- [ ] 消息发送 / 送达 / 已读状态
- [ ] 屏蔽与举报入口

## 国际化

- [ ] 5+ 语言
- [ ] UI 语言独立
- [ ] 内容语言独立
- [ ] 自动翻译
- [ ] 地区化推荐

---

# 69. 建议的产品版本规划

## V0.1 原型验证 ✅ 已交付（2026-09-09）

目标：验证“社交 + 商家”是否成立。

只做：

```text
注册
→ 兴趣
→ Feed
→ 商家
→ 发布
→ 评论
→ 翻译
```

**交付结果**：上述链路全部实现并经浏览器实测走通（注册引导、双 Feed、商家/地点/帖子跳转、发布器三 Tab、评论弹层、查看原文折叠翻译），同时按 PRD 全量页面清单交付了权益/钱包/设置等 31 个页面的高保真 UI 与演示态交互。交付物与实现细节见 §72；构建（`vue-tsc` + `vite build`）与响应式抽查（360×800 / 390×844 / 1000×900）通过。

## V0.5 Beta

加入：

```text
会员卡展示
商家优惠
卡申请
```

## V1.0

加入实际支付/卡能力和经过审查的账户体系。

## V1.5

加入：

```text
消费凭证
审核
会员权益结算
```

## V2.0

加入：

```text
Creator Economy
商家营销
Referral Plan
```

## V2.x

在牌照、合作方、AML、托管和地区合规都准备完成后，开放 USDT/USDC。

---

# 70. 最终产品结构

Taso 不应做成一个“把 Twitter + 银行 + 返利混在一起”的 App。

推荐最终产品模型：

```text
                  TASO
                   │
        ┌──────────┴──────────┐
        │                     │
      SOCIAL               BENEFITS
        │                     │
 ┌──────┼──────┐       ┌──────┼─────────┐
 │      │      │       │      │         │
Feed  Creator  Community Card Wallet  Merchant
 │      │      │       │      │         │
 │      └──┬───┘       │      │         │
 │         │           │      │         │
 └─────────┼───────────┘      │         │
           │                  │         │
           ▼                  ▼         ▼
        消费内容           消费权益     商家生态
           │                  │         │
           └──────────┬───────┴─────────┘
                      ▼
                 Taso Network
```

核心飞轮：

> **用户发现商家 → 去消费 → 分享真实体验 → 产生内容 → 内容带来更多用户 → 用户使用会员卡 → 商户获得消费 → 商户愿意提供更多会员权益 → Taso 内容与商业网络进一步增强。**

这个飞轮比单纯依赖“充值手续费 + 返佣”更稳健，也更利于长期品牌建设。

---

# 71. 产品经理结论

### 第一优先级：先做“内容社交 + 商家”

如果用户打开 App 后 10 秒内感受不到“这里真的有很多值得去的店和地方”，后面的会员卡、钱包和奖励很难产生长期用户价值。

### 第二优先级：会员卡做成权益入口

用户应该因为：

> “这张卡在我常去的地方很有用”

而办卡，而不是因为“可以获得某种收益”而办卡。

### 第三优先级：报销/权益账本必须建立证据链

每一笔权益都能追踪：

```text
谁
→ 在哪里
→ 什么时候
→ 花了多少钱
→ 什么凭证
→ 哪个规则
→ 审核谁
→ 结算多少
→ 什么时候入账
→ 是否提现
```

### 第四优先级：Referral 必须做成规则引擎

不要把“30% / 5% / 1%”写死在客户端。规则必须可以按国家、用户等级、活动周期、商品类型、合规状态动态配置、暂停和审计。

### 第五优先级：USDT / USDC 是独立项目

它不仅是一个“充值方式”，还会把钱包托管、链上转账、AML、Travel Rule/制裁筛查、客户资产安全、兑换/提现、地区限制等问题带入系统。产品上必须独立域设计，技术上也建议隔离账户和权限。

---

# 72. 手机端高保真原型 · Vue 3 实现状态（V0.1 交付）

## 72.1 交付概述

| 项 | 内容 |
|---|---|
| 交付日期 | 2026-09-09 |
| 代码位置 | 仓库根目录 `demo-taso-vue`（`npm run dev` 启动，`npm run build` 产出） |
| 技术栈 | Vite 8 + Vue 3.5 + TypeScript（`vue-tsc` 全量类型检查），无 vue-router/pinia 等额外运行时依赖 |
| 设计来源 | `Taso-特搜-手机端高保真原型/`（`taso-app-prototype.html` + DESIGN-HANDOFF + DESIGN-MANIFEST） |
| 转换原则 | 按 DESIGN-HANDOFF「视觉契约」执行：CSS 设计令牌与组件类逐行移植；每个 `data-screen` 转换为独立 Vue 组件（screen-file-first）；文案、合规提示、交互状态全部保留 |
| 交付范围 | PRD §8.1 全部 31 个页面 + 发布器/评论两个底部弹层 + 对话框/Toast 全局组件 |

## 72.2 工程结构

```text
src/
├── style.css            # 设计令牌（§48）+ 手机框舞台 + 全部组件类，自原型逐行移植
├── store.ts             # 全局响应式状态：屏幕栈路由 / Toast / Dialog / 弹层 / 余额 / Feed
├── data.ts              # 演示数据：Feed 帖子、搜索库、交易流水（含分类）
├── App.vue              # 手机框外壳：状态栏时钟 / 视口 / Tab 栏 / 遮罩 / 对话框 / Toast / 启动逻辑
├── components/
│   ├── IconSprite.vue   # 24 个 SVG symbol 图标库（全局单例）
│   ├── PageHeader.vue   # 页头（返回 + 标题 + 右侧插槽）
│   ├── PostCard.vue     # 信息流帖子卡（认证标识/翻译折叠/商家卡/赞评转藏）
│   ├── TasoCard.vue     # 金色渐变会员卡视觉组件
│   ├── ToggleSwitch.vue # 开关（含 Toast 反馈）
│   ├── ComposerSheet.vue    # 发布器弹层（文字/图片 · 视频 · 打卡/评分 三 Tab）
│   └── CommentsSheet.vue    # 评论弹层
└── screens/             # 28 个屏幕组件，见 §8.1 映射
public/assets/           # 10 张原型实拍图（taso-*.jpg）
```

## 72.3 导航与状态模型

与原型的栈式导航保持一致，未引入 URL 路由：

- **屏幕栈**：`show(id)` 压栈、`back()` 出栈，栈深上限 40；底部 Tab 仅在根屏幕（home/discover/benefits/me）显示
- **启动恢复**：已访问用户从 `localStorage` 恢复上次屏幕（引导流程屏幕除外），否则 splash 1.5s 后进入欢迎页
- **全局 UI**：Toast（2.2s 自动消失）、对话框（确认/取消 + 回调）、遮罩点击关闭弹层与对话框
- **业务状态**：余额/可提现金额为响应式状态并持久化（充值入账、提现扣减、跨屏实时联动）

## 72.4 已实现交互清单（均经浏览器实测）

| 模块 | 交互 |
|---|---|
| 登录 | 手机号 ≥8 位 + 验证码 ≥4 位才可提交；验证码按钮 60s 倒计时防重发 |
| Feed | For You / Following 切换；点赞/收藏/关注切换（图标填充 + 状态色）；「查看原文」折叠翻译块 |
| 发布 | 发布器三 Tab；照片选择高亮；星级评分；发布成功后新帖插入 For You 头部 |
| 评论 | 底部弹层；发送评论 Toast + 关闭 |
| 搜索 | 实时关键词过滤 + 六类结果 Tab（用户/商家/帖子/地点/话题）+ 无结果空态 |
| 会员卡 | 卡片点击进详情；冻结/解冻切换；申请实体卡确认对话框 |
| 充值 | 币种选择；金额输入实时计算 16% 手续费与应付合计；确认后余额入账并持久化 |
| 提现 | 到账方式单选；超额校验（超过可提现余额拦截）；确认后扣减可提现余额 |
| 交易/报销 | 交易分类筛选；报销提交确认对话框；结算进度条与结算记录 |
| 设置 | 语言多选 Chip、开关 Toggle + Toast；KYC/安全/通知各静态演示页 |

## 72.5 演示态边界（prototype scope）

- 全部数据为前端静态演示数据（`src/data.ts`），无后端 API；「审核」「结算」「OCR」「支付」均为演示态交互（Toast / 对话框 / 进度条）
- 登录、第三方 OAuth、实名 KYC、发卡、资金操作均为占位演示，不构成真实功能
- 充值/提现的余额联动仅存在于浏览器本地（localStorage），用于演示账本联动效果

## 72.6 与原型的差异及修正

| 项 | 说明 |
|---|---|
| `.phone` 容器 `overflow:hidden → clip` | 原型潜在缺陷：底部弹层以 `translateY(105%)` 收起时会把手机框撑成可滚动容器，程序化滚动（如 `scrollIntoView`）会把整个 App 内容滚偏。改为 `overflow:clip` 后裁剪效果一致且不产生滚动容器，已实测复现并验证修复 |
| 提现到账方式单选 | 原型 JS 的 radio 处理存在缺陷（点击任一选项两个勾选均变灰）；实现为正常的单选交互（银行卡默认选中） |
| 商家「收藏」按钮 | 原型点击会因找不到图标节点而报错无反馈；实现为 Toast 反馈 |
| 图片资源路径 | 改为 `/assets/*` 绝对路径（public 目录），保证构建产物可解析 |
| 视觉/文案 | 与原型逐像素一致，未做改动 |

## 72.7 验证记录（2026-09-09）

- `npm run build`（vue-tsc 类型检查 + vite 构建）通过，产出 ~151KB JS / ~12KB CSS（gzip 后 47KB / 3.3KB）
- 浏览器实测通过：新用户引导全流程、发布→Feed 插入、评论弹层收发、充值（12,580 → 22,580 入账并持久化）、提现校验、返回栈、搜索过滤与空态、Tab 切换
- 响应式抽查通过（无横向滚动）：360×800（紧凑）、390×844（手机框全屏化，`@media(max-width:520px)` 生效）、1000×900（桌面手机框居中、44px 圆角）

## 72.8 下一步（衔接 §69 V0.5）

1. 引入真实 API 层替换 `data.ts`（建议沿用 §61 API 模块划分）
2. 接入账号体系（OTP 真实下发、OAuth）
3. 会员卡/商家优惠接入合作方数据，替换演示数据
4. 增加单元/E2E 测试基线（当前仅人工浏览器验收）
5. 评估将栈式路由迁移至 vue-router（如需 URL 直达/分享）

---

# 73. 好友与即时消息（V1.2 新增模块）

> 模块目标：会员之间可以**添加好友**，并可以在好友关系内**发送消息聊天**。
>
> 范围：V1 仅做一对一好友关系 + 单聊；群聊、音视频通话、消息多端漫游的完整形态在后续版本演进（见 §73.11）。

## 73.1 模块定位

- **好友是关系链的“双向层”**：关注（Follow）是公开的单向订阅，好友（Friend）是需要双方确认的私人关系；好友之间才可以发送私信。
- **入口克制，不打扰内容场**：不新增底部 Tab。消息入口放在首页顶栏与「我的」页；好友入口在「我的」页与消息中心顶栏（呼应 §2.1 社交优先：Feed 仍是第一体验）。
- **私信是内容社交的延伸**：把帖子、商家、地点分享到聊天是“内容 → 关系 → 消费”闭环的关键一环（V1.5 起支持，见 §73.11）。

## 73.2 好友 vs 关注

| 维度 | 关注 Follow | 好友 Friend |
|---|---|---|
| 关系方向 | 单向，无需确认 | 双向，需要对方同意 |
| 可见内容 | 公开动态 | 公开动态 + 私信 |
| 通知位置 | 通知中心 | 通知中心 + 消息未读角标 |
| 解除方式 | 随时取关 | 任一方删除即解除 |

两者相互独立：可以只关注不交友，也可以只交友不关注。

## 73.3 好友关系状态机

```mermaid
stateDiagram-v2
    [*] --> STRANGER
    STRANGER --> REQUESTED_OUT: 我发送申请
    STRANGER --> REQUESTED_IN: 对方发申请给我
    REQUESTED_IN --> FRIENDS: 我同意
    REQUESTED_IN --> STRANGER: 我拒绝
    REQUESTED_OUT --> FRIENDS: 对方同意
    REQUESTED_OUT --> STRANGER: 对方拒绝 / 我撤回
    FRIENDS --> STRANGER: 删除好友
    FRIENDS --> BLOCKED: 屏蔽
    BLOCKED --> FRIENDS: 解除屏蔽
```

## 73.4 加好友渠道与风控

渠道：

1. Taso ID / @handle 精确搜索（P601「添加好友」弹层）
2. 二维码名片（我的名片 / 扫一扫）
3. 通讯录匹配（需用户明确授权，客户端本地加密匹配，平台不落明文通讯录）
4. 系统推荐「可能认识」：共同好友、同城、共同关注、共同兴趣
5. 他人用户主页「加好友」按钮（§17 用户主页动作区）

规则：

- 申请可附验证消息（默认“我是 {我的昵称}”）
- 申请有效期 14 天，过期自动失效
- 频率限制：单用户单日申请上限（建议 20，后台可配置）
- 被拒绝后短期内不可重复申请同一对象（防骚扰）
- 黑名单 / 风险账号禁止发起申请
- 通讯录功能最小化使用，可在设置中永久关闭

## 73.5 P601 好友页

### UI

```text
┌──────────────────────────────┐
│ ←       好友            ⊕    │
│ [ 搜索好友 / Taso ID       ] │
│ ┌──────────────────────────┐ │
│ │ 好友 2  │ 新请求 ² │ 推荐 │ │
│ └──────────────────────────┘ │
│ ●M Mia               [发消息]│
│   Frequent Traveler · Bangkok│
│ ●S Sora              [发消息]│
│   Verified Member · Seoul    │
├──────────────────────────────┤
│ 新请求 Tab                    │
│ ●S Sora                      │
│   “来自通讯录匹配” · 5m       │
│          [拒绝]  [接受]       │
│ ●K Ken                       │
│   “通过你的帖子找到你” · 昨天  │
│          [拒绝]  [接受]       │
│ ── 我发出的申请 ──            │
│ ●Y Yuki                      │
│   等待对方通过        [撤回]  │
├──────────────────────────────┤
│ 推荐 Tab（可能认识）          │
│ ●T TokyoFood         [加好友]│
│   Tokyo · Verified Purchase  │
└──────────────────────────────┘
```

### 行为

- 「⊕」打开添加好友弹层：ID 搜索 + 我的 Taso ID（复制）+ 二维码名片入口
- 好友 Tab：搜索过滤（昵称 / ID / 城市）；点击行或「发消息」进入 P603 聊天
- 新请求 Tab：收到的申请支持接受 / 拒绝；我发出的申请显示“等待对方通过”，可撤回
- 推荐 Tab：按共同好友 / 同城 / 共同关注排序；按钮三态：加好友 → 等待通过（可撤回）→ 已是好友
- 接受申请后：双方成为好友，系统自动创建会话并向申请方投递问候消息模板（可配置）

## 73.6 P602 消息中心

### UI

```text
┌──────────────────────────────┐
│ ←       消息             👥  │
│ ⊕ 2 条好友申请              › │
│ ┌──────────────────────────┐ │
│ │ ●M Mia           09:15 ①│ │
│ │   到了喊我，再给你推几家… │ │
│ │ ●S Sora            昨天  │ │
│ │   嗨，我是 Sora，很高兴…  │ │
│ └──────────────────────────┘ │
└──────────────────────────────┘
```

### 行为

- 会话按最近消息时间倒序；未读数角标（会话级 + 全局级）
- 存在待处理好友申请时，顶部显示申请横幅 → 点击进入 P601 新请求 Tab
- 会话左滑（V1.1 交互增强）：置顶 / 标记已读 / 删除会话（删除仅影响本地视图，服务端保留）
- 空态：引导「去添加好友」
- 顶栏「👥」进入好友页
- 全局未读 = 所有会话未读之和，展示于：首页顶栏消息图标、「我的-消息」入口

## 73.7 P603 聊天页

### UI

```text
┌──────────────────────────────┐
│ ←   Mia            在线   ⋯  │
│           昨天                │
│ M ┌──────────────────────┐   │
│   │ 曼谷夜市那家泰式炒粉…  │   │
│   └──────────────────────┘   │
│      ┌──────────────────────┐│
│      │ 太好了，下个月就去！   ││
│      └──────────────────────┘│
│           今天                │
│ M ┌──────────────────────┐   │
│   │ 到了喊我，再给你推几家… │   │
│   └──────────────────────┘   │
│ [ 输入消息…             ] ➤  │
└──────────────────────────────┘
```

### 行为

- 气泡：对方消息白色气泡 + 头像（左）；我的消息深色气泡（右）；最后一条我的消息下方显示「已送达 / 已读」
- 日期分隔：今天 / 昨天 / 具体日期
- 输入栏：回车或点击 ➤ 发送；空内容禁用发送；未成为好友时输入栏禁用并提示「需先成为好友」（防绕过）
- 消息上行状态：SENT → 对方客户端 DELIVERED → 对方已读 → READ（回执随长连接下发）
- 长按消息（V1.1 交互增强）：复制 / 撤回（2 分钟内）/ 举报
- 顶栏「⋯」：聊天设置（清空本地记录 / 屏蔽 / 举报）
- 未读进入会话即清零；离开会话后收到新消息：会话角标 +1，系统推送

## 73.8 P604 我的二维码名片

### UI

```text
┌──────────────────────────────┐
│ ←       我的二维码            │
│ ┌──────────────────────────┐ │
│ │            A             │ │
│ │        Alex · Creator    │ │
│ │         @alex · Tokyo    │ │
│ │   ┌──────────────────┐   │ │
│ │   │ ▩▩▩    ▪    ▩▩▩ │   │ │
│ │   │ ▩ ▩          ▩ ▩ │   │ │
│ │   │ ▩▩▩▩▩ ▩▩ ▩▩▩ │   │ │
│ │   │      （二维码）     │   │ │
│ │   └──────────────────┘   │ │
│ │  扫一扫上面的二维码名片，  │ │
│ │  加我为好友               │ │
│ └──────────────────────────┘ │
│   [扫一扫]       [保存图片]  │
└──────────────────────────────┘
```

### 行为

- 入口：「我的」页顶栏二维码小图标（参考微信「我的」页二维码入口）；「添加好友」弹层的「二维码名片 · 查看」同样跳转本页
- 名片内容：头像 / 昵称 / 认证标识 / Taso ID / 城市 + 个性化二维码
- 扫一扫：打开相机解析对方名片二维码 → 进入对方名片确认页 → 发送好友申请（复用 §73.9 加好友时序）；原型为演示态
- 保存图片：将名片保存到相册便于分享（原型为演示态）
- 隐私：二维码为用户 ID 的可撤销令牌，可在设置中重置，重置后旧码失效

## 73.9 关键交互 05：加好友

```mermaid
sequenceDiagram
    participant A as 用户 A
    participant App as Taso App
    participant SNS as Social Service
    participant B as 用户 B

    A->>App: 搜索 ID / 扫码 / 推荐 / 主页按钮
    App->>SNS: POST /friends/requests（附验证消息）
    SNS-->>B: 申请通知（通知中心 + 消息角标）
    alt B 接受
        B->>SNS: POST …/accept
        SNS-->>A: 成为好友通知
        SNS-->>A: 创建会话 + 问候消息
    else B 拒绝
        B->>SNS: POST …/reject
        SNS-->>A: 仅更新申请状态（不暴露拒绝者操作细节）
    else A 撤回
        A->>SNS: DELETE /friends/requests/{id}
    end
```

## 73.10 关键交互 06：消息收发

```mermaid
sequenceDiagram
    participant A as 发送方
    participant App as Taso App
    participant IM as IM Service
    participant B as 接收方

    A->>App: 输入并发送
    App->>IM: POST /conversations/{id}/messages
    IM-->>App: message_id（SENT）
    IM->>B: 长连接推送（在线） / 厂商推送（离线）
    B->>IM: POST /conversations/{id}/read
    IM-->>A: READ 回执（气泡状态更新）
```

## 73.11 消息类型与版本演进

V1：文本。

V1.5：

```text
图片
语音（60s）
帖子卡片转发（POST_SHARE）
商家卡片转发（MERCHANT_SHARE）
地点卡片转发
```

V2：

```text
群聊（≤ 200 人）
音视频通话
消息回复引用 / 表情回应
E2EE（评估中，需平衡多端与举报审核）
```

## 73.12 数据模型

模型字段已并入 §45（Friendship / Conversation / Message），要点：

- Friendship 以两个方向记录存储；删除好友需同时失效双向会话入口
- Conversation.unread 不落库，按成员维度投影；已读以 read_cursor 游标增量同步
- Message 不可变；撤回以 RECALLED 状态标记，不做物理删除
- 消息内容与索引分离，支持用户授权后的关键词检索

## 73.13 API

接口清单已并入 §61「Friends / IM」。

## 73.14 安全与风控

- **反骚扰**：申请频率限制；非好友首条消息含链接 / 二维码 / 外部联系方式 → 风险提示或延迟送达
- **举报 / 屏蔽 / 静音**：聊天页与好友页常驻入口；屏蔽后双向不可见、不可再申请
- **未成年保护**：未成年人默认关闭非好友私信；陌生人消息按 guardian 规则审核
- **数据合规**：私信属个人通信，按运营地区法规确定留存期限；支持用户导出与删除
- **审核边界**：平台仅在收到举报 / 风控命中时查看消息，平时不做人工巡查，并在隐私政策中明示

## 73.15 验收标准

- [ ] 可通过 ID 搜索 / 推荐发送好友申请
- [ ] 申请可接受 / 拒绝 / 撤回
- [ ] 仅好友之间可以发消息（非好友被拦截并提示）
- [ ] 会话列表按最近排序，未读角标准确（会话级 + 全局级）
- [ ] 消息发送 / 送达 / 已读状态可见
- [ ] 离开会话后新消息计入未读；进入会话未读清零
- [ ] 屏蔽 / 举报入口可用

## 73.16 原型实现记录（V0.2 · 2026-09-09）

按本节规格在 `demo-taso-vue` 原型工程中完成纯前端实现（无后端）：

| 项 | 内容 |
|---|---|
| 新增屏幕 | P601 好友（ScreenFriends · 好友/新请求/推荐三 Tab + 添加好友弹层）、P602 消息中心（ScreenMessages · 申请横幅 + 会话列表 + 未读角标 + 空态）、P603 聊天（ScreenChat · 气泡 / 日期分隔 / 已读状态 / 底部输入栏） |
| 涉及文件 | `data.ts`（成员与社交种子数据）、`store.ts`（social 状态与动作）、`style.css`（会话/气泡/角标组件类，全部走设计令牌）、`IconSprite.vue`（i-chat / i-users / i-user-plus / i-send）、`AddFriendSheet.vue`、三个新屏幕，以及首页/我的/通知中心入口改造 |
| 入口 | 首页顶栏消息图标（含未读角标）、「我的」页「好友 / 消息」入口、通知中心新增好友申请示例 |
| 状态与持久化 | 好友 / 申请 / 会话 / 消息为全局响应式状态，持久化至 localStorage（`taso-social`），与余额等演示数据同机制 |
| 交互实测 | 搜索/推荐发送申请 → 待通过 → 撤回；接受申请 → 成为好友 → 自动创建带问候消息的会话（未读 1）；发消息 → 气泡上屏 → 1–2 秒模拟回复 → 「已送达」变「已读」；离开会话收到回复 → 未读角标 + Toast；角标在首页图标与「我的」实时联动 |
| 演示态边界 | “对方回复”“已读回执”为本地定时模拟，无真实长连接 / 推送；会话 id 直接使用成员 id（单聊演示）；屏蔽 / 举报为 Toast 占位 |
| 追加（V1.2.1） | P604 我的二维码名片（ScreenMyQrcode）：「我的」顶栏二维码图标入口 + 添加好友弹层「查看」跳转；扫一扫 / 保存为 Toast 演示；二维码为按 Taso ID 确定性生成的样式图形（演示态，非可扫描编码，见 §73.8） |

---

# 74. Source / References

1. X Help — “About Post translation.” https://help.x.com/en/using-x/translate-posts
2. X Help — “How to change language settings.” https://help.x.com/en/managing-your-account/how-to-change-language-settings
3. Meta / Threads — “Introducing Threads: A New Way to Share With Text.” https://about.fb.com/news/2023/07/introducing-threads-new-app-text-sharing/
4. Reddit — “How Reddit works / About Reddit.” https://about.reddit.com/
5. Tripadvisor — “Write a review.” https://www.tripadvisor.com/UserReview
6. Visa — “Visa Co-Branded Cards.” https://usa.visa.com/products/cobranded-cards.html
7. Visa — “Visa Partner Types” and Visa Rules / Co-Brand Program requirements. https://partner.visa.com/site/partner-types.html ; Visa Core Rules and Visa Product and Service Rules, Apr 2026. https://rs.visa.com/dam/VCOM/download/about-visa/visa-rules-public.pdf
8. Hong Kong Government / e-Legislation — Pyramid Schemes Prohibition Ordinance (Cap. 617). https://www.elegislation.gov.hk/legoutput?DOC_TYPE=D&FILENAME=%40TOC.pdf&LANGUAGE=ET&LEG_OUTPUT_ID=1260713&PUBLISHED=true ; Hong Kong Government explanation: https://www.info.gov.hk/gia/general/201112/23/P201112230217.htm
9. HKMA — “Digital assets and stablecoins”, Feb 2026. https://www.hkma.gov.hk/media/eng/doc/about-the-hkma/legislative-council-issues/20260202e1.pdf
10. HKMA — “Explanatory Note on Licensing of Stablecoin Issuers.” https://www.hkma.gov.hk/media/eng/doc/key-functions/ifc/stablecoin-issuers/Explanatory_Notes_on_Licensing_of_Stablecoin_Issuers_eng.pdf
11. SFC — “Circular on provision of Relevant Stablecoin service by virtual asset trading platforms and licensed corporations”, 27 May 2026. https://apps.sfc.hk/edistributionWeb/api/circular/list-content/circular/doc?lang=TC&refNo=26EC26
12. HKMA — “Explanatory Note on Licensing for Stored Value Facilities.” https://www.hkma.gov.hk/media/eng/doc/key-functions/financial-infrastructure/infrastructure/retail-payment-initiatives/Explanatory_note_on_licensing_for_SVF.pdf
13. HKMA — “International Financial Centre / Stored Value Facilities” Annual Report 2025. https://www.hkma.gov.hk/media/eng/publication-and-research/annual-report/2025/16_International_Financial_Centre.pdf

---

# 75. 注册与登录 · 原型实现记录（V1.3 · 2026-09-10）

> 设计规格来源：《TASO 注册与登录 PRD v1.0》（`docs/Taso_注册登录_PRD_v1.0.md`）。
>
> 核心模型：**一个 TASO User + 多个可绑定的 Authentication Identity + 独立的国家/语言/时区属性**；注册与登录统一为「继续使用 TASO」，不在首屏区分新老用户。

## 75.1 页面清单与映射

| AUTH 页面 | 原型组件 | 说明 |
|---|---|---|
| AUTH-001 启动页 | ScreenSplash（复用 P001） | 启动时按登录态分流（见 75.2） |
| AUTH-002 注册登录首页 | ScreenLogin（V1.3 重构） | 品牌区置顶、认证按钮沉底的西式布局；Apple（黑底）/Google/X（白底描边）品牌按钮 + 「或」分隔 + 邮箱/手机号文字入口 + 条款链接 + 底部语言胶囊 |
| AUTH-003/005 输入页 | ScreenAuthEntry | Email/Phone 分段切换；邮箱格式校验；区号预选（+852/+81/+82/+65/+66/+1/+44）；手机号按 E.164 组装 |
| AUTH-004/006 OTP | ScreenAuthOtp | 6 位独立输入框（自动跳格、退格回跳、整段粘贴）；60s 重发倒计时；错误抖动 + 剩余次数提示；连错 3 次 → AUTH-010 |
| AUTH-007 授权中 | ScreenAuthOauth | Google/Apple/X 品牌化模拟授权页：应用卡 + 账号行 + 权限清单 + Cancel/Continue（含 Loading 与「Signing in…」态）；Apple 演示账号使用 privaterelay 隐藏邮箱（PRD §7.2） |
| AUTH-008 新用户昵称 | ScreenAuthNickname | 2–30 Unicode 字符校验（空值/过短/过长/控制字符与零宽字符）；显示认证来源徽标；完成后自动创建账号 |
| AUTH-009 兴趣选择 | ScreenInterests（复用 P004） | 补充「跳过」按钮（AUTH PRD §12.4） |
| AUTH-010 登录异常 | ScreenAuthError | 「Sign-in didn't complete」统一错误页 + Try again + Can't sign in? 帮助（不泄露账号注册状态） |
| AUTH-012 账号与安全 | ScreenAccount | 入口：设置 → 账号与安全；展示 TASO ID/国家/界面语言/时区/注册时间 + 登录方式/设备会话/删除账号 |
| AUTH-013/015 登录方式 | ScreenAuthMethods | 五种方式绑定态列表；点击未绑定项模拟校验后即时绑定；解绑需确认；**最后一个身份解绑被拦截**（PRD §14.1） |
| AUTH-014 设备会话 | ScreenAuthSessions | 当前设备 + 其他设备列表；「退出其他设备」二次确认后撤销 |
| AUTH-016/017 删除账号 | ScreenAuthDelete + 确认对话框 | 删除范围/恢复窗口（14 天）提示 → 二次确认 → 清空全部本地数据回到首启（演示态即时执行） |

未实现：AUTH-011 账号被锁定（P1，依赖真实风控信号，原型以 AUTH-010 表达异常出口）。

## 75.2 登录态模型与启动分流

```text
localStorage: taso-auth = {
  id, nickname, countryCode, language, timezone, createdAt,
  session,            // 登出 = false（账号与绑定保留，PRD §15）
  identities: [ { provider, key, label, boundAt } ]
}
```

启动分流（bootstrap）：

```text
session = true   → 恢复上次屏幕（引导/中转屏不可恢复，回退 home）
session = false 且访问过 → splash → 直接登录页（回访用户不再看欢迎页）
从未访问过        → splash → 欢迎页（P002 语言/地区，可跳过）→ 登录页
```

注册/登录统一流程：

```text
登录页 → [ OAuth 授权页 | 邮箱/手机输入 → OTP ]
      → 身份归并（provider + key 查 identities）
      → 已存在 → 登录（欢迎回来）→ 首页
      → 不存在 → 昵称（创建 User，自动检测 navigator.language / Intl 时区）
      → 兴趣（可跳过）→ 首页
```

## 75.3 关键交互规则（演示数据）

| 规则 | 实现 |
|---|---|
| OTP 演示码 | 固定 `123456`（发送时以 Toast 提示）；错误提示剩余次数，连错 3 次进入 AUTH-010 |
| 第三方固定身份 | google=`g-1029384756`、apple=`a-88231104`、x=`x-40211398`；同 provider 二次登录即命中身份 →「欢迎回来」 |
| 解绑保护 | 仅剩一个身份时解绑 →「暂时无法解绑」对话框引导先绑定新方式 |
| 登出语义 | 撤销 session，账号/身份/社交/余额数据保留 |
| 删除账号 | 清空 taso-auth / taso-visited / taso-screen / taso-social / taso-bal / taso-wd，回到首启 |
| 屏幕栈清理 | 授权/OTP 等中转屏在流程终结时出栈，返回键不会落回过期状态 |

## 75.4 与既有原型的融合点

- 欢迎页（P002）「开始探索/跳过」→ 登录页；登录页成为引导链路唯一入口（原 ScreenLogin 为孤立页面，本次接入主流程）
- 兴趣页（P004）补「跳过」，按钮改为「跳过 / 完成」双操作
- 设置页新增「账号与安全」入口；「退出登录」由 Toast 占位改为真实登出（确认对话框 → 登录页）
- 「我的」页昵称/头像字母与登录账号联动（未登录回退演示身份 Alex）
- `store.ts` 新增 auth 状态域与 `oauthBegin/finishOauth/sendOtp/verifyOtp/otpLocked/completeSignup/bindProvider/unbindProvider/logout/deleteAccount` 动作；`IconSprite` 新增 Apple/Google/X 品牌 logo 与 mail/smartphone/monitor/trash/alert/help 图标；`style.css` 新增 `.oauth-btn/.otp-box/.spin/.consent-*` 组件类（全部走设计令牌，Apple 黑底按钮使用 `--fg/--surface` 令牌）

## 75.5 演示态边界

- OAuth 授权页为本地模拟，不发起任何真实第三方请求；OTP 无真实下发
- `taso-auth` 仅保存单个账号：新身份注册会替换本地已有账号（真实系统为多账号库）
- 「绑定新方式」为即时成功演示（真实流程需完成对应 provider 校验）
- AUTH-011 锁定、账号合并（PRD §13.2/§13.3）、Magic Link、Passkey 未实现

## 75.6 验证记录（2026-09-10）

- `npm run build`（vue-tsc 类型检查 + vite 构建）通过
- 浏览器实测通过：首启链路（splash→welcome→login）；Google 授权→新用户昵称（空值/单字符/合法三态校验）→兴趣跳过→首页；「我的」昵称联动；绑定 Apple/邮箱→解绑 Google→最后身份解绑拦截→换绑；设备会话退出其他设备；登出→刷新直达登录页；Google 回访（身份已解绑→正确走新用户路径）；邮箱 OTP 非法格式拦截、错码 ×3→异常页→Try again；正确码→「欢迎回来，Zack」（email 身份命中）；删除账号→全量重置回首启
- 关键页面截图核验：登录首页（三品牌按钮）、Google 授权页、OTP 页、账号与安全页视觉均符合设计令牌

---

## 附：本 PRD 的实施优先级摘要

```text
P0 = 必须上线
P1 = V1.1 / V1.5
P2 = 中长期

P0 Social
├── Feed
├── Posting
├── Comment
├── Follow
├── Friends（V1.2）
├── Messaging（V1.2）
├── Search
├── Merchant
├── Translation
└── Safety

P0 Membership
├── Card
├── Merchant Offers
├── Wallet
├── Transaction
└── Topup（在支付合作方准备好后）

P1 Consumer Benefit
├── Receipt Upload
├── OCR
├── Review
├── Settlement Ledger
└── Withdrawal

P1 Creator
├── Creator Center
├── Analytics
└── Reward

P2 Growth
├── Referral Engine
├── Merchant Ads
└── Campaigns

P2 Digital Assets
├── USDT
├── USDC
├── Chain Selection
├── Screening
└── Crypto Withdrawal
```

**建议的产品核心 KPI：**

```text
内容侧：
DAU / WAU
Feed 深度
内容发布率
D7 留存
关注率
商家点击率
收藏率
翻译使用率

关系侧（V1.2）：
好友申请发送率
好友申请通过率
人均好友数
有私信行为用户占比
人均消息数
私信用户次日回访率

消费侧：
有效会员数
会员卡激活率
月活会员消费人数
会员商家覆盖数
会员优惠使用率
人均消费

内容商业侧：
Verified Purchase 内容占比
商家带来的内容量
Creator 活跃率
Creator 收益覆盖率

风控侧：
凭证通过率
重复凭证率
异常交易率
提现拒绝率
人工审核率
资金对账差异率
```
