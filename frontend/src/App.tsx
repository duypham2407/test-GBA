import { Routes, Route } from "react-router";
import Login from "./pages/Login";
import DashboardLayout from "./components/DashboardLayout";
import DashboardStats from "./pages/DashboardStats";
import ProductList from "./pages/ProductList";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<DashboardStats />} />
        <Route path="products" element={<ProductList />} />
      </Route>
    </Routes>
  );
}

export default App;
