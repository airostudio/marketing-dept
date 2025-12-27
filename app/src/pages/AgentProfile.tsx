import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Briefcase, Award, TrendingUp, CheckCircle, Zap } from 'lucide-react';
import Layout from '../components/Layout';
import { getAgentConfig } from '../services/agentLoader';

export default function AgentProfile() {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();

  const agent = agentId ? getAgentConfig(agentId) : null;

  if (!agent) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Agent Not Found</h1>
          <p className="text-gray-600 mb-8">The agent you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/team')}
            className="btn-primary"
          >
            View All Agents
          </button>
        </div>
      </Layout>
    );
  }

  // Extract years of experience from system prompt
  const experienceMatch = agent.systemPrompt?.match(/(\d+)\+ years/);
  const yearsExperience = experienceMatch ? experienceMatch[1] : '10';

  // Extract key achievements from system prompt
  const achievements = extractAchievements(agent.systemPrompt || '');
  const certifications = extractCertifications(agent.systemPrompt || '');
  const metrics = extractMetrics(agent.systemPrompt || '');

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/team')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Team
        </button>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8 border border-blue-100"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-7xl shadow-2xl transform hover:scale-105 transition-transform">
                {agent.emoji}
              </div>
              <div className="absolute -bottom-3 -right-3 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                {agent.status === 'active' ? 'Available' : 'Offline'}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{agent.name}</h1>
              <p className="text-xl text-blue-600 font-semibold mb-4">{agent.role}</p>
              <p className="text-gray-700 text-lg mb-6">{agent.personality}</p>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-6">
                <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm">
                  <Briefcase className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-semibold text-gray-900">{yearsExperience}+ Years Experience</span>
                </div>
                <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm">
                  <Award className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="font-semibold text-gray-900">{agent.department}</span>
                </div>
                <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm">
                  <Zap className="w-5 h-5 text-indigo-600 mr-2" />
                  <span className="font-semibold text-gray-900">{agent.aiPlatform.name} AI Powered</span>
                </div>
              </div>

              <button className="btn-primary">
                <Mail className="w-5 h-5 mr-2" />
                Assign Task to {agent.name.split(' ')[0]}
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Expertise & Capabilities */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
              Core Expertise
            </h2>
            <div className="space-y-2">
              {agent.capabilities.map((capability, index) => (
                <div
                  key={index}
                  className="flex items-start bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-900 font-medium">{capability}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Certifications */}
          {certifications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Award className="w-6 h-6 text-yellow-600 mr-2" />
                Certifications & Credentials
              </h2>
              <div className="space-y-2">
                {certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-start bg-yellow-50 p-3 rounded-lg border border-yellow-200"
                  >
                    <Award className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-900 font-medium">{cert}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Key Metrics */}
          {metrics.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="card md:col-span-2"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-6 h-6 text-blue-600 mr-2" />
                Proven Track Record
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {metrics.map((metric, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200"
                  >
                    <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
                    <p className="text-gray-900 font-semibold text-lg">{metric}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Key Achievements */}
          {achievements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card md:col-span-2"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Achievements</h2>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-start bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200"
                  >
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-900 leading-relaxed">{achievement}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Reports To */}
          {agent.reportsTo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card md:col-span-2 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-3">Team Structure</h2>
              <p className="text-gray-700">
                <span className="font-semibold">{agent.name}</span> reports directly to{' '}
                <span className="font-semibold text-purple-600">
                  {agent.reportsTo === 'scotty' ? 'Scotty (VP of Sales & Marketing)' : agent.reportsTo.toUpperCase()}
                </span>
                {' '}and follows their strategic direction completely.
              </p>
            </motion.div>
          )}
        </div>

        {/* AI Platform Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 card bg-gradient-to-br from-gray-50 to-slate-50"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-3">AI Platform</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 mb-2">
                Powered by <span className="font-semibold text-indigo-600">{agent.aiPlatform.name}</span>
              </p>
              <p className="text-sm text-gray-600">
                Model: <code className="bg-white px-2 py-1 rounded text-xs">{agent.aiPlatform.model}</code>
              </p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse"></div>
                Real AI Engine Active
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}

// Helper functions to extract information from system prompts
function extractAchievements(prompt: string): string[] {
  const achievements: string[] = [];

  // Extract track record section
  const trackRecordMatch = prompt.match(/Your track record includes:(.*?)(?:\n\n|You are an expert)/s);
  if (trackRecordMatch) {
    const items = trackRecordMatch[1].split(/[,;]/).map(s => s.trim()).filter(s => s.length > 10);
    achievements.push(...items.slice(0, 4));
  }

  // Extract other notable achievements
  const notableMatches = prompt.match(/You have (.*?)(?:\.|,)/g);
  if (notableMatches && achievements.length < 3) {
    notableMatches.slice(0, 3 - achievements.length).forEach(match => {
      const clean = match.replace('You have ', '').replace(/\.$/, '');
      if (clean.length > 10 && clean.length < 150) {
        achievements.push(clean);
      }
    });
  }

  return achievements.slice(0, 5);
}

function extractCertifications(prompt: string): string[] {
  const certs: string[] = [];

  // Common certification patterns
  const certPatterns = [
    /(?:certified|certification|certified as|cert)[:\s]+([^.,\n]+)/gi,
    /(Google Analytics|HubSpot|Salesforce|Meta Blueprint|LinkedIn Marketing Labs|Marketo|Content Marketing Institute|Tableau|Looker|Semrush|Search Console)/g,
  ];

  certPatterns.forEach(pattern => {
    const matches = prompt.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const clean = match.replace(/(?:certified|certification|cert)[:\s]+/i, '').trim();
        if (clean && !certs.includes(clean) && clean.length < 80) {
          certs.push(clean);
        }
      });
    }
  });

  return [...new Set(certs)].slice(0, 6);
}

function extractMetrics(prompt: string): string[] {
  const metrics: string[] = [];

  // Extract "You consistently achieve" section
  const achieveMatch = prompt.match(/You consistently (?:achieve|deliver):(.*?)(?:\.|$)/s);
  if (achieveMatch) {
    const items = achieveMatch[1].split(/[,;]/).map(s => s.trim()).filter(s => s.length > 5);
    metrics.push(...items);
  }

  // Extract percentage metrics
  const percentMatches = prompt.match(/\d+%\+?\s+[^.,\n]+/g);
  if (percentMatches) {
    percentMatches.forEach(match => {
      if (!metrics.some(m => m.includes(match)) && match.length < 80) {
        metrics.push(match);
      }
    });
  }

  // Extract dollar amounts
  const dollarMatches = prompt.match(/\$[\d,]+[MK]?\+?\s+[^.,\n]+/g);
  if (dollarMatches) {
    dollarMatches.forEach(match => {
      if (!metrics.some(m => m.includes(match)) && match.length < 80) {
        metrics.push(match);
      }
    });
  }

  return [...new Set(metrics)].slice(0, 8);
}
