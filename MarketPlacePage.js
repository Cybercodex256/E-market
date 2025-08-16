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
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Use the correct database reference
        const productsRef = ref(db, '/'); 
        get(productsRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    // If the data is a list of products, convert it directly to an array
                    const data = snapshot.val();
                    if (Array.isArray(data)) {
                        setProducts(data);
                    } else {
                        // If the data is an object with keys, convert it as before
                        const productList = Object.keys(data).map(key => ({
                            id: key, // Use the key as the ID
                            ...data[key] // Spread the rest of the product data
                        }));
                        setProducts(productList);
                    }
                } else {
                    console.log("No data available");
                    setProducts([]); // Ensure products is an empty array, not null/undefined
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

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

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                    {products.map(product => (
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
                                {/* This button now passes the entire product object to the onNavigate function */}
                                <button
                                    onClick={() => onNavigate('showroom', product)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MarketplacePage;
