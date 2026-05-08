"use client";

import Image from "next/image";
import { useState, type ChangeEvent } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { CloudUploadIcon } from "@/app/(dashboard)/job-management/post/components/FileUpload";
import Button from "@/components/ui/Button";
import {
  addMySchoolGalleryImages,
  removeMySchoolGalleryImage,
} from "@/lib/api/myshool.api";

export type UploadedGalleryProps = {
  images: string[];
  onImagesChange: (gallery: string[]) => void;
};

export default function UploadedGallery({ images, onImagesChange }: UploadedGalleryProps) {
  const [uploading, setUploading] = useState(false);
  const [removingUrl, setRemovingUrl] = useState<string | null>(null);

  const galleryBusy = uploading || removingUrl !== null;

  const runUpload = async (files: FileList | null) => {
    if (!files?.length || galleryBusy) return;

    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) {
      toast.error("Please select at least one image file.");
      return;
    }

    setUploading(true);
    try {
      const { gallery, message } = await addMySchoolGalleryImages(list);
      onImagesChange(gallery);
      toast.success(message);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    void runUpload(e.target.files);
    e.target.value = "";
  };

  const handleRemove = async (imageUrl: string) => {
    if (galleryBusy) return;
    setRemovingUrl(imageUrl);
    try {
      const { gallery, message } = await removeMySchoolGalleryImage(imageUrl);
      onImagesChange(gallery);
      toast.success(message);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Remove failed.");
    } finally {
      setRemovingUrl(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) {
      void runUpload(e.dataTransfer.files);
    }
  };

  return (
    <div className="mt-4 sm:mt-10 border-b-2 border-custom-gray/10 pb-8 sm:pb-10">
      <h2 className="text-xl sm:text-2xl font-bold text-custom-gray/95 mb-4 sm:mb-6">
        School Gallery
      </h2>

      <input
        type="file"
        id="gallery-upload"
        accept="image/*"
        multiple
        className="hidden"
        disabled={galleryBusy}
        onChange={handleFileChange}
      />

      <label
        htmlFor="gallery-upload"
        onDragOver={handleDragOver}
        onDrop={galleryBusy ? undefined : handleDrop}
        className={`block text-center border border-dashed rounded-lg border-custom-gray/20 bg-custom-white py-12 flex flex-col items-center justify-center mb-6 transition-colors ${
          galleryBusy
            ? "cursor-not-allowed opacity-60 pointer-events-none"
            : "cursor-pointer hover:border-custom-teal/50"
        }`}
      >
        <CloudUploadIcon />
        <p className="text-base mb-1 mt-4">
          <span className="font-semibold text-custom-teal">Upload a file</span>
          <span className="text-custom-gray/80"> or drag and drop</span>
        </p>
        <p className="text-sm text-custom-gray/60">PNG, JPG, GIF, up to 10MB</p>
        {uploading && (
          <p className="text-sm text-custom-teal mt-3 font-medium">Uploading…</p>
        )}
      </label>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {images.map((img) => (
            <div
              key={img}
              className="relative w-full aspect-video rounded-lg overflow-hidden border border-custom-gray/10"
            >
              <Image
                src={img}
                width={200}
                height={150}
                alt="Gallery"
                className="w-full h-full object-cover"
              />
              <Button
                type="button"
                onClick={() => void handleRemove(img)}
                disabled={galleryBusy}
                variant="filled"
                rounded="full"
                bgColor="bg-custom-gray/80"
                hoverBgColor="hover:bg-custom-gray"
                textColor="text-custom-white"
                className="absolute top-2 right-2 p-1.5 w-auto h-auto disabled:opacity-50"
              >
                {removingUrl === img ? (
                  <span className="text-[10px] px-0.5">…</span>
                ) : (
                  <X size={14} />
                )}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
