import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Edit, Trash2, ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { updateBrand, createBrand, fetchBrands, deleteBrand } from '../api'
import { toast } from 'sonner'

// Add Brand Modal
const AddBrandModal = ({ isOpen, onClose, onSubmit }) => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit({ name, description })
        setName('')
        setDescription('')
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>Add Brand</DialogTitle>
                    <DialogDescription>Add a new brand for products.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Name *</label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Brand name"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Description</label>
                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brand description"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="bg-black text-white">Add Brand</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

// Edit Brand Modal
const EditBrandModal = ({ brand, isOpen, onClose, onSubmit }) => {
    const [name, setName] = useState(brand?.name || '')
    const [description, setDescription] = useState(brand?.description || '')

    useEffect(() => {
        setName(brand?.name || '')
        setDescription(brand?.description || '')
    }, [brand])

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit({ id: brand.id, name, description })
        onClose()
    }

    if (!brand) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>Edit Brand</DialogTitle>
                    <DialogDescription>Update brand details.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Name *</label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Brand name"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Description</label>
                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brand description"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="bg-black text-white">Update Brand</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

const Categories = () => {
    const location = useLocation()
    const [brands, setBrands] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedBrands, setSelectedBrands] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(5)
    const [addModalOpen, setAddModalOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [editBrand, setEditBrand] = useState(null)

    const fetchAllBrands = async () => {
        const data = await fetchBrands()
        setBrands(data)
    }

    useEffect(() => {
        fetchAllBrands()
    }, [])

    const handleAddBrand = async (data) => {
        try {
            await createBrand(data)
            toast.success('Brand added successfully')
            fetchAllBrands()
        } catch (err) {
            toast.error(err.message || 'Failed to add brand')
        }
    }

    const handleEditBrand = async (data) => {
        try {
            await updateBrand(data)
            toast.success('Brand updated successfully')
            fetchAllBrands()
        } catch (err) {
            toast.error(err.message || 'Failed to update brand')
        }
    }

    const handleDeleteBrand = async (id) => {
        if (!window.confirm('Are you sure you want to delete this brand?')) return
        try {
            await deleteBrand(id)
            toast.success('Brand deleted successfully')
            fetchAllBrands()
        } catch (err) {
            toast.error(err.message || 'Failed to delete brand')
        }
    }

    const filteredBrands = brands.filter(brand =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalPages = Math.ceil(filteredBrands.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentBrands = filteredBrands.slice(startIndex, endIndex)

    const handleSelectAll = (checked) => {
        if (checked) setSelectedBrands(currentBrands.map(c => c.id))
        else setSelectedBrands([])
    }

    const handleSelectBrand = (id, checked) => {
        if (checked) setSelectedBrands([...selectedBrands, id])
        else setSelectedBrands(selectedBrands.filter(i => i !== id))
    }

    const pathnames = location.pathname.split('/').filter((x) => x)

    return (
        <div className='bg-white shadow-md p-4'>
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
                                    {isLast ? <span className='text-gray-700'>{name.replace('-', ' ')}</span> :
                                        <Link to={routeTo} className='hover:text-gray-700'>{name.replace('-', ' ')}</Link>}
                                </li>
                            )
                        })}
                    </ol>
                ) : <span>Home</span>}
            </nav>

            <div className='flex justify-between items-center py-4 border-b border-gray-200 mb-[20px]'>
                <h1 className='font-bold text-xl'>All Brands ({filteredBrands.length})</h1>
                <Button variant="outline" onClick={() => setAddModalOpen(true)} className='hover:bg-black hover:text-white cursor-pointer transition-all duration-300'>
                    <Plus className="w-4 h-4 mr-2" /> Add Brand
                </Button>
            </div>

            <div className='mb-6'>
                <div className='relative flex-1 w-[400px]'>
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Search brand..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-gray-50/50">
                            <th className="p-4 text-left">
                                <Checkbox
                                    checked={selectedBrands.length === currentBrands.length && currentBrands.length > 0}
                                    onCheckedChange={handleSelectAll}
                                />
                            </th>
                            <th className="p-4 text-left text-sm text-gray-500">Name</th>
                            <th className="p-4 text-left text-sm text-gray-500">Description</th>
                            <th className="p-4 text-left text-sm text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentBrands.map((brand) => (
                            <tr key={brand.id} className="border-b border-gray-200 hover:bg-gray-50/50">
                                <td className="p-4">
                                    <Checkbox
                                        checked={selectedBrands.includes(brand.id)}
                                        onCheckedChange={(checked) => handleSelectBrand(brand.id, checked)}
                                    />
                                </td>
                                <td className="p-4">{brand.name}</td>
                                <td className="p-4">{brand.description}</td>
                                <td className="p-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 bg-white">
                                            <DropdownMenuItem onClick={() => { setEditBrand(brand); setEditModalOpen(true) }}>
                                                <Edit className="w-4 h-4 mr-2" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDeleteBrand(brand.id)} className="text-red-600 hover:text-red-700">
                                                <Trash2 className="w-4 h-4 mr-2" /> Delete
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
            {totalPages < 5 && (
                <div className="flex items-center justify-between p-4 border-t">
                    <div className="text-sm text-gray-500">
                        Showing {startIndex + 1} to {Math.min(endIndex, filteredBrands.length)} of {filteredBrands.length} categories
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
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
            {currentBrands.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-500 mb-2">No brands found</div>
                    <div className="text-sm text-gray-400">
                        Try adjusting your search or filter criteria
                    </div>
                </div>
            )}

            {/* Modals */}
            <AddBrandModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} onSubmit={handleAddBrand} />
            <EditBrandModal brand={editBrand} isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} onSubmit={handleEditBrand} />
        </div>
    )
}

export default Categories
