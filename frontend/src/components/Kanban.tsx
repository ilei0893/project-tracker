import type { TaskData } from "../types/types";
import { useEffect, useState } from "react";
import TaskSection from "./TaskSection";
import CreateTaskForm from "./CreateTaskForm";
import TaskModal from "./TaskModal";

const apiUrl = import.meta.env.VITE_BASE_URL;
export default function Kanban() {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [hidden, setHidden] = useState(true);
  const [currentTask, setCurrentTask] = useState<TaskData | null>(null);
  const [tasks, setTasks] = useState<TaskData[]>([]);

  useEffect(() => {
    const getTasks = async () => {
      try {
        const res = await fetch(`${apiUrl}/tasks`);
        const json = await res.json();

        if (!res.ok) {
          throw new Error("Couldn't get tasks");
        }
        const data = json.map((task: TaskData) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          state: task.state,
          author: task.author,
        }));
        setTasks(data);
      } catch (e) {
        console.log(e);
      }
    };
    getTasks();
  }, []);

  function onSelect(task: TaskData) {
    setCurrentTask(task);
    setHidden((prev) => !prev);
  }

  return (
    <main>
      <CreateTaskForm
        setTasks={setTasks}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
      />
      <TaskModal task={currentTask} hidden={hidden} setHidden={setHidden} />
      <section className="project__list">
        <TaskSection
          tasks={tasks}
          setTasks={setTasks}
          setSelectedState={setSelectedState}
          onSelect={onSelect}
          header="Backlog"
        />
        <TaskSection
          tasks={tasks}
          setTasks={setTasks}
          setSelectedState={setSelectedState}
          onSelect={onSelect}
          header="Todo"
        />
        <TaskSection
          setTasks={setTasks}
          tasks={tasks}
          setSelectedState={setSelectedState}
          onSelect={onSelect}
          header="In Progress"
        />
        <TaskSection
          tasks={tasks}
          setTasks={setTasks}
          setSelectedState={setSelectedState}
          onSelect={onSelect}
          header="Completed"
        />
      </section>
    </main>
  );
}
