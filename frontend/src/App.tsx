import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import ProtectedRoute from "./components/ProtectedRoute";
import { Navigate } from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
  path="/"
  element={<Navigate to="/login" replace />}
/>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route element={<ProtectedRoute />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

        </Route>

        <Route
            path="/chat"
            element={<Chat />}
          />

      </Routes>
    </BrowserRouter>
  );
}

export default App;