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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
    FolderDown,
    Plus,
    Search,
    MoreHorizontal,
    Edit,
    Package,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Eye
} from 'lucide-react'
import { fetchProducts, addStock as addStockAPI, deleteProduct as deleteProductAPI, fetchBrands, fetchCategories } from '../api'


// Add Stock Modal Component
const AddStockModal = ({ product, isOpen, onClose, onSubmit }) => {
    const [stockData, setStockData] = useState({
        quantity: '',
        unitCost: '',
        supplier: '',
        expiryDate: '',
        batchNumber: '',
        notes: ''
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit({ ...stockData, productId: product?.id })
        setStockData({
            quantity: '',
            unitCost: '',
            supplier: '',
            expiryDate: '',
            batchNumber: '',
            notes: ''
        })
        onClose()
    }

    if (!product) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>Add Stock - {product.name}</DialogTitle>
                    <DialogDescription>
                        Add new stock for this product. Current stock: {product.stock} units
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">Quantity *</label>
                            <Input
                                type="number"
                                value={stockData.quantity}
                                onChange={(e) => setStockData({ ...stockData, quantity: e.target.value })}
                                placeholder="Enter quantity"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Unit Cost (KES)</label>
                            <Input
                                type="number"
                                step="0.01"
                                value={stockData.unitCost}
                                onChange={(e) => setStockData({ ...stockData, unitCost: e.target.value })}
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Supplier</label>
                        <Input
                            value={stockData.supplier}
                            onChange={(e) => setStockData({ ...stockData, supplier: e.target.value })}
                            placeholder="Supplier name"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">Expiry Date</label>
                            <Input
                                type="date"
                                value={stockData.expiryDate}
                                onChange={(e) => setStockData({ ...stockData, expiryDate: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Batch Number</label>
                            <Input
                                value={stockData.batchNumber}
                                onChange={(e) => setStockData({ ...stockData, batchNumber: e.target.value })}
                                placeholder="Batch #"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Notes</label>
                        <Input
                            value={stockData.notes}
                            onChange={(e) => setStockData({ ...stockData, notes: e.target.value })}
                            placeholder="Additional notes..."
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" className='cursor-pointer' onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className='bg-black text-white cursor-pointer'>Add Stock</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

const Products = () => {
    const location = useLocation()
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [brandFilter, setBrandFilter] = useState('all')
    const [selectedProducts, setSelectedProducts] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(5)
    const [stockModalOpen, setStockModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    // const navigate = useNavigate();

    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);

    // Fetch products, brands, and categories
    const fetchAllData = async () => {
        const productsData = await fetchProducts();
        const brandsData = await fetchBrands(); // fetchBrands() should return [{id, name}, ...]
        const categoriesData = await fetchCategories(); // fetchCategories() should return [{id, name}, ...]

        setProducts(productsData);
        setFilteredProducts(productsData);
        setBrands(brandsData);
        setCategories(categoriesData);
    }

    useEffect(() => {
        fetchAllData();
    }, []);

    // Split the pathname and filter out empty strings
    const pathnames = location.pathname.split('/').filter((x) => x)
    const fetchAllProducts = async () => {
        const data = await fetchProducts()
        setProducts(data)
        setFilteredProducts(data)
    }

    useEffect(() => {
        fetchAllProducts()
    }, [])


    useEffect(() => {
        let filtered = products

        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
                // product.brandId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                // product.categoryId.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        if (categoryFilter !== 'all') {
            filtered = filtered.filter(product => product.categoryId === categoryFilter)
        }

        if (brandFilter !== 'all') {
            filtered = filtered.filter(product => product.brandId === brandFilter)
        }

        setFilteredProducts(filtered)
    }, [searchTerm, categoryFilter, brandFilter, products])

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentProducts = filteredProducts.slice(startIndex, endIndex)

    const getStatusBadge = (status) => {
        const styles = {
            'Active': 'bg-green-100 text-green-700 border-green-200',
            'Out of Stock': 'bg-red-100 text-red-700 border-red-200',
            'Low Stock': 'bg-yellow-100 text-yellow-700 border-yellow-200',
            'Inactive': 'bg-gray-100 text-gray-700 border-gray-200'
        }
        return (
            <Badge variant="secondary" className={`${styles[status]} border`}>
                {status}
            </Badge>
        )
    }

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedProducts(currentProducts.map(p => p.id))
        } else {
            setSelectedProducts([])
        }
    }

    const handleSelectProduct = (productId, checked) => {
        if (checked) {
            setSelectedProducts([...selectedProducts, productId])
        } else {
            setSelectedProducts(selectedProducts.filter(id => id !== productId))
        }
    }

    const handleAddStock = (product) => {
        setSelectedProduct(product)
        setStockModalOpen(true)
    }

    const handleStockSubmit = async (stockData) => {
        await addStockAPI(stockData.productId, stockData)
        // Refresh products after stock addition
        fetchAllProducts()
    }

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await deleteProductAPI(productId)
            fetchAllProducts()
        }
    }

    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm, categoryFilter, brandFilter])

    return (
        <div className='bg-white shadow-md p-4'>
            <div className='mb-[20px]'>
                {/* Breadcrumbs */}
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

                <div className='flex justify-between items-center py-4 border-b border-gray-200 mb-[20px]'>
                    <h1 className='font-bold text-xl'>
                        All Products ({filteredProducts.length})
                    </h1>
                    <div className='flex items-center gap-2'>
                        {/* <Button className='bg-black text-white cursor-pointer'>
                            <FolderDown className="w-4 h-4 mr-2" />
                            Download Excel
                        </Button> */}
                        <Link to="/dashboard/add-product">
                            <Button variant="outline" className='hover:bg-black hover:text-white cursor-pointer'>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Product
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className='flex flex-wrap gap-4 mb-6'>
                    <div className='relative flex-1 min-w-[200px]'>
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent className='bg-white'>
                            <SelectItem key="all" value="all">All Categories</SelectItem>
                            {categories.map(category => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={brandFilter} onValueChange={setBrandFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Brands" />
                        </SelectTrigger>
                        <SelectContent className='bg-white'>
                            <SelectItem key="all" value="all">All Brands</SelectItem>
                            {brands.map(brand => (
                                <SelectItem key={brand.id} value={brand.id}>
                                    {brand.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <div className="">
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
                                    <th className="p-4 text-left text-sm text-gray-500">Price (KES)</th>
                                    <th className="p-4 text-left text-sm text-gray-500">Stock</th>
                                    <th className="p-4 text-left text-sm text-gray-500">Status</th>
                                    <th className="p-4 text-left text-sm text-gray-500">Last Stocked</th>
                                    <th className="p-4 text-left text-sm text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentProducts.map((product) => (
                                    <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50/50">
                                        <td className="p-4">
                                            <Checkbox
                                                checked={selectedProducts.includes(product.id)}
                                                onCheckedChange={(checked) => handleSelectProduct(product.id, checked)}
                                            />
                                        </td>
                                        <td className="p-4">
                                            <div>
                                                <div className="font-medium text-gray-900">{product.name}</div>
                                                <div className="text-sm text-gray-500">{product.volume}</div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-700">
                                            {categories.find(c => c.id === product.categoryId)?.name || 'Unknown'}
                                        </td>
                                        <td className="p-4 text-gray-700">
                                            {brands.find(b => b.id === product.brandId)?.name || 'Unknown'}
                                        </td>
                                        <td className="p-4 text-gray-700">{product.sellingPrice.toLocaleString()}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1">
                                                <span className={`font-medium ${product.stock <= product.minStock ? 'text-red-600' : 'text-gray-900'}`}>
                                                    {product.stock}
                                                </span>
                                                {product.stock <= product.minStock && (
                                                    <span className="text-xs text-red-500">(Low)</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">{getStatusBadge(product.status)}</td>
                                        <td className="p-4 text-gray-700 text-sm">
                                            {new Date(product.lastStocked).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 bg-white">
                                                    {/* <DropdownMenuItem onClick={() =>
                                                        navigate(`/dashboard/products/edit/${product.id}`, { state: { product } })
                                                    }>
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Edit Product
                                                    </DropdownMenuItem> */}
                                                    <DropdownMenuItem onClick={() => handleAddStock(product)}>
                                                        <Package className="w-4 h-4 mr-2" />
                                                        Add Stock
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDeleteProduct(product.id)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Delete Product
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages < 6 && (
                        <div className="flex items-center justify-between p-4 border-t">
                            <div className="text-sm text-gray-500">
                                Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Previous
                                </Button>
                                <div className="flex items-center space-x-1">
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
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* No results */}
                    {currentProducts.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-500 mb-2">No products found</div>
                            <div className="text-sm text-gray-400">
                                Try adjusting your search or filter criteria
                            </div>
                        </div>
                    )}
                </div>
            </div>

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

export default Products