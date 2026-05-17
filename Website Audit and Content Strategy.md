# **Technical Audit and Ecosystem Integration Roadmap for BharatSaver**

## **Comprehensive Site-Wide Diagnostic Audit**

### **Technical SEO and Multi-Lingual Architecture**

The technical architecture of the financial portal utilizes the Next.js framework, deploying a localized dynamic routing model to serve content across distinct language interfaces, specifically English (/en/) and Marathi (/mr/).1 A critical diagnostic scan of this multi-lingual deployment reveals structural issues in search engine indexation, link equity distribution, and sitemap configuration.1 While the Marathi directory (/mr/blog) and localized calculators are designed to capture regional organic traffic, the platform lacks a complete implementation of self-referential canonical tags and cross-lingual hreflang header mappings.3 This gap increases the risk of duplicate content penalties, as search crawlers struggle to distinguish between translated variations of highly similar calculator interfaces.1

The XML sitemap hierarchy presents additional canonicalization issues.1 The platform groups pages into separate sitemap files without properly mapping the relationships between localized paths.1 When a user toggles the language selector, the frontend updates the locale path in the URL but fails to update the corresponding metadata tags in the document head.1 This causes search engines to index translated routes as separate, non-canonical entities. This division of page authority across multiple localized URLs reduces the domain's overall ranking potential.

To address this, the site-wide routing configuration must be updated to inject programmatic link headers. These headers must map the exact relationship between the English and Marathi variations of every page on the platform.

| Localized Page Route (English) | Localized Page Route (Marathi Alternative) | Required HTML Head Metadata Implementation | Technical SEO Objective |
| :---- | :---- | :---- | :---- |
| https://bharatsaver.com/en/nps-calculator 1 | https://bharatsaver.com/mr/blog (NPS localized version) 3 | \<link rel="alternate" hreflang="en" href="..." /\> \<link rel="alternate" hreflang="mr" href="..." /\> \<link rel="canonical" href="..." /\> 1 | Consolidates search equity and prevents duplicate content flags across regional subdirectories.1 |
| https://bharatsaver.com/en/ppf-calculator 1 | https://bharatsaver.com/mr/blog (PPF localized version) 3 | \<link rel="alternate" hreflang="en" href="..." /\> \<link rel="alternate" hreflang="mr" href="..." /\> \<link rel="canonical" href="..." /\> 1 | Directs search engine crawlers to the correct regional tool based on user geographic signals.1 |

### **Performance and User Experience Metrics**

In the current search landscape, performance optimizations are evaluated primarily on Field Data compiled from actual Chrome User Experience Reports (CrUX) rather than synthetic Lab Data.4 The platform shows significant performance bottlenecks across all three Core Web Vitals metrics, which directly impacts search visibility and user conversion rates.4

#### **Largest Contentful Paint (LCP)**

The platform's Largest Contentful Paint (LCP) frequently exceeds the 2.5-second target for a "Good" rating, especially on mobile connections.4 This delay is primarily caused by un-optimized media assets and render-blocking scripts in the document head.6 The main hero sections of key landing pages feature heavy images that lack preloading instructions.7

To resolve this, the next-generation image component in Next.js must be configured to automatically convert assets to WebP or AVIF formats and serve dynamically resized images based on the user's viewport.4 Additionally, critical above-the-fold elements must be marked with the fetchpriority="high" attribute to prioritize them in the browser's loading queue.8

#### **Interaction to Next Paint (INP)**

Interaction to Next Paint (INP) measures the delay between a user input (such as adjusting a slider or clicking a button) and the next visual update on the screen.4 On this platform, INP often falls short of the recommended 200-millisecond threshold during calculator operations.4 When users drag sliders to adjust contribution amounts, the system executes heavy interest compounding calculations on the main UI thread.7 This synchronous execution blocks the rendering engine and causes visible input lag.7

To fix this, event handlers must be throttled, and complex calculations should be offloaded to asynchronous Web Workers.4 This keeps the main thread responsive to user input.6

#### **Cumulative Layout Shift (CLS)**

Cumulative Layout Shift (CLS) measures visual stability during the page loading lifecycle, with a target score below 0.1.4 The platform exhibits layout shifts due to two main factors: un-proportioned ad placeholders and unoptimized custom web fonts.4 When third-party scripts dynamically inject ad content or premium alerts above existing text, they push content down, causing layout shifts that can lead to accidental clicks.4

Furthermore, using custom web fonts without fallback matching causes a visible layout shift when the font loads.4 This can be addressed by applying font-display: optional or font-display: swap to ensure fallback system fonts match the dimensions of the custom web typography.4

| Core Web Vital Metric | Primary Technical Bottleneck | Dynamic Engineering Remedy | Target Performance Threshold |
| :---- | :---- | :---- | :---- |
| **Largest Contentful Paint (LCP)** | Unoptimized hero banners and render-blocking third-party scripts in the document head.6 | Implement WebP/AVIF asset encoding, apply fetchpriority="high" to above-the-fold images, and defer non-critical JS.4 | ![][image1] seconds 4 |
| **Interaction to Next Paint (INP)** | Heavy compounding loops executed synchronously on the main rendering thread.6 | Implement input debouncing, throttle state updates, and offload calculations to background Web Workers.4 | ![][image2] milliseconds 4 |
| **Cumulative Layout Shift (CLS)** | Dynamic ad injection and font face loading reflows.4 | Reserve explicit aspect-ratio dimensions on parent wrappers and utilize font-display: optional.4 | ![][image3] 4 |

### **Functional and Algorithmic Audit of Interactive Tools**

The website offers a directory of 21 financial tools designed to help users with wealth planning, tax optimization, and debt management.2 A functional audit of these tools shows that while the active calculators are mathematically accurate, there are several broken navigation links, incomplete documentation, and inconsistent user flows across the platform.2

#### **Broken Comparison and Insurance Calculators**

The primary functional deficit on the site is the presence of several non-operational placeholder links in the directory.2 High-intent comparisons like the *LIC vs PPF*, *LIC vs SIP*, and *LIC Child Plan* calculators exist as cards in the UI but lack active functional engines.2 When clicked, these elements do not open interactive calculators.2 This creates broken user journeys on some of the platform's highest-value pages.2

#### **Operational Mechanics of Active Tools**

For the active tools on the platform, the calculation engines execute accurately.1 However, their functional configurations and user options vary:

* **Mutual Fund Overlap Calculator:** This tool calculates portfolio overlap across up to five Indian equity funds.2 It uses unique exchange tickers (e.g., 'RELIANCE') and normalization algorithms to map holdings, removing corporate suffixes like "Ltd" or "Inc" to prevent duplicate entries.2 It also uses regex patterns to filter out cash, net receivables, and tri-party repo positions.2 If the parsed holdings data represents less than 80% of a fund's total assets, the system displays a "Partial Data Coverage" warning to alert the user that the overlap calculation may be understated.2  
* **Sukanya Samriddhi Yojana (SSY) Calculator:** This calculator assumes investments are made at the start of the financial year and applies the current 8.2% annual interest rate.2 It validates user inputs to ensure the girl child is under the age of 10 and generates a detailed 21-year breakdown of deposits, interest accrued, and ending balances, which can be exported as a CSV file.2  
* **Retirement Corpus Calculator:** This tool uses a present value of annuity formula to compute the required post-retirement fund, assuming a standard lifespan of 85 years.2 It relies on several default assumptions: pre-retirement returns of 10% to 12%, post-retirement returns of 6% to 7%, inflation of 5% to 6%, and outputs the required monthly SIP to bridge any savings shortfall.2  
* **Atal Pension Yojana (APY) Calculator:** While functional, this tool lacks clear user guidelines and structured premium charts, making it difficult for users to determine their required contributions.2

To provide a consistent user experience, the interface design of these tools should be standardized. Incorporating features like CSV exports, clear visual charts, and verified author profiles across all calculators will help build user trust and engagement.1

## ---

**Actionable Development and Optimization Roadmap**

The following roadmap outlines a prioritized plan to address the performance bottlenecks, technical SEO issues, and functional gaps identified in the audit.

| Development Phase | Target Component | Technical Implementation Details | Required Resources | Expected Impact on Search Rankings and UX |
| :---- | :---- | :---- | :---- | :---- |
| **Phase 1: Critical Core Fixes (Weeks 1–3)** | Non-operational Calculator Directory Links.2 | Build the backend mathematical models and frontend interfaces for the *LIC vs PPF*, *LIC vs SIP*, and *LIC Child Plan* tools.2 | Backend Engineering, Frontend UI Designer. | Resolves broken user journeys on high-value comparative keywords.2 |
| **Phase 2: Performance Enhancements (Weeks 4–6)** | Interaction to Next Paint (INP) Optimization.4 | Offload compounding loops from the React rendering thread to asynchronous Web Workers.6 | Frontend Performance Architect. | Lowers user input lag on sliders to under 150 milliseconds.4 |
| **Phase 3: Visual & Layout Optimization (Weeks 7–9)** | Largest Contentful Paint (LCP) and CLS.4 | Reserve explicit dimensions for ad spaces, implement AVIF image formats, and apply preloading directives.4 | Frontend Developer, DevOps. | Lowers mobile LCP to under 1.8 seconds and cuts layout shifts to near-zero.4 |
| **Phase 4: Technical SEO & Localization (Weeks 10–12)** | Multi-lingual Canonicalization & Routing.1 | Configure dynamic XML sitemaps and implement self-referential canonical and cross-lingual hreflang tags.1 | SEO Specialist, Next.js Architect. | Eliminates duplicate indexing risks and consolidates authority for regional search terms.1 |

## ---

**Strategic Ecosystem Content Integration**

An effective way to improve conversion on the platform is to integrate educational content with functional calculators. This approach guides users from learning about financial concepts directly to using the tools.1 For example, a detailed comparative guide can direct users to the /en/lic-vs-ppf-calculator to run personalized projections.2

This path reduces navigation friction and supports user engagement.5 The following article demonstrates this strategy, using deep links to connect the educational narrative with the *LIC vs PPF* and *LIC Premium* calculators.2

# ---

**Public Provident Fund vs LIC Endowment Plans: A Comprehensive Financial Comparison**

In India's personal savings market, individuals often evaluate options to secure their long-term financial stability.9 For decades, traditional life insurance policies from the Life Insurance Corporation of India (LIC) have served as a common savings option.10 However, the Public Provident Fund (PPF) represents a strong, government-backed alternative for risk-averse investors.10

A common mistake is treating these two financial products as interchangeable. They serve fundamentally different purposes: traditional LIC plans are primarily risk-mitigation instruments with a secondary savings element, while the PPF is a pure savings vehicle designed for long-term capital compounding.9 Conflating these two distinct structures can lead to suboptimal life insurance coverage and lower investment returns.13

                                    Monthly Capital Allocation  
                                                │  
                     ┌──────────────────────────┴──────────────────────────┐  
                     ▼                                                     ▼  
        Pure Risk Protection (Term Insurance)                    Guaranteed Compounding (PPF)  
    ┌────────────────┬────────────────┐                   ┌────────┴────────────────┐  
    │ High Cover (e.g., ₹1 Crore)     │                   │ Zero Capital Risk       │  
    │ Low Cost (e.g., ₹12,000/year)   │                   │ 7.10% Compounded returns│  
    │ Direct Beneficiary Security     │                   │ Triple Tax Exemption    │  
    └─────────────────────────────────┘                   └─────────────────────────┘  
                     │                                             │  
                     └──────────────────────────┬──────────────────┘  
                                                ▼  
                                    Optimal Financial Strategy

## ---

**Understanding the Public Provident Fund**

The Public Provident Fund is a long-term, government-backed savings program introduced to encourage small savings and support retirement planning.9

### **Operational Rules and Investment Limits**

PPF accounts are subject to specific operational rules. A citizen is permitted to open only one personal account, though parents or guardians may open an additional account on behalf of a minor child.9 The program requires a minimum annual contribution of ₹500, with a maximum cap of ₹1,50,000 per financial year.12 Any deposits exceeding this ₹1,50,000 annual limit do not earn interest and are ineligible for tax deductions.9

The account has an initial 15-year lock-in period.12 Upon maturity, subscribers can choose to withdraw the full balance, extend the account in blocks of five years without making fresh contributions, or extend it with continued annual deposits.9

If an investor fails to deposit the minimum ₹500 in any financial year, the account is deactivated.9 To reactivate a deactivated account, the subscriber must submit a written request to the bank or post office, pay a flat penalty of ₹50 for each year of inactivity, and deposit the minimum ₹500 for each inactive year.9

### **Interest Rate Calculations and Compounding Frequency**

For the first quarter (April to June) of the financial year 2026-27, the Ministry of Finance has maintained the PPF interest rate at 7.10% per annum.12 While this interest is compounded annually and formally credited to accounts on March 31st, it is calculated monthly on the lowest balance between the fifth day and the last day of each month.12

This specific calculation method creates a clear strategic incentive: making deposits on or before the fifth day of the month ensures the capital earns interest for that entire month.16 Consistently depositing funds after the fifth of the month can lead to significant lost interest over a 15-year holding period.16

## ---

**Exploring Traditional LIC Endowment Plans**

Traditional LIC endowment plans, such as *Jeevan Anand (Plan 915\)*, *Jeevan Labh (Plan 936\)*, and *Jeevan Umang (Plan 945\)*, are structured insurance-investment hybrid products.3 Under these contracts, the policyholder pays regular premiums over a set duration.20 They receive a lump-sum maturity benefit if they survive the policy term, while their designated beneficiaries are secured with a death benefit if the policyholder passes away during the policy lifecycle.13

### **Savings Returns and the Bonus Framework**

Traditional endowment policies are "with-profit" plans, meaning their investment returns depend on the annual profits of the insurer's life business.22 These returns are declared as non-compounded Simple Reversionary Bonuses per ₹1,000 of the Sum Assured, alongside a one-time Final Additional Bonus (FAB) paid at policy maturity or death.22

Historically, these simple reversionary bonuses have remained modest, resulting in total maturity yields ranging between 4.00% and 6.00% per annum.9 This return profile underperforms secure government savings instruments, especially when factoring in high premium commitments and potential penalties for surrendering a policy early.9

## ---

**Comparative Policy Taxation and Regulatory Rules**

Evaluating the tax rules of both products is essential for precise long-term planning, particularly as regulations have tightened around high-premium life insurance contracts.

### **Tax Status of Contributions**

Both PPF deposits and LIC premiums qualify for tax deductions under Section 80C of the Income Tax Act, up to a maximum limit of ₹1,50,000 per year.10 However, this deduction is only available under the Old Tax Regime.16 Under the New Tax Regime, neither instrument provides a deduction on contributions.16

### **Exempt-Exempt-Exempt Status of the Public Provident Fund**

PPF features a strict Exempt-Exempt-Exempt (EEE) tax classification.9 This means contributions are tax-deductible under Section 80C, all annual accrued interest is completely tax-exempt, and the final maturity proceeds are entirely tax-free upon withdrawal.14 This structural status protects the entire corpus from tax friction at all stages of growth.16

### **Maturity Taxability and Section 10(10D) Caps for Life Insurance**

Historically, life insurance maturity payouts were fully exempt from income tax under Section 10(10D).9 However, recent regulations have established strict premium caps to limit high-value tax shelter policies:

* **Traditional Savings/Endowment Policies:** For non-linked insurance contracts issued on or after April 1, 2023, maturity proceeds are tax-free *only* if the aggregate annual premium across all such policies remains below ₹5,00,000 in a financial year.27 If the aggregate annual premium exceeds this ₹5,00,000 threshold, the entire maturity payout (net of premiums paid) becomes fully taxable as "Income from Other Sources" at the marginal slab rate.28  
* **Unit Linked Insurance Plans (ULIPs):** For ULIPs purchased on or after February 1, 2021, maturity proceeds lose tax exemption if the aggregate annual premium exceeds ₹2,50,000.27 Payouts exceeding this limit are taxed as Long-Term Capital Gains (LTCG) at 12.5% on profits exceeding ₹1,25,000.28  
* **The 10% Sum Assured Rule:** Under Section 10(10D), for any policy issued after April 1, 2012, the annual premium must not exceed 10% of the basic Sum Assured.9 If a policy breaches this 10% threshold, the entire maturity benefit becomes fully taxable.9  
* **Death Benefits:** Regardless of these aggregate premium caps and ratios, any sum received as a death benefit by a nominee remains fully exempt from income tax in all cases.27

## ---

**Direct Structural Comparison**

The structural and operational differences between these two financial products are summarized below.

| Difference Point | Public Provident Fund (PPF) | LIC Endowment Policy |
| :---- | :---- | :---- |
| **Purpose** | Savings and long-term capital compounding 9 | Combined life coverage and savings 10 |
| **Returns** | Guaranteed 7.10% p.a. (compounded annually) 12 | Variable; dependent on yearly bonus declarations 9 |
| **Tenure** | Locked in for 15 years 14 | Flexible tenure as chosen by the subscriber 9 |
| **Premature Closure** | Restricted; allowed only under specific conditions 9 | Allowed, but surrendering the policy early attracts penalties 9 |
| **Regulatory Authority** | Central Government of India 9 | IRDAI (Insurance Regulatory and Development Authority) 9 |
| **Deposit Amount** | Flexible: Min INR 500 up to Max INR 1,50,000 yearly 12 | Premiums are fixed at the start and not flexible 9 |
| **Liquidity** | Partial withdrawals after 7 years; loans after 3 years 14 | Lock-in of 3 years, after which the policy can be surrendered or borrowed against 9 |
| **Taxation** | EEE (Exempt-Exempt-Exempt) 9 | Premium is tax-free if ![][image4] of sum assured and under ₹5 Lakh/year 27 |

## ---

**Financial Synergy: Separating Insurance and Investment**

Mixing insurance and investment often results in a sub-optimal financial strategy. The high premiums required by traditional endowment policies secure only low-value death covers (frequently leaving families under-insured), while locking up capital in low-yield assets.9

To optimize this, financial planners recommend **separating insurance and investment**. This approach, known as "Buy Term and Invest the Difference" (BTID), involves purchasing a low-cost, high-cover pure term insurance policy for family protection, and investing the remaining budget in high-performing, secure assets like the PPF.9

┌────────────────────────────────────────────────────────────────────────────────┐  
│                           ANNUAL SAVINGS ALLOCATION                            │  
│                                   ₹1,50,000                                    │  
└──────────────────────────────────────┬─────────────────────────────────────────┘  
                                       │  
            ┌──────────────────────────┴──────────────────────────┐  
            ▼                                                     ▼  
   STRATEGY A: HYBRID MODEL                             STRATEGY B: BTID SYNERGY  
┌───────────────────────┐                            ┌─────────────────────────────────┐  
│ LIC New Jeevan Anand  │                            │ Pure Term Cover \+ PPF Portfolio │  
├───────────────────────┤                            ├─────────────────────────────────┤  
│ Premium:  ₹1,50,000/yr│                            │ Term Premium:  ₹12,000/yr       │  
│ Death Cover: ₹34 Lakh │                            │ PPF Deposit:   ₹1,38,000/yr     │  
│ Maturity: \~₹91 Lakh   │                            │ Death Cover:   ₹1 Crore (100x)  │  
│                       │                            │ Maturity:      \~₹1 Crore        │  
└───────────────────────┘                            └─────────────────────────────────┘

The difference between these approaches is illustrated below using a real-world scenario for a 30-year-old non-smoker seeking an annual allocation of ₹1,50,000 for 25 years.11

### **Scenario A: Traditional Insurance-Investment Model**

The investor channels their entire annual budget of ₹1,50,000 into *LIC New Jeevan Anand (Plan 915\)* for a 25-year term.24

* **Annual Outlay:** ₹1,50,000.24  
* **Resulting Sum Assured:** Approximately ₹34,00,000.24  
* **Maturity Return Calculation:** Assuming a constant Simple Reversionary Bonus of ₹49 per ₹1,000 Sum Assured and a Final Additional Bonus (FAB) of ₹450 per ₹1,000 Sum Assured 24:

![][image5]  
![][image6]  
![][image7]

* **Death Benefit Term Cover:** If death occurs during the 25-year term, the nominee receives 1.25 times the Sum Assured plus accrued bonuses.24 The baseline cover is approximately ₹42,50,000, which may be insufficient for a young family with long-term financial obligations.13

### **Scenario B: Buy Term and Invest the Difference Model**

The investor splits their annual budget: they purchase an *LIC New Tech-Term (Plan 954\)* pure term insurance policy for a secure ₹1,00,00,000 death cover, and invest the remaining budget directly into the PPF.11

* **LIC Term Insurance Premium:** Approximately ₹12,000 per year secures a ₹1 Crore coverage term.11  
* **Net PPF Annual Allocation:** The remaining ₹1,38,000 is deposited directly into the PPF account before April 5th each year.11  
* **Maturity Return Calculation:** Over the 25-year term (the initial 15 years extended by two five-year blocks), compounding the ₹1,38,000 annual deposit at the current 7.10% interest rate yields:

![][image8]

* **Total Maturity Yield:** Under Scenario B, the final tax-free payout is approximately ₹1,00,10,000.9 This outperforms Scenario A by more than ₹9,00,000.24  
* **Active Death Cover:** The family is secured with a ₹1,00,00,000 term death benefit.11 This is nearly triple the coverage offered by the hybrid model in Scenario A.24

## ---

**Summary of Strategic Planning Principles**

To maximize long-term wealth accumulation and secure family protection, savers can apply several key principles:

* **Separate Protection from Wealth Accumulation:** Avoid hybrid policies that mix savings with insurance.9 Using pure term policies for protection and dedicated vehicles like the PPF for compounding yields superior results.9  
* **Monitor Contribution Timings:** For PPF investments, deposit funds before the fifth of each month—or before April 5th for annual lump-sum contributions—to maximize compounding returns.16  
* **Track Section 10(10D) Premium Thresholds:** If you hold traditional insurance policies, ensure your aggregate annual premium stays below the ₹5,00,000 limit to preserve tax-free status on maturity proceeds.27  
* **Utilize Interactive Tools for Personal Projections:** Rather than relying on static tables, use interactive resources like the [LIC vs PPF Calculator](https://bharatsaver.com/en/lic-vs-ppf-calculator) to test dynamic, personalized scenarios for your age and tax bracket.2 Use the [LIC Premium Calculator](https://bharatsaver.com/en/lic-premium-calculator) to estimate your exact premium requirements.2 This data-driven approach ensures your long-term plans are built on precise, optimized projections.

#### **Works cited**

1. NPS Calculator 2025 — National Pension System Corpus & Pension \- BharatSaver, accessed on May 17, 2026, [https://bharatsaver.com/en/nps-calculator](https://bharatsaver.com/en/nps-calculator)  
2. Financial Calculators for Indian Schemes (PPF, NPS, SSY) | BharatSaver, accessed on May 17, 2026, [https://bharatsaver.com/en/calculators](https://bharatsaver.com/en/calculators)  
3. भारतासाठी वैयक्तिक वित्त ब्लॉग | बचत, गुंतवणूक, कर | BharatSaver, accessed on May 17, 2026, [https://bharatsaver.com/mr/blog](https://bharatsaver.com/mr/blog)  
4. Core Web Vitals 2026: AI-Powered Optimization Strategies \- Digital Applied, accessed on May 17, 2026, [https://www.digitalapplied.com/blog/core-web-vitals-ai-optimization-strategies-2026](https://www.digitalapplied.com/blog/core-web-vitals-ai-optimization-strategies-2026)  
5. Core Web Vitals 2026: What Changed and How to Improve Your Shopify Performance, accessed on May 17, 2026, [https://hyperspeed.me/blog/core-web-vitals-2026-what-changed/](https://hyperspeed.me/blog/core-web-vitals-2026-what-changed/)  
6. Core Web Vitals Optimization: Complete Guide for 2026 \- Sky SEO Digital, accessed on May 17, 2026, [https://skyseodigital.com/core-web-vitals-optimization-complete-guide-for-2026/](https://skyseodigital.com/core-web-vitals-optimization-complete-guide-for-2026/)  
7. Next.js \+ Core Web Vitals, Explained Like a Human: How to Make Your Site Feel Instant, accessed on May 17, 2026, [https://www.rebelmouse.com/next-js-core-web-vitals](https://www.rebelmouse.com/next-js-core-web-vitals)  
8. Web Performance in 2026: Best Practices for Speed, Security & Core Web Vitals, accessed on May 17, 2026, [https://solidappmaker.com/web-performance-in-2026-best-practices-for-speed-security-core-web-vitals/](https://solidappmaker.com/web-performance-in-2026-best-practices-for-speed-security-core-web-vitals/)  
9. LIC Vs PPF \- Which is Best for Investment? \- Scripbox, accessed on May 17, 2026, [https://scripbox.com/saving-schemes/lic-vs-ppf/](https://scripbox.com/saving-schemes/lic-vs-ppf/)  
10. LIC vs PPF: What are the Differences? \- Jainam Broking Limited, accessed on May 17, 2026, [https://www.jainam.in/glossary/lic-vs-ppf/](https://www.jainam.in/glossary/lic-vs-ppf/)  
11. LIC has been India's default savings choice for decades. Over the last 20 years, many LIC policies have delivered returns that barely beat inflation and often underperform mutual funds and even fixed deposits. : r/IndiaFinance \- Reddit, accessed on May 17, 2026, [https://www.reddit.com/r/IndiaFinance/comments/1qdcna3/lic\_has\_been\_indias\_default\_savings\_choice\_for/](https://www.reddit.com/r/IndiaFinance/comments/1qdcna3/lic_has_been_indias_default_savings_choice_for/)  
12. accessed on May 17, 2026, [https://cleartax.in/s/ppf](https://cleartax.in/s/ppf)  
13. LIC Jeevan Anand or PPF | Key Differences Explained \- Motilal Oswal, accessed on May 17, 2026, [https://www.motilaloswal.com/personal-finance/saving-schemes/lic-jeevan-anand-or-ppf-what-are-the-differences](https://www.motilaloswal.com/personal-finance/saving-schemes/lic-jeevan-anand-or-ppf-what-are-the-differences)  
14. PPF Interest Rate 2026–27: Latest Rate, Calculation & Benefits \- Bajaj Finserv, accessed on May 17, 2026, [https://www.bajajfinserv.in/investments/ppf-interest-rates](https://www.bajajfinserv.in/investments/ppf-interest-rates)  
15. A Detailed Guide on Comparison of SIP Vs PPF \- Groww, accessed on May 17, 2026, [https://groww.in/blog/sip-vs-ppf](https://groww.in/blog/sip-vs-ppf)  
16. PPF in 2026: 20 Key Rules, Returns, Withdrawals Explained \- Value Research, accessed on May 17, 2026, [https://www.valueresearchonline.com/learn/savings/ppf-2026-top-20-questions-rules-withdrawals-explained/](https://www.valueresearchonline.com/learn/savings/ppf-2026-top-20-questions-rules-withdrawals-explained/)  
17. Public provident fund: Deposit of ₹2,000/month in PPF account can earn up to ₹1.08 crore at retirement — Here's how, accessed on May 17, 2026, [https://www.livemint.com/money/personal-finance/public-provident-fund-how-rs-2000-deposit-per-month-ppf-account-savings-earn-up-to-1-08-crore-60-years-retirement-payout-11778521383907.html](https://www.livemint.com/money/personal-finance/public-provident-fund-how-rs-2000-deposit-per-month-ppf-account-savings-earn-up-to-1-08-crore-60-years-retirement-payout-11778521383907.html)  
18. LIC Term Insurance Plan (2025) — ₹1 Crore Premiums & Calculator | BharatSaver, accessed on May 17, 2026, [https://bharatsaver.com/en/lic-term-insurance](https://bharatsaver.com/en/lic-term-insurance)  
19. BharatSaver \- Smarter Savings for Every Indian, accessed on May 17, 2026, [https://bharatsaver.com/](https://bharatsaver.com/)  
20. PPF vs LIC: Meaning, Differences and Benefits \- Digit Insurance, accessed on May 17, 2026, [https://www.godigit.com/life-insurance/financial-planning/saving-schemes/ppf-vs-lic](https://www.godigit.com/life-insurance/financial-planning/saving-schemes/ppf-vs-lic)  
21. LIC Jeevan Anand Plan | Table No. 149 \- Details, Benefits & Reviews \- OneInsure, accessed on May 17, 2026, [https://www.oneinsure.com/life-insurance/lic-of-india/jeevan-anand](https://www.oneinsure.com/life-insurance/lic-of-india/jeevan-anand)  
22. Jeevan Anand Plan – (Table No 149\) Benefit Illustration Introduction Insurance Regulatory & Development Authority (IRDA) \- LIC, accessed on May 17, 2026, [https://licindia.in/documents/20121/389029/Sales-Brochure\_149.pdf/c14a3b09-d3dc-107e-13cc-c90b313e315c?t=1677835764235](https://licindia.in/documents/20121/389029/Sales-Brochure_149.pdf/c14a3b09-d3dc-107e-13cc-c90b313e315c?t=1677835764235)  
23. LIC Policies-How to calculate returns? \- BasuNivesh, accessed on May 17, 2026, [https://www.basunivesh.com/lic-policies-how-to-calculate-returns/](https://www.basunivesh.com/lic-policies-how-to-calculate-returns/)  
24. LIC New Jeevan Anand 815 Review, premium, and Maturity Calculator \- Insurance Funda, accessed on May 17, 2026, [https://www.insurancefunda.in/lic-new-jeevan-anand-t-815/](https://www.insurancefunda.in/lic-new-jeevan-anand-t-815/)  
25. LIC Versus PPF \- Policybazaar, accessed on May 17, 2026, [https://www.policybazaar.com/lic-of-india/lic-vs-ppf/](https://www.policybazaar.com/lic-of-india/lic-vs-ppf/)  
26. PPF Calculator 2025 — Calculate PPF Maturity Online (India) | BharatSaver, accessed on May 17, 2026, [https://bharatsaver.com/en/ppf-calculator](https://bharatsaver.com/en/ppf-calculator)  
27. Section 10(10D) of Income Tax Act: Eligibility, Benefits & Exemptions \- SBI Life, accessed on May 17, 2026, [https://www.sbilife.co.in/blogs/tax/section-10d-of-income-tax-act-benefits-and-conditions](https://www.sbilife.co.in/blogs/tax/section-10d-of-income-tax-act-benefits-and-conditions)  
28. Section 10(10D) of Income Tax Act \- HDFC Life, accessed on May 17, 2026, [https://www.hdfclife.com/insurance-knowledge-centre/tax-saving-insurance/section-10-10d-of-the-income-tax-act](https://www.hdfclife.com/insurance-knowledge-centre/tax-saving-insurance/section-10-10d-of-the-income-tax-act)  
29. Are Life Insurance Maturity Proceeds Taxable Under New Tax Regime?, accessed on May 17, 2026, [https://lifeinsurance.adityabirlacapital.com/articles/life-insurance/are-life-insurance-maturity-proceeds-taxable-under-new-tax-regime/](https://lifeinsurance.adityabirlacapital.com/articles/life-insurance/are-life-insurance-maturity-proceeds-taxable-under-new-tax-regime/)  
30. Section 10(10D) of Income Tax Act \- Tax Exemption Rules \- Aviva India, accessed on May 17, 2026, [https://www.avivaindia.com/insurance-guide/tax-savings/section-10-10d-of-income-tax-act](https://www.avivaindia.com/insurance-guide/tax-savings/section-10-10d-of-income-tax-act)  
31. FD vs PPF Calculator 2025 — Compare Returns, Tax & Maturity (Free Tool) | BharatSaver, accessed on May 17, 2026, [https://bharatsaver.com/en/fd-vs-ppf-calculator](https://bharatsaver.com/en/fd-vs-ppf-calculator)

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAUCAYAAAD/Rn+7AAAAiklEQVR4XmNgGAWjYBSMLKAOxAuBeCK6xEADRiA+DsRXgdgfiJlRpQcOgBziBMTnofSgcRgIRADxAyDeBcTmqFIDA7iBOB+I3wLxfDS5AQecDBCHTQViSTS5QQFYGQa5A0FgUEcxNhDAAClWQJlED01u0IBBXcwgA1BBDQrJQVdQo4NBW9WNAlwAAHuMFLz3LOT7AAAAAElFTkSuQmCC>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAUCAYAAAAUccS4AAAAgElEQVR4Xu2VsQqAQAxDuwsO+qFuTuIPuPkvDn6Sg/9wCect5SanFPogUMgSwrVnliRJ8ocFuqHZG0qM0AYd3ywJG2TAF9qdJwVDPlYblWuTLZ5WW1ydJ8VgtUUuEGdpQoUlYZ5BD+kF68GQPFktdAjap8DgIVomXMALmryRRKYAWRITjboKSrUAAAAASUVORK5CYII=>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAUCAYAAADLP76nAAAAjUlEQVR4XmNgGAWjYBSMgqEE1IF4IRBPRJcY7IARiI8D8VUg9gdiZlTpwQtADnUC4vNQesg4HAQigPgBEO8CYnNUqcEJuIE4H4jfAvF8NLlBDzgZIA6fCsSSaHJDArAyDHEPgMCQTkLYQAADpNgEZWI9NLkhA4Z0MYoMQBUZKCaGXEWGDoZsU2IU0AoAAJZWFLyhUJvyAAAAAElFTkSuQmCC>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADEAAAAUCAYAAAAk/dWZAAAAjUlEQVR4XmNgGAWjYBSMguEA1IF4IRBPRJcYCoARiI8D8VUg9gdiZlTpwQ1AjnUC4vNQekg5HgQigPgBEO8CYnNUqcELuIE4H4jfAvF8NLkhATgZII6fCsSSaHJDBrAyDANPgMCQT07YQAADpEgFZWw9NLkhBYZ8EYsMQJUdKEaGZGWHDoZ0s2MU0BoAAFmzFLxlP2wzAAAAAElFTkSuQmCC>

[image5]: <data:image/png;base64,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>

[image6]: <data:image/png;base64,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>

[image7]: <data:image/png;base64,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>

[image8]: <data:image/png;base64,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>