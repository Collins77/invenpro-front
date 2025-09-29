// src/api.js
const API_URL = import.meta.env.VITE_API_URL;

// --- Products ---
export const fetchProducts = async () => {
    const response = await fetch(`${API_URL}/products`);
    return response.json();
};

export const createProduct = async (productData) => {
    const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Something went wrong');
    return data;
};

export const updateProduct = async (id, productData) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
    });
    return response.json();
};

export const deleteProduct = async (id) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
    });
    return response.json();
};

export const addStock = async (id, stockData) => {
    const response = await fetch(`${API_URL}/products/${id}/stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stockData),
    });
    return response.json();
};

// --- Sales ---
export const createSale = async (saleData) => {
    const res = await fetch(`${API_URL}/sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create sale');
    return data;
};

export const fetchSales = async () => {
    const res = await fetch(`${API_URL}/sales`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch sales");
    return data;
};

export const fetchSaleById = async (id) => {
    const res = await fetch(`${API_URL}/sales/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch sale");
    return data;
};

// --- Categories ---
export const fetchCategories = async () => {
    const res = await fetch(`${API_URL}/categories`);
    return res.json();
};

export const createCategory = async (categoryData) => {
    const res = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create category');
    return data;
};

export const updateCategory = async (categoryData) => {
    const res = await fetch(`${API_URL}/categories/${categoryData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update category');
    return data;
};

export const deleteCategory = async (id) => {
    const res = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
    });
    return res.json();
};

// --- Brands ---
export const fetchBrands = async () => {
    const res = await fetch(`${API_URL}/brands`);
    return res.json();
};

export const createBrand = async (brandData) => {
    const res = await fetch(`${API_URL}/brands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brandData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create brand');
    return data;
};

export const updateBrand = async (brandData) => {
    const res = await fetch(`${API_URL}/brands/${brandData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brandData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update brand');
    return data;
};

export const deleteBrand = async (id) => {
    const res = await fetch(`${API_URL}/brands/${id}`, {
        method: 'DELETE',
    });
    return res.json();
};

// --- Auth ---
export const registerUser = async (userData) => {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to register user');
    return data;
};

export const loginUser = async (credentials) => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to login');
    // Save token in localStorage (optional, for persistence)
    if (data.token) localStorage.setItem('token', data.token);
    return data;
};

export const getCurrentUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const res = await fetch(`${API_URL}/auth/me`, {
        headers: { 
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch user');
    return data;
};

export const logoutUser = () => {
    localStorage.removeItem('token');
};

