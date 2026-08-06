import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        <Route path="/chat/:chatId"
          element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          
      </Routes>
    </BrowserRouter>
  );
}

export default App;