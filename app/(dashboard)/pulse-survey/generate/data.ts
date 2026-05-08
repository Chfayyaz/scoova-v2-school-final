// Mock data for survey view/edit page

export type QuestionType = "likert" | "rating" | "text";

export type Question = {
  id: string;
  order: number;
  text: string;
  type: QuestionType;
};

export type SurveyCategory = "Students" | "Parents" | "Staff" | "Alumni";

export type SurveyDetails = {
  id: number | string;
  title: string;
  category: SurveyCategory | string;
  description: string;
  estimatedTime: number; // in minutes
  questions: Question[];
  status: "draft" | "active" | "ended";
};

// Mock function to get survey details by ID
// In real app, this would be an API call
export function getSurveyDetails(id: number): SurveyDetails | null {
  const survey = mockSurveysData.find((s) => s.id === id);
  return survey || null;
}

// Mock surveys data
export const mockSurveysData: SurveyDetails[] = [
  {
    id: 1,
    title: "Annual Parent Satisfaction Survey",
    category: "Parents",
    description:
      "We value your feedback to help us improve our school environment and educational quality. Please take a few moments to complete this anonymous survey.",
    estimatedTime: 10,
    status: "draft",
    questions: [
      {
        id: "q1",
        order: 1,
        text: "The school provides a safe and supportive environment for my child.",
        type: "likert",
      },
      {
        id: "q2",
        order: 2,
        text: "How would you rate the quality of communication from the school?",
        type: "rating",
      },
      {
        id: "q3",
        order: 3,
        text: "Do you have any suggestions for improvement?",
        type: "text",
      },
    ],
  },
  {
    id: 2,
    title: "Student Tech Access 2025",
    category: "Students",
    description:
      "Help us understand your technology needs and access to digital resources.",
    estimatedTime: 5,
    status: "active",
    questions: [
      {
        id: "q1",
        order: 1,
        text: "Do you have reliable internet access at home?",
        type: "likert",
      },
      {
        id: "q2",
        order: 2,
        text: "Rate your comfort level with online learning platforms.",
        type: "rating",
      },
    ],
  },
  {
    id: 3,
    title: "Staff Wellbeing Q3",
    category: "Staff",
    description:
      "Your feedback helps us create a better working environment for everyone.",
    estimatedTime: 8,
    status: "ended",
    questions: [
      {
        id: "q1",
        order: 1,
        text: "I feel supported by the school administration.",
        type: "likert",
      },
      {
        id: "q2",
        order: 2,
        text: "How would you rate your work-life balance?",
        type: "rating",
      },
      {
        id: "q3",
        order: 3,
        text: "What improvements would you like to see?",
        type: "text",
      },
    ],
  },
  {
    id: 4,
    title: "Alumni Network Engagement",
    category: "Alumni",
    description:
      "Stay connected with your alma mater and help us improve our programs.",
    estimatedTime: 7,
    status: "draft",
    questions: [
      {
        id: "q1",
        order: 1,
        text: "How satisfied are you with your educational experience?",
        type: "likert",
      },
    ],
  },
];

