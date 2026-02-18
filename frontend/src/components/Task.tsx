import type { Dispatch, SetStateAction } from "react";
import type { TaskData } from "../types/types";

interface TaskProps {
  id: number;
  title: string;
  author: string;
  setCurrentTask: Dispatch<SetStateAction<TaskData | null>>;
  setHidden: Dispatch<SetStateAction<boolean>>;
}
export default function Task({
  id,
  title,
  description,
  author,
  state,
  setCurrentTask,
  setHidden,
}: TaskProps) {
  function fetchTask() {
    const data = {
      id: id,
      title: title,
      description: description,
      state: state,
      author: author,
    };
    setCurrentTask(data);
    setHidden((prev) => !prev);
  }

  return (
    <button onClick={fetchTask} className="project__listItem">
      <h5>{title}</h5>
      <span>{author}</span>
    </button>
  );
}
