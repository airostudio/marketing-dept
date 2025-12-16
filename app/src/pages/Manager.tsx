import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Rocket,
  Search,
  TrendingUp,
  Users,
  BarChart3,
  Zap,
  ChevronRight,
  Play,
  Clock,
  Target,
} from 'lucide-react';
import Layout from '../components/Layout';
import LiveTaskMonitor from '../components/LiveTaskMonitor';
import { campaignTemplates } from '../data/campaignTemplates';
import { CampaignTemplate, Workflow, WorkflowStep } from '../types/workflow';
import { useStore } from '../store/useStore';
import { workflowEngine } from '../services/workflowEngine';
import { useTaskNotifications } from '../hooks/useTaskNotifications';
import toast from 'react-hot-toast';

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-500/10 text-green-400 border-green-500/20',
  intermediate: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  advanced: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function Manager() {
  const [userGoal, setUserGoal] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<CampaignTemplate | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);
  const { workflows, addWorkflow, updateWorkflow, workers } = useStore();

  // Enable task notifications
  useTaskNotifications();

  const activeWorkflow = workflows.find(w => w.status === 'in_progress');

  const handleQuickStart = async (template: CampaignTemplate) => {
    setSelectedTemplate(template);
    await launchCampaign(template, '');
  };

  const handleCustomLaunch = async () => {
    if (!userGoal.trim()) {
      toast.error('Please describe what you want to achieve');
      return;
    }

    // Simple intent recognition - match keywords to templates
    const goal = userGoal.toLowerCase();
    let matchedTemplate: CampaignTemplate | null = null;

    if (goal.includes('lead') || goal.includes('prospect') || goal.includes('outreach')) {
      matchedTemplate = campaignTemplates.find(t => t.id === 'lead-generation-automation') || null;
    } else if (goal.includes('content') && (goal.includes('blog') || goal.includes('post'))) {
      matchedTemplate = campaignTemplates.find(t => t.id === 'content-creation-sprint') || null;
    } else if (goal.includes('social') || goal.includes('facebook') || goal.includes('instagram')) {
      matchedTemplate = campaignTemplates.find(t => t.id === 'quick-social-campaign') || null;
    } else if (goal.includes('analytics') || goal.includes('report') || goal.includes('performance')) {
      matchedTemplate = campaignTemplates.find(t => t.id === 'performance-analysis') || null;
    } else if (goal.includes('launch') || goal.includes('product')) {
      matchedTemplate = campaignTemplates.find(t => t.id === 'product-launch') || null;
    } else if (goal.includes('campaign') || goal.includes('conversion')) {
      matchedTemplate = campaignTemplates.find(t => t.id === 'content-to-conversion') || null;
    }

    if (!matchedTemplate) {
      // Default to content creation
      matchedTemplate = campaignTemplates.find(t => t.id === 'content-creation-sprint') || null;
    }

    if (matchedTemplate) {
      setSelectedTemplate(matchedTemplate);
      await launchCampaign(matchedTemplate, userGoal);
    }
  };

  const launchCampaign = async (template: CampaignTemplate, customGoal: string) => {
    setIsLaunching(true);

    try {
      // Create workflow from template
      const workflowId = `workflow-${Date.now()}`;
      const steps: WorkflowStep[] = template.steps.map((stepTemplate, index) => ({
        ...stepTemplate,
        id: `${stepTemplate.workerId}-${index}`,
        status: 'pending',
        progress: 0,
      }));

      const workflow: Workflow = {
        id: workflowId,
        name: customGoal || template.name,
        description: template.description,
        category: template.category,
        steps,
        status: 'pending',
        progress: 0,
        createdAt: new Date(),
        metadata: {
          templateId: template.id,
          customGoal,
        },
      };

      // Add workflow to store
      addWorkflow(workflow);

      toast.success(`Launching: ${template.name}`);

      // Execute workflow
      await workflowEngine.executeWorkflow(workflow, (updatedWorkflow) => {
        // Update store with workflow progress
        updateWorkflow(workflowId, updatedWorkflow);
      });

      toast.success('Campaign completed!');
      setUserGoal('');
      setSelectedTemplate(null);
    } catch (error) {
      console.error('Campaign launch failed:', error);
      toast.error('Campaign failed to complete');
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-8 text-white"
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Marketing & Sales Manager</h1>
          </div>
          <p className="text-lg text-white/90 mb-6 max-w-2xl">
            Describe your goal and I'll intelligently coordinate all your marketing agents to make it happen.
            Or choose from pre-built campaign templates for instant results.
          </p>

          {/* Main Input */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={userGoal}
                onChange={(e) => setUserGoal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCustomLaunch()}
                placeholder="e.g., Generate 50 qualified leads for our SaaS product..."
                className="w-full px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 text-lg"
                disabled={isLaunching || !!activeWorkflow}
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            </div>
            <button
              onClick={handleCustomLaunch}
              disabled={!userGoal.trim() || isLaunching || !!activeWorkflow}
              className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
            >
              <Rocket className="w-5 h-5" />
              Launch
            </button>
          </div>

          {selectedTemplate && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-2 text-sm"
            >
              <Zap className="w-4 h-4" />
              <span>
                Detected intent: <strong>{selectedTemplate.name}</strong>
              </span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Active Workflow */}
      {activeWorkflow && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <Play className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{activeWorkflow.name}</h3>
                <p className="text-sm text-gray-400">{activeWorkflow.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{activeWorkflow.progress}%</div>
              <div className="text-xs text-gray-400">Complete</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${activeWorkflow.progress}%` }}
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
            />
          </div>

          {/* Active Steps */}
          <div className="space-y-2">
            {activeWorkflow.steps
              .filter(step => step.status === 'in_progress' || step.status === 'completed')
              .slice(-3)
              .map((step) => (
                <div key={step.id} className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center">
                    {workers.find(w => w.id === step.workerId)?.emoji}
                  </div>
                  <span className="text-gray-300 flex-1">{step.description}</span>
                  {step.status === 'in_progress' && (
                    <span className="text-green-400">{step.progress}%</span>
                  )}
                  {step.status === 'completed' && (
                    <span className="text-green-400">✓</span>
                  )}
                </div>
              ))}
          </div>
        </motion.div>
      )}

      {/* Campaign Templates */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Campaign Templates</h2>
          <div className="text-sm text-gray-400">Choose a pre-built workflow</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaignTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-indigo-500/50 transition-all cursor-pointer"
              onClick={() => !isLaunching && !activeWorkflow && handleQuickStart(template)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{template.icon}</div>
                <div className={`px-2 py-1 rounded-md text-xs font-medium border ${difficultyColors[template.difficulty]}`}>
                  {template.difficulty}
                </div>
              </div>

              <h3 className="font-semibold text-white mb-2">{template.name}</h3>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">{template.description}</p>

              <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {template.estimatedTime}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {template.requiredWorkers.length} agents
                </div>
              </div>

              {/* Worker Avatars */}
              <div className="flex items-center gap-1 mb-4">
                {template.requiredWorkers.slice(0, 5).map((workerId) => {
                  const worker = workers.find(w => w.id === workerId);
                  return worker ? (
                    <div
                      key={workerId}
                      className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-sm border border-gray-600"
                      title={worker.name}
                    >
                      {worker.emoji}
                    </div>
                  ) : null;
                })}
                {template.requiredWorkers.length > 5 && (
                  <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-400 border border-gray-600">
                    +{template.requiredWorkers.length - 5}
                  </div>
                )}
              </div>

              <button
                className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2 group-hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLaunching || !!activeWorkflow}
              >
                <Play className="w-4 h-4" />
                Quick Start
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6"
        >
          <Target className="w-8 h-8 text-blue-400 mb-3" />
          <div className="text-2xl font-bold text-white mb-1">
            {workflows.filter(w => w.status === 'completed').length}
          </div>
          <div className="text-sm text-gray-400">Campaigns Completed</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/20 rounded-xl p-6"
        >
          <TrendingUp className="w-8 h-8 text-green-400 mb-3" />
          <div className="text-2xl font-bold text-white mb-1">
            {workers.filter(w => w.status === 'active').length}
          </div>
          <div className="text-sm text-gray-400">Agents Active</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-6"
        >
          <Zap className="w-8 h-8 text-purple-400 mb-3" />
          <div className="text-2xl font-bold text-white mb-1">
            {workflows.length}
          </div>
          <div className="text-sm text-gray-400">Total Workflows</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-xl p-6"
        >
          <BarChart3 className="w-8 h-8 text-orange-400 mb-3" />
          <div className="text-2xl font-bold text-white mb-1">
            {Math.round(
              workflows.filter(w => w.status === 'completed').length /
              Math.max(workflows.length, 1) * 100
            )}%
          </div>
          <div className="text-sm text-gray-400">Success Rate</div>
        </motion.div>
      </div>
    </div>

    {/* Real-time task monitoring */}
    <LiveTaskMonitor />
    </Layout>
  );
}
