import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Loader2,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Activity,
} from 'lucide-react';
import Layout from '../components/Layout';
import { marketingAPI, TaskProgress } from '../services/marketingAPI';
import { WorkflowExecution } from '../services/masterOrchestrator';
import { activityTracker } from '../services/activityTracker';
import toast from 'react-hot-toast';

interface AgentActivityWindow {
  agentId: string;
  agentName: string;
  status: 'pending' | 'working' | 'completed' | 'failed';
  currentActivity: string;
  progress: number;
}

export default function Manager() {
  const [taskInput, setTaskInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentProgress, setCurrentProgress] = useState<TaskProgress | null>(null);
  const [agentWindows, setAgentWindows] = useState<AgentActivityWindow[]>([]);
  const [completedExecution, setCompletedExecution] = useState<WorkflowExecution | null>(null);
  const [deliverableContent, setDeliverableContent] = useState<string>('');

  // Subscribe to activity tracker for real-time updates
  useEffect(() => {
    const unsubscribe = activityTracker.subscribe((activity) => {
      // Update agent windows with real-time activity
      setAgentWindows((prev) => {
        const existing = prev.find((w) => w.agentId === activity.agentId);

        if (activity.activityType === 'started') {
          if (!existing) {
            return [
              ...prev,
              {
                agentId: activity.agentId,
                agentName: activity.agentName,
                status: 'working',
                currentActivity: activity.message,
                progress: 0,
              },
            ];
          }
          return prev.map((w) =>
            w.agentId === activity.agentId
              ? { ...w, status: 'working', currentActivity: activity.message, progress: 0 }
              : w
          );
        }

        if (activity.activityType === 'progress' && existing) {
          return prev.map((w) =>
            w.agentId === activity.agentId
              ? { ...w, currentActivity: activity.message, progress: activity.progress || 0 }
              : w
          );
        }

        if (activity.activityType === 'completed' && existing) {
          return prev.map((w) =>
            w.agentId === activity.agentId
              ? { ...w, status: 'completed', currentActivity: 'Completed', progress: 100 }
              : w
          );
        }

        if (activity.activityType === 'failed' && existing) {
          return prev.map((w) =>
            w.agentId === activity.agentId
              ? { ...w, status: 'failed', currentActivity: `Failed: ${activity.message}`, progress: 0 }
              : w
          );
        }

        return prev;
      });
    });

    return () => unsubscribe();
  }, []);

  const handleSubmitTask = async () => {
    if (!taskInput.trim()) {
      toast.error('Please enter a task description');
      return;
    }

    setIsProcessing(true);
    setAgentWindows([]);
    setCompletedExecution(null);
    setDeliverableContent('');

    try {
      console.log('🎯 Submitting task to Scotty:', taskInput);

      const execution = await marketingAPI.submitTask(taskInput, (progress) => {
        setCurrentProgress(progress);
      });

      console.log('✅ Workflow execution complete:', execution);

      setCompletedExecution(execution);

      // Extract deliverable content
      if (execution.finalDeliverable) {
        if (typeof execution.finalDeliverable === 'string') {
          setDeliverableContent(execution.finalDeliverable);
        } else if (execution.finalDeliverable.fullReport) {
          setDeliverableContent(execution.finalDeliverable.fullReport);
        } else {
          setDeliverableContent(JSON.stringify(execution.finalDeliverable, null, 2));
        }
      }

      toast.success('Task completed successfully!');
    } catch (error) {
      console.error('❌ Task execution failed:', error);
      toast.error(error instanceof Error ? error.message : 'Task execution failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = (format: 'markdown' | 'html' | 'json') => {
    if (!completedExecution?.finalDeliverable) return;

    let content = '';
    let filename = '';
    let mimeType = '';

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);

    if (format === 'markdown') {
      content = deliverableContent;
      filename = `deliverable-${timestamp}.md`;
      mimeType = 'text/markdown';
    } else if (format === 'html') {
      content = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Marketing Deliverable</title>
  <style>
    body { font-family: system-ui; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.6; }
    h1 { color: #1a1a1a; border-bottom: 3px solid #6366f1; padding-bottom: 10px; }
    h2 { color: #333; margin-top: 30px; }
    pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; }
  </style>
</head>
<body>
  <pre>${deliverableContent}</pre>
</body>
</html>`;
      filename = `deliverable-${timestamp}.html`;
      mimeType = 'text/html';
    } else {
      content = JSON.stringify(completedExecution.finalDeliverable, null, 2);
      filename = `deliverable-${timestamp}.json`;
      mimeType = 'application/json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    toast.success(`Downloaded as ${filename}`);
  };

  const exampleTasks = [
    "Scrape Google Maps for 50 plumbers in Perth with contact details",
    "Write a 1500-word blog post about AI marketing trends in 2025",
    "Create a 7-email drip campaign for SaaS trial users",
    "Analyze our top 3 competitors and create a SWOT analysis",
    "Generate Facebook ad copy for a new AI productivity tool",
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎯 Scotty - AI Marketing Orchestrator
          </h1>
          <p className="text-gray-600">
            Describe any marketing task and Scotty will intelligently assign it to the right agents
          </p>
        </div>

        {/* Task Input */}
        <div className="card mb-6">
          <label className="label mb-2">What do you need help with?</label>
          <div className="flex gap-3">
            <textarea
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.metaKey) {
                  handleSubmitTask();
                }
              }}
              placeholder="e.g., Create a content strategy for Q1 2025, Find 100 law firms in California, Write ad copy for new product..."
              className="input flex-1 min-h-[100px] resize-none"
              disabled={isProcessing}
            />
            <button
              onClick={handleSubmitTask}
              disabled={isProcessing || !taskInput.trim()}
              className="btn-primary h-[100px] px-6 flex flex-col items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-sm">Processing...</span>
                </>
              ) : (
                <>
                  <Send className="w-6 h-6" />
                  <span className="text-sm">Submit</span>
                </>
              )}
            </button>
          </div>

          {/* Example Tasks */}
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">Try these examples:</p>
            <div className="flex flex-wrap gap-2">
              {exampleTasks.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setTaskInput(example)}
                  disabled={isProcessing}
                  className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors disabled:opacity-50"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Current Progress */}
        {currentProgress && (
          <div className="card mb-6 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-5 h-5 text-blue-600 animate-pulse" />
              <div>
                <h3 className="font-semibold text-blue-900">
                  {currentProgress.currentPhase}
                </h3>
                <p className="text-sm text-blue-700">
                  Overall Progress: {currentProgress.progress}%
                </p>
              </div>
            </div>
            <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-600"
                initial={{ width: 0 }}
                animate={{ width: `${currentProgress.progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        {/* Agent Activity Windows */}
        <AnimatePresence>
          {agentWindows.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Agent Activity
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {agentWindows.map((agent) => (
                  <motion.div
                    key={agent.agentId}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`card ${
                      agent.status === 'working'
                        ? 'bg-blue-50 border-blue-200'
                        : agent.status === 'completed'
                        ? 'bg-green-50 border-green-200'
                        : agent.status === 'failed'
                        ? 'bg-red-50 border-red-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{agent.agentName}</h3>
                      {agent.status === 'working' && (
                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                      )}
                      {agent.status === 'completed' && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                      {agent.status === 'failed' && (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      {agent.status === 'pending' && (
                        <Clock className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{agent.currentActivity}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Progress</span>
                        <span>{agent.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${
                            agent.status === 'completed'
                              ? 'bg-green-600'
                              : agent.status === 'failed'
                              ? 'bg-red-600'
                              : 'bg-blue-600'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${agent.progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Final Deliverable */}
        <AnimatePresence>
          {completedExecution && deliverableContent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card bg-gradient-to-br from-green-50 to-blue-50 border-green-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Deliverable Ready</h2>
                    <p className="text-sm text-gray-600">
                      Compiled by Executive Assistant
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload('markdown')}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Markdown
                  </button>
                  <button
                    onClick={() => handleDownload('html')}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    HTML
                  </button>
                  <button
                    onClick={() => handleDownload('json')}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    JSON
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 max-h-[600px] overflow-y-auto border border-gray-200">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                  {deliverableContent}
                </pre>
              </div>

              {completedExecution.orchestrationPlan && (
                <div className="mt-4 p-4 bg-white/50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Execution Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Complexity</p>
                      <p className="font-semibold text-gray-900">
                        {completedExecution.orchestrationPlan.analysis.complexity}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Agents Used</p>
                      <p className="font-semibold text-gray-900">
                        {completedExecution.stepResults.size}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Duration</p>
                      <p className="font-semibold text-gray-900">
                        {completedExecution.orchestrationPlan.analysis.estimatedDuration}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Cost</p>
                      <p className="font-semibold text-gray-900">
                        ${completedExecution.orchestrationPlan.estimatedCost.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
