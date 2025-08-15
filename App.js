import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Chart from 'chart.js/auto';

// Import the individual page components
import MarketplacePage from './MarketPlacePage'; // Corrected import path
import ThreeDShowroom from './ThreeDShowroom';
import OrdersPage from './OrdersPage';

// Header Component: Handles navigation and active link highlighting.
const Header = ({ onNavigate, currentPage }) => {
    const navLinksRef = useRef([]); // Ref to store navigation link DOM elements

    // Effect to handle scroll-based active link highlighting for the 'home' page sections.
    // Also handles highlighting for full-page navigation links.
    useEffect(() => {
        const handleScroll = () => {
            // If not on the home page, remove active class from all home section links.
            if (currentPage !== 'home') {
                navLinksRef.current.forEach(link => {
                    if (link) {
                        link.classList.remove('active-nav');
                    }
                });
                // Highlight the current full-page link (e.g., Marketplace, 3D Showroom, Orders).
                const activePageLink = navLinksRef.current.find(link => link && link.getAttribute('data-page') === currentPage);
                if (activePageLink) {
                    activePageLink.classList.add('active-nav');
                }
                return; // Exit if not on home page to avoid section scrolling logic.
            }

            // Logic for 'home' page sections:
            let current = 'intro'; // Default to 'intro' section if at the very top.
            const sections = document.querySelectorAll('main section'); // Get all main sections.

            // Determine which section is currently in view based on scroll position.
            sections.forEach(section => {
                // Only consider sections that are children of the 'home-page-content' wrapper.
                if (section.offsetParent && section.offsetParent.id === 'home-page-content') {
                    const sectionTop = section.offsetTop; // Top position of the section.
                    // If the scroll position is past the section's top (with a small offset).
                    if (window.pageYOffset >= sectionTop - 70) {
                        current = section.getAttribute('id'); // Set current to this section's ID.
                    }
                }
            });

            // Update active class for navigation links based on the current section/page.
            navLinksRef.current.forEach(link => {
                if (link) {
                    link.classList.remove('active-nav'); // Remove active class from all links first.
                    // If the link's href matches the current section ID and starts with '#', activate it.
                    if (link.getAttribute('href') && link.getAttribute('href').includes(current) && link.getAttribute('href').startsWith('#')) {
                        link.classList.add('active-nav');
                    }
                }
            });
        };

        // Add scroll event listener and call handler immediately to set initial state.
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        // Cleanup function to remove the event listener when the component unmounts.
        return () => window.removeEventListener('scroll', handleScroll);
    }, [currentPage]); // Re-run effect if currentPage changes.

    return (
        <header className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">Platform Evolution Strategy</h1>
                <div className="hidden md:flex space-x-8">
                    {/* Navigation buttons with conditional active classes and data-page attributes */}
                    <button
                        className={`nav-link ${currentPage === 'home' ? 'active-nav' : ''}`}
                        onClick={() => onNavigate('home')}
                        ref={el => navLinksRef.current[0] = el}
                        data-page="home"
                    >
                        Home
                    </button>
                    <button
                        className={`nav-link ${currentPage === 'marketplace' ? 'active-nav' : ''}`}
                        onClick={() => onNavigate('marketplace')}
                        ref={el => navLinksRef.current[1] = el}
                        data-page="marketplace"
                    >
                        Marketplace
                    </button>
                    <button
                        className={`nav-link ${currentPage === 'showroom' ? 'active-nav' : ''}`}
                        onClick={() => onNavigate('showroom')}
                        ref={el => navLinksRef.current[2] = el}
                        data-page="showroom"
                    >
                        3D Showroom
                    </button>
                    {/* Orders tab: Navigates to the dedicated OrdersPage */}
                    <button
                        className={`nav-link ${currentPage === 'orders-page' ? 'active-nav' : ''}`}
                        onClick={() => onNavigate('orders-page')}
                        ref={el => navLinksRef.current[3] = el}
                        data-page="orders-page"
                    >
                        Orders
                    </button>
                    <button
                        className="nav-link"
                        onClick={() => onNavigate('home', 'discovery')} // Navigates to 'discovery' section on 'home' page
                        ref={el => navLinksRef.current[4] = el}
                    >
                        Discovery
                    </button>
                </div>
            </nav>
        </header>
    );
};

// Intro Section: First section on the home page.
const IntroSection = () => (
    <section id="intro" className="py-16 md:py-24 text-center bg-white">
        <div className="container mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Enhancing Your E-Marketing Platform</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">An interactive guide to the strategic enhancements designed to foster competitive growth. This application translates the core recommendations into an explorable experience.</p>
        </div>
    </section>
);

// Marketplace Section: Highlights the marketplace and provides a link to the full page.
const MarketplaceSection = ({ onNavigate }) => (
    <section id="marketplace" className="py-16 md:py-24">
        <div className="container mx-auto px-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">1. Evolving to a Marketplace</h2>
                <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                    The first strategic pillar is to evolve from a single-vendor site to a multi-vendor marketplace, similar to leaders like Jumia. This expands product selection, fosters competition, and requires new capabilities across logistics, payments, and seller management.
                    Explore our full product catalog on the dedicated Marketplace page.
                </p>
                <button
                    onClick={() => onNavigate('marketplace')}
                    className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
                >
                    Go to Marketplace →
                </button>
            </div>
        </div>
    </section>
);

// Showroom Section: Demonstrates a 3D product card with a flip effect.
const ShowroomSection = () => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleCardClick = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <section id="showroom" className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">2. The Immersive 3D Showroom</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">A 3D showroom moves beyond static images to create dynamic, interactive experiences. This enhances customer understanding, reduces returns, and future-proofs the platform for AR/VR technologies. Click the product card below to see a simulated 3D effect.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="flex items-center justify-center p-8">
                        <div
                            id="product-3d-card"
                            className={`product-card-3d bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm cursor-pointer ${isFlipped ? 'is-flipped' : ''}`}
                            onClick={handleCardClick}
                        >
                            {/* Replaced placeholder with a real image for headphones */}
                            <img src="https://images.unsplash.com/photo-1505740420928-5e560c06f2e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" alt="Premium Headphones" className="rounded-lg mb-4 w-full h-auto object-cover" />
                            <h4 className="text-xl font-bold">AcousticPro Headphones</h4>
                            <p className="text-gray-500 mb-4">High-fidelity wireless headphones</p>
                            <div className="flex justify-between items-center">
                                <span className="text-2xl font-bold text-blue-600">$249</span>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Add to Cart</button>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                            <h4 className="font-bold text-lg text-green-800">Enhanced Engagement</h4>
                            <p className="text-green-700">Allows users to interact with products, increasing dwell time and understanding of features.</p>
                        </div>
                        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                            <h4 className="font-bold text-lg text-green-800">Reduced Returns</h4>
                            <p className="text-green-700">Customers get a more accurate perception of the product, leading to fewer returns due to mismatched expectations.</p>
                        </div>
                        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                            <h4 className="font-bold text-lg text-green-800">Increased Conversions</h4>
                            <p className="text-green-700">A clearer, more confident understanding of the product encourages purchase decisions.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Discovery Section: Displays product filtering and analytics charts.
const DiscoverySection = () => {
    // Dummy product data for the interactive grid.
    const products = [
        { id: 1, name: 'Wireless Headphones', category: 'electronics', price: '$249', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06f2e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80' },
        { id: 2, name: 'Smart Watch', category: 'electronics', price: '$199', img: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80' },
        { id: 3, name: 'Modern Coffee Maker', category: 'home', price: '$89', img: 'https://images.unsplash.com/photo-1621265893452-95f68b368739?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80' },
        { id: 4, name: 'Leather Jacket', category: 'fashion', price: '$350', img: 'https://images.unsplash.com/photo-1618354691764-96f79093b70b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80' },
        { id: 5, name: 'Robotic Vacuum', category: 'home', price: '$299', img: 'https://images.unsplash.com/photo-1606107555027-d42427429b12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80' },
        { id: 6, name: 'Stylish Sneakers', category: 'fashion', price: '$120', img: 'https://images.unsplash.com/photo-1552066371-2d7210986565?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&&auto=format&fit=crop&w=400&q=80' },
    ];

    // Data for the Chart.js analytics dashboard.
    const chartData = {
        sales: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Total Sales ($K)',
                data: [65, 59, 80, 81, 56, 55],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                fill: true,
                tension: 0.1
            }]
        },
        users: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'New vs Returning Users',
                data: [30, 45, 40, 60, 70, 65],
                backgroundColor: '#10b981',
                type: 'bar', // Bar chart for user data.
            }, {
                label: 'Conversion Rate (%)',
                data: [2.1, 2.5, 2.3, 2.8, 3.1, 2.9],
                borderColor: '#ef4444',
                tension: 0.1,
                yAxisID: 'y1' // Secondary Y-axis for conversion rate.
            }]
        },
        traffic: {
            labels: ['Organic Search', 'Direct', 'Referral', 'Social Media', 'Paid Ads'],
            datasets: [{
                label: 'Traffic Sources',
                data: [300, 200, 100, 80, 150],
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#ec4899'],
            }]
        }
    };

    const [filterCategory, setFilterCategory] = useState('all'); // State for product category filter.
    const [currentChartType, setCurrentChartType] = useState('sales'); // State for active chart type.
    const chartRef = useRef(null); // Ref for the canvas element where the chart will be drawn.
    const chartInstance = useRef(null); // Ref to hold the Chart.js instance.

    // Effect to initialize and update the Chart.js chart.
    useEffect(() => {
        // Destroy existing chart instance before creating a new one to prevent memory leaks.
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d'); // Get 2D rendering context.
        let options = {
            responsive: true, // Chart resizes with its container.
            maintainAspectRatio: false, // Do not maintain aspect ratio, allows flexible sizing.
            plugins: {
                legend: { position: 'top' }, // Legend at the top.
                title: { display: true, text: 'Platform Analytics' } // Chart title.
            }
        };

        let chartType = 'line'; // Default chart type.
        if (currentChartType === 'traffic') chartType = 'doughnut'; // Doughnut for traffic.
        if (currentChartType === 'users') chartType = 'bar'; // Bar for users.

        // Configure scales specifically for the 'users' chart (dual Y-axis).
        if (currentChartType === 'users') {
            options.scales = {
                y: { beginAtZero: true, position: 'left', title: { display: true, text: 'User Count' } },
                y1: { beginAtZero: true, position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'Conversion Rate (%)' } }
            };
        } else {
             options.scales = { y: { beginAtZero: true } }; // Simple Y-axis for other charts.
        }

        // Create new Chart.js instance.
        chartInstance.current = new Chart(ctx, {
            type: chartType,
            data: chartData[currentChartType],
            options: options
        });

        // Cleanup function to destroy the chart instance when the component unmounts or effect re-runs.
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [currentChartType]); // Re-run effect when the active chart type changes.

    // Filter products based on the selected category.
    const filteredProducts = filterCategory === 'all' ? products : products.filter(p => p.category === filterCategory);

    return (
        <section id="discovery" className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">4. Optimizing Discovery & Insights</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Effective product cards, categories, and charts work together. They improve product discovery for customers and provide invaluable data insights for the business to drive strategy and personalization.</p>
                </div>

                <div className="grid lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2">
                        <h3 className="text-2xl font-bold mb-4">Interactive Product Grid</h3>
                        <p className="mt-4 text-gray-600 mb-6">Use the filters to see how categories help users find what they need. Product cards should be informative and visually appealing.</p>
                        <div id="category-filters" className="flex flex-wrap gap-2 mb-6">
                            {/* Category filter buttons */}
                            <button
                                data-category="all"
                                className={`category-btn px-4 py-2 rounded-full text-sm ${filterCategory === 'all' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border'}`}
                                onClick={() => setFilterCategory('all')}
                            >
                                All
                            </button>
                            <button
                                data-category="electronics"
                                className={`category-btn px-4 py-2 rounded-full text-sm ${filterCategory === 'electronics' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border'}`}
                                onClick={() => setFilterCategory('electronics')}
                            >
                                Electronics
                            </button>
                            <button
                                data-category="home"
                                className={`category-btn px-4 py-2 rounded-full text-sm ${filterCategory === 'home' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border'}`}
                                onClick={() => setFilterCategory('home')}
                            >
                                Home Goods
                            </button>
                            <button
                                data-category="fashion"
                                className={`category-btn px-4 py-2 rounded-full text-sm ${filterCategory === 'fashion' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border'}`}
                                onClick={() => setFilterCategory('fashion')}
                            >
                                Fashion
                            </button>
                        </div>
                        <div id="product-grid" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Render filtered product cards */}
                            {filteredProducts.map(product => (
                                <div key={product.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                    <img src={product.img} alt={product.name} className="w-full h-32 object-cover rounded-md mb-4" />
                                    <h4 className="font-semibold">{product.name}</h4>
                                    <p className="text-gray-500 text-sm">{product.category}</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="font-bold text-lg">{product.price}</span>
                                        <span className="text-yellow-400 text-xs">★★★★☆</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <h3 className="text-2xl font-bold mb-4">Actionable Analytics Dashboard</h3>
                        <p className="mt-4 text-lg text-gray-600 mb-6">An interactive dashboard turns raw data into clear insights for sales, customer behavior, and marketing effectiveness. Change the view below.</p>
                         <div id="chart-controls" className="flex flex-wrap gap-2 mb-6">
                            {/* Chart type selection buttons */}
                            <button
                                data-chart="sales"
                                className={`chart-btn px-4 py-2 rounded-full text-sm ${currentChartType === 'sales' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border'}`}
                                onClick={() => setCurrentChartType('sales')}
                            >
                                Sales Performance
                            </button>
                            <button
                                data-chart="users"
                                className={`chart-btn px-4 py-2 rounded-full text-sm ${currentChartType === 'users' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border'}`}
                                onClick={() => setCurrentChartType('users')}
                            >
                                User Behavior
                            </button>
                            <button
                                data-chart="traffic"
                                className={`chart-btn px-4 py-2 rounded-full text-sm ${currentChartType === 'traffic' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border'}`}
                                onClick={() => setCurrentChartType('traffic')}
                            >
                                Traffic Sources
                            </button>
                        </div>
                        <div className="chart-container bg-gray-50 p-4 rounded-xl shadow-md">
                            <canvas id="analyticsChart" ref={chartRef}></canvas> {/* Canvas for the chart */}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Footer Component: Simple footer for the application.
const Footer = () => (
    <footer className="bg-gray-800 text-white text-center py-6">
        <p>An interactive summary of the E-Marketing Platform Strategic Evolution Report.</p>
    </footer>
);


// Main App Component: Manages the overall application state and routing between pages.
const App = () => {
    // State to manage the currently displayed page.
    // Possible values: 'home', 'marketplace', 'showroom', 'orders-page'.
    const [currentPage, setCurrentPage] = useState('home');
    // State to pass initial product data to the 3D showroom when navigating from a product card.
    const [initialProductData, setInitialProductData] = useState({});

    // Function to handle navigation between different pages/sections.
    const handleNavigate = (page, data = null) => {
        setCurrentPage(page); // Update the current page state.

        // If navigating to the showroom with specific product data, set it.
        if (page === 'showroom' && data) {
            setInitialProductData(data);
        } else {
            // Otherwise, clear any previous product data.
            setInitialProductData({});
        }

        // Scroll logic:
        // If navigating to a specific section on the 'home' page.
        if (page === 'home' && data && typeof data === 'string') { // data is sectionId here
            setTimeout(() => {
                const section = document.getElementById(data);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' }); // Smooth scroll to the section.
                }
            }, 100); // Small delay to ensure DOM is ready.
        } else if (page === 'marketplace' || page === 'showroom' || page === 'orders-page' || page === 'home') {
             // If navigating to a full page (or home without a specific section), scroll to top.
             setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
             }, 100);
        }
    };

    return (
        <div className="antialiased">
            {/* Inline style block for global CSS, including font and navigation link styles. */}
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
                body {
                    font-family: 'Inter', sans-serif;
                }
                .nav-link {
                    color: #4a5568; /* Default text color */
                    font-weight: 600;
                    transition: color 0.3s ease;
                }
                .nav-link:hover {
                    color: #2b6cb0; /* Hover color */
                }
                .nav-link.active-nav {
                    color: #2b6cb0; /* Active color */
                    border-bottom: 2px solid #2b6cb0; /* Active indicator */
                    padding-bottom: 4px; /* Space for the border */
                }
                /* Styles for the 3D product card on the home page */
                .product-card-3d {
                    perspective: 1000px; /* Establishes a 3D-space for children */
                }
                .product-card-3d img,
                .product-card-3d h4,
                .product-card-3d p,
                .product-card-3d .flex {
                    transition: transform 0.6s; /* Smooth transition for flip effect */
                    transform-style: preserve-3d; /* Children maintain their 3D position */
                }
                .product-card-3d.is-flipped img {
                    transform: rotateY(180deg); /* Flip image horizontally */
                }
                .product-card-3d.is-flipped h4,
                .product-card-3d.is-flipped p,
                .product-card-3d.is-flipped .flex {
                    transform: rotateY(180deg); /* Flip text content horizontally */
                }
                /* Flowchart step styles (from previous context) */
                .flowchart-step {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .flowchart-step .tooltip {
                    visibility: hidden;
                    opacity: 0;
                    transition: opacity 0.3s ease, visibility 0.3s ease;
                }
                .flowchart-step:hover .tooltip {
                    visibility: visible;
                    opacity: 1;
                }
                `}
            </style>

            {/* Render Header, passing navigation function and current page */}
            <Header onNavigate={handleNavigate} currentPage={currentPage} />
            <main>
                {/* Conditional rendering based on currentPage state */}
                {currentPage === 'home' ? (
                    <div id="home-page-content">
                        <IntroSection />
                        <MarketplaceSection onNavigate={handleNavigate} />
                        <ShowroomSection />
                        <DiscoverySection />
                    </div>
                ) : currentPage === 'marketplace' ? (
                    <MarketplacePage onNavigate={handleNavigate} />
                ) : currentPage === 'showroom' ? (
                    <ThreeDShowroom onNavigate={handleNavigate} initialProductData={initialProductData} />
                ) : ( // Default case: if currentPage is 'orders-page' or any other unhandled value.
                    <OrdersPage onNavigate={handleNavigate} />
                )}
            </main>
            {/* Render Footer */}
            <Footer />
        </div>
    );
};

export default App;
