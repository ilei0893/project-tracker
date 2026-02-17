import Task from "./Task";

export default function TaskSection({ header }: { header: string }) {
  return (
    <div className="project__column">
      <header className="project__header">
        <h4>{header}</h4>
        <button className="button__add" aria-label="add task">
          +
        </button>
      </header>
      <Task title="Task" author="Ivan" />
    </div>
  );
}
