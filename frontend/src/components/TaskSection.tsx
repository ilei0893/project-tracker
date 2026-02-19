import { type Dispatch, type SetStateAction, type ReactNode } from "react";

interface TaskSectionProps {
  state: string;
  setSelectedState: Dispatch<SetStateAction<string | null>>;
  onDrop: (state: string) => void;
  children: ReactNode;
}

export default function TaskSection({
  state,
  onDrop,
  setSelectedState,
  children,
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
      {children}
    </div>
  );
}
