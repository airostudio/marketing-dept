# Error Handling Guide

The Marketing Department AI system includes comprehensive error handling to gracefully handle any issues and guide users to solutions.

## Error Types & Solutions

### 1. Backend Server Not Running

**What you'll see:**
```
⚠️ Backend Server Not Running
The AI agent backend server is not responding.
The system needs the backend to process tasks.
```

**What it means:** The Node.js backend server isn't started.

**How to fix:**
```bash
# Terminal
cd backend
npm install  # First time only
node server.js
```

**Visual feedback:**
- Red error banner (top right)
- Error message in activity feed
- Actionable buttons: "View Setup Guide" | "Retry Connection"

---

### 2. API Keys Not Configured

**What you'll see:**
```
⚠️ API Keys Not Configured
OpenAI or DeepSeek API keys are missing.
The agents need these keys to generate content.
```

**What it means:** The `.env` file doesn't have API keys.

**How to fix:**
1. Get API keys:
   - OpenAI: https://platform.openai.com/api-keys
   - DeepSeek: https://platform.deepseek.com/api_keys

2. Add to `backend/.env`:
   ```env
   OPENAI_API_KEY=sk-your-key-here
   DEEPSEEK_API_KEY=your-key-here
   ```

3. Restart backend server:
   ```bash
   # Stop server (Ctrl+C)
   node server.js
   ```

**Visual feedback:**
- Warning in activity feed on page load
- "Setup API Keys" button shows step-by-step guide
- "View Documentation" button opens setup docs

---

### 3. Invalid or Expired API Keys

**What you'll see:**
```
⚠️ Invalid API Keys
One or more API keys are invalid or expired.
Please check your API keys and account status.
```

**What it means:** API keys are wrong or expired.

**How to fix:**
1. Verify API keys are correct (no extra spaces)
2. Check API key is active:
   - OpenAI: https://platform.openai.com/api-keys
   - DeepSeek: https://platform.deepseek.com/api_keys
3. Generate new API key if needed
4. Update `backend/.env`
5. Restart backend server

**Visual feedback:**
- "Update API Keys" button shows setup guide
- "Check Billing" button opens billing page
- Detailed error in activity feed

---

### 4. Rate Limit Exceeded

**What you'll see:**
```
⚠️ Rate Limit Reached
API rate limit exceeded. This usually means too many
requests in a short time. Please wait a moment.
```

**What it means:** Too many requests to OpenAI/DeepSeek API.

**How to fix:**
- Wait 1-5 minutes before retrying
- Check if you have too many concurrent tasks
- Upgrade API plan if hitting limits frequently

**Visual feedback:**
- "Wait 1 Minute" button starts countdown timer
- "Check Usage" button opens billing dashboard
- Retry automatically after 60 seconds

---

### 5. Insufficient Credits/Quota

**What you'll see:**
```
⚠️ Account Issue
OpenAI account has insufficient credits.
Please add credits at [billing link].
```

**What it means:** API account is out of credits.

**How to fix:**
1. Go to billing dashboard:
   - OpenAI: https://platform.openai.com/account/billing
   - DeepSeek: https://platform.deepseek.com
2. Add payment method or credits
3. Wait a few minutes for update
4. Retry task

**Visual feedback:**
- Direct link to add credits
- Clear explanation of billing issue
- Retry button after adding credits

---

### 6. Task Processing Failed

**What you'll see:**
```
⚠️ Task Processing Failed
The AI agents encountered an error while processing
your task. This could be due to API issues or invalid input.
```

**What it means:** Something went wrong during task execution.

**How to fix:**
1. Check error details in activity feed
2. Verify task description is clear
3. Try again with simpler request
4. Check backend logs for technical details

**Visual feedback:**
- "Try Again" button to retry
- "Modify Request" button closes error, ready for new task
- Specific agent error shown in activity feed

---

### 7. Network Connection Error

**What you'll see:**
```
⚠️ Network Connection Error
Unable to connect to the backend server.
Please check your internet connection.
```

**What it means:** Network issues between frontend and backend.

**How to fix:**
1. Check internet connection
2. Verify backend is running on port 3000
3. Check firewall isn't blocking localhost:3000
4. Restart backend server

**Visual feedback:**
- "Retry" button tests connection
- "Check Connection" button for guidance
- Automatic retry after 5 failed polls

---

## Error UI Components

### Error Banner (Top Right)
- **Appearance:** Animated slide-in from right
- **Duration:** 30 seconds (auto-dismiss)
- **Dismissible:** Click X to close
- **Actions:** 1-2 actionable buttons per error
- **Details:** Technical error details in code block

### Activity Feed Errors
- **Error items:** Red left border, light red background
- **Warning items:** Orange left border, light orange background
- **Icons:** ❌ for errors, ⚠️ for warnings
- **Timestamp:** When error occurred
- **Message:** User-friendly explanation

### Loading Overlay
- **Appearance:** Full-screen semi-transparent overlay
- **Spinner:** Purple gradient spinner
- **When shown:**
  - Submitting task
  - Fetching deliverable
  - During API calls

---

## Error Handling Flow

```
USER ACTION
    ↓
TRY API CALL
    ↓
SUCCESS? → Continue processing
    ↓ NO
CATCH ERROR
    ↓
DETERMINE ERROR TYPE
    ↓
SHOW ERROR BANNER
    ↓
LOG TO ACTIVITY FEED
    ↓
PROVIDE ACTIONABLE BUTTONS
    ↓
USER CLICKS BUTTON
    ↓
EXECUTE ACTION
    ↓
GUIDE USER TO SOLUTION
```

---

## Testing Error Handling

### Test Backend Offline
```bash
# Don't start backend
# Open task-center.html
# Submit task

Expected: "Backend Server Not Running" error
```

### Test Missing API Keys
```bash
# Edit backend/.env
# Remove API keys
OPENAI_API_KEY=
DEEPSEEK_API_KEY=

# Start backend
node server.js

# Submit task

Expected: "API Keys Not Configured" error
```

### Test Invalid API Key
```bash
# Edit backend/.env
OPENAI_API_KEY=sk-invalid-key

# Restart backend
# Submit task

Expected: "Invalid API Keys" error with 401 status
```

### Test Rate Limit
```bash
# Submit 50+ tasks rapidly

Expected: "Rate Limit Reached" error
```

---

## Developer Notes

### Adding New Error Types

1. **Define error type** in `ErrorTypes`:
```javascript
const ErrorTypes = {
    YOUR_ERROR: 'your_error'
};
```

2. **Add error message** in `ErrorMessages`:
```javascript
[ErrorTypes.YOUR_ERROR]: {
    title: 'Clear Title',
    message: 'User-friendly explanation',
    actions: [
        { text: '🔧 Action Text', action: 'actionName' }
    ]
}
```

3. **Handle action** in `handleErrorAction()`:
```javascript
case 'actionName':
    // Your action code
    break;
```

4. **Trigger error** where needed:
```javascript
showErrorBanner(ErrorTypes.YOUR_ERROR, 'Optional details');
```

---

## Error Logging

**Frontend Console:**
```javascript
console.error('Task submission error:', error);
// Shows in browser DevTools console
```

**Backend Logs:**
```javascript
console.error('❌ Task ${taskId} failed:', errorMessage);
// Shows in terminal where backend runs
```

**Activity Feed:**
- All errors visible to user
- Timestamped for debugging
- Color-coded by severity

---

## Best Practices

1. **Always show errors to user** - No silent failures
2. **Provide actionable steps** - Tell user what to do next
3. **Include links** - Direct links to fix issues
4. **Auto-dismiss** - Don't block UI permanently
5. **Log everything** - Console + activity feed + backend logs
6. **Graceful degradation** - Continue what's possible
7. **Retry logic** - Automatic retry for transient errors
8. **Clear language** - No technical jargon in UI

---

## Common Issues & Solutions

### "Cannot connect to backend"
- Backend not started → `cd backend && node server.js`
- Wrong port → Check backend uses port 3000
- Firewall → Allow localhost:3000

### "API key invalid"
- Copy/paste error → No extra spaces
- Wrong key → Verify from API dashboard
- Expired → Generate new key

### "Rate limit"
- Too many requests → Wait 1-5 minutes
- Upgrade plan → Higher rate limits
- Batch requests → Fewer API calls

### "Task failed"
- Check logs → Backend terminal output
- Simplify request → Test with simple task
- Verify agents → Check agent prompts loaded

---

## Error Statistics

**Tracked Metrics:**
- Error type frequency
- Time to resolution
- User actions taken
- Success rate after retry

**Monitoring:**
- Check backend terminal for errors
- Review activity feed for patterns
- Monitor API usage for rate limits

---

## Support

If errors persist:

1. **Check logs:**
   - Browser console (F12)
   - Backend terminal
   - Activity feed

2. **Verify setup:**
   - API keys correct
   - Backend running
   - Dependencies installed

3. **Review docs:**
   - QUICK-START.md
   - backend/README.md
   - This file

4. **Common fixes:**
   - Restart backend
   - Clear browser cache
   - Regenerate API keys
   - Check firewall

---

**Error handling is your friend - every error message is a guide to the solution!** 🎯
