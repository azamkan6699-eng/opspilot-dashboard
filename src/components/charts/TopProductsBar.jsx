import PropTypes from 'prop-types'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

export function TopProductsBar({ data }) {
  return (
    <div aria-label="Top products by units sold chart">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} stroke="currentColor" />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false}
            stroke="currentColor" width={120} />
          <Tooltip
            formatter={(value) => [value, 'Units sold']}
            contentStyle={{ fontSize: 12, borderRadius: 6 }}
          />
          <Bar dataKey="units" fill="#22c55e" radius={[0, 3, 3, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

TopProductsBar.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string, units: PropTypes.number })).isRequired,
}
