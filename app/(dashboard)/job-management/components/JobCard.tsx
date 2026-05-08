"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

/** Display shape for a job (mock data or mapped from API) */
export type JobCardJob = {
  id: string | number;
  companyName: string;
  location: string;
  jobTitle: string;
  status: string;
  description: string;
  postedDate: string;
  /** Gallery array – first image is used as the card image (job gallery or school gallery from Redux) */
  gallery?: string[];
  /** Fallback when gallery is empty; prefer passing gallery instead */
  imageUrl?: string | null;
  /** Optional API fields for richer cards */
  department?: string;
  jobType?: string;
  yearsOfExperience?: number;
  applicationDeadline?: string;
};

type JobCardProps = {
  job: JobCardJob;
};

export default function JobCard({ job }: JobCardProps) {
  const router = useRouter();

  const handleViewDetail = () => {
    router.push(`/job-management/details/${job.id}`);
  };

  const handleEditJob = () => {
    router.push(`/job-management/edit/${job.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Contract":
        return "bg-custom-green/20 text-[#15803D]";
      case "Job Expired":
        return "bg-custom-yellow/20 text-[#A16207]";
      case "open":
        return "bg-[#DCFCE7] text-[#15803D]";
      default:
        return "bg-custom-gray/10 text-custom-gray/80";
    }
  };

  return (
    <div className="bg-custom-white rounded-lg border border-custom-gray/20 px-5 py-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header – use first image from gallery array, else fallback */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-custom-gray/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
            <Image
              src={
                (Array.isArray(job.gallery) && job.gallery.length > 0 ? job.gallery[0] : null) ??
                job.imageUrl ??
                "/images/acadmey-img.png"
              }
              alt={job.companyName}
              width={40}
              height={40}
              className="object-cover"
              unoptimized={Boolean(
                (job.gallery?.[0] ?? job.imageUrl)?.startsWith("http")
              )}
            />
          </div>
          <div>
            <h3 className="text-sm font-bold text-custom-gray/95">
              {job.companyName}
            </h3>
            <p className="text-xs text-custom-gray/60">{job.location}</p>
          </div>
        </div>
        <span className="text-[10px] text-custom-gray/60">{job.postedDate}</span>
      </div>

      {/* Job Title */}
      <h2 className="text-[16px] font-bold text-custom-gray/95 mb-1">
        {job.jobTitle}
      </h2>

      {/* Status Badge */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className={`inline-block px-2.5 py-0.5 text-xs rounded-full text-[10px] font-semibold ${getStatusColor(
            job.status
          )}`}
        >
          {job.status}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-custom-gray/70 mb-4 line-clamp-2">
        {job.description}
      </p>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <Button
          variant="outlined"
          rounded="full"
          className="text-xs"
          borderColor="border-custom-teal"
          textColor="text-custom-teal"
          onClick={handleViewDetail}
        >
          View Detail
        </Button>
        <Button
          variant="filled"
          rounded="full"
          className="text-xs"
          onClick={handleEditJob}
        >
          Edit Job
        </Button>
      </div>
    </div>
  );
}

