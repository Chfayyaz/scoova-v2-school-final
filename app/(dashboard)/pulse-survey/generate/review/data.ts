// Types and mock data for Review & Launch Survey page

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

export type DeliveryMethod = {
  email: boolean;
  scoovaInbox: boolean;
};

export type Recipient = {
  id: string;
  name: string;
  email: string;
  /** For API when survey is created on Send Survey (Parent | Staff | Alumni) */
  recipientType?: string;
};

export type ReviewSurveyData = {
  survey: SurveyDetails;
  deliveryMethod: DeliveryMethod;
  recipients: Recipient[];
  totalRecipients: number;
};

// Mock function to get default review data
export function getDefaultReviewData(): ReviewSurveyData {
  return {
    survey: {
      id: Date.now(),
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
    deliveryMethod: {
      email: true,
      scoovaInbox: false,
    },
    recipients: [],
    totalRecipients: 0,
  };
}

// Mock recipients data
export const mockRecipients: Recipient[] = [
  { id: "r1", name: "John Doe", email: "john.doe@example.com" },
  { id: "r2", name: "Jane Smith", email: "jane.smith@example.com" },
  { id: "r3", name: "Bob Johnson", email: "bob.johnson@example.com" },
];
