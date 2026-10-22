import PropTypes from 'prop-types'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

const COLORS = {
  Pending: '#94a3b8',
  Processing: '#f59e0b',
  Shipped: '#0ea5e9',
  Delivered: '#22c55e',
  Cancelled: '#ef4444',
}

export function StatusDonut({ data }) {
  return (
    <div aria-label="Orders by status chart">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name] ?? '#64748b'} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [value, name]}
            contentStyle={{ fontSize: 12, borderRadius: 6 }}
          />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

StatusDonut.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string, value: PropTypes.number })).isRequired,
}
