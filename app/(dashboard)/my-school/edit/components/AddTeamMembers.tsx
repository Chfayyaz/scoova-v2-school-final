"use client";

import { useState, forwardRef, useImperativeHandle, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import {
  addMySchoolManagementTeamMembers,
  mapManagementTeamToEditMembers,
  removeMySchoolManagementTeamMembers,
} from "@/lib/api/myshool.api";

export type TeamMember = {
  id: string | number;
  name: string;
  title: string;
  img: string;
};

export type AddTeamMembersRef = {
  getTeamMembers: () => TeamMember[];
};

type AddTeamMembersProps = {
  members: TeamMember[];
  onMembersChange: (next: TeamMember[]) => void;
};

export const DeletIcon = () => (
  <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5.11721 0.669931C5.3216 0.257375 5.74172 0 6.1997 0H10.7567C11.2147 0 11.6348 0.257375 11.8392 0.669931L12.1117 1.21117H15.7453C16.4152 1.21117 16.9564 1.75242 16.9564 2.42235C16.9564 3.09228 16.4152 3.63352 15.7453 3.63352H1.21117C0.541243 3.63352 0 3.09228 0 2.42235C0 1.75242 0.541243 1.21117 1.21117 1.21117H4.8447L5.11721 0.669931ZM1.21117 4.8447H15.7453V16.9564C15.7453 18.2925 14.659 19.3788 13.3229 19.3788H3.63352C2.29745 19.3788 1.21117 18.2925 1.21117 16.9564V4.8447ZM4.8447 7.26705C4.51162 7.26705 4.23911 7.53956 4.23911 7.87263V16.3509C4.23911 16.6839 4.51162 16.9564 4.8447 16.9564C5.17777 16.9564 5.45028 16.6839 5.45028 16.3509V7.87263C5.45028 7.53956 5.17777 7.26705 4.8447 7.26705ZM8.47822 7.26705C8.14515 7.26705 7.87263 7.53956 7.87263 7.87263V16.3509C7.87263 16.6839 8.14515 16.9564 8.47822 16.9564C8.81129 16.9564 9.08381 16.6839 9.08381 16.3509V7.87263C9.08381 7.53956 8.81129 7.26705 8.47822 7.26705ZM12.1117 7.26705C11.7787 7.26705 11.5062 7.53956 11.5062 7.87263V16.3509C11.5062 16.6839 11.7787 16.9564 12.1117 16.9564C12.4448 16.9564 12.7173 16.6839 12.7173 16.3509V7.87263C12.7173 7.53956 12.4448 7.26705 12.1117 7.26705Z"
      fill="#9CA3AF"
    />
  </svg>
);

const AddTeamMembers = forwardRef<AddTeamMembersRef, AddTeamMembersProps>(
  function AddTeamMembers({ members, onMembersChange }, ref) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [removingId, setRemovingId] = useState<string | number | null>(null);
    const [isAddingMember, setIsAddingMember] = useState(false);
    const [updatingImageId, setUpdatingImageId] = useState<string | number | null>(null);

    const [newMember, setNewMember] = useState({ name: "", title: "" });
    const [newMemberImageFile, setNewMemberImageFile] = useState<File | null>(null);
    const [newMemberPreviewUrl, setNewMemberPreviewUrl] = useState<string | null>(null);

    const resetAddForm = useCallback(() => {
      setNewMember({ name: "", title: "" });
      setNewMemberImageFile(null);
      setNewMemberPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    }, []);

    useEffect(() => {
      return () => {
        if (newMemberPreviewUrl) URL.revokeObjectURL(newMemberPreviewUrl);
      };
    }, [newMemberPreviewUrl]);

    useImperativeHandle(
      ref,
      () => ({
        getTeamMembers: () => members,
      }),
      [members]
    );

    const teamBusy = isAddingMember || removingId !== null || updatingImageId !== null;

    const handleDelete = async (id: string | number) => {
      if (teamBusy) return;
      const idStr = String(id).trim();
      const member = members.find((m) => String(m.id) === idStr);
      if (!member) return;

      const snapshot = [...members];

      // Unsaved / preview-only rows have no persisted image URL — remove locally only.
      const imageUrl = member.img?.trim() ?? "";
      if (!imageUrl || imageUrl.startsWith("blob:")) {
        onMembersChange(members.filter((m) => String(m.id) !== idStr));
        return;
      }

      const optimistic = members.filter((m) => String(m.id) !== idStr);
      onMembersChange(optimistic);

      setRemovingId(id);
      try {
        const { managementTeam, message } =
          await removeMySchoolManagementTeamMembers([imageUrl]);
        onMembersChange(mapManagementTeamToEditMembers(managementTeam));
        toast.success(message);
      } catch (e) {
        onMembersChange(snapshot);
        toast.error(e instanceof Error ? e.message : "Failed to remove team member.");
      } finally {
        setRemovingId(null);
      }
    };

    const handleNameChange = (id: string | number, newName: string) => {
      onMembersChange(
        members.map((member) => (member.id === id ? { ...member, name: newName } : member))
      );
    };

    const handleTitleChange = (id: string | number, newTitle: string) => {
      onMembersChange(
        members.map((member) => (member.id === id ? { ...member, title: newTitle } : member))
      );
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        toast.error("Please choose an image file.");
        e.target.value = "";
        return;
      }
      setNewMemberImageFile(file);
      setNewMemberPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(file);
      });
      e.target.value = "";
    };

    const handleMemberImageUpload = async (
      member: TeamMember,
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file || teamBusy) return;
      if (!file.type.startsWith("image/")) {
        toast.error("Please choose an image file.");
        return;
      }

      const currentImageUrl = member.img?.trim() ?? "";
      if (!currentImageUrl || currentImageUrl.startsWith("blob:")) {
        const previewUrl = URL.createObjectURL(file);
        onMembersChange(
          members.map((m) => (m.id === member.id ? { ...m, img: previewUrl } : m))
        );
        return;
      }

      const snapshot = [...members];
      const fullName = member.name.trim();
      const role = member.title.trim();
      if (!fullName || !role) {
        toast.error("Name and designation are required before updating image.");
        return;
      }

      setUpdatingImageId(member.id);
      try {
        await addMySchoolManagementTeamMembers([{ fullName, role }], [file]);
        const { managementTeam, message } = await removeMySchoolManagementTeamMembers([currentImageUrl]);
        onMembersChange(mapManagementTeamToEditMembers(managementTeam));
        toast.success(message || "Team member image updated.");
      } catch (err) {
        onMembersChange(snapshot);
        toast.error(err instanceof Error ? err.message : "Failed to update team member image.");
      } finally {
        setUpdatingImageId(null);
      }
    };

    const handleAddMember = async () => {
      const fullName = newMember.name.trim();
      const role = newMember.title.trim();
      if (!fullName || !role) {
        toast.error("Name and designation are required.");
        return;
      }
      if (!newMemberImageFile) {
        toast.error("Please upload a photo for this team member.");
        return;
      }

      setIsAddingMember(true);
      try {
        const { managementTeam, message } = await addMySchoolManagementTeamMembers(
          [{ fullName, role }],
          [newMemberImageFile]
        );
        const mapped = mapManagementTeamToEditMembers(managementTeam);
        if (mapped.length > 0) {
          onMembersChange(mapped);
          toast.success(message);
        } else if (managementTeam.length > 0) {
          toast.error("Member was saved; refresh the page to reload the team list.");
        } else {
          toast.success(message);
        }
        setShowAddForm(false);
        resetAddForm();
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to add team member.");
      } finally {
        setIsAddingMember(false);
      }
    };

    return (
      <div className="mt-4 sm:mt-12 pb-8 sm:pb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-custom-gray/95 mb-4 sm:mb-6">
          School Management Team
        </h2>

        <div className="sm:mt-6 space-y-4 sm:space-y-6">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 py-4 sm:py-5 px-3 sm:px-4 rounded-lg border border-custom-gray/20 cursor-pointer hover:shadow-md transition-shadow"
            >
              <label className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-custom-gray/20 flex-shrink-0 self-center sm:self-auto cursor-pointer">
                <Image src={member.img} fill alt={member.name} className="object-cover" />
                <input
                  type="file"
                  accept="image/*"
                  disabled={teamBusy}
                  onChange={(e) => void handleMemberImageUpload(member, e)}
                  className="hidden"
                />
              </label>

              <input
                type="text"
                value={member.name}
                onChange={(e) => handleNameChange(member.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 bg-custom-white rounded-lg px-3 py-2 text-custom-gray/95 text-sm sm:text-base outline-none"
              />

              <input
                type="text"
                value={member.title}
                onChange={(e) => handleTitleChange(member.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 bg-custom-white rounded-lg px-3 py-2 text-custom-gray/95 text-sm sm:text-base outline-none"
              />

              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  void handleDelete(member.id);
                }}
                disabled={teamBusy}
                variant="ghosted"
                textColor="text-custom-gray/60"
                hoverTextColor="hover:text-custom-gray/90"
                className="p-2 flex-shrink-0 self-center sm:self-auto w-auto h-auto disabled:opacity-50"
              >
                {removingId === member.id || updatingImageId === member.id ? (
                  <span className="text-xs text-custom-gray/60">…</span>
                ) : (
                  <DeletIcon />
                )}
              </Button>
            </div>
          ))}
        </div>

        {showAddForm && (
          <div className="mt-6 p-4 border border-custom-gray/20 rounded-lg bg-custom-white">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-custom-gray/90 mb-2">
                  Photo <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  disabled={isAddingMember}
                  onChange={handleImageUpload}
                  className="w-full text-sm"
                />
                {newMemberPreviewUrl && (
                  <div className="relative mt-3 w-16 h-16 rounded-full overflow-hidden border border-custom-gray/20">
                    <Image
                      src={newMemberPreviewUrl}
                      alt="Preview"
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-custom-gray/90 mb-2">Name</label>
                <input
                  type="text"
                  value={newMember.name}
                  disabled={isAddingMember}
                  onChange={(e) => setNewMember((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-custom-gray/20 rounded-lg px-3 py-2 outline-none focus:border-custom-teal disabled:opacity-60"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-custom-gray/90 mb-2">
                  Designation
                </label>
                <input
                  type="text"
                  value={newMember.title}
                  disabled={isAddingMember}
                  onChange={(e) => setNewMember((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-custom-gray/20 rounded-lg px-3 py-2 outline-none focus:border-custom-teal disabled:opacity-60"
                  placeholder="Enter designation"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  onClick={() => void handleAddMember()}
                  disabled={isAddingMember}
                  rounded="full"
                  className="text-sm px-4 py-2 w-full sm:w-auto disabled:opacity-60"
                >
                  {isAddingMember ? "Adding…" : "Add"}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    resetAddForm();
                  }}
                  disabled={isAddingMember}
                  rounded="full"
                  bgColor="bg-custom-teal"
                  hoverBgColor="hover:bg-custom-teal/90"
                  className="text-sm px-4 py-2 w-full sm:w-auto disabled:opacity-60"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-center lg:justify-start">
          <Button
            type="button"
            onClick={() => setShowAddForm(true)}
            disabled={teamBusy}
            variant="filled"
            rounded="full"
            bgColor="bg-custom-purple/30"
            hoverBgColor="hover:bg-custom-purple/40"
            textColor="text-custom-purple"
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium w-full lg:w-auto disabled:opacity-60"
          >
            <Plus size={18} className="text-custom-purple" />
            <span className="text-custom-purple">Add Team Member</span>
          </Button>
        </div>
      </div>
    );
  }
);

export default AddTeamMembers;
