import { TaskList } from "@/components/TaskList/TaskList";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  mapStatisticsToChartData,
  mapStatisticsToPercentages,
} from "@/utils/charts";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart } from "recharts";

const noChartConfig = {
  total: {
    label: "Total Tasks: ",
  },
  completed: {
    label: "Completed Tasks: ",
  },
  pending: {
    label: "Pending Tasks: ",
  },
} satisfies ChartConfig;

const percentChartConfig = {
  completed: {
    label: "Completed: ",
    color: "hsl(var(--chart-1))",
  },
  pending: {
    label: "Pending: ",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export const DashboardPage = () => {
  const { data } = useQuery({
    queryKey: ["tasksStatistics"],
    queryFn: () =>
      import("@/services/taskService").then((module) => module.getStats()),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

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
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Completed number</h3>
          </CardHeader>
          <CardContent>
            <ChartContainer config={noChartConfig}>
              <BarChart
                accessibilityLayer
                data={data ? mapStatisticsToChartData(data) : []}
              >
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
        <div className="max-lg:order-first lg:row-span-2 lg:col-span-2">
          <TaskList />
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Completed percents</h3>
          </CardHeader>
          <CardContent>
            <ChartContainer config={percentChartConfig}>
              <BarChart
                accessibilityLayer
                data={mapStatisticsToPercentages(data)}
              >
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelKey="value"
                      nameKey="label"
                      indicator="dashed"
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="value" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
