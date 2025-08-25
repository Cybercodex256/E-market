import React from 'react';

// Data for demonstration purposes
const userInfo = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  profilePicture: "https://placehold.co/100x100/A3B8FF/000000?text=JD"
};

const uploadedProducts = [
  { id: 1, name: 'Smartwatch Pro', image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80', price: '$299', status: 'Active' },
  { id: 2, name: 'Wireless Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06f2e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', price: '$149', status: 'Pending Review' },
  { id: 3, name: '4K Action Camera', image: 'https://images.unsplash.com/photo-1510414777553-92f7501a37c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80', price: '$349', status: 'Draft' },
];

const Dashboard = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8 font-['Inter']">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={userInfo.profilePicture}
              alt="User Profile"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-blue-200"
            />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Welcome back, {userInfo.name}!</h2>
              <p className="text-gray-500 text-sm">{userInfo.email}</p>
            </div>
          </div>
          <button className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105">
            Edit Profile
          </button>
        </div>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Charts Section */}
          <div className="bg-white rounded-3xl shadow-lg p-6 lg:col-span-2">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Analytics Overview</h3>
            <div className="flex flex-col sm:flex-row justify-around items-center space-y-4 sm:space-y-0 sm:space-x-4">
              {/* This is a placeholder for a chart library like Chart.js or Recharts */}
              <div className="w-full h-48 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-200">
                <p className="text-gray-400 text-center">
                  <span className="font-bold">Placeholder for Sales Chart</span><br />
                  (e.g., Bar Chart showing monthly sales)
                </p>
              </div>
              <div className="w-full h-48 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-200">
                <p className="text-gray-400 text-center">
                  <span className="font-bold">Placeholder for User Chart</span><br />
                  (e.g., Pie Chart for user demographics)
                </p>
              </div>
            </div>
          </div>

          {/* User Products Section */}
          <div className="bg-white rounded-3xl shadow-lg p-6 lg:col-span-1">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Your Products</h3>
            <div className="space-y-4">
              {uploadedProducts.map(product => (
                <div key={product.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-700">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.price}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    product.status === 'Active' ? 'bg-green-200 text-green-800' :
                    product.status === 'Pending Review' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-gray-300 text-gray-800'
                  }`}>
                    {product.status}
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition duration-300">
              View All Products
            </button>
          </div>

          {/* Help Form Section */}
          <div className="bg-white rounded-3xl shadow-lg p-6 md:col-span-2 lg:col-span-3">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Need Help?</h3>
            <p className="text-gray-600 mb-6">If you have a question or an issue, please fill out the form below. We'll get back to you as soon as possible.</p>
            <form className="space-y-4">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., Issues with product upload"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-2xl shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Describe your problem in detail."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-green-600 text-white rounded-full font-semibold shadow-md hover:bg-green-700 transition duration-300 transform hover:scale-105"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
