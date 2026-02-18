import type { Dispatch, SetStateAction } from "react";
import type { TaskData } from "../types/types.ts";
import Task from "./Task.tsx";

interface TaskSectionProps {
  header: string;
  tasks: TaskData[];
  setSelectedState: Dispatch<SetStateAction<string | null>>;
  setCurrentTask: Dispatch<SetStateAction<TaskData | null>>;
  setHidden: Dispatch<SetStateAction<boolean>>;
}

export default function TaskSection({
  header,
  tasks,
  setSelectedState,
  setCurrentTask,
  setHidden,
}: TaskSectionProps) {
  function handleClick() {
    setSelectedState(header);
  }

  return (
    <div className="project__column">
      <header className="project__header">
        <h4>{header}</h4>
        <button
          onClick={handleClick}
          className="button__add"
          aria-label="add task"
        >
          +
        </button>
      </header>
      {tasks
        .filter((task) => task.state === header)
        .map((task) => {
          return (
            <Task
              id={task.id}
              key={task.id}
              title={task.title}
              author={task.author}
              description={task.description}
              state={task.state}
              setCurrentTask={setCurrentTask}
              setHidden={setHidden}
            />
          );
        })}
    </div>
  );
}
