import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Workflow } from '../types/workflow'
import { geminiService } from '../services/gemini'
import { deepseekService } from '../services/deepseek'
import { openaiService } from '../services/openai'

export interface ApiCredentials {
  gemini?: string
  deepseek?: string
  openai?: string
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
}

// Auto-initialize from environment variables
function initializeFromEnv() {
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY
  const deepseekKey = import.meta.env.VITE_DEEPSEEK_API_KEY
  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY

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

  if (openaiKey) {
    credentials.openai = openaiKey
    openaiService.initialize(openaiKey)
    console.log('✅ OpenAI (ChatGPT) API initialized from environment')
  }

  return {
    credentials,
    isSetupComplete: !!(geminiKey || deepseekKey || openaiKey)
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
          name: 'Scott Morrison',
          emoji: '👔',
          role: 'VP of Sales & Marketing',
          department: 'Executive Leadership',
          platform: 'OpenAI GPT-4',
          status: 'active',
          metrics: {}
        },
        {
          id: 'madison',
          name: 'Madison Clarke',
          emoji: '📋',
          role: 'Executive Assistant',
          department: 'Executive Leadership',
          platform: 'OpenAI GPT-4',
          status: 'active',
          metrics: {}
        },
        {
          id: 'jasper',
          name: 'James Parker',
          emoji: '✍️',
          role: 'Senior Content Writer',
          department: 'Content Creation',
          platform: 'OpenAI GPT-4',
          status: 'idle',
          metrics: {}
        },
        {
          id: 'marcus',
          name: 'Marcus Hayes',
          emoji: '📚',
          role: 'Senior Content Strategist & SEO Lead',
          department: 'Content Strategy',
          platform: 'OpenAI GPT-4',
          status: 'idle',
          metrics: {}
        },
        {
          id: 'casey',
          name: 'Casey Rodriguez',
          emoji: '📝',
          role: 'Senior Copywriter',
          department: 'Content Creation',
          platform: 'OpenAI GPT-4',
          status: 'idle',
          metrics: {}
        },
        {
          id: 'zoey',
          name: 'Zoe Mitchell',
          emoji: '🔍',
          role: 'Lead Prospecting Specialist',
          department: 'Lead Generation',
          platform: 'DeepSeek',
          status: 'idle',
          metrics: {}
        },
        {
          id: 'hunter',
          name: 'Hunter Brooks',
          emoji: '🎯',
          role: 'Email Finder & Verification Specialist',
          department: 'Lead Generation',
          platform: 'DeepSeek',
          status: 'idle',
          metrics: {}
        },
        {
          id: 'sage',
          name: 'Sarah Gibson',
          emoji: '📧',
          role: 'Email Marketing Manager',
          department: 'Email Marketing',
          platform: 'OpenAI GPT-4',
          status: 'idle',
          metrics: {}
        },
        {
          id: 'smarta',
          name: 'Samuel Martinez',
          emoji: '📱',
          role: 'Paid Social Media Manager',
          department: 'Social Media',
          platform: 'Google Gemini',
          status: 'idle',
          metrics: {}
        },
        {
          id: 'dynamo',
          name: 'Diana Morrison',
          emoji: '🎨',
          role: 'CRO & Personalization Lead',
          department: 'Personalization',
          platform: 'OpenAI GPT-4',
          status: 'idle',
          metrics: {}
        },
        {
          id: 'analyzer',
          name: 'Alex Chen',
          emoji: '📊',
          role: 'Senior Data Analyst',
          department: 'Analytics',
          platform: 'DeepSeek',
          status: 'idle',
          metrics: {}
        },
        {
          id: 'heatley',
          name: 'Hannah Lee',
          emoji: '🔥',
          role: 'UX Research Analyst',
          department: 'Analytics',
          platform: 'DeepSeek',
          status: 'idle',
          metrics: {}
        },
        {
          id: 'surfy',
          name: 'Steven Foster',
          emoji: '🏄',
          role: 'SEO Specialist',
          department: 'SEO',
          platform: 'Google Gemini',
          status: 'idle',
          metrics: {}
        },
        {
          id: 'chatty',
          name: 'Charlotte Adams',
          emoji: '💬',
          role: 'Customer Success Manager',
          department: 'Customer Support',
          platform: 'OpenAI GPT-4',
          status: 'idle',
          metrics: {}
        },
      ],
      tasks: [],
      workflows: [],
      activeWorkflowId: undefined,

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
        } else if (platform === 'openai' && key) {
          openaiService.initialize(key)
        }
      },

      verifyApi: async (platform) => {
        const credentials = get().apiCredentials
        const apiKey = credentials[platform as keyof ApiCredentials]

        if (!apiKey) return false

        // TODO: Implement actual API verification
        // For now, simulate verification
        await new Promise(resolve => setTimeout(resolve, 1000))

        set((state) => ({
          verifiedApis: [...state.verifiedApis, platform],
        }))

        return true
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
    }),
    {
      name: 'ai-marketing-storage',
    }
  )
)
