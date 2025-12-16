/**
 * The Marketing Department - Real AI Agent Backend
 *
 * This server powers the AI agent orchestration system with:
 * - OpenAI GPT-4 Turbo & GPT-3.5 Turbo integration
 * - DeepSeek API integration
 * - Scotty intelligent routing
 * - Multi-agent coordination
 * - Real content generation
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../scotty')));

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// In-memory storage (replace with database in production)
const tasks = new Map();
const deliverables = new Map();

// Agent Database
const agents = {
  'marcus': {
    name: 'Marcus Hayes',
    role: 'Content Strategist',
    model: 'gpt-4-turbo-preview',
    provider: 'openai',
    temperature: 0.7,
    maxTokens: 4000
  },
  'sarah': {
    name: 'Sarah Chen',
    role: 'Lead Generation Specialist',
    model: 'deepseek-chat',
    provider: 'deepseek',
    temperature: 0.6,
    maxTokens: 2000
  },
  'emma': {
    name: 'Emma Wilson',
    role: 'Email Marketing Specialist',
    model: 'gpt-3.5-turbo',
    provider: 'openai',
    temperature: 0.7,
    maxTokens: 2000
  },
  'alex': {
    name: 'Alex Rodriguez',
    role: 'Social Advertising Specialist',
    model: 'gpt-3.5-turbo',
    provider: 'openai',
    temperature: 0.75,
    maxTokens: 2000
  },
  'victor': {
    name: 'Victor Stone',
    role: 'Video Marketing Producer',
    model: 'gpt-3.5-turbo',
    provider: 'openai',
    temperature: 0.8,
    maxTokens: 2000
  },
  'ryan': {
    name: 'Ryan Mitchell',
    role: 'SEO Specialist',
    model: 'deepseek-chat',
    provider: 'deepseek',
    temperature: 0.5,
    maxTokens: 2000
  },
  'david': {
    name: 'David Kim',
    role: 'Analytics Director',
    model: 'deepseek-chat',
    provider: 'deepseek',
    temperature: 0.4,
    maxTokens: 2000
  },
  'nathan': {
    name: 'Nathan Cross',
    role: 'Competitive Intelligence Analyst',
    model: 'deepseek-chat',
    provider: 'deepseek',
    temperature: 0.5,
    maxTokens: 2000
  },
  'oliver': {
    name: 'Oliver Grant',
    role: 'CRO Specialist',
    model: 'deepseek-chat',
    provider: 'deepseek',
    temperature: 0.5,
    maxTokens: 2000
  },
  'natalie': {
    name: 'Natalie Brooks',
    role: 'Influencer Marketing Manager',
    model: 'gpt-3.5-turbo',
    provider: 'openai',
    temperature: 0.7,
    maxTokens: 2000
  },
  'ava': {
    name: 'Ava Martinez',
    role: 'ABM Specialist',
    model: 'gpt-3.5-turbo',
    provider: 'openai',
    temperature: 0.6,
    maxTokens: 2000
  },
  'maya': {
    name: 'Maya Patel',
    role: 'Personalization Engineer',
    model: 'gpt-3.5-turbo',
    provider: 'openai',
    temperature: 0.6,
    maxTokens: 2000
  },
  'sophie': {
    name: 'Sophie Anderson',
    role: 'Customer Support Lead',
    model: 'deepseek-chat',
    provider: 'deepseek',
    temperature: 0.5,
    maxTokens: 2000
  },
  'robert': {
    name: 'Robert Davis',
    role: 'Revenue Intelligence Analyst',
    model: 'gpt-4-turbo-preview',
    provider: 'openai',
    temperature: 0.5,
    maxTokens: 3000
  },
  'oscar': {
    name: 'Oscar Wright',
    role: 'Marketing Operations Coordinator',
    model: 'gpt-4-turbo-preview',
    provider: 'openai',
    temperature: 0.6,
    maxTokens: 3000
  }
};

// Scotty's Intelligent Routing Logic
function routeTask(taskDescription) {
  const task = taskDescription.toLowerCase();
  const assignedAgents = [];

  // Content Marketing
  if (task.match(/blog|article|whitepaper|ebook|case study|content strategy|thought leadership/)) {
    assignedAgents.push('marcus');
  }

  // Email Marketing
  if (task.match(/email|newsletter|drip campaign|nurture sequence|email automation/)) {
    assignedAgents.push('emma');
  }

  // Social Advertising
  if (task.match(/ads|facebook|instagram|linkedin ads|tiktok ads|social advertising/)) {
    assignedAgents.push('alex');
  }

  // Lead Generation
  if (task.match(/lead gen|cold email|cold outreach|prospecting|lead list|mql|sql/)) {
    assignedAgents.push('sarah');
  }

  // Video Marketing
  if (task.match(/video|youtube|tiktok|reels|video script/)) {
    assignedAgents.push('victor');
  }

  // SEO
  if (task.match(/seo|keyword research|rankings|organic traffic|search engine/)) {
    assignedAgents.push('ryan');
  }

  // Analytics
  if (task.match(/analytics|data analysis|dashboard|reporting|metrics|attribution/)) {
    assignedAgents.push('david');
  }

  // Competitive Intelligence
  if (task.match(/competitor|competitive analysis|swot|market intelligence/)) {
    assignedAgents.push('nathan');
  }

  // Conversion Optimization
  if (task.match(/conversion|cro|a\/b test|optimize|landing page optimization/)) {
    assignedAgents.push('oliver');
  }

  // Multi-agent projects (campaigns, launches)
  if (task.match(/campaign|launch|go-to-market|gtm strategy/)) {
    assignedAgents.push('marcus', 'emma', 'alex', 'sarah');
  }

  // ABM
  if (task.match(/abm|account-based|enterprise accounts|named accounts/)) {
    assignedAgents.push('ava');
  }

  // Default to Marcus if no matches
  if (assignedAgents.length === 0) {
    assignedAgents.push('marcus');
  }

  // Remove duplicates
  return [...new Set(assignedAgents)];
}

// Load Agent System Prompt
async function loadAgentPrompt(agentId) {
  try {
    const configPath = path.join(__dirname, '../config/agent-system-prompts-production.json');
    const configData = await fs.readFile(configPath, 'utf8');
    const config = JSON.parse(configData);

    if (config.agents && config.agents[agentId]) {
      return config.agents[agentId].systemPrompt;
    }

    // Fallback prompt if not found in config
    const agent = agents[agentId];
    return `You are ${agent.name}, a world-class ${agent.role} with 10+ years of experience.

You report directly to Scotty, the VP of Sales & Marketing. Your task is to provide expert-level ${agent.role.toLowerCase()} deliverables that exceed professional standards.

Always:
- Provide actionable, specific recommendations
- Back claims with data and examples
- Structure output clearly and professionally
- Focus on business outcomes and ROI
- Deliver production-ready work

Never:
- Use generic marketing speak or clichés
- Provide vague or abstract advice
- Skip important details
- Compromise on quality`;
  } catch (error) {
    console.error(`Error loading prompt for ${agentId}:`, error);
    return null;
  }
}

// Call OpenAI API
async function callOpenAI(model, systemPrompt, userPrompt, temperature = 0.7, maxTokens = 2000) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env file.');
    }

    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: temperature,
      max_tokens: maxTokens
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error.message);

    // Provide user-friendly error messages
    if (error.status === 401) {
      throw new Error('OpenAI API key is invalid or expired. Please check your API key at https://platform.openai.com/api-keys');
    } else if (error.status === 429) {
      throw new Error('OpenAI rate limit exceeded. Please wait a moment and try again, or check your billing at https://platform.openai.com/account/billing');
    } else if (error.status === 402) {
      throw new Error('OpenAI account has insufficient credits. Please add credits at https://platform.openai.com/account/billing');
    } else if (error.code === 'insufficient_quota') {
      throw new Error('OpenAI quota exceeded. You may have run out of credits or hit your usage limit. Check https://platform.openai.com/account/billing');
    } else {
      throw new Error(`OpenAI API error: ${error.message}. If this persists, check your API key and billing status.`);
    }
  }
}

// Call DeepSeek API
async function callDeepSeek(systemPrompt, userPrompt, temperature = 0.6, maxTokens = 2000) {
  try {
    if (!process.env.DEEPSEEK_API_KEY) {
      throw new Error('DeepSeek API key is not configured. Please add DEEPSEEK_API_KEY to your .env file.');
    }

    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: temperature,
        max_tokens: maxTokens
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 second timeout
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('DeepSeek API Error:', error.response?.data || error.message);

    // Provide user-friendly error messages
    if (error.response) {
      const status = error.response.status;
      if (status === 401 || status === 403) {
        throw new Error('DeepSeek API key is invalid or expired. Please check your API key at https://platform.deepseek.com/api_keys');
      } else if (status === 429) {
        throw new Error('DeepSeek rate limit exceeded. Please wait a moment and try again.');
      } else if (status === 402) {
        throw new Error('DeepSeek account has insufficient balance. Please add credits at https://platform.deepseek.com');
      } else {
        throw new Error(`DeepSeek API error (${status}): ${error.response.data?.error?.message || error.message}`);
      }
    } else if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      throw new Error('DeepSeek API request timed out. The service may be slow or unavailable. Please try again.');
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      throw new Error('Cannot connect to DeepSeek API. Please check your internet connection.');
    } else {
      throw new Error(`DeepSeek API error: ${error.message}. If this persists, check your API key and account status.`);
    }
  }
}

// Execute Agent Task
async function executeAgent(agentId, taskDescription) {
  const agent = agents[agentId];
  if (!agent) {
    throw new Error(`Agent ${agentId} not found`);
  }

  // Load agent's expert system prompt
  const systemPrompt = await loadAgentPrompt(agentId);
  if (!systemPrompt) {
    throw new Error(`Could not load system prompt for ${agentId}`);
  }

  // Construct user prompt
  const userPrompt = `${taskDescription}

Please provide a complete, professional ${agent.role.toLowerCase()} deliverable for this request. Include all necessary details, recommendations, and actionable next steps.`;

  // Call appropriate AI provider
  let output;
  if (agent.provider === 'openai') {
    output = await callOpenAI(
      agent.model,
      systemPrompt,
      userPrompt,
      agent.temperature,
      agent.maxTokens
    );
  } else if (agent.provider === 'deepseek') {
    output = await callDeepSeek(
      systemPrompt,
      userPrompt,
      agent.temperature,
      agent.maxTokens
    );
  } else {
    throw new Error(`Unknown provider: ${agent.provider}`);
  }

  return {
    agentId,
    agentName: agent.name,
    agentRole: agent.role,
    model: agent.model,
    provider: agent.provider,
    output: output,
    timestamp: new Date().toISOString()
  };
}

// EA Agent: Synthesize Multi-Agent Outputs
async function synthesizeOutputs(taskDescription, agentOutputs) {
  const eaSystemPrompt = `You are the Executive Assistant (EA) to Scotty, VP of Sales & Marketing. Your role is to synthesize outputs from multiple AI agents into ONE polished, executive-ready deliverable.

You have received outputs from ${agentOutputs.length} agents: ${agentOutputs.map(a => a.agentName).join(', ')}.

Your task:
1. Review all agent outputs for completeness and quality
2. Organize into a cohesive structure with clear sections
3. Add an executive summary (3-5 key points)
4. Include an implementation roadmap with timeline
5. Add success metrics and KPIs
6. Provide recommended next steps
7. Format professionally with clear headings

Output as markdown with professional formatting.`;

  const userPrompt = `Original Request: ${taskDescription}

Agent Outputs:

${agentOutputs.map((output, index) => `
## Output ${index + 1}: ${output.agentName} (${output.agentRole})

${output.output}

---
`).join('\n')}

Please synthesize these outputs into one comprehensive, executive-ready deliverable.`;

  try {
    const synthesized = await callOpenAI(
      'gpt-4-turbo-preview',
      eaSystemPrompt,
      userPrompt,
      0.5,
      4000
    );

    return synthesized;
  } catch (error) {
    console.error('EA synthesis error:', error);
    throw error;
  }
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'Marketing Department Backend is running',
    openai: !!process.env.OPENAI_API_KEY,
    deepseek: !!process.env.DEEPSEEK_API_KEY
  });
});

// Get all agents
app.get('/api/agents', (req, res) => {
  const agentList = Object.entries(agents).map(([id, agent]) => ({
    id,
    ...agent
  }));
  res.json(agentList);
});

// Submit new task
app.post('/api/tasks', async (req, res) => {
  try {
    const { description, priority = 'medium' } = req.body;

    if (!description) {
      return res.status(400).json({
        error: 'Task description is required',
        details: 'Please provide a task description in the request body'
      });
    }

    // Validate API keys are configured
    if (!process.env.OPENAI_API_KEY && !process.env.DEEPSEEK_API_KEY) {
      return res.status(503).json({
        error: 'API keys not configured',
        details: 'Both OpenAI and DeepSeek API keys are missing. Please configure at least one in backend/.env file.'
      });
    }

    // Create task
    const taskId = uuidv4();
    const task = {
      id: taskId,
      description,
      priority,
      status: 'analyzing',
      createdAt: new Date().toISOString(),
      activities: [],
      assignedAgents: [],
      outputs: [],
      finalDeliverable: null,
      error: null
    };

    tasks.set(taskId, task);

    // Log activity: Scotty analyzing
    task.activities.push({
      type: 'scotty',
      message: `Scotty is analyzing request: "${description}"`,
      timestamp: new Date().toISOString()
    });

    // Return immediately, process asynchronously
    res.json({
      taskId,
      message: 'Task submitted successfully. Scotty is analyzing your request.',
      status: 'analyzing'
    });

    // Process task asynchronously
    processTask(taskId);

  } catch (error) {
    console.error('Task submission error:', error);
    res.status(500).json({
      error: 'Failed to submit task',
      details: error.message
    });
  }
});

// Get task status
app.get('/api/tasks/:taskId', (req, res) => {
  const task = tasks.get(req.params.taskId);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

// Get all activities for a task (for live feed)
app.get('/api/tasks/:taskId/activities', (req, res) => {
  const task = tasks.get(req.params.taskId);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task.activities);
});

// Process Task (Async)
async function processTask(taskId) {
  const task = tasks.get(taskId);
  if (!task) return;

  try {
    // Step 1: Route task to agent(s)
    const assignedAgentIds = routeTask(task.description);
    task.assignedAgents = assignedAgentIds.map(id => agents[id]);
    task.status = 'routing';
    task.activities.push({
      type: 'scotty',
      message: `Scotty routing to ${assignedAgentIds.length} agent(s): ${task.assignedAgents.map(a => a.name).join(', ')}`,
      timestamp: new Date().toISOString()
    });

    // Step 2: Execute each agent
    task.status = 'executing';
    const agentOutputs = [];

    for (const agentId of assignedAgentIds) {
      const agent = agents[agentId];

      task.activities.push({
        type: 'agent',
        agentId,
        message: `${agent.name} is executing task using ${agent.model}...`,
        timestamp: new Date().toISOString()
      });

      try {
        const output = await executeAgent(agentId, task.description);
        agentOutputs.push(output);
        task.outputs.push(output);

        task.activities.push({
          type: 'agent',
          agentId,
          message: `${agent.name} completed their deliverable.`,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error(`Agent ${agentId} execution error:`, error);

        // Create detailed error message
        let errorMessage = `${agent.name} encountered an error: ${error.message}`;

        // Add helpful context based on error type
        if (error.message.includes('API key')) {
          errorMessage += ` (Check your ${agent.provider === 'openai' ? 'OpenAI' : 'DeepSeek'} API key configuration)`;
        } else if (error.message.includes('rate limit')) {
          errorMessage += ' (Please wait a moment before retrying)';
        } else if (error.message.includes('quota') || error.message.includes('credits')) {
          errorMessage += ' (Check your account billing and credits)';
        }

        task.activities.push({
          type: 'error',
          agentId,
          message: errorMessage,
          timestamp: new Date().toISOString()
        });

        // Track the error but continue with other agents
        task.error = task.error || errorMessage;
      }
    }

    // Step 3: If multi-agent, synthesize with EA
    if (assignedAgentIds.length > 1) {
      task.status = 'synthesizing';
      task.activities.push({
        type: 'ea',
        message: 'EA Agent is synthesizing all outputs into final deliverable...',
        timestamp: new Date().toISOString()
      });

      try {
        const synthesized = await synthesizeOutputs(task.description, agentOutputs);
        task.finalDeliverable = {
          type: 'multi-agent',
          content: synthesized,
          agents: task.assignedAgents.map(a => a.name),
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        console.error('EA synthesis error:', error);
        task.finalDeliverable = {
          type: 'multi-agent-error',
          content: 'Error synthesizing outputs. Individual agent outputs are available.',
          error: error.message,
          timestamp: new Date().toISOString()
        };
      }
    } else {
      // Single agent - use their output directly
      task.finalDeliverable = {
        type: 'single-agent',
        content: agentOutputs[0].output,
        agent: agentOutputs[0].agentName,
        timestamp: new Date().toISOString()
      };
    }

    // Step 4: Mark complete
    task.status = 'completed';
    task.completedAt = new Date().toISOString();
    task.activities.push({
      type: 'complete',
      message: assignedAgentIds.length > 1
        ? 'Project complete! EA Agent has synthesized all outputs into one polished deliverable.'
        : `Task complete! ${task.assignedAgents[0].name} has delivered your ${task.assignedAgents[0].role.toLowerCase()} deliverable.`,
      timestamp: new Date().toISOString()
    });

    // Save deliverable
    const deliverableId = uuidv4();
    deliverables.set(deliverableId, {
      id: deliverableId,
      taskId,
      title: assignedAgentIds.length > 1
        ? 'Complete Marketing Campaign Package'
        : `${task.assignedAgents[0].role} Deliverable`,
      description: assignedAgentIds.length > 1
        ? `Multi-agent collaboration: ${task.assignedAgents.map(a => a.name).join(', ')}`
        : `Created by ${task.assignedAgents[0].name} using ${agents[assignedAgentIds[0]].model}`,
      content: task.finalDeliverable.content,
      createdAt: new Date().toISOString()
    });

    task.deliverableId = deliverableId;

  } catch (error) {
    console.error(`Task ${taskId} processing error:`, error);
    task.status = 'error';

    // Create user-friendly error message
    let errorMessage = error.message;
    if (error.message.includes('API key')) {
      errorMessage = `Configuration Error: ${error.message}. Please check your .env file and restart the server.`;
    } else if (error.message.includes('rate limit')) {
      errorMessage = `Rate Limit: ${error.message}. Please wait a few minutes before submitting new tasks.`;
    } else if (error.message.includes('quota') || error.message.includes('credits') || error.message.includes('billing')) {
      errorMessage = `Account Issue: ${error.message}. Please check your API account billing and usage.`;
    } else {
      errorMessage = `Processing Error: ${error.message}. If this persists, please check the backend logs.`;
    }

    task.error = errorMessage;
    task.activities.push({
      type: 'error',
      message: errorMessage,
      timestamp: new Date().toISOString()
    });

    console.error(`❌ Task ${taskId} failed with error:`, errorMessage);
  }
}

// Get deliverable
app.get('/api/deliverables/:deliverableId', (req, res) => {
  const deliverable = deliverables.get(req.params.deliverableId);
  if (!deliverable) {
    return res.status(404).json({ error: 'Deliverable not found' });
  }
  res.json(deliverable);
});

// Get all deliverables
app.get('/api/deliverables', (req, res) => {
  const allDeliverables = Array.from(deliverables.values())
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(allDeliverables);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Marketing Department Backend running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🔑 OpenAI API Key: ${process.env.OPENAI_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`🔑 DeepSeek API Key: ${process.env.DEEPSEEK_API_KEY ? '✅ Configured' : '❌ Missing'}`);
});
