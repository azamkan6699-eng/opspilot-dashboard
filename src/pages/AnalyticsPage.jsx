import { useState, useMemo } from 'react'
import { subDays } from 'date-fns'
import { useData } from '../context/DataContext.jsx'
import { PageHeader } from '../components/layout/PageHeader.jsx'
import { ChartCard } from '../components/charts/ChartCard.jsx'
import { RevenueChart } from '../components/charts/RevenueChart.jsx'
import { StatusDonut } from '../components/charts/StatusDonut.jsx'
import { CategoryBar } from '../components/charts/CategoryBar.jsx'
import { TopProductsBar } from '../components/charts/TopProductsBar.jsx'
import { DateRangePicker } from '../components/features/analytics/DateRangePicker.jsx'
import {
  revenueOverTime,
  ordersByStatus,
  revenueByCategory,
  topProductsByUnits,
} from '../components/features/analytics/analyticsSelectors.js'

const defaultRange = {
  start: subDays(new Date(), 29),
  end: new Date(),
  label: 'Last 30 days',
}

export default function AnalyticsPage() {
  const { orders, products, loading } = useData()
  const [dateRange, setDateRange] = useState(defaultRange)
  const isLoading = loading.orders || loading.products

  const revenueData = useMemo(
    () => (isLoading ? [] : revenueOverTime(orders, dateRange.start, dateRange.end)),
    [orders, dateRange, isLoading]
  )
  const statusData = useMemo(
    () => (isLoading ? [] : ordersByStatus(orders, dateRange.start, dateRange.end)),
    [orders, dateRange, isLoading]
  )
  const categoryData = useMemo(
    () => (isLoading ? [] : revenueByCategory(orders, products, dateRange.start, dateRange.end)),
    [orders, products, dateRange, isLoading]
  )
  const topProductsData = useMemo(
    () => (isLoading ? [] : topProductsByUnits(orders, dateRange.start, dateRange.end)),
    [orders, dateRange, isLoading]
  )

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Analytics" description="Insights across orders, revenue, and inventory." />

      <DateRangePicker value={dateRange} onChange={setDateRange} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard
          title="Revenue Over Time"
          description={`Daily revenue · ${dateRange.label}`}
          isLoading={isLoading}
          isEmpty={!isLoading && revenueData.every((d) => d.revenue === 0)}
          className="lg:col-span-2"
        >
          <RevenueChart data={revenueData} />
        </ChartCard>

        <ChartCard
          title="Orders by Status"
          description={`Distribution · ${dateRange.label}`}
          isLoading={isLoading}
          isEmpty={!isLoading && statusData.length === 0}
        >
          <StatusDonut data={statusData} />
        </ChartCard>

        <ChartCard
          title="Revenue by Category"
          description={`Top categories · ${dateRange.label}`}
          isLoading={isLoading}
          isEmpty={!isLoading && categoryData.length === 0}
        >
          <CategoryBar data={categoryData} />
        </ChartCard>

        <ChartCard
          title="Top 5 Products by Units Sold"
          description={`${dateRange.label}`}
          isLoading={isLoading}
          isEmpty={!isLoading && topProductsData.length === 0}
          className="lg:col-span-2"
        >
          <TopProductsBar data={topProductsData} />
        </ChartCard>
      </div>
    </div>
  )
}
