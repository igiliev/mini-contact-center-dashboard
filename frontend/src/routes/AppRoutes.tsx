import { Navigate, Route, Routes } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import LoginPage from "../pages/LoginPage";
import ContactsPage from "../pages/ContactsPage";
import ContactDetailsPage from "../pages/ContactDetailsPage";
import type { JSX } from "react";

function RequireAuth({ children }: { children: JSX.Element }) {
  const token = useAppSelector((s) => s.auth.token);
  return token ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <RequireAuth>
            <ContactsPage />
          </RequireAuth>
        }
      />

      <Route
        path="/contacts/:id"
        element={
          <RequireAuth>
            <ContactDetailsPage />
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
