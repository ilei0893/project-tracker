import type { TaskData } from "../types/types";
import { tasksClient } from "../client";
import { useEffect, useRef, useState } from "react";
import TaskSection from "./TaskSection";
import Task from "./Task";
import CreateTaskForm from "./CreateTaskForm";
import TaskModal from "./TaskModal";

export default function Kanban() {
  const states = ["Backlog", "Todo", "In Progress", "Completed"];
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [hidden, setHidden] = useState(true);
  const [currentTask, setCurrentTask] = useState<TaskData | null>(null);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const draggingId = useRef<number | null>(null);
  const draggingState = useRef<string | null>(null);

  useEffect(() => {
    const getTasks = async () => {
      try {
        const res = await tasksClient.getAll();
        setTasks(res);
      } catch (e) {
        console.log(e);
      }
    };
    getTasks();
  }, []);

  const setDragging = (task: TaskData | null) => {
    draggingId.current = task?.id ?? null;
    draggingState.current = task?.state ?? null;
  };

  const onDrop = async (state: string) => {
    if (draggingId.current === null || draggingState.current === state) return;

    draggingState.current = state;
    const id = draggingId.current;

    try {
      const res = await tasksClient.update(id, { state: state });

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? {
                ...task,
                state,
                createdAt: res.createdAt,
                updatedAt: res.updatedAt,
              }
            : task,
        ),
      );
    } catch (e) {
      console.log(e);
    }
  };

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
        {states.map((state) => {
          return (
            <TaskSection
              key={state}
              setSelectedState={setSelectedState}
              onDrop={onDrop}
              state={state}
            >
              {tasks
                .filter((task) => task.state === state)
                .sort(
                  (a, b) =>
                    new Date(b.updatedAt).getTime() -
                    new Date(a.updatedAt).getTime(),
                )
                .map((task) => {
                  return (
                    <Task
                      key={task.id}
                      task={task}
                      setTasks={setTasks}
                      setDragging={setDragging}
                      onSelect={onSelect}
                    />
                  );
                })}
            </TaskSection>
          );
        })}
      </section>
    </main>
  );
}
