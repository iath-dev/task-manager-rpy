import { lazy, Suspense } from 'react'

import { useQuery } from '@tanstack/react-query'

import { TaskList } from '@/components/TaskList/TaskList'
import { type ChartConfig } from '@/components/ui/chart'
import {
  mapStatisticsToChartData,
  mapStatisticsToPercentages,
} from '@/lib/utils'
import Spinner from '@/components/ui/spinner'

const StatsChart = lazy(() => import('@/components/TaskList/StatsChart'))

const noChartConfig = {
  total: {
    label: 'Total Tasks: ',
  },
  completed: {
    label: 'Completed Tasks: ',
  },
  pending: {
    label: 'Pending Tasks: ',
  },
} satisfies ChartConfig

const percentChartConfig = {
  completed: {
    label: 'Completed: ',
    color: 'hsl(var(--chart-1))',
  },
  pending: {
    label: 'Pending: ',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

export const DashboardPage = () => {
  const { data } = useQuery({
    queryKey: ['tasks', 'stats'],
    queryFn: () =>
      import('@/services/taskService').then(module => module.getStats()),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })

  return (
    <div>
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1 py-4">
          <h2 className="text-2xl/7 font-bold sm:truncate sm:text-3xl sm:tracking-tight">
            Back End Developer
          </h2>
        </div>
      </div>
      <section className="flex flex-col lg:grid lg:grid-cols-3 lg:grid-rows-2 gap-4">
        <Suspense fallback={<Spinner />}>
          <StatsChart
            label="Completed number"
            chartConfig={noChartConfig}
            data={data ? mapStatisticsToChartData(data) : []}
          />
        </Suspense>
        <div className="max-lg:order-first lg:row-span-2 lg:col-span-2">
          <TaskList />
        </div>
        <Suspense fallback={<Spinner />}>
          <StatsChart
            label="Completed percents"
            chartConfig={percentChartConfig}
            data={data ? mapStatisticsToPercentages(data) : []}
          />
        </Suspense>
      </section>
    </div>
  )
}
