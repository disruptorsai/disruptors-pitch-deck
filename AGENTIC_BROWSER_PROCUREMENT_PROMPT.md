# Agentic Browser API Procurement Instructions
## Automated Setup for Business Intelligence APIs

**Purpose:** This prompt provides step-by-step instructions for an agentic browser (Claude with browser tools, Browserbase, etc.) to automatically procure and set up API accounts for the AI Presenter business intelligence system.

**Important:** Some APIs require human interaction (sales calls, contract signing). The agent should flag these and provide the necessary contact information.

---

## Overview of Task

You are tasked with setting up 8 API integrations for a business intelligence system. You will:

1. Visit API provider websites
2. Sign up for accounts
3. Select appropriate pricing plans
4. Generate API keys/credentials
5. Document rate limits and pricing
6. Save credentials securely
7. Flag any APIs that require human sales interaction

**User Context:**
- Company: AI Presenter (agency/consultant pitch deck platform)
- Use Case: Comprehensive business intelligence for client analysis
- Budget: Up to $2,000/month for all APIs combined
- Email for signups: {USER_TO_PROVIDE_EMAIL}
- Payment method: {USER_TO_PROVIDE_CARD}

**Output Format:**
For each API, provide:
- Account creation status (SUCCESS/REQUIRES_HUMAN/FAILED)
- API key(s) generated
- Rate limits documented
- Monthly cost
- Notes/next steps

---

## PRIORITY TIER 1 APIS (Complete First)

### API 1: DataForSEO (HIGHEST PRIORITY)

**Objective:** Set up DataForSEO account for SEO intelligence

**Steps:**

1. **Navigate to DataForSEO**
   - URL: https://dataforseo.com/
   - Action: Open homepage

2. **Locate Sign Up**
   - Look for "Sign Up", "Get Started", "Register", or "Create Account" button
   - Click to begin registration

3. **Complete Registration Form**
   - Fill in required fields:
     - Email: {USER_EMAIL}
     - Password: {GENERATE_STRONG_PASSWORD}
     - Company Name: AI Presenter
     - Use Case: Business intelligence and competitive analysis
   - Accept terms of service
   - Submit form

4. **Verify Email**
   - Check {USER_EMAIL} inbox
   - Find DataForSEO verification email
   - Click verification link
   - Complete email verification

5. **Add Payment Method**
   - Navigate to Billing or Payment section
   - Add credit card: {USER_PAYMENT_INFO}
   - Set up billing profile

6. **Fund Account**
   - Add initial balance: $100
   - Confirm transaction
   - Wait for funds to be credited

7. **Generate API Credentials**
   - Navigate to API section, Dashboard, or Settings
   - Look for "API Credentials", "API Keys", or "Authentication"
   - Generate new credentials
   - **Important:** DataForSEO uses login + password authentication, NOT a single API key
   - Note down:
     - API Login: {SAVE_THIS}
     - API Password: {SAVE_THIS}

8. **Document Details**
   - Rate Limits: 600 requests/minute
   - Pricing: Pay-per-request (varies by endpoint)
     - Domain Analytics: ~$0.50-1.00 per request
     - Keyword Research: ~$0.25-0.50 per request
     - Backlinks: ~$1.00-2.50 per request
   - Estimated Monthly Cost: $100-300 (based on 100-200 analyses)
   - Documentation: https://docs.dataforseo.com/v3/

9. **Test API**
   - Use API testing tool (Postman or built-in)
   - Test with sample domain: "example.com"
   - Endpoint to test: `/v3/dataforseo_labs/google/domain_rank_overview/live`
   - Verify response is successful

10. **Save Credentials**
    - Format for output:
      ```
      DATAFORSEO_LOGIN={login_here}
      DATAFORSEO_PASSWORD={password_here}
      ```

**Expected Outcome:** SUCCESS - Account created, funded, credentials generated

**If Stuck:** Look for live chat support or help documentation

---

### API 2: Apollo.io

**Objective:** Set up Apollo.io account for company enrichment data

**Steps:**

1. **Navigate to Apollo.io**
   - URL: https://www.apollo.io/
   - Action: Open homepage

2. **Check for Free Trial**
   - Look for "Start Free Trial" or "Try Free" button
   - Note: Apollo often offers 14-day free trial

3. **Sign Up**
   - Click "Sign Up" or "Get Started"
   - Fill in registration:
     - Email: {USER_EMAIL}
     - Password: {GENERATE_STRONG_PASSWORD}
     - First Name: {USER_FIRST_NAME}
     - Last Name: {USER_LAST_NAME}
     - Company: AI Presenter
     - Role: Developer / Business Intelligence
     - Company Size: Select appropriate
     - Use Case: Business intelligence and lead enrichment
   - Submit form

4. **Complete Onboarding**
   - Apollo has an onboarding flow
   - Answer questions about use case
   - Skip any tutorial steps if possible
   - Goal: Get to dashboard quickly

5. **Upgrade to Growth Plan**
   - Navigate to Billing, Pricing, or Upgrade section
   - Select "Growth" plan ($149/month)
   - **Important:** API access requires Growth plan or higher (Basic doesn't include API)
   - Enter payment details: {USER_PAYMENT_INFO}
   - Confirm subscription

6. **Generate API Key**
   - Navigate to Settings → API or Integrations
   - Look for "API Keys" section
   - Click "Generate API Key" or "Create New Key"
   - Copy API key immediately (may only show once)
   - Save API key: {SAVE_THIS}

7. **Document Details**
   - Rate Limits: 100 requests/day (Growth plan)
   - Credits: 2,400 credits/year (48 per month)
   - 1 credit = 1 company enrichment
   - Pricing: $149/month (Growth plan)
   - Documentation: https://apolloio.github.io/apollo-api-docs/

8. **Test API**
   - Test endpoint: `/v1/organizations/search`
   - Test with query: "OpenAI"
   - Verify response contains company data
   - Can test with curl:
     ```bash
     curl -X GET "https://api.apollo.io/v1/organizations/search?q_organization_name=OpenAI" \
       -H "x-api-key: YOUR_API_KEY"
     ```

9. **Save Credentials**
   - Format:
     ```
     APOLLO_API_KEY={api_key_here}
     ```

**Expected Outcome:** SUCCESS - Account created, upgraded to Growth, API key generated

**If Requires Human:** Apollo may require sales call for higher tiers, but Growth should be self-service

---

### API 3: Wappalyzer

**Objective:** Set up Wappalyzer for technology stack detection

**Steps:**

1. **Navigate to Wappalyzer API**
   - URL: https://www.wappalyzer.com/api/
   - Action: Open API page

2. **Sign Up**
   - Click "Sign Up" or "Get Started"
   - Fill in registration:
     - Email: {USER_EMAIL}
     - Password: {GENERATE_STRONG_PASSWORD}
     - Company: AI Presenter (if asked)
   - Submit form

3. **Verify Email**
   - Check inbox for verification email
   - Click verification link

4. **Select Plan**
   - Navigate to Pricing or Plans section
   - Select "Startup" plan ($250/month)
   - Includes: 5,000 lookups/month
   - Enter payment details: {USER_PAYMENT_INFO}
   - Confirm subscription

5. **Generate API Key**
   - Navigate to Dashboard → API or Settings → API
   - Look for "API Key" section
   - Copy existing API key or generate new one
   - Save API key: {SAVE_THIS}

6. **Document Details**
   - Rate Limits: No hard rate limit, but quota-based
   - Quota: 5,000 lookups/month (Startup plan)
   - Overage: $0.05 per additional lookup
   - Pricing: $250/month
   - Documentation: https://www.wappalyzer.com/docs/api/

7. **Test API**
   - Test endpoint: `/v2/lookup/`
   - Test with domain: "anthropic.com"
   - Can test with curl:
     ```bash
     curl "https://api.wappalyzer.com/v2/lookup/?urls=anthropic.com" \
       -H "x-api-key: YOUR_API_KEY"
     ```
   - Verify response contains detected technologies

8. **Save Credentials**
   - Format:
     ```
     WAPPALYZER_API_KEY={api_key_here}
     ```

**Expected Outcome:** SUCCESS - Account created, subscribed, API key obtained

**Alternative:** If Wappalyzer signup is difficult, flag for manual setup but continue with other APIs

---

## PRIORITY TIER 2 APIS (Complete After Tier 1)

### API 4: Coresignal

**Objective:** Set up Coresignal for job posting data

**Steps:**

1. **Navigate to Coresignal**
   - URL: https://coresignal.com/
   - Action: Open homepage

2. **Locate Contact/Demo Button**
   - Look for "Request Demo", "Contact Sales", "Get Started"
   - **Important:** Coresignal is NOT self-service, requires sales interaction
   - Click to submit inquiry

3. **Fill Contact Form**
   - Complete form with:
     - Name: {USER_NAME}
     - Email: {USER_EMAIL}
     - Company: AI Presenter
     - Use Case: "Job posting analysis for business intelligence and opportunity detection"
     - Desired API: Jobs API
     - Estimated Volume: "100-200 companies per month, need job postings for last 90 days"
     - Budget: "Looking for $499/month plan with 10,000 API calls"
   - Submit form

4. **Flag for Human Follow-Up**
   - **Status:** REQUIRES_HUMAN
   - **Next Steps:**
     - Sales team will contact via email
     - Schedule demo call
     - Discuss pricing and contract terms
     - Target: $499/month plan
     - Sign service agreement
     - Receive API credentials after contract

5. **Document Expected Details**
   - Rate Limits: 10,000 API calls/month (standard plan)
   - Pricing: $499/month (estimated)
   - Overage: ~$0.05 per additional call
   - Documentation: https://docs.coresignal.com/ (access after signup)
   - Timeline: 1-2 weeks for sales process

**Expected Outcome:** REQUIRES_HUMAN - Contact form submitted, awaiting sales call

---

### API 5: Bright Data

**Objective:** Set up Bright Data for review intelligence / web scraping

**Steps:**

1. **Navigate to Bright Data**
   - URL: https://brightdata.com/
   - Action: Open homepage

2. **Locate Get Started Button**
   - Look for "Get Started", "Contact Sales", "Sign Up"
   - **Important:** For Review Intelligence or custom scraping, sales call required
   - For self-service scraping, can sign up directly

3. **Attempt Self-Service Signup** (if available)
   - Click "Sign Up" or "Get Started"
   - Fill in:
     - Email: {USER_EMAIL}
     - Password: {GENERATE_STRONG_PASSWORD}
     - Company: AI Presenter
   - Complete registration

4. **Explore Products**
   - Look for "Review Intelligence" or "Web Scraper API"
   - Check if self-service or requires sales call
   - If Review Intelligence available, proceed to add to account
   - If requires sales call, submit inquiry

5. **If Requires Sales Call:**
   - Click "Contact Sales" or similar
   - Fill form:
     - Name: {USER_NAME}
     - Email: {USER_EMAIL}
     - Company: AI Presenter
     - Use Case: "Review scraping from G2, Capterra, Trustpilot, Glassdoor for business intelligence"
     - Estimated Volume: "100-200 companies per month, ~10-50 reviews per company"
     - Budget: "$200-500/month"
   - Submit inquiry

6. **Flag for Human Follow-Up**
   - **Status:** REQUIRES_HUMAN (likely)
   - **Next Steps:**
     - Sales team will contact
     - Discuss Review Intelligence vs. custom scraping
     - Get pricing quote
     - Sign service agreement
     - Receive API credentials and zone configuration

7. **Document Expected Details**
   - Pricing: $200-500/month (estimated, custom based on volume)
   - Rate Limits: Depends on contract
   - Documentation: https://docs.brightdata.com/
   - Timeline: 1-2 weeks for sales process

**Expected Outcome:** REQUIRES_HUMAN (likely) - or SUCCESS if self-service available

---

### API 6: NewsAPI.ai

**Objective:** Set up NewsAPI.ai for news monitoring

**Steps:**

1. **Navigate to NewsAPI.ai**
   - URL: https://newsapi.ai/
   - Action: Open homepage

2. **Sign Up**
   - Look for "Sign Up", "Register", "Get Started"
   - Click to begin registration
   - Fill in:
     - Email: {USER_EMAIL}
     - Password: {GENERATE_STRONG_PASSWORD}
     - Company: AI Presenter (if asked)
   - Submit form

3. **Verify Email**
   - Check inbox for verification email
   - Click verification link

4. **Select Plan**
   - Navigate to Dashboard or Pricing
   - Select "Starter" plan ($99/month)
   - Includes: 10,000 articles/month
   - Enter payment details: {USER_PAYMENT_INFO}
   - Confirm subscription

5. **Generate API Key**
   - Navigate to Dashboard → API Keys or Settings
   - Look for existing API key or "Generate Key" button
   - Copy API key
   - Save: {SAVE_THIS}

6. **Document Details**
   - Rate Limits: Not hard-limited, quota-based
   - Quota: 10,000 articles/month (Starter)
   - Pricing: $99/month
   - Documentation: https://newsapi.ai/documentation

7. **Test API**
   - Test endpoint: `/api/v1/article/getArticles`
   - Test with company mention search
   - Can test via their API explorer or curl

8. **Save Credentials**
   - Format:
     ```
     NEWSAPI_AI_KEY={api_key_here}
     ```

**Expected Outcome:** SUCCESS - Account created, subscribed, API key obtained

---

## PRIORITY TIER 3 APIS (Optional, Complete After Tier 1 & 2)

### API 7: Twitter/X API

**Objective:** Set up Twitter API for social media data

**Steps:**

1. **Navigate to Twitter Developer Portal**
   - URL: https://developer.twitter.com/
   - Action: Open developer portal

2. **Apply for Developer Account**
   - Click "Sign Up" or "Apply"
   - **Important:** Requires existing Twitter/X account
   - If no account, flag: REQUIRES_HUMAN (user must create personal Twitter account first)

3. **Complete Application**
   - Fill out detailed application:
     - Account purpose: Commercial/Business
     - Use case: "Business intelligence - analyzing company social media presence for B2B clients"
     - How will you use Twitter data: "Retrieve follower counts, engagement metrics, and posting frequency for company analysis"
     - Will you display Twitter content: "No, only aggregate metrics"
     - Government affiliation: No
   - Submit application

4. **Wait for Approval**
   - Twitter reviews applications (can take 1-2 weeks)
   - **Status:** REQUIRES_HUMAN - Must wait for approval
   - Check email for approval notification

5. **After Approval:**
   - Create App in developer portal
   - Subscribe to Basic tier ($100/month)
   - Generate API keys:
     - API Key
     - API Secret
     - Bearer Token
   - Save all three credentials

6. **Document Expected Details**
   - Rate Limits: Varies by endpoint (typically 100 tweets/15min)
   - Pricing: $100/month (Basic tier)
   - Documentation: https://developer.twitter.com/en/docs
   - Timeline: 1-2 weeks for approval

**Expected Outcome:** REQUIRES_HUMAN - Application submitted, awaiting approval

---

### API 8: Financial Modeling Prep

**Objective:** Set up FMP for financial data

**Steps:**

1. **Navigate to Financial Modeling Prep**
   - URL: https://site.financialmodelingprep.com/
   - Action: Open homepage

2. **Sign Up**
   - Look for "Sign Up" or "Register"
   - Fill in:
     - Email: {USER_EMAIL}
     - Password: {GENERATE_STRONG_PASSWORD}
   - Submit form

3. **Verify Email**
   - Check inbox for verification email
   - Click verification link

4. **Select Plan**
   - Navigate to Pricing section
   - Select "Starter" plan ($29.99/month)
   - Includes: 250 requests/day
   - Enter payment details: {USER_PAYMENT_INFO}
   - Confirm subscription

5. **Get API Key**
   - Navigate to Dashboard → API Keys
   - Copy existing API key
   - Save: {SAVE_THIS}

6. **Document Details**
   - Rate Limits: 250 requests/day (Starter)
   - Pricing: $29.99/month
   - Documentation: https://site.financialmodelingprep.com/developer/docs/

7. **Test API**
   - Test endpoint: `/api/v3/profile/{symbol}`
   - Test with symbol: "AAPL"
   - Verify response contains financial data

8. **Save Credentials**
   - Format:
     ```
     FMP_API_KEY={api_key_here}
     ```

**Expected Outcome:** SUCCESS - Account created, subscribed, API key obtained

---

## EXISTING APIS (Already Set Up)

### APIs Already Configured

The following APIs should already be set up in the existing system:

1. **SerpAPI** - Web search
   - Env var: `SERPAPI_KEY`
   - Status: Should already exist
   - Action: Verify key is still valid

2. **Firecrawl** - Website scraping
   - Env var: `FIRECRAWL_API_KEY`
   - Status: Should already exist
   - Action: Verify key is still valid

3. **Brave Search** - Fallback search
   - Env var: `BRAVE_API_KEY`
   - Status: May exist
   - Action: Verify if configured

4. **Anthropic Claude** - AI analysis
   - Env var: `ANTHROPIC_API_KEY`
   - Status: Should already exist
   - Action: Verify key is still valid and has sufficient credits

**Task:** Verify Existing APIs

For each existing API:
1. Check if environment variable exists in `.env.local`
2. Test with simple API call to verify it works
3. Check billing dashboard to ensure payment method is active
4. Document current usage and remaining quota/credits

---

## CONSOLIDATED OUTPUT FORMAT

After completing all API setup tasks, provide a comprehensive report:

### Summary Table

| API | Status | Monthly Cost | API Key Variable | Notes |
|-----|--------|-------------|------------------|-------|
| DataForSEO | SUCCESS/FAILED/REQUIRES_HUMAN | $100-300 | DATAFORSEO_LOGIN, DATAFORSEO_PASSWORD | ... |
| Apollo.io | SUCCESS/FAILED/REQUIRES_HUMAN | $149 | APOLLO_API_KEY | ... |
| Wappalyzer | SUCCESS/FAILED/REQUIRES_HUMAN | $250 | WAPPALYZER_API_KEY | ... |
| Coresignal | SUCCESS/FAILED/REQUIRES_HUMAN | $499 | CORESIGNAL_API_KEY | ... |
| Bright Data | SUCCESS/FAILED/REQUIRES_HUMAN | $200-500 | BRIGHT_DATA_API_KEY | ... |
| NewsAPI.ai | SUCCESS/FAILED/REQUIRES_HUMAN | $99 | NEWSAPI_AI_KEY | ... |
| Twitter API | SUCCESS/FAILED/REQUIRES_HUMAN | $100 | TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_BEARER_TOKEN | ... |
| FMP | SUCCESS/FAILED/REQUIRES_HUMAN | $30 | FMP_API_KEY | ... |
| **TOTAL** | **X/8 SUCCESS** | **$X-X** | | |

### Environment Variables File

Generate a `.env.procurement` file with all successfully obtained credentials:

```bash
# Generated on {DATE} by Agentic Browser

# Priority Tier 1
DATAFORSEO_LOGIN=xxx
DATAFORSEO_PASSWORD=xxx
APOLLO_API_KEY=xxx
WAPPALYZER_API_KEY=xxx

# Priority Tier 2
CORESIGNAL_API_KEY=xxx_OR_PENDING
BRIGHT_DATA_API_KEY=xxx_OR_PENDING
NEWSAPI_AI_KEY=xxx

# Priority Tier 3
TWITTER_API_KEY=xxx_OR_PENDING
TWITTER_API_SECRET=xxx_OR_PENDING
TWITTER_BEARER_TOKEN=xxx_OR_PENDING
FMP_API_KEY=xxx

# Existing APIs (verified)
SERPAPI_KEY=xxx
FIRECRAWL_API_KEY=xxx
BRAVE_API_KEY=xxx
ANTHROPIC_API_KEY=xxx
```

### APIs Requiring Human Follow-Up

List all APIs marked as REQUIRES_HUMAN with next steps:

1. **Coresignal**
   - Status: Contact form submitted
   - Next Step: Wait for sales email, schedule demo call
   - Timeline: 1-2 weeks
   - Contact: {EMAIL_RECEIVED_FROM_FORM}

2. **Bright Data**
   - Status: Inquiry submitted / Account created awaiting sales call
   - Next Step: Discuss Review Intelligence product with sales
   - Timeline: 1-2 weeks
   - Contact: {EMAIL_RECEIVED_FROM_FORM}

3. **Twitter API**
   - Status: Developer application submitted
   - Next Step: Wait for approval email from Twitter
   - Timeline: 1-2 weeks
   - Check: {USER_EMAIL} inbox daily

### Rate Limits Documentation

| API | Rate Limit | Monthly Quota | Overage Cost |
|-----|------------|---------------|--------------|
| DataForSEO | 600 req/min | Unlimited | Pay-per-request |
| Apollo.io | 100 req/day | 48 credits/month | Need to purchase additional credits |
| Wappalyzer | No hard limit | 5,000 lookups | $0.05/lookup |
| Coresignal | TBD | 10,000 calls (expected) | $0.05/call |
| Bright Data | TBD | Custom | TBD |
| NewsAPI.ai | No hard limit | 10,000 articles | Need to upgrade plan |
| Twitter | 100 tweets/15min | Varies by endpoint | Included in plan |
| FMP | 250 req/day | 7,500 req/month | Need to upgrade |

### Testing Results

For each successfully set up API, provide test results:

1. **DataForSEO**
   - Test Endpoint: `/v3/dataforseo_labs/google/domain_rank_overview/live`
   - Test Domain: example.com
   - Response Code: 200 / Error
   - Result: SUCCESS / FAILED
   - Notes: {Any issues encountered}

2. **Apollo.io**
   - Test Endpoint: `/v1/organizations/search`
   - Test Query: OpenAI
   - Response Code: 200 / Error
   - Result: SUCCESS / FAILED
   - Notes: {Any issues encountered}

[Continue for all APIs]

### Cost Summary

| Category | Monthly Cost |
|----------|-------------|
| Priority Tier 1 (DataForSEO, Apollo, Wappalyzer) | $499-699 |
| Priority Tier 2 (Coresignal, Bright Data, NewsAPI) | $798-1,098 |
| Priority Tier 3 (Twitter, FMP) | $130 |
| **Total (All APIs)** | **$1,427-1,927** |

### Next Steps for User

1. **Immediate Actions:**
   - Copy `.env.procurement` file contents to `.env.local`
   - Add same variables to Netlify environment settings
   - Test each API integration in development environment

2. **Follow-Up Actions (Within 1-2 Weeks):**
   - Respond to Coresignal sales email
   - Schedule Bright Data demo call
   - Check for Twitter API approval email
   - Complete any required contracts

3. **Verification:**
   - Run test script to verify all APIs are accessible
   - Check billing dashboards for each service
   - Set up billing alerts (alert at 75% of quota)
   - Monitor usage for first week

---

## ERROR HANDLING INSTRUCTIONS

If you encounter errors during the process, follow these guidelines:

### Common Issues

**Issue:** Email verification link not received
- **Solution:** Check spam folder, wait 5 minutes, request resend

**Issue:** Payment declined
- **Solution:** Flag for user to verify payment method, try alternative card

**Issue:** API key not immediately available after signup
- **Solution:** Wait 5 minutes, refresh dashboard, check email for onboarding instructions

**Issue:** 404 on API documentation links
- **Solution:** Search site for "API docs" or "Developer documentation", flag if not found

**Issue:** Pricing plan not available (sold out, region-restricted, etc.)
- **Solution:** Flag for human review, note alternative plans available

**Issue:** Signup requires phone verification
- **Solution:** Flag REQUIRES_HUMAN, cannot proceed without user's phone number

**Issue:** CAPTCHA challenges
- **Solution:** If repeated CAPTCHA failures, flag for manual completion

### When to Stop and Flag for Human

Stop automated process and flag for human intervention if:
1. Payment requires additional verification (e.g., 3D Secure, phone call)
2. Account requires phone number verification
3. Repeated CAPTCHA failures (more than 3 attempts)
4. API access requires sales call or custom contract
5. Pricing is unclear or requires quote
6. Terms of service are ambiguous about use case
7. Service requires corporate email domain (not available)
8. Any security warnings or suspicious activity alerts

---

## COMPLETION CHECKLIST

Before finalizing the procurement report, verify:

- [ ] All Priority Tier 1 APIs attempted (DataForSEO, Apollo, Wappalyzer)
- [ ] All Priority Tier 2 APIs attempted (Coresignal, Bright Data, NewsAPI)
- [ ] Environment variables file generated for successful APIs
- [ ] Rate limits documented for each API
- [ ] Test requests made for each successful API
- [ ] Cost summary calculated
- [ ] APIs requiring human follow-up clearly flagged with next steps
- [ ] Contact information saved for follow-up (sales emails, support links)
- [ ] Passwords used are strong and documented (if needed for later)
- [ ] Billing alerts recommended for each service
- [ ] All errors encountered are documented with troubleshooting attempted

---

## POST-PROCUREMENT VERIFICATION SCRIPT

After receiving the credentials from the agent, run this verification script:

```bash
#!/bin/bash

# API Verification Script
# Tests each API to ensure credentials are valid

echo "Testing DataForSEO..."
curl -u "$DATAFORSEO_LOGIN:$DATAFORSEO_PASSWORD" \
  "https://api.dataforseo.com/v3/dataforseo_labs/google/domain_rank_overview/live" \
  -H "Content-Type: application/json" \
  -d '[{"target": "example.com"}]'

echo "\nTesting Apollo.io..."
curl -X GET "https://api.apollo.io/v1/organizations/search?q_organization_name=OpenAI" \
  -H "x-api-key: $APOLLO_API_KEY"

echo "\nTesting Wappalyzer..."
curl "https://api.wappalyzer.com/v2/lookup/?urls=anthropic.com" \
  -H "x-api-key: $WAPPALYZER_API_KEY"

echo "\nTesting NewsAPI.ai..."
curl "https://newsapi.ai/api/v1/article/getArticles" \
  -H "Authorization: Bearer $NEWSAPI_AI_KEY" \
  -d '{
    "query": {
      "keyword": "OpenAI"
    }
  }'

echo "\nTesting FMP..."
curl "https://financialmodelingprep.com/api/v3/profile/AAPL?apikey=$FMP_API_KEY"

echo "\nAll tests complete. Review responses above for errors."
```

---

**END OF AGENTIC BROWSER PROCUREMENT PROMPT**

This prompt should be provided to an agentic browser tool (Claude with browser tools, Browserbase agent, or similar) along with the user's:
- Email address for signups
- Payment method details
- Company information

The agent will attempt to automate as much as possible and flag items that require human interaction.
