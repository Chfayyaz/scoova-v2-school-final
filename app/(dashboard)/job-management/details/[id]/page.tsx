"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus, FileText, Pencil } from "lucide-react";
import Button from "@/components/ui/Button";
import { getJobByIdApi, getDocumentFileName, getDocumentUrl, type JobDetailsData } from "@/lib/api/job.api";

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === "string" ? params.id : null;

  const [job, setJob] = useState<JobDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Invalid job id.");
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getJobByIdApi(id)
      .then((data) => {
        if (!cancelled) setJob(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load job details.");
          setJob(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-custom-white md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-custom-gray/20 rounded w-1/3" />
            <div className="h-4 bg-custom-gray/20 rounded w-full" />
            <div className="h-4 bg-custom-gray/20 rounded w-5/6" />
            <div className="h-32 bg-custom-gray/20 rounded" />
            <div className="h-32 bg-custom-gray/20 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-custom-white md:p-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-custom-gray/80">{error ?? "Job not found."}</p>
          <Button
            variant="outlined"
            rounded="full"
            className="mt-4"
            borderColor="border-custom-teal"
            textColor="text-custom-teal"
            onClick={() => router.push("/job-management")}
          >
            Back to Job Management
          </Button>
        </div>
      </div>
    );
  }

  const responsibilitiesText =
    Array.isArray(job.responsibilities) && job.responsibilities.length > 0
      ? job.responsibilities.join(" ")
      : "";
  const requirementsList = Array.isArray(job.requirements) ? job.requirements : [];
  const documentsList = Array.isArray(job.documents) ? job.documents : [];

  return (
    <div className="min-h-screen  md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Job Management Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-custom-gray/95 mb-2">
              Job Management
            </h1>
            <p className="text-base text-custom-gray/80">
              Post new opportunities, manage applications, and hire the best
              talent.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outlined"
              rounded="full"
              borderColor="border-custom-teal"
              textColor="text-custom-teal"
              className="flex items-center gap-2 whitespace-nowrap"
              onClick={() => router.push(`/job-management/edit/${id}`)}
            >
              <Pencil size={18} />
              Edit Job
            </Button>
            <Button
              variant="filled"
              rounded="full"
              bgColor="bg-custom-teal"
              hoverBgColor="hover:bg-custom-green"
              textColor="text-custom-white"
              className="flex items-center gap-2 whitespace-nowrap"
              onClick={() => router.push("/job-management/post/new")}
            >
              <Plus size={18} />
              Post a New Job
            </Button>
          </div>
        </div>

        {/* Job Detail Card */}
        <div className="border border-custom-gray/10 rounded-lg bg-custom-white  overflow-hidden">
          <div className="p-4 sm:p-6">
            {/* View Job Detail header row */}
            <div className="mb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                <span className="text-base font-medium text-custom-gray/95">
                  View Job Detail
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium font-semibold ${
                  job.status === "open" ? "bg-custom-green/20 text-[#15803D]" :
                  job.status === "closed" ? "bg-custom-gray/20 text-custom-gray/70" :
                  "bg-custom-yellow/20 text-[#A16207]"
                }`}>
                  {job.status ? job.status.charAt(0).toUpperCase() + job.status.slice(1) : "—"}
                </span>
              </div>
              <h1 className="text-lg sm:text-[20px] font-bold text-custom-gray/95">
                {job.title}
              </h1>
              {job.createdBy && (
                <p className="text-sm text-custom-gray/60 mt-1">
                  Posted by {job.createdBy.name}
                </p>
              )}
            </div>

            {/* Job Details: Department, Type, Experience, Deadline, Salary, Start Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {job.department && (
                <div className="rounded-lg border border-custom-gray/20 bg-transparent p-4">
                  <p className="text-xs font-medium text-custom-gray/60 uppercase tracking-wide mb-1">Department</p>
                  <p className="text-base font-medium text-custom-gray/95">{job.department}</p>
                </div>
              )}
              {job.jobType && (
                <div className="rounded-lg border border-custom-gray/20 bg-transparent p-4">
                  <p className="text-xs font-medium text-custom-gray/60 uppercase tracking-wide mb-1">Job Type</p>
                  <p className="text-base font-medium text-custom-gray/95">
                    {job.jobType.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </p>
                </div>
              )}
              {job.yearsOfExperience != null && (
                <div className="rounded-lg border border-custom-gray/20 bg-transparent p-4">
                  <p className="text-xs font-medium text-custom-gray/60 uppercase tracking-wide mb-1">Experience</p>
                  <p className="text-base font-medium text-custom-gray/95">
                    {job.yearsOfExperience} {job.yearsOfExperience === 1 ? "year" : "years"}
                  </p>
                </div>
              )}
              {job.applicationDeadline && (
                <div className="rounded-lg border border-custom-gray/20 bg-transparent p-4">
                  <p className="text-xs font-medium text-custom-gray/60 uppercase tracking-wide mb-1">Application Deadline</p>
                  <p className="text-base font-medium text-custom-gray/95">
                    {new Date(job.applicationDeadline).toLocaleDateString()}
                  </p>
                </div>
              )}
              {(job.salary != null || job.salaryBenefit != null) && (
                <div className="rounded-lg border border-custom-gray/20 bg-transparent p-4">
                  <p className="text-xs font-medium text-custom-gray/60 uppercase tracking-wide mb-1">Salary/Benefit</p>
                  <p className="text-base font-medium text-custom-gray/95">
                    {(() => {
                      const val = job.salary ?? job.salaryBenefit;
                      return typeof val === "number" ? val.toLocaleString() : val;
                    })()}
                  </p>
                </div>
              )}
              {job.startDate && (
                <div className="rounded-lg border border-custom-gray/20 bg-transparent p-4">
                  <p className="text-xs font-medium text-custom-gray/60 uppercase tracking-wide mb-1">Start Date</p>
                  <p className="text-base font-medium text-custom-gray/95">
                    {new Date(job.startDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            {/* About the Role */}
            <div className="rounded-lg border border-custom-gray/20 bg-custom-white shadow-sm p-4 sm:p-5 mb-6">
              <h2 className="text-2xl font-bold text-custom-gray/95 mb-2">
                About the Role
              </h2>
              <p className="text-base text-custom-gray/80 leading-relaxed">
                {job.aboutRole ?? "—"}
              </p>
            </div>

            {/* Responsibilities */}
            <div className="rounded-lg border border-custom-gray/20 bg-custom-white shadow-sm p-4 sm:p-5 mb-6">
              <h2 className="text-2xl font-bold text-custom-gray/95 mb-2">
                Responsibilities
              </h2>
              <p className="text-base text-custom-gray/80 leading-relaxed">
                {responsibilitiesText || "—"}
              </p>
            </div>

            {/* Requirements */}
            <div className="rounded-lg border border-custom-gray/20 bg-custom-white shadow-sm p-4 sm:p-5 mb-6">
              <h2 className="text-2xl font-bold text-custom-gray/95 mb-2">
                Requirements
              </h2>
              <ul className="list-none pl-0 text-base text-custom-gray/80 leading-relaxed space-y-1">
                {requirementsList.length > 0 ? (
                  requirementsList.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span
                        className="flex-shrink-0 w-1 h-1 rounded-full bg-custom-gray/60"
                        aria-hidden
                      />
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="flex items-center gap-2">
                    <span
                      className="flex-shrink-0 w-1 h-1 rounded-full bg-custom-gray/60"
                      aria-hidden
                    />
                    <span>—</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Document Attachment(s) – click to open in new tab */}
            {documentsList.length > 0 ? (
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-custom-gray/95 mb-2">
                  Attached Documents
                </h2>
                {documentsList.map((doc, index) => {
                  const url = getDocumentUrl(doc);
                  const fileName = getDocumentFileName(doc);
                  return (
                    <a
                      key={index}
                      href={
                        url.startsWith("http") ? url : url ? `https://${url}` : "#"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 p-4 rounded-lg border border-custom-gray/10 bg-custom-white hover:border-custom-teal/50 hover:shadow-sm transition-all cursor-pointer w-fit"
                    >
                      <div className="flex flex-col items-center justify-center w-14 h-14 rounded bg-red-100 text-red-600">
                        <FileText size={24} />
                        <span className="text-[10px] font-medium mt-0.5">
                          {fileName.endsWith(".pdf") ? "PDF" : fileName.endsWith(".doc") || fileName.endsWith(".docx") ? "DOC" : "FILE"}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-custom-gray/95 truncate max-w-[200px]" title={fileName}>
                        {fileName}
                      </span>
                    </a>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
