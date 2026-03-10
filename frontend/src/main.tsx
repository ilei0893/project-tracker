import { BrowserRouter, Routes, Route } from "react-router";
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { Navigate } from "react-router";

import { type User } from "./context/UserContext";
import { UserContext, UserSetterContext } from "./context/UserContext.ts";

import ProtectedRoute from "./components/ProtectedRoute.tsx";
import AuthLayout from "./components/AuthLayout.tsx";
import Register from "./components/Register.tsx";
import Login from "./components/Login.tsx";
import "./index.css";
import App from "./App.tsx";

function Root() {
  const [user, setUser] = useState<User | null>(null);
  return (
    <BrowserRouter>
      <UserContext.Provider value={user}>
        <UserSetterContext.Provider value={setUser}>
          <Routes>
            <Route
              index
              element={
                <ProtectedRoute>
                  <App />
                </ProtectedRoute>
              }
            />
            <Route element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </UserSetterContext.Provider>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
