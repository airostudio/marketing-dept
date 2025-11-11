# Agent Manager System - Multi-Agent Coordination

## Overview

The Agent Manager is a central coordinator that orchestrates communication and task execution across all 12 AI agents in the marketing department. It intelligently routes tasks, manages dependencies, and coordinates multi-agent workflows.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      TASK CREATED                            │
│                           ↓                                   │
│              🎯 MANAGER (Coordinator)                         │
│                           ↓                                   │
│        ┌──────────────────┼──────────────────┐              │
│        ↓                  ↓                   ↓              │
│   Single Agent      Multi-Agent         Specialist          │
│     Execution        Workflow           Request              │
└─────────────────────────────────────────────────────────────┘
```

## All Agents

### 1. 🎯 Manager (NEW)
- **Role**: AI Coordinator & Orchestrator
- **Platform**: Internal (no external API)
- **Responsibilities**:
  - Routes tasks to appropriate agents
  - Coordinates multi-agent workflows
  - Manages task dependencies
  - Logs all inter-agent communications
  - Ensures efficient resource utilization

### 2. ✍️ Jasper
- **Role**: Content Creation Lead
- **Platform**: Google Gemini
- **Capabilities**: blog-writing, article-writing, long-form-content, seo-content

### 3. 📝 Casey
- **Role**: AI Copywriter
- **Platform**: Rytr AI
- **Capabilities**: ad-copy, social-media-copy, product-descriptions, landing-pages

### 4. 🔍 Zoey
- **Role**: Lead Prospecting Specialist
- **Platform**: ZoomInfo
- **Capabilities**: lead-prospecting, b2b-leads, contact-search, company-research

### 5. 🎯 Hunter
- **Role**: Email Finder Specialist
- **Platform**: Hunter.io
- **Capabilities**: email-finding, email-verification, domain-search

### 6. ⏰ Sage
- **Role**: Email Campaign Manager
- **Platform**: Mailchimp
- **Capabilities**: email-campaigns, email-marketing, newsletter-management

### 7. 🎯 Smarta
- **Role**: Social Advertising Manager
- **Platform**: Smartly.io
- **Capabilities**: social-advertising, facebook-ads, instagram-ads, campaign-management

### 8. 🎨 Dynamo
- **Role**: Experience Optimization Lead
- **Platform**: Dynamic Yield
- **Capabilities**: personalization, experience-optimization, ab-testing

### 9. 📊 Analyzer
- **Role**: Data Analytics Specialist
- **Platform**: Google Analytics
- **Capabilities**: data-analysis, analytics, reporting, metrics-tracking

### 10. 🔥 Heatley
- **Role**: User Experience Analyst
- **Platform**: Hotjar
- **Capabilities**: user-experience, heatmaps, session-recording, user-feedback

### 11. 🏄 Surfy
- **Role**: SEO Optimization Specialist
- **Platform**: Surfer SEO
- **Capabilities**: seo, keyword-research, content-optimization, seo-audit

### 12. 💬 Chatty
- **Role**: Customer Support Specialist
- **Platform**: Intercom
- **Capabilities**: customer-support, live-chat, customer-messaging, support-tickets

## How Task Coordination Works

### 1. Task Analysis

When a task is created, the Manager:

1. **Analyzes task content** (title + description)
2. **Identifies required capabilities**
3. **Determines if single or multiple agents needed**
4. **Creates appropriate execution plan**

### 2. Single Agent Execution

For simple tasks that one agent can handle:

```
Task: "Write a blog post about AI marketing"

Manager Analysis:
- Keywords detected: "write", "blog post"
- Best agent: Jasper (content-creation)
- Workflow: Single agent

Execution:
1. Manager delegates to Jasper
2. Jasper uses Google Gemini to create content
3. Jasper returns result to Manager
4. Manager marks task complete
```

### 3. Multi-Agent Workflows

For complex tasks requiring multiple agents:

```
Task: "Find leads in tech industry and create outreach email"

Manager Analysis:
- Keywords: "leads", "create", "email"
- Required workflow: Lead Gen → Email Finding → Copywriting

Execution:
Step 1: Zoey finds B2B leads (ZoomInfo)
  ↓
Step 2: Hunter finds email addresses (Hunter.io)
  ↓ (depends on Step 1)
Step 3: Casey creates outreach copy (Rytr AI)
  ↓ (depends on Step 2)
Manager compiles and returns final result
```

## Built-in Workflow Patterns

The Manager automatically detects and executes these common patterns:

### Pattern 1: Lead Generation + Email + Outreach
**Trigger**: Task mentions "lead" AND ("content" OR "email")

```
Zoey (Lead Prospecting)
  ↓
Hunter (Email Finding)
  ↓
Casey (Email Copywriting)
```

**Example**: "Find tech company leads and create outreach emails"

### Pattern 2: Content + SEO Optimization
**Trigger**: Task mentions "blog" AND "seo"

```
Surfy (Keyword Research)
  ↓
Jasper (Content Creation)
```

**Example**: "Write SEO-optimized blog post about marketing automation"

### Pattern 3: Ad Campaign Launch
**Trigger**: Task mentions "campaign" AND "ad"

```
Casey (Ad Copy Creation)
  ↓
Smarta (Campaign Setup)
  ↓
Analyzer (Performance Tracking)
```

**Example**: "Launch Facebook ad campaign for new product"

## Inter-Agent Communication

### Message Types

1. **Request**: One agent needs another agent's service
2. **Response**: Agent returns result to requester
3. **Notification**: Status update
4. **Delegation**: Manager assigns work to agent

### Message Flow

```javascript
{
  id: "msg_12345",
  from: "manager",
  to: "jasper",
  type: "delegation",
  content: {
    task: "Create blog post",
    reason: "Delegating to Jasper"
  },
  timestamp: "2024-01-15T10:30:00Z",
  taskId: "task_789"
}
```

### Communication Example

```
1. User creates task: "Generate leads and write email"

2. Manager → Zoey (Request)
   "Find B2B leads in tech industry"

3. Zoey → Manager (Response)
   Returns: 25 leads with company info

4. Manager → Hunter (Request)
   "Find emails for these 25 leads"

5. Hunter → Manager (Response)
   Returns: Email addresses for 20/25 leads

6. Manager → Casey (Request)
   "Create outreach email copy for these contacts"

7. Casey → Manager (Response)
   Returns: Personalized email template

8. Manager → User
   Returns: Complete package (leads + emails + copy)
```

## API and Services

### agentManager.ts

**Core Service Methods:**

```typescript
// Find best agent for a task
findBestAgent(task: Task, allWorkers: Worker[]): Worker | null

// Coordinate task execution
coordinateTask(
  task: Task,
  primaryWorker: Worker,
  allWorkers: Worker[],
  onProgress?: (agentId: string, progress: number, status: string) => void
): Promise<{ success: boolean; result?: any; error?: string }>

// Get agent capabilities
getAgentCapabilities(agentId: string): string[]

// Get task message history
getTaskMessages(taskId: string): AgentMessage[]
```

**Workflow Execution:**

```typescript
// Analyzes task and creates workflow
analyzeTaskForWorkflow(task: Task, allWorkers: Worker[]): Workflow

// Executes multi-step workflow
executeWorkflow(
  workflow: Workflow,
  allWorkers: Worker[],
  onProgress?: (agentId: string, progress: number, status: string) => void
): Promise<{ success: boolean; result?: any; error?: string }>
```

## Progress Tracking

The Manager provides real-time progress updates with agent identification:

```
Progress Updates:
5%   - 🎯 Manager: Manager receiving task...
10%  - 🎯 Manager: Manager analyzing task requirements...
20%  - 🎯 Manager: Orchestrating multi-agent workflow...
30%  - 🔍 Zoey: Finding leads with Zoey...
50%  - 🎯 Hunter: Finding email addresses...
70%  - 📝 Casey: Creating outreach copy...
90%  - 🎯 Manager: Compiling results...
100% - Task completed
```

## Usage Examples

### Example 1: Simple Content Creation

```typescript
// User creates task in UI
addTask({
  title: "Write article about AI",
  description: "Educational content for blog",
  workerId: "jasper",
  department: "Content Creation",
  priority: "medium",
})

// Manager routes to Jasper
// Jasper uses Google Gemini
// Returns completed article
```

### Example 2: Complex Multi-Agent Task

```typescript
// User creates task in UI
addTask({
  title: "Launch lead generation campaign",
  description: "Find leads, get emails, create outreach campaign",
  workerId: "manager", // User can assign directly to Manager
  department: "Management",
  priority: "high",
})

// Manager creates 3-step workflow:
// 1. Zoey: Find leads
// 2. Hunter: Get emails (depends on #1)
// 3. Casey: Create copy (depends on #2)
// Returns complete campaign package
```

### Example 3: SEO Content Workflow

```typescript
addTask({
  title: "Create SEO blog post about marketing automation",
  description: "Target keywords: marketing automation, workflow tools",
  workerId: "manager",
  department: "Management",
  priority: "medium",
})

// Manager detects SEO + blog pattern:
// 1. Surfy: Research keywords
// 2. Jasper: Write optimized content (depends on #1)
// Returns SEO-optimized blog post
```

## Testing Agent Communication

### Manual Testing

1. **Create a simple task**:
   - Go to Task Manager
   - Click "New Task"
   - Assign to any agent (Jasper, Casey, or Zoey)
   - Watch progress as Manager coordinates

2. **Create a multi-agent task**:
   - Title: "Find leads and create email campaign"
   - Description: "Tech industry B2B leads with outreach emails"
   - Assign to: Manager
   - Watch as Manager coordinates Zoey → Hunter → Casey

3. **Check task results**:
   - View completed tasks
   - See which agents worked on the task
   - Review the final compiled result

### Programmatic Testing

```typescript
import { agentManager } from './services/agentManager'

// Test capability detection
const capabilities = agentManager.getAgentCapabilities('jasper')
console.log(capabilities) // ['content-creation', 'blog-writing', ...]

// Test best agent selection
const bestAgent = agentManager.findBestAgent(task, allWorkers)
console.log(bestAgent.name) // "Jasper"

// Test task coordination
const result = await agentManager.coordinateTask(
  task,
  worker,
  allWorkers,
  (agentId, progress, status) => {
    console.log(`${agentId}: ${status} (${progress}%)`)
  }
)
```

## Benefits

✅ **Intelligent Routing**: Tasks go to the most qualified agent
✅ **Multi-Agent Workflows**: Complex tasks broken into coordinated steps
✅ **Dependency Management**: Steps execute in correct order
✅ **Progress Visibility**: See which agent is working at each stage
✅ **Communication Logging**: All agent interactions tracked
✅ **Scalable**: Easy to add new agents and workflow patterns
✅ **Efficient**: No duplicate work, optimal resource usage

## Future Enhancements

Potential improvements:

- **Parallel Execution**: Run independent steps simultaneously
- **Retry Logic**: Auto-retry failed steps
- **Agent Load Balancing**: Distribute work among busy agents
- **Workflow Templates**: Pre-defined workflows for common scenarios
- **Agent Learning**: Improve task routing based on past performance
- **Real-time Collaboration**: Multiple agents working on same task
- **Conflict Resolution**: Handle competing agent requests
- **Performance Metrics**: Track agent efficiency and success rates

## Troubleshooting

### Agent not responding
- Check if agent's API is configured in Vercel Environment Variables
- Verify worker.apiConnected is true
- Review browser console for errors

### Workflow stuck at one step
- Check if dependencies are met
- Verify previous step completed successfully
- Review agentManager logs in console

### Task fails with "Agent not found"
- Ensure all agents are in workers array
- Check worker ID matches capability mapping
- Verify Manager is in worker list

## Related Files

- `/app/src/services/agentManager.ts` - Main Manager service
- `/app/src/services/taskExecution.ts` - Task execution routing
- `/app/src/store/useStore.ts` - Agent state management
- `/app/src/services/contentCreation.ts` - Jasper & Casey services
- `/app/src/services/leadGeneration.ts` - Zoey service

## Summary

The Agent Manager transforms the AI Marketing Department from isolated agents into a coordinated team. It intelligently routes work, manages complex workflows, and ensures agents collaborate effectively to complete sophisticated marketing tasks.
