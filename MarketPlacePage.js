import React from 'react';

// This is the main data source for products on the marketplace page.
// To add more 3D objects, simply add a new product object to this array.
//
// HOW TO ADD A NEW 3D PRODUCT:
// 1. Copy one of the existing product objects.
// 2. Update the 'id', 'name', 'category', 'price', 'img', and 'description'.
// 3. Add the 'threeDModel' property with the following structure:
//    - For a Sketchfab model: { type: 'sketchfab', id: 'YOUR_SKETCHFAB_MODEL_ID' }
//    - For a custom Three.js model (GLTF/GLB): { type: 'gltf', url: 'URL_TO_YOUR_MODEL.glb' }
//    - If a product has no 3D model, set 'threeDModel' to null.
//

//#####create a database with fields of (id name category img and description)
//### using a gemerator utility to provide random ids for the prducts in tht database.
//#### we are going to use mysql2 librarry for database management.
//#### going to intergrate firebase for proper management of the database 


const products = [
    {
        id: 1,
        name: 'Wireless Headphones',
        category: 'Electronics',
        price: '$249',
        img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        description: 'Immersive sound experience with active noise cancellation.',
        threeDModel: null
    },
    {
        id: 2,
        name: 'Smart Watch X1',
        category: 'Electronics',
        price: '$199',
        img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        description: 'Track your fitness, notifications, and more on the go.',
        threeDModel: {
            type: 'sketchfab',
            id: '384b544e530c46f4be37039a4a44cbab'
        }
    },
    {
        id: 3,
        name: 'Espresso Machine',
        category: 'Home Goods',
        price: '$389',
        img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        description: 'Craft barista-quality coffee at home with ease.',
        threeDModel: null
    },
    {
        id: 4,
        name: 'Classic Leather Jacket',
        category: 'Fashion',
        price: '$350',
        img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        description: 'Timeless style and premium comfort for any occasion.',
        threeDModel: null
    },
    {
        id: 5,
        name: 'Couch Sofa',
        category: 'Home Goods',
        price: '$750',
        img: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        description: 'A comfortable and stylish sofa for your living room.',
        threeDModel: {
            type: 'sketchfab',
            id: '4c21287f43c24e91a79f983dab90f771' // Sketchfab ID for Couch Sofa
        }
    },
    {
        id: 6,
        name: 'Corvus Accent Chair',
        category: 'Home Goods',
        price: '$450',
        img: 'https://images.unsplash.com/photo-1583845112203-29329902330b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        description: 'A mid-century modern accent chair, perfect for any living space.',
        threeDModel: {
            type:'sketchfab',
            id: '1fded5bd02c94164abc39c98640050d6'
        }
    },
    {
        id: 7,
        name: 'Robotic Vacuum Cleaner',
        category: 'Home Goods',
        price: '$299',
        img: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        description: 'Effortlessly clean your home with smart navigation.',
        threeDModel: null
    },
    {
        id: 8,
        name: 'Running Sneakers Pro',
        category: 'Fashion',
        price: '$120',
        img: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        description: 'Lightweight and responsive for peak athletic performance.',
        threeDModel: null
    },
    {
        id: 9,
        name: 'Portable Bluetooth Speaker',
        category: 'Electronics',
        price: '$75',
        img: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        description: 'Powerful sound in a compact, durable design.',
        threeDModel: null
    },
    {
        id: 10,
        name: 'Ergonomic Office Chair',
        category: 'Home Goods',
        price: '$220',
        img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        description: 'Designed for ultimate comfort and support during long hours.',
        threeDModel: null
    },
    {
        id: 11,
        name: 'Designer Handbag',
        category: 'Fashion',
        price: '$480',
        img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        description: 'Sophisticated accessory for the modern individual.',
        threeDModel: null
    },
    {
        id: 12,
        name: '4K Smart TV',
        category: 'Electronics',
        price: '$799',
        img: 'https://images.unsplash.com/photo-1577979749830-f1d742b96791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        description: 'Stunning visuals and smart features for immersive entertainment.',
        threeDModel: null
    },
    {
        id: 13,
        name: 'Weighted Blanket',
        category: 'Home Goods',
        price: '$65',
        img: 'https://images.unsplash.com/photo-1616628188841-7f2d0f6051a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        description: 'Promotes relaxation and better sleep.',
        threeDModel: null
    },
    {
        id: 14,
        name: 'Denim Jeans Slim Fit',
        category: 'Fashion',
        price: '$95',
        img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        description: 'Comfortable and stylish for everyday wear.',
        threeDModel: null
    },
];

const MarketplacePage = ({ onNavigate = () => {} }) => {
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
