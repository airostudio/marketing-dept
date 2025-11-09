import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getInitialCredentialsFromEnv, getApiKey as getEnvApiKey, isEnvKey } from '../utils/env'

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
  platformKey: string // Maps to ApiCredentials key
  status: 'active' | 'idle' | 'error'
  apiConnected: boolean
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
  updateWorkerConnection: (workerId: string, connected: boolean) => void
  testAllApiConnections: () => Promise<void>

  // Helper methods for environment variables
  getApiKey: (platform: string) => string | undefined
  hasEnvKey: (platform: string) => boolean
}

// Initialize with environment variables
const envCredentials = getInitialCredentialsFromEnv()
const hasEnvCredentials = Object.keys(envCredentials).length > 0

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // Initial state - auto-populate from environment variables
      isSetupComplete: hasEnvCredentials,
      apiCredentials: envCredentials,
      verifiedApis: hasEnvCredentials ? Object.keys(envCredentials) : [],
      workers: [
        {
          id: 'jasper',
          name: 'Jasper',
          emoji: '✍️',
          role: 'Content Creation Lead',
          department: 'Content Creation',
          platform: 'Google Gemini',
          platformKey: 'googleGemini',
          status: 'idle',
          apiConnected: false,
          metrics: {}
        },
        {
          id: 'casey',
          name: 'Casey',
          emoji: '📝',
          role: 'AI Copywriter',
          department: 'Content Creation',
          platform: 'Rytr AI',
          platformKey: 'rytrAi',
          status: 'idle',
          apiConnected: false,
          metrics: {}
        },
        {
          id: 'zoey',
          name: 'Zoey',
          emoji: '🔍',
          role: 'Lead Prospecting Specialist',
          department: 'Lead Generation',
          platform: 'ZoomInfo',
          platformKey: 'zoomInfo',
          status: 'idle',
          apiConnected: false,
          metrics: {}
        },
        {
          id: 'hunter',
          name: 'Hunter',
          emoji: '🎯',
          role: 'Email Finder Specialist',
          department: 'Lead Generation',
          platform: 'Hunter.io',
          platformKey: 'hunterIo',
          status: 'idle',
          apiConnected: false,
          metrics: {}
        },
        {
          id: 'sage',
          name: 'Sage',
          emoji: '⏰',
          role: 'Email Campaign Manager',
          department: 'Email Marketing',
          platform: 'Mailchimp',
          platformKey: 'mailchimp',
          status: 'idle',
          apiConnected: false,
          metrics: {}
        },
        {
          id: 'smarta',
          name: 'Smarta',
          emoji: '🎯',
          role: 'Social Advertising Manager',
          department: 'Social Media',
          platform: 'Smartly.io',
          platformKey: 'smartlyIo',
          status: 'idle',
          apiConnected: false,
          metrics: {}
        },
        {
          id: 'dynamo',
          name: 'Dynamo',
          emoji: '🎨',
          role: 'Experience Optimization Lead',
          department: 'Personalization',
          platform: 'Dynamic Yield',
          platformKey: 'dynamicYield',
          status: 'idle',
          apiConnected: false,
          metrics: {}
        },
        {
          id: 'analyzer',
          name: 'Analyzer',
          emoji: '📊',
          role: 'Data Analytics Specialist',
          department: 'Analytics',
          platform: 'Google Analytics',
          platformKey: 'googleAnalytics',
          status: 'idle',
          apiConnected: false,
          metrics: {}
        },
        {
          id: 'heatley',
          name: 'Heatley',
          emoji: '🔥',
          role: 'User Experience Analyst',
          department: 'Analytics',
          platform: 'Hotjar',
          platformKey: 'hotjar',
          status: 'idle',
          apiConnected: false,
          metrics: {}
        },
        {
          id: 'surfy',
          name: 'Surfy',
          emoji: '🏄',
          role: 'SEO Optimization Specialist',
          department: 'SEO',
          platform: 'Surfer SEO',
          platformKey: 'surferSeo',
          status: 'idle',
          apiConnected: false,
          metrics: {}
        },
        {
          id: 'chatty',
          name: 'Chatty',
          emoji: '💬',
          role: 'Customer Support Specialist',
          department: 'Customer Support',
          platform: 'Intercom',
          platformKey: 'intercom',
          status: 'idle',
          apiConnected: false,
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
        const apiKey = get().getApiKey(platform)

        if (!apiKey) return false

        // TODO: Implement actual API verification
        // For now, simulate verification
        await new Promise(resolve => setTimeout(resolve, 1000))

        set((state) => ({
          verifiedApis: [...new Set([...state.verifiedApis, platform])],
        }))

        return true
      },

      completeSetup: () => {
        set({ isSetupComplete: true })
      },

      resetSetup: () => {
        // Keep environment variables, only reset user-entered keys
        const envCreds = getInitialCredentialsFromEnv()
        set({
          isSetupComplete: Object.keys(envCreds).length > 0,
          apiCredentials: envCreds,
          verifiedApis: Object.keys(envCreds),
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

      updateWorkerConnection: (workerId, connected) => {
        set((state) => ({
          workers: state.workers.map((worker) =>
            worker.id === workerId ? { ...worker, apiConnected: connected } : worker
          ),
        }))
      },

      testAllApiConnections: async () => {
        const state = get()
        const workers = state.workers

        // Test each worker's API connection
        for (const worker of workers) {
          const apiKey = state.getApiKey(worker.platformKey)

          // If API key exists and is not a placeholder, mark as connected
          if (apiKey &&
              apiKey !== 'your_google_gemini_api_key_here' &&
              apiKey !== 'your_rytr_api_key_here' &&
              apiKey.length > 0) {
            get().updateWorkerConnection(worker.id, true)
          } else {
            get().updateWorkerConnection(worker.id, false)
          }
        }
      },

      // Helper methods
      getApiKey: (platform) => {
        const credentials = get().apiCredentials as Record<string, string | undefined>
        return getEnvApiKey(platform, credentials)
      },

      hasEnvKey: (platform) => {
        return isEnvKey(platform)
      },
    }),
    {
      name: 'ai-marketing-storage',
      onRehydrateStorage: () => (state) => {
        // After rehydration, check if we have env vars and override setup completion
        const envCreds = getInitialCredentialsFromEnv()
        const hasEnvCreds = Object.keys(envCreds).length > 0

        if (hasEnvCreds && state) {
          // Override with environment variables
          state.isSetupComplete = true
          state.apiCredentials = { ...state.apiCredentials, ...envCreds }
          state.verifiedApis = [...new Set([...state.verifiedApis, ...Object.keys(envCreds)])]
        }

        // Test all API connections after rehydration
        if (state) {
          state.testAllApiConnections()
        }
      },
    }
  )
)
