import type { Dispatch, SetStateAction } from "react";
import type { TaskData } from "../types/types";

interface TaskModalProps {
  task: TaskData | null;
  hidden: boolean;
  setHidden: Dispatch<SetStateAction<boolean>>;
}

export default function TaskModal({ task, hidden, setHidden }: TaskModalProps) {
  function closeForm() {
    setHidden(true);
  }
  return (
    <>
      {!hidden && task && (
        <>
          <div onClick={closeForm} className="modal__container"></div>
          <div className="modal__default">
            <div className="modal__header">
              <h3>{task.title}</h3>
              <button
                onClick={closeForm}
                className="modal__close"
                aria-label="close form"
              >
                X
              </button>
            </div>
            <div className="form__default">
              <input type="hidden" name="state" value="true" required />
              <span>{task.description}</span>
              <span>{task.author}</span>
            </div>
          </div>
        </>
      )}
    </>
  );
}
