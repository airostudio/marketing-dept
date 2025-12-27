import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  FileText,
  CheckCircle,
  Calendar,
  Users,
  TrendingUp,
  Play,
  Eye,
  Filter,
  Search
} from 'lucide-react';
import Layout from '../components/Layout';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function Deliverables() {
  const { deliverables } = useStore();
  const [selectedDeliverable, setSelectedDeliverable] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'ready' | 'in_progress'>('all');

  // Filter deliverables
  const filteredDeliverables = deliverables.filter(d => {
    const matchesSearch = d.metadata.taskDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' ||
      (filterStatus === 'ready' && d.status === 'completed') ||
      (filterStatus === 'in_progress' && d.status === 'in_progress');
    return matchesSearch && matchesFilter;
  });

  const handleDownload = (deliverableId: string, format: 'markdown' | 'html' | 'pdf' | 'json') => {
    const deliverable = deliverables.find(d => d.id === deliverableId);
    if (!deliverable) return;

    let content = '';
    let filename = '';
    let mimeType = '';

    const timestamp = new Date(deliverable.completedAt).toISOString().replace(/[:.]/g, '-').substring(0, 19);
    const safeName = deliverable.metadata.taskDescription.substring(0, 50).replace(/[^a-z0-9]/gi, '-').toLowerCase();

    if (format === 'markdown') {
      content = deliverable.fullReport;
      filename = `${safeName}-${timestamp}.md`;
      mimeType = 'text/markdown';
    } else if (format === 'html') {
      content = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${deliverable.metadata.taskDescription}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      max-width: 900px;
      margin: 0 auto;
      padding: 60px 40px;
      line-height: 1.6;
      color: #1a1a1a;
    }
    h1 {
      color: #111;
      border-bottom: 4px solid #6366f1;
      padding-bottom: 15px;
      margin-bottom: 30px;
    }
    h2 {
      color: #333;
      margin-top: 40px;
      border-left: 4px solid #6366f1;
      padding-left: 15px;
    }
    h3 { color: #555; margin-top: 25px; }
    pre {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      overflow-x: auto;
      border-left: 4px solid #e0e0e0;
    }
    ul, ol { margin: 15px 0; padding-left: 30px; }
    li { margin: 8px 0; }
    .metadata {
      background: #f0f4ff;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
      border: 1px solid #d0d9ff;
    }
    .metadata-item {
      display: inline-block;
      margin-right: 30px;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="metadata">
    <div class="metadata-item"><strong>📋 Task:</strong> ${deliverable.metadata.taskDescription}</div>
    <div class="metadata-item"><strong>✅ Completed:</strong> ${new Date(deliverable.completedAt).toLocaleString()}</div>
    <div class="metadata-item"><strong>👥 Agents:</strong> ${deliverable.metadata.totalAgents}</div>
    <div class="metadata-item"><strong>📊 Complexity:</strong> ${deliverable.metadata.complexity}</div>
  </div>
  <pre style="white-space: pre-wrap; font-family: inherit; background: white; border: none; padding: 0;">${deliverable.fullReport}</pre>
</body>
</html>`;
      filename = `${safeName}-${timestamp}.html`;
      mimeType = 'text/html';
    } else if (format === 'json') {
      content = JSON.stringify(deliverable, null, 2);
      filename = `${safeName}-${timestamp}.json`;
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

  const handleRunCampaign = (deliverableId: string) => {
    const deliverable = deliverables.find(d => d.id === deliverableId);
    if (!deliverable) return;

    // This would integrate with campaign execution system
    toast.success('Campaign execution feature coming soon!');
    console.log('Run campaign for:', deliverable);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📦 Deliverables
          </h1>
          <p className="text-gray-600">
            Professional-grade outputs compiled by your Executive Assistant
          </p>
        </div>

        {/* Search and Filter */}
        <div className="card mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search deliverables..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="pl-12 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer min-w-[200px]"
            >
              <option value="all">All Deliverables</option>
              <option value="ready">Ready to Use</option>
              <option value="in_progress">In Progress</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {deliverables.filter(d => d.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Agents Used</p>
                <p className="text-2xl font-bold text-gray-900">
                  {deliverables.reduce((sum, d) => sum + d.metadata.totalAgents, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">
                  {deliverables.filter(d => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(d.completedAt) > weekAgo;
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Deliverables Grid */}
        {filteredDeliverables.length === 0 ? (
          <div className="card text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No deliverables yet</h3>
            <p className="text-gray-600 mb-6">
              Submit a task to Scotty to get started. Your EA will compile professional deliverables for you.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="btn-primary"
            >
              Create First Project
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredDeliverables.map((deliverable, index) => (
              <motion.div
                key={deliverable.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedDeliverable(deliverable.id === selectedDeliverable ? null : deliverable.id)}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {deliverable.metadata.taskDescription.length > 80
                            ? deliverable.metadata.taskDescription.substring(0, 80) + '...'
                            : deliverable.metadata.taskDescription}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            deliverable.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {deliverable.status === 'completed' ? '✅ Ready' : '⏳ In Progress'}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(deliverable.completedAt), 'MMM d, yyyy')}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {deliverable.metadata.totalAgents} agents
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Executive Summary Preview */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {deliverable.executiveSummary}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDeliverable(deliverable.id);
                    }}
                    className="btn-secondary text-sm flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Full Report
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(deliverable.id, 'html');
                    }}
                    className="btn-secondary text-sm flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download HTML
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(deliverable.id, 'markdown');
                    }}
                    className="btn-secondary text-sm flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Markdown
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRunCampaign(deliverable.id);
                    }}
                    className="btn-primary text-sm flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Run Campaign
                  </button>
                </div>

                {/* Expanded View */}
                {selectedDeliverable === deliverable.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 pt-6 border-t border-gray-200"
                  >
                    <div className="prose max-w-none">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Executive Summary</h4>
                      <p className="text-gray-700 mb-6 whitespace-pre-wrap">{deliverable.executiveSummary}</p>

                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Findings</h4>
                      <ul className="list-disc list-inside space-y-2 mb-6">
                        {deliverable.keyFindings.map((finding, idx) => (
                          <li key={idx} className="text-gray-700">{finding}</li>
                        ))}
                      </ul>

                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Agent Contributions</h4>
                      <div className="space-y-4 mb-6">
                        {deliverable.agentContributions.map((contrib, idx) => (
                          <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                            <p className="font-semibold text-gray-900 mb-2">{contrib.agentName}</p>
                            <p className="text-sm text-gray-700 mb-2">{contrib.contribution}</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {contrib.highlights.map((highlight, hidx) => (
                                <li key={hidx} className="flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  {highlight}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Recommendations</h4>
                      <ol className="list-decimal list-inside space-y-2 mb-6">
                        {deliverable.recommendations.map((rec, idx) => (
                          <li key={idx} className="text-gray-700">{rec}</li>
                        ))}
                      </ol>

                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Next Steps</h4>
                      <ol className="list-decimal list-inside space-y-2">
                        {deliverable.nextSteps.map((step, idx) => (
                          <li key={idx} className="text-gray-700">{step}</li>
                        ))}
                      </ol>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
