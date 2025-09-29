import { Route, Routes } from "react-router-dom"
import DashLayout from "./features/DashLayout"
import Home from "./pages/Home"
import AddStock from "./pages/AddStock"
import Products from "./pages/Products"
import OutStockProducts from "./pages/OutStockProducts"
import AddProduct from "./pages/AddProduct"
import { Toaster } from "sonner"
import Pos from "./pages/Pos"
import EditProduct from "./pages/EditProduct"
import Sales from "./pages/Sales"
import SalePage from "./pages/SalePage"
import Categories from "./pages/Categories"
import Brands from "./pages/Brands"
import Reports from "./pages/Reports"
import Login from "./pages/Login"
import ProtectedRoute from "./features/ProtectedRoute"

function App() {

  return (
    <>
      <Routes>
        <Route path="dashboard" element={
          <ProtectedRoute>
            <DashLayout />
          </ProtectedRoute>
        } >
          <Route index element={<Home />} />
          <Route path="add-stock" element={<AddStock />} />
          <Route path="products" element={<Products />} />
          <Route path="sales" element={<Sales />} />
          <Route path="categories" element={<Categories />} />
          <Route path="reports" element={<Reports />} />
          <Route path="brands" element={<Brands />} />
          <Route path="sales/:id" element={<SalePage />} />
          <Route path="out-of-stock" element={<OutStockProducts />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
        </Route>
        <Route path="/pos" element={
          <ProtectedRoute>
            <Pos />
          </ProtectedRoute>}
        />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
