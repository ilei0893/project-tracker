import TaskSection from "./TaskSection";
import CreateTaskForm from "./CreateTaskForm";
import { useState } from "react";

export default function Kanban() {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [tasks, setTasks] = useState([
    {
      title: "a task",
      author: "Ivan Lei",
      description: "blah blah",
      state: "Backlog",
    },
  ]);

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
