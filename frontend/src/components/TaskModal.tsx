import { useState, type Dispatch, type SetStateAction } from "react";
import type { TaskData } from "../types/types";
import { tasksClient } from "../client";
import { toast } from "react-toastify";

interface TaskModalProps {
  task: TaskData | null;
  hidden: boolean;
  setHidden: Dispatch<SetStateAction<boolean>>;
  setTasks: Dispatch<SetStateAction<TaskData[]>>;
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

export default function TaskModal({
  task,
  hidden,
  setHidden,
  setTasks,
}: TaskModalProps) {
  const [isEditing, setIsEditing] = useState(false);

  function closeForm() {
    setHidden(true);
    setIsEditing(false);
  }

  function handleEdit() {
    setIsEditing((isEditing) => !isEditing);
  }

  async function editTask(formData: FormData) {
    if (task) {
      try {
        const updated = await tasksClient.update(task.id, {
          title: formData.get("title") as string,
          author: formData.get("author") as string,
          description: formData.get("description") as string,
          state: formData.get("state") as string,
        });
        setTasks((prev) =>
          prev.map((t) => (t.id === updated.id ? updated : t)),
        );
        setIsEditing(false);
      } catch (e) {
        const errors = e as Record<string, string[]>;
        if (errors.title) toast.error(`Title ${errors.title[0]}`);
        {
          toast.error(`Title ${errors.title[0]}`);
        }
      }
    }
  }
  return (
    <>
      {!hidden && !isEditing && task && (
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
                <div className="form__button">
                  <button onClick={handleEdit} className="button__create">
                    Edit Task
                  </button>
                </div>
              </aside>
            </div>
          </div>
        </>
      )}
      {!hidden && isEditing && task && (
        <>
          <div onClick={closeForm} className="modal__container" />
          <div className="modal__default">
            <div className="modal__header">
              <h3 className="modal__title">Edit Task</h3>
              <button
                onClick={closeForm}
                className="modal__close"
                aria-label="close"
              >
                ✕
              </button>
            </div>
            <form action={editTask} className="modal__body">
              <input type="hidden" name="state" value={task.state} />
              <div className="modal__main">
                <label className="form__label" htmlFor="title">
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  className="form__input"
                  placeholder="Task title..."
                  defaultValue={task.title}
                  required
                />
                <label className="form__label" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="form__textarea"
                  placeholder="Add a description..."
                  defaultValue={task.description}
                  rows={10}
                />
              </div>
              <aside className="modal__aside">
                <div className="metadata__item">
                  <span className="metadata__label">State</span>
                  <span className={stateClass(task.state)}>{task.state}</span>
                </div>
                <div className="metadata__item">
                  <span className="metadata__label">Author</span>
                  <span className="metadata__defaultValue">{task.author}</span>
                </div>

                <input
                  type="hidden"
                  name="author"
                  defaultValue={task.author}
                  required
                />
                <div className="form__button">
                  <button type="submit" className="button__create">
                    Save
                  </button>
                </div>
              </aside>
            </form>
          </div>
        </>
      )}
    </>
  );
}
