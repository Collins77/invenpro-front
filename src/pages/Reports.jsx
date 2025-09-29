import React, { useEffect, useState } from 'react'
import { fetchSales } from '../api'
import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Link } from 'react-router-dom'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const Reports = () => {
    const [sales, setSales] = useState([])
    const [topProducts, setTopProducts] = useState([])
    const [summary, setSummary] = useState({ weekly: 0, monthly: 0, yearly: 0 })
    const [weekRange, setWeekRange] = useState("")
    const pathnames = location.pathname.split('/').filter((x) => x)


    useEffect(() => {
        const getSales = async () => {
            const data = await fetchSales()
            setSales(data)
        }
        getSales()
    }, [])

    // Compute week range once
    useEffect(() => {
        const now = new Date()
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay())
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)
        setWeekRange(`${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`)
    }, [])

    // Weekly sales
    const getWeekSales = () => {
        const now = new Date()
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay())
        const weekSales = Array(7).fill(0)
        const labels = []

        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek)
            day.setDate(startOfWeek.getDate() + i)
            labels.push(day.toLocaleDateString())
        }

        sales.forEach(sale => {
            const saleDate = new Date(sale.saleDate)
            if (saleDate >= startOfWeek && saleDate <= new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000)) {
                const index = saleDate.getDay()
                weekSales[index] += sale.totalAmount
            }
        })

        return { labels, data: weekSales }
    }

    // Monthly sales for Jan-Dec
    const getMonthlySales = () => {
        const months = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'short' }))
        const monthSales = Array(12).fill(0)

        sales.forEach(sale => {
            const saleDate = new Date(sale.saleDate)
            monthSales[saleDate.getMonth()] += sale.totalAmount
        })

        return { labels: months, data: monthSales }
    }

    // Yearly sales for 5-year range starting 2025
    const getYearlySales = () => {
        const startYear = 2025
        const years = Array.from({ length: 5 }, (_, i) => startYear + i)
        const yearSales = Array(5).fill(0)

        sales.forEach(sale => {
            const saleYear = new Date(sale.saleDate).getFullYear()
            const index = saleYear - startYear
            if (index >= 0 && index < 5) {
                yearSales[index] += sale.totalAmount
            }
        })

        return { labels: years, data: yearSales }
    }

    // Compute summary totals
    useEffect(() => {
        if (!sales.length) return
        const weekData = getWeekSales()
        const monthData = getMonthlySales()
        const yearData = getYearlySales()

        const sum = arr => arr.reduce((acc, val) => acc + val, 0)
        setSummary({
            weekly: sum(weekData.data),
            monthly: sum(monthData.data),
            yearly: sum(yearData.data),
        })
    }, [sales])

    // Top 4 products
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

    return (
        <div className='bg-white shadow-md p-4'>
            <div className='py-4 border-b border-gray-200 mb-[20px]'>
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
                <h1 className='font-bold text-xl'>System Reports</h1>
            </div>

            <div className='flex flex-col lg:flex-row gap-6'>
                <div className='flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4'>
                    {/* Weekly */}
                    <div className='bg-gray-50 p-2 rounded-md h-[320px]'>
                        <h2 className='text-sm font-semibold mb-1'>Weekly Sales</h2>
                        <div className="h-[260px]">
                            <Line
                                data={{
                                    labels: getWeekSales().labels,
                                    datasets: [{
                                        label: 'KES',
                                        data: getWeekSales().data,
                                        borderColor: '#2563eb',
                                        backgroundColor: 'rgba(37,99,235,0.2)',
                                        tension: 0.3,
                                    }]
                                }}
                                options={{ maintainAspectRatio: false }}
                            />
                        </div>
                    </div>

                    {/* Monthly */}
                    <div className='bg-gray-50 p-2 rounded-md h-[320px]'>
                        <h2 className='text-sm font-semibold mb-1'>Monthly Sales</h2>
                        <div className="h-[260px]">
                            <Line
                                data={{
                                    labels: getMonthlySales().labels,
                                    datasets: [{
                                        label: 'KES',
                                        data: getMonthlySales().data,
                                        borderColor: '#16a34a',
                                        backgroundColor: 'rgba(22,163,74,0.2)',
                                        tension: 0.3,
                                    }]
                                }}
                                options={{ maintainAspectRatio: false }}
                            />
                        </div>
                    </div>

                    {/* Yearly */}
                    <div className='bg-gray-50 p-2 rounded-md h-[320px]'>
                        <h2 className='text-sm font-semibold mb-1'>Yearly Sales</h2>
                        <div className="h-[260px]">
                            <Line
                                data={{
                                    labels: getYearlySales().labels,
                                    datasets: [{
                                        label: 'KES',
                                        data: getYearlySales().data,
                                        borderColor: '#b45309',
                                        backgroundColor: 'rgba(180,83,9,0.2)',
                                        tension: 0.3,
                                    }]
                                }}
                                options={{ maintainAspectRatio: false }}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Side */}
                <div className='w-full lg:w-[400px] flex flex-col gap-4'>
                    <div className='grid grid-cols-1 gap-2'>
                        <div className='bg-blue-100 p-4 rounded-md'>
                            <h3 className='text-sm font-medium'>Weekly Revenue ({weekRange || "This Week"})</h3>
                            <p className='font-bold text-lg'>KES {summary.weekly.toLocaleString()}</p>
                        </div>

                        <div className='bg-yellow-100 p-4 rounded-md'>
                            <h3 className='text-sm font-medium'>Monthly Revenue</h3>
                            <p className='font-bold text-lg'>KES {summary.monthly.toLocaleString()}</p>
                        </div>

                        <div className='bg-orange-100 p-4 rounded-md'>
                            <h3 className='text-sm font-medium'>Yearly Revenue</h3>
                            <p className='font-bold text-lg'>KES {summary.yearly.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className='mt-4 bg-gray-50 p-4 rounded-md'>
                        <h3 className='text-sm font-semibold mb-2'>Top Selling Products</h3>
                        <table className='w-full'>
                            <thead>
                                <tr className='bg-gray-100'>
                                    <th className='p-2 text-left'>Product</th>
                                    <th className='p-2 text-right'>Qty Sold</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topProducts.map(([name, qty]) => (
                                    <tr key={name} className='border-b'>
                                        <td className='p-2'>{name}</td>
                                        <td className='p-2 text-right'>{qty}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reports
