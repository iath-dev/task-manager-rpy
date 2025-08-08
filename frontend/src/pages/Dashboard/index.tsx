import { TaskList } from "@/components/TaskList/TaskList";

export const DashboardPage = () => {
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
        <div>chart</div>
        <div className="max-lg:order-first lg:row-span-2 lg:col-span-2">
          <TaskList />
        </div>
        <div>chart</div>
      </section>
    </div>
  );
};
