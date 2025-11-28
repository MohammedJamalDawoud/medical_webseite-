import { useState } from 'react';
import { Image as ImageIcon, Maximize2 } from 'lucide-react';

interface ImageGalleryProps {
    previewImages?: Record<string, string>;
    primaryImage?: string;
    title?: string;
}

export default function ImageGallery({ previewImages, primaryImage, title }: ImageGalleryProps) {
    const [activeView, setActiveView] = useState<string>('axial');
    const [isZoomed, setIsZoomed] = useState(false);

    // Normalize images: if previewImages is empty/null, use primaryImage as 'default'
    const images = previewImages && Object.keys(previewImages).length > 0
        ? previewImages
        : (primaryImage ? { default: primaryImage } : {});

    const views = Object.keys(images);

    // If active view not in images (e.g. initially 'axial' but only 'default' exists), switch to first available
    const currentView = images[activeView] ? activeView : views[0];
    const currentImage = images[currentView];

    if (!currentImage) {
        return (
            <div className="bg-slate-800/50 rounded-lg h-64 flex flex-col items-center justify-center text-gray-500">
                <ImageIcon size={48} className="mb-2 opacity-50" />
                <p>No preview available</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* View Selector Tabs */}
            {views.length > 1 && (
                <div className="flex space-x-2 bg-slate-800/50 p-1 rounded-lg w-fit">
                    {views.map((view) => (
                        <button
                            key={view}
                            onClick={() => setActiveView(view)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${(currentView === view)
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-slate-700'
                                }`}
                        >
                            {view.charAt(0).toUpperCase() + view.slice(1)}
                        </button>
                    ))}
                </div>
            )}

            {/* Image Display */}
            <div className={`relative group transition-all duration-300 ${isZoomed ? 'fixed inset-0 z-50 bg-black/90 p-8 flex items-center justify-center' : ''}`}>
                <div className={`relative rounded-xl overflow-hidden border border-slate-700 bg-black/20 ${isZoomed ? 'max-w-7xl w-full h-full' : 'aspect-video'}`}>
                    <img
                        src={`http://localhost:8000${currentImage}`}
                        alt={`${title || 'Segmentation'} - ${currentView} view`}
                        className={`w-full h-full ${isZoomed ? 'object-contain' : 'object-cover'}`}
                    />

                    {/* Overlay Info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white font-medium">{title}</p>
                        <p className="text-gray-300 text-sm capitalize">{currentView} View</p>
                    </div>

                    {/* Zoom Toggle */}
                    <button
                        onClick={() => setIsZoomed(!isZoomed)}
                        className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                    >
                        <Maximize2 size={20} />
                    </button>
                </div>

                {isZoomed && (
                    <button
                        onClick={() => setIsZoomed(false)}
                        className="absolute top-4 right-4 text-white/50 hover:text-white"
                    >
                        Close
                    </button>
                )}
            </div>
        </div>
    );
}
