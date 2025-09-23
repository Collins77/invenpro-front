import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Plus, Loader2Icon } from 'lucide-react'

const products = [
    { id: 1, name: 'Whiskey', category: 'Whiskey' },
    { id: 2, name: 'Beer', category: 'Beer' },
    { id: 3, name: 'Soft Drink', category: 'Soft Drink' },
    { id: 4, name: 'Energy Drink', category: 'Energy Drink' },
    { id: 5, name: 'Vodka', category: 'Vodka' },
    { id: 6, name: 'Spirit', category: 'Energy Drink' },
]

const SearchableSelect = ({ products, onSelect, placeholder = "Search products..." }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedProduct, setSelectedProduct] = useState(null)
    const navigate = useNavigate()

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleSelect = (product) => {
        setSelectedProduct(product)
        setIsOpen(false)
        setSearchTerm('')
        onSelect(product)
    }

    const handleAddCategory = () => {
        navigate('/add-category')
    }

    return (
        <div className="relative w-full outline-none">
            <div
                className="flex items-center justify-between w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-gray-400" />
                    <span className={selectedProduct ? "text-gray-900" : "text-gray-500"}>
                        {selectedProduct ? selectedProduct.name : placeholder}
                    </span>
                </div>
                <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    <div className="p-3 border-b">
                        <Input
                            type="text"
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full outline-none"
                            autoFocus
                        />
                    </div>

                    <div className="max-h-60 overflow-y-auto">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleSelect(product)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                            <span className="text-xs font-medium text-gray-600">
                                                {product.name.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{product.name}</div>
                                            <div className="text-xs text-gray-500">{product.category}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-6 text-center text-gray-500">
                                No products found
                            </div>
                        )}
                    </div>

                    <div className="border-t p-2">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={handleAddCategory}
                        >
                            <Plus className="w-4 h-4" />
                            Add Category
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

const AddProduct = () => {
    const location = useLocation()
    const [setSelectedProduct] = useState(null)

    // Split the pathname and filter out empty strings
    const pathnames = location.pathname.split('/').filter((x) => x)

    const handleCategorySelect = (product) => {
        setSelectedProduct(product)
        console.log('Selected product:', product)
    }


    return (
        <div>
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
                    <h1 className='font-bold text-xl'>
                        Add Product
                    </h1>
                </div>
                <div className='p-4'>
                    <form action="" className='w-full grid grid-cols-2 gap-4'>
                        <div className="space-y-2">
                            <label htmlFor="product" className="text-sm font-medium text-gray-700">
                                Product Name
                            </label>
                            <Input
                                type="text"
                                id="productName"
                                placeholder="Enter name"
                                className="w-full outline-none border border-gray-300"
                            />
                        </div>

                        {/* Add other form fields here */}
                        <div className="space-y-2">
                            <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                                Volume/Weight/Size
                            </label>
                            <Input
                                type="text"
                                id="quantity"
                                placeholder="Enter volume"
                                className="w-full outline-none border border-gray-300"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                                Purchase Price
                            </label>
                            <Input
                                type="number"
                                id="purchasePrice"
                                placeholder="Enter purchase price"
                                className="w-full outline-none border border-gray-300"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                                Selling Price
                            </label>
                            <Input
                                type="number"
                                id="sellingPrice"
                                placeholder="Enter selling price"
                                className="w-full outline-none border border-gray-300"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                                Category
                            </label>
                            <SearchableSelect
                                products={products}
                                onSelect={handleCategorySelect}
                                placeholder="Search and select a category..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                                Starting Stock
                            </label>
                            <Input
                                type="number"
                                id="stockThreshold"
                                placeholder="Enter a number"
                                className="w-full outline-none border border-gray-300"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                                Low Stock Threshold
                            </label>
                            <Input
                                type="number"
                                id="stockThreshold"
                                placeholder="Enter a number"
                                className="w-full outline-none border border-gray-300"
                            />
                        </div>
                        <div className='flex items-center gap-2'>
                            <Button className='bg-black text-white cursor-pointer'>
                                {/* <Loader2Icon className="animate-spin" /> */}
                                Submit
                            </Button>
                            <Button variant="outline" className='cursor-pointer'>
                                Reset Form
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddProduct