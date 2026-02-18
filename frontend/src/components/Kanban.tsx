import type { TaskData } from "../types/types"
import { useEffect, useState } from "react"
import TaskSection from "./TaskSection"
import CreateTaskForm from "./CreateTaskForm"

export default function Kanban() {
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [tasks, setTasks] = useState<TaskData[]>([])

  useEffect(() => {
    const getTasks = async () => {
      try {
        const res = await fetch("http://localhost:3000/tasks")
        const json = await res.json()

        if (!res.ok) {
          throw new Error("Couldn't get tasks")
        }
        const data = json.map((task: TaskData) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          state: task.state,
          author: task.author,
        }))
        setTasks(data)
      } catch (e) {
        console.log(e)
      }
    }
    getTasks()
  }, [])

  return (
    <main>
      <CreateTaskForm
        setTasks={setTasks}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
      />
      <section className="project__list">
        <TaskSection
          tasks={tasks}
          setSelectedState={setSelectedState}
          header="Backlog"
        />
        <TaskSection
          tasks={tasks}
          setSelectedState={setSelectedState}
          header="Todo"
        />
        <TaskSection
          tasks={tasks}
          setSelectedState={setSelectedState}
          header="In Progress"
        />
        <TaskSection
          tasks={tasks}
          setSelectedState={setSelectedState}
          header="Completed"
        />
      </section>
    </main>
  )
}
