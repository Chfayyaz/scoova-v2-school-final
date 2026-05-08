"use client";

import Image from "next/image";
import type { HeaderCardProps } from "../data";
import HeaderCard from "./HeaderCard";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

type SchoolHeroCardProps = {
  data: HeaderCardProps;
  /** Mongo school id from auth; used for edit route */
  editSchoolId: string | null;
};

export default function SchoolHeroCard({ data, editSchoolId }: SchoolHeroCardProps) {
  const router = useRouter();

  const handleSchoolEdit = () => {
    if (!editSchoolId) return;
    router.push(`/my-school/edit/${encodeURIComponent(editSchoolId)}`);
  };

  return (
    <div className="sm:px-6">
      <div
        className="relative h-72 sm:mt-10 rounded-lg bg-none sm:bg-[url('/images/Image(2).png')] sm:bg-cover sm:bg-center"
      >
        <HeaderCard data={data} />
      </div>
      <div className="flex justify-end mt-4 pb-4 sm:pb-0 sm:mt-5">
        <Button
          onClick={handleSchoolEdit}
          rounded="full"
          disabled={!editSchoolId}
          className="text-sm py-3 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          title={!editSchoolId ? "School id unavailable" : undefined}
        >
          Edit School Info
        </Button>
      </div>
    </div>
  );
}
