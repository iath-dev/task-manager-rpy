import { TaskList } from "@/components/TaskList/TaskList";

export const DashboardPage = () => {
  return (
    <div>
      <section className="grid grid-cols-2 grid-rows-2 gap-4">
        <div>chart</div>
        <div className="row-span-2">
          <TaskList />
        </div>
        <div>chart</div>
      </section>
    </div>
  );
};
