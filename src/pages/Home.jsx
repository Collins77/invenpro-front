import { BadgeAlert, BadgePercent, Calendar, ChevronRight, ShoppingCart, TrendingUp } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const Home = () => {
  const [currentDate, setCurrentDate] = useState('');
  const invoices = [
    {
      itemName: "Tusker Lager 500ML",
      currentQuantity: "2",
      minValue: "3",
      status: "Ordered",
    },
    {
      itemName: "KC Pineapple 300ML",
      currentQuantity: "0",
      minValue: "3",
      status: "Unordered",
    },
    {
      itemName: "Best Gin 750ML",
      currentQuantity: "2",
      minValue: "3",
      status: "Ordered",
    },
    {
      itemName: "Jack Daniels 750ML",
      currentQuantity: "2",
      minValue: "3",
      status: "Ordered",
    },

  ]

  useEffect(() => {
    const date = new Date()
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    const formattedDate = date.toLocaleDateString('en-US', options)
    setCurrentDate(formattedDate)
  }, [])
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
        <div className='flex justify-between p-2 border border-gray-200 rounded-md bg-white'>
          <div className='flex flex-col gap-2'>
            <h1 className='font-semibold text-sm'>Inventory Value</h1>
            <h1 className='text-2xl font-bold'>KES 200,576</h1>
            <div>
              <a href="" className='text-gray-500 text-sm underline flex items-center'>View Products</a>
            </div>
          </div>
          <div>
            <ShoppingCart className='text-gray-500' />
          </div>
        </div>
        <div className='flex justify-between p-2 border border-gray-200 rounded-md bg-white'>
          <div className='flex flex-col gap-2'>
            <h1 className='font-semibold text-sm'>Today's Sales</h1>
            <h1 className='text-2xl font-bold'>KES 12,400</h1>
            <div>
              <a href="" className='text-gray-500 text-sm underline flex items-center'>View Sales</a>
            </div>
          </div>
          <div>
            <BadgePercent className='text-gray-500' />
          </div>
        </div>
        <div className='flex justify-between p-2 border border-gray-200 rounded-md bg-white'>
          <div className='flex flex-col gap-2'>
            <h1 className='font-semibold text-sm'>Out Of Stock</h1>
            <h1 className='text-2xl font-bold'>5</h1>
            <div>
              <a href="" className='text-gray-500 text-sm underline flex items-center'>View Out of Stock</a>
            </div>
          </div>
          <div>
            <BadgeAlert className='text-gray-500' />
          </div>
        </div>
        <div className='flex justify-between p-2 border border-gray-200 rounded-md bg-white'>
          <div className='flex flex-col gap-2'>
            <h1 className='font-semibold text-sm'>Today's Profit</h1>
            <h1 className='text-2xl font-bold'>KES 4,000</h1>
            <div>
              <a href="" className='text-gray-500 text-sm underline flex items-center'>View Products</a>
            </div>
          </div>
          <div>
            <TrendingUp className='text-gray-500' />
          </div>
        </div>
      </div>
      <div className='flex gap-4 w-full'>
        <div className='bg-white rounded-md p-2 w-[55%] shadow-md'>
          <div className='flex items-center justify-between mb-6'>
            <h1 className='font-semibold'>Low Stock Alerts</h1>
            <a href="" className='text-blue-600 underline text-sm gap-2 flex items-center'>
              View Details
              <ChevronRight />
            </a>
          </div>
          <div>
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
                {invoices.map((invoice) => (
                  <TableRow key={invoice.invoice}>
                    <TableCell className="font-medium">{invoice.itemName}</TableCell>
                    <TableCell className='text-gray-500'>{invoice.currentQuantity}</TableCell>
                    <TableCell className='text-gray-500'>{invoice.minValue}</TableCell>
                    <TableCell className="text-right text-gray-500">{invoice.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className='w-[45%] bg-white rounded-md p-2 shadow-md'>
          <div className='flex items-center justify-between mb-6'>
            <h1 className='font-semibold'>Top Selling Products</h1>
            <a href="" className='text-blue-600 underline text-sm gap-2 flex items-center'>
              View Details
              <ChevronRight />
            </a>
          </div>
          <div>
            <Table>
              <TableCaption>Top Selling Items.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px] text-gray-500">Item Name</TableHead>
                  <TableHead className='text-gray-500'>Current Qty</TableHead>
                  <TableHead className='text-gray-500'>Min Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.invoice}>
                    <TableCell className="font-medium">{invoice.itemName}</TableCell>
                    <TableCell className='text-gray-500'>{invoice.currentQuantity}</TableCell>
                    <TableCell className='text-gray-500'>{invoice.minValue}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home