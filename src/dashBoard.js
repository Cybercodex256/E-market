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

const Dashboard = ({ user, onLogout }) => {
  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8 font-['Inter']">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={user ? `https://placehold.co/100x100/A3B8FF/000000?text=${user.email[0].toUpperCase()}` : userInfo.profilePicture}
              alt="User Profile"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-blue-200"
            />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Welcome back, {user ? user.email : userInfo.name}!</h2>
              <p className="text-gray-500 text-sm">{user ? user.email : userInfo.email}</p>
            </div>
          </div>
          {/* Logout button */}
          <button
              onClick={onLogout}
              className="mt-4 md:mt-0 px-6 py-3 bg-red-600 text-white rounded-full font-semibold shadow-md hover:bg-red-700 transition duration-300 transform hover:scale-105"
          >
              Logout
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders Card */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Sample data rows */}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#98765</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Wireless Mouse</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-10-25</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Shipped</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$45.00</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#98764</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Mechanical Keyboard</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-10-24</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Processing</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$120.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Uploaded Products Card */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Your Products</h3>
            <ul className="space-y-4">
              {uploadedProducts.map(product => (
                <li key={product.id} className="flex items-center space-x-4 bg-gray-50 p-3 rounded-xl">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.price}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-semibold ${
                      product.status === 'Active' ? 'bg-green-100 text-green-800' :
                      product.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {product.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Support & Community Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Support Ticket Form */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Need Help?</h3>
            <p className="text-gray-500 mb-6">Submit a support request for any issues you're facing.</p>
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

          {/* Community Forums Card */}
          <div className="bg-blue-600 text-white rounded-3xl shadow-lg p-6 flex flex-col items-center text-center justify-center">
            <svg className="w-16 h-16 mb-4" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.98 5.98 0 0110 16a5.978 5.978 0 01-5.454-2.084A5 5 0 0010 11z" clipRule="evenodd"></path></svg>
            <h3 className="text-xl font-bold mb-2">Join the Community</h3>
            <p className="text-blue-200 mb-6">Connect with other sellers, share tips, and get insights from the community.</p>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold shadow-md hover:bg-gray-200 transition duration-300 transform hover:scale-105">
              Go to Forums
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
