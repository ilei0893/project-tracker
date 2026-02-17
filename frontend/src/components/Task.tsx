import type { TaskData } from "../types/types";

export default function Task({ title, author, description }: TaskData) {
  return (
    <button className="project__listItem">
      <h5>{title}</h5>
      <span>{description}</span>
      <span>{author}</span>
    </button>
  );
}
