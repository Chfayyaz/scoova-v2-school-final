"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import * as Yup from "yup";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import EditableSection from "../components/EditableSection";
import EditableListSection from "../components/EditableListSection";
import EditableField from "../components/EditableField";
import FileAttachment from "../components/FileAttachment";
import {
  getJobByIdApi,
  updateJobApi,
  removeJobDocumentApi,
  getDocumentFileName,
  getDocumentUrl,
  type JobDetailsData,
} from "@/lib/api/job.api";
import Skeleton from "@/components/ui/Skeleton";

function JobEditPageSkeleton() {
  return (
    <div className="min-h-screen md:p-6" aria-busy="true" aria-label="Loading job editor">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="space-y-2">
            <Skeleton className="h-8 sm:h-9 w-56 max-w-full rounded-lg" />
            <Skeleton className="h-4 w-full max-w-md rounded-md" />
            <Skeleton className="h-4 w-full max-w-sm rounded-md sm:hidden" />
          </div>
          <Skeleton className="h-12 w-full sm:w-44 rounded-full shrink-0" />
        </div>

        <div className="border border-custom-gray/10 rounded-lg p-4">
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <Skeleton className="h-5 w-36 rounded-md" />
              <Skeleton className="h-7 w-20 rounded-full" />
            </div>
            <Skeleton className="h-7 w-full max-w-xl rounded-lg" />
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32 rounded-md" />
              <Skeleton className="min-h-[120px] w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-40 rounded-md" />
              <Skeleton className="min-h-[120px] w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-36 rounded-md" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <Skeleton className="min-h-[72px] w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-10 w-full max-w-xs rounded-lg" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <Skeleton className="h-12 w-full sm:w-36 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function toDateInputValue(value: string | undefined): string {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const d = new Date(value);
  return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

const jobEditValidationSchema = Yup.object({
  aboutRole: Yup.string().required("About the role is required"),
  responsibilities: Yup.string().required("Responsibilities are required"),
  requirements: Yup.array()
    .of(Yup.string())
    .min(1, "At least one requirement is required"),
  jobType: Yup.string().required("Job type is required"),
  salary: Yup.number().required("Salary is required").min(0, "Must be 0 or greater"),
  startDate: Yup.string().required("Start date is required"),
  applicationDeadline: Yup.string().required("Application deadline is required"),
});

export default function JobEditPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = typeof params?.id === "string" ? params.id : null;

  const [jobData, setJobData] = useState<JobDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newDocumentFile, setNewDocumentFile] = useState<File | null>(null);
  const [documentRemoved, setDocumentRemoved] = useState(false);
  const [removingDocument, setRemovingDocument] = useState(false);

  useEffect(() => {
    if (!jobId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setDocumentRemoved(false);
    setNewDocumentFile(null);

    getJobByIdApi(jobId)
      .then((data) => {
        if (!cancelled) setJobData(data);
      })
      .catch((err) => {
        if (!cancelled) {
          toast.error(err instanceof Error ? err.message : "Failed to load job.");
          setJobData(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [jobId]);

  if (loading) {
    return <JobEditPageSkeleton />;
  }

  if (!jobId || !jobData) {
    return (
      <div className="min-h-screen md:p-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-custom-gray/80">Job not found</p>
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
    Array.isArray(jobData.responsibilities) && jobData.responsibilities.length > 0
      ? jobData.responsibilities.join("\n")
      : "";
  const requirementsList = Array.isArray(jobData.requirements) ? jobData.requirements : [];
  const existingDocUrl = Array.isArray(jobData.documents) && jobData.documents.length > 0
    ? jobData.documents[0]
    : undefined;
  const displayFileName = documentRemoved
    ? undefined
    : (newDocumentFile?.name ?? (existingDocUrl ? getDocumentFileName(existingDocUrl) : undefined));

  const handleSave = async () => {
    try {
      await jobEditValidationSchema.validate(
        {
          aboutRole: jobData.aboutRole ?? "",
          responsibilities: responsibilitiesText,
          requirements: requirementsList,
          jobType: jobData.jobType ?? "",
          salary: jobData.salary ?? 0,
          startDate: toDateInputValue(jobData.startDate),
          applicationDeadline: toDateInputValue(jobData.applicationDeadline),
        },
        { abortEarly: false }
      );
      setErrors({});

      const payload = {
        title: jobData.title,
        department: jobData.department,
        jobType: jobData.jobType,
        yearsOfExperience: jobData.yearsOfExperience,
        applicationDeadline: toDateInputValue(jobData.applicationDeadline) || jobData.applicationDeadline,
        salary: jobData.salary ?? 0,
        startDate: toDateInputValue(jobData.startDate) || jobData.startDate,
        requirements: requirementsList.filter(Boolean),
        aboutRole: jobData.aboutRole ?? "",
        responsibilities: jobData.responsibilities ?? [],
      };

      setSaving(true);
      await updateJobApi(jobId, payload, newDocumentFile);
      toast.success("Job updated successfully!");
      router.push("/job-management");
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const nextErrors: Record<string, string> = {};
        err.inner.forEach((e) => {
          if (e.path) nextErrors[e.path] = e.message;
        });
        setErrors(nextErrors);
      } else {
        toast.error(err instanceof Error ? err.message : "Failed to update job.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen md:p-6">
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
          <Button
            variant="filled"
            rounded="full"
            className="flex items-center text-sm py-3 shadow-lg gap-2 whitespace-nowrap"
            onClick={() => router.push("/job-management/post/new")}
          >
            <Plus size={18} />
            Post a New Job
          </Button>
        </div>

        {/* Job Details Header */}
        <div className="border border-custom-gray/10 rounded-lg p-4">
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[16px] font-medium text-custom-gray/95">
                Edit Job Detail
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium font-semibold ${
                jobData.status === "open" ? "bg-custom-green/20 text-[#15803D]" :
                jobData.status === "closed" ? "bg-custom-gray/20 text-custom-gray/70" :
                "bg-custom-yellow/20 text-[#A16207]"
              }`}>
                {jobData.status ? jobData.status.charAt(0).toUpperCase() + jobData.status.slice(1) : "—"}
              </span>
            </div>
            <h1 className="text-lg sm:text-[20px] font-bold text-custom-gray/95">
              {jobData.title}
            </h1>
          </div>

          {/* Editable Sections */}
          <div className="space-y-6">
            <EditableSection
              title="About the Role"
              content={jobData.aboutRole ?? ""}
              onSave={(content) =>
                setJobData({ ...jobData, aboutRole: content })
              }
              multiline
              error={errors.aboutRole}
            />

            <EditableSection
              title="Responsibilities"
              content={responsibilitiesText}
              onSave={(content) =>
                setJobData({
                  ...jobData,
                  responsibilities: content
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              multiline
              error={errors.responsibilities}
            />

            <EditableListSection
              title="Requirements"
              items={requirementsList}
              onSave={(items) => setJobData({ ...jobData, requirements: items })}
              error={errors.requirements}
            />

            <FileAttachment
              fileName={displayFileName}
              fileType={newDocumentFile?.type ?? (existingDocUrl ? "application/pdf" : undefined)}
              onReplace={(file) => {
                setNewDocumentFile(file);
                setDocumentRemoved(false);
              }}
              onFileSelect={(file) => {
                setNewDocumentFile(file);
                setDocumentRemoved(false);
              }}
              onDelete={async () => {
                if (existingDocUrl && jobId) {
                  setRemovingDocument(true);
                  try {
                    await removeJobDocumentApi(
                      jobData.id ?? jobId,
                      getDocumentUrl(existingDocUrl)
                    );
                    setJobData((prev) => (prev ? { ...prev, documents: [] } : prev));
                    setNewDocumentFile(null);
                    setDocumentRemoved(true);
                    toast.success("Document removed");
                  } catch (err) {
                    toast.error(err instanceof Error ? err.message : "Failed to remove document.");
                  } finally {
                    setRemovingDocument(false);
                  }
                  return;
                }
                setNewDocumentFile(null);
                setDocumentRemoved(true);
              }}
              disabled={removingDocument}
            />

            <EditableField
              label="Job Type"
              value={jobData.jobType ?? ""}
              onSave={(value) => setJobData({ ...jobData, jobType: value })}
              type="select"
              options={["full-time", "part-time", "contract", "internship", "temporary"]}
              showEditIcon={false}
              error={errors.jobType}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <EditableField
                label="Salary / Benefits"
                value={jobData.salary != null ? String(jobData.salary) : ""}
                onSave={(value) =>
                  setJobData({ ...jobData, salary: Number(value) || 0 })
                }
                error={errors.salary}
              />

              <EditableField
                label="Start Date"
                value={toDateInputValue(jobData.startDate)}
                onSave={(value) => setJobData({ ...jobData, startDate: value })}
                type="date"
                error={errors.startDate}
              />

              <EditableField
                label="Application Deadline"
                value={toDateInputValue(jobData.applicationDeadline)}
                onSave={(value) =>
                  setJobData({ ...jobData, applicationDeadline: value })
                }
                type="date"
                error={errors.applicationDeadline}
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-8">
            <Button
              variant="filled"
              rounded="full"
              onClick={handleSave}
              disabled={saving}
              className="w-full text-sm py-3 sm:w-auto px-6"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
