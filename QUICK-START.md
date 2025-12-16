# Quick Start Guide - Marketing Department AI System

Get your fully functional AI marketing department running in 5 minutes.

## What You're Getting

- ✅ **15 AI Specialists**: World-class agents for content, email, ads, SEO, analytics, and more
- ✅ **Scotty Orchestrator**: Intelligent routing based on marketing/sales keywords
- ✅ **EA Agent**: Multi-agent coordination and synthesis
- ✅ **Real AI**: Powered by OpenAI GPT-4, GPT-3.5, and DeepSeek
- ✅ **Live Dashboard**: Watch your AI team work in real-time
- ✅ **93% Cheaper**: $50-200/month vs competitors at $2,450/month

## Step 1: Get API Keys (5 minutes)

### OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy your key (starts with `sk-...`)
5. **Cost**: ~$0.15-0.50 per task | ~$50-150/month for 100-300 tasks

### DeepSeek API Key
1. Go to https://platform.deepseek.com/api_keys
2. Sign up or log in
3. Create a new API key
4. Copy your key
5. **Cost**: ~$0.05-0.15 per task | ~$15-50/month for 100-300 tasks

**Total Monthly Cost**: $65-200/month (vs B2B Rocket $2,450/month)

## Step 2: Install & Configure (2 minutes)

### Install Dependencies
```bash
cd backend
npm install
```

### Configure API Keys
```bash
# Copy example env file
cp .env.example .env

# Edit .env file
nano .env
```

Add your API keys:
```env
OPENAI_API_KEY=sk-your-actual-openai-key-here
DEEPSEEK_API_KEY=your-actual-deepseek-key-here
PORT=3000
```

Save and exit (Ctrl+X, Y, Enter)

## Step 3: Start the System (30 seconds)

### Terminal 1: Start Backend
```bash
cd backend
node server.js
```

You should see:
```
🚀 Marketing Department Backend running on port 3000
📡 API available at http://localhost:3000/api
🔑 OpenAI API Key: ✅ Configured
🔑 DeepSeek API Key: ✅ Configured
```

### Terminal 2: Open Frontend
```bash
# Open the Task Center in your browser
open scotty/task-center.html

# Or manually navigate to:
# file:///path/to/marketing-dept/scotty/task-center.html
```

## Step 4: Test It! (2 minutes)

### Try Example Tasks

**Single-Agent Task (Content):**
```
Write a blog post about AI marketing trends in 2025
```
→ Routes to Marcus Hayes (GPT-4 Turbo)
→ Cost: ~$0.30
→ Time: 30-60 seconds

**Multi-Agent Project (Campaign):**
```
Launch a product campaign for our new AI tool targeting enterprise marketing teams
```
→ Routes to 4 agents: Marcus, Emma, Alex, Sarah
→ EA Agent synthesizes all outputs
→ Cost: ~$2.00
→ Time: 2-3 minutes

**Lead Generation:**
```
Build a cold email sequence for enterprise SaaS prospects
```
→ Routes to Sarah Chen (DeepSeek)
→ Cost: ~$0.10
→ Time: 20-30 seconds

## What Happens Behind the Scenes

```
1. YOU: Submit task via Task Center
   ↓
2. SCOTTY: Analyzes keywords & routes to appropriate agent(s)
   ↓
3. AGENTS: Execute using OpenAI/DeepSeek APIs with expert prompts
   ↓
4. EA AGENT: (Multi-agent only) Synthesizes outputs into final deliverable
   ↓
5. YOU: Receive polished deliverable in Task Center
```

## Intelligent Routing Examples

| Task Keywords | Agent(s) Assigned | Model | Cost |
|---------------|-------------------|-------|------|
| "blog, article, whitepaper" | Marcus Hayes | GPT-4 Turbo | $0.30 |
| "email, newsletter, drip" | Emma Wilson | GPT-3.5 Turbo | $0.15 |
| "ads, linkedin, facebook" | Alex Rodriguez | GPT-3.5 Turbo | $0.15 |
| "lead gen, cold email" | Sarah Chen | DeepSeek | $0.08 |
| "seo, keywords, rankings" | Ryan Mitchell | DeepSeek | $0.08 |
| "video, youtube, tiktok" | Victor Stone | GPT-3.5 Turbo | $0.15 |
| "campaign, launch" | Marcus, Emma, Alex, Sarah | Mixed | $1.50 |

## Troubleshooting

### "Cannot connect to backend"
**Solution**: Make sure backend server is running
```bash
cd backend
node server.js
```

### "OpenAI API Error"
**Solutions**:
- Check API key is correct in `.env`
- Verify you have credits: https://platform.openai.com/account/billing
- Check API key permissions

### "DeepSeek API Error"
**Solutions**:
- Check API key is correct in `.env`
- Verify account is active: https://platform.deepseek.com

### "Task stuck in analyzing"
**Solutions**:
1. Open browser console (F12) to see errors
2. Check backend terminal for error logs
3. Verify API keys are configured correctly
4. Check internet connection

### "Deliverable not showing"
**Solutions**:
- Wait for task to complete (status shows "completed")
- Check backend logs for errors
- Refresh the page

## Next Steps

### 1. Customize Agent Prompts
Edit `/config/agent-system-prompts-production.json` to customize agent expertise and tone.

### 2. Add More Agents
See `/backend/README.md` for instructions on adding new specialist agents.

### 3. Production Deployment
For production use:
- Add database (PostgreSQL/MongoDB)
- Add file storage (AWS S3)
- Add authentication (JWT)
- Add monitoring (Sentry)
- See `/backend/README.md` for details

### 4. Explore Documentation
- `/REAL-AI-WORKFLOW.md` - Complete system architecture
- `/SCOTTY-ORCHESTRATOR-SYSTEM.md` - Routing logic and keywords
- `/EA-AGENT-SYSTEM.md` - Multi-agent coordination
- `/API-INTEGRATIONS.md` - 40+ API integrations available

## Cost Comparison

| Service | Agents | Monthly Cost | Cost per Agent |
|---------|--------|--------------|----------------|
| **Marketing Department** | 15 | $65-200 | $4-13 |
| B2B Rocket | 5 | $2,450 | $490 |
| Jasper AI | 1 | $99-500 | $99-500 |
| Copy.ai | 1 | $49-249 | $49-249 |

**You're saving 85-93%** with more capabilities.

## Example Use Cases

### Content Marketing
- Blog posts, whitepapers, case studies → Marcus Hayes
- SEO optimization → Ryan Mitchell
- Video scripts → Victor Stone

### Demand Generation
- Cold email sequences → Sarah Chen
- Email nurture campaigns → Emma Wilson
- LinkedIn/Facebook ads → Alex Rodriguez

### Analytics & Strategy
- Performance dashboards → David Kim
- Competitive analysis → Nathan Cross
- Revenue forecasting → Robert Davis

### Account-Based Marketing
- Enterprise ABM strategy → Ava Martinez
- Executive outreach → Sarah Chen
- Custom content → Marcus Hayes

### Full Campaigns (Multi-Agent)
- Product launches
- Market entry strategies
- Rebranding initiatives
- Quarterly marketing plans

## Support

**Issues or Questions?**
- Check the documentation in `/REAL-AI-WORKFLOW.md`
- Review routing keywords in `/SCOTTY-ORCHESTRATOR-SYSTEM.md`
- See API reference in `/backend/README.md`

## Success Metrics to Track

After 30 days of use, measure:
- **Time Saved**: How many hours of work delegated to AI?
- **Cost per Task**: Average cost per deliverable
- **Quality Score**: Rate deliverables 1-10
- **ROI**: Time saved × hourly rate ÷ monthly cost

**Expected Results**:
- 50-100 hours saved per month
- $0.15-0.50 per task average
- 8/10 quality score (with prompt refinement)
- 10-30x ROI

---

## Ready to Go? 🚀

1. ✅ Got API keys
2. ✅ Installed dependencies
3. ✅ Started backend
4. ✅ Opened Task Center
5. 🎯 Submit your first task!

**Your AI marketing department is now fully operational.**
