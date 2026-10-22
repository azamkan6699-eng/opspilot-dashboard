import PropTypes from 'prop-types'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { formatCurrency } from '../../utils/formatCurrency.js'

export function CategoryBar({ data }) {
  return (
    <div aria-label="Revenue by category chart">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} />
          <XAxis dataKey="category" tick={{ fontSize: 11 }} tickLine={false} axisLine={false}
            stroke="currentColor" interval={0} />
          <YAxis tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
            tick={{ fontSize: 11 }} tickLine={false} axisLine={false} stroke="currentColor" width={48} />
          <Tooltip
            formatter={(value) => [formatCurrency(value), 'Revenue']}
            contentStyle={{ fontSize: 12, borderRadius: 6 }}
          />
          <Bar dataKey="revenue" fill="#3b82f6" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

CategoryBar.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({ category: PropTypes.string, revenue: PropTypes.number })).isRequired,
}
