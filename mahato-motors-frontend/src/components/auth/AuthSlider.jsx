import { useEffect, useState } from "react";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
    title: "Precision Engineering",
    subtitle: "Experience performance like never before",
  },
  {
    image:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8",
    title: "Luxury Redefined",
    subtitle: "Crafted for comfort and power",
  },
  {
    image:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a",
    title: "Future Mobility",
    subtitle: "Drive into tomorrow",
  },
];

export default function AuthSlider({ position }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-1/2 hidden md:block overflow-hidden">

      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center scale-110 animate-zoom"
            style={{ backgroundImage: `url(${slide.image})` }}
          ></div>

          <div className="absolute inset-0 bg-black/60"></div>

          <div className="absolute bottom-20 left-10 text-white">
            <h2 className="text-3xl font-semibold animate-fadeInUp">
              {slide.title}
            </h2>
            <p className="mt-2 text-sm opacity-80 animate-fadeInUp delay-200">
              {slide.subtitle}
            </p>
          </div>
        </div>
      ))}

      {/* Indicator Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition ${
              current === index
                ? "bg-white"
                : "bg-white/40"
            }`}
          ></div>
        ))}
      </div>

      {/* Blend Edge */}
      {position === "right" ? (
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black/60 to-transparent"></div>
      ) : (
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black/60 to-transparent"></div>
      )}
    </div>
  );
}
