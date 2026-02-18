import type { Dispatch, SetStateAction } from "react";
import type { TaskData } from "../types/types";

interface TaskProps {
  task: TaskData;
  setCurrentTask: Dispatch<SetStateAction<TaskData | null>>;
  setHidden: Dispatch<SetStateAction<boolean>>;
}
export default function Task({ task, setCurrentTask, setHidden }: TaskProps) {
  function fetchTask() {
    const data = {
      id: task.id,
      title: task.title,
      description: task.description,
      state: task.state,
      author: task.author,
    };
    setCurrentTask(data);
    setHidden((prev) => !prev);
  }

  return (
    <button onClick={fetchTask} className="project__listItem">
      <h5>{task.title}</h5>
      <span>{task.author}</span>
    </button>
  );
}
