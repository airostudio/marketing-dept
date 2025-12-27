# Marketing Department Backend

Real AI agent orchestration system powered by OpenAI GPT-4 Turbo, GPT-3.5 Turbo, and DeepSeek.

## Features

- ✅ **Intelligent Routing**: Scotty analyzes requests and routes to appropriate agents based on keywords
- ✅ **15 AI Agents**: World-class specialists in content, email, ads, SEO, analytics, and more
- ✅ **Multi-Agent Coordination**: EA Agent synthesizes outputs from multiple agents
- ✅ **Real AI Integration**: OpenAI and DeepSeek APIs for actual content generation
- ✅ **Expert System Prompts**: 200-400+ line prompts with 7-15+ years expertise per agent
- ✅ **REST API**: Complete API for task submission, status tracking, and deliverables

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure API Keys

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
OPENAI_API_KEY=sk-your-actual-key-here
DEEPSEEK_API_KEY=your-actual-key-here
PORT=3000
```

**Get API Keys:**
- OpenAI: https://platform.openai.com/api-keys
- DeepSeek: https://platform.deepseek.com/api_keys

### 3. Start Server

```bash
node server.js
```

Server will start on http://localhost:3000

### 4. Test Health Endpoint

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "message": "Marketing Department Backend is running",
  "openai": true,
  "deepseek": true
}
```

## API Endpoints

### Health Check
```
GET /api/health
```

### Get All Agents
```
GET /api/agents
```

### Submit Task
```
POST /api/tasks
Body: {
  "description": "Write a blog post about AI marketing trends",
  "priority": "medium"
}
```

### Get Task Status
```
GET /api/tasks/:taskId
```

### Get Task Activities (Live Feed)
```
GET /api/tasks/:taskId/activities
```

### Get Deliverable
```
GET /api/deliverables/:deliverableId
```

### Get All Deliverables
```
GET /api/deliverables
```

## Agent Model Allocation

### Premium (GPT-4 Turbo)
- Marcus Hayes - Content Strategist
- Robert Davis - Revenue Intelligence Analyst
- Oscar Wright - Marketing Operations Coordinator
- Scotty - Orchestrator
- EA Agent - Multi-Agent Coordinator

### Mid-Tier (GPT-3.5 Turbo)
- Alex Rodriguez - Social Advertising Specialist
- Victor Stone - Video Marketing Producer
- Emma Wilson - Email Marketing Specialist
- Natalie Brooks - Influencer Marketing Manager
- Ava Martinez - ABM Specialist
- Maya Patel - Personalization Engineer

### Budget (DeepSeek)
- Sarah Chen - Lead Generation Specialist
- Ryan Mitchell - SEO Specialist
- David Kim - Analytics Director
- Nathan Cross - Competitive Intelligence Analyst
- Oliver Grant - CRO Specialist
- Sophie Anderson - Customer Support Lead

## Example Requests

### Single-Agent Task (Content)
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"description": "Write a blog post about AI marketing trends in 2025"}'
```

**Routes to:** Marcus Hayes (Content Strategist)

### Multi-Agent Project (Campaign)
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"description": "Launch a product campaign for our new AI tool targeting enterprise marketing teams"}'
```

**Routes to:** Marcus, Emma, Alex, Sarah (4 agents)
**Synthesis:** EA Agent creates comprehensive campaign package

### Lead Generation Task
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"description": "Build a cold email sequence for enterprise SaaS prospects"}'
```

**Routes to:** Sarah Chen (Lead Generation Specialist)

## Architecture

```
USER REQUEST
     ↓
SCOTTY (Intelligent Router)
     ↓
AGENTS (Execute in Parallel)
     ↓
EA AGENT (Synthesizes Multi-Agent Outputs)
     ↓
DELIVERABLE (Final Output)
```

## Intelligent Routing Keywords

Scotty analyzes requests using marketing/sales keywords:

- **blog, article, whitepaper** → Marcus Hayes
- **email, newsletter, drip campaign** → Emma Wilson
- **ads, linkedin ads, facebook ads** → Alex Rodriguez
- **lead gen, cold email, prospecting** → Sarah Chen
- **seo, keyword research, rankings** → Ryan Mitchell
- **video, youtube, tiktok** → Victor Stone
- **analytics, dashboard, reporting** → David Kim
- **campaign, launch** → Multi-agent (Marcus, Emma, Alex, Sarah)

See full keyword library in `/SCOTTY-ORCHESTRATOR-SYSTEM.md`

## Cost Estimates

Based on average task complexity:

- **Single-Agent Task**: $0.15 - $0.50 per task
- **Multi-Agent Project**: $1.00 - $3.00 per project
- **Monthly (100 tasks)**: $50 - $200/month

**Compare to:**
- B2B Rocket: $2,450/month for 5 agents
- Marketing Department: $50-200/month for 15 agents (93% savings)

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | OpenAI API key for GPT-4 and GPT-3.5 |
| `DEEPSEEK_API_KEY` | Yes | DeepSeek API key for budget agents |
| `PORT` | No | Server port (default: 3000) |

## Troubleshooting

### "OpenAI API Error"
- Check your API key is valid and has credits
- Verify key is in `.env` file as `OPENAI_API_KEY`

### "DeepSeek API Error"
- Check your DeepSeek API key is valid
- Verify key is in `.env` file as `DEEPSEEK_API_KEY`

### Agent not loading prompt
- Check `/config/agent-system-prompts-production.json` exists
- Verify JSON is valid

### Task stuck in "analyzing" status
- Check server logs for errors
- Verify API keys are configured
- Check network connectivity

## Development

### Add New Agent

1. Add to `agents` object in `server.js`:
```javascript
'new-agent': {
  name: 'Agent Name',
  role: 'Agent Role',
  model: 'gpt-3.5-turbo',
  provider: 'openai',
  temperature: 0.7,
  maxTokens: 2000
}
```

2. Add routing keywords in `routeTask()` function

3. Add system prompt to `/config/agent-system-prompts-production.json`

### Testing

```bash
# Test health
curl http://localhost:3000/api/health

# Test agent list
curl http://localhost:3000/api/agents

# Submit test task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"description": "Test task"}'
```

## Production Deployment

For production use:

1. **Add Database**: Replace in-memory storage with PostgreSQL/MongoDB
2. **Add Redis**: Implement Bull queue for background processing
3. **Add File Storage**: S3 for deliverable storage
4. **Add Authentication**: Protect API with JWT tokens
5. **Add Rate Limiting**: Prevent API abuse
6. **Add Logging**: Winston or Bunyan for structured logging
7. **Add Monitoring**: Sentry for error tracking
8. **Environment**: Use PM2 or Docker for process management

## Support

For issues or questions:
- Check `/REAL-AI-WORKFLOW.md` for architecture details
- Check `/SCOTTY-ORCHESTRATOR-SYSTEM.md` for routing logic
- Check `/EA-AGENT-SYSTEM.md` for multi-agent coordination

## License

Proprietary - The Marketing Department
