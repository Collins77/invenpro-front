import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
    FolderDown,
    MoreHorizontal,
    Edit,
    Package,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Eye
} from 'lucide-react'
import { fetchProducts, addStock, deleteProduct as apiDeleteProduct } from '@/api'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

// Add Stock Modal component
const AddStockModal = ({ product, isOpen, onClose, onSubmit }) => {
    const [quantity, setQuantity] = useState('')
    const [purchasePrice, setPurchasePrice] = useState('')
    const [sellingPrice, setSellingPrice] = useState('')
    const [vendor, setVendor] = useState('')
    const [receiveDate, setReceiveDate] = useState('')
    const [changePrice, setChangePrice] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!product) return toast.error('No product selected.')

        const payload = {
            quantity,
            vendor,
            receiveDate,
            ...(changePrice ? { purchasePrice, sellingPrice } : {})
        }

        try {
            await addStock(product.id, payload)
            toast.success('Stock added successfully!')
            if (onSubmit) {
                onSubmit({ productId: product.id, ...payload }) // <-- include productId
            }
            // Reset form
            setQuantity('')
            setPurchasePrice('')
            setSellingPrice('')
            setVendor('')
            setReceiveDate('')
            setChangePrice(false)
            onClose()
        } catch (err) {
            console.error(err)
            toast.error('Failed to add stock.')
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-white">
                <DialogHeader>
                    <DialogTitle>Add Stock - {product?.name}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Product</label>
                        <Input type="text" value={product?.name || ''} disabled className="bg-gray-100 cursor-not-allowed" />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Quantity *</label>
                        <Input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Enter quantity"
                            required
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input type="checkbox" checked={changePrice} onChange={(e) => setChangePrice(e.target.checked)} />
                        <label className="text-sm font-medium">Change Product Price</label>
                    </div>

                    {changePrice && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium">Purchase Price</label>
                                <Input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Selling Price</label>
                                <Input type="number" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="text-sm font-medium">Vendor</label>
                        <Input type="text" value={vendor} onChange={(e) => setVendor(e.target.value)} placeholder="Enter vendor" />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Date Received</label>
                        <Input type="date" value={receiveDate} onChange={(e) => setReceiveDate(e.target.value)} />
                    </div>

                    <DialogFooter className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="bg-black text-white">Add Stock</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

const OutStockProducts = () => {
    const location = useLocation()
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [selectedProducts, setSelectedProducts] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(5)
    const [stockModalOpen, setStockModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)

    const pathnames = location.pathname.split('/').filter((x) => x)

    // Fetch products
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const allProducts = await fetchProducts()
                const outStock = allProducts.filter(p => p.stock === 0)
                setProducts(outStock)
            } catch (err) {
                console.error('Failed to fetch products:', err)
            }
        }
        loadProducts()
    }, [])

    const categories = [...new Set(products.map(p => p.category))]

    useEffect(() => {
        let filtered = products
        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.category.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(p => p.category === categoryFilter)
        }
        setFilteredProducts(filtered)
        setCurrentPage(1)
    }, [searchTerm, categoryFilter, products])

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentProducts = filteredProducts.slice(startIndex, endIndex)

    const getStatusBadge = (status) => {
        const styles = {
            'Active': 'bg-green-100 text-green-700 border-green-200',
            'Out of Stock': 'bg-red-100 text-red-700 border-red-200',
        }
        return <Badge variant="secondary" className={`${styles[status]} border`}>{status}</Badge>
    }

    const handleSelectAll = (checked) => {
        if (checked) setSelectedProducts(currentProducts.map(p => p.id))
        else setSelectedProducts([])
    }
    const handleSelectProduct = (id, checked) => {
        if (checked) setSelectedProducts([...selectedProducts, id])
        else setSelectedProducts(selectedProducts.filter(pid => pid !== id))
    }

    const handleAddStock = (product) => {
        setSelectedProduct(product)
        setStockModalOpen(true)
    }

    const handleStockSubmit = async (stockData) => {
        try {
            await addStock(stockData.productId, stockData)
            setProducts(prev => prev.filter(p => p.id !== stockData.productId))
            setStockModalOpen(false)
        } catch (err) {
            console.error('Error adding stock:', err)
        }
    }

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Delete this product?')) return
        try {
            await apiDeleteProduct(id)
            setProducts(prev => prev.filter(p => p.id !== id))
        } catch (err) {
            console.error('Error deleting product:', err)
        }
    }

    return (
        <div className="bg-white shadow-md p-4">
            {/* Breadcrumb */}
            <nav className='text-gray-500 text-sm mb-2'>
                {pathnames.length > 0 ? (
                    <ol className='list-none p-0 inline-flex'>
                        <li><Link to='/' className='hover:text-gray-700'>Home</Link></li>
                        {pathnames.map((name, index) => {
                            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
                            const isLast = index === pathnames.length - 1
                            return (
                                <li key={routeTo} className='flex items-center'>
                                    <span className='mx-2'>›</span>
                                    {isLast ? <span className='text-gray-700'>{name.replace('-', ' ')}</span> :
                                        <Link to={routeTo} className='hover:text-gray-700'>{name.replace('-', ' ')}</Link>}
                                </li>
                            )
                        })}
                    </ol>
                ) : <span>Home</span>}
            </nav>

            {/* Header */}
            <div className='flex justify-between items-center py-4 border-b border-gray-200 mb-6'>
                <h1 className='font-bold text-xl'>Out Of Stock Products ({filteredProducts.length})</h1>
                {/* <Button className='bg-black text-white'><FolderDown className="w-4 h-4 mr-2" />Download Excel</Button> */}
            </div>

            {/* Filters */}
            <div className='flex flex-wrap gap-4 mb-6'>
                <div className='relative flex-1 min-w-[200px]'>
                    <Input
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-3"
                    />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]"><SelectValue placeholder="Category" /></SelectTrigger>
                    <SelectContent className="bg-white">
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-gray-50/50">
                            <th className="p-4 text-left">
                                <Checkbox
                                    checked={selectedProducts.length === currentProducts.length && currentProducts.length > 0}
                                    onCheckedChange={handleSelectAll}
                                />
                            </th>
                            <th className="p-4 text-left text-sm text-gray-500">Product Name</th>
                            <th className="p-4 text-left text-sm text-gray-500">Category</th>
                            <th className="p-4 text-left text-sm text-gray-500">Brand</th>
                            <th className="p-4 text-left text-sm text-gray-500">Price</th>
                            <th className="p-4 text-left text-sm text-gray-500">Stock</th>
                            <th className="p-4 text-left text-sm text-gray-500">Status</th>
                            <th className="p-4 text-left text-sm text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.map(p => (
                            <tr key={p.id} className="border-b border-gray-200 hover:bg-gray-50/50">
                                <td className="p-4">
                                    <Checkbox
                                        checked={selectedProducts.includes(p.id)}
                                        onCheckedChange={checked => handleSelectProduct(p.id, checked)}
                                    />
                                </td>
                                <td className="p-4">
                                    <div className="font-medium text-gray-900">{p.name}</div>
                                </td>
                                <td className="p-4 text-gray-700">{p.category}</td>
                                <td className="p-4 text-gray-700">{p.brand}</td>
                                <td className="p-4 text-gray-700">{p.sellingPrice.toLocaleString()}</td>
                                <td className="p-4 text-gray-700">{p.stock}</td>
                                <td className="p-4">{getStatusBadge(p.status)}</td>
                                <td className="p-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm"><MoreHorizontal className="w-4 h-4" /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 bg-white">
                                            <DropdownMenuItem onClick={() => handleAddStock(p)} className='cursor-pointer'><Package className="w-4 h-4 mr-2" />Add Stock</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDeleteProduct(p.id)} className="text-red-600 hover:text-red-700 cursor-pointer">
                                                <Trash2 className="w-4 h-4 mr-2" />Delete Product
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))}
                        {currentProducts.length === 0 && (
                            <tr><td colSpan={8} className="text-center p-4 text-gray-500">No products found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t">
                    <div className="text-sm text-gray-500">
                        Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                            <ChevronLeft className="w-4 h-4 mr-1" />Previous
                        </Button>
                        <div className="flex items-center space-x-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <Button key={page} variant={currentPage === page ? "default" : "outline"} size="sm" className="w-8 h-8 p-0" onClick={() => setCurrentPage(page)}>{page}</Button>
                            ))}
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                            Next<ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Add Stock Modal */}
            <AddStockModal
                product={selectedProduct}
                isOpen={stockModalOpen}
                onClose={() => setStockModalOpen(false)}
                onSubmit={handleStockSubmit}
            />
        </div>
    )
}

export default OutStockProducts
