import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import Register from "../src/components/Register";

const user = userEvent.setup();

const renderRegister = () =>
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>,
  );

describe("Register", () => {
  beforeEach(() => {
    renderRegister();
  });

  it("renders the heading", () => {
    expect(
      screen.getByRole("heading", { name: /register/i }),
    ).toBeInTheDocument();
  });

  it("renders an email field", () => {
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it("renders a password field", () => {
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
  });

  it("renders a confirm password field", () => {
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it("renders a submit button", () => {
    expect(
      screen.getByRole("button", { name: /register/i }),
    ).toBeInTheDocument();
  });

  it("renders a login link for existing users", () => {
    expect(screen.getByRole("link", { name: /login/i })).toBeInTheDocument();
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

    it("associates the confirm password label with its input", () => {
      expect(screen.getByLabelText(/confirm password/i)).toHaveAttribute(
        "id",
        "password-confirmation",
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

    it("sets the confirm password input type to password", () => {
      expect(screen.getByLabelText(/confirm password/i)).toHaveAttribute(
        "type",
        "password",
      );
    });

    it("the submit button is keyboard focusable", () => {
      const button = screen.getByRole("button", { name: /register/i });
      button.focus();
      expect(button).toHaveFocus();
    });

    it("the submit button is activatable with keyboard", async () => {
      screen.getByRole("button", { name: /register/i }).focus();
      await user.keyboard("{Enter}");
      expect(
        screen.getByRole("heading", { name: /register/i }),
      ).toBeInTheDocument();
    });
  });

  describe("#register", () => {
    describe("with valid details", () => {
      beforeEach(() => {
        vi.stubGlobal(
          "fetch",
          vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ token: "abc123" }),
          }),
        );
        renderRegister();
      });

      it("calls the API", async () => {
        await user.type(screen.getAllByLabelText(/email/i)[0], "new@example.com");
        await user.type(screen.getAllByLabelText(/^password$/i)[0], "secure-pass");
        await user.type(
          screen.getAllByLabelText(/confirm password/i)[0],
          "secure-pass",
        );
        await user.click(screen.getAllByRole("button", { name: /register/i })[0]);
        expect(fetch).toHaveBeenCalled();
      });
    });

    describe("with a duplicate email", () => {
      beforeEach(() => {
        vi.stubGlobal(
          "fetch",
          vi.fn().mockResolvedValue({
            ok: false,
            json: () => Promise.resolve({ error: "Email already in use" }),
          }),
        );
        renderRegister();
      });

      it("stays on the register page", async () => {
        await user.type(
          screen.getAllByLabelText(/email/i)[0],
          "existing@example.com",
        );
        await user.type(screen.getAllByLabelText(/^password$/i)[0], "some-pass");
        await user.type(
          screen.getAllByLabelText(/confirm password/i)[0],
          "some-pass",
        );
        await user.click(screen.getAllByRole("button", { name: /register/i })[0]);
        expect(
          screen.getAllByRole("heading", { name: /register/i })[0],
        ).toBeInTheDocument();
      });

      it("displays an error", async () => {
        await user.type(
          screen.getAllByLabelText(/email/i)[0],
          "existing@example.com",
        );
        await user.type(screen.getAllByLabelText(/^password$/i)[0], "some-pass");
        await user.type(
          screen.getAllByLabelText(/confirm password/i)[0],
          "some-pass",
        );
        await user.click(screen.getAllByRole("button", { name: /register/i })[0]);
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });
    });

    describe("when passwords do not match", () => {
      it("stays on the register page", async () => {
        await user.type(screen.getByLabelText(/email/i), "user@example.com");
        await user.type(screen.getByLabelText(/^password$/i), "password-one");
        await user.type(
          screen.getByLabelText(/confirm password/i),
          "password-two",
        );
        await user.click(screen.getByRole("button", { name: /register/i }));
        expect(
          screen.getByRole("heading", { name: /register/i }),
        ).toBeInTheDocument();
      });

      it("displays a mismatch error", async () => {
        await user.type(screen.getByLabelText(/email/i), "user@example.com");
        await user.type(screen.getByLabelText(/^password$/i), "password-one");
        await user.type(
          screen.getByLabelText(/confirm password/i),
          "password-two",
        );
        await user.click(screen.getByRole("button", { name: /register/i }));
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });

      it("does not call the API", async () => {
        vi.stubGlobal("fetch", vi.fn());
        await user.type(screen.getByLabelText(/email/i), "user@example.com");
        await user.type(screen.getByLabelText(/^password$/i), "password-one");
        await user.type(
          screen.getByLabelText(/confirm password/i),
          "password-two",
        );
        await user.click(screen.getByRole("button", { name: /register/i }));
        expect(fetch).not.toHaveBeenCalled();
      });
    });

    describe("with empty fields", () => {
      it("stays on the register page", async () => {
        await user.click(screen.getByRole("button", { name: /register/i }));
        expect(
          screen.getByRole("heading", { name: /register/i }),
        ).toBeInTheDocument();
      });
    });

    describe("with an invalid email format", () => {
      it("stays on the register page", async () => {
        await user.type(screen.getByLabelText(/email/i), "not-an-email");
        await user.type(screen.getByLabelText(/^password$/i), "some-pass");
        await user.type(
          screen.getByLabelText(/confirm password/i),
          "some-pass",
        );
        await user.click(screen.getByRole("button", { name: /register/i }));
        expect(
          screen.getByRole("heading", { name: /register/i }),
        ).toBeInTheDocument();
      });
    });
  });
});