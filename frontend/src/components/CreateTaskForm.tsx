import type { Dispatch, SetStateAction } from "react";
import type { TaskData } from "../types/types";

const apiUrl = import.meta.env.VITE_BASE_URL;
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
          <div onClick={closeForm} className="modal__container"></div>
          <div className="modal__default">
            <div className="modal__header">
              <h3>Create a Task</h3>
              <button
                className="modal__close"
                onClick={closeForm}
                aria-label="close form"
              >
                X
              </button>
            </div>
            <form action={createTask} className="form__default">
              <input
                type="hidden"
                name="state"
                value={selectedState ?? ""}
                required
              />
              <label htmlFor="title">Title</label>
              <input id="title" type="textarea" name="title" required></input>
              <label htmlFor="title">Description</label>
              <textarea
                id="description"
                name="description"
                cols={50}
                rows={20}
              ></textarea>
              <button>Create Task</button>
            </form>
          </div>
        </>
      )}
    </>
  );
}
