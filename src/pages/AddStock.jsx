import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Plus } from 'lucide-react'
import { fetchProducts, addStock } from '@/api'
import { toast } from 'sonner'

const SearchableSelect = ({ products, onSelect, placeholder = "Search products..." }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelect = (product) => {
    setSelectedProduct(product)
    setIsOpen(false)
    setSearchTerm('')
    onSelect(product)
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
              placeholder="Search products..."
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
              onClick={() => {}}
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

const AddStock = () => {
  const location = useLocation()
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [quantity, setQuantity] = useState('')
  const [purchasePrice, setPurchasePrice] = useState('')
  const [sellingPrice, setSellingPrice] = useState('')
  const [vendor, setVendor] = useState('')
  const [receiveDate, setReceiveDate] = useState('')
  const [changePrice, setChangePrice] = useState(false)

  const pathnames = location.pathname.split('/').filter((x) => x)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts()
        setProducts(data)
      } catch (err) {
        console.error('Failed to fetch products:', err)
      }
    }
    loadProducts()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedProduct) return toast.error('Select a product first.')

    const payload = {
      quantity,
      vendor,
      receiveDate,
      ...(changePrice ? { purchasePrice, sellingPrice } : {})
    }

    try {
      await addStock(selectedProduct.id, payload)
      toast.success('Stock added successfully!')
      // Reset form
      setSelectedProduct(null)
      setQuantity('')
      setPurchasePrice('')
      setSellingPrice('')
      setVendor('')
      setReceiveDate('')
      setChangePrice(false)
    } catch (err) {
      console.error(err)
      toast.error('Failed to add stock.')
    }
  }

  return (
    <div className='bg-white shadow-md p-4'>
      <div className='mb-[20px]'>
        <nav className='text-gray-500 text-sm mb-2'>
          {pathnames.length > 0 ? (
            <ol className='list-none p-0 inline-flex'>
              <li>
                <Link to='/' className='hover:text-gray-700'>Home</Link>
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
        <h1 className='font-bold text-xl'>Add Stock</h1>
      </div>

      <div className='p-4'>
        <form onSubmit={handleSubmit} className='w-full grid grid-cols-2 gap-4'>
          <div className="space-y-2">
            <label htmlFor="product" className="text-sm font-medium text-gray-700">Product Name</label>
            <SearchableSelect
              products={products}
              onSelect={setSelectedProduct}
              placeholder="Search and select a product..."
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="quantity" className="text-sm font-medium text-gray-700">Quantity</label>
            <Input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              className="w-full outline-none border border-gray-300"
            />
          </div>

          <div className="space-y-2 flex items-center gap-2 col-span-2">
            <input
              type="checkbox"
              id="changePrice"
              checked={changePrice}
              onChange={(e) => setChangePrice(e.target.checked)}
            />
            <label htmlFor="changePrice" className="text-sm font-medium text-gray-700">
              Change Product Price
            </label>
          </div>

          {changePrice && (
            <>
              <div className="space-y-2">
                <label htmlFor="purchasePrice" className="text-sm font-medium text-gray-700">Purchase Price</label>
                <Input
                  type="number"
                  id="purchasePrice"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  placeholder="Enter purchase price"
                  className="w-full outline-none border border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="sellingPrice" className="text-sm font-medium text-gray-700">Selling Price</label>
                <Input
                  type="number"
                  id="sellingPrice"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  placeholder="Enter selling price"
                  className="w-full outline-none border border-gray-300"
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <label htmlFor="vendor" className="text-sm font-medium text-gray-700">Vendor</label>
            <Input
              type="text"
              id="vendor"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              placeholder="Enter vendor"
              className="w-full outline-none border border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="receiveDate" className="text-sm font-medium text-gray-700">Date Received</label>
            <Input
              type="date"
              id="receiveDate"
              value={receiveDate}
              onChange={(e) => setReceiveDate(e.target.value)}
              className="w-full border border-gray-300"
            />
          </div>

          <div className='flex items-center gap-2 col-span-2'>
            <Button type="submit" className='bg-black text-white cursor-pointer'>Submit</Button>
            <Button
              variant="outline"
              type="button"
              className='cursor-pointer'
              onClick={() => {
                setSelectedProduct(null)
                setQuantity('')
                setPurchasePrice('')
                setSellingPrice('')
                setVendor('')
                setReceiveDate('')
                setChangePrice(false)
              }}
            >
              Reset Form
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddStock
