import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Image {
  url: string;
  alt: string;
  caption: string;
}

const ImageCarousel = ({ schoolImages }: { schoolImages: Image[] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      handleNextImage();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentImageIndex, isAutoPlaying]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? schoolImages.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === schoolImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-lg shadow-xl bg-gray-900">
      {/* Image Container with Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImageIndex}
          className="absolute w-full h-full"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <img
            src={schoolImages[currentImageIndex].url}
            alt={schoolImages[currentImageIndex].caption}
            className="w-full h-full object-cover"
          />

          {/* Caption Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
            <p className="text-2xl font-bold text-white drop-shadow-lg">
              {schoolImages[currentImageIndex].caption}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="absolute inset-0 flex items-center justify-between p-4">
        <motion.button
          className="w-10 h-10 rounded-full bg-white bg-opacity-30 text-white flex items-center justify-center backdrop-blur-sm hover:bg-opacity-50 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePrevImage}
        >
          <ChevronLeft />
        </motion.button>

        <motion.button
          className="w-10 h-10 rounded-full bg-white bg-opacity-30 text-white flex items-center justify-center backdrop-blur-sm hover:bg-opacity-50 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNextImage}
        >
          <ChevronRight />
        </motion.button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-2 mb-2">
        {schoolImages.map((_, index: number) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentImageIndex === index
                ? "bg-white w-6"
                : "bg-white bg-opacity-50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Autoplay Toggle */}
      <button
        onClick={toggleAutoPlay}
        className="absolute top-4 right-4 text-white bg-black bg-opacity-30 backdrop-blur-sm p-2 rounded-full hover:bg-opacity-50 transition-all text-xs"
      >
        {isAutoPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
};

export default ImageCarousel;
