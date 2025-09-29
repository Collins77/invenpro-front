import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { FolderDown, PrinterCheck } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { fetchSaleById } from '../api' // Make sure this exists

const SalePage = () => {
    const { id } = useParams()
    const [sale, setSale] = useState(null)

    useEffect(() => {
        const getSale = async () => {
            try {
                const data = await fetchSaleById(id)
                setSale(data)
            } catch (err) {
                console.error("Failed to fetch sale:", err)
            }
        }
        getSale()
    }, [id])

    if (!sale) return <div>Loading...</div>
    const receiptUrl = sale.receiptPath
        ? `${import.meta.env.VITE_API_URL.replace('/api', '')}/receipts/${sale.receiptPath}`
        : null

    const subTotal = sale.items.reduce((acc, item) => acc + item.subtotal, 0)

    // Breadcrumbs
    const pathnames = location.pathname.split('/').filter((x) => x)

    return (
        <div className='bg-white shadow-md p-4'>
            <div>
                <nav className='text-gray-500 text-sm mb-2'>
                    {pathnames.length > 0 ? (
                        <ol className='list-none p-0 inline-flex'>
                            <li>
                                <Link to='/' className='hover:text-gray-700'>
                                    Home
                                </Link>
                            </li>
                            {pathnames.map((name, index) => {
                                const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
                                const isLast = index === pathnames.length - 1
                                return (
                                    <li key={routeTo} className='flex items-center'>
                                        <span className='mx-2'>›</span>
                                        {isLast ? (
                                            <span className='text-gray-700'>{name.replace('-', ' ')}</span>
                                        ) : (
                                            <Link to={routeTo} className='hover:text-gray-700'>
                                                {name.replace('-', ' ')}
                                            </Link>
                                        )}
                                    </li>
                                )
                            })}
                        </ol>
                    ) : (
                        <span>Home</span>
                    )}
                </nav>

                {/* Header */}
                <div className='flex justify-between items-center py-4 border-b border-gray-200 mb-[20px]'>
                    <h1 className='font-bold text-xl'>
                        Sale Details
                    </h1>
                    <div className='flex items-center gap-2'>
                        
                        {receiptUrl && (
                            <>
                                <Button
                                    className='bg-black text-white cursor-pointer'
                                    onClick={() => window.open(receiptUrl)}
                                >
                                    <FolderDown className="w-4 h-4 mr-2" />
                                    Download Receipt
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Sale Info */}
                <div className='flex gap-4 items-center mb-[20px] border-b border-gray-200 pb-2'>
                    <div className='flex flex-col gap-1'>
                        <h1 className='font-sm font-semibold'>Customer Type</h1>
                        <p className='py-1 px-4 text-gray-500 border border-gray-200 rounded-md w-[200px] text-sm'>{sale.customerType}</p>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <h1 className='font-sm font-semibold'>Payment Method</h1>
                        <p className='py-1 px-4 text-gray-500 border border-gray-200 rounded-md w-[200px] text-sm'>{sale.paymentType}</p>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <h1 className='font-sm font-semibold'>Date & Time</h1>
                        <p className='py-1 px-4 text-gray-500 border border-gray-200 rounded-md w-[250px] text-sm'>
                            {new Date(sale.saleDate).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Table + Summary */}
                <div className='flex flex-col lg:flex-row gap-6'>
                    {/* Table */}
                    <div className='flex-1'>
                        <Table className='mb-[20px]'>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px] text-gray-500">Item Name</TableHead>
                                    <TableHead className='text-gray-500'>Qty</TableHead>
                                    <TableHead className='text-gray-500'>Price</TableHead>
                                    <TableHead className="text-right text-gray-500">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sale.items.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.Product.name}</TableCell>
                                        <TableCell className='text-gray-500'>{item.quantity}</TableCell>
                                        <TableCell className='text-gray-500'>KES {item.sellingPrice}</TableCell>
                                        <TableCell className="text-right text-gray-500">KES {item.subtotal}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Summary */}
                    <div className='bg-gray-100 rounded-md p-3 w-full lg:w-[300px] self-start'>
                        <div className='flex flex-col gap-3 text-sm'>
                            <div className='flex justify-between items-center'>
                                <h1 className='text-gray-500 '>SubTotal:</h1>
                                <p className='font-bold'>KES {subTotal.toLocaleString()}</p>
                            </div>
                            <div className='flex justify-between items-center mb-[10px] border-b border-gray-500 pb-2'>
                                <h1 className='text-gray-500 '>Discount:</h1>
                                <p className='font-bold'>KES {sale.discount}</p>
                            </div>
                            <div className='flex justify-between items-center'>
                                <h1 className='text-gray-500 '>Total:</h1>
                                <p className='font-bold'>KES {sale.totalAmount.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SalePage
