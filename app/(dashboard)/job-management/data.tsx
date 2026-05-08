// Types for job management
export type JobStatus = "Contract" | "Job Expired" | "Full-time" | "Part-time";

export type Job = {
  id: number;
  companyName: string;
  location: string;
  jobTitle: string;
  status: JobStatus;
  description: string;
  postedDate: string;
};

// Keep mock data for service layer use
export const jobsData: Job[] = [
  {
    id: 1,
    companyName: "Northwood Academy",
    location: "Tokyo, Japan",
    jobTitle: "Math Teacher - Secondary Level",
    status: "Contract",
    description:
      "We are looking for a creative Librarian to manage our library resources and promote literacy across all year",
    postedDate: "Posted 1 week ago",
  },
  {
    id: 2,
    companyName: "Northwood Academy",
    location: "Tokyo, Japan",
    jobTitle: "Math Teacher - Secondary Level",
    status: "Contract",
    description:
      "We are looking for a creative Librarian to manage our library resources and promote literacy across all year",
    postedDate: "Posted 1 week ago",
  },
  {
    id: 3,
    companyName: "Northwood Academy",
    location: "Tokyo, Japan",
    jobTitle: "Math Teacher - Secondary Level",
    status: "Contract",
    description:
      "We are looking for a creative Librarian to manage our library resources and promote literacy across all year",
    postedDate: "Posted 1 week ago",
  },
  {
    id: 4,
    companyName: "Northwood Academy",
    location: "Tokyo, Japan",
    jobTitle: "Math Teacher - Secondary Level",
    status: "Contract",
    description:
      "We are looking for a creative Librarian to manage our library resources and promote literacy across all year",
    postedDate: "Posted 1 week ago",
  },
  {
    id: 5,
    companyName: "Greenfield Int'l",
    location: "Tokyo, Japan",
    jobTitle: "IT Systems Administrator",
    status: "Contract",
    description:
      "We are looking for a creative Librarian to manage our library resources and promote literacy across all year",
    postedDate: "Posted 1 week ago",
  },
  {
    id: 6,
    companyName: "Lakeside Preparatory",
    location: "Tokyo, Japan",
    jobTitle: "Librarian & Media Specialist",
    status: "Job Expired",
    description:
      "We are looking for a creative Librarian to manage our library resources and promote literacy across all year",
    postedDate: "Posted 1 week ago",
  },
];

export const statusOptions = [
  "All Status",
  "Contract",
  "Full-time",
  "Part-time",
  "Job Expired",
];
