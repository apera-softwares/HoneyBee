"use client";
import Image from "next/image";
import React, { useState } from "react";
import { TbArrowNarrowLeft, TbArrowNarrowRight } from "react-icons/tb";

interface ISectionCardProps {
  title: string;
  points: string[];
  images: string[];
}

const ServiceCard: React.FC<ISectionCardProps> = ({
  title,
  points,
  images,
}) => {
  const [current, setCurrent] = useState(0);

  const isFirst = current === 0;
  const isLast = current === images?.length - 1;

  const nextSlide = () => {
    if (!isLast) setCurrent((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (!isFirst) setCurrent((prev) => prev - 1);
  };

  return (
    <div className="lg:flex flex-col lg:flex-row items-center lg:items-stretch gap-4 p-6 lg:p-2 max-w-6xl bg-white rounded-3xl shadow-md w-full">
      {/* Left: Image Carousel */}
      <div className="w-full lg:w-[40%] aspect-square relative rounded-xl overflow-hidden">
        <Image
          src={images[current]}
          alt={title}
          fill
          className="object-cover object-center rounded-xl"
        />

        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          disabled={isFirst}
          className={`absolute left-3 top-1/2 -translate-y-1/2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow transition-opacity ${isFirst ? "opacity-50 cursor-not-allowed" : "opacity-100"
            }`}
        >
          <TbArrowNarrowLeft className="text-xl text-gray-800" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          disabled={isLast}
          className={`absolute right-3 top-1/2 -translate-y-1/2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow transition-opacity ${isLast ? "opacity-50 cursor-not-allowed" : "opacity-100"
            }`}
        >
          <TbArrowNarrowRight className="text-xl text-gray-800" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full ${i === current ? "bg-[#FF7403]" : "bg-white"
                }`}
            />
          ))}
        </div>
      </div>

      {/* Right: Content */}
      <div className="w-full lg:w-[60%] flex flex-col justify-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
        <ul className=" mb-4">
          {points.map((point, idx) => (
            <li key={idx} className="text-gray-600 text-sm leading-relaxed">
              • {point}
            </li>
          ))}
        </ul>
        <button className="text-[#FF7403] font-semibold text-sm hover:underline text-left">
          Learn More
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
