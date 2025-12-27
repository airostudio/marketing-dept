import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Workflow } from '../types/workflow'
import { geminiService } from '../services/gemini'
import { deepseekService } from '../services/deepseek'

export interface ApiCredentials {
  gemini?: string
  deepseek?: string
  jasperAi?: string
  copyAi?: string
  zoomInfo?: string
  hunterIo?: string
  mailchimp?: string
  smartlyIo?: string
  dynamicYield?: string
  googleAnalytics?: string
  hotjar?: string
  surferSeo?: string
  intercom?: string
}

export interface Worker {
  id: string
  name: string
  emoji: string
  role: string
  department: string
  platform: string
  status: 'active' | 'idle' | 'error'
  currentTask?: string
  metrics: Record<string, any>
}

export interface Task {
  id: string
  title: string
  description: string
  department: string
  workerId: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  priority: 'low' | 'medium' | 'high'
  progress: number
  createdAt: string
  completedAt?: string
  result?: any
  error?: string
}

export interface Deliverable {
  id: string
  taskId: string
  status: 'completed' | 'in_progress'
  executiveSummary: string
  keyFindings: string[]
  agentContributions: {
    agentName: string
    contribution: string
    highlights: string[]
  }[]
  recommendations: string[]
  nextSteps: string[]
  fullReport: string
  metadata: {
    taskDescription: string
    completedAt: string
    totalAgents: number
    complexity: string
  }
  completedAt: string
  createdBy: string
}

interface Store {
  // Setup
  isSetupComplete: boolean
  apiCredentials: ApiCredentials
  verifiedApis: string[]

  // Workers
  workers: Worker[]

  // Tasks
  tasks: Task[]

  // Workflows
  workflows: Workflow[]
  activeWorkflowId?: string

  // Deliverables
  deliverables: Deliverable[]

  // Actions
  setApiCredential: (platform: string, key: string) => void
  verifyApi: (platform: string) => Promise<boolean>
  completeSetup: () => void
  resetSetup: () => void

  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void

  updateWorkerStatus: (workerId: string, status: Worker['status']) => void
  updateWorkerMetrics: (workerId: string, metrics: Record<string, any>) => void

  addWorkflow: (workflow: Workflow) => void
  updateWorkflow: (id: string, updates: Partial<Workflow>) => void
  deleteWorkflow: (id: string) => void
  setActiveWorkflow: (id: string | undefined) => void

  addDeliverable: (deliverable: Deliverable) => void
  deleteDeliverable: (id: string) => void
}

// Auto-initialize from environment variables
function initializeFromEnv() {
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY
  const deepseekKey = import.meta.env.VITE_DEEPSEEK_API_KEY

  const credentials: ApiCredentials = {}

  if (geminiKey) {
    credentials.gemini = geminiKey
    geminiService.initialize(geminiKey)
    console.log('✅ Gemini API initialized from environment')
  }

  if (deepseekKey) {
    credentials.deepseek = deepseekKey
    deepseekService.initialize(deepseekKey)
    console.log('✅ DeepSeek API initialized from environment')
  }

  return {
    credentials,
    isSetupComplete: !!(geminiKey || deepseekKey)
  }
}

const envInit = initializeFromEnv()

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // Initial state - with environment variable credentials if available
      isSetupComplete: envInit.isSetupComplete,
      apiCredentials: envInit.credentials,
      verifiedApis: [],
      workers: [
        {
          id: 'scotty',
          name: 'Scotty',
          emoji: '🎯',
          role: 'VP of Sales & Marketing',
          department: 'Executive Leadership',
          platform: 'Gemini',
          status: 'active',
          metrics: {}
        },
        {
          id: 'marcus-hayes',
          name: 'Marcus Hayes',
          emoji: '✍️',
          role: 'Content Strategist & Editorial Director',
          department: 'Content Creation',
          platform: 'Gemini',
          status: 'idle',
          metrics: {}
        },
        {
          id: 'emma-thompson',
          name: 'Emma Thompson',
          emoji: '📝',
          role: 'Direct Response Copywriter',
          department: 'Content Creation',
          platform: 'Gemini',
          status: 'idle',
          metrics: {}
        },
        {
          id: 'sarah-chen',
          name: 'Sarah Chen',
          emoji: '🔍',
          role: 'Lead Generation & Demand Gen Specialist',
          department: 'Lead Generation',
          platform: 'DeepSeek',
          status: 'idle',
          metrics: {}
        },
        {
          id: 'david-kim',
          name: 'David Kim',
          emoji: '🎯',
          role: 'Email Finding & Data Enrichment Specialist',
          department: 'Lead Generation',
          platform: 'DeepSeek',
          status: 'idle',
          metrics: {}
        },
        {
          id: 'emma-wilson',
          name: 'Emma Wilson',
          emoji: '📧',
          role: 'Email Marketing & Automation Architect',
          department: 'Email Marketing',
          platform: 'Gemini',
          status: 'idle',
          metrics: {}
        },
        {
          id: 'alex-rodriguez',
          name: 'Alex Rodriguez',
          emoji: '📱',
          role: 'Paid Social & Performance Marketing Expert',
          department: 'Paid Advertising',
          platform: 'DeepSeek',
          status: 'idle',
          metrics: {}
        },
        {
          id: 'maya-patel',
          name: 'Maya Patel',
          emoji: '🎨',
          role: 'Personalization & CRO Expert',
          department: 'Conversion Optimization',
          platform: 'Gemini',
          status: 'idle',
          metrics: {}
        },
        {
          id: 'ryan-mitchell',
          name: 'Ryan Mitchell',
          emoji: '📊',
          role: 'Marketing Analytics & BI Expert',
          department: 'Analytics',
          platform: 'DeepSeek',
          status: 'idle',
          metrics: {}
        },
        {
          id: 'sophia-anderson',
          name: 'Sophia Anderson',
          emoji: '🔥',
          role: 'UX Research & CRO Specialist',
          department: 'User Experience',
          platform: 'DeepSeek',
          status: 'idle',
          metrics: {}
        },
        {
          id: 'oscar-wright',
          name: 'Oscar Wright',
          emoji: '🔍',
          role: 'Technical SEO & Organic Growth Strategist',
          department: 'SEO',
          platform: 'Gemini',
          status: 'idle',
          metrics: {}
        },
        {
          id: 'natalie-brooks',
          name: 'Natalie Brooks',
          emoji: '💬',
          role: 'Customer Support & CX Specialist',
          department: 'Customer Support',
          platform: 'Gemini',
          status: 'idle',
          metrics: {}
        },
      ],
      tasks: [],
      workflows: [],
      activeWorkflowId: undefined,
      deliverables: [],

      // Actions
      setApiCredential: (platform, key) => {
        set((state) => ({
          apiCredentials: {
            ...state.apiCredentials,
            [platform]: key,
          },
        }))

        // Initialize AI services when API keys are set
        if (platform === 'gemini' && key) {
          geminiService.initialize(key)
        } else if (platform === 'deepseek' && key) {
          deepseekService.initialize(key)
        }
      },

      verifyApi: async (platform) => {
        const credentials = get().apiCredentials
        const apiKey = credentials[platform as keyof ApiCredentials]

        if (!apiKey) return false

        try {
          // Actually test the API key with a real API call
          if (platform === 'gemini') {
            const response = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: 'test' }] }],
                }),
              }
            )

            if (!response.ok) {
              console.error('Gemini API verification failed:', await response.text())
              return false
            }

            geminiService.initialize(apiKey)
          } else if (platform === 'deepseek') {
            const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
              },
              body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [{ role: 'user', content: 'test' }],
                max_tokens: 10,
              }),
            })

            if (!response.ok) {
              console.error('DeepSeek API verification failed:', await response.text())
              return false
            }

            deepseekService.initialize(apiKey)
          }

          set((state) => ({
            verifiedApis: [...state.verifiedApis.filter((p) => p !== platform), platform],
          }))

          return true
        } catch (error) {
          console.error(`API verification failed for ${platform}:`, error)
          return false
        }
      },

      completeSetup: () => {
        set({ isSetupComplete: true })
      },

      resetSetup: () => {
        set({
          isSetupComplete: false,
          apiCredentials: {},
          verifiedApis: [],
        })
      },

      addTask: (task) => {
        const newTask: Task = {
          ...task,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          tasks: [newTask, ...state.tasks],
        }))

        // Update worker status
        get().updateWorkerStatus(task.workerId, 'active')
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        }))
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }))
      },

      updateWorkerStatus: (workerId, status) => {
        set((state) => ({
          workers: state.workers.map((worker) =>
            worker.id === workerId ? { ...worker, status } : worker
          ),
        }))
      },

      updateWorkerMetrics: (workerId, metrics) => {
        set((state) => ({
          workers: state.workers.map((worker) =>
            worker.id === workerId
              ? { ...worker, metrics: { ...worker.metrics, ...metrics } }
              : worker
          ),
        }))
      },

      addWorkflow: (workflow) => {
        set((state) => ({
          workflows: [workflow, ...state.workflows],
        }))
      },

      updateWorkflow: (id, updates) => {
        set((state) => ({
          workflows: state.workflows.map((workflow) =>
            workflow.id === id ? { ...workflow, ...updates } : workflow
          ),
        }))
      },

      deleteWorkflow: (id) => {
        set((state) => ({
          workflows: state.workflows.filter((workflow) => workflow.id !== id),
          activeWorkflowId: state.activeWorkflowId === id ? undefined : state.activeWorkflowId,
        }))
      },

      setActiveWorkflow: (id) => {
        set({ activeWorkflowId: id })
      },

      addDeliverable: (deliverable) => {
        set((state) => ({
          deliverables: [deliverable, ...state.deliverables],
        }))
      },

      deleteDeliverable: (id) => {
        set((state) => ({
          deliverables: state.deliverables.filter((d) => d.id !== id),
        }))
      },
    }),
    {
      name: 'ai-marketing-storage',
    }
  )
)
