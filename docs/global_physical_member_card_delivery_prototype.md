# 全球实体会员卡申请与配送功能——产品原型设计文档

> 文档用途：面向全球用户的实体会员卡申请、配送地址填写、配送方式选择及申请确认。
>
> 适用对象：产品经理、UI/UX 设计师、前端、后端、测试、运营。
>
> 核心原则：**全球化地址模型、国家/地区动态表单、清晰的费用与时效、异常状态可恢复。**

---

## 1. 产品目标

用户可以在 App 内完成实体会员卡申请，并填写可用于全球配送的地址信息，选择合适的配送方式，最终确认并提交申请。

### 核心体验目标

1. 用户能够快速选择国家/地区。
2. 地址字段随国家/地区动态变化，不强制套用“省/市/区”结构。
3. 支持国际姓名、地址、电话、邮编格式。
4. 明确展示配送范围、配送费用、预计送达时间。
5. 地址错误、地区不可配送、配送方式不可用等情况能够被清晰提示并修正。
6. 已保存地址可再次使用，减少重复填写。

---

# 2. 用户流程

```text
实体会员卡申请
      │
      ▼
┌───────────────────┐
│ 1. 选择实体会员卡 │
└─────────┬─────────┘
          ▼
┌───────────────────┐
│ 2. 填写配送地址   │
└─────────┬─────────┘
          ▼
┌───────────────────┐
│ 3. 选择配送方式   │
└─────────┬─────────┘
          ▼
┌───────────────────┐
│ 4. 确认申请       │
└─────────┬─────────┘
          ▼
┌───────────────────┐
│ 5. 提交申请/支付  │
└─────────┬─────────┘
          ▼
┌───────────────────┐
│ 6. 配送状态跟踪   │
└───────────────────┘
```

---

# 3. 页面结构总览

| 页面 | 页面名称 | 核心功能 |
|---|---|---|
| P01 | 实体会员卡申请 | 展示会员卡、权益、申请入口 |
| P02 | 配送地址 | 填写或选择配送地址 |
| P03 | 配送方式 | 选择 Standard / Express 等配送方式 |
| P04 | 确认申请 | 汇总卡片、地址、配送方式、费用 |
| P05 | 申请成功 | 展示申请结果和订单编号 |
| P06 | 配送追踪 | 查看配送状态和物流信息 |

---

# 4. P01 实体会员卡申请页

## 4.1 页面原型

```text
┌────────────────────────────────────┐
│ ←                                  │
│                                    │
│       Physical Member Card         │
│                                    │
│       ┌──────────────────────┐     │
│       │                      │     │
│       │      MEMBER CARD     │     │
│       │                      │     │
│       └──────────────────────┘     │
│                                    │
│       Physical Member Card         │
│       Delivered to your address    │
│                                    │
│       ✓ Global delivery            │
│       ✓ Secure delivery            │
│       ✓ Track your shipment        │
│                                    │
│                                    │
│       Shipping fee                 │
│       Calculated at checkout       │
│                                    │
│  ┌──────────────────────────────┐  │
│  │        Apply for Card        │  │
│  └──────────────────────────────┘  │
└────────────────────────────────────┘
```

## 4.2 交互

- 点击 `Apply for Card` 进入 P02。
- 若用户已有默认配送地址，可进入“选择/确认地址”状态。
- 若所在国家/地区不支持配送，应在申请入口或地址页面明确提示。

---

# 5. P02 配送地址页

## 5.1 推荐页面结构

```text
┌────────────────────────────────────┐
│ ←          Shipping Address        │
├────────────────────────────────────┤
│                                    │
│ Deliver to                          │
│                                    │
│ Country / Region                   │
│ ┌────────────────────────────────┐ │
│ │ 🇯🇵 Japan                    › │ │
│ └────────────────────────────────┘ │
│                                    │
│ Recipient                          │
│                                    │
│ First name                         │
│ ┌────────────────┐ ┌─────────────┐ │
│ │ Taro           │ │ Yamada      │ │
│ └────────────────┘ └─────────────┘ │
│                                    │
│ Address                            │
│                                    │
│ Postal code                        │
│ ┌────────────────────────────────┐ │
│ │ 150-0001                       │ │
│ └────────────────────────────────┘ │
│                                    │
│ State / Province                   │
│ ┌────────────────────────────────┐ │
│ │ Tokyo                        › │ │
│ └────────────────────────────────┘ │
│                                    │
│ City / District                    │
│ ┌────────────────────────────────┐ │
│ │ Shibuya-ku                     │ │
│ └────────────────────────────────┘ │
│                                    │
│ Street address                     │
│ ┌────────────────────────────────┐ │
│ │ 1-2-3 Shibuya                  │ │
│ └────────────────────────────────┘ │
│                                    │
│ Apartment / Suite (Optional)       │
│ ┌────────────────────────────────┐ │
│ │ Shibuya Building 101           │ │
│ └────────────────────────────────┘ │
│                                    │
│ Phone number                       │
│ ┌───────────┬────────────────────┐ │
│ │ 🇯🇵 +81   │ 90 1234 5678       │ │
│ └───────────┴────────────────────┘ │
│                                    │
│ ☐ Save as default address          │
│                                    │
│ ┌────────────────────────────────┐ │
│ │            Continue             │ │
│ └────────────────────────────────┘ │
└────────────────────────────────────┘
```

---

# 6. 地址国际化设计

## 6.1 不建议固定字段

不建议直接设计成：

```text
省 → 市 → 区 → 街道 → 门牌号
```

这种模式无法很好覆盖全球地址体系。

## 6.2 推荐统一地址模型

```text
countryCode
recipient.firstName
recipient.lastName
address.addressLine1
address.addressLine2
address.city
address.state
address.postalCode
phone.countryCode
phone.number
```

其中字段是否显示、字段名称、是否必填、校验规则，应由国家/地区配置决定。

---

# 7. 不同国家/地区的字段示例

## 7.1 美国 United States

```text
Country / Region
First name
Last name
Street address
Apartment / Suite / Unit (Optional)
City
State
ZIP code
Phone number
```

## 7.2 英国 United Kingdom

```text
Country / Region
First name
Last name
Address line 1
Address line 2 (Optional)
Town / City
County (Optional)
Postcode
Phone number
```

## 7.3 日本 Japan

推荐顺序：

```text
Country / Region
Postal code
Prefecture
City / Ward
Street address
Building / Apartment (Optional)
First name
Last name
Phone number
```

可支持输入邮编后自动补全地区信息。

## 7.4 中国 Mainland China

```text
Country / Region
收件人姓名
省 / Province
城市 / City
区县 / District
详细地址 / Street address
邮政编码 / Postal code
手机号码 / Phone number
```

---

# 8. 国家/地区选择器

## 8.1 原型

```text
┌────────────────────────────────────┐
│ ←          Country / Region        │
├────────────────────────────────────┤
│ 🔍 Search country or region         │
├────────────────────────────────────┤
│ Recommended                        │
│                                    │
│ 🇯🇵 Japan                           │
│ 🇺🇸 United States                   │
│ 🇨🇳 China                            │
│ 🇬🇧 United Kingdom                  │
│                                    │
│ All countries                      │
│                                    │
│ 🇦🇺 Australia                       │
│ 🇧🇷 Brazil                          │
│ 🇨🇦 Canada                          │
│ 🇫🇷 France                          │
│ 🇩🇪 Germany                         │
│ ...                                │
└────────────────────────────────────┘
```

## 8.2 交互要求

- 支持国家名称、英文名称、当地语言名称搜索。
- 存储标准 ISO 3166-1 alpha-2 国家代码。
- 国家切换后，地址字段立即切换到对应模板。
- 若新国家已有地址内容，应给出“切换国家将重新调整部分地址字段”的提示。

---

# 9. 手机号码设计

推荐将区号和号码拆开：

```text
┌────────────┬──────────────────────┐
│ 🇯🇵 +81    │ 90 1234 5678         │
└────────────┴──────────────────────┘
```

### 要求

- 区号根据国家/地区自动带入。
- 用户可以手动修改区号。
- 根据国家进行号码长度/格式校验。
- 后端建议保存标准化号码，例如 E.164 格式。

示例：

```text
+819012345678
+14155552671
+442079460123
```

---

# 10. P03 配送方式页

## 10.1 页面原型

```text
┌────────────────────────────────────┐
│ ←          Shipping Method         │
├────────────────────────────────────┤
│                                    │
│ Deliver to                         │
│                                    │
│ Taro Yamada                        │
│ 1-2-3 Shibuya                      │
│ Shibuya-ku, Tokyo                  │
│ 150-0001, Japan                    │
│                                    │
│                                  Edit│
│                                    │
├────────────────────────────────────┤
│ Shipping options                   │
│                                    │
│ ◉ Standard Shipping                │
│   Estimated delivery: 5–10 days    │
│   Free                             │
│                                    │
│ ○ Express Shipping                 │
│   Estimated delivery: 2–4 days     │
│   ¥1,500                           │
│                                    │
├────────────────────────────────────┤
│ Order summary                      │
│                                    │
│ Physical Member Card       ¥0      │
│ Shipping                   ¥1,500  │
│ ────────────────────────────────   │
│ Total                      ¥1,500  │
│                                    │
│ ┌────────────────────────────────┐ │
│ │            Continue             │ │
│ └────────────────────────────────┘ │
└────────────────────────────────────┘
```

## 10.2 配送方式字段

每一种配送方式建议返回：

```text
shippingMethodCode
name
carrier
price
currency
estimatedMinDays
estimatedMaxDays
trackingAvailable
available
unavailableReason
```

---

# 11. 配送时效设计

尽量使用日期范围，而不仅是“7天左右”。

推荐显示：

```text
Estimated delivery
Sep 18 – Sep 24
```

而不是只显示：

```text
7 days
```

原因：用户更容易理解具体送达日期。

如配送受周末、节假日影响，可标注：

```text
Business days only
```

---

# 12. P04 确认申请页

## 12.1 页面原型

```text
┌────────────────────────────────────┐
│ ←         Review Application       │
├────────────────────────────────────┤
│                                    │
│ Member card                        │
│ ┌────────────────────────────────┐ │
│ │ Physical Member Card           │ │
│ │ Standard Membership            │ │
│ └────────────────────────────────┘ │
│                                    │
│ Shipping address                   │
│                                    │
│ Taro Yamada                        │
│ 1-2-3 Shibuya                      │
│ Shibuya-ku, Tokyo                  │
│ 150-0001, Japan                    │
│                               Edit │
│                                    │
│ Shipping method                    │
│ Standard Shipping                  │
│ Estimated: Sep 18 – Sep 24         │
│                               Edit │
│                                    │
│ Fees                               │
│ Card                       ¥0       │
│ Shipping                   ¥0       │
│ ────────────────────────────────   │
│ Total                      ¥0       │
│                                    │
│ ☐ I confirm that the address is    │
│   correct.                         │
│                                    │
│ ┌────────────────────────────────┐ │
│ │        Submit Application       │ │
│ └────────────────────────────────┘ │
└────────────────────────────────────┘
```

---

# 13. 地址校验规则

## 13.1 通用校验

| 字段 | 校验 |
|---|---|
| 国家/地区 | 必填，必须为支持配送的国家/地区 |
| First name | 必填 |
| Last name | 必填 |
| Address line 1 | 必填 |
| City | 根据国家规则决定 |
| State/Province | 根据国家规则决定 |
| Postal code | 根据国家规则校验 |
| Phone | 必填，国家区号与号码格式校验 |
| Address line 2 | 可选 |

## 13.2 校验提示

不要只显示：

```text
Invalid input
```

推荐：

```text
Please enter a valid postal code.
```

或者：

```text
This postal code does not match the selected country.
```

---

# 14. 地址标准化与纠错

建议在用户点击 Continue 后增加地址检查：

```text
Checking address...
        ↓
Address verified
        ↓
Continue
```

如果系统发现疑似错误：

```text
We found a possible issue with your address.

Entered address:
1-23 Shibya

Suggested address:
1-2-3 Shibuya

○ Use suggested address
○ Keep entered address
```

最终仍应允许用户确认合法但未标准化的地址，具体取决于物流供应商规则。

---

# 15. 不可配送场景

## 15.1 国家不支持

```text
┌────────────────────────────────┐
│ Shipping unavailable           │
│                                │
│ Physical cards cannot currently│
│ be delivered to this country   │
│ or region.                     │
│                                │
│ Please choose another address. │
│                                │
│            OK                  │
└────────────────────────────────┘
```

## 15.2 地址不可配送

```text
This address is outside our current
shipping coverage.

Please enter another address.
```

## 15.3 配送方式不可用

例如偏远地区不能使用 Express：

```text
Express Shipping is not available
for this address.

Please select Standard Shipping.
```

---

# 16. 保存地址功能

用户可保存多个地址：

```text
Saved addresses

┌────────────────────────────────┐
│ ✓ Home                          │
│   Taro Yamada                   │
│   1-2-3 Shibuya                 │
│   Tokyo 150-0001, Japan         │
│                       Edit  ›   │
└────────────────────────────────┘

┌────────────────────────────────┐
│   Office                        │
│   Taro Yamada                   │
│   ...                           │
│                       Edit  ›   │
└────────────────────────────────┘

＋ Add new address
```

建议支持：

- 默认地址。
- 新增地址。
- 编辑地址。
- 删除地址。
- 切换地址。

---

# 17. P05 申请成功页

```text
┌────────────────────────────────────┐
│                                    │
│              ✓                     │
│                                    │
│       Application submitted        │
│                                    │
│   Your physical member card is     │
│   being prepared.                  │
│                                    │
│   Application ID                   │
│   MC-20260911-000123               │
│                                    │
│   Estimated delivery               │
│   Sep 18 – Sep 24                  │
│                                    │
│ ┌────────────────────────────────┐ │
│ │        Track shipment           │ │
│ └────────────────────────────────┘ │
│                                    │
│            Done                    │
└────────────────────────────────────┘
```

---

# 18. P06 配送追踪页

```text
┌────────────────────────────────────┐
│ ←          Shipment Tracking       │
├────────────────────────────────────┤
│                                    │
│ Physical Member Card               │
│ Tracking No. XX123456789JP         │
│                                    │
│ ● Card application confirmed       │
│ │                                  │
│ ● Card prepared                    │
│ │                                  │
│ ● Shipped                          │
│ │                                  │
│ ○ In transit                       │
│ │                                  │
│ ○ Delivered                        │
│                                    │
│ Estimated delivery                 │
│ Sep 18 – Sep 24                    │
│                                    │
│ ┌────────────────────────────────┐ │
│ │       View carrier tracking    │ │
│ └────────────────────────────────┘ │
└────────────────────────────────────┘
```

---

# 19. 状态机设计

```text
DRAFT
  │
  ▼
ADDRESS_ENTERED
  │
  ▼
SHIPPING_SELECTED
  │
  ▼
SUBMITTED
  │
  ▼
PAYMENT_PENDING
  │
  ▼
PAYMENT_SUCCESS
  │
  ▼
CARD_PROCESSING
  │
  ▼
SHIPPED
  │
  ▼
IN_TRANSIT
  │
  ▼
DELIVERED
```

异常状态：

```text
ADDRESS_INVALID
SHIPPING_UNAVAILABLE
PAYMENT_FAILED
FULFILLMENT_DELAYED
DELIVERY_FAILED
RETURNED
CANCELLED
```

---

# 20. 前端组件建议

| 组件 | 说明 |
|---|---|
| CountrySelector | 国家/地区选择 |
| NameInput | 国际姓名输入 |
| AddressLineInput | 地址文本 |
| RegionSelector | 州、省、行政区 |
| PostalCodeInput | 邮编 |
| PhoneInput | 国家区号 + 手机号 |
| AddressSuggestion | 地址标准化建议 |
| SavedAddressCard | 已保存地址 |
| ShippingMethodCard | 配送方式 |
| DeliveryDate | 预计送达日期 |
| OrderSummary | 费用汇总 |
| TrackingTimeline | 物流状态 |
| ErrorBanner | 表单/配送异常 |

---

# 21. 前端数据模型建议

```json
{
  "countryCode": "JP",
  "recipient": {
    "firstName": "Taro",
    "lastName": "Yamada"
  },
  "phone": {
    "countryCode": "+81",
    "number": "9012345678"
  },
  "address": {
    "addressLine1": "1-2-3 Shibuya",
    "addressLine2": "Shibuya Building 101",
    "city": "Shibuya-ku",
    "state": "Tokyo",
    "postalCode": "150-0001"
  }
}
```

---

# 22. 推荐地址配置模型

前端不要把各国字段逻辑写死，建议由配置驱动：

```json
{
  "countryCode": "US",
  "fields": [
    {
      "key": "firstName",
      "label": "First name",
      "required": true,
      "type": "text"
    },
    {
      "key": "lastName",
      "label": "Last name",
      "required": true,
      "type": "text"
    },
    {
      "key": "addressLine1",
      "label": "Street address",
      "required": true,
      "type": "text"
    },
    {
      "key": "addressLine2",
      "label": "Apartment / Suite / Unit",
      "required": false,
      "type": "text"
    },
    {
      "key": "city",
      "label": "City",
      "required": true,
      "type": "text"
    },
    {
      "key": "state",
      "label": "State",
      "required": true,
      "type": "select"
    },
    {
      "key": "postalCode",
      "label": "ZIP code",
      "required": true,
      "type": "text"
    }
  ]
}
```

这样以后增加韩国、法国、德国、加拿大、澳大利亚等市场，前端不需要重复开发一套页面。

---

# 23. 费用显示原则

任何时候都要明确：

```text
Card price
Shipping fee
Tax / VAT / Duties（如适用）
Discount
Total
Currency
```

示例：

```text
Physical Member Card     $0.00
Shipping                 $9.99
Tax                      $1.00
────────────────────────────
Total                    $10.99 USD
```

不要只显示：

```text
Total: $10.99
```

---

# 24. 多币种设计

建议所有金额同时携带：

```text
amount
currency
```

例如：

```json
{
  "amount": "9.99",
  "currency": "USD"
}
```

前端根据订单返回的币种展示，不建议仅依赖设备地区推断最终结算币种。

---

# 25. 多语言设计

建议第一阶段至少支持：

```text
English
简体中文
繁體中文
日本語
한국어
Deutsch
Français
Español
```

但地址中的实际收件信息应允许使用当地语言/文字，例如：

```text
東京都渋谷区...
```

或：

```text
서울특별시...
```

不能因为 App 使用英文，就强制地址只能使用英文。

---

# 26. UX 文案建议

### 页面标题

```text
Shipping Address
配送地址
```

### 继续按钮

```text
Continue
```

### 确认

```text
Review Application
```

### 提交

```text
Submit Application
```

### 地址错误

```text
Please check your address and try again.
```

### 不可配送

```text
Physical cards are not currently available
for delivery to this address.
```

### 配送延迟

```text
Delivery may take longer than usual due
to local carrier conditions.
```

---

# 27. 关键异常场景

| 场景 | 前端处理 |
|---|---|
| 国家不支持配送 | 禁止继续并提示 |
| 邮编错误 | 字段级错误提示 |
| 电话号码错误 | 字段级错误提示 |
| 地址缺少必填字段 | 字段级错误提示 |
| 地址标准化失败 | 允许重新填写 |
| 无可用配送方式 | 展示原因 |
| Express 不可用 | 自动隐藏或置灰并解释 |
| 配送价格变化 | 刷新费用并提示 |
| 支付失败 | 支持重新支付 |
| 网络异常 | 保存本地表单并允许重试 |
| 用户退出页面 | 草稿保留 |
| 物流失败 | 展示异常原因和联系客服入口 |

---

# 28. 设计规范建议

## 28.1 表单布局

移动端建议：

- 单列布局为主。
- First name / Last name 可在同一行。
- 每个输入框之间保持稳定间距。
- 错误信息紧跟字段展示。
- Bottom CTA 固定在底部安全区域。

## 28.2 长地址处理

地址展示卡片最多展示 3–4 行，超出使用折叠：

```text
1-2-3 Shibuya, Shibuya Building...
Show full address ›
```

避免确认页面被超长地址撑满。

---

# 29. 推荐的最终 App 交互方案

```text
┌──────────────────────┐
│ Physical Member Card │
└──────────┬───────────┘
           │ Apply
           ▼
┌──────────────────────┐
│ Shipping Address     │
│                      │
│ Country / Region     │
│ ↓                    │
│ Dynamic address form │
│ ↓                    │
│ Address validation   │
└──────────┬───────────┘
           │ Continue
           ▼
┌──────────────────────┐
│ Shipping Method      │
│                      │
│ Standard             │
│ Express              │
│ ETA + Price          │
└──────────┬───────────┘
           │ Continue
           ▼
┌──────────────────────┐
│ Review Application   │
│                      │
│ Card                 │
│ Address              │
│ Shipping             │
│ Fees                 │
│ Total                │
└──────────┬───────────┘
           │ Submit
           ▼
┌──────────────────────┐
│ Application Success  │
│                      │
│ Application ID       │
│ Estimated Delivery   │
│ Track Shipment       │
└──────────────────────┘
```

---

# 30. MVP 建议

第一版建议优先实现：

```text
✓ 国家/地区选择
✓ 动态地址字段
✓ 姓名
✓ 国际手机号
✓ 邮政编码
✓ 地址校验
✓ Standard Shipping
✓ Express Shipping（如支持）
✓ 配送价格
✓ 预计送达日期
✓ 订单确认
✓ 保存默认地址
✓ 申请成功状态
```

第二阶段再增加：

```text
○ 地址智能补全
○ 地址自动标准化
○ 多地址管理
○ 物流商实时轨迹
○ 重新配送
○ 地址修改截止时间
○ 关税 / VAT 详细展示
○ 本地化收件人格式建议
```

---

# 31. 设计验收 Checklist

### UI/UX

- [ ] 国家选择器可搜索。
- [ ] 字段随国家动态变化。
- [ ] 地址错误有明确字段级提示。
- [ ] 配送费用清晰可见。
- [ ] 预计送达日期清晰可见。
- [ ] 确认页面可以编辑地址。
- [ ] 提交按钮有明确 Loading 状态。

### 国际化

- [ ] 支持 Unicode 姓名。
- [ ] 支持当地语言地址。
- [ ] 支持不同国家邮编规则。
- [ ] 支持不同国家手机号格式。
- [ ] 支持不同货币。
- [ ] 支持时区/本地日期展示。

### 异常

- [ ] 不可配送国家。
- [ ] 不可配送地址。
- [ ] 配送方式不可用。
- [ ] 价格发生变化。
- [ ] 网络请求失败。
- [ ] 支付失败。
- [ ] 配送失败。

---

# 32. 产品设计结论

对于“全球实体会员卡配送”场景，最核心的设计不是把一个中国地址表单翻译成英文，而是建立一个**国家/地区驱动的国际地址系统**。

推荐最终采用：

> **Country / Region → Dynamic Address Form → Address Validation → Shipping Method → ETA & Price → Review → Submit → Tracking**

其中地址模型采用 `addressLine1 / addressLine2 / city / state / postalCode` 等通用字段，并通过国家配置决定字段顺序、名称、必填关系和校验规则。

这样既能覆盖中国、美国、日本、英国等主要市场，也能够为后续扩展其他国家/地区保留空间。
