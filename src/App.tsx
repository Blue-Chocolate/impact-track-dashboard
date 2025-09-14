import { Routes, Route, Navigate } from "react-router-dom";
import SafeGate from "./components/SafeGate";
import MainLayout from "./layouts/MainLayout.tsx";
import SignIn from "./pages/SignIn";

const Board = () => <h1>Board Page (any logged-in user)</h1>;
const BossZone = () => <h1>Admin Lounge</h1>;
const ManageSpot = () => <h1>Manager Lounge</h1>;
const DonorCorner = () => <h1>Donor Lounge</h1>;

function App() {
  return (
    <Routes>
      <Route path="/login" element={<SignIn />} />
      <Route path="/unauthorized" element={<div>No Access</div>} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" />} />

        <Route element={<SafeGate />}>
          <Route path="/dashboard" element={<Board />} />
        </Route>

        <Route element={<SafeGate allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<BossZone />} />
        </Route>

        <Route element={<SafeGate allowedRoles={["manager"]} />}>
          <Route path="/manager" element={<ManageSpot />} />
        </Route>

        <Route element={<SafeGate allowedRoles={["donor"]} />}>
          <Route path="/donor" element={<DonorCorner />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;