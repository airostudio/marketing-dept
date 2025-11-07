import { motion } from 'framer-motion'
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  label: string
  value: string
  icon: LucideIcon
  gradient: string
  change?: string
  positive?: boolean
  index: number
}

export default function StatsCard({
  label,
  value,
  icon: Icon,
  gradient,
  change,
  positive,
  index
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card hover:shadow-2xl hover:shadow-primary-500/10 transition-all"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-2">{label}</p>
          <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
          {change && (
            <div className={`flex items-center gap-1 text-sm ${
              positive ? 'text-green-400' : 'text-gray-400'
            }`}>
              {positive !== undefined && (
                positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />
              )}
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  )
}
