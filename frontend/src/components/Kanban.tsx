import TaskSection from "./TaskSection";

export default function Kanban() {
  return (
    <main>
      <section className="project__list">
        <TaskSection header="Backlog" />
        <TaskSection header="Todo" />
        <TaskSection header="In Progress" />
        <TaskSection header="Completed" />
      </section>
    </main>
  );
}
