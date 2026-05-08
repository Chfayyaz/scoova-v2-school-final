"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import type { SchoolProfileData } from "../data";

export type SchoolProfileSavePayload = {
  schoolName: string;
  /** New image to upload, or `null` if keeping the current remote URL */
  profileImageFile: File | null;
};

type SchoolProfileProps = {
  data: SchoolProfileData;
  onSave: (payload: SchoolProfileSavePayload) => Promise<void>;
};


const GallaryIcon=()=>(
  <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21.5 9.83333H21.5167M17.3333 31.5H6.5C5.17392 31.5 3.90215 30.9732 2.96447 30.0355C2.02678 29.0979 1.5 27.8261 1.5 26.5V6.5C1.5 5.17392 2.02678 3.90215 2.96447 2.96447C3.90215 2.02678 5.17392 1.5 6.5 1.5H26.5C27.8261 1.5 29.0979 2.02678 30.0355 2.96447C30.9732 3.90215 31.5 5.17392 31.5 6.5V17.3333" stroke="#666666" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1.5 23.1664L9.83333 14.833C11.38 13.3447 13.2867 13.3447 14.8333 14.833L20.6667 20.6664" stroke="#666666" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M19.832 19.8338L21.4987 18.1671C22.6304 17.0788 23.9537 16.7855 25.1887 17.2905M28.1654 33.1671V23.1671M28.1654 23.1671L33.1654 28.1671M28.1654 23.1671L23.1654 28.1671" stroke="#666666" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

)

export default function SchoolProfile({
  data: initialData,
  onSave,
}: SchoolProfileProps) {
  const [data, setData] = useState<SchoolProfileData>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData.imageUrl
  );
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  useEffect(() => {
    setData(initialData);
    setImagePreview(initialData.imageUrl);
    setProfileImageFile(null);
  }, [initialData.schoolName, initialData.imageUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setProfileImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave({
        schoolName: data.schoolName.trim(),
        profileImageFile,
      });
    } catch (error) {
      console.error("Error saving school profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-custom-white rounded-lg border border-custom-gray/10 shadow-sm p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h2 className="text-base md:text-lg font-semibold text-custom-gray/95 mb-1">
          General Settings
        </h2>
        <p className="text-xs md:text-sm text-custom-gray/80">Update School profile</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        {/* Upload Image Section */}
        <div>
          <label className="block text-xs md:text-sm font-medium text-custom-gray/95 mb-2">
            Upload image
          </label>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-custom-gray/20 flex items-center justify-center bg-custom-gray/5 overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="School"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    
                    <GallaryIcon/>
                  </div>
                )}
              </div>
              <label
                htmlFor="image-upload"
                className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/0 group-hover:bg-black/5 transition-colors rounded-full"
              >
                {!imagePreview && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center">
                  
                  </div>
                )}
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* School Name Input */}
        <div>
          <label
            htmlFor="school-name"
            className="block text-xs md:text-sm font-medium text-custom-gray/95 mb-2"
          >
            School Name
          </label>
          <input
            id="school-name"
            type="text"
            value={data.schoolName}
            onChange={(e) =>
              setData((prev) => ({ ...prev, schoolName: e.target.value }))
            }
            placeholder="e.g., Greenwood Academy"
            className="w-full px-3 md:px-4 py-2 md:py-2.5 border border-custom-gray/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-teal/20 focus:border-custom-teal text-sm text-custom-gray/95"
          />
        </div>

        {/* Save Changes Button */}
        <div className="flex justify-end pt-2 md:pt-4">
          <Button
            type="submit"
            variant="filled"
            rounded="full"
            disabled={isLoading}
            className="px-5 md:px-6 py-2 md:py-2.5 text-sm w-full sm:w-auto"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}

