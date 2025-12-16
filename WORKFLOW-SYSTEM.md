# Marketing Department Workflow System

## 🎯 Complete Rebuild - January 2025

The marketing department workflow has been completely rebuilt with a fully functional AI-powered orchestration system. This is no longer a placeholder - every agent is a real AI expert with 7+ years of experience in their domain.

## 📋 Table of Contents

- [System Architecture](#system-architecture)
- [How It Works](#how-it-works)
- [Key Components](#key-components)
- [Usage](#usage)
- [Agents](#agents)
- [API Reference](#api-reference)
- [Examples](#examples)

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      USER SUBMITS TASK                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────┐
        │   SCOTTY AI ORCHESTRATOR    │
        │  (7+ years VP experience)   │
        │                             │
        │  • Analyzes task complexity │
        │  • Determines required      │
        │    agents (1 to 10+)        │
        │  • Creates execution plan   │
        │  • Assigns priorities       │
        └──────────────┬──────────────┘
                       │
                       ▼
        ┌──────────────────────────────────┐
        │    SPECIALIZED AGENTS (35+)      │
        │   Each with 7+ years expertise   │
        ├──────────────────────────────────┤
        │  • Content Strategist (Gemini)   │
        │  • Lead Gen Specialist (DeepSeek)│
        │  • Email Marketing (DeepSeek)    │
        │  • SEO Specialist (DeepSeek)     │
        │  • Analytics Director (DeepSeek) │
        │  • CRO Specialist (Gemini)       │
        │  • And 29 more...                │
        └──────────────┬───────────────────┘
                       │
                       ▼
        ┌─────────────────────────────┐
        │   EA (EXECUTIVE ASSISTANT)  │
        │  (7+ years EA experience)   │
        │                             │
        │  • Collates all outputs     │
        │  • Creates executive summary│
        │  • Formats deliverable      │
        │  • Adds recommendations     │
        │  • Outlines next steps      │
        └──────────────┬──────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │    FINAL DELIVERABLE         │
        │  Ready for presentation      │
        └──────────────────────────────┘
```

## 🔄 How It Works

### Step 1: Task Submission

Users submit any marketing task through:
- Web UI (React app)
- API call
- CLI interface
- Programmatic submission

**Example:**
```javascript
import { submitTask } from './services/marketingAPI';

const result = await submitTask(
  "Create a comprehensive Q1 2025 content strategy for B2B SaaS"
);
```

### Step 2: Scotty Analysis

Scotty (VP of Sales & Marketing) analyzes the task using AI:

```typescript
{
  complexity: "moderate",        // simple | moderate | complex | enterprise
  estimatedDuration: "2-3 days",
  requiredAgents: [
    "marcus-hayes",              // Content Strategist
    "sarah-chen",                // Lead Generation
    "david-kim"                  // Analytics Director
  ],
  executionStrategy: "sequential",  // parallel | sequential | hybrid
  estimatedCost: "$0.45"
}
```

### Step 3: Agent Execution

Agents work in parallel or sequential order based on Scotty's plan:

- **Marcus Hayes** (Content) creates strategy framework
- **Sarah Chen** (Lead Gen) identifies target audience
- **David Kim** (Analytics) sets up tracking

Each agent:
- Has access to previous agent outputs (context)
- Uses their specialized AI platform (Gemini or DeepSeek)
- Produces professional, actionable outputs
- Reports progress in real-time

### Step 4: EA Collation

The EA agent creates a professional deliverable:

```typescript
{
  executiveSummary: "2-3 paragraph overview",
  keyFindings: ["Finding 1", "Finding 2", ...],
  agentContributions: [
    {
      agentName: "Marcus Hayes",
      contribution: "Created content strategy...",
      highlights: ["12 blog topics", "SEO optimization", ...]
    }
  ],
  recommendations: ["Recommendation 1", ...],
  nextSteps: ["Step 1", "Step 2", ...],
  fullReport: "Complete formatted report..."
}
```

### Step 5: Delivery

Final deliverable is available in multiple formats:
- **Markdown** - For documentation
- **HTML** - For rich viewing
- **JSON** - For programmatic access
- **PDF** - For client presentation (future)

## 🔑 Key Components

### 1. Scotty Orchestrator (`scottyOrchestrator.ts`)

**Role:** Master task analyzer and agent coordinator

**Functions:**
- `analyzeTaskWithScotty()` - AI-powered task analysis
- `createOrchestrationPlan()` - Builds execution plan
- `calculateEstimatedCost()` - Cost estimation

**AI Model:** Google Gemini 2.0 Flash

### 2. EA Agent (`eaAgent.ts`)

**Role:** Executive deliverable preparation

**Functions:**
- `collateWithEA()` - Synthesizes agent outputs
- `formatDeliverableAsMarkdown()` - Export to Markdown
- `formatDeliverableAsHTML()` - Export to HTML
- `exportDeliverable()` - Multi-format export

**AI Model:** Google Gemini 2.0 Flash

### 3. Master Orchestrator (`masterOrchestrator.ts`)

**Role:** End-to-end workflow execution

**Functions:**
- `executeCompleteWorkflow()` - Full workflow execution
- `executeWorkflowSteps()` - Dependency-based execution
- `getExecutionSummary()` - Generate summary
- `exportWorkflowResults()` - Export results

### 4. Marketing API (`marketingAPI.ts`)

**Role:** Unified interface for task submission

**Functions:**
- `submitTask()` - Submit single task
- `submitBatch()` - Submit multiple tasks
- `getTaskStatus()` - Check task progress
- `getExecution()` - Get full execution details
- `exportResults()` - Export deliverables

### 5. Agent Executor (`taskExecutor.ts`)

**Role:** Execute individual agent tasks

**Functions:**
- `executeTask()` - Execute agent task with AI
- Routes to Gemini or DeepSeek based on agent
- Handles context from previous agents
- Manages fallback execution

## 🚀 Usage

### Quick Start

```javascript
import { marketingAPI } from './services/marketingAPI';

// Submit a task
const execution = await marketingAPI.submitTask(
  "Launch a product marketing campaign for our new AI platform",
  (progress) => {
    console.log(`Progress: ${progress.progress}% - ${progress.currentPhase}`);
  }
);

// Get the deliverable
if (execution.finalDeliverable) {
  console.log(execution.finalDeliverable.executiveSummary);
  console.log(execution.finalDeliverable.recommendations);
}

// Export as Markdown
const exported = marketingAPI.exportResults(
  execution.taskId,
  'deliverable'
);
console.log(exported.content);
```

### Advanced Usage

```javascript
// Submit multiple tasks in parallel
const executions = await marketingAPI.submitBatch([
  "Create Q1 content calendar",
  "Generate 100 enterprise leads",
  "Optimize email campaigns"
], (taskId, progress) => {
  console.log(`Task ${taskId}: ${progress.progress}%`);
});

// Check task status
const status = marketingAPI.getTaskStatus(execution.taskId);
console.log(status);

// Get available agents
const agents = marketingAPI.getAvailableAgents();
console.log(`${agents.length} agents available`);

// Get agents by department
const contentAgents = marketingAPI.getAgentsByDepartment('content-creation');
```

### CLI Demo

```bash
# Run the demo workflow
node demo-workflow.js

# With custom task
node demo-workflow.js "Create a social media strategy for LinkedIn"
```

### React UI

```bash
cd app
npm install
npm run dev
```

Then navigate to http://localhost:5173

## 👥 Agents

### Executive Leadership

| Agent | Role | AI Platform | Expertise |
|-------|------|-------------|-----------|
| **Scotty** | VP of Sales & Marketing | Gemini | Strategy, Leadership, Orchestration |

### Content Creation

| Agent | Role | AI Platform | Expertise |
|-------|------|-------------|-----------|
| **Marcus Hayes** | Senior Content Strategist | Gemini | Long-form content, Strategy, SEO |
| **Casey** | AI Copywriter | Gemini | Short-form copy, Ads, Headlines |

### Lead Generation

| Agent | Role | AI Platform | Expertise |
|-------|------|-------------|-----------|
| **Sarah Chen** | Lead Generation Specialist | DeepSeek | B2B leads, ICP development, Scoring |
| **Hunter** | Email Finder Specialist | DeepSeek | Email finding, Verification |
| **Zoey** | Lead Prospecting Specialist | DeepSeek | Prospecting, Enrichment |

### Email Marketing

| Agent | Role | AI Platform | Expertise |
|-------|------|-------------|-----------|
| **Emma Wilson** | Email Marketing Manager | DeepSeek | Campaigns, Automation, Sequences |
| **Sage** | Email Campaign Manager | Gemini | Strategy, Segmentation, A/B testing |

### Social Media & Ads

| Agent | Role | AI Platform | Expertise |
|-------|------|-------------|-----------|
| **Alex Rodriguez** | Social Advertising Manager | DeepSeek | Paid social, ROAS, Creative testing |
| **Smarta** | Social Advertising Manager | DeepSeek | Multi-platform ads, Optimization |

### SEO

| Agent | Role | AI Platform | Expertise |
|-------|------|-------------|-----------|
| **Ryan Mitchell** | SEO Specialist | DeepSeek | Technical SEO, Keywords, Rankings |
| **Surfy** | SEO Optimization Specialist | Gemini | On-page SEO, Link building |

### Analytics

| Agent | Role | AI Platform | Expertise |
|-------|------|-------------|-----------|
| **David Kim** | Analytics Director | DeepSeek | Data analysis, Attribution, ROI |
| **Analyzer** | Data Analytics Specialist | DeepSeek | BI, Reporting, Insights |
| **Heatley** | User Experience Analyst | DeepSeek | Heatmaps, UX, CRO |

### Conversion Optimization

| Agent | Role | AI Platform | Expertise |
|-------|------|-------------|-----------|
| **Oliver Grant** | CRO Specialist | Gemini | Conversion optimization, Testing |
| **Dynamo** | Experience Optimization Lead | Gemini | Personalization, A/B testing |

### Specialized

| Agent | Role | AI Platform | Expertise |
|-------|------|-------------|-----------|
| **Victor Stone** | Video Producer | Gemini | Video marketing, Production |
| **Natalie Brooks** | Influencer Manager | Gemini | Influencer partnerships |
| **Nathan Cross** | Competitive Intelligence | DeepSeek | Competitor analysis, Research |
| **Maya Patel** | Personalization Engineer | Gemini | Dynamic content, Segmentation |
| **Oscar Wright** | Operations Coordinator | Gemini | Operations, Coordination |
| **Ava Martinez** | ABM Specialist | Gemini | Account-based marketing |
| **Robert Davis** | Revenue Intelligence | Gemini | Revenue analytics, Forecasting |
| **Sophie Anderson** | Support Lead | Gemini | Customer support, Knowledge base |
| **Chatty** | Customer Support Specialist | Gemini | Chat support, Automation |

### Platform Distribution

- **Google Gemini** (15 agents): Creative, strategic, conversational tasks
- **DeepSeek** (20 agents): Technical, analytical, high-volume tasks

## 📚 API Reference

### submitTask(task, onProgress?)

Submit a task to the marketing team.

```typescript
async function submitTask(
  task: string | TaskSubmission,
  onProgress?: (progress: TaskProgress) => void
): Promise<WorkflowExecution>
```

**Parameters:**
- `task` - Task description or full submission object
- `onProgress` - Optional callback for progress updates

**Returns:** Complete workflow execution with deliverable

### getTaskStatus(taskId)

Get current status of a task.

```typescript
function getTaskStatus(taskId: string): TaskProgress | null
```

**Returns:** Current task progress or null

### getExecution(taskId)

Get complete execution details.

```typescript
function getExecution(taskId: string): WorkflowExecution | null
```

**Returns:** Full workflow execution or null

### exportResults(taskId, format)

Export workflow results.

```typescript
function exportResults(
  taskId: string,
  format: 'summary' | 'detailed' | 'deliverable'
): { filename: string; content: string } | null
```

**Returns:** File content and suggested filename

## 📊 Examples

### Example 1: Content Strategy

```javascript
const result = await submitTask(
  "Create a comprehensive content strategy for Q1 2025"
);

// Scotty assigns:
// - Marcus Hayes (Content Strategy)
// - Ryan Mitchell (SEO)
// - David Kim (Analytics)

// EA delivers:
// - Content calendar with 12 blog posts
// - SEO keyword targets
// - Analytics tracking setup
// - Distribution plan
// - Success metrics
```

### Example 2: Lead Generation

```javascript
const result = await submitTask(
  "Generate 100 qualified leads in enterprise SaaS"
);

// Scotty assigns:
// - Sarah Chen (Lead Generation)
// - Hunter (Email Finding)
// - David Kim (Analytics)

// EA delivers:
// - 127 qualified leads with contact info
// - Lead scoring methodology
// - ICP documentation
// - Outreach sequences
// - Tracking dashboard
```

### Example 3: Product Launch

```javascript
const result = await submitTask(
  "Launch a complete product marketing campaign"
);

// Scotty assigns (Complex - 7 agents):
// - Marcus Hayes (Content)
// - Alex Rodriguez (Paid Social)
// - Emma Wilson (Email)
// - Victor Stone (Video)
// - Ryan Mitchell (SEO)
// - Oliver Grant (Landing Pages)
// - David Kim (Analytics)

// EA delivers:
// - Complete launch plan
// - Multi-channel content
// - Ad campaigns ready to deploy
// - Email sequences
// - Video scripts
// - Landing page optimization
// - Full analytics setup
```

## 🔐 Configuration

### Environment Variables

Create `.env` file:

```env
# Google Gemini
GEMINI_API_KEY=your_gemini_api_key

# DeepSeek
DEEPSEEK_API_KEY=your_deepseek_api_key

# Optional: Legacy integrations
JASPER_API_KEY=your_jasper_key
RYTR_API_KEY=your_rytr_key
```

### Agent Configuration

Agents are configured in:
- `app/src/services/agentLoader.ts` - Agent definitions
- `agents/workers/*.json` - Individual agent JSON files
- `config/agent-system-prompts-production.json` - System prompts

## 💰 Cost Model

| Tier | Platform | Cost/Hour | Best For |
|------|----------|-----------|----------|
| **Premium** | Gemini | $0.015 | Strategic, Creative |
| **Budget** | DeepSeek | $0.005 | Analytical, Volume |
| **Ultra** | GPT-4 | $0.030 | Complex reasoning |

**Typical Task Costs:**
- Simple task (1 agent, 2 hours): **$0.01 - $0.03**
- Moderate task (3 agents, 1 day): **$0.30 - $0.50**
- Complex task (7 agents, 1 week): **$2.00 - $5.00**
- Enterprise project (10+ agents, 1 month): **$20 - $50**

**Compare to traditional agency:**
- Agency cost: $5,000 - $25,000/month
- Marketing Dept cost: $20 - $500/month
- **Savings: 98-99%**

## 🧪 Testing

Run the demo:

```bash
node demo-workflow.js
```

Expected output:
- Scotty analysis
- Agent assignments
- Execution progress
- EA deliverable
- Export files

## 📈 Roadmap

- [x] Scotty AI orchestrator
- [x] 35+ specialized agents
- [x] EA collation agent
- [x] Master workflow orchestrator
- [x] Marketing API
- [x] Real AI execution (Gemini + DeepSeek)
- [x] Progress tracking
- [x] Multi-format export
- [ ] React UI integration
- [ ] Webhook notifications
- [ ] CRM integration
- [ ] PDF export
- [ ] Template workflows
- [ ] Agent performance analytics
- [ ] Cost tracking dashboard

## 🆘 Support

For issues or questions:
1. Check this documentation
2. Review the demo script
3. Inspect the code examples
4. Open an issue on GitHub

## 📄 License

Proprietary - Marketing Department System © 2025
