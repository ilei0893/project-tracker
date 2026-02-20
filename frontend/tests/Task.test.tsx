import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import Task from "../src/components/Task";

const task = {
  id: 1,
  title: "A title",
  description: "A description",
  author: "An author",
  state: "Backlog",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};
const user = userEvent.setup();

describe("Task", () => {
  render(
    <Task
      task={task}
      setTasks={vi.fn()}
      setDragging={vi.fn()}
      onSelect={vi.fn()}
    />,
  );

  it("renders the task", () => {
    expect(
      screen.getByRole("button", { name: /a title/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/a title/i)).toBeInTheDocument();
    expect(screen.getByText(/An Author/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /delete task/i }),
    ).toBeInTheDocument();
  });

  describe("when deleting", () => {
    describe("with res ok", () => {
      beforeEach(() => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));
      });

      describe("with pointer", () => {
        it("removes the task", async () => {
          const setTasks = vi.fn();
          const otherTask = { ...task, id: 2 };

          render(
            <Task
              task={task}
              setTasks={setTasks}
              setDragging={vi.fn()}
              onSelect={vi.fn()}
            />,
          );

          await user.click(
            screen.getByRole("button", { name: /delete task/i }),
          );

          const filterFn = setTasks.mock.calls[0][0];
          expect(setTasks).toHaveBeenCalled();
          expect(filterFn([task, otherTask])).toEqual([otherTask]);
        });
      });

      describe("with keyboard", () => {
        it("removes the task", async () => {
          const setTasks = vi.fn();
          const otherTask = { ...task, id: 2 };

          render(
            <Task
              task={task}
              setTasks={setTasks}
              setDragging={vi.fn()}
              onSelect={vi.fn()}
            />,
          );
          screen.getByRole("button", { name: /delete task/i }).focus();
          await user.keyboard("{Enter}");

          const filterFn = setTasks.mock.calls[0][0];
          expect(setTasks).toHaveBeenCalled();
          expect(filterFn([task, otherTask])).toEqual([otherTask]);
        });
      });
    });

    describe("with res not ok", () => {
      beforeEach(() => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
      });

      it("does not call setTasks", async () => {
        const setTasks = vi.fn();

        render(
          <Task
            task={task}
            setTasks={setTasks}
            setDragging={vi.fn()}
            onSelect={vi.fn()}
          />,
        );

        await user.click(screen.getByRole("button", { name: /delete task/i }));
        expect(setTasks).not.toHaveBeenCalled();
      });
    });
  });

  it("calls onSelect when the card is clicked", async () => {
    const onSelect = vi.fn();

    render(
      <Task
        task={task}
        setTasks={vi.fn()}
        setDragging={vi.fn()}
        onSelect={onSelect}
      />,
    );

    await user.click(screen.getByRole("button", { name: /a title/i }));
    expect(onSelect).toHaveBeenCalledWith(task);
  });

  it("calls setDragging with task on drag start", () => {
    const setDragging = vi.fn();

    render(
      <Task
        task={task}
        setTasks={vi.fn()}
        setDragging={setDragging}
        onSelect={vi.fn()}
      />,
    );

    fireEvent.dragStart(screen.getByRole("button", { name: /a title/i }));
    expect(setDragging).toHaveBeenCalledWith(task);
  });

  it("calls setDragging with null on drag end", () => {
    const setDragging = vi.fn();

    render(
      <Task
        task={task}
        setTasks={vi.fn()}
        setDragging={setDragging}
        onSelect={vi.fn()}
      />,
    );

    fireEvent.dragEnd(screen.getByRole("button", { name: /a title/i }));
    expect(setDragging).toHaveBeenCalledWith(null);
  });
});
