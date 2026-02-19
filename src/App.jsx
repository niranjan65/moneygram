import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import MoneyExchange from "./pages/MoneyExchange";
import Login from "./pages/Login";
import MoneyTransfer from "./pages/MoneyTransfer";
import TransactionHistory from "./pages/TransactionHistory";

function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/" element={<Login />} />
      <Route path="/money-transfer" element={<MoneyTransfer />} />
      <Route path="/exchange" element={<MoneyExchange />} />
      <Route path="/transactions" element={<TransactionHistory />} />
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;




