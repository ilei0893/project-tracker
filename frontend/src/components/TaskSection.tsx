import { type Dispatch, type SetStateAction } from "react";
import type { TaskData } from "../types/types.ts";
import Task from "./Task.tsx";

interface TaskSectionProps {
  state: string;
  tasks: TaskData[];
  setTasks: Dispatch<SetStateAction<TaskData[]>>;
  setSelectedState: Dispatch<SetStateAction<string | null>>;
  setDragging: (task: TaskData | null) => void;
  onDrop: (state: string) => void;
  onSelect: (task: TaskData) => void;
}

export default function TaskSection({
  state,
  tasks,
  setTasks,
  setDragging,
  onDrop,
  setSelectedState,
  onSelect,
}: TaskSectionProps) {
  function handleClick() {
    setSelectedState(state);
  }

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop(state)}
      className="project__column"
    >
      <header className="project__header">
        <h4>{state}</h4>
        <button
          onClick={handleClick}
          className="button__add"
          aria-label="add task"
        >
          +
        </button>
      </header>
      {tasks
        .filter((task) => task.state === state)
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
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
    </div>
  );
}
