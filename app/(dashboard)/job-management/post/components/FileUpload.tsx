"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";

type FileUploadProps = {
  label: string;
  onFileSelect: (file: File) => void;
  acceptedFile?: File | null;
  required?: boolean;
};


export const CloudUploadIcon=()=>(
  <svg width="25" height="17" viewBox="0 0 25 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.45028 16.9564C2.44127 16.9564 0 14.5152 0 11.5062C0 9.12922 1.52154 7.10808 3.64109 6.36245C3.63731 6.26026 3.63352 6.15806 3.63352 6.05587C3.63352 2.71 6.34352 0 9.68939 0C11.9339 0 13.8907 1.21874 14.9391 3.03551C15.5144 2.64944 16.2108 2.42235 16.9564 2.42235C18.9624 2.42235 20.59 4.04986 20.59 6.05587C20.59 6.51763 20.5029 6.95668 20.3477 7.36545C22.5581 7.81207 24.2235 9.76888 24.2235 12.1117C24.2235 14.7877 22.0547 16.9564 19.3788 16.9564H5.45028ZM8.44037 8.74316C8.08459 9.09895 8.08459 9.67425 8.44037 10.0263C8.79615 10.3782 9.37146 10.382 9.72346 10.0263L11.1996 8.55013V13.6257C11.1996 14.1291 11.6046 14.5341 12.108 14.5341C12.6114 14.5341 13.0163 14.1291 13.0163 13.6257V8.55013L14.4925 10.0263C14.8482 10.382 15.4235 10.382 15.7755 10.0263C16.1275 9.67047 16.1313 9.09516 15.7755 8.74316L12.7476 5.71523C12.3918 5.35945 11.8165 5.35945 11.4645 5.71523L8.43659 8.74316H8.44037Z" fill="#D1D5DB"/>
</svg>

)

export default function FileUpload({
  label,
  onFileSelect,
  acceptedFile,
  required = false,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-custom-gray/95 mb-2">
        {label}
        {required && <span className="text-custom-purple/80 ml-1">*</span>}
      </label>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed flex flex-col items-center rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-custom-teal bg-custom-teal/5"
            : "border-custom-gray/20 hover:border-custom-teal/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileSelect}
          className="hidden"
        />
        <CloudUploadIcon/>
        <p className=" text-custom-gray/60 mb-1 mt-6 text-base font-semibold">
          <span className="text-custom-purple text-base">Upload a Pdf</span> or drag and drop
        </p>
        <p className=" text-custom-gray/60 text-base">
          Pdf, Doc, up to 10MB
        </p>
        {acceptedFile && (
          <p className="text-sm text-custom-teal mt-2 font-medium">
            {acceptedFile.name}
          </p>
        )}
      </div>
    </div>
  );
}

