import React, { useState, useEffect, useRef, useCallback } from 'react';
//import * as THREE from 'three';
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Import the individual page components
import MarketplacePage from './MarketPlacePage';
import ThreeDShowroom from './ThreeDShowroom';
import OrdersPage from './OrdersPage';
import Login from './Login';
import SignUp from './register'; // Import the SignUp component
import Dashboard from './dashBoard'; // Import the new Dashboard component
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// Header Component: Handles navigation and active link highlighting.
const Header = ({ onNavigate, currentPage, user, onLoginClick, showLogin, onLogout }) => {
    const navLinksRef = useRef([]); // Ref to store navigation link DOM elements
    const [isMenuOpen, setIsMenuOpen] = useState(false); // New state for mobile menu

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

                {/* Desktop Menu */}
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
                    {/* New Dashboard button */}
                    {user && (
                         <button
                            className={`nav-link ${currentPage === 'dashboard' ? 'active-nav' : ''}`}
                            onClick={() => onNavigate('dashboard')}
                            ref={el => navLinksRef.current[4] = el}
                            data-page="dashboard"
                         >
                            Dashboard
                        </button>
                    )}
                    <button
                        className="nav-link"
                        onClick={() => onNavigate('home', 'discovery')} // Navigates to 'discovery' section on 'home' page
                        ref={el => navLinksRef.current[5] = el}
                    >
                        Discovery
                    </button>
                </div>
                 {/* Display user info or login/logout button */}
                 <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white font-bold text-lg">
                                {user.email[0].toUpperCase()}
                            </div>
                            {/* Desktop Logout Button */}
                            <button className="text-blue-500 hidden md:block" onClick={onLogout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <button className="text-blue-500 hidden md:block" onClick={onLoginClick}>
                            {showLogin ? 'Close Login' : 'Login'}
                        </button>
                    )}

                    {/* Mobile menu toggle button (Hamburger icon) */}
                    <button className="text-gray-500 md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
                        </svg>
                    </button>
                 </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`md:hidden overflow-hidden transition-max-height duration-500 ease-in-out ${isMenuOpen ? 'max-h-screen' : 'max-h-0'}`}>
                <div className="flex flex-col items-start px-6 py-4 space-y-4">
                    <button
                        className="nav-link w-full text-left"
                        onClick={() => { onNavigate('home'); setIsMenuOpen(false); }}
                        data-page="home"
                    >
                        Home
                    </button>
                    <button
                        className="nav-link w-full text-left"
                        onClick={() => { onNavigate('marketplace'); setIsMenuOpen(false); }}
                        data-page="marketplace"
                    >
                        Marketplace
                    </button>
                    <button
                        className="nav-link w-full text-left"
                        onClick={() => { onNavigate('showroom'); setIsMenuOpen(false); }}
                        data-page="showroom"
                    >
                        3D Showroom
                    </button>
                    <button
                        className="nav-link w-full text-left"
                        onClick={() => { onNavigate('orders-page'); setIsMenuOpen(false); }}
                        data-page="orders-page"
                    >
                        Orders
                    </button>
                    {user && (
                        <button
                            className="nav-link w-full text-left"
                            onClick={() => { onNavigate('dashboard'); setIsMenuOpen(false); }}
                            data-page="dashboard"
                        >
                            Dashboard
                        </button>
                    )}
                    <button
                        className="nav-link w-full text-left"
                        onClick={() => { onNavigate('home', 'discovery'); setIsMenuOpen(false); }}
                    >
                        Discovery
                    </button>
                    {user ? (
                        <>
                           <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white font-bold text-lg">
                               {user.email[0].toUpperCase()}
                           </div>
                            <button
                                className="nav-link w-full text-left"
                                onClick={() => { onLogout(); setIsMenuOpen(false); }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className="nav-link w-full text-left"
                                onClick={() => { onLoginClick(); setIsMenuOpen(false); }}
                            >
                                Login
                            </button>
                            <button
                                className="nav-link w-full text-left"
                                onClick={() => { onNavigate('register'); setIsMenuOpen(false); }}
                            >
                                Register
                            </button>
                        </>
                    )}
                </div>
            </div>
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
                        <div className="bg-green-50 p-6 rounded-2xl shadow-sm">
                            <h4 className="font-bold text-lg text-green-800">Improved Engagement</h4>
                            <p className="mt-2 text-gray-700">Interactive 3D models capture attention and provide a richer shopping experience, leading to longer time on site.</p>
                        </div>
                        <div className="bg-blue-50 p-6 rounded-2xl shadow-sm">
                            <h4 className="font-bold text-lg text-blue-800">Reduced Returns</h4>
                            <p className="mt-2 text-gray-700">Customers can inspect products from every angle, gaining a better understanding of features and size, which reduces product returns.</p>
                        </div>
                        <div className="bg-purple-50 p-6 rounded-2xl shadow-sm">
                            <h4 className="font-bold text-lg text-purple-800">Future-Ready Technology</h4>
                            <p className="mt-2 text-gray-700">This feature positions the platform to seamlessly integrate future technologies like Augmented Reality (AR) and Virtual Reality (VR).</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Flowchart Section: Visualizes the platform evolution strategy.
const FlowchartSection = () => (
    <section id="flowchart" className="py-16 md:py-24">
        <div className="container mx-auto px-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">3. Strategic Flowchart</h2>
                <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">This flowchart illustrates the phased approach for platform evolution, from foundational e-commerce to a dynamic, immersive experience.</p>
            </div>
            {/* Flowchart Container with horizontal scroll on small screens */}
            <div className="flex justify-center overflow-x-auto pb-6">
                <div className="flex flex-col md:flex-row items-start justify-center md:space-x-12 space-y-8 md:space-y-0 relative">
                    {/* Flowchart lines (hidden on mobile for simplicity) */}
                    <div className="hidden md:block absolute inset-0 flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
                            <path d="M 100 50 L 350 50 M 350 50 L 350 150 M 350 150 L 650 150" stroke="#d1d5db" strokeWidth="2" fill="none" />
                            <circle cx="100" cy="50" r="5" fill="#3b82f6" />
                            <circle cx="350" cy="50" r="5" fill="#3b82f6" />
                            <circle cx="350" cy="150" r="5" fill="#3b82f6" />
                            <circle cx="650" cy="150" r="5" fill="#3b82f6" />
                        </svg>
                    </div>

                    {/* Step 1: Foundational E-commerce */}
                    <div className="flowchart-step text-center w-64 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-4 bg-gray-100 rounded-full mb-4">
                            <svg className="w-8 h-8 mx-auto text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM6 10a4 4 0 118 0 4 4 0 01-8 0z"></path></svg>
                        </div>
                        <h4 className="font-bold text-lg mb-2">Phase 1</h4>
                        <p className="text-sm text-gray-600">Single-vendor store with a limited catalog.</p>
                        <div className="tooltip absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg">
                            Initial platform setup with core e-commerce features.
                        </div>
                    </div>

                    {/* Step 2: Marketplace Integration */}
                    <div className="flowchart-step text-center w-64 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-4 bg-gray-100 rounded-full mb-4">
                            <svg className="w-8 h-8 mx-auto text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm-3 8a3 3 0 116 0 3 3 0 01-6 0z"></path></svg>
                        </div>
                        <h4 className="font-bold text-lg mb-2">Phase 2</h4>
                        <p className="text-sm text-gray-600">Multi-vendor marketplace with seller portals.</p>
                        <div className="tooltip absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg">
                            Onboarding new sellers and implementing a robust payments system.
                        </div>
                    </div>

                    {/* Step 3: 3D Immersive Showroom */}
                    <div className="flowchart-step text-center w-64 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-4 bg-gray-100 rounded-full mb-4">
                            <svg className="w-8 h-8 mx-auto text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm-3 8a3 3 0 116 0 3 3 0 01-6 0z"></path></svg>
                        </div>
                        <h4 className="font-bold text-lg mb-2">Phase 3</h4>
                        <p className="text-sm text-gray-600">3D Showroom with interactive product views.</p>
                        <div className="tooltip absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg">
                            Integrating 3D models and optimizing rendering performance.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// Footer Component
const Footer = () => (
    <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-6 text-center">
            <p>&copy; 2023 Your E-commerce Platform. All rights reserved.</p>
        </div>
    </footer>
);

const App = () => {
    // State to manage the current page view
    const [currentPage, setCurrentPage] = useState('home');
    const [showLogin, setShowLogin] = useState(false);
    const [user, setUser] = useState(null); // New state to hold user object
    const [initialProductData, setInitialProductData] = useState(null); // New state to hold product data for showroom


    // This effect listens for Firebase auth state changes.
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            // If a user is logged in, navigate to the dashboard.
            if (currentUser) {
                setCurrentPage('dashboard');
            } else {
                // If the user logs out, return to the home page.
                setCurrentPage('home');
            }
        });
        // Cleanup the listener when the component unmounts.
        return () => unsubscribe();
    }, []);

    // Function to handle navigation to different pages
    const handleNavigate = useCallback((page, productData = null) => {
        setCurrentPage(page);
        if (productData) {
            setInitialProductData(productData);
        }

        // Wait for the next render cycle to ensure the section is in the DOM
        setTimeout(() => {
            const element = document.getElementById(page);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 0);
    }, []);

    const handleLoginClick = useCallback(() => {
        setShowLogin(prevState => !prevState);
        // Navigate to the login page only if it is not already shown
        if (!showLogin) {
            setCurrentPage('login');
        } else {
             setCurrentPage('home');
        }
    }, [showLogin]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            // The onAuthStateChanged listener will handle the page change.
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    // Function to render the content based on the current page state
    const renderContent = () => {
        switch (currentPage) {
            case 'marketplace':
                return <MarketplacePage onNavigate={handleNavigate} />;
            case 'showroom':
                return <ThreeDShowroom onNavigate={handleNavigate} initialProductData={initialProductData} />;
            case 'orders-page':
                return <OrdersPage />;
            case 'login':
                return <Login onNavigate={handleNavigate} />;
            case 'register':
                return <SignUp onNavigate={handleNavigate} />;
            case 'dashboard':
                return <Dashboard user={user} onLogout={handleLogout} />; // Pass the user and logout function to the Dashboard
            case 'home':
            default:
                return (
                    <div id="home-page-content">
                        <IntroSection />
                        <MarketplaceSection onNavigate={handleNavigate} />
                        <ShowroomSection />
                        <FlowchartSection />
                    </div>
                );
        }
    };

    return (
        <div className="relative">
            {/* The CSS styles for the 3D card are included here, inside the component, using a <style> tag.
                This is a common practice for self-contained components in a framework like React,
                though in a real application, you'd typically use CSS modules or a library like styled-components. */}
            <style>
                {`
                /* Container to maintain aspect ratio for the 3D card */
                .product-card-3d {
                    perspective: 1000px;
                    transform-style: preserve-3d;
                    transition: transform 0.6s;
                    position: relative;
                }
                .product-card-3d.is-flipped {
                    transform: rotateY(180deg);
                }
                .product-card-3d img,
                .product-card-3d h4,
                .product-card-3d p,
                .product-card-3d .flex {
                    backface-visibility: hidden;
                    transition: transform 0.6s;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    padding: 1.5rem;
                }
                .product-card-3d img {
                    z-index: 2;
                }
                .product-card-3d h4,
                .product-card-3d p,
                .product-card-3d .flex {
                    transform: rotateY(180deg);
                    display: flex; /* Ensure content is laid out correctly on backface */
                    flex-direction: column; /* Stack content vertically */
                    justify-content: center;
                    align-items: center;
                }
                .product-card-3d h4,
                .product-card-3d p {
                    position: static;
                    transform: rotateY(180deg); /* Apply the flip to text content as well */
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

            {/* Render Header, passing navigation function, current page, and user */}
            <Header onNavigate={handleNavigate} currentPage={currentPage} user={user} onLoginClick={handleLoginClick} showLogin={showLogin} onLogout={handleLogout}/>
            <main>
                {renderContent()}
            </main>
            {/* Render Footer */}
            <Footer />
        </div>
    );
};

export default App;
