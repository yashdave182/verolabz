# 🔑 Add Environment Variables to Vercel - Visual Guide

## ⚠️ CRITICAL: Use EXACT Variable Names

```
UNSTRACT_API_KEY    ← Copy this exactly (uppercase, underscores)
GEMINI_API_KEY      ← Copy this exactly (uppercase, underscores)
```

**DO NOT USE:**
- ❌ unstract-api-key (lowercase with dashes)
- ❌ @unstract-api-key (with @ prefix)
- ❌ UnstractApiKey (camelCase)

---

## 📍 Step-by-Step Visual Guide

### Step 1: Open Vercel Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  https://vercel.com/dashboard                               │
└─────────────────────────────────────────────────────────────┘
```

1. Log in to Vercel
2. You'll see your projects list

---

### Step 2: Select Your Project

```
┌─────────────────────────────────────────────────────────────┐
│  My Projects                                                │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  document-tweaker                                    │  │
│  │  ← Click on your project name                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

### Step 3: Go to Settings

```
┌─────────────────────────────────────────────────────────────┐
│  document-tweaker                                           │
│                                                             │
│  [Overview] [Deployments] [Analytics] [Settings] ← Click   │
└─────────────────────────────────────────────────────────────┘
```

Click the **"Settings"** tab at the top

---

### Step 4: Click Environment Variables

```
┌─────────────────────────────────────────────────────────────┐
│  Settings                                                   │
│                                                             │
│  Sidebar Menu:                                              │
│  • General                                                  │
│  • Domains                                                  │
│  • Environment Variables  ← Click this                      │
│  • Git                                                      │
│  • Functions                                                │
└─────────────────────────────────────────────────────────────┘
```

In the left sidebar, click **"Environment Variables"**

---

### Step 5: Add First Variable (Unstract)

```
┌─────────────────────────────────────────────────────────────┐
│  Environment Variables                                      │
│                                                             │
│  [+ Add New Variable]  ← Click this button                 │
└─────────────────────────────────────────────────────────────┘
```

Click **"+ Add New Variable"** or similar button

---

### Step 6: Fill in Variable Details (Unstract)

```
┌─────────────────────────────────────────────────────────────┐
│  Add Environment Variable                                   │
│                                                             │
│  Name:                                                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ UNSTRACT_API_KEY                                     │  │
│  │ ↑ Type this EXACTLY (uppercase, underscores)        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  Value:                                                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ sk-abc123xyz456...                                   │  │
│  │ ↑ Paste your actual Unstract API key here           │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  Environment:                                               │
│  ☑ Production                                               │
│  ☑ Preview                                                  │
│  ☑ Development                                              │
│  ↑ Check ALL THREE boxes                                   │
│                                                             │
│  [Save] ← Click to save                                    │
└─────────────────────────────────────────────────────────────┘
```

**Enter:**
- **Name:** `UNSTRACT_API_KEY` (copy exactly)
- **Value:** Your actual Unstract API key (from https://unstract.com/)
- **Environment:** Check all three boxes ☑☑☑
- Click **"Save"**

---

### Step 7: Add Second Variable (Gemini)

```
┌─────────────────────────────────────────────────────────────┐
│  Environment Variables                                      │
│                                                             │
│  Current Variables:                                         │
│  • UNSTRACT_API_KEY                           ✓ Saved      │
│                                                             │
│  [+ Add New Variable]  ← Click again for 2nd variable      │
└─────────────────────────────────────────────────────────────┘
```

Click **"+ Add New Variable"** again

---

### Step 8: Fill in Variable Details (Gemini)

```
┌─────────────────────────────────────────────────────────────┐
│  Add Environment Variable                                   │
│                                                             │
│  Name:                                                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ GEMINI_API_KEY                                       │  │
│  │ ↑ Type this EXACTLY (uppercase, underscores)        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  Value:                                                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ AIzaSyABC123XYZ...                                   │  │
│  │ ↑ Paste your actual Gemini API key here             │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  Environment:                                               │
│  ☑ Production                                               │
│  ☑ Preview                                                  │
│  ☑ Development                                              │
│  ↑ Check ALL THREE boxes                                   │
│                                                             │
│  [Save] ← Click to save                                    │
└─────────────────────────────────────────────────────────────┘
```

**Enter:**
- **Name:** `GEMINI_API_KEY` (copy exactly)
- **Value:** Your actual Gemini API key (from https://makersuite.google.com/app/apikey)
- **Environment:** Check all three boxes ☑☑☑
- Click **"Save"**

---

### Step 9: Verify Variables Are Saved

```
┌─────────────────────────────────────────────────────────────┐
│  Environment Variables                                      │
│                                                             │
│  Production     Preview     Development                     │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ UNSTRACT_API_KEY           sk-abc...    ✓ ✓ ✓       │  │
│  │ [Edit] [Delete]                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ GEMINI_API_KEY             AIzaSy...    ✓ ✓ ✓       │  │
│  │ [Edit] [Delete]                                      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

You should see:
- ✅ Both variables listed
- ✅ Checkmarks (✓) for all three environments
- ✅ Partial values shown (for security)

---

### Step 10: Redeploy Application

```
┌─────────────────────────────────────────────────────────────┐
│  Go to: Deployments tab (top of page)                      │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Latest Deployment                                   │  │
│  │  Status: Ready                                       │  │
│  │  [...]  ← Click three dots menu                      │  │
│  │     └─→ Redeploy  ← Click this                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Steps:**
1. Click **"Deployments"** tab at top
2. Find latest deployment
3. Click **"..."** (three dots menu)
4. Click **"Redeploy"**
5. Confirm when asked
6. Wait 2-3 minutes

---

## ✅ Step 11: Test Configuration

### Test Health Endpoint

Visit this URL (replace with your actual URL):
```
https://your-app-name.vercel.app/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00",
  "unstract_configured": true,    ← Should be TRUE
  "gemini_configured": true,      ← Should be TRUE
  "environment": "vercel"
}
```

**If both show `true`:** ✅ **Success! Variables configured correctly!**

**If they show `false`:** ❌ **Problem - check variable names and redeploy**

---

## 🎯 Quick Reference Card

**Copy this for quick reference:**

```
VARIABLE 1:
Name:  UNSTRACT_API_KEY
Value: [Your key from https://unstract.com/]
Env:   ☑ Production ☑ Preview ☑ Development

VARIABLE 2:
Name:  GEMINI_API_KEY
Value: [Your key from https://makersuite.google.com/app/apikey]
Env:   ☑ Production ☑ Preview ☑ Development
```

---

## ❌ Common Mistakes

### Mistake 1: Wrong Variable Name
```
❌ unstract-api-key    (lowercase with dashes)
❌ UnstractApiKey      (camelCase)
❌ UNSTRACT API KEY    (spaces)
✅ UNSTRACT_API_KEY    (CORRECT!)
```

### Mistake 2: Forgot to Check All Environments
```
❌ ☑ Production only
❌ ☐ Preview
❌ ☐ Development
   
✅ ☑ Production
✅ ☑ Preview
✅ ☑ Development
```

### Mistake 3: Added Quotes Around Value
```
❌ "sk-abc123xyz"     (with quotes)
✅ sk-abc123xyz       (no quotes - just paste the key)
```

### Mistake 4: Forgot to Redeploy
```
Added variables → Must redeploy for them to take effect!
```

---

## 🔍 Troubleshooting

### Problem: Variables show as "false" in health check

**Solution:**
1. Go back to Vercel Dashboard → Settings → Environment Variables
2. Verify names are EXACTLY: `UNSTRACT_API_KEY` and `GEMINI_API_KEY`
3. Check all three environment boxes are checked
4. Click Edit → Save again if needed
5. Redeploy application
6. Wait 2-3 minutes
7. Test health endpoint again

### Problem: Can't find Environment Variables section

**Solution:**
1. Make sure you're in Settings tab (not Overview)
2. Look in left sidebar
3. Should be between "Domains" and "Git"
4. If still missing, you might need project owner permissions

### Problem: Variables not taking effect

**Solution:**
1. Verify you clicked "Save" for each variable
2. Redeploy is REQUIRED after adding variables
3. Clear browser cache
4. Wait a few minutes after redeployment

---

## 📝 Final Checklist

After completing all steps:

- [ ] Added `UNSTRACT_API_KEY` with exact name
- [ ] Added `GEMINI_API_KEY` with exact name
- [ ] Checked all three environments for both variables
- [ ] Clicked "Save" for each variable
- [ ] Redeployed application
- [ ] Waited for redeployment to complete
- [ ] Tested `/api/health` endpoint
- [ ] Both `configured` fields show `true`
- [ ] Frontend loads and shows green "Backend Ready" badge

**All checked?** ✅ **You're ready to use the app!**

---

## 🆘 Still Having Issues?

1. **Double-check variable names:** Must be EXACTLY as shown (uppercase with underscores)
2. **Check API keys are valid:** Test them on the provider websites
3. **View logs:** Vercel Dashboard → Functions → Click function → View logs
4. **Ask for help:** See `VERCEL_ERRORS_FIX.txt` for more solutions

---

**Remember:** Environment variable names are CASE-SENSITIVE and must match exactly!

```
✅ UNSTRACT_API_KEY
✅ GEMINI_API_KEY
```

**These are the ONLY correct names to use!**