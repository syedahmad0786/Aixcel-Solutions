# Opportunity Alerts — n8n Workflow Setup Guide

## Quick Overview

This workflow monitors 14 free sources every 5 minutes for freelance/B2B opportunities relevant to your AI automation agency, filters them with AI, deduplicates them, and sends you a clean Gmail alert for each match.

**Pipeline:** Trigger (5 min) → 14 Sources in parallel → Normalize & Tag → Deduplicate (static data) → AI Score with Groq → Format HTML → Gmail Alert

---

## Step 1: Import the Workflow

### Option A — Import via n8n UI
1. Open your n8n instance
2. Go to **Workflows** → **Import from File**
3. Select `n8n-opportunity-alerts-workflow.json`
4. The workflow will appear with all 39 nodes laid out

### Option B — Import via n8n API
```bash
curl -X POST "https://YOUR_N8N_URL/api/v1/workflows" \
  -H "X-N8N-API-KEY: YOUR_N8N_API_KEY" \
  -H "Content-Type: application/json" \
  -d @n8n-opportunity-alerts-workflow.json
```

---

## Step 2: Get a Free Groq API Key

1. Go to [https://console.groq.com](https://console.groq.com)
2. Sign up for a free account (no credit card needed)
3. Navigate to **API Keys** → **Create API Key**
4. Copy the key (starts with `gsk_...`)
5. In the workflow, open the **"AI Relevance Filter (Groq)"** Code node
6. Replace `YOUR_GROQ_API_KEY` on line 12 with your actual key

**Free tier limits:** ~30 requests/minute, ~14,400 requests/day. The workflow includes a 2-second delay between calls to stay well within limits.

---

## Step 3: Set Up Gmail OAuth2

1. In n8n, go to **Settings** → **Credentials** → **Add Credential**
2. Search for **Gmail OAuth2**
3. Click **Create** and follow the OAuth flow to connect your Google account
4. You'll need to enable the Gmail API in Google Cloud Console if not already done
5. After connecting, open the **"Send Gmail Alert"** node in the workflow
6. Select your Gmail OAuth2 credential from the dropdown
7. Replace `YOUR_EMAIL@gmail.com` with your actual email address

---

## Step 4: Set Up Google Alerts RSS Feeds

1. Go to [https://www.google.com/alerts](https://www.google.com/alerts)
2. Create alerts for these search terms (one alert per term):
   - `"hire AI automation"`
   - `"looking for n8n developer"`
   - `"need GoHighLevel expert"`
   - `"AI chatbot developer needed"`
   - `"workflow automation freelancer"`
3. For each alert, click **Show options**:
   - **How often:** As-it-happens
   - **Sources:** Automatic
   - **Deliver to:** **RSS feed** (not email!)
4. After creating, click the RSS icon next to each alert to get the feed URL
5. The URL looks like: `https://www.google.com/alerts/feeds/XXXXX/YYYYY`
6. Open the **"Google Alerts RSS"** node and paste your feed URL

> **Tip:** To monitor multiple Google Alerts, duplicate the "Google Alerts RSS" node and "Tag: Google Alerts" node for each feed URL, and connect them to the Deduplicate node.

---

## Step 5: Configure Placeholder Sources

### Craigslist
1. Open the **"Craigslist (Placeholder)"** node
2. Replace `YOURCITY` in the URL with your city subdomain:
   - New York: `newyork.craigslist.org`
   - Los Angeles: `losangeles.craigslist.org`
   - Chicago: `chicago.craigslist.org`
   - etc.
3. Full example URL: `https://newyork.craigslist.org/search/cpg?format=rss&query=AI+automation`

### Freelancer.com
The Freelancer.com API node works out of the box with public project data. For higher rate limits, you can optionally add a Freelancer API key.

---

## Step 6: Activate the Workflow

1. Review all nodes — check for any red error indicators
2. Click **Execute Workflow** to do a manual test run
3. If everything works, toggle the workflow to **Active** (top-right switch)
4. The workflow will now run automatically every 5 minutes

---

## Architecture Notes

### How Deduplication Works
- Uses n8n's `$getWorkflowStaticData('global')` to persist seen URLs across executions
- Each item's URL is checked against the seen list
- New URLs are added; duplicates are skipped
- The list is capped at the 500 most recent entries to prevent memory bloat
- Static data persists as long as the workflow exists (survives restarts)

### How AI Filtering Works
- Each new item's title + description is sent to Groq's `llama3-70b-8192` model
- The AI returns a JSON object: `{ "relevant": true/false, "score": 1-10, "reason": "..." }`
- Only items where `relevant === true` AND `score >= 6` pass through
- The AI is prompted with your specific services and target client types
- 2-second delay between calls prevents rate limiting

### Error Handling
- All RSS/HTTP source nodes have `onError: "continueRegularOutput"` so one failing source doesn't break the pipeline
- The Groq API Code node has try/catch per item — failed API calls are skipped silently
- Empty/malformed items are filtered out in the Deduplicate node
- If no relevant items are found, the pipeline stops gracefully (no empty emails)

---

## Customization Tips

### Adjust Relevance Threshold
In the **"AI Relevance Filter (Groq)"** Code node, change the score threshold:
```javascript
// Currently: score >= 6
if (parsed.relevant === true && (parsed.score || 0) >= 6) {
// Change to 7 for stricter filtering, or 5 for more results
```

### Add More Sources
1. Add a new RSS Feed Read node
2. Add a new Set (Tag) node to normalize the output
3. Connect: Trigger → New RSS → New Tag → Deduplicate
4. The Tag node should set: title, description, link, source (your label), pubDate

### Change Scan Frequency
Open the **"Every 5 Minutes"** trigger node and adjust the interval. Be mindful of Groq API rate limits if you scan more frequently.

### Modify the AI Prompt
In the **"AI Relevance Filter (Groq)"** Code node, edit the `SYSTEM_PROMPT` constant to match your specific services, niche, or target audience.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Groq API returns errors | Check your API key is correct and you haven't hit rate limits |
| Gmail node fails | Re-authenticate your Gmail OAuth2 credential in n8n settings |
| Reddit RSS returns empty | Reddit may rate-limit RSS requests — this is normal, items will appear on next run |
| No emails being sent | Check the execution log — items may all be duplicates (already seen) or scored below 6 |
| "require is not defined" error | Your n8n instance may restrict Code node access. Set `NODE_FUNCTION_ALLOW_BUILTIN=*` in your n8n environment variables |
| Too many emails | Raise the score threshold from 6 to 7 or 8 in the AI Filter node |

---

## Credentials Summary

| Credential | Type | Where to Get It |
|-----------|------|----------------|
| Groq API Key | Pasted directly in Code node | [console.groq.com](https://console.groq.com) — free |
| Gmail OAuth2 | n8n credential (OAuth flow) | n8n Settings → Credentials → Gmail OAuth2 |
| Freelancer.com API | Optional (works without) | [developers.freelancer.com](https://developers.freelancer.com) |
