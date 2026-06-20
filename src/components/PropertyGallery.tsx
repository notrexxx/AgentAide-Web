"use client";

import { useState, useEffect } from "react";

export default function PropertyGallery({ images, propertyName }: { images: string[], propertyName: string }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Allow users to use keyboard arrows and Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, images.length]);

  const nextImage = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="border-t border-slate-100 pt-10 mt-4">
      <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
        <span className="w-8 h-1 bg-secondary rounded-full"></span>
        Property Gallery
      </h2>
      
      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 gap-4 space-y-4">
        {images.map((url, index) => (
          <div 
            key={index} 
            onClick={() => setSelectedIndex(index)}
            className="w-full relative bg-slate-100 rounded-2xl overflow-hidden group break-inside-avoid shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <img 
              src={url} 
              alt={`${propertyName} Image ${index + 1}`} 
              className="w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
              loading="lazy"
            />
            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-slate-900/10 transition-colors duration-300 flex items-center justify-center">
               <span className="bg-white/95 text-slate-800 text-sm font-semibold py-2 px-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-md shadow-lg flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                  View Full
               </span>
            </div>
          </div>
        ))}
      </div>

      {/* Full-Screen Lightbox Modal */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-xl transition-opacity"
          onClick={() => setSelectedIndex(null)} // Click background to close
        >
           {/* Close Button */}
           <button 
             onClick={() => setSelectedIndex(null)}
             className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/25 p-3 rounded-full backdrop-blur-md transition-all z-50"
           >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
           </button>

           {/* Previous Button */}
           <button 
             onClick={(e) => { e.stopPropagation(); prevImage(); }}
             className="absolute left-4 md:left-8 text-white/70 hover:text-white bg-white/10 hover:bg-white/25 p-4 rounded-full backdrop-blur-md transition-all z-50"
           >
             <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
           </button>

           {/* Image Container */}
           <div 
             className="relative max-w-[90vw] max-h-[85vh]"
             onClick={(e) => e.stopPropagation()} // Prevent clicking image from closing modal
           >
             <img 
               src={images[selectedIndex]} 
               alt={`${propertyName} Full Image`}
               className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
             />
           </div>

           {/* Next Button */}
           <button 
             onClick={(e) => { e.stopPropagation(); nextImage(); }}
             className="absolute right-4 md:right-8 text-white/70 hover:text-white bg-white/10 hover:bg-white/25 p-4 rounded-full backdrop-blur-md transition-all z-50"
           >
             <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
           </button>

           {/* Image Counter */}
           <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/90 bg-white/10 px-5 py-2 rounded-full font-semibold text-sm backdrop-blur-md tracking-wider">
             {selectedIndex + 1} / {images.length}
           </div>
        </div>
      )}
    </div>
  );
}