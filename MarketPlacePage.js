import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';

// Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyCFPlNrFjbercNPc4u7IXG2vv5PNVHpmYg",
  authDomain: "e-marketing-platform-a02d1.firebaseapp.com",
  projectId: "e-marketing-platform-a02d1",
  storageBucket: "e-marketing-platform-a02d1.firebasestorage.app",
  messagingSenderId: "962648754227",
  appId: "1:962648754227:web:8f9c0393726024942a3b46",
  measurementId: "G-RCSS7KNMRT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const MarketplacePage = ({ onNavigate = () => {} }) => {
    // State to hold all products fetched from the database
    const [allProducts, setAllProducts] = useState([]);
    // State to hold products currently being displayed (filtered products)
    const [displayedProducts, setDisplayedProducts] = useState([]);
    // State to hold the current search query
    const [searchQuery, setSearchQuery] = useState('');
    // State to hold the selected category
    const [selectedCategory, setSelectedCategory] = useState('All');
    // State to hold unique categories
    const [categories, setCategories] = useState(['All']);

    useEffect(() => {
        const productsRef = ref(db, '/'); 
        get(productsRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    let productList = [];
                    if (Array.isArray(data)) {
                        productList = data;
                    } else {
                        productList = Object.keys(data).map(key => ({
                            id: key,
                            ...data[key]
                        }));
                    }
                    // Set both the allProducts and displayedProducts with the fetched data
                    setAllProducts(productList);
                    setDisplayedProducts(productList);

                    // Extract and set unique categories
                    const uniqueCategories = ['All', ...new Set(productList.map(p => p.category))];
                    setCategories(uniqueCategories);

                } else {
                    console.log("No data available");
                    setAllProducts([]);
                    setDisplayedProducts([]);
                    setCategories(['All']);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    // Effect to handle search and category filtering
    useEffect(() => {
        // First, filter by category
        const categoryFilteredProducts = allProducts.filter(product =>
            selectedCategory === 'All' || product.category === selectedCategory
        );

        // Then, filter the category-filtered list by search query
        const finalFilteredProducts = categoryFilteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setDisplayedProducts(finalFilteredProducts);
    }, [searchQuery, selectedCategory, allProducts]);

    return (
        <section id="marketplace-page" className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">Our Global Marketplace</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                        Explore a vast selection of products from various categories. Our marketplace connects you with diverse vendors, offering competitive prices and unique items.
                    </p>
                    <button
                        onClick={() => onNavigate('home')}
                        className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        ← Back to Home
                    </button>
                </div>

                {/* Search and Categories Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                    {/* Search Bar */}
                    <div className="relative w-full md:w-1/2">
                        <input
                            type="text"
                            placeholder="Search for products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-6 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                            />
                        </svg>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap justify-center md:justify-end gap-3 w-full md:w-1/2">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                                    ${selectedCategory === category 
                                        ? 'bg-blue-600 text-white shadow-lg' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
                                }
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                    {displayedProducts.length > 0 ? (
                        displayedProducts.map(product => (
                            <div
                                key={product.id}
                                className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 w-full max-w-xs
                                    transition-transform duration-300 ease-in-out hover:translate-x-2 hover:shadow-xl"
                            >
                                <img
                                    src={product.img}
                                    alt={product.name}
                                    className="w-full h-40 object-cover rounded-lg mb-4"
                                />
                                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                                <p className="text-gray-600 text-sm mb-2">{product.category}</p>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-2xl font-bold text-blue-600">{product.price}</span>
                                    <button
                                        onClick={() => onNavigate('showroom', product)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-500">
                            No products found matching your search.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default MarketplacePage;
