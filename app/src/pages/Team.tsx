import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Search, Filter, Zap, Award } from 'lucide-react';
import Layout from '../components/Layout';
import { getAllAgentConfigs } from '../services/agentLoader';

export default function Team() {
  const navigate = useNavigate();
  const agents = getAllAgentConfigs();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  // Get unique departments
  const departments = ['all', ...new Set(agents.map(a => a.department))];

  // Filter agents
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || agent.department === selectedDepartment;
    return matchesSearch && matchesDepartment && agent.id !== 'scotty'; // Exclude Scotty from team listing
  });

  // Get Scotty separately for special display
  const scotty = agents.find(a => a.id === 'scotty');

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-4"
          >
            <Users className="w-5 h-5 mr-2" />
            <span className="font-semibold">12 World-Class AI Agents</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-bold text-gray-900 mb-4"
          >
            Meet Your AI Marketing Team
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Each agent is a world-class expert with 10-20 years of experience, powered by real AI engines
            (Gemini & DeepSeek). No placeholders, no simulations—just professional-grade marketing intelligence.
          </motion.p>
        </div>

        {/* Scotty - VP Leader Section */}
        {scotty && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Award className="w-7 h-7 text-yellow-500 mr-3" />
              Leadership
            </h2>
            <div
              onClick={() => navigate(`/agents/${scotty.id}`)}
              className="card hover:shadow-2xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 border-2 border-blue-200"
            >
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-5xl shadow-xl">
                  {scotty.emoji}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{scotty.name}</h3>
                  <p className="text-lg text-blue-600 font-semibold mb-2">{scotty.role}</p>
                  <p className="text-gray-700">{scotty.personality}</p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-full font-semibold mb-2">
                    <Zap className="w-4 h-4 mr-2" />
                    {scotty.aiPlatform.name} AI
                  </div>
                  <p className="text-sm text-gray-600">Leads 11 Agents</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 flex flex-col md:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search agents by name, role, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="pl-12 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer min-w-[200px]"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept === 'all' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="mb-6 text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredAgents.length}</span> agents
          {selectedDepartment !== 'all' && (
            <span> in <span className="font-semibold text-blue-600">{selectedDepartment}</span></span>
          )}
        </div>

        {/* Agents Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              onClick={() => navigate(`/agents/${agent.id}`)}
              className="card hover:shadow-2xl transition-all duration-300 cursor-pointer group"
            >
              {/* Avatar */}
              <div className="flex justify-center mb-4">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-6xl shadow-lg group-hover:scale-110 transition-transform">
                  {agent.emoji}
                </div>
              </div>

              {/* Info */}
              <h3 className="text-xl font-bold text-gray-900 mb-1 text-center">{agent.name}</h3>
              <p className="text-blue-600 font-semibold mb-3 text-center">{agent.role}</p>

              {/* Department Badge */}
              <div className="flex justify-center mb-4">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  {agent.department}
                </span>
              </div>

              {/* Capabilities */}
              <div className="space-y-1 mb-4">
                {agent.capabilities.slice(0, 3).map((capability, idx) => (
                  <div key={idx} className="text-sm text-gray-600 flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                    {capability}
                  </div>
                ))}
                {agent.capabilities.length > 3 && (
                  <div className="text-sm text-gray-400 italic">
                    +{agent.capabilities.length - 3} more
                  </div>
                )}
              </div>

              {/* AI Platform */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Powered by</span>
                  <div className="flex items-center bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                    <Zap className="w-3 h-3 mr-1" />
                    {agent.aiPlatform.name}
                  </div>
                </div>
              </div>

              {/* Hover State */}
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-full btn-primary text-sm py-2">
                  View Full Profile →
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredAgents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users className="w-16 h-16 mx-auto mb-4" />
              <p className="text-lg">No agents found matching your criteria</p>
            </div>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDepartment('all');
              }}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center card bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Work with Our Team?</h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Submit a task to Scotty and he'll assemble the perfect team of experts to deliver exceptional results.
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary text-lg px-8 py-3"
          >
            Get Started with Scotty →
          </button>
        </motion.div>
      </div>
    </Layout>
  );
}
