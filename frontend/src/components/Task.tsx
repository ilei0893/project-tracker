import type { Dispatch, SetStateAction } from "react";
import type { TaskData } from "../types/types";

interface TaskProps {
  id: number;
  title: string;
  author: string;
  setCurrentTask: Dispatch<SetStateAction<TaskData | null>>;
  setHidden: Dispatch<SetStateAction<boolean>>;
}
const apiUrl = import.meta.env.VITE_BASE_URL;
export default function Task({
  title,
  author,
  id,
  setCurrentTask,
  setHidden,
}: TaskProps) {
  async function fetchTask() {
    try {
      const res = await fetch(`${apiUrl}/tasks/${id}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error("Couldn't get task");
      }

      const data = {
        id: json.id,
        title: json.title,
        description: json.description,
        state: json.state,
        author: json.author,
      };
      setCurrentTask(data);
      setHidden((prev) => !prev);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <button onClick={fetchTask} className="project__listItem">
      <h5>{title}</h5>
      <span>{author}</span>
    </button>
  );
}
