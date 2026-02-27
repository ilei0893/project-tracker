import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import Login from "../src/components/Login";

const user = userEvent.setup();

const renderLogin = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );

describe("Login", () => {
  beforeEach(() => {
    renderLogin();
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
  });

  it("renders an email field", () => {
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it("renders a password field", () => {
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
  });

  it("renders a submit button", () => {
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("renders a forgot password link", () => {
    expect(
      screen.getByRole("link", { name: /forgot my password/i }),
    ).toBeInTheDocument();
  });

  it("renders a register link", () => {
    expect(screen.getByRole("link", { name: /register/i })).toBeInTheDocument();
  });

  describe("accessibility", () => {
    it("associates the email label with its input", () => {
      expect(screen.getByLabelText(/email/i)).toHaveAttribute("id", "email");
    });

    it("associates the password label with its input", () => {
      expect(screen.getByLabelText(/^password$/i)).toHaveAttribute(
        "id",
        "password",
      );
    });

    it("sets the email input type to email", () => {
      expect(screen.getByLabelText(/email/i)).toHaveAttribute("type", "email");
    });

    it("sets the password input type to password", () => {
      expect(screen.getByLabelText(/^password$/i)).toHaveAttribute(
        "type",
        "password",
      );
    });

    it("the submit button is keyboard focusable", () => {
      const button = screen.getByRole("button", { name: /login/i });
      button.focus();
      expect(button).toHaveFocus();
    });

    it("the submit button is activatable with keyboard", async () => {
      screen.getByRole("button", { name: /login/i }).focus();
      await user.keyboard("{Enter}");
      expect(
        screen.getByRole("heading", { name: /login/i }),
      ).toBeInTheDocument();
    });

    it("the forgot password link has rel=noopener", () => {
      expect(
        screen.getByRole("link", { name: /forgot my password/i }),
      ).toHaveAttribute("rel", "noopener");
    });
  });

  describe("#login", () => {
    describe("with valid credentials", () => {
      beforeEach(() => {
        vi.stubGlobal(
          "fetch",
          vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ token: "abc123" }),
          }),
        );
        renderLogin();
      });

      it("calls the API", async () => {
        await user.type(screen.getAllByLabelText(/email/i)[0], "user@example.com");
        await user.type(screen.getAllByLabelText(/^password$/i)[0], "correct-pass");
        await user.click(screen.getAllByRole("button", { name: /login/i })[0]);
        expect(fetch).toHaveBeenCalled();
      });
    });

    describe("with invalid credentials", () => {
      beforeEach(() => {
        vi.stubGlobal(
          "fetch",
          vi.fn().mockResolvedValue({
            ok: false,
            json: () => Promise.resolve({ error: "Invalid credentials" }),
          }),
        );
        renderLogin();
      });

      it("stays on the login page", async () => {
        await user.type(screen.getAllByLabelText(/email/i)[0], "user@example.com");
        await user.type(screen.getAllByLabelText(/^password$/i)[0], "wrong-pass");
        await user.click(screen.getAllByRole("button", { name: /login/i })[0]);
        expect(
          screen.getAllByRole("heading", { name: /login/i })[0],
        ).toBeInTheDocument();
      });

      it("displays an error", async () => {
        await user.type(screen.getAllByLabelText(/email/i)[0], "user@example.com");
        await user.type(screen.getAllByLabelText(/^password$/i)[0], "wrong-pass");
        await user.click(screen.getAllByRole("button", { name: /login/i })[0]);
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });
    });

    describe("with empty fields", () => {
      it("stays on the login page", async () => {
        await user.click(screen.getByRole("button", { name: /login/i }));
        expect(
          screen.getByRole("heading", { name: /login/i }),
        ).toBeInTheDocument();
      });
    });

    describe("with an invalid email format", () => {
      beforeEach(() => {
        vi.stubGlobal(
          "fetch",
          vi.fn().mockResolvedValue({
            ok: false,
            json: () => Promise.resolve({ error: "Invalid email" }),
          }),
        );
        renderLogin();
      });

      it("stays on the login page", async () => {
        await user.type(screen.getAllByLabelText(/email/i)[0], "not-an-email");
        await user.type(screen.getAllByLabelText(/^password$/i)[0], "some-pass");
        await user.click(screen.getAllByRole("button", { name: /login/i })[0]);
        expect(
          screen.getAllByRole("heading", { name: /login/i })[0],
        ).toBeInTheDocument();
      });
    });
  });
});
