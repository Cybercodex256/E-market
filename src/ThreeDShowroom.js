import React, { useState, useEffect } from 'react';

const ThreeDShowroom = ({ onNavigate, initialProductData }) => {
    // New state to hold the configuration for the 3D viewer
    const [viewerConfig, setViewerConfig] = useState(null);

    // This effect updates local state when initialProductData changes (e.g., when navigating from a product card)
    useEffect(() => {
        // Check if the product has a 3D model defined
        if (initialProductData && initialProductData.threeDModel) {
            //alert(initialProductData.threeDModel.id)
            setViewerConfig(initialProductData.threeDModel);
        } else {
            // If no 3D model, set a placeholder config
            setViewerConfig({ type: 'none' });
        }
    }, [initialProductData]);


    return (
        <section id="showroom-3d" className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">Immersive 3D Product Showroom</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                        Interact with products in a dynamic 3D environment. Use your mouse to rotate, zoom, and pan the product.
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
                    <div className="lg:col-span-2 bg-gray-100 rounded-xl shadow-lg border border-gray-200">
                        {viewerConfig?.type === 'sketchfab' && viewerConfig?.id ? (
                            <div className="w-full h-full aspect-w-16 aspect-h-9 overflow-hidden">
                                {/* Using iframe to embed the Sketchfab model */}
                                <iframe
                                    title={initialProductData?.name || "3D Model"}
                                    frameBorder="0"
                                    allowFullScreen
                                    mozallowfullscreen="true"
                                    webkitallowfullscreen="true"
                                    allow="autoplay; fullscreen; xr-spatial-tracking"
                                    xr-spatial-tracking
                                    execution-while-out-of-viewport
                                    execution-while-not-rendered
                                    web-share
                                    src={`https://sketchfab.com/models/${viewerConfig.id}/embed?autostart=1&ui_controls=0&ui_infos=1&ui_help=1&ui_settings=1&ui_inspector=1&ui_watermark=1&ui_ar=1&ui_annotations=1&ui_animations=1&ui_profiles=1`}
                                    className="w-full h-full min-h-[400px]"
                                ></iframe>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 p-8">
                                <p>No 3D model available for this product.</p>
                            </div>
                        )}
                    </div>
                    {/* Controls Panel */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between">
                         {viewerConfig?.type === 'sketchfab' ? (
                            <div className="text-center text-gray-600">
                                <p className="font-semibold text-lg">{initialProductData?.name || '3D Product Model'}</p>
                                <p className="mt-2 text-sm">This is an interactive 3D model from Sketchfab.</p>
                                <p className="mt-1 text-sm">Use the controls within the model viewer to interact.</p>
                            </div>
                         ) : (
                             <div className="text-center text-gray-500">
                                <p className="font-semibold text-lg">Model Not Available</p>
                                <p className="mt-2 text-sm">Please select a product with a 3D model to view it here.</p>
                            </div>
                         )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ThreeDShowroom;
