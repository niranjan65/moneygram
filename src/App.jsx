import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import MoneyExchange from "./pages/MoneyExchange";
import Login from "./pages/Login";
import MoneyTransfer from "./pages/MoneyTransfer";
import TransactionHistory from "./pages/TransactionHistory";
import Contact from "./pages/ContactUs";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Route */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/money-transfer"
          element={
            <ProtectedRoute>
              <MoneyTransfer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/exchange"
          element={
            <ProtectedRoute>
              <MoneyExchange />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <TransactionHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/contact-us"
          element={
            <ProtectedRoute>
              <Contact />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
