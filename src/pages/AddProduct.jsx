import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Plus, Loader2Icon } from 'lucide-react'
import { toast } from 'sonner'
import { createProduct, fetchCategories, createCategory, fetchBrands, createBrand } from '../api'

// SearchableSelect Component
const SearchableSelect = ({ items, selected, onSelect, placeholder = 'Select...', extraButton }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    const filtered = items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const handleSelect = item => {
        onSelect(item)
        setIsOpen(false)
        setSearchTerm('')
    }

    return (
        <div className="relative w-full">
            <div
                className="flex items-center justify-between px-3 py-2 border rounded-md cursor-pointer bg-white"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={selected ? 'text-gray-900' : 'text-gray-400'}>
                    {selected ? selected.name : placeholder}
                </span>
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
                <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    <div className="p-2 border-b flex justify-between items-center">
                        <Input
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        {extraButton && <div className="ml-2">{extraButton}</div>}
                    </div>
                    <div>
                        {filtered.length > 0 ? (
                            filtered.map(item => (
                                <div
                                    key={item.id}
                                    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSelect(item)}
                                >
                                    {item.name}
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-2 text-gray-400">No results found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

// Add Modal Component (can be used for both Brand and Category)
const AddItemModal = ({ title, isOpen, onClose, onSubmit }) => {
    const [name, setName] = useState('')
    const handleSubmit = e => {
        e.preventDefault()
        onSubmit({ name })
        setName('')
        onClose()
    }

    return (
        <div>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
                    <div className="bg-white p-4 rounded shadow-md w-[400px]">
                        <h2 className="font-bold text-lg mb-4">{title}</h2>
                        <form onSubmit={handleSubmit} className="space-y-2">
                            <Input
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder={`Enter ${title} name`}
                                required
                            />
                            <div className="flex justify-end gap-2 mt-4">
                                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                                <Button type="submit" className="bg-black text-white">Add</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

const AddProduct = () => {
    const location = useLocation()
    const pathnames = location.pathname.split('/').filter(x => x)

    const initialForm = {
        name: '',
        categoryId: '',
        brandId: '',
        sellingPrice: '',
        purchasePrice: '',
        stock: '',
        minStock: '',
        volume: '',
    }

    const [form, setForm] = useState(initialForm)
    const [submitting, setSubmitting] = useState(false)

    const [categories, setCategories] = useState([])
    const [brands, setBrands] = useState([])

    const [addCategoryOpen, setAddCategoryOpen] = useState(false)
    const [addBrandOpen, setAddBrandOpen] = useState(false)

    // Fetch categories and brands
    const loadCategories = async () => {
        try { const data = await fetchCategories(); setCategories(data) } 
        catch { toast.error('Failed to load categories') }
    }

    const loadBrands = async () => {
        try { const data = await fetchBrands(); setBrands(data) } 
        catch { toast.error('Failed to load brands') }
    }

    useEffect(() => {
        loadCategories()
        loadBrands()
    }, [])

    const handleChange = e => {
        const { id, value, type } = e.target
        setForm(prev => ({ ...prev, [id]: type === 'number' ? Number(value) : value }))
    }

    const handleCategorySelect = item => setForm(prev => ({ ...prev, categoryId: item.id }))
    const handleBrandSelect = item => setForm(prev => ({ ...prev, brandId: item.id }))

    const handleAddCategory = async data => {
        try {
            const newCat = await createCategory(data)
            toast.success('Category added!')
            setCategories(prev => [...prev, newCat])
            setForm(prev => ({ ...prev, categoryId: newCat.id }))
        } catch (err) { toast.error(err.message || 'Failed to add category') }
    }

    const handleAddBrand = async data => {
        try {
            const newBrand = await createBrand(data)
            toast.success('Brand added!')
            setBrands(prev => [...prev, newBrand])
            setForm(prev => ({ ...prev, brandId: newBrand.id }))
        } catch (err) { toast.error(err.message || 'Failed to add brand') }
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setSubmitting(true)
        try {
            await createProduct(form)
            toast.success('Product added successfully!')
            setForm(initialForm)
        } catch (err) {
            toast.error(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    const handleReset = () => setForm(initialForm)

    return (
        <div className="bg-white shadow-md p-4">
            {/* Breadcrumbs */}
            <div className='mb-6'>
                <nav className='text-gray-500 text-sm mb-2'>
                    {pathnames.length > 0 ? (
                        <ol className='list-none p-0 inline-flex'>
                            <li><Link to="/" className="hover:text-gray-700">Home</Link></li>
                            {pathnames.map((name, index) => {
                                const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                                const isLast = index === pathnames.length - 1
                                return (
                                    <li key={routeTo} className="flex items-center">
                                        <span className="mx-2">›</span>
                                        {isLast ? <span className="text-gray-700">{name.replace('-', ' ')}</span> :
                                            <Link to={routeTo} className="hover:text-gray-700">{name.replace('-', ' ')}</Link>}
                                    </li>
                                )
                            })}
                        </ol>
                    ) : <span>Home</span>}
                </nav>
                <h1 className="font-bold text-xl">Add Product</h1>
            </div>

            <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
                {/* Product Name */}
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Product Name</label>
                    <Input id="name" value={form.name} onChange={handleChange} placeholder="Enter product name" required />
                </div>

                {/* Brand */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Brand</label>
                    <SearchableSelect
                        items={brands}
                        selected={brands.find(b => b.id === form.brandId)}
                        onSelect={handleBrandSelect}
                        extraButton={<Button size="sm" variant="outline" onClick={() => setAddBrandOpen(true)}><Plus className="w-3 h-3" /></Button>}
                    />
                </div>

                {/* Category */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <SearchableSelect
                        items={categories}
                        selected={categories.find(c => c.id === form.categoryId)}
                        onSelect={handleCategorySelect}
                        extraButton={<Button size="sm" variant="outline" onClick={() => setAddCategoryOpen(true)}><Plus className="w-3 h-3" /></Button>}
                    />
                </div>

                {/* Selling Price */}
                <div className="space-y-2">
                    <label htmlFor="sellingPrice" className="text-sm font-medium">Selling Price</label>
                    <Input id="sellingPrice" type="number" value={form.sellingPrice} onChange={handleChange} placeholder="Selling Price" required />
                </div>

                {/* Purchase Price */}
                <div className="space-y-2">
                    <label htmlFor="purchasePrice" className="text-sm font-medium">Purchase Price</label>
                    <Input id="purchasePrice" type="number" value={form.purchasePrice} onChange={handleChange} placeholder="Purchase Price" required />
                </div>

                {/* Stock */}
                <div className="space-y-2">
                    <label htmlFor="stock" className="text-sm font-medium">Starting Stock</label>
                    <Input id="stock" type="number" value={form.stock} onChange={handleChange} placeholder="Starting Stock" required />
                </div>

                {/* Min Stock */}
                <div className="space-y-2">
                    <label htmlFor="minStock" className="text-sm font-medium">Minimum Stock</label>
                    <Input id="minStock" type="number" value={form.minStock} onChange={handleChange} placeholder="Minimum Stock" required />
                </div>

                {/* Volume */}
                <div className="space-y-2">
                    <label htmlFor="volume" className="text-sm font-medium">Volume</label>
                    <Input id="volume" value={form.volume} onChange={handleChange} placeholder="e.g. 250ML" />
                </div>

                {/* Buttons */}
                <div className="col-span-2 flex gap-2 mt-4">
                    <Button type="submit" disabled={submitting} className="bg-black text-white flex items-center gap-2">
                        {submitting && <Loader2Icon className="animate-spin w-4 h-4" />}
                        Submit
                    </Button>
                    <Button type="button" variant="outline" onClick={handleReset}>Reset</Button>
                </div>
            </form>

            {/* Add Modals */}
            <AddItemModal title="Add Category" isOpen={addCategoryOpen} onClose={() => setAddCategoryOpen(false)} onSubmit={handleAddCategory} />
            <AddItemModal title="Add Brand" isOpen={addBrandOpen} onClose={() => setAddBrandOpen(false)} onSubmit={handleAddBrand} />
        </div>
    )
}

export default AddProduct
