import React, { useState, useEffect, useRef, useCallback } from 'react';

// Ensure three.js and OrbitControls are loaded via CDN in public/index.html
// <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/examples/js/controls/OrbitControls.min.js"></script>

const ThreeDShowroom = ({ onNavigate, initialProductData = {} }) => {
    const mountRef = useRef(null);
    const [productColor, setProductColor] = useState(initialProductData.color || '#3b82f6');
    const [productMaterial, setProductMaterial] = useState(initialProductData.material || 'phong');
    const [productDesign, setProductDesign] = useState(initialProductData.design || 'box');
    const [productSize, setProductSize] = useState(initialProductData.size || 1);

    // New state to hold the configuration for the 3D viewer
    const [viewerConfig, setViewerConfig] = useState(null);

    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const meshRef = useRef(null);
    const controlsRef = useRef(null);
    const animateId = useRef(null);

    // This effect updates local state when initialProductData changes (e.g., when navigating from a product card)
    useEffect(() => {
        // Check if the product has a 3D model defined
        if (initialProductData && initialProductData.threeDModel) {
            setViewerConfig(initialProductData.threeDModel);
        } else {
            // If no 3D model, fall back to primitive shapes
            setViewerConfig({ type: 'primitive' });
            if (initialProductData.color) setProductColor(initialProductData.color);
            if (initialProductData.material) setProductMaterial(initialProductData.material);
            if (initialProductData.design) setProductDesign(initialProductData.design);
            if (initialProductData.size) setProductSize(initialProductData.size);
        }
    }, [initialProductData]);


    const updateProductMesh = useCallback(() => {
        if (!sceneRef.current || (viewerConfig && viewerConfig.type !== 'primitive')) return;

        // Remove existing mesh
        if (meshRef.current) {
            sceneRef.current.remove(meshRef.current);
            meshRef.current.geometry.dispose();
            meshRef.current.material.dispose();
        }

        // Create new geometry based on design
        let geometry;
        switch (productDesign) {
            case 'sphere':
                geometry = new window.THREE.SphereGeometry(1, 32, 32);
                break;
            case 'cylinder':
                geometry = new window.THREE.CylinderGeometry(0.8, 0.8, 2, 32);
                break;
            case 'cone':
                geometry = new window.THREE.ConeGeometry(1, 2, 32);
                break;
            default: // box
                geometry = new window.THREE.BoxGeometry(1, 1, 1);
                break;
        }

        // Create new material based on material type and color
        let material;
        const colorHex = parseInt(productColor.replace('#', '0x'));
        switch (productMaterial) {
            case 'basic':
                material = new window.THREE.MeshBasicMaterial({ color: colorHex });
                break;
            case 'lambert':
                material = new window.THREE.MeshLambertMaterial({ color: colorHex });
                break;
            default: // phong
                material = new window.THREE.MeshPhongMaterial({ color: colorHex, specular: 0x555555, shininess: 30 });
                break;
        }

        // Create new mesh
        meshRef.current = new window.THREE.Mesh(geometry, material);
        meshRef.current.scale.set(productSize, productSize, productSize); // Apply size
        sceneRef.current.add(meshRef.current);

        // Center the camera on the new mesh
        if (cameraRef.current && controlsRef.current) {
            const bbox = new window.THREE.Box3().setFromObject(meshRef.current);
            const center = bbox.getCenter(new window.THREE.Vector3());
            controlsRef.current.target.copy(center);
            controlsRef.current.update();
        }

    }, [productColor, productMaterial, productDesign, productSize, viewerConfig]);

    useEffect(() => {
        if (viewerConfig && viewerConfig.type === 'sketchfab') {
            // If in Sketchfab mode, we don't need to do any Three.js setup.
            return;
        }

        if (!window.THREE || !window.THREE.OrbitControls) {
            console.error("three.js or OrbitControls not loaded. Check public/index.html script tags.");
            return;
        }

        const currentMount = mountRef.current;
        if (!currentMount) return;

        // Scene
        const scene = new window.THREE.Scene();
        sceneRef.current = scene;
        scene.background = new window.THREE.Color(0xf8f7f4); // Light background

        // Camera
        const camera = new window.THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        camera.position.z = 3;
        cameraRef.current = camera;

        // Renderer
        const renderer = new window.THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        currentMount.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Lights
        const ambientLight = new window.THREE.AmbientLight(0x404040, 2); // soft white light
        scene.add(ambientLight);
        const directionalLight = new window.THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5).normalize();
        scene.add(directionalLight);

        // OrbitControls
        const controls = new window.THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; // an animation loop is required when damping is enabled
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 1;
        controls.maxDistance = 10;
        controlsRef.current = controls;

        // Initial product setup
        updateProductMesh();

        // Animation loop
        const animate = () => {
            animateId.current = requestAnimationFrame(animate);
            controls.update(); // only required if controls.enableDamping or controls.autoRotate are set to true
            renderer.render(scene, camera);
        };
        animate();

        // Handle window resize
        const handleResize = () => {
            if (currentMount) {
                camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            }
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            cancelAnimationFrame(animateId.current);
            window.removeEventListener('resize', handleResize);
            if (controlsRef.current) controlsRef.current.dispose();
            if (rendererRef.current) rendererRef.current.dispose();
            if (currentMount && rendererRef.current && rendererRef.current.domElement) {
                currentMount.removeChild(rendererRef.current.domElement);
            }
            // Dispose of scene objects if necessary
            if (sceneRef.current) {
                sceneRef.current.traverse((object) => {
                    if (object.isMesh) {
                        object.geometry.dispose();
                        object.material.dispose();
                    }
                });
            }
        };
    }, [updateProductMesh, viewerConfig]);

    // Update mesh when attributes change
    useEffect(() => {
        updateProductMesh();
    }, [productColor, productMaterial, productDesign, productSize, updateProductMesh]);

    const handleFlip = () => {
        if (meshRef.current) {
            // Example: Flip 180 degrees around Y axis
            meshRef.current.rotation.y += Math.PI;
        }
    };

    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1']; // Blue, Green, Orange, Red, Indigo

    return (
        <section id="showroom-3d" className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-6">
                {/* Removed the hardcoded Sketchfab embed from here */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">Immersive 3D Product Showroom</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                        Interact with products in a dynamic 3D environment. Modify attributes like color, material, and design. Use your mouse to rotate, zoom, and pan the product.
                    </p>
                    <button
                        onClick={() => onNavigate('home')}
                        className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        ← Back to Home
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* 3D Canvas / Sketchfab Embed */}
                    
                    <div className="lg:col-span-2 bg-gray-100 rounded-xl shadow-lg border border-gray-200 flex items-center justify-center overflow-hidden" style={{ height: '500px' }}>
                        {viewerConfig?.type === 'sketchfab' ? (
                            <div className="sketchfab-embed-wrapper w-full h-full">
                                <iframe
                                    title={initialProductData.name || "3D Model"}
                                    frameBorder="0"
                                    allowFullScreen
                                    mozallowfullscreen="true"
                                    webkitallowfullscreen="true"
                                    allow="autoplay; fullscreen; xr-spatial-tracking"
                                    xr-spatial-tracking="true"
                                    execution-while-out-of-viewport="true"
                                    execution-while-not-rendered="true"
                                    web-share="true"
                                    src={`https://sketchfab.com/models/${viewerConfig.id}/embed?autostart=1&camera_offset=0,0,0`} // Added autostart and camera_offset
                                    className="w-full h-full"
                                ></iframe>
                                {/* Optional: Add Sketchfab attribution if desired, but ensure it's outside the iframe for proper rendering */}
                                <p style={{ fontSize: '13px', fontWeight: 'normal', margin: '5px', color: '#4A4A4A' }}>
                                    <a href={`https://sketchfab.com/3d-models/${viewerConfig.id}?utm_medium=embed&utm_campaign=share-popup&utm_content=${viewerConfig.id}`} target="_blank" rel="nofollow" style={{ fontWeight: 'bold', color: '#1CAAD9' }}> {initialProductData.name || "3D Model"} </a> by <a href="https://sketchfab.com/pixion?utm_medium=embed&utm_campaign=share-popup&utm_content=${viewerConfig.id}" target="_blank" rel="nofollow" style={{ fontWeight: 'bold', color: '#1CAAD9' }}> Pixion </a> on <a href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=${viewerConfig.id}" target="_blank" rel="nofollow" style={{ fontWeight: 'bold', color: '#1CAAD9' }}>Sketchfab</a>
                                </p>
                            </div>
                        ) : (
                            <div ref={mountRef} className="w-full h-full"></div>
                        )}
                    </div>

                    {/* Controls Panel */}
                    <div className="lg:col-span-1 p-6 bg-gray-50 rounded-xl shadow-lg border border-gray-200 space-y-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Product Customization</h3>

                        {/* Conditional rendering for Three.js specific controls */}
                        {viewerConfig?.type === 'primitive' && (
                            <>
                                {/* Color */}
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Color</label>
                                    <div className="flex flex-wrap gap-2">
                                        {colors.map(color => (
                                            <button
                                                key={color}
                                                className={`w-10 h-10 rounded-full border-2 ${productColor === color ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300'}`}
                                                style={{ backgroundColor: color }}
                                                onClick={() => setProductColor(color)}
                                                title={color}
                                            ></button>
                                        ))}
                                    </div>
                                </div>

                                {/* Material */}
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Material</label>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${productMaterial === 'basic' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
                                            onClick={() => setProductMaterial('basic')}
                                        >Basic</button>
                                        <button
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${productMaterial === 'lambert' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
                                            onClick={() => setProductMaterial('lambert')}
                                        >Lambert</button>
                                        <button
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${productMaterial === 'phong' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
                                            onClick={() => setProductMaterial('phong')}
                                        >Phong</button>
                                    </div>
                                </div>

                                {/* Design (Shape) */}
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Design (Shape)</label>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${productDesign === 'box' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
                                            onClick={() => setProductDesign('box')}
                                        >Box</button>
                                        <button
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${productDesign === 'sphere' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
                                            onClick={() => setProductDesign('sphere')}
                                        >Sphere</button>
                                        <button
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${productDesign === 'cylinder' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
                                            onClick={() => setProductDesign('cylinder')}
                                        >Cylinder</button>
                                        <button
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${productDesign === 'cone' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
                                            onClick={() => setProductDesign('cone')}
                                        >Cone</button>
                                    </div>
                                </div>

                                {/* Size */}
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Size: {productSize.toFixed(1)}x</label>
                                    <input
                                        type="range"
                                        min="0.5"
                                        max="2"
                                        step="0.1"
                                        value={productSize}
                                        onChange={(e) => setProductSize(parseFloat(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>

                                {/* Interaction Buttons */}
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Interaction</label>
                                    <button
                                        className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
                                        onClick={handleFlip}
                                    >Flip Product</button>
                                </div>
                            </>
                        )}

                        {/* Message to show when in Sketchfab mode */}
                        {viewerConfig?.type === 'sketchfab' && (
                            <div className="text-center text-gray-600">
                                <p>This is an interactive 3D model from Sketchfab.</p>
                                <p className="mt-2">Use the controls within the model viewer to interact.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ThreeDShowroom;
