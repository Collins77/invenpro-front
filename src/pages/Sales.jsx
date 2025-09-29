import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { fetchSales } from '../api'

const Sales = () => {
    const [sales, setSales] = useState([])
    const [filteredSales, setFilteredSales] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [paymentFilter, setPaymentFilter] = useState('all')
    const [customerFilter, setCustomerFilter] = useState('all')
    const [soldByFilter, setSoldByFilter] = useState('all')
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)
    const navigate = useNavigate()

    // Fetch sales
    const fetchAllSales = async () => {
        const data = await fetchSales()
        setSales(data)
        setFilteredSales(data)
    }

    useEffect(() => {
        fetchAllSales()
    }, [])

    // Unique filter values
    const paymentTypes = [...new Set(sales.map(s => s.paymentType))]
    const customerTypes = [...new Set(sales.map(s => s.customerType))]
    const soldByUsers = [...new Set(sales.map(s => s.soldBy))]

    // Apply filters
    useEffect(() => {
        let filtered = sales

        if (searchTerm) {
            filtered = filtered.filter(s =>
                s.receiptPath?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        if (paymentFilter !== 'all') filtered = filtered.filter(s => s.paymentType === paymentFilter)
        if (customerFilter !== 'all') filtered = filtered.filter(s => s.customerType === customerFilter)
        if (soldByFilter !== 'all') filtered = filtered.filter(s => s.soldBy === soldByFilter)

        if (fromDate) filtered = filtered.filter(s => new Date(s.saleDate) >= new Date(fromDate))
        if (toDate) filtered = filtered.filter(s => new Date(s.saleDate) <= new Date(toDate))

        setFilteredSales(filtered)
        setCurrentPage(1)
    }, [searchTerm, paymentFilter, customerFilter, soldByFilter, fromDate, toDate, sales])

    const resetFilters = () => {
        setSearchTerm('')
        setPaymentFilter('all')
        setCustomerFilter('all')
        setSoldByFilter('all')
        setFromDate('')
        setToDate('')
    }

    const totalPages = Math.ceil(filteredSales.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentSales = filteredSales.slice(startIndex, endIndex)

    const totalAmount = filteredSales.reduce((sum, s) => sum + s.totalAmount, 0)

    return (
        <div className='bg-white shadow-md p-4'>
            <div className='mb-[20px]'>
                <h1 className='font-bold text-xl mb-2'>All Sales ({filteredSales.length})</h1>
                <div className='text-sm text-gray-600 mb-4'>
                    Total Sales Amount: <span className='font-medium'>{totalAmount.toLocaleString()} KES</span>
                </div>

                {/* Filters */}
                <div className='flex flex-wrap gap-4 mb-6 items-end'>
                    <div className='relative flex-1 min-w-[200px]'>
                        <Input
                            placeholder="Search by receipt..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Payment Type" />
                        </SelectTrigger>
                        <SelectContent className='bg-white'>
                            <SelectItem value="all">All Payment Types</SelectItem>
                            {paymentTypes.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={customerFilter} onValueChange={setCustomerFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Customer Type" />
                        </SelectTrigger>
                        <SelectContent className='bg-white'>
                            <SelectItem value="all">All Customer Types</SelectItem>
                            {customerTypes.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={soldByFilter} onValueChange={setSoldByFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sold By" />
                        </SelectTrigger>
                        <SelectContent className='bg-white'>
                            <SelectItem value="all">All Users</SelectItem>
                            {soldByUsers.map(user => (
                                <SelectItem key={user} value={user}>{user}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Date range */}
                    <div>
                        <label className='text-sm font-medium'>From:</label>
                        <Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
                    </div>
                    <div>
                        <label className='text-sm font-medium'>To:</label>
                        <Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
                    </div>

                    <Button onClick={resetFilters} className='bg-black text-white ml-2 cursor-pointer'>
                        Reset Filters
                    </Button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b bg-gray-50/50">
                                <th className="p-4 text-left text-sm text-gray-500">Receipt</th>
                                <th className="p-4 text-left text-sm text-gray-500">Customer Type</th>
                                <th className="p-4 text-left text-sm text-gray-500">Sold By</th>
                                <th className="p-4 text-left text-sm text-gray-500">Date</th>
                                <th className="p-4 text-left text-sm text-gray-500">Payment</th>
                                <th className="p-4 text-left text-sm text-gray-500">Total (KES)</th>
                                <th className="p-4 text-left text-sm text-gray-500">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentSales.length > 0 ? currentSales.map(sale => (
                                <tr key={sale.id} className="border-b border-gray-200 hover:bg-gray-50/50">
                                    <td className="p-4 text-gray-700">{sale.receiptPath || 'N/A'}</td>
                                    <td className="p-4 text-gray-700">{sale.customerType}</td>
                                    <td className="p-4 text-gray-700">{sale.soldBy}</td>
                                    <td className="p-4 text-gray-700">{new Date(sale.saleDate).toLocaleDateString()}</td>
                                    <td className="p-4 text-gray-700">{sale.paymentType}</td>
                                    <td className="p-4 text-gray-700">{sale.totalAmount.toLocaleString()}</td>
                                    <td className="p-4">
                                        <Button size="sm" onClick={() => navigate(`/dashboard/sales/${sale.id}`, { state: { sale } })} className='cursor-pointer'>
                                            View
                                        </Button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-8 text-gray-400">
                                        No sales found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t">
                    <div className="text-sm text-gray-500">
                        Showing {startIndex + 1} to {Math.min(endIndex, filteredSales.length)} of {filteredSales.length} sales
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className="w-8 h-8 p-0"
                            >
                                {page}
                            </Button>
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Sales
