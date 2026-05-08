"use client";

import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AddTeamMembers, {
  type AddTeamMembersRef,
  type TeamMember,
} from "../components/AddTeamMembers";
import SchoolEditForm, { type SchoolEditFormRef } from "../components/SchoolEditForm";
import SchoolLogoUPloader, { type SchoolLogoRef } from "../components/SchoolLogo";
import UploadedGallary from "../components/UploadedGallary";
import ActionButtons from "../components/ActionButtons";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  getMySchoolApi,
  mapMySchoolToHeaderCard,
  mapMySchoolToTeamMembers,
  logoStringToProfileUpload,
  updateMySchoolApi,
  type UpdateMySchoolPayload,
  type MySchoolData,
} from "@/lib/api/myshool.api";
import Skeleton from "@/components/ui/Skeleton";

type PageState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: MySchoolData };

function mapTeamMembersToUpdatePayload(
  members: TeamMember[]
): NonNullable<UpdateMySchoolPayload["managementTeam"]> {
  return members.map((member) => ({
    _id: typeof member.id === "string" ? member.id : undefined,
    fullName: member.name.trim(),
    role: member.title.trim(),
    image: member.img,
  }));
}

function EditSchoolPageSkeleton() {
  return (
    <div className="min-h-screen" aria-busy="true" aria-label="Loading edit school page">
      <div className="px-1 sm:px-6 py-1 sm:py-6">
        <Skeleton className="h-8 sm:h-9 w-[min(100%,18rem)] rounded-md" />
        <div className="mt-2 space-y-2 max-w-2xl">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-[95%] rounded-md" />
        </div>

        {/* SchoolLogoUPloader */}
        <div className="mt-6 flex flex-col sm:flex-row bg-linear-to-r from-[#B9D4F1] via-[#B9D4F1] via-0% rounded-lg p-3 sm:p-6 to-custom-yellow/20 items-center gap-3 sm:gap-4">
          <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-full shrink-0" />
          <div className="flex-1 w-full sm:w-auto space-y-2 text-center sm:text-left">
            <Skeleton className="h-5 w-40 mx-auto sm:mx-0 rounded-md" />
            <Skeleton className="h-9 w-full sm:w-36 rounded-full mx-auto sm:mx-0" />
          </div>
        </div>

        {/* SchoolEditForm */}
        <div className="mt-6 sm:mt-8 border-b border-custom-gray/20 pb-8 sm:pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6 sm:gap-y-8 items-start">
            <div className="flex flex-col">
              <Skeleton className="h-4 w-28 mb-2 rounded-md" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="flex flex-col">
              <Skeleton className="h-4 w-24 mb-2 rounded-md" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="flex flex-col">
              <Skeleton className="h-4 w-20 mb-2 rounded-md" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="flex flex-col">
              <Skeleton className="h-4 w-28 mb-2 rounded-md" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="flex flex-col gap-6 sm:gap-8">
              <div className="flex flex-col">
                <Skeleton className="h-4 w-32 mb-2 rounded-md" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="flex flex-col">
                <Skeleton className="h-4 w-28 mb-2 rounded-md" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>
            <div className="flex flex-col">
              <Skeleton className="h-4 w-24 mb-2 rounded-md" />
              <Skeleton className="h-[156px] w-full rounded-lg" />
            </div>
          </div>
        </div>

        {/* UploadedGallary */}
        <div className="mt-4 sm:mt-10 border-b-2 border-custom-gray/10 pb-8 sm:pb-10">
          <Skeleton className="h-7 sm:h-8 w-44 rounded-md mb-4 sm:mb-6" />
          <div className="border border-dashed rounded-lg border-custom-gray/20 bg-custom-white py-12 flex flex-col items-center justify-center mb-6">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <Skeleton className="h-4 w-56 mt-4 rounded-md" />
            <Skeleton className="h-3 w-48 mt-2 rounded-md" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-full aspect-video rounded-lg" />
            ))}
          </div>
        </div>

        {/* AddTeamMembers */}
        <div className="mt-4 sm:mt-12 pb-8 sm:pb-10">
          <Skeleton className="h-7 sm:h-8 w-64 rounded-md mb-4 sm:mb-6" />
          <div className="sm:mt-6 space-y-4 sm:space-y-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 py-4 sm:py-5 px-3 sm:px-4 rounded-lg border border-custom-gray/20"
              >
                <Skeleton className="w-12 h-12 sm:w-14 sm:h-14 rounded-full shrink-0 self-center sm:self-auto" />
                <Skeleton className="h-10 flex-1 rounded-lg" />
                <Skeleton className="h-10 flex-1 rounded-lg" />
                <Skeleton className="h-9 w-9 rounded-md shrink-0 self-center sm:self-auto" />
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center lg:justify-start">
            <Skeleton className="h-10 w-full lg:w-48 rounded-full" />
          </div>
        </div>

        {/* ActionButtons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 sm:mt-8 pt-4 sm:pt-6 border-t border-custom-gray/20 pb-4 sm:pb-6">
          <Skeleton className="h-10 w-full sm:w-40 rounded-full" />
          <Skeleton className="h-10 w-full sm:w-36 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function EditSchoolDetails() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.id;
  const idParam = Array.isArray(rawId) ? rawId[0] : rawId;
  const hasId = idParam != null && String(idParam).length > 0;

  const [state, setState] = useState<PageState>({ status: "loading" });
  const [hasChanges, setHasChanges] = useState(false);
  const formRef = useRef<SchoolEditFormRef>(null);
  const logoRef = useRef<SchoolLogoRef>(null);
  const teamRef = useRef<AddTeamMembersRef>(null);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Load school once per `hasId`. Hydrate team/gallery in this `.then` only — not from `useEffect([data])` —
  // so PATCH results are never replaced by stale GET `managementTeam` / `gallery`.
  useEffect(() => {
    if (!hasId) {
      setState({ status: "error", message: "Missing school id." });
      return;
    }
    let cancelled = false;
    setState({ status: "loading" });

    getMySchoolApi()
      .then((data) => {
        if (!cancelled) {
          setState({ status: "success", data });
          setTeamMembers(mapMySchoolToTeamMembers(data));
          setGalleryUrls([...(data.gallery ?? [])]);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Failed to load school.";
          setState({ status: "error", message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [hasId]);

  useEffect(() => {
    setHasChanges(true);
  }, []);

  const school = useMemo(() => {
    if (state.status !== "success") return null;
    return mapMySchoolToHeaderCard(state.data, { editRouteId: String(idParam) });
  }, [state, idParam]);

  const initialBio = state.status === "success" ? state.data.bio : "";

  const handleGalleryChange = useCallback((next: string[]) => {
    setGalleryUrls(next);
  }, []);

  const handleTeamMembersChange = useCallback((next: TeamMember[]) => {
    setTeamMembers(next);
  }, []);

  if (!hasId) {
    return (
      <div className="px-6 py-8">
        <p className="text-custom-gray/80">School not found</p>
      </div>
    );
  }

  if (state.status === "loading") {
    return <EditSchoolPageSkeleton />;
  }

  if (state.status === "error") {
    return (
      <div className="min-h-[40vh]  flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-red-600 text-sm font-medium mb-2">Could not load school</p>
          <p className="text-custom-gray/70 text-sm">{state.message}</p>
        </div>
      </div>
    );
  }

  if (!school) {
    return null;
  }

  const handleSave = async () => {
    if (state.status !== "success") return;
    const isValid = await formRef.current?.validateForm();
    if (!isValid) return;
    const formDataResult = formRef.current?.getFormData();
    if (!formDataResult) return;

    const { formData, bio } = formDataResult;
    const foundedYear = formData.stats.find((s) => s.text === "Founded")?.year ?? state.data.foundedYear;
    const principalName = formData.stats.find((s) => s.text === "Principal")?.name ?? "";
    const schoolType = formData.types[0] ?? state.data.type;
    const logoStr = logoRef.current?.getLogo() ?? school.logo;
    const profileImage = logoStringToProfileUpload(logoStr);

    setIsSaving(true);
    try {
      const updated = await updateMySchoolApi(
        {
          name: formData.schoolname.trim(),
          type: schoolType,
          country: (formData.location.country ?? "").trim(),
          state: (formData.location.state ?? "").trim(),
          city: (formData.location.city ?? "").trim(),
          foundedYear: Number(foundedYear),
          principalName: principalName.trim(),
          bio: bio.trim(),
          websiteUrl: state.data.websiteUrl ?? "",
          managementTeam: mapTeamMembersToUpdatePayload(teamMembers),
          profileImage: profileImage ?? undefined,
        },
        state.data
      );

      setState({ status: "success", data: updated });
      setTeamMembers(mapMySchoolToTeamMembers(updated));
      setGalleryUrls([...(updated.gallery ?? [])]);
      toast.success("School updated successfully");
      router.push("/my-school");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save school.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className=" min-h-screen bg-[#F9FAFB]">
      <div className="px-1 sm:px-6 py-1 sm:py-6">
        <h2 className="font-bold text-2xl sm:text-[30px] text-[#4A4A4A]">
          Edit School Profile
        </h2>
        <p className="text-base sm:text-[18px] text-custom-gray/80 mt-2">
          Update your institution details to manage reviews, staff, and
          community engagement.
        </p>

        <SchoolLogoUPloader
          ref={logoRef}
          initialLogo={school.logo}
          schoolName={school.schoolname}
        />
        <SchoolEditForm ref={formRef} school={school} initialBio={initialBio} />
        <UploadedGallary
          key={String(idParam)}
          images={galleryUrls}
          onImagesChange={handleGalleryChange}
        />
        <AddTeamMembers
          ref={teamRef}
          members={teamMembers}
          onMembersChange={handleTeamMembersChange}
        />
        <ActionButtons
          onSave={() => void handleSave()}
          onCancel={handleCancel}
          hasChanges={hasChanges}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
}
