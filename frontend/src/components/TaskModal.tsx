import type { Dispatch, SetStateAction } from "react";
import type { TaskData } from "../types/types";

interface TaskModalProps {
  task: TaskData | null;
  hidden: boolean;
  setHidden: Dispatch<SetStateAction<boolean>>;
}

function stateClass(state: string) {
  return `state__badge state__badge--${state.toLowerCase().replace(/\s+/g, "-")}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
}

export default function TaskModal({ task, hidden, setHidden }: TaskModalProps) {
  function closeForm() {
    setHidden(true);
  }
  return (
    <>
      {!hidden && task && (
        <>
          <div onClick={closeForm} className="modal__container" />
          <div className="modal__default">
            <div className="modal__header">
              <h3 className="modal__title">{task.title}</h3>
              <button
                onClick={closeForm}
                className="modal__close"
                aria-label="close"
              >
                ✕
              </button>
            </div>
            <div className="modal__body">
              <div className="modal__main">
                <p className="modal__section-label">Description</p>
                <p className="modal__description">
                  {task.description || (
                    <span className="modal__empty">
                      No description provided.
                    </span>
                  )}
                </p>
              </div>
              <aside className="modal__aside">
                <div className="metadata__item">
                  <span className="metadata__label">State</span>
                  <span className={stateClass(task.state)}>{task.state}</span>
                </div>
                <div className="metadata__item">
                  <span className="metadata__label">Author</span>
                  <span className="metadata__value">{task.author}</span>
                </div>
                <div className="metadata__item">
                  <span className="metadata__label">Created</span>
                  <span className="metadata__value">
                    {formatDate(task.createdAt)}
                  </span>
                </div>
                <div className="metadata__item">
                  <span className="metadata__label">Updated</span>
                  <span className="metadata__value">
                    {formatDate(task.updatedAt)}
                  </span>
                </div>
              </aside>
            </div>
          </div>
        </>
      )}
    </>
  );
}
