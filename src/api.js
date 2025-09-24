// src/api.js
const API_URL = import.meta.env.VITE_API_URL;

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

  if (!res.ok) {
    // Your backend sends { error: 'Server error' }
    throw new Error(data.error || 'Something went wrong');
  }

  return data; // This will be the created product object
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
