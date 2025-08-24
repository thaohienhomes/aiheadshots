import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Filter, Grid, X, ZoomIn } from 'lucide-react';

interface GalleryItem {
  id: number;
  before: string;
  after: string;
  category: string;
  title: string;
  style: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    before: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
    after: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format&q=80&brightness=1.1&contrast=1.2&saturation=1.1",
    category: "Professional",
    title: "Corporate Executive Transform",
    style: "height: 300px"
  },
  {
    id: 2,
    before: "https://images.unsplash.com/photo-1494790108755-2616b612b1c7?w=400&h=500&fit=crop&crop=face&auto=format&q=70",
    after: "https://images.unsplash.com/photo-1494790108755-2616b612b1c7?w=400&h=500&fit=crop&crop=face&auto=format&q=90&brightness=1.15&contrast=1.25&saturation=1.05",
    category: "Creative",
    title: "Creative Professional Upgrade",
    style: "height: 400px"
  },
  {
    id: 3,
    before: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop&crop=face&auto=format&q=75",
    after: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop&crop=face&auto=format&q=95&brightness=1.2&contrast=1.3&saturation=1.1",
    category: "LinkedIn",
    title: "LinkedIn Profile Enhancement",
    style: "height: 250px"
  },
  {
    id: 4,
    before: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face&auto=format&q=70",
    after: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face&auto=format&q=90&brightness=1.1&contrast=1.2&saturation=1.08",
    category: "Professional",
    title: "Business Leader Polish",
    style: "height: 350px"
  },
  {
    id: 5,
    before: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&crop=face&auto=format&q=75",
    after: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&crop=face&auto=format&q=95&brightness=1.15&contrast=1.25&saturation=1.1",
    category: "Creative",
    title: "Marketing Professional Retouch",
    style: "height: 320px"
  },
  {
    id: 6,
    before: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face&auto=format&q=70",
    after: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face&auto=format&q=90&brightness=1.12&contrast=1.2&saturation=1.05",
    category: "LinkedIn",
    title: "Tech Professional Upgrade",
    style: "height: 380px"
  }
];

const categories = ["All", "Professional", "Creative", "LinkedIn"];

export function InteractiveGallery() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [sliderPosition, setSliderPosition] = useState<{ [key: number]: number }>({});
  const [zoomedImage, setZoomedImage] = useState<GalleryItem | null>(null);

  const filteredItems = selectedCategory === "All" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  const handleSliderChange = (itemId: number, position: number) => {
    setSliderPosition(prev => ({ ...prev, [itemId]: position }));
  };

  const openImageZoom = (item: GalleryItem) => {
    setZoomedImage(item);
  };

  const closeImageZoom = () => {
    setZoomedImage(null);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              AI Transformation
            </span>
            <span className="text-white"> Gallery</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See how our AI transforms each person's photo into a professional headshot with enhanced lighting, clarity, and polish
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25"
                  : "border-cyan-400/30 text-gray-300 hover:bg-white/10 backdrop-blur-sm"
              }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Masonry Gallery */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="break-inside-avoid mb-6"
                onHoverStart={() => setHoveredItem(item.id)}
                onHoverEnd={() => setHoveredItem(null)}
              >
                <Card className="overflow-hidden bg-white/5 backdrop-blur-md border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300">
                  <div className="relative group">
                    {/* Before/After Slider */}
                    <div 
                      className="relative overflow-hidden rounded-t-lg cursor-col-resize before-after-container"
                      style={{ height: item.style.split(':')[1].trim() }}
                      onMouseMove={(e) => {
                        if (e.buttons === 1) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = e.clientX - rect.left;
                          const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
                          handleSliderChange(item.id, percentage);
                        }
                      }}
                      onMouseDown={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
                        handleSliderChange(item.id, percentage);
                      }}
                    >
                      {/* After Image (Background - Right Side) */}
                      <div className="absolute inset-0">
                        <ImageWithFallback
                          src={item.after}
                          alt={`${item.title} - AI Enhanced`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Before Image (Clipped - Left Side) */}
                      <div
                        className="absolute inset-0 overflow-hidden transition-all duration-75 ease-out clip-transition"
                        style={{
                          clipPath: `polygon(0 0, ${sliderPosition[item.id] || 50}% 0, ${sliderPosition[item.id] || 50}% 100%, 0 100%)`
                        }}
                      >
                        <ImageWithFallback
                          src={item.before}
                          alt={`${item.title} - Natural`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Vertical Divider Line */}
                      <div 
                        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10 transition-all duration-75 ease-out"
                        style={{ left: `${sliderPosition[item.id] || 50}%`, transform: 'translateX(-50%)' }}
                      />

                      {/* Slider Handle */}
                      <div 
                        className="absolute top-1/2 w-6 h-6 bg-white rounded-full shadow-lg border-2 border-gray-300 z-20 transition-all duration-75 ease-out cursor-col-resize hover:scale-110"
                        style={{ 
                          left: `${sliderPosition[item.id] || 50}%`, 
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </div>

                      {/* Labels */}
                      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium border border-white/20 z-10">
                        Natural
                      </div>
                      <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium border border-white/20 z-10">
                        AI Enhanced
                      </div>

                      {/* Hover Effect with Zoom Button */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                        initial={false}
                        animate={{ opacity: hoveredItem === item.id ? 1 : 0 }}
                      >
                        <Button
                          onClick={() => openImageZoom(item)}
                          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30 hover:border-white/50 rounded-xl px-4 py-2 transition-all duration-300 hover:scale-105"
                        >
                          <ZoomIn className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-cyan-400 text-sm font-medium bg-cyan-400/10 px-2 py-1 rounded-full">
                          {item.category}
                        </span>
                      </div>
                      <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                      <p className="text-gray-400 text-sm">
                        AI-enhanced transformation of the same person with improved lighting, clarity, and professional polish
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-8 py-4 text-lg rounded-xl shadow-lg shadow-cyan-500/25">
            <Grid className="w-5 h-5 mr-2" />
            View More Examples
          </Button>
        </motion.div>
      </div>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={closeImageZoom}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] w-full mx-4 bg-slate-800 rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <Button
                onClick={closeImageZoom}
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full"
              >
                <X className="w-6 h-6" />
              </Button>

              {/* Content */}
              <div className="grid md:grid-cols-2 gap-0 h-full">
                {/* Before Image */}
                <div className="relative bg-slate-700">
                  <div className="aspect-square relative">
                    <ImageWithFallback
                      src={zoomedImage.before}
                      alt={`${zoomedImage.title} - Original`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm text-white px-4 py-2 rounded-full font-medium">
                      Original
                    </div>
                  </div>
                </div>

                {/* After Image */}
                <div className="relative bg-slate-600">
                  <div className="aspect-square relative">
                    <ImageWithFallback
                      src={zoomedImage.after}
                      alt={`${zoomedImage.title} - AI Enhanced`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-cyan-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full font-medium">
                      AI Enhanced
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Panel */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                <div className="text-center space-y-2">
                  <div className="inline-block bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-sm font-medium mb-2">
                    {zoomedImage.category}
                  </div>
                  <h3 className="text-xl font-bold text-white">{zoomedImage.title}</h3>
                  <p className="text-slate-300">
                    Professional AI enhancement with improved lighting, clarity, and polish
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}