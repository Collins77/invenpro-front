import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronsDownUp, Home, Search, Trash2, User, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchProducts, fetchCategories, createSale, getCurrentUser } from '../api';
import { toast } from 'sonner';
import prod from '../assets/placeholder.png';

const Pos = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [discount, setDiscount] = useState(0);
    const [paymentType, setPaymentType] = useState('');
    const [customerType, setCustomerType] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
          try {
            const data = await getCurrentUser();
            setUser(data);
          } catch (err) {
            console.error(err);
            // removeLocalStorage("token");
            navigate("/login");
          }
        };
        loadUser();
      }, [navigate]);

    useEffect(() => {
        const getData = async () => {
            try {
                const [productsData, categoriesData] = await Promise.all([
                    fetchProducts(),
                    fetchCategories()
                ]);
                setProducts(productsData);
                setCategories(categoriesData);
            } catch (err) {
                console.error(err);
                toast.error('Failed to fetch data');
            }
        };
        getData();
    }, []);

    const toggleCartItem = (product) => {
        const exists = cart.find(item => item.productId === product.id);
        if (exists) {
            setCart(cart.filter(item => item.productId !== product.id));
        } else {
            setCart([...cart, { productId: product.id, name: product.name, price: product.sellingPrice, quantity: 1 }]);
        }
    };

    const updateQuantity = (productId, type) => {
        setCart(cart.map(item => {
            if (item.productId === productId) {
                const newQty = type === 'inc' ? item.quantity + 1 : item.quantity - 1;
                return { ...item, quantity: newQty > 0 ? newQty : 1 };
            }
            return item;
        }));
    };

    const removeItem = (productId) => {
        setCart(cart.filter(item => item.productId !== productId));
    };

    const resetCart = () => {
        setCart([]);
        setDiscount(0);
        setPaymentType(undefined);
        setCustomerType(undefined);
    };

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = Math.max(subtotal - discount, 0);

    const handleConfirmSale = async () => {
        if (cart.length === 0) return toast.error('No items in cart');
        if (discount > subtotal) return toast.error('Discount cannot exceed subtotal');
        if (!paymentType) return toast.error('Please select a payment type');
        if (!customerType) return toast.error('Please select a customer type');

        try {
            const saleData = {
                items: cart.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                })),
                subtotal,
                discount,
                total,
                paymentType,
                customerType,
                date: new Date().toISOString(),
            };

            await createSale(saleData);
            toast.success('Sale confirmed!');
            // Update product stock in frontend
            setProducts(prevProducts => prevProducts.map(product => {
                const soldItem = cart.find(c => c.productId === product.id);
                if (soldItem) {
                    return { ...product, stock: product.stock - soldItem.quantity };
                }
                return product;
            }));
            resetCart();
        } catch (err) {
            console.error(err);
            toast.error(err.message || 'Failed to confirm sale');
        }
    };

    const filteredProducts = products.filter(product =>
        (selectedCategory === 'all' || product.categoryId === selectedCategory) &&
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='bg-white'>
            <header className="flex items-center justify-between bg-white border-b border-gray-200 px-4 h-14">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard')} className='px-4 py-2 border border-gray-200 rounded-md hover:bg-black hover:text-white flex gap-2 duration-300 transition-all cursor-pointer'>
                        <ArrowLeft /> Back to Dashboard
                    </button>
                    <h1 className="font-bold text-2xl">Billiards Chillzone</h1>
                </div>
                <div className="relative flex gap-2 items-center cursor-pointer">
                    <div className="w-[40px] h-[40px] bg-gray-200 flex items-center justify-center rounded-full"><User /></div>
                    <div className="flex flex-col">
                        <h1 className="font-bold text-sm">{user?.firstName} {user?.lastName}</h1>
                        <p className="text-gray-500 text-sm">{user?.email}</p>
                    </div>
                    {/* <ChevronsDownUp className="text-gray-500" size={20} /> */}
                </div>
            </header>

            <div className='px-[20px] flex gap-4'>
                {/* Products List */}
                <div className='bg-white w-[70%] py-4'>
                    <div className='flex flex-col gap-3 bg-white shadow py-[20px] px-4'>
                        <div className='flex items-center w-full gap-4'>
                            <div className='relative w-[80%]'>
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 border border-gray-300 outline-none"
                                />
                            </div>
                            <div className='w-[20%]'>
                                <p className='px-2 py-1 w-fit border border-gray-200 rounded-md flex items-center gap-2 text-sm text-gray-500'>
                                    Counter <Home size={20} />
                                </p>
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className='grid grid-cols-6 gap-4'>
                            <p 
                                onClick={() => setSelectedCategory('all')} 
                                className={`px-2 py-1 border border-gray-300 rounded-md text-sm cursor-pointer ${selectedCategory === 'all' ? 'bg-black text-white' : 'hover:bg-black hover:text-white duration-300 transition-all'}`}
                            >
                                All Products
                            </p>
                            {categories.map(category => (
                                <p 
                                    key={category.id} 
                                    onClick={() => setSelectedCategory(category.id)} 
                                    className={`px-2 py-1 border border-gray-300 rounded-md text-sm cursor-pointer ${selectedCategory === category.id ? 'bg-black text-white' : 'hover:bg-black hover:text-white duration-300 transition-all'}`}
                                >
                                    {category.name}
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* Product Cards */}
                    <div className='grid grid-cols-5 gap-2 bg-blue-200/10 p-2 max-h-[600px] overflow-y-scroll'>
                        {filteredProducts.map(product => {
                            const inCart = cart.find(item => item.productId === product.id);
                            return (
                                <div key={product.id} className='bg-white border border-gray-200 rounded-md p-2 h-[200px] relative cursor-pointer' onClick={() => toggleCartItem(product)}>
                                    <img src={prod} alt={product.name} className='w-full h-[50%] rounded-lg object-cover' />
                                    {inCart && <CheckCircle className="absolute top-2 right-2 text-blue-500" size={20} />}
                                    <p className='bg-black absolute text-[10px] py-1 px-2 w-fit rounded-full text-white left-2 top-2'>
                                        {product.stock} in stock
                                    </p>
                                    <div className='flex flex-col items-center mt-2'>
                                        <h1 className='font-bold truncate w-full text-center'>{product.name}</h1>
                                        <p className='text-gray-500'>{product.volume}</p>
                                        <h1 className='font-semibold'>KES {product.sellingPrice}</h1>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Cart / Order */}
                <div className='w-[30%] bg-white border-l border-gray-300 p-2 flex flex-col'>
                    <h1 className='font-bold text-xl mb-[10px]'>Current Order</h1>
                    <div className='flex items-center gap-3 mb-[10px]'>
                        <Select value={paymentType} onValueChange={setPaymentType}>
                            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Payment Type" /></SelectTrigger>
                            <SelectContent className='bg-white'>
                                <SelectItem value="Cash">Cash</SelectItem>
                                <SelectItem value="MPESA">MPESA</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={customerType} onValueChange={setCustomerType}>
                            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Customer Type" /></SelectTrigger>
                            <SelectContent className='bg-white'>
                                <SelectItem value="Walk-In">Walk-In Customer</SelectItem>
                                <SelectItem value="Delivery">Delivery</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <p className='text-gray-500 text-[12px] mb-[10px]'>{cart.length} item(s), {cart.reduce((a, b) => a + b.quantity, 0)} total quantity</p>

                    {/* Cart Items */}
                    <div
                        className="overflow-y-auto px-2 py-1"
                        style={{ maxHeight: '300px', height: '250px' }}
                    >
                        {cart.map(item => (
                            <div key={item.productId} className='w-full bg-white flex flex-col gap-1 p-3 border-b border-gray-200 h-[90px]'>
                                <div className='flex justify-between items-center'>
                                    <h1 className='font-semibold truncate'>{item.name}</h1>
                                    <Trash2 className='text-red-400 cursor-pointer' size={20} onClick={() => removeItem(item.productId)} />
                                </div>
                                <div className='flex justify-between items-center mt-1'>
                                    <div className='grid grid-cols-3 gap-2 items-center justify-center border border-gray-300 rounded-md'>
                                        <button className='p-1 border-r border-gray-300' onClick={() => updateQuantity(item.productId, 'dec')}>-</button>
                                        <p className='p-1'>{item.quantity}</p>
                                        <button className='p-1 border-l border-gray-300' onClick={() => updateQuantity(item.productId, 'inc')}>+</button>
                                    </div>
                                    <div className='text-right'>
                                        <p className='text-gray-500 text-[12px]'>KES {item.price} x {item.quantity}</p>
                                        <h1 className='font-bold'>KES {item.price * item.quantity}</h1>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Totals & Actions */}
                    <div className='bg-blue-200/10 flex flex-col gap-2 p-2'>
                        <div className='flex justify-between items-center'><p className='text-gray-500'>Subtotal:</p><p className='text-black'>KES {subtotal}</p></div>
                        <div className='flex justify-between items-center mb-3'>
                            <p className='text-gray-500'>Discount:</p>
                            <Input type="number" className="border border-gray-300 w-[100px]" placeholder="0" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} min={0} />
                        </div>
                        <div className='flex justify-between items-center border-t border-gray-200 py-1 mb-[10px]'>
                            <h1 className='font-bold text-lg'>Total:</h1>
                            <p className='font-bold text-lg'>KES {total}</p>
                        </div>
                        <div className='flex gap-3'>
                            <button className='py-2 px-4 w-full cursor-pointer border border-gray-300 rounded-md hover:bg-black/60 hover:text-white transition-all duration-300' onClick={resetCart}>Reset</button>
                            <button className='py-2 px-4 w-full cursor-pointer border border-gray-300 rounded-md bg-black text-white' onClick={handleConfirmSale}>Confirm Sale</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Pos;