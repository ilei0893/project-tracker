import type { Dispatch, SetStateAction } from "react";
import type { TaskData } from "../types/types";

const apiUrl = import.meta.env.VITE_BASE_URL;

function stateClass(state: string) {
  return `state__badge state__badge--${state.toLowerCase().replace(/\s+/g, "-")}`;
}

interface TaskFormProps {
  selectedState: string | null;
  setTasks: Dispatch<SetStateAction<TaskData[]>>;
  setSelectedState: Dispatch<SetStateAction<string | null>>;
}
export default function CreateTaskForm({
  selectedState,
  setTasks,
  setSelectedState,
}: TaskFormProps) {
  function closeForm() {
    setSelectedState(null);
  }

  async function createTask(formData: FormData) {
    const res = await fetch(`${apiUrl}/tasks`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        title: formData.get("title") as string,
        author: "Ivan Lei",
        description: formData.get("description") as string,
        state: formData.get("state") as string,
      }),
    });

    if (!res.ok) {
      throw new Error("Post couldnt be created");
    }
    const json = await res.json();

    setTasks((prev) => [
      ...prev,
      {
        id: json.id,
        title: json.title,
        author: json.author,
        description: json.description,
        state: json.state,
        createdAt: json.created_at,
        updatedAt: json.updated_at,
      },
    ]);
    setSelectedState(null);
  }
  return (
    <>
      {selectedState && (
        <>
          <div onClick={closeForm} className="modal__container" />
          <div className="modal__default">
            <div className="modal__header">
              <h3 className="modal__title">New Task</h3>
              <button
                className="modal__close"
                onClick={closeForm}
                aria-label="close"
              >
                ✕
              </button>
            </div>
            <form action={createTask} className="modal__body">
              <input
                type="hidden"
                name="state"
                value={selectedState ?? ""}
                required
              />
              <div className="modal__main">
                <label className="form__label" htmlFor="title">
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  className="form__input"
                  placeholder="Story title..."
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
                  rows={10}
                />
              </div>
              <aside className="modal__aside">
                <div className="metadata__item">
                  <span className="metadata__label">State</span>
                  <span className={stateClass(selectedState)}>
                    {selectedState}
                  </span>
                </div>
                <div className="metadata__item">
                  <span className="metadata__label">Author</span>
                  <span className="metadata__value">Ivan Lei</span>
                </div>
                <div className="form__submit">
                  <button type="submit" className="button__create">
                    Create Task
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
