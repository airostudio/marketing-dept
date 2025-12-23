/**
 * EA (Executive Assistant) Agent
 *
 * The Executive Assistant with 7+ years of expertise in:
 * - Synthesizing complex information into executive summaries
 * - Project coordination and deliverable compilation
 * - Quality assurance and presentation formatting
 * - Cross-functional communication
 * - Stakeholder management
 *
 * EA takes outputs from multiple agents and creates a cohesive,
 * professional final deliverable ready for client presentation.
 */

import { callGemini } from './gemini';
import { WorkflowStep } from '../types/workflow';

export interface AgentOutput {
  agentId: string;
  agentName: string;
  agentRole: string;
  output: string;
  completedAt: string;
  metadata?: Record<string, any>;
}

export interface EADeliverable {
  executiveSummary: string;
  keyFindings: string[];
  agentContributions: {
    agentName: string;
    contribution: string;
    highlights: string[];
  }[];
  recommendations: string[];
  nextSteps: string[];
  fullReport: string;
  metadata: {
    taskDescription: string;
    completedAt: string;
    totalAgents: number;
    complexity: string;
  };
}

/**
 * EA collates all agent outputs into a professional deliverable
 */
export async function collateWithEA(
  taskDescription: string,
  agentOutputs: AgentOutput[],
  complexity: string = 'moderate'
): Promise<EADeliverable> {

  const systemPrompt = `You are an Executive Assistant with 7+ years of expertise in:
- Synthesizing complex multi-source information into clear executive summaries
- Creating professional, client-ready deliverables
- Quality assurance and consistency checking
- Strategic communication and presentation
- Cross-functional coordination

Your role is to take outputs from multiple marketing specialists and create a cohesive,
professional final deliverable that:
1. Provides a clear executive summary (2-3 paragraphs)
2. Highlights key findings and insights
3. Acknowledges each agent's contribution with highlights
4. Offers strategic recommendations
5. Outlines actionable next steps
6. Presents everything in a polished, professional format

You ensure consistency, remove redundancy, and elevate the work to C-suite quality.`;

  const agentOutputsFormatted = agentOutputs.map(output => `
**${output.agentName}** (${output.agentRole})
Completed: ${output.completedAt}

${output.output}

---
  `).join('\n');

  const userPrompt = `Original Task:
"${taskDescription}"

Complexity Level: ${complexity}
Total Agents Involved: ${agentOutputs.length}

Agent Outputs:
${agentOutputsFormatted}

Please collate these outputs into a professional, executive-ready deliverable with:

1. **Executive Summary**: 2-3 paragraph overview of what was accomplished and key outcomes

2. **Key Findings**: 5-7 bullet points of the most important insights/deliverables

3. **Agent Contributions**: For each agent, summarize their contribution and list 2-3 highlights

4. **Recommendations**: 3-5 strategic recommendations based on the work

5. **Next Steps**: 3-5 actionable next steps to move forward

6. **Full Report**: A comprehensive, well-structured report combining all agent outputs into a cohesive narrative

Respond in JSON format:
{
  "executiveSummary": "...",
  "keyFindings": ["...", "..."],
  "agentContributions": [
    {
      "agentName": "Name",
      "contribution": "Summary",
      "highlights": ["...", "..."]
    }
  ],
  "recommendations": ["...", "..."],
  "nextSteps": ["...", "..."],
  "fullReport": "Complete formatted report..."
}`;

  try {
    const response = await callGemini(systemPrompt, userPrompt);

    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse EA response');
    }

    const deliverable = JSON.parse(jsonMatch[0]) as Omit<EADeliverable, 'metadata'>;

    // Add metadata
    return {
      ...deliverable,
      metadata: {
        taskDescription,
        completedAt: new Date().toISOString(),
        totalAgents: agentOutputs.length,
        complexity
      }
    };

  } catch (error) {
    console.error('EA collation failed - Production system requires valid API keys:', error);

    // Re-throw the error - NO FALLBACK in production
    throw new Error(
      error instanceof Error
        ? `EA deliverable creation failed: ${error.message}`
        : 'EA deliverable creation failed: Unknown error'
    );
  }
}

/**
 * Format deliverable for display/export
 */
export function formatDeliverableAsMarkdown(deliverable: EADeliverable): string {
  return `# Project Deliverable

## Executive Summary

${deliverable.executiveSummary}

---

## Key Findings

${deliverable.keyFindings.map((finding, i) => `${i + 1}. ${finding}`).join('\n')}

---

## Team Contributions

${deliverable.agentContributions.map(contrib => `
### ${contrib.agentName}

${contrib.contribution}

**Highlights:**
${contrib.highlights.map(h => `- ${h}`).join('\n')}
`).join('\n')}

---

## Recommendations

${deliverable.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

---

## Next Steps

${deliverable.nextSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

---

## Full Report

${deliverable.fullReport}

---

## Metadata

- **Task**: ${deliverable.metadata.taskDescription}
- **Completed**: ${new Date(deliverable.metadata.completedAt).toLocaleString()}
- **Agents Involved**: ${deliverable.metadata.totalAgents}
- **Complexity**: ${deliverable.metadata.complexity}
`;
}

/**
 * Format deliverable as HTML for rich display
 */
export function formatDeliverableAsHTML(deliverable: EADeliverable): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Project Deliverable</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 20px;
      color: #333;
    }
    h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
    h2 { color: #1e40af; margin-top: 30px; }
    h3 { color: #3b82f6; }
    .executive-summary {
      background: #eff6ff;
      padding: 20px;
      border-left: 4px solid #2563eb;
      margin: 20px 0;
    }
    .key-findings {
      background: #f0fdf4;
      padding: 20px;
      border-radius: 8px;
    }
    .agent-contribution {
      background: #fefce8;
      padding: 15px;
      margin: 15px 0;
      border-radius: 8px;
    }
    .recommendations {
      background: #fef2f2;
      padding: 20px;
      border-radius: 8px;
    }
    ul { padding-left: 25px; }
    li { margin: 8px 0; }
    .metadata {
      background: #f9fafb;
      padding: 15px;
      border-radius: 8px;
      margin-top: 30px;
      font-size: 0.9em;
      color: #666;
    }
  </style>
</head>
<body>
  <h1>🎯 Project Deliverable</h1>

  <div class="executive-summary">
    <h2>Executive Summary</h2>
    <p>${deliverable.executiveSummary.replace(/\n/g, '</p><p>')}</p>
  </div>

  <div class="key-findings">
    <h2>📊 Key Findings</h2>
    <ol>
      ${deliverable.keyFindings.map(f => `<li>${f}</li>`).join('')}
    </ol>
  </div>

  <h2>👥 Team Contributions</h2>
  ${deliverable.agentContributions.map(contrib => `
    <div class="agent-contribution">
      <h3>${contrib.agentName}</h3>
      <p>${contrib.contribution}</p>
      <strong>Highlights:</strong>
      <ul>
        ${contrib.highlights.map(h => `<li>${h}</li>`).join('')}
      </ul>
    </div>
  `).join('')}

  <div class="recommendations">
    <h2>💡 Recommendations</h2>
    <ol>
      ${deliverable.recommendations.map(r => `<li>${r}</li>`).join('')}
    </ol>
  </div>

  <h2>✅ Next Steps</h2>
  <ol>
    ${deliverable.nextSteps.map(s => `<li>${s}</li>`).join('')}
  </ol>

  <h2>📄 Full Report</h2>
  <div>
    ${deliverable.fullReport.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}
  </div>

  <div class="metadata">
    <h3>Metadata</h3>
    <p><strong>Task:</strong> ${deliverable.metadata.taskDescription}</p>
    <p><strong>Completed:</strong> ${new Date(deliverable.metadata.completedAt).toLocaleString()}</p>
    <p><strong>Agents Involved:</strong> ${deliverable.metadata.totalAgents}</p>
    <p><strong>Complexity:</strong> ${deliverable.metadata.complexity}</p>
  </div>
</body>
</html>`;
}

/**
 * Export deliverable to file
 */
export function exportDeliverable(
  deliverable: EADeliverable,
  format: 'markdown' | 'html' | 'json'
): { filename: string; content: string } {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);

  switch (format) {
    case 'markdown':
      return {
        filename: `deliverable-${timestamp}.md`,
        content: formatDeliverableAsMarkdown(deliverable)
      };
    case 'html':
      return {
        filename: `deliverable-${timestamp}.html`,
        content: formatDeliverableAsHTML(deliverable)
      };
    case 'json':
      return {
        filename: `deliverable-${timestamp}.json`,
        content: JSON.stringify(deliverable, null, 2)
      };
    default:
      return {
        filename: `deliverable-${timestamp}.txt`,
        content: formatDeliverableAsMarkdown(deliverable)
      };
  }
}
