"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";

export type UserProfileFormData = {
  profileImage: string | null;
  name: string;
  email: string;
  phone: string;
  location: string;
};

type UserProfileSavePayload = {
  name: string;
  email: string;
  phone: string;
  location: string;
  profileImageFile?: File | null;
};

type UserProfileProps = {
  data: UserProfileFormData;
  onSave: (payload: UserProfileSavePayload) => Promise<void>;
};

export default function UserProfile({ data, onSave }: UserProfileProps) {
  const [form, setForm] = useState<UserProfileFormData>(data);
  const [pickedFile, setPickedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setForm(data);
    setPickedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }, [data]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    const preview = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, profileImage: preview }));
    setPickedFile(file);
    setPreviewUrl(preview);
    e.target.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        name: form.name,
        email: form.email,
        phone: form.phone,
        location: form.location,
        profileImageFile: pickedFile ?? undefined,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-custom-white rounded-lg border border-custom-gray/10 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-custom-gray/95 mb-5">User Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs md:text-sm font-medium text-custom-gray/95 mb-2">
            Upload image
          </label>
          <div className="flex items-center gap-4">
            <label
              htmlFor="user-profile-image-upload"
              className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-custom-gray/20 overflow-hidden bg-custom-gray/5 cursor-pointer block"
            >
              <Image
                src={form.profileImage || "/images/sara.png"}
                alt={form.name || "Profile"}
                width={96}
                height={96}
                className="w-full h-full object-cover"
                unoptimized={
                  (form.profileImage || "").startsWith("http") ||
                  (form.profileImage || "").startsWith("blob:")
                }
              />
            </label>
            <input
              id="user-profile-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-custom-gray/80 mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full border border-custom-gray/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-custom-teal"
            />
          </div>
          <div>
            <label className="block text-sm text-custom-gray/80 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="w-full border border-custom-gray/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-custom-teal"
            />
          </div>
          <div>
            <label className="block text-sm text-custom-gray/80 mb-1">Phone</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              className="w-full border border-custom-gray/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-custom-teal"
            />
          </div>
          <div>
            <label className="block text-sm text-custom-gray/80 mb-1">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
              className="w-full border border-custom-gray/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-custom-teal"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="filled"
            rounded="full"
            className="px-6 py-2 text-sm"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}

