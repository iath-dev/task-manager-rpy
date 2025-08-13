import React from 'react'

import { Bar, BarChart } from 'recharts'

import type { TasksStatisticsObject } from '@/interfaces/tasks'

import { Card, CardContent, CardHeader } from '../ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '../ui/chart'

export interface ChartConfig {
  [key: string]: {
    label: string
    color?: string
  }
}

interface StatsChartProps {
  data: TasksStatisticsObject[]
  chartConfig: ChartConfig
  label: string
}

const StatsChart: React.FC<StatsChartProps> = ({
  label,
  data,
  chartConfig,
}) => {
  return (
    <Card className="p-2 sm:p-4">
      <CardHeader>
        <h3 className="text-lg font-semibold">{label}</h3>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelKey="value"
                  nameKey="label"
                  indicator="dashed"
                />
              }
            />
            <ChartLegend content={<ChartLegendContent nameKey="label" />} />
            <Bar dataKey="value" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default StatsChart
