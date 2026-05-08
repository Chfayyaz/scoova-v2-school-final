"use client";

import { useState, useRef, forwardRef, useImperativeHandle, useEffect } from "react";
import Button from "@/components/ui/Button";
import Image from "next/image";

export type SchoolLogoRef = {
  getLogo: () => string;
};

type SchoolLogoUploaderProps = {
  initialLogo: string;
  schoolName: string;
};

const SchoolLogoUploader = forwardRef<SchoolLogoRef, SchoolLogoUploaderProps>(
  function SchoolLogoUploader({ initialLogo, schoolName }, ref) {
  const [logo, setLogo] = useState(initialLogo);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLogo(initialLogo);
  }, [initialLogo]);

  useImperativeHandle(ref, () => ({
    getLogo: () => logo,
  }), [logo]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const newLogo = reader.result as string;
          setLogo(newLogo);
          // Update local state - in real app, this would call API
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mt-6 flex flex-col sm:flex-row bg-linear-to-r from-[#B9D4F1] via-[#B9D4F1] via-0%     rounded-lg p-3 sm:p-6 to-custom-yellow/20 items-center sm:items-center gap-2 sm:gap-2">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-custom-teal/10 flex items-center  justify-center flex-shrink-0">
        <Image
          src={logo}
          width={80}
          height={80}
          alt={schoolName || "School logo"}
          className="w-full h-full object-cover "
        />
      </div>
      <div className="flex-1 w-full sm:w-auto text-center sm:text-left">
        <p className="font-semibold text-custom-gray/90 text-base text-sm mb-2">
          {schoolName}
        </p>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        <Button
          onClick={handleButtonClick}
          rounded="full"
          bgColor="bg-custom-teal"
          className="text-sm px-4 py-2 w-full sm:w-auto"
        >
          Change Image
        </Button>
      </div>
    </div>
  );
  }
);

export default SchoolLogoUploader;

