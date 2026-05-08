// Types for job details
import type { JobStatus } from "../data";

export type JobDetail = {
  id: number;
  jobTitle: string;
  applicationsReceived: number;
  aboutTheRole: string;
  responsibilities: string;
  requirements: string[];
  jobBase: JobStatus;
  salaryBenefits: string;
  startDate: string;
  applicationDeadline: string;
  attachment?: {
    name: string;
    type: string;
    url: string;
  };
};

// Keep mock data for service layer use
export const jobDetailsData: JobDetail[] = [
  {
    id: 1,
    jobTitle: "Math Teacher - Secondary Level",
    applicationsReceived: 110,
    aboutTheRole:
      "We are seeking a passionate and dedicated English Language Teacher to join our dynamic secondary school faculty. The ideal candidate will be responsible for developing students' literacy skills, fostering a love for literature, and preparing them for advanced studies. You will create engaging lesson plans, assess student progress, and collaborate with a team of committed educators to provide a supportive and challenging learning environment.",
    responsibilities:
      "Design and implement engaging lesson plans that align with the curriculum. Design and implement engaging lesson plans that align with the curriculum. Foster a positive and inclusive classroom environment that encourages student participation. Assess and monitor student progress, providing regular feedback to students and parents. Utilize a variety of teaching methods and technologies to cater to different learning styles. Collaborate with colleagues on curriculum development and school-wide initiatives. Participate in extracurricular activities and school events.",
    requirements: [
      "Bachelor's degree in English, Education, or a related field (Master's preferred).",
      "Valid teaching certification for secondary education.",
      "Minimum of 2 years of teaching experience at the secondary level.",
      "Excellent communication, interpersonal, and classroom management skills.",
      "Proficiency in using educational technology and digital learning tools.",
    ],
    jobBase: "Contract",
    salaryBenefits: "Competitive, based on experience",
    startDate: "August 1, 2026",
    applicationDeadline: "July 15, 2026",
    attachment: {
      name: "job-description.pdf",
      type: "application/pdf",
      url: "/files/job-description.pdf",
    },
  },
  {
    id: 2,
    jobTitle: "Math Teacher - Secondary Level",
    applicationsReceived: 95,
    aboutTheRole:
      "We are seeking a passionate and dedicated Math Teacher to join our dynamic secondary school faculty. The ideal candidate will be responsible for developing students' mathematical skills, fostering problem-solving abilities, and preparing them for advanced studies. You will create engaging lesson plans, assess student progress, and collaborate with a team of committed educators to provide a supportive and challenging learning environment.",
    responsibilities:
      "Design and implement engaging lesson plans that align with the curriculum. Foster a positive and inclusive classroom environment that encourages student participation. Assess and monitor student progress, providing regular feedback to students and parents. Utilize a variety of teaching methods and technologies to cater to different learning styles. Collaborate with colleagues on curriculum development and school-wide initiatives. Participate in extracurricular activities and school events.",
    requirements: [
      "Bachelor's degree in Mathematics, Education, or a related field (Master's preferred).",
      "Valid teaching certification for secondary education.",
      "Minimum of 2 years of teaching experience at the secondary level.",
      "Excellent communication, interpersonal, and classroom management skills.",
      "Proficiency in using educational technology and digital learning tools.",
    ],
    jobBase: "Contract",
    salaryBenefits: "Competitive, based on experience",
    startDate: "September 1, 2026",
    applicationDeadline: "August 15, 2026",
    attachment: {
      name: "job-description.pdf",
      type: "application/pdf",
      url: "/files/job-description.pdf",
    },
  },
  {
    id: 3,
    jobTitle: "Math Teacher - Secondary Level",
    applicationsReceived: 87,
    aboutTheRole:
      "We are seeking a passionate and dedicated Math Teacher to join our dynamic secondary school faculty. The ideal candidate will be responsible for developing students' mathematical skills, fostering problem-solving abilities, and preparing them for advanced studies. You will create engaging lesson plans, assess student progress, and collaborate with a team of committed educators.",
    responsibilities:
      "Design and implement engaging lesson plans that align with the curriculum. Foster a positive and inclusive classroom environment that encourages student participation. Assess and monitor student progress, providing regular feedback to students and parents. Utilize a variety of teaching methods and technologies to cater to different learning styles. Collaborate with colleagues on curriculum development and school-wide initiatives.",
    requirements: [
      "Bachelor's degree in Mathematics, Education, or a related field.",
      "Valid teaching certification for secondary education.",
      "Minimum of 2 years of teaching experience at the secondary level.",
      "Excellent communication and classroom management skills.",
      "Proficiency in using educational technology.",
    ],
    jobBase: "Contract",
    salaryBenefits: "Competitive, based on experience",
    startDate: "August 15, 2026",
    applicationDeadline: "July 30, 2026",
  },
  {
    id: 4,
    jobTitle: "Math Teacher - Secondary Level",
    applicationsReceived: 102,
    aboutTheRole:
      "We are seeking a passionate and dedicated Math Teacher to join our dynamic secondary school faculty. The ideal candidate will be responsible for developing students' mathematical skills, fostering problem-solving abilities, and preparing them for advanced studies. You will create engaging lesson plans and collaborate with educators.",
    responsibilities:
      "Design and implement engaging lesson plans that align with the curriculum. Foster a positive and inclusive classroom environment. Assess and monitor student progress, providing regular feedback. Utilize a variety of teaching methods and technologies. Collaborate with colleagues on curriculum development.",
    requirements: [
      "Bachelor's degree in Mathematics or Education.",
      "Valid teaching certification for secondary education.",
      "Minimum of 2 years of teaching experience.",
      "Excellent communication skills.",
      "Proficiency in educational technology.",
    ],
    jobBase: "Contract",
    salaryBenefits: "Competitive, based on experience",
    startDate: "September 1, 2026",
    applicationDeadline: "August 20, 2026",
  },
  {
    id: 5,
    jobTitle: "IT Systems Administrator",
    applicationsReceived: 76,
    aboutTheRole:
      "We are seeking an experienced IT Systems Administrator to manage and maintain our school's technology infrastructure. The ideal candidate will be responsible for ensuring the smooth operation of all IT systems, providing technical support to staff and students, and implementing new technologies to enhance the learning environment.",
    responsibilities:
      "Maintain and troubleshoot school IT infrastructure including servers, networks, and workstations. Provide technical support to staff and students. Install and configure software and hardware. Monitor system performance and security. Manage user accounts and permissions. Implement backup and disaster recovery procedures. Train staff on new technologies and systems.",
    requirements: [
      "Bachelor's degree in Computer Science, Information Technology, or related field.",
      "Minimum of 3 years of experience in IT systems administration.",
      "Strong knowledge of network protocols, server management, and security practices.",
      "Experience with Windows and Linux operating systems.",
      "Excellent problem-solving and communication skills.",
      "Relevant certifications (e.g., CompTIA, Microsoft, Cisco) preferred.",
    ],
    jobBase: "Contract",
    salaryBenefits: "Competitive salary with benefits package",
    startDate: "October 1, 2026",
    applicationDeadline: "September 15, 2026",
    attachment: {
      name: "it-admin-job.pdf",
      type: "application/pdf",
      url: "/files/it-admin-job.pdf",
    },
  },
  {
    id: 6,
    jobTitle: "Librarian & Media Specialist",
    applicationsReceived: 45,
    aboutTheRole:
      "We are looking for a creative Librarian to manage our library resources and promote literacy across all year levels. The ideal candidate will be responsible for maintaining the library collection, assisting students and staff with research, and organizing educational programs that foster a love of reading and learning.",
    responsibilities:
      "Manage library collection including cataloging, organizing, and maintaining books and digital resources. Assist students and staff with research and information literacy. Develop and implement library programs and activities. Promote reading and literacy initiatives. Maintain library technology and digital resources. Collaborate with teachers to support curriculum needs.",
    requirements: [
      "Master's degree in Library Science or related field.",
      "Valid library certification preferred.",
      "Minimum of 2 years of experience in a school library setting.",
      "Strong knowledge of library management systems and digital resources.",
      "Excellent organizational and communication skills.",
      "Passion for promoting literacy and learning.",
    ],
    jobBase: "Job Expired",
    salaryBenefits: "Competitive, based on experience",
    startDate: "August 1, 2026",
    applicationDeadline: "July 10, 2026",
  },
];

