"use client";

import { useState } from "react";

export default function ImageWithSkeleton({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse z-10" />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${!isLoaded ? "opacity-0" : "opacity-100"} relative z-20`}
        onLoad={() => setIsLoaded(true)}
      />
    </>
  );
}
