import React from 'react';

const OrdersPage = ({ onNavigate }) => {
    // Dummy data for orders
    const orders = [
        {
            id: 'ORD001',
            date: '2024-07-20',
            status: 'Delivered',
            total: 120.00,
            items: [
                { name: 'Wireless Headphones', qty: 1, price: 80.00 },
                { name: 'USB-C Cable', qty: 2, price: 20.00 }
            ]
        },
        {
            id: 'ORD002',
            date:'2024-07-22',
            status: 'Processing',
            total: 55.50,
            items: [
                { name: 'Phone Case', qty: 1, price: 15.50 },
                { name: 'Screen Protector', qty: 1, price: 10.00 },
                { name: 'Pop Socket', qty: 1, price: 30.00 }
            ]
        },
        {
            id: 'ORD003',
            date: '2024-07-23',
            status: 'Shipped',
            total: 300.00,
            items: [
                { name: 'Smart Watch X1', qty: 1, price: 199.00 },
                { name: 'Running Sneakers Pro', qty: 1, price: 101.00 }
            ]
        },
    ];

    // Dummy data for customer cart
    const cartItems = [
        { name: 'Ergonomic Office Chair', qty: 1, price: 220.00 },
        { name: 'Portable Bluetooth Speaker', qty: 1, price: 75.00 }
    ];

    const cartTotal = cartItems.reduce((sum, item) => sum + (item.qty * item.price), 0).toFixed(2);

    return (
        <section id="orders-page" className="py-16 md:py-24 bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Your Orders & Cart</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                        View your past orders and the items currently in your shopping cart.
                    </p>
                    <button
                        onClick={() => onNavigate('home')}
                        className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        ← Back to Home
                    </button>
                </div>

                {/* Customer Cart Section */}
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 mb-12">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Shopping Cart</h3>
                    {cartItems.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg overflow-hidden">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Product</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Quantity</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Price</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item, index) => (
                                        <tr key={index} className="border-b border-gray-200 last:border-b-0">
                                            <td className="py-3 px-4 text-gray-700">{item.name}</td>
                                            <td className="py-3 px-4 text-gray-700">{item.qty}</td>
                                            <td className="py-3 px-4 text-gray-700">${item.price.toFixed(2)}</td>
                                            <td className="py-3 px-4 text-gray-700">${(item.qty * item.price).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    <tr className="bg-gray-50 font-bold">
                                        <td colSpan="3" className="py-3 px-4 text-right text-gray-800">Cart Total:</td>
                                        <td className="py-3 px-4 text-gray-800">${cartTotal}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-600">Your cart is empty.</p>
                    )}
                </div>

                {/* Orders History Section */}
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Past Orders</h3>
                    {orders.length > 0 ? (
                        <div className="space-y-6">
                            {orders.map(order => (
                                <div key={order.id} className="border border-gray-200 rounded-lg p-6 shadow-sm">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-lg font-semibold text-gray-700">Order ID: {order.id}</h4>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                            order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-blue-100 text-blue-800'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-sm mb-2">Date: {order.date}</p>
                                    <p className="text-gray-700 font-bold mb-4">Total: ${order.total.toFixed(2)}</p>
                                    <h5 className="text-md font-semibold text-gray-600 mb-2">Items:</h5>
                                    <ul className="list-disc list-inside text-gray-600">
                                        {order.items.map((item, idx) => (
                                            <li key={idx}>{item.name} (x{item.qty}) - ${item.price.toFixed(2)} each</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">You have no past orders.</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default OrdersPage;
