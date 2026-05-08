"use client";

import Image from "next/image";

type CampusGallaryProps = {
  images: string[];
};

export default function CampusGallary({ images }: CampusGallaryProps) {
  if (images.length === 0) {
    return (
      <div className="mt-5 sm:px-5">
        <h2 className="font-semibold text-custom-gray/95 text-xl md:text-[24px]">Campus Gallery</h2>
        <p className="text-sm text-custom-gray/70 mt-2">No gallery images yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-5 sm:px-5">
      <div>
        <h2 className="font-semibold text-custom-gray/95 text-xl md:text-[24px]">Campus Gallery</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mt-2.5 md:mt-4">
        {images.map((src, index) => (
          <Image
            key={`${src}-${index}`}
            src={src}
            width={300}
            height={300}
            alt=""
            className="rounded-lg object-cover aspect-square w-full h-auto"
          />
        ))}
      </div>
    </div>
  );
}
