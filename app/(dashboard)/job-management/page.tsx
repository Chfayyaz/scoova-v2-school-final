"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import SearchBar from "./components/SearchBar";
import StatusFilter from "./components/StatusFilter";
import type { JobTypeOption } from "./components/StatusFilter";
import JobCard from "./components/JobCard";
import type { JobCardJob } from "./components/JobCard";
import Pagination from "@/app/utils/Pagination";
import { useAppSelector } from "@/redux";
import { getMyJobsApi, type MyJobsJob } from "@/lib/api/job.api";
import Skeleton from "@/components/ui/Skeleton";

/** Format ISO deadline to a short date string */
function formatDeadline(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}

/** Map API job to card display shape; school name, location, and gallery from Redux */
function mapMyJobToCard(
  job: MyJobsJob,
  schoolName: string,
  schoolLocation: string,
  schoolGallery: string[]
): JobCardJob {
  const created = job.createdAt ? new Date(job.createdAt) : new Date();
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  const postedDate =
    diffDays === 0 ? "Posted today" : diffDays === 1 ? "Posted 1 day ago" : `Posted ${diffDays} days ago`;

  /** Use job's gallery if present, otherwise school gallery from Redux (login) */
  const gallery =
    Array.isArray(job.gallery) && job.gallery.length > 0
      ? job.gallery
      : schoolGallery.length > 0
        ? schoolGallery
        : [];

  return {
    id: job.id,
    companyName: schoolName || "School",
    location: schoolLocation,
    jobTitle: job.title,
    status: job.status ?? "open",
    description: job.aboutRole?.slice(0, 120) ?? "",
    postedDate,
    gallery,
    department: job.department,
    jobType: job.jobType,
    yearsOfExperience: job.yearsOfExperience,
    applicationDeadline: job.applicationDeadline ? formatDeadline(job.applicationDeadline) : undefined,
  };
}

export default function JobManagementPage() {
  const router = useRouter();
  /** School info from Redux (set at login from data.schoolDetails) */
  const schoolDetails = useAppSelector((state) => state.auth?.user?.schoolDetails);
  const schoolName = schoolDetails?.name ?? "";
  const schoolLocation = schoolDetails?.location ?? "";
  /** School gallery from Redux (login) – used for card image when job has no gallery */
  const schoolGallery = Array.isArray(schoolDetails?.gallery) ? schoolDetails.gallery : [];

  const [jobs, setJobs] = useState<MyJobsJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJobTypeId, setSelectedJobTypeId] = useState("");
  const [page, setPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [allJobTypeOptions, setAllJobTypeOptions] = useState<JobTypeOption[]>([]);
  const pageSize = 10;

  useEffect(() => {
    const fromJobs = [
      ...new Set(jobs.map((j) => j.jobType).filter(Boolean)),
    ].map((t) => ({ id: t, name: t }));
    setAllJobTypeOptions((prev) => {
      const merged = [...prev];
      fromJobs.forEach((opt) => {
        if (!merged.some((m) => m.id === opt.id)) merged.push(opt);
      });
      return merged;
    });
  }, [jobs]);

  /** Status Filter dropdown: always show all known job types (Contract, Full-time, etc.), not just from current filtered list */
  const jobTypes = allJobTypeOptions.length > 0
    ? allJobTypeOptions
    : [...new Set(jobs.map((j) => j.jobType).filter(Boolean))].map((t) => ({
        id: t,
        name: t,
      }));

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getMyJobsApi({
      search: searchQuery || undefined,
      jobTypeId: selectedJobTypeId || undefined,
      page,
      limit: pageSize,
    })
      .then(({ jobs: list, pagination }) => {
        if (!cancelled) {
          console.log("jobs", list);
          setJobs(list);
          setTotalJobs(pagination?.totalJobs ?? list.length);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load jobs.");
          setJobs([]);
          setTotalJobs(0);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [searchQuery, selectedJobTypeId, page, pageSize]);

  const cardJobs: JobCardJob[] = useMemo(() => {
    const list = selectedJobTypeId
      ? jobs.filter((job) => job.jobType === selectedJobTypeId)
      : jobs;
    return list.map((job) =>
      mapMyJobToCard(job, schoolName, schoolLocation, schoolGallery)
    );
  }, [jobs, selectedJobTypeId, schoolName, schoolLocation, schoolGallery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleFilterChange = (jobTypeId: string) => {
    setSelectedJobTypeId(jobTypeId);
    setPage(1);
  };

  return (
    <div className="min-h-screen  md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#4A4A4A] mb-2">
              Job Management
            </h1>
            <p className="text-base text-custom-gray/80">
              Post new opportunities, manage applications, and hire the best
              talent.
            </p>
            {/* School info from Redux – name and location only */}
            {(schoolName || schoolLocation) && (
              <p className="text-sm text-custom-gray/60 mt-1">
                {[schoolName, schoolLocation].filter(Boolean).join(" • ")}
              </p>
            )}
          </div>
          <Button
            variant="filled"
            rounded="full"
            className="flex items-center gap-2 whitespace-nowrap"
            onClick={() => router.push("/job-management/post/new")}
          >
            <Plus size={18} />
            Post a New Job
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="border border-custom-gray/20 rounded-xl px-3 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <SearchBar onSearch={handleSearch} />
            <StatusFilter
              options={jobTypes}
              value={selectedJobTypeId}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-12">
              <div className="flex flex-col items-center justify-center gap-3 mb-8">
                <Skeleton className="h-4 w-28 rounded-md" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-custom-gray/10 bg-custom-white p-4"
                  >
                    <Skeleton className="h-36 w-full rounded-lg" />
                    <div className="mt-4 space-y-3">
                      <Skeleton className="h-4 w-3/4 rounded-md" />
                      <Skeleton className="h-3 w-1/2 rounded-md" />
                      <Skeleton className="h-3 w-full rounded-md" />
                      <Skeleton className="h-3 w-5/6 rounded-md" />
                      <div className="flex gap-2 pt-2">
                        <Skeleton className="h-7 w-20 rounded-full" />
                        <Skeleton className="h-7 w-24 rounded-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {/* Job Cards Grid – use gallery image when provided */}
          {!loading && !error && cardJobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-custom-gray/80">No jobs found</p>
            </div>
          )}

          {!loading && !error && cardJobs.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cardJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>

              <div className="mt-10">
                <Pagination
                  totalRecords={totalJobs}
                  pageSize={pageSize}
                  currentPage={page}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
