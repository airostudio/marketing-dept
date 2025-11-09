import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ApiCredentials {
  googleGemini?: string
  rytrAi?: string
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
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // Initial state
      isSetupComplete: false,
      apiCredentials: {},
      verifiedApis: [],
      workers: [
        {
          id: 'jasper',
          name: 'Jasper',
          emoji: '✍️',
          role: 'Content Creation Lead',
          department: 'Content Creation',
          platform: 'Google Gemini',
          status: 'idle',
          metrics: {}
        },
        {
          id: 'casey',
          name: 'Casey',
          emoji: '📝',
          role: 'AI Copywriter',
          department: 'Content Creation',
          platform: 'Rytr AI',
          status: 'idle',
          metrics: {}
        },
        {
          id: 'zoey',
          name: 'Zoey',
          emoji: '🔍',
          role: 'Lead Prospecting Specialist',
          department: 'Lead Generation',
          platform: 'ZoomInfo',
          status: 'idle',
          metrics: {}
        },
        {
          id: 'hunter',
          name: 'Hunter',
          emoji: '🎯',
          role: 'Email Finder Specialist',
          department: 'Lead Generation',
          platform: 'Hunter.io',
          status: 'idle',
          metrics: {}
        },
        {
          id: 'sage',
          name: 'Sage',
          emoji: '⏰',
          role: 'Email Campaign Manager',
          department: 'Email Marketing',
          platform: 'Mailchimp',
          status: 'idle',
          metrics: {}
        },
        {
          id: 'smarta',
          name: 'Smarta',
          emoji: '🎯',
          role: 'Social Advertising Manager',
          department: 'Social Media',
          platform: 'Smartly.io',
          status: 'idle',
          metrics: {}
        },
        {
          id: 'dynamo',
          name: 'Dynamo',
          emoji: '🎨',
          role: 'Experience Optimization Lead',
          department: 'Personalization',
          platform: 'Dynamic Yield',
          status: 'idle',
          metrics: {}
        },
        {
          id: 'analyzer',
          name: 'Analyzer',
          emoji: '📊',
          role: 'Data Analytics Specialist',
          department: 'Analytics',
          platform: 'Google Analytics',
          status: 'idle',
          metrics: {}
        },
        {
          id: 'heatley',
          name: 'Heatley',
          emoji: '🔥',
          role: 'User Experience Analyst',
          department: 'Analytics',
          platform: 'Hotjar',
          status: 'idle',
          metrics: {}
        },
        {
          id: 'surfy',
          name: 'Surfy',
          emoji: '🏄',
          role: 'SEO Optimization Specialist',
          department: 'SEO',
          platform: 'Surfer SEO',
          status: 'idle',
          metrics: {}
        },
        {
          id: 'chatty',
          name: 'Chatty',
          emoji: '💬',
          role: 'Customer Support Specialist',
          department: 'Customer Support',
          platform: 'Intercom',
          status: 'idle',
          metrics: {}
        },
      ],
      tasks: [],

      // Actions
      setApiCredential: (platform, key) => {
        set((state) => ({
          apiCredentials: {
            ...state.apiCredentials,
            [platform]: key,
          },
        }))
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
    }),
    {
      name: 'ai-marketing-storage',
    }
  )
)
