import type { Dispatch, SetStateAction } from "react";
import type { TaskData } from "../types/types";

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

  // function createTask(formData: FormData) {
  //   setTasks((prev) => [
  //     ...prev,
  //     {
  //       title: formData.get("title") as string,
  //       author: formData.get("author") as string,
  //       description: formData.get("description") as string,
  //       state: formData.get("state") as string,
  //     },
  //   ]);
  //   setSelectedState(null);
  // }
  return (
    <div
      className={selectedState === null ? "modal__hidden" : "modal__default"}
    >
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
      <form className="form__default">
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
  );
}
