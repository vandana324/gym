// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import MemberDashboard from "./pages/MemberDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateUser from "./pages/CreateUser";
import Register from "./pages/register";
import Dashboard from "./gymadmin/dashboard";
import Member from "./gymadmin/Member";
import TrainerPage from "./gymadmin/TrainerPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["superadmin", "gymadmin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/member"
            element={
              <ProtectedRoute allowedRoles={["member", "trainer"]}>
                <MemberDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-user"
            element={
              <ProtectedRoute allowedRoles={["superadmin", "gymadmin"]}>
                <CreateUser />
              </ProtectedRoute>
            }
          />


          import TrainerPage from "./gymadmin/Trainer";

<Route
  path="/trainers"
  element={
    <ProtectedRoute allowedRoles={["gymadmin"]}>
      <TrainerPage />
    </ProtectedRoute>
  }
/>

          <Route path="*" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/gymadminpage" element={<Dashboard />} />
          <Route path="/joinedMember" element={<Member />} />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
