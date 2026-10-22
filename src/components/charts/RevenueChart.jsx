import PropTypes from 'prop-types'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { formatCurrency } from '../../utils/formatCurrency.js'

export function RevenueChart({ data }) {
  return (
    <div aria-label="Revenue over time chart">
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false}
            interval="preserveStartEnd" stroke="currentColor" />
          <YAxis tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
            tick={{ fontSize: 11 }} tickLine={false} axisLine={false} stroke="currentColor" width={48} />
          <Tooltip
            formatter={(value) => [formatCurrency(value), 'Revenue']}
            contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}
          />
          <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2}
            fill="url(#revenueGrad)" dot={false} activeDot={{ r: 4 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

RevenueChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({ date: PropTypes.string, revenue: PropTypes.number })).isRequired,
}
