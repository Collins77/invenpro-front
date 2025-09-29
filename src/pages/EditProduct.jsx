import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2Icon } from 'lucide-react'
import { toast } from 'sonner';
import { updateProduct } from '@/api'; // make sure you have an updateProduct API

const categories = [
    { id: 1, name: 'Beer' },
    { id: 2, name: 'Soft Drink' },
    { id: 3, name: 'Whiskey' },
    { id: 4, name: 'Vodka' },
    { id: 5, name: 'Spirits' },
];

const SearchableSelect = ({ items, onSelect, placeholder = 'Select category...', initialValue }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selected, setSelected] = useState(initialValue || null);

    const filtered = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = item => {
        setSelected(item);
        setIsOpen(false);
        setSearchTerm('');
        onSelect(item.name);
    };

    useEffect(() => {
        if (initialValue) {
            const match = items.find(i => i.name === initialValue);
            if (match) setSelected(match);
        }
    }, [initialValue, items]);

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
                    <div className="p-2 border-b">
                        <Input
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
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
    );
};

const EditProduct = () => {
    const location = useLocation()
    const product = location.state?.product // product passed via navigate state

    const pathnames = location.pathname.split('/').filter(x => x)

    const initialForm = {
        name: product?.name || '',
        category: product?.category || '',
        brand: product?.brand || '',
        sellingPrice: product?.sellingPrice || 0,
        purchasePrice: product?.purchasePrice || 0,
        stock: product?.stock || 0,
        minStock: product?.minStock || 0,
        volume: product?.volume || '',
    };

    const [form, setForm] = useState(initialForm)
    const [submitting, setSubmitting] = useState(false)

    const handleChange = e => {
        const { id, value, type } = e.target;
        let val = value;
        if (type === 'number') val = value === '' ? '' : Number(value);
        setForm(prev => ({ ...prev, [id]: val }))
    }

    const handleCategorySelect = category => setForm(prev => ({ ...prev, category }))

    const handleSubmit = async e => {
        e.preventDefault()
        setSubmitting(true)

        const productData = {
            ...form,
            sellingPrice: parseFloat(form.sellingPrice),
            purchasePrice: parseFloat(form.purchasePrice),
            stock: parseInt(form.stock, 10),
            minStock: parseInt(form.minStock, 10),
        }

        try {
            await updateProduct(product.id, productData)
            toast.success('Product updated successfully!')
        } catch (err) {
            toast.error(err.message || 'Failed to update product.')
        } finally {
            setSubmitting(false)
        }
    }

    const handleReset = () => setForm(initialForm)

    return (
        <div>
            <div className='bg-white shadow-md p-4'>
                <div className='mb-[20px]'>
                    {/* Breadcrumbs */}
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
                        ) : <span>Home</span>}
                    </nav>
                    <h1 className='font-bold text-xl'>Edit Product</h1>
                </div>

                <div className='p-4'>
                    <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">Product Name</label>
                            <Input id="name" className="w-full outline-none border border-gray-300"
                                value={form.name} onChange={handleChange} placeholder="Enter Product Name..." required />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="brand" className="text-sm font-medium">Brand</label>
                            <Input id="brand" className="w-full outline-none border border-gray-300"
                                value={form.brand} onChange={handleChange} placeholder="Enter Brand" required />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="category" className="text-sm font-medium">Category</label>
                            <SearchableSelect
                                items={categories}
                                onSelect={handleCategorySelect}
                                initialValue={form.category}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="sellingPrice" className="text-sm font-medium">Selling Price</label>
                            <Input id="sellingPrice" className="w-full outline-none border border-gray-300"
                                type="number" step="0.01" value={form.sellingPrice} onChange={handleChange} required />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="purchasePrice" className="text-sm font-medium">Purchase Price</label>
                            <Input id="purchasePrice" className="w-full outline-none border border-gray-300"
                                type="number" step="0.01" value={form.purchasePrice} onChange={handleChange} required />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="stock" className="text-sm font-medium">Stock</label>
                            <Input id="stock" className="w-full outline-none border border-gray-300"
                                type="number" value={form.stock} onChange={handleChange} required />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="minStock" className="text-sm font-medium">Minimum Stock</label>
                            <Input id="minStock" className="w-full outline-none border border-gray-300"
                                type="number" value={form.minStock} onChange={handleChange} required />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="volume" className="text-sm font-medium">Volume</label>
                            <Input type="text" id="volume" className="w-full outline-none border border-gray-300"
                                value={form.volume} onChange={handleChange} placeholder="250ML, 750ML..." />
                        </div>

                        <div className="col-span-2 flex gap-2 mt-4">
                            <Button type="submit" disabled={submitting} className="bg-black text-white flex items-center gap-2">
                                {submitting && <Loader2Icon className="animate-spin w-4 h-4" />}
                                Update
                            </Button>
                            <Button type="button" variant="outline" onClick={handleReset}>Reset</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditProduct
