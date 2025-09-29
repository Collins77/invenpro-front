import { BadgeAlert, BadgePercent, Calendar, ChevronRight, ShoppingCart, TrendingUp } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { fetchProducts, fetchSales } from "@/api"

const Home = () => {
  const [currentDate, setCurrentDate] = useState('')
  const [products, setProducts] = useState([])
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [topProducts, setTopProducts] = useState([])

  useEffect(() => {
    if (!sales.length) return

    const productMap = {}
    sales.forEach(sale => {
      sale.items.forEach(item => {
        productMap[item.Product.name] = (productMap[item.Product.name] || 0) + item.quantity
      })
    })

    const top = Object.entries(productMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)

    setTopProducts(top)
  }, [sales])

  useEffect(() => {
    const date = new Date()
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    const formattedDate = date.toLocaleDateString('en-US', options)
    setCurrentDate(formattedDate)

    const loadData = async () => {
      try {
        const [productsData, salesData] = await Promise.all([fetchProducts(), fetchSales()])
        setProducts(productsData)
        setSales(salesData)
      } catch (err) {
        console.error("Failed to load dashboard data:", err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) return <div className="p-4">Loading dashboard...</div>

  // Helper to check if a sale is today
  const isToday = (saleDate) => {
    const today = new Date()
    const sale = new Date(saleDate)
    return sale.getFullYear() === today.getFullYear() &&
      sale.getMonth() === today.getMonth() &&
      sale.getDate() === today.getDate()
  }

  // Inventory Value
  const inventoryValue = products.reduce((sum, p) => sum + p.stock * p.sellingPrice, 0)

  // Today's Sales
  const todaysSales = sales.filter(sale => isToday(sale.saleDate))
  const todaysSalesTotal = todaysSales.reduce((sum, sale) => sum + sale.totalAmount, 0)

  // Out of Stock
  const outOfStockProducts = products.filter(p => p.stock === 0)
  const firstFourOutOfStock = outOfStockProducts.slice(0, 4)

  // Today's Profit
  const todaysProfit = todaysSales.reduce((sum, sale) => {
    return sum + sale.items.reduce((itemSum, item) => {
      return itemSum + (item.sellingPrice - item.Product.purchasePrice) * item.quantity
    }, 0)
  }, 0)

  

  return (
    <div className='bg-white shadow-md p-4'>
      <div className='flex flex-col gap-2 border-b border-gray-200 p-2 mb-[20px]'>
        <h1 className='font-bold text-2xl'>Dashboard</h1>
        <p className='text-sm text-gray-500 flex items-center gap-2'>
          <Calendar size={20} />
          {currentDate}
        </p>
      </div>

      <div className='grid grid-cols-4 gap-4 mb-[20px]'>
        {/* Inventory Value */}
        <div className='flex justify-between p-2 border border-gray-200 rounded-md bg-white'>
          <div className='flex flex-col gap-2'>
            <h1 className='font-semibold text-sm'>Inventory Value</h1>
            <h1 className='text-2xl font-bold'>KES {inventoryValue.toLocaleString()}</h1>
            <div>
              <a href="" className='text-gray-500 text-sm underline flex items-center'>View Products</a>
            </div>
          </div>
          <div><ShoppingCart className='text-gray-500' /></div>
        </div>

        {/* Today's Sales */}
        <div className='flex justify-between p-2 border border-gray-200 rounded-md bg-white'>
          <div className='flex flex-col gap-2'>
            <h1 className='font-semibold text-sm'>Today's Sales</h1>
            <h1 className='text-2xl font-bold'>KES {todaysSalesTotal.toLocaleString()}</h1>
            <div>
              <a href="" className='text-gray-500 text-sm underline flex items-center'>View Sales</a>
            </div>
          </div>
          <div><BadgePercent className='text-gray-500' /></div>
        </div>

        {/* Out of Stock */}
        <div className='flex justify-between p-2 border border-gray-200 rounded-md bg-white'>
          <div className='flex flex-col gap-2'>
            <h1 className='font-semibold text-sm'>Out Of Stock</h1>
            <h1 className='text-2xl font-bold'>{outOfStockProducts.length}</h1>
            <div>
              <a href="" className='text-gray-500 text-sm underline flex items-center'>View Out of Stock</a>
            </div>
          </div>
          <div><BadgeAlert className='text-gray-500' /></div>
        </div>

        {/* Today's Profit */}
        <div className='flex justify-between p-2 border border-gray-200 rounded-md bg-white'>
          <div className='flex flex-col gap-2'>
            <h1 className='font-semibold text-sm'>Today's Profit</h1>
            <h1 className='text-2xl font-bold'>KES {todaysProfit.toLocaleString()}</h1>
            <div>
              <a href="" className='text-gray-500 text-sm underline flex items-center'>View Products</a>
            </div>
          </div>
          <div><TrendingUp className='text-gray-500' /></div>
        </div>
      </div>

      <div className='flex gap-4 w-full'>
        {/* Low Stock Table */}
        <div className='bg-white rounded-md p-2 w-[55%] shadow-md'>
          <div className='flex items-center justify-between mb-6'>
            <h1 className='font-semibold'>Low Stock Alerts</h1>
            <a href="/dashboard/out-of-stock" className='text-blue-600 underline text-sm gap-2 flex items-center'>
              View Details <ChevronRight />
            </a>
          </div>
          <Table>
            <TableCaption>Low stock products.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] text-gray-500">Item Name</TableHead>
                <TableHead className='text-gray-500'>Current Qty</TableHead>
                <TableHead className='text-gray-500'>Min Value</TableHead>
                <TableHead className="text-right text-gray-500">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {firstFourOutOfStock.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className='text-gray-500'>{p.stock}</TableCell>
                  <TableCell className='text-gray-500'>{p.minStock}</TableCell>
                  <TableCell className="text-right text-gray-500">{p.stock <= p.minStock ? "Low Stock" : "Active"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Top Selling Products Table */}
        <div className='w-[45%] bg-white rounded-md p-2 shadow-md'>
          <div className='flex items-center justify-between mb-6'>
            <h1 className='font-semibold'>Top Selling Products</h1>
            <a href="/dashboard/analytics" className='text-blue-600 underline text-sm gap-2 flex items-center'>
              View Details <ChevronRight />
            </a>
          </div>
          <Table>
            <TableCaption>Top Selling Items.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] text-gray-500">Item Name</TableHead>
                <TableHead className='text-gray-500'>Qty Sold</TableHead>
                {/* <TableHead className='text-gray-500'></TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {topProducts
                .map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className='text-gray-500'>{p.stock}</TableCell>
                    {/* <TableCell className='text-gray-500'>{p.minStock}</TableCell> */}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default Home
