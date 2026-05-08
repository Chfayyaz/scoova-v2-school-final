"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import * as Yup from "yup";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import TextInput from "../components/TextInput";
import SelectInput from "../components/SelectInput";
import DateInput from "../components/DateInput";
import TextArea from "../components/TextArea";
import FileUpload from "../components/FileUpload";
import { departments, jobTypes, yearsOfExperience } from "../data";
import { useAppSelector } from "@/redux";
import { createJobApi } from "@/lib/api/job.api";

const postJobSchema = Yup.object({
  jobTitle: Yup.string().required("Job title is required"),
  department: Yup.string().required("Department is required"),
  jobType: Yup.string().required("Job type is required"),
  yearsOfExperience: Yup.string().required("Years of experience is required"),
  applicationDeadline: Yup.string().required("Application deadline is required"),
  salaryBenefit: Yup.string()
    .required("Salary/benefit is required")
    .test("is-number", "Must be a valid number", (val) => val !== "" && !isNaN(Number(val)) && Number(val) >= 0),
  startDate: Yup.string().required("Start date is required"),
  requirements: Yup.string().required("Requirements are required"),
  aboutTheRole: Yup.string().required("About the role is required"),
  responsibilities: Yup.string().required("Responsibilities are required"),
});

function parseLines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** API expects: full-time, part-time, contract, internship, temporary */
function toApiJobType(displayValue: string): string {
  return displayValue.toLowerCase().replace(/\s+/g, "-");
}

/** Form has "3-5 years" etc.; API expects a number (e.g. 3). Use first number in range. */
function toApiYearsOfExperience(displayValue: string): number {
  const num = parseInt(displayValue, 10);
  return Number.isNaN(num) ? 0 : num;
}

export default function PostJobPage() {
  const router = useRouter();
  const params = useParams();
  const user = useAppSelector((state) => state.auth?.user ?? null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: "",
    department: "",
    jobType: "",
    yearsOfExperience: "",
    applicationDeadline: "",
    salaryBenefit: "",
    startDate: "",
    requirements: "",
    aboutTheRole: "",
    responsibilities: "",
  });
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePublish = () => {
    postJobSchema
      .validate(formData, { abortEarly: false })
      .then(async () => {
        setErrors({});
        const schoolId = (params?.id as string) ?? user?.school ?? "";
        if (!schoolId) {
          toast.error("School context is missing. Please try again.");
          return;
        }
        const payload = {
          school: schoolId,
          title: formData.jobTitle.trim(),
          department: formData.department.trim(),
          jobType: toApiJobType(formData.jobType),
          yearsOfExperience: toApiYearsOfExperience(formData.yearsOfExperience),
          applicationDeadline: formData.applicationDeadline.trim().slice(0, 10),
          salary: Number(formData.salaryBenefit) || 0,
          startDate: formData.startDate.trim().slice(0, 10),
          requirements: parseLines(formData.requirements),
          aboutRole: formData.aboutTheRole.trim(),
          responsibilities: parseLines(formData.responsibilities),
          documents: [],
        };
        setLoading(true);
        try {
          await createJobApi(payload, attachedFile);
          toast.success("Job posted successfully!");
          router.push("/job-management");
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Failed to create job.", {
            style: { background: "#ef4444", color: "#fff" },
          });
        } finally {
          setLoading(false);
        }
      })
      .catch((err: Yup.ValidationError) => {
        const next: Record<string, string> = {};
        err.inner.forEach((e) => {
          if (e.path) next[e.path] = e.message;
        });
        setErrors(next);
      });
  };

  return (
    <div className="min-h-screen md:p-6">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-custom-gray/95 mb-2 text-left">
            Create New Job Posting
          </h1>
          <p className="text-base text-custom-gray/80 text-left">
            Fill out the details below to post a new job opening.
          </p>
        </div>

        {/* Form */}
        <div className="border border-custom-gray/20 p-6 mt-6 rounded-lg">
          <form onSubmit={(e) => e.preventDefault()}>
            <TextInput
              label="Job Title"
              placeholder="e.g., Senior Product Designer"
              value={formData.jobTitle}
              onChange={(value) =>
                setFormData({ ...formData, jobTitle: value })
              }
              error={errors.jobTitle}
            />

            <SelectInput
              label="Department"
              value={formData.department}
              onChange={(value) =>
                setFormData({ ...formData, department: value })
              }
              options={departments}
              placeholder="Select department"
              error={errors.department}
            />

            <SelectInput
              label="Job Type"
              value={formData.jobType}
              onChange={(value) =>
                setFormData({ ...formData, jobType: value })
              }
              options={jobTypes}
              placeholder="Select job type"
              error={errors.jobType}
            />

            <SelectInput
              label="Years of Experience"
              value={formData.yearsOfExperience}
              onChange={(value) =>
                setFormData({ ...formData, yearsOfExperience: value })
              }
              options={yearsOfExperience}
              placeholder="Select years"
              error={errors.yearsOfExperience}
            />

            <DateInput
              label="Application Deadline"
              value={formData.applicationDeadline}
              onChange={(value) =>
                setFormData({ ...formData, applicationDeadline: value })
              }
              error={errors.applicationDeadline}
            />

            <TextInput
              label="Salary/Benefit"
              placeholder="e.g., 50000"
              type="number"
              value={String(formData.salaryBenefit)}
              onChange={(value) =>
                setFormData({ ...formData, salaryBenefit: value })
              }
              error={errors.salaryBenefit}
            />

            <DateInput
              label="Start Date"
              value={formData.startDate}
              onChange={(value) =>
                setFormData({ ...formData, startDate: value })
              }
              error={errors.startDate}
            />

            <TextArea
              label="Requirements"
              placeholder="List key qualifications and skills. - 5+ years of experience in... - Proficiency in Figma, Sketch... - Strong communication skills..."
              value={formData.requirements}
              onChange={(value) =>
                setFormData({ ...formData, requirements: value })
              }
              rows={6}
              error={errors.requirements}
            />

            <FileUpload
              label="Attach Pdf or Doc."
              onFileSelect={(file) => setAttachedFile(file)}
              acceptedFile={attachedFile}
            />

            <TextArea
              label="About the Role"
              placeholder="List key qualifications and skills. - 5+ years of experience in... - Proficiency in Figma, Sketch... - Strong communication skills..."
              value={formData.aboutTheRole}
              onChange={(value) =>
                setFormData({ ...formData, aboutTheRole: value })
              }
              rows={6}
              error={errors.aboutTheRole}
            />

            <TextArea
              label="Responsibilities"
              placeholder="List key qualifications and skills. - 5+ years of experience in... - Proficiency in Figma, Sketch... - Strong communication skills..."
              value={formData.responsibilities}
              onChange={(value) =>
                setFormData({ ...formData, responsibilities: value })
              }
              rows={6}
              error={errors.responsibilities}
            />

            {/* Publish Button */}
            <div className="flex justify-end mt-8">
              <Button
                type="button"
                variant="filled"
                rounded="full"
                onClick={handlePublish}
                disabled={loading}
                className="px-6 text-sm py-3 w-full sm:w-auto "
              >
                {loading ? "Publishing..." : "Publish Job"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

