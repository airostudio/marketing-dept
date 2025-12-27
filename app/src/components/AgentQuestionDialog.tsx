import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, Send, X } from 'lucide-react'
import { Worker } from '../store/useStore'

export interface AgentQuestion {
  id: string
  question: string
  placeholder: string
  required: boolean
}

interface AgentQuestionDialogProps {
  worker: Worker
  taskTitle: string
  taskDescription: string
  onSubmit: (answers: Record<string, string>) => void
  onSkip: () => void
  onCancel: () => void
}

// Generate context-aware questions based on agent type and task
function generateQuestionsForAgent(worker: Worker, _taskTitle: string, _taskDescription: string): AgentQuestion[] {
  const questions: AgentQuestion[] = []

  // Marcus Hayes - Content Strategist (Phase 1: Diagnosis)
  if (worker.id === 'marcus') {
    questions.push(
      {
        id: 'business_model',
        question: 'What is your business model and primary revenue source?',
        placeholder: 'e.g., B2B SaaS with annual subscriptions',
        required: true,
      },
      {
        id: 'target_audience',
        question: 'Who is your target audience? (Industry, company size, role)',
        placeholder: 'e.g., Enterprise CIOs at companies with 500+ employees',
        required: true,
      },
      {
        id: 'current_traffic',
        question: 'What is your current monthly organic traffic and top 3 traffic sources?',
        placeholder: 'e.g., 25K monthly visitors from Google, LinkedIn, Email',
        required: false,
      },
      {
        id: 'primary_goals',
        question: 'What are your primary content goals? (Traffic, leads, brand awareness, conversions)',
        placeholder: 'e.g., Generate 500 MQLs per month, increase organic traffic by 30%',
        required: true,
      },
      {
        id: 'current_challenges',
        question: 'What are your biggest content/SEO challenges right now?',
        placeholder: 'e.g., Low conversion rate, keyword cannibalization, outdated content',
        required: false,
      }
    )
  }

  // Jasper - Content Writer
  if (worker.id === 'jasper') {
    questions.push(
      {
        id: 'audience_persona',
        question: 'Who is the specific audience for this content?',
        placeholder: 'e.g., Mid-level marketing managers looking to improve ROI',
        required: true,
      },
      {
        id: 'tone_voice',
        question: 'What tone and voice should this content have?',
        placeholder: 'e.g., Professional yet conversational, data-driven but accessible',
        required: true,
      },
      {
        id: 'content_goal',
        question: 'What action should readers take after reading this content?',
        placeholder: 'e.g., Sign up for demo, download whitepaper, share on LinkedIn',
        required: true,
      },
      {
        id: 'key_points',
        question: 'What are 3-5 key points or messages this content must include?',
        placeholder: 'e.g., Cost savings, ease of implementation, proven ROI',
        required: false,
      }
    )
  }

  // Scotty - VP (Strategic Planning)
  if (worker.id === 'scotty') {
    questions.push(
      {
        id: 'campaign_objective',
        question: 'What is the primary business objective for this campaign?',
        placeholder: 'e.g., Generate 200 SQLs, launch new product, enter new market',
        required: true,
      },
      {
        id: 'target_segments',
        question: 'What are your target customer segments and priority order?',
        placeholder: 'e.g., 1) Enterprise healthcare, 2) Mid-market finance, 3) SMB retail',
        required: true,
      },
      {
        id: 'budget_timeline',
        question: 'What is your budget range and timeline for this campaign?',
        placeholder: 'e.g., $50K budget over 3 months',
        required: true,
      },
      {
        id: 'success_metrics',
        question: 'What metrics define success for this campaign?',
        placeholder: 'e.g., 150 MQLs, 30% MQL-to-SQL rate, $200K pipeline',
        required: true,
      }
    )
  }

  // Zoey - Lead Prospecting
  if (worker.id === 'zoey') {
    questions.push(
      {
        id: 'icp_criteria',
        question: 'What are your ideal customer profile (ICP) criteria?',
        placeholder: 'e.g., B2B SaaS, 100-1000 employees, $10M+ revenue, North America',
        required: true,
      },
      {
        id: 'target_roles',
        question: 'What job titles/roles are you targeting?',
        placeholder: 'e.g., VP Sales, Director of Marketing, CRO',
        required: true,
      },
      {
        id: 'industry_focus',
        question: 'Any specific industries to focus on or exclude?',
        placeholder: 'e.g., Focus: Healthcare, Finance | Exclude: Non-profit',
        required: false,
      },
      {
        id: 'lead_volume',
        question: 'How many qualified leads do you need?',
        placeholder: 'e.g., 500 prospects per month',
        required: true,
      }
    )
  }

  // Casey - Copywriter
  if (worker.id === 'casey') {
    questions.push(
      {
        id: 'copy_purpose',
        question: 'What is the primary purpose of this copy?',
        placeholder: 'e.g., Drive webinar signups, promote product launch, increase trial conversions',
        required: true,
      },
      {
        id: 'target_channel',
        question: 'Where will this copy be used?',
        placeholder: 'e.g., LinkedIn ads, email subject lines, landing page headlines',
        required: true,
      },
      {
        id: 'competitive_angle',
        question: 'What makes your offer different from competitors?',
        placeholder: 'e.g., Only solution with real-time sync, 10x faster than alternatives',
        required: true,
      }
    )
  }

  // Sage - Email Marketing
  if (worker.id === 'sage') {
    questions.push(
      {
        id: 'campaign_type',
        question: 'What type of email campaign is this?',
        placeholder: 'e.g., Nurture sequence, product announcement, re-engagement',
        required: true,
      },
      {
        id: 'audience_segment',
        question: 'What audience segment are you targeting?',
        placeholder: 'e.g., Trial users who haven\'t activated, enterprise prospects',
        required: true,
      },
      {
        id: 'email_goal',
        question: 'What is the primary goal of this email?',
        placeholder: 'e.g., Book demo, upgrade to paid, attend webinar',
        required: true,
      }
    )
  }

  // Smarta - Social Advertising
  if (worker.id === 'smarta') {
    questions.push(
      {
        id: 'campaign_platform',
        question: 'Which platform(s) should this campaign run on?',
        placeholder: 'e.g., LinkedIn, Facebook, Twitter, Instagram',
        required: true,
      },
      {
        id: 'target_audience',
        question: 'Describe your target audience demographics and interests',
        placeholder: 'e.g., Tech executives, 35-55, interested in AI/automation',
        required: true,
      },
      {
        id: 'roas_target',
        question: 'What is your target ROAS or cost per acquisition?',
        placeholder: 'e.g., 3x ROAS, $100 cost per MQL',
        required: true,
      }
    )
  }

  // Surfy - SEO Specialist
  if (worker.id === 'surfy') {
    questions.push(
      {
        id: 'target_keywords',
        question: 'Do you have specific target keywords in mind?',
        placeholder: 'e.g., marketing automation software, B2B lead generation',
        required: false,
      },
      {
        id: 'seo_goal',
        question: 'What is your primary SEO goal?',
        placeholder: 'e.g., Rank in top 3 for target keywords, fix technical issues',
        required: true,
      },
      {
        id: 'geographic_focus',
        question: 'What geographic regions are you targeting?',
        placeholder: 'e.g., United States, Global English-speaking',
        required: false,
      }
    )
  }

  // Dynamo - Personalization/CRO
  if (worker.id === 'dynamo') {
    questions.push(
      {
        id: 'optimization_goal',
        question: 'What are you trying to optimize?',
        placeholder: 'e.g., Landing page conversion, signup flow, product page engagement',
        required: true,
      },
      {
        id: 'current_performance',
        question: 'What is your current conversion rate/performance?',
        placeholder: 'e.g., 2.5% conversion rate, 45% bounce rate',
        required: false,
      },
      {
        id: 'visitor_segments',
        question: 'What visitor segments should we personalize for?',
        placeholder: 'e.g., First-time visitors, returning users, enterprise vs SMB',
        required: true,
      }
    )
  }

  // Analyzer - Data Analytics
  if (worker.id === 'analyzer') {
    questions.push(
      {
        id: 'business_question',
        question: 'What specific business question are you trying to answer?',
        placeholder: 'e.g., Which channels drive highest quality leads? What content converts best?',
        required: true,
      },
      {
        id: 'data_sources',
        question: 'What data sources should I analyze?',
        placeholder: 'e.g., Google Analytics, CRM, ad platforms, marketing automation',
        required: true,
      },
      {
        id: 'time_period',
        question: 'What time period should I analyze?',
        placeholder: 'e.g., Last quarter, year-over-year, last 30 days',
        required: true,
      }
    )
  }

  // Hunter - Email Finder
  if (worker.id === 'hunter') {
    questions.push(
      {
        id: 'contact_list',
        question: 'Do you have a list of names/companies to find emails for?',
        placeholder: 'e.g., List of 100 target companies and contact names',
        required: true,
      },
      {
        id: 'verification_level',
        question: 'What verification confidence level do you need?',
        placeholder: 'e.g., High confidence only (95%+), Medium (80%+)',
        required: false,
      }
    )
  }

  // Heatley - UX Analysis
  if (worker.id === 'heatley') {
    questions.push(
      {
        id: 'pages_to_analyze',
        question: 'Which pages or flows should I analyze?',
        placeholder: 'e.g., Homepage, pricing page, signup flow',
        required: true,
      },
      {
        id: 'friction_concerns',
        question: 'What friction points or concerns do you have?',
        placeholder: 'e.g., High bounce rate, users not scrolling, abandoning at checkout',
        required: false,
      }
    )
  }

  // Chatty - Customer Support
  if (worker.id === 'chatty') {
    questions.push(
      {
        id: 'support_scope',
        question: 'What support tasks should I handle?',
        placeholder: 'e.g., Answer pricing questions, troubleshoot onboarding, product FAQs',
        required: true,
      },
      {
        id: 'escalation_criteria',
        question: 'When should I escalate to human support?',
        placeholder: 'e.g., Technical bugs, billing disputes, enterprise contracts',
        required: true,
      }
    )
  }

  // If no specific questions, provide generic questions
  if (questions.length === 0) {
    questions.push(
      {
        id: 'context',
        question: 'What additional context can you provide about this task?',
        placeholder: 'Any relevant background information...',
        required: false,
      },
      {
        id: 'success_criteria',
        question: 'What does success look like for this task?',
        placeholder: 'How will we know this task is complete?',
        required: true,
      }
    )
  }

  return questions
}

export default function AgentQuestionDialog({
  worker,
  taskTitle,
  taskDescription,
  onSubmit,
  onSkip,
  onCancel,
}: AgentQuestionDialogProps) {
  const questions = generateQuestionsForAgent(worker, taskTitle, taskDescription)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const handleSubmit = () => {
    // Validate required questions
    const missingRequired = questions.filter(q => q.required && !answers[q.id]?.trim())
    if (missingRequired.length > 0) {
      return
    }
    onSubmit(answers)
  }

  const allRequiredAnswered = questions
    .filter(q => q.required)
    .every(q => answers[q.id]?.trim())

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onCancel}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="gradient-primary p-6 text-white">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
                  {worker.emoji}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{worker.name} has questions</h2>
                  <p className="text-white/90 text-sm">{worker.role}</p>
                </div>
              </div>
              <button
                onClick={onCancel}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <p className="text-sm text-white/90 mb-1">
                <strong>Task:</strong> {taskTitle}
              </p>
              {taskDescription && (
                <p className="text-sm text-white/80">{taskDescription}</p>
              )}
            </div>
          </div>

          {/* Questions */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-4 flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <strong className="block mb-1">Before I get started...</strong>
                I need to understand your specific needs to deliver the best results. Please answer these questions so I can tailor my approach to your goals.
              </div>
            </div>

            <div className="space-y-5">
              {questions.map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="space-y-2"
                >
                  <label className="block">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {question.question}
                        {question.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </span>
                    </div>
                    <textarea
                      className="input w-full min-h-[80px] resize-y"
                      placeholder={question.placeholder}
                      value={answers[question.id] || ''}
                      onChange={(e) =>
                        setAnswers({ ...answers, [question.id]: e.target.value })
                      }
                    />
                  </label>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-semibold">{questions.filter(q => q.required).length}</span> required question(s)
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onSkip}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                >
                  Skip Questions
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!allRequiredAnswered}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  Submit & Continue
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
