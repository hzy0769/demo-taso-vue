# TASO 注册与登录产品需求文档（PRD）

**文档版本：** v1.0  
**产品：** TASO 特搜  
**模块：** 注册、登录、账号绑定、账号安全、首次 Onboarding、国际化基础能力  
**目标平台：** iOS / Android / Web  
**适用范围：** 全球用户  
**文档状态：** 可进入产品、设计、研发评审  

---

## 1. 文档概述

### 1.1 背景

TASO 是面向全球用户的美食、旅游与社交平台。用户可能来自不同国家/地区，使用不同系统语言，并通过 Apple、Google、X、邮箱或手机号等不同方式进入 TASO。

因此，注册登录不能被设计成单一的“国家 -> 语言 -> 登录”流程，而应该将以下概念解耦：

- 用户账号（TASO User Account）
- 登录身份（Authentication Identity）
- 国家/地区（Country / Region）
- APP 界面语言（App Language）
- 内容语言偏好（Content Languages）
- 时区（Timezone）
- 当前定位（Current Location）
- 用户公开所在地（Profile Location）

### 1.2 产品目标

1. 降低首次注册门槛，优先支持一键式第三方登录。
2. 一个 TASO 用户可绑定多个登录身份，避免重复账号。
3. APP 初始语言自动适配设备语言，但允许用户独立修改。
4. 国家/地区与界面语言彻底解耦。
5. 支持全球化账号生命周期：注册、登录、绑定、解绑、恢复、注销、删除。
6. 为推荐、本地化、合规、风控提供统一账号基础数据。
7. iOS、Android、Web 使用统一的 TASO User ID。

### 1.3 非目标

本期不定义完整的社区内容审核、支付、会员订阅、支付账户、商家结算等业务；但会预留与登录体系的接口和字段。

---

## 2. 核心产品原则

### 2.1 注册与登录统一为“继续使用 TASO”

首页不强迫用户先判断自己是“注册”还是“登录”。用户点击任一认证方式后，系统自动判断该身份是否已经关联 TASO 账号：

```text
用户点击登录方式
      |
      v
认证提供方完成身份验证
      |
      v
TASO 查询 provider + provider_user_id
      |
   +--+--+
   |     |
 已存在  不存在
   |     |
   v     v
 登录    新建 TASO 账号
         |
         v
      Onboarding
```

### 2.2 一个用户，多种登录方式

推荐模型：

```text
TASO User
   |
   +-- Google Identity
   +-- Apple Identity
   +-- X Identity
   +-- Email Identity
   +-- Phone Identity
```

不能将“Google 账号 = TASO 用户”作为系统模型。

### 2.3 国家与语言解耦

示例：

```text
country_code = JP
language     = zh-CN
timezone     = Asia/Tokyo
```

含义：用户的国家/地区为日本，但 APP 界面语言可以是简体中文。

### 2.4 自动识别 + 用户可修改

系统可以根据设备语言、地区设置、IP 地理信息等推断初始配置，但不应把自动推断当成不可变事实。

### 2.5 登录优先，资料后置

不要在第三方登录后连续要求用户填写大量资料。完成身份认证后应尽快进入 APP；仅收集后续业务真正需要的信息，例如昵称。

---

## 3. 用户与身份数据模型

### 3.1 TASO User

用户业务实体，用于承载社交关系、内容、收藏、消费记录等。

| 字段 | 类型 | 说明 | 示例 |
|---|---|---|---|
| user_id | bigint/string | TASO 内部唯一用户 ID | 10000001 |
| username | string | 唯一账号标识，可选 | zack |
| nickname | string | 展示名称 | Zack |
| avatar_url | string | 头像地址 | https://... |
| country_code | string | 国家/地区 ISO 代码 | JP |
| language | string | APP 界面语言 | zh-CN |
| content_languages | array | 内容语言偏好 | [zh-CN, ja, en] |
| timezone | string | IANA 时区 | Asia/Tokyo |
| profile_location | string | 用户主动填写的公开所在地 | Tokyo |
| status | enum | normal / locked / disabled / deleted | normal |
| onboarding_status | enum | pending / completed | completed |
| created_at | datetime | 创建时间 | - |
| updated_at | datetime | 更新时间 | - |

### 3.2 Authentication Identity

身份认证实体，不直接作为业务用户。

| 字段 | 类型 | 说明 |
|---|---|---|
| id | bigint/string | 身份记录 ID |
| user_id | bigint/string | TASO 用户 ID |
| provider | enum | apple / google / x / email / phone |
| provider_user_id | string | 第三方平台稳定用户标识 |
| email | string | 提供方返回的邮箱，可为空 |
| phone | string | 手机号，可为空 |
| credential_status | enum | active / revoked |
| last_login_at | datetime | 最近登录时间 |
| created_at | datetime | 绑定时间 |
| updated_at | datetime | 更新时间 |

建议唯一约束：

```text
UNIQUE(provider, provider_user_id)
```

邮箱或手机号不能替代第三方 provider_user_id 成为 Apple / Google / X 的唯一主键。

---

## 4. 支持的认证方式

### 4.1 MVP

| 方式 | 是否支持 | 建议优先级 | 主要价值 |
|---|---:|---:|---|
| Apple | 是 | P0 | iOS 核心登录、隐私体验 |
| Google | 是 | P0 | 全球覆盖、跨端 |
| X | 是 | P1 | 社交用户、品牌调性 |
| Email | 是 | P0 | 通用兜底、Web 端重要 |
| Phone | 可选 | P1 | 部分市场本地化登录 |

### 4.2 后续地区化登录

根据目标市场再增加 LINE、Kakao、微信等，不在 MVP 登录首页一次性铺开全部按钮。

### 4.3 第三方集成原则

所有第三方登录最终都应回到 TASO 自己的认证中台，由 TASO 生成自己的 session / access token；客户端不应把第三方 access token 直接当作 TASO 会话凭证。

Google 官方当前建议在 Android 使用 Credential Manager，支持包括 Sign-in with Google 在内的联合身份认证能力；Web 端 Google Sign-In 返回的 ID token 需要在服务端校验。参考资料见文末。 

X 登录需预留 OAuth 2.0 授权码 + PKCE 的实现路径，并将 callback / redirect URI 白名单化。

---

## 5. 注册 / 登录首页

### 5.1 页面目标

- 让用户快速进入 TASO
- 强调全球可用的认证方式
- 不强制用户选择国家
- 不强制先判断“登录还是注册”
- 保留邮箱/手机号兜底
- 明确服务条款和隐私政策

### 5.2 页面结构

```text
┌──────────────────────────────────┐
│                                  │
│              TASO                │
│      Discover · Share · Travel   │
│                                  │
│  ┌────────────────────────────┐  │
│  │ Apple  使用 Apple 登录          │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │ G  使用 Google 登录         │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │ X  使用 X 登录              │  │
│  └────────────────────────────┘  │
│                                  │
│            ── 或 ──             │
│                                  │
│      使用邮箱 / 手机号继续       │
│                                  │
│                                  │
│  继续即表示同意《服务条款》       │
│  与《隐私政策》                   │
└──────────────────────────────────┘
```

### 5.3 页面元素

| 元素 | 类型 | 规则 |
|---|---|---|
| Logo | 品牌 | 统一品牌视觉 |
| Apple | 主按钮 | iOS 必须；Web/Android 可支持 |
| Google | 主按钮 | iOS/Android/Web |
| X | 次主按钮 | 社交属性强 |
| Email/Phone | 文本入口 | 兜底方式 |
| 服务条款 | 链接 | 打开对应语言版本 |
| 隐私政策 | 链接 | 打开对应语言版本 |
| 当前语言 | 可选 | 首页底部或设置入口 |

### 5.4 是否展示“注册”按钮

不建议在首屏再增加一个“注册”按钮。第三方认证后由系统自动判断新老用户。

Email/Phone 场景也可以使用统一的“继续”流程：

```text
输入邮箱/手机号
      |
      v
查询是否存在身份
   +--+--+
   |     |
 已存在  不存在
   |     |
 登录    验证后注册
```

---

## 6. 首次启动与语言 / 国家初始化

### 6.1 初始化原则

无需在注册前弹出“请选择国家”。系统后台执行初始化即可。

推荐初始信息：

```text
device_language   = 系统语言
locale             = 系统 Locale
country_candidate  = 地区 / IP 等信号
timezone           = 设备时区
```

### 6.2 APP 语言决策规则

```text
1. 已登录用户的 language
2. 未登录用户本地持久化 language
3. 系统语言
4. 默认语言 en
```

### 6.3 系统语言不支持时

例如设备语言为 `pl-PL`，而 TASO 暂未支持波兰语：

```text
pl-PL
  ↓
无对应语言包
  ↓
尝试语言父级 pl
  ↓
仍不支持
  ↓
fallback = en
```

### 6.4 国家决策

建议保存两个概念：

```text
detected_country_code
user_country_code
```

其中 detected_country 只是检测结果；user_country 是用户确认/修改后的业务字段。

### 6.5 不建议通过 GPS 完成登录国家判断

注册登录阶段没有必要请求精确定位权限。登录流程应尽量减少权限弹窗。精确定位属于后续“附近商家/附近内容/旅行服务”的独立权限流程。

---

## 7. Apple 登录流程

### 7.1 用户流程

```text
登录页
  ↓
使用 Apple 登录
  ↓
Apple 授权页面
  ↓
用户选择是否共享邮箱
  ↓
授权成功
  ↓
TASO 后端验证 Apple 返回的身份信息
  ↓
查询 apple + provider_user_id
  ↓
已绑定 → 登录
未绑定 → 创建/绑定流程
```

### 7.2 隐藏邮箱

用户可以选择隐藏真实邮箱，Apple 可能提供 relay email。系统必须将 Apple 返回的稳定身份标识作为身份匹配依据，而不是依赖邮箱字符串。

### 7.3 iOS 合规要求

若 iOS App 使用 Google Sign-In、Log in with X 等第三方社交登录来认证主账号，应同时提供符合 Apple 等效要求的登录选项。MVP 因此必须包含 Sign in with Apple。

### 7.4 Apple 登录成功后的下一步

新用户只进入最短 Onboarding：

```text
账号已创建
  ↓
设置昵称
  ↓
可选选择兴趣
  ↓
进入首页
```

---

## 8. Google 登录流程

### 8.1 用户流程

```text
登录页
  ↓
使用 Google 登录
  ↓
Google Account Picker / OAuth
  ↓
授权
  ↓
返回 credential / authorization response
  ↓
TASO 服务端验证 token
  ↓
查 google + provider_user_id
  ↓
登录或新建账号
```

### 8.2 Android 技术方向

采用 Google Credential Manager + Sign in with Google；不要新项目基于已过时的旧 Google Sign-In API 继续扩展。

### 8.3 Web 技术方向

使用 Google Identity Services，服务端验证 ID token，并使用 Google `sub` 作为稳定唯一身份标识。

### 8.4 WebView 注意事项

Google 官方不建议在 Android/iOS WebView 中直接使用 Google 登录；移动端应该使用系统安全浏览器 / Custom Tabs / SFSafariViewController 等适当方式。

---

## 9. X 登录流程

### 9.1 用户流程

```text
登录页
  ↓
使用 X 登录
  ↓
X OAuth 授权页
  ↓
用户授权
  ↓
callback
  ↓
TASO 服务端交换 authorization code
  ↓
验证用户身份
  ↓
查 X provider_user_id
  ↓
登录或新建账号
```

### 9.2 安全要求

- callback URI 必须白名单化
- 使用 state 防止 CSRF
- 移动端建议采用 PKCE
- 不在客户端保存 X client secret
- TASO 服务端自行创建 TASO session

---

## 10. 邮箱登录

### 10.1 推荐采用无密码 Magic Link + Email OTP

MVP 推荐：

```text
输入邮箱
  ↓
发送 6 位验证码
  ↓
输入验证码
  ↓
登录或注册
```

可同时提供 Magic Link，但不建议第一版必须实现两套复杂流程。

### 10.2 邮箱注册

```text
邮箱
 ↓
OTP 验证
 ↓
检查 email identity
 ↓
存在 → 登录
不存在 → 创建用户
 ↓
设置昵称
 ↓
完成
```

### 10.3 邮箱格式与风控

- 不区分大小写进行 canonicalization
- OTP 单次使用
- 5-10 分钟过期
- 失败次数限制
- 同一 IP / device / email 限流

---

## 11. 手机号登录（可选 P1）

### 11.1 流程

```text
选择国家区号
  ↓
输入手机号
  ↓
发送 OTP
  ↓
输入验证码
  ↓
登录 / 注册
```

国家区号应根据 locale / country 候选自动预选，但允许用户修改。

### 11.2 国际手机号存储

统一采用 E.164 规范，例如：

```text
+819012345678
+14155550123
```

---

## 12. 新用户 Onboarding

### 12.1 原则

目标是让用户尽快进入首页，而不是一次性完成完整资料。

### 12.2 MVP 流程

```text
第三方/邮箱/手机号认证
        ↓
创建 TASO User
        ↓
设置昵称
        ↓
可选：头像
        ↓
可选：兴趣
        ↓
进入首页
```

### 12.3 昵称页

页面：

```text
欢迎来到 TASO

给自己取一个名字

[ Zack_______________ ]

昵称可以随时修改

[      开始探索      ]
```

规则建议：

- 2-30 个 Unicode 字符
- 支持中文、英文、日文、韩文等
- 过滤控制字符、不可见字符
- 禁止冒充系统账号的保留词
- 支持敏感词检查

### 12.4 兴趣选择

兴趣用于推荐冷启动，但必须允许跳过。

示例：

```text
你喜欢什么？

☑ 美食
☑ 旅行
☑ 咖啡
☑ 夜生活
☐ 户外
☐ 摄影
☐ 艺术

[跳过]     [完成]
```

---

## 13. 账号已有 / 新账号 / 账号合并

### 13.1 场景 A：身份已存在

```text
Google Identity
      ↓
provider_user_id 命中
      ↓
User 10001
      ↓
登录
```

### 13.2 场景 B：身份不存在，但邮箱命中已有账号

禁止直接创建第二账号。

推荐流程：

```text
新 Google Identity
       ↓
发现其 email 与已有 TASO 账号匹配
       ↓
提示：发现已有 TASO 账号
       ↓
要求用户通过已有认证方式重新验证
       ↓
验证成功
       ↓
将 Google Identity 绑定到已有 User
```

### 13.3 不应做的设计

不能仅凭“邮箱字符串相同”就在后台静默合并两个账号；应进行额外身份确认，降低账号接管风险。

### 13.4 绑定入口

```text
我的
 ↓
设置
 ↓
账号与安全
 ↓
登录方式
```

展示：

```text
Google       已绑定
Apple        已绑定
X            未绑定
邮箱         未绑定
手机号       已绑定
```

---

## 14. 解绑登录方式

### 14.1 核心规则

不允许用户把“最后一个有效登录方式”直接解绑，除非同时完成新的登录方式绑定。

例如：

```text
只有 Google
  ↓
解绑 Google
  ↓
禁止
  ↓
提示：请先绑定 Apple / X / 邮箱 / 手机号
```

### 14.2 高风险操作二次验证

解绑、修改关键账号信息、关闭安全能力等操作应要求二次认证。

---

## 15. 会话与 Token 体系

### 15.1 统一会话模型

第三方认证成功后：

```text
Apple/Google/X/Email
         ↓
      Auth Service
         ↓
      TASO User ID
         ↓
 Access Token + Refresh Token
```

### 15.2 Token 原则

- Access Token 短时效
- Refresh Token 长时效、可撤销
- 支持设备维度 session
- 服务端保存 refresh token 的哈希/安全存储信息
- 注销账号时撤销全部 session

### 15.3 多设备会话

账号中心增加：

```text
登录设备

iPhone 17 Pro      当前设备
MacBook Pro        2 分钟前
Chrome / Windows   昨天

[退出其他设备]
```

---

## 16. 忘记账号 / 登录异常

### 16.1 用户不知道用哪个方式登录

登录页提供：

```text
无法登录？
```

进入：

```text
输入曾使用的邮箱
或手机号
 ↓
系统提示可能存在的登录方式
```

注意：不要通过错误提示泄露“该邮箱是否注册过”这一敏感信息。

### 16.2 OTP 错误

提示策略：

- 验证码错误：重新输入
- 过期：重新发送
- 尝试次数超限：暂时锁定验证
- 发送太频繁：显示剩余等待时间

### 16.3 第三方授权失败

统一错误页：

```text
登录没有完成

可能是授权被取消或网络异常。

[重新登录]
```

不要把第三方内部错误码直接暴露给用户。

---

## 17. 账号安全与风控

### 17.1 登录风控信号

建议采集：

```text
user_id
provider
ip
country
device_id / app_instance_id
os
app_version
user_agent
login_time
risk_score
```

### 17.2 风控策略

高风险场景可要求二次验证：

- 新设备首次登录
- 短时间跨国家异常登录
- 大量失败 OTP
- 疑似代理 / 机器人
- 登录后立即执行高风险账号操作

### 17.3 登录限流

至少按以下维度限流：

```text
IP
账号
邮箱
手机号
device/app instance
provider
```

---

## 18. 隐私与权限

### 18.1 最小化原则

登录阶段只请求完成认证所必要的信息。

不应因为登录而索取：

- 精确定位
- 联系人
- 相册
- 麦克风
- 通讯录

这些权限应该在实际功能使用时再按需申请。

### 18.2 邮箱公开规则

第三方提供的邮箱默认是账号认证属性，不等于公开资料。

### 18.3 账号删除

账号中心必须提供：

```text
设置
 → 账号与安全
   → 删除账号
```

需要：

- 风险提示
- 二次确认
- 验证身份
- 明确删除范围
- 删除 / 脱敏周期
- 支持恢复窗口（若产品定义恢复机制）

对于 iOS，若 App 支持创建账号，需要同步设计 App 内账号删除流程，以满足 Apple 当前 App Review 要求。

---

## 19. 页面清单

| 页面 ID | 页面名称 | 优先级 |
|---|---|---:|
| AUTH-001 | 启动页 / Splash | P0 |
| AUTH-002 | 注册登录首页 | P0 |
| AUTH-003 | Email 输入 | P0 |
| AUTH-004 | Email OTP | P0 |
| AUTH-005 | 手机号输入 | P1 |
| AUTH-006 | 手机 OTP | P1 |
| AUTH-007 | 第三方授权中 | P0 |
| AUTH-008 | 新用户昵称 | P0 |
| AUTH-009 | 兴趣选择 | P1 |
| AUTH-010 | 登录异常 | P0 |
| AUTH-011 | 账号被锁定 | P1 |
| AUTH-012 | 账号与安全 | P0 |
| AUTH-013 | 登录方式管理 | P0 |
| AUTH-014 | 设备会话管理 | P1 |
| AUTH-015 | 绑定新登录方式 | P1 |
| AUTH-016 | 删除账号 | P0 |
| AUTH-017 | 账号删除确认 | P0 |

---

## 20. 页面交互详细要求

### AUTH-002 注册登录首页

**进入条件：** 未登录或当前 session 失效。  
**退出条件：** 任一认证方式成功并建立 TASO session。

**交互：**

1. 点击 Apple：打开 Apple 授权流程。
2. 点击 Google：打开 Google 授权流程。
3. 点击 X：打开 X OAuth 流程。
4. 点击邮箱/手机号：进入对应输入页。
5. 点击服务条款：打开浏览器内页。
6. 点击隐私政策：打开对应语言版本。

**Loading：** 按钮点击后立即进入 loading 状态，防止重复提交。

### AUTH-008 新用户昵称

**输入校验：** 实时校验 + 提交时再次校验。

**错误：**

- 为空：请输入昵称
- 过短/过长：昵称长度不符合要求
- 包含不允许字符：昵称包含不支持的字符
- 已占用（如后续采用 username）：换一个名字

### AUTH-012 账号与安全

必须显示：

```text
登录方式
账号信息
设备会话
删除账号
```

---

## 21. 国际化设计规范

### 21.1 Locale

建议使用 BCP 47：

```text
zh-CN
zh-TW
en-US
en-GB
ja-JP
ko-KR
fr-FR
```

数据库中可只保存业务语言偏好 `zh-CN`、`en`、`ja` 等，具体区域展示由客户端 locale 组合。

### 21.2 文案不要写死

客户端：

```text
auth.login.google
profile.settings.language
account.delete.confirm
```

服务端也不应该返回只有中文的错误文案。建议返回结构化错误码：

```json
{
  "code": "AUTH_OTP_EXPIRED",
  "message_key": "auth.otp.expired"
}
```

客户端根据当前 language 渲染文案。

### 21.3 数字 / 日期 / 时区

账号服务不负责“业务展示格式化”时，接口返回标准时间，例如 ISO 8601 / UTC；客户端或业务服务按用户 timezone 展示。

---

## 22. 后端服务架构建议

```text
                  +----------------+
                  | iOS / Android  |
                  |      Web       |
                  +--------+-------+
                           |
                           v
                    +------+------+
                    |  API Gateway |
                    +------+------+
                           |
                    +------+-------+
                    | Auth Service |
                    +------+-------+
                       /    |    \
                      /     |     \
                     v      v      v
                 Apple   Google     X
                      \
                       \
                        +--> Email / Phone OTP
                           |
                           v
                    +------+------+
                    | User Service |
                    +------+------+
                           |
                           v
                    +------+------+
                    |   Database   |
                    +-------------+
```

建议 Auth Service 与 User Service 在逻辑上解耦，即使第一阶段代码上可以共仓或同服务部署。

---

## 23. API 设计建议

### 23.1 获取登录配置

`GET /v1/auth/config`

返回：

```json
{
  "providers": ["apple", "google", "x", "email"],
  "default_language": "en",
  "supported_languages": ["zh-CN", "en", "ja", "ko"]
}
```

### 23.2 第三方登录开始

`POST /v1/auth/oauth/{provider}/start`

服务端生成 state / PKCE 参数，并返回授权地址或 session context。

### 23.3 第三方登录回调

`POST /v1/auth/oauth/{provider}/callback`

服务端完成：

```text
code exchange
→ token verification
→ identity lookup
→ user create / bind
→ session issue
```

### 23.4 Email OTP

`POST /v1/auth/email/send-code`

`POST /v1/auth/email/verify-code`

### 23.5 绑定身份

`POST /v1/account/auth-identities/link`

### 23.6 解绑身份

`DELETE /v1/account/auth-identities/{id}`

### 23.7 当前会话

`GET /v1/account/sessions`

### 23.8 删除账号

`POST /v1/account/delete-request`

建议删除流程为异步任务，并由后台处理数据清理、内容归属、缓存清理和第三方 token 撤销。

---

## 24. 数据库表建议

### 24.1 `t_user`

```sql
id
username
nickname
avatar_url
country_code
language
content_languages_json
timezone
profile_location
status
onboarding_status
created_at
updated_at
```

### 24.2 `t_user_auth_identity`

```sql
id
user_id
provider
provider_user_id
email
phone
credential_status
last_login_at
created_at
updated_at
```

索引：

```sql
UNIQUE(provider, provider_user_id)
INDEX(user_id)
INDEX(email)
INDEX(phone)
```

### 24.3 `t_user_session`

```sql
id
user_id
device_id
platform
app_version
country_code
ip
refresh_token_hash
status
last_active_at
expires_at
created_at
```

### 24.4 `t_auth_event`

用于风控和审计：

```sql
event_id
user_id
provider
event_type
result
ip
country_code
device_id
risk_score
error_code
created_at
```

---

## 25. 登录状态机

```text
UNKNOWN
  |
  v
AUTHENTICATING
  |
  +----> AUTH_FAILED
  |
  v
IDENTITY_RESOLVED
  |
  +----> EXISTING_USER ----> SESSION_ISSUED
  |
  v
NEW_USER
  |
  v
ONBOARDING
  |
  v
ACTIVE
```

账号状态：

```text
NORMAL
  |
  +--> LOCKED
  |
  +--> DISABLED
  |
  +--> DELETION_PENDING
  |
  +--> DELETED
```

---

## 26. 异常场景矩阵

| 场景 | 用户提示 | 系统动作 |
|---|---|---|
| 用户取消 Apple 授权 | 登录未完成 | 回登录页 |
| Google token 无效 | 登录失败，请重试 | 记录风险事件 |
| X callback 失败 | 登录未完成 | 清理 OAuth session |
| OTP 过期 | 验证码已过期 | 允许重新发送 |
| OTP 错误超过阈值 | 尝试次数过多 | 临时锁定 |
| provider identity 已存在 | 直接登录 | 发放 TASO session |
| 邮箱命中已有账号 | 发现已有账号，请验证 | 进入账号绑定/恢复 |
| 最后一个身份解绑 | 暂不可解绑 | 引导先绑定新方式 |
| 账号已删除 | 账号不可用 | 进入恢复或重新注册策略 |
| 网络异常 | 网络异常，请重试 | 保留当前页面输入 |
| 服务端 5xx | 服务暂时不可用 | 上报监控 |

---

## 27. 埋点与指标

### 27.1 核心漏斗

```text
auth_page_view
   ↓
auth_provider_click
   ↓
auth_provider_success
   ↓
auth_identity_resolved
   ↓
user_created
   ↓
onboarding_completed
   ↓
first_content_view
```

### 27.2 核心指标

- 登录成功率
- 注册成功率
- 第三方授权取消率
- Provider 分布
- OTP 发送成功率
- OTP 验证成功率
- 新用户 Onboarding 完成率
- 注册到首次内容浏览转化率
- 账号绑定率
- 重复账号率
- 登录风控拦截率
- 删除账号完成率

### 27.3 Provider 对比

按国家/地区维度统计：

```text
JP: Apple 38%, Google 42%, X 8%, Email 12%
US: Apple 31%, Google 50%, X 9%, Email 10%
...
```

用于决定地区化登录方式的后续优先级。

---

## 28. UI / UX 规格建议

### 28.1 首屏原则

- 单页完成主要登录决策
- 认证按钮高度建议 48-52dp
- 按钮间距 10-12dp
- 页面主 CTA 不超过 3 个强主按钮
- 保持系统品牌按钮的识别规范
- 深浅色模式均可读

### 28.2 Loading

第三方授权跳转前：按钮进入 disabled + spinner。

回调处理中：

```text
正在完成登录...
```

不要让用户看到空白页。

### 28.3 Error

优先用户可执行动作：

```text
发生问题
[重新尝试]
```

其次才提供错误详情。

---

## 29. MVP 范围

### P0 必须

- 注册登录首页
- Apple 登录
- Google 登录
- Email OTP
- 自动创建账号
- 用户唯一 TASO User ID
- Auth Identity 表
- 新用户昵称
- 国家/语言初始化
- 账号与安全
- 登录方式查看
- 最基本的 session
- 登录风控与限流
- 账号删除
- 多语言基础框架

### P1

- X 登录
- 手机 OTP
- 设备会话管理
- 绑定/解绑
- 兴趣冷启动
- 账号合并流程
- Magic Link

### P2

- LINE / Kakao / 微信等地区化 provider
- Passkey
- 更强风险控制
- 登录设备风险画像

---

## 30. 验收标准

### 30.1 正常登录

- Apple 登录成功后能创建或进入正确 TASO User
- Google 登录成功后能创建或进入正确 TASO User
- X 登录成功后能创建或进入正确 TASO User
- Email OTP 可以完成新用户注册和老用户登录

### 30.2 多身份绑定

- 同一用户绑定 Apple、Google、X 后均进入同一 `user_id`
- 删除其中一个身份不会删除 TASO 用户
- 最后一个认证身份不能直接解绑

### 30.3 国际化

- 系统语言为中文时首次进入默认中文
- 系统语言为日文时首次进入默认日文
- 不支持的系统语言回退英文
- 国家 JP 不影响用户将 APP 语言设置为中文
- 用户修改 language 后下次启动仍保持该语言

### 30.4 安全

- OAuth state 可防止 CSRF
- 移动端 OAuth 采用 PKCE
- 第三方 token 不直接作为 TASO session
- Access Token 到期后可用 Refresh Token 刷新
- 删除账号后旧 session 不再有效
- OTP 超时和失败次数符合风控限制

---

## 31. 推荐首版产品流程总图

```text
                    TASO
                      |
                 首次打开 APP
                      |
              自动识别语言 / 地区
                      |
                      v
               [ 注册 / 登录首页 ]
                      |
          +-----------+-----------+
          |           |           |
        Apple       Google        X
          |           |           |
          +-----------+-----------+
                      |
                   OAuth
                      |
                      v
              [TASO Auth Service]
                      |
                查询 Identity
                 /           \
             已存在          不存在
                |               |
                v               v
              登录          创建 User
                                |
                            设置昵称
                                |
                          可选兴趣选择
                                |
                                v
                             首页

账号中心：
首页 -> 我的 -> 设置 -> 账号与安全
                    |
        +-----------+------------+
        |           |            |
      登录方式     设备会话     删除账号
        |
  Apple / Google / X / Email / Phone
```

---

## 32. 实施建议

### 32.1 技术优先级

第一阶段建议先完成：

```text
User
Auth Identity
Session
Apple
Google
Email OTP
Locale
Country
```

然后接入 X 和手机 OTP。

### 32.2 前后端职责

**客户端：**

- 展示登录入口
- 调用系统/第三方 SDK
- 获取授权结果
- 将授权结果安全提交至后端
- 保存 TASO session
- 根据 language 渲染 UI

**服务端：**

- OAuth 流程
- token 验证
- identity 解析
- User 创建
- Session 签发
- 风控
- 绑定/解绑
- 审计

### 32.3 不建议

- 不要把 email 当成所有 provider 的唯一主键
- 不要用国家决定界面语言
- 不要在注册阶段强制开启 GPS
- 不要要求用户第一次登录就填大量资料
- 不要让客户端自己决定 user_id
- 不要直接使用第三方 access token 作为 TASO session

---

## 33. 参考资料

1. Apple Developer - App Store Review Guidelines，登录服务与账号删除等要求。  
   https://developer.apple.com/app-store/review/guidelines/

2. Google for Developers - Sign in with Google / Google Identity Services。  
   https://developers.google.com/identity/

3. Google for Developers - Credential Manager 与 Sign in with Google。  
   https://developers.google.com/identity/sign-in/android/credential-manager-siwg  

4. Google for Developers - Sign in with Google JavaScript API Reference。  
   https://developers.google.com/identity/gsi/web/reference/js-reference

5. X Developer Platform - Authentication / OAuth 相关文档。  
   https://developer.x.com/en/docs/authentication

---

## 34. 产品结论

TASO 的账号体系应定义为：

> **一个 TASO User Account + 多个可绑定的 Authentication Identity + 独立的国家、语言、内容语言和时区属性。**

最终落地形态：

```text
国家 ≠ 语言 ≠ 登录方式 ≠ 用户账号

Apple / Google / X / Email / Phone
                |
                v
          TASO User ID
                |
       +--------+--------+
       |        |        |
     国家      语言     时区
       |
     推荐 / 本地化 / 合规
```

该模型可以直接向后扩展全球化推荐、商家本地化、内容多语言、跨设备登录及地区化第三方登录，不需要后期重构核心账号体系。
