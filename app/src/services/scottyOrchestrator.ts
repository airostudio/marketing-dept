/**
 * Scotty AI - Master Orchestrator
 *
 * The VP of Sales & Marketing with 7+ years of expertise in strategic planning,
 * team coordination, and project management. Scotty analyzes incoming tasks,
 * determines complexity, assigns the right agents, and orchestrates execution.
 */

import { callGemini } from './gemini';
import { Worker, WorkflowStep } from '../types/workflow';
import { detectRequiredAPIs, TaskAPIRequirements } from './apiDetector';

export interface TaskAnalysis {
  complexity: 'simple' | 'moderate' | 'complex' | 'enterprise';
  estimatedDuration: string;
  requiredAgents: string[]; // Agent IDs
  executionStrategy: 'sequential' | 'parallel' | 'hybrid';
  phases?: {
    name: string;
    agents: string[];
    dependencies?: string[];
  }[];
  reasoning: string;
}

export interface OrchestrationPlan {
  taskId: string;
  analysis: TaskAnalysis;
  workflowSteps: WorkflowStep[];
  requiresEACollation: boolean;
  estimatedCost: number;
  apiRequirements?: TaskAPIRequirements;
}

/**
 * Scotty analyzes a task and creates an execution plan
 */
export async function analyzeTaskWithScotty(
  taskDescription: string,
  availableAgents: Worker[]
): Promise<TaskAnalysis> {

  const agentList = availableAgents.map(agent => ({
    id: agent.id,
    name: agent.name,
    role: agent.role,
    department: agent.department,
    capabilities: agent.capabilities,
    aiPlatform: agent.aiPlatform?.name
  }));

  const systemPrompt = `You are Scotty, the VP of Sales & Marketing with 7+ years of expertise in:
- Strategic planning and execution
- Team coordination and resource allocation
- Project scoping and complexity assessment
- Marketing technology and automation
- Cross-functional leadership
- Modern marketing terminology and best practices (2025)

Your role is to analyze incoming tasks using LATEST marketing & sales terminology and determine:
1. Task complexity (simple/moderate/complex/enterprise)
2. Which agents are needed (select from available team based on their SPECIFIC expertise)
3. How they should work together (sequential/parallel/hybrid)
4. Estimated timeline
5. Whether this needs executive summary from EA agent

You have a team of 35+ specialized agents, each with 7+ years expertise in their domain.

=== AGENT EXPERTISE MAPPING ===
Use this to intelligently match tasks to the RIGHT agents:

LEAD GENERATION & PROSPECTING:
- Sarah Chen (Lead Gen): lead generation, prospecting, outbound, lead magnets, list building, contact enrichment, data scraping, database building, finding prospects, compiling lists, Google Maps extraction, LinkedIn scraping, business directories, contact discovery, ICP development, buyer personas
- Zoey (Prospecting): B2B prospecting, company research, decision-maker identification, contact discovery, account research, prospect qualification
- Hunter (Email Finding): email finding, email verification, contact discovery, email validation, deliverability

CONTENT & CREATIVE:
- Marcus Hayes (Content): content strategy, editorial calendar, thought leadership, brand voice, storytelling, content pillars, blog strategy, white papers, case studies, long-form content
- Casey (Copywriting): ad copy, landing pages, CTAs, headlines, microcopy, conversion copy, product descriptions, email copy, short-form content

EMAIL MARKETING:
- Emma Wilson (Email): email campaigns, drip campaigns, nurture sequences, email automation, lifecycle marketing
- Sage (Email Strategy): A/B testing, subject lines, send-time optimization, deliverability, inbox placement

PAID ADVERTISING:
- Alex Rodriguez (Social Ads): paid social, Facebook ads, Instagram ads, LinkedIn ads, Twitter ads, TikTok ads, paid acquisition, social PPC
- Smarta (Ad Optimization): ROAS, CPA, CPM, CTR, ad creative testing, audience segmentation, lookalike audiences, retargeting

SEO & ORGANIC:
- Ryan Mitchell (SEO): SEO, keyword research, on-page SEO, technical SEO, backlinks, link building, organic traffic, Core Web Vitals
- Surfy (SEO Strategy): content SEO, E-E-A-T, topical authority, content clusters, schema markup

ANALYTICS & DATA:
- David Kim (Analytics): analytics, GA4, attribution modeling, conversion tracking, funnel analysis, KPI dashboards, data visualization
- Analyzer (Data Intelligence): business intelligence, predictive analytics, behavioral analytics, trend analysis

CONVERSION & OPTIMIZATION:
- Oliver Grant (CRO): conversion rate optimization, A/B testing, landing page optimization, funnel optimization, heatmaps
- Dynamo (Personalization): personalization, dynamic content, 1:1 marketing, recommendation engines, website personalization

SPECIALIZED:
- Victor Stone (Video): video marketing, YouTube, video ads, TikTok, Reels, Shorts, webinars
- Natalie Brooks (Influencer): influencer marketing, creator partnerships, sponsored content, micro-influencers
- Nathan Cross (Competitive Intel): competitive analysis, market research, competitive intelligence, SWOT analysis
- Ava Martinez (ABM): account-based marketing, target account lists, account engagement, enterprise sales
- Robert Davis (Revenue Ops): revenue operations, sales enablement, pipeline management, forecasting
- Sophie Anderson (Support): customer support, chatbots, knowledge base, help desk, CSAT
- Oscar Wright (Operations): project management, workflow automation, process optimization

=== MATCHING EXAMPLES ===
- "Scrape Google Maps" / "compile list of plumbers" / "find 50 businesses" → Sarah Chen
- "Create Facebook ads" / "run Instagram campaign" → Alex Rodriguez
- "Write blog post" / "content strategy" → Marcus Hayes
- "Find email addresses" / "verify emails" → Hunter
- "Set up email automation" / "drip campaign" → Emma Wilson
- "Improve conversion rate" / "optimize landing page" → Oliver Grant
- "Keyword research" / "SEO audit" → Ryan Mitchell
- "Competitive analysis" / "market research" → Nathan Cross

Guidelines:
- Simple tasks: 1 agent, <4 hours, straightforward execution
- Moderate tasks: 2-3 agents, 1-3 days, coordinated effort
- Complex tasks: 4-6 agents, 1-2 weeks, multi-phase execution
- Enterprise tasks: 7+ agents, 1+ months, strategic initiatives

CRITICAL: Match tasks to agents based on ACTUAL expertise and modern marketing understanding, not just surface keywords.`;

  const userPrompt = `Task Description:
"${taskDescription}"

Available Agents:
${JSON.stringify(agentList, null, 2)}

Analyze this task and provide:
1. Complexity level
2. Estimated duration
3. Required agent IDs (from the available list)
4. Execution strategy (sequential if agents need to build on each other's work, parallel if independent, hybrid for complex projects)
5. For complex tasks, break into phases with agent assignments
6. Your strategic reasoning

Respond in JSON format:
{
  "complexity": "simple|moderate|complex|enterprise",
  "estimatedDuration": "2 hours" or "3 days" etc,
  "requiredAgents": ["agent-id-1", "agent-id-2"],
  "executionStrategy": "sequential|parallel|hybrid",
  "phases": [
    {
      "name": "Phase 1 Name",
      "agents": ["agent-id"],
      "dependencies": []
    }
  ],
  "reasoning": "Your strategic analysis..."
}`;

  try {
    const response = await callGemini(systemPrompt, userPrompt);

    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse Scotty analysis response');
    }

    const analysis: TaskAnalysis = JSON.parse(jsonMatch[0]);

    // Validate required agents exist
    const validAgentIds = new Set(availableAgents.map(a => a.id));
    analysis.requiredAgents = analysis.requiredAgents.filter(id => validAgentIds.has(id));

    if (analysis.requiredAgents.length === 0) {
      throw new Error('Scotty failed to assign any valid agents. The AI response may be malformed.');
    }

    return analysis;

  } catch (error) {
    console.error('Scotty analysis failed - Production system requires valid API keys:', error);

    // Re-throw the error - NO FALLBACK in production
    throw new Error(
      error instanceof Error
        ? `Scotty orchestration failed: ${error.message}`
        : 'Scotty orchestration failed: Unknown error'
    );
  }
}

/**
 * Create orchestration plan from analysis
 */
export function createOrchestrationPlan(
  taskId: string,
  taskDescription: string,
  analysis: TaskAnalysis,
  availableAgents: Worker[]
): OrchestrationPlan {

  const workflowSteps: WorkflowStep[] = [];

  if (analysis.phases && analysis.phases.length > 0) {
    // Multi-phase execution
    analysis.phases.forEach((phase, phaseIndex) => {
      phase.agents.forEach(agentId => {
        const agent = availableAgents.find(a => a.id === agentId);
        if (agent) {
          workflowSteps.push({
            id: `${taskId}-phase${phaseIndex}-${agentId}`,
            workerId: agentId,
            workerName: agent.name,
            action: `${phase.name}: Execute ${agent.role} tasks`,
            description: `Phase ${phaseIndex + 1}: ${phase.name}`,
            dependencies: phase.dependencies || (phaseIndex > 0 ?
              analysis.phases![phaseIndex - 1].agents.map(id =>
                `${taskId}-phase${phaseIndex-1}-${id}`
              ) : []),
            status: 'pending',
            progress: 0
          });
        }
      });
    });
  } else {
    // Simple agent assignment
    if (analysis.executionStrategy === 'sequential') {
      // Each agent depends on previous
      analysis.requiredAgents.forEach((agentId, index) => {
        const agent = availableAgents.find(a => a.id === agentId);
        if (agent) {
          workflowSteps.push({
            id: `${taskId}-${agentId}`,
            workerId: agentId,
            workerName: agent.name,
            action: taskDescription,
            description: `Execute ${agent.role} tasks sequentially`,
            dependencies: index > 0 ? [`${taskId}-${analysis.requiredAgents[index-1]}`] : [],
            status: 'pending',
            progress: 0
          });
        }
      });
    } else {
      // Parallel execution - no dependencies
      analysis.requiredAgents.forEach(agentId => {
        const agent = availableAgents.find(a => a.id === agentId);
        if (agent) {
          workflowSteps.push({
            id: `${taskId}-${agentId}`,
            workerId: agentId,
            workerName: agent.name,
            action: taskDescription,
            description: `Execute ${agent.role} tasks in parallel`,
            dependencies: [],
            status: 'pending',
            progress: 0
          });
        }
      });
    }
  }

  // Calculate estimated cost
  const estimatedCost = calculateEstimatedCost(analysis, availableAgents);

  // Determine if EA collation needed (moderate+ complexity or 2+ agents)
  const requiresEACollation = analysis.complexity !== 'simple' ||
                              analysis.requiredAgents.length > 1;

  // Detect required APIs
  const apiRequirements = detectRequiredAPIs(taskDescription, analysis.requiredAgents);

  return {
    taskId,
    analysis,
    workflowSteps,
    requiresEACollation,
    estimatedCost,
    apiRequirements
  };
}

/**
 * Calculate estimated cost based on agents and duration
 */
function calculateEstimatedCost(analysis: TaskAnalysis, agents: Worker[]): number {
  const costPerHour: Record<string, number> = {
    'Gemini': 0.015,     // Premium tier
    'DeepSeek': 0.005,   // Budget tier
    'GPT-4': 0.030,      // Ultra premium
    'GPT-3.5': 0.010     // Mid tier
  };

  let totalCost = 0;

  // Parse duration to hours
  const durationMatch = analysis.estimatedDuration.match(/(\d+)\s*(hour|day|week|month)/i);
  let hours = 2; // Default

  if (durationMatch) {
    const value = parseInt(durationMatch[1]);
    const unit = durationMatch[2].toLowerCase();

    switch (unit) {
      case 'hour': hours = value; break;
      case 'day': hours = value * 8; break;
      case 'week': hours = value * 40; break;
      case 'month': hours = value * 160; break;
    }
  }

  // Calculate cost for each agent
  analysis.requiredAgents.forEach(agentId => {
    const agent = agents.find(a => a.id === agentId);
    if (agent && agent.aiPlatform) {
      const platformCost = costPerHour[agent.aiPlatform.name] || 0.01;
      totalCost += platformCost * (hours / analysis.requiredAgents.length);
    }
  });

  return Math.round(totalCost * 100) / 100; // Round to 2 decimals
}

