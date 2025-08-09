import type { TasksStatistics } from "@/interfaces/tasks";

export const mapStatisticsToChartData = (statistics: TasksStatistics) => {
  return [
    { label: "total", value: statistics.total_tasks, fill: "#f97316" },
    {
      label: "completed",
      value: statistics.completed_tasks,
      fill: "#22c55e",
    },
    { label: "pending", value: statistics.pending_tasks, fill: "#2563eb" },
  ];
};

export const mapStatisticsToPercentages = (statistics?: TasksStatistics) => {
  return [
    {
      label: "completed",
      value: statistics?.completed_percentage ?? 0.0,
      fill: "#2563eb",
    },
    {
      label: "pending",
      value: statistics?.pending_percentage ?? 100.0,
      fill: "#60a5fa",
    },
  ];
};
