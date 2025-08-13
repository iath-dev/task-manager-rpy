import { TaskList } from "@/components/TaskList/TaskList";

export const TaskListPage = () => {
  return (
    <main>
      <section>
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1 py-4">
            <h2 className="text-2xl/7 font-bold sm:truncate sm:text-3xl sm:tracking-tight">
              Task List
            </h2>
          </div>
        </div>
        <TaskList />
      </section>
    </main>
  );
};
