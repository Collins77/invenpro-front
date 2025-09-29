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

function App() {

  return (
    <>
      <Routes>
        {/* <Route path="" element={<Login />} /> */}
        {/* <Route path="" element={<SignUp />} /> */}
        <Route path="dashboard" element={<DashLayout />} >
          <Route index element={<Home />} />   
          <Route path="add-stock" element={<AddStock />} />   
          <Route path="products" element={<Products />} />   
          <Route path="out-of-stock" element={<OutStockProducts />} />   
          <Route path="add-product" element={<AddProduct />} />  
          <Route path="products/edit/:id" element={<EditProduct />} /> 
        </Route>
        <Route path="/pos" element={<Pos />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
