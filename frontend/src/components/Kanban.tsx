import TaskSection from "./TaskSection";
import CreateTaskForm from "./CreateTaskForm";
import { useEffect, useState } from "react";

export default function Kanban() {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [tasks, setTasks] = useState();

  useEffect(() => {
    setTasks(getTasks());
  }, []);

  async function getTasks() {
    try {
      const res = await fetch("http://localhost:3000/tasks");
      const json = await res.json();

      if (!res.ok) {
        throw new Error("Couldn't get tasks");
      }
      console.log(json);
      return json.map((task: any) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        state: task.state,
        author: task.author,
      }));
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <main>
      <CreateTaskForm
        setTasks={setTasks}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
      />
      <section className="project__list">
        <TaskSection
          tasks={tasks}
          setSelectedState={setSelectedState}
          header="Backlog"
        />
        <TaskSection
          tasks={tasks}
          setSelectedState={setSelectedState}
          header="Todo"
        />
        <TaskSection
          tasks={tasks}
          setSelectedState={setSelectedState}
          header="In Progress"
        />
        <TaskSection
          tasks={tasks}
          setSelectedState={setSelectedState}
          header="Completed"
        />
      </section>
    </main>
  );
}
