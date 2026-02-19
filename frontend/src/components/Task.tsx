import { type Dispatch, type SetStateAction } from "react";
import type { TaskData } from "../types/types";

const apiUrl = import.meta.env.VITE_BASE_URL;
interface TaskProps {
  task: TaskData;
  setTasks: Dispatch<SetStateAction<TaskData[]>>;
  setDragging: (task: TaskData | null) => void;
  onSelect: (task: TaskData) => void;
}
export default function Task({
  task,
  setTasks,
  onSelect,
  setDragging,
}: TaskProps) {
  function getTask() {
    onSelect(task);
  }

  const handleDragStart = () => {
    setDragging(task);
  };

  const handleDragEnd = () => {
    setDragging(null);
  };

  async function deleteTask(e: React.MouseEvent) {
    e.stopPropagation();
    try {
      const res = await fetch(`${apiUrl}/tasks/${task.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Post couldnt be deleted");
      }

      setTasks((prev) => prev.filter((item) => item.id !== task.id));
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <button
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={getTask}
      className="project__listItem"
    >
      <div>
        <h5>{task.title}</h5>
        <span
          role="button"
          tabIndex={0}
          onClick={deleteTask}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") deleteTask(e as never);
          }}
          className="project__listItem-delete"
          aria-label="Delete task"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
          </svg>
        </span>
      </div>
      <span>{task.author}</span>
    </button>
  );
}
