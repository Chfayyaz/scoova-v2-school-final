// Types and mock data for AI-Powered Survey Creator page

export type QuestionType = "rating" | "yesno" | "multiple" | "text";

export type Question = {
  id: string;
  order: number;
  text: string;
  type: QuestionType;
};

export type SurveyCategory = "Students" | "Parents" | "Staff" | "Alumni";

export type SurveySettings = {
  surveyName: string;
  targetAudience: SurveyCategory;
  anonymity: boolean;
  startDate: string;
  endDate: string;
};

export type RecipientMethod = "csv" | "manual";

export type Recipient = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type AISurveyData = {
  prompt: string;
  questions: Question[];
  settings: SurveySettings;
  recipients: Recipient[];
};

// Mock generated questions (matching reference UI)
export const mockGeneratedQuestions: Question[] = [
  {
    id: "q1",
    order: 1,
    text: "How satisfied are you with the new curriculum's engagement level for your child?",
    type: "rating",
  },
  {
    id: "q2",
    order: 2,
    text: "Do you feel the communication about the curriculum changes has been clear?",
    type: "yesno",
  },
  {
    id: "q3",
    order: 3,
    text: "Which subject area has your child shown the most improvement in?",
    type: "multiple",
  },
  {
    id: "q4",
    order: 4,
    text: "What suggestions do you have for further improving the curriculum?",
    type: "text",
  },
];

// Alternate set for Regenerate (different questions)
export const mockGeneratedQuestionsAlt: Question[] = [
  {
    id: "q1",
    order: 1,
    text: "How would you rate the school's facilities and resources?",
    type: "rating",
  },
  {
    id: "q2",
    order: 2,
    text: "Would you recommend this school to other parents?",
    type: "yesno",
  },
  {
    id: "q3",
    order: 3,
    text: "Which aspect of the school would you like to see improved?",
    type: "multiple",
  },
  {
    id: "q4",
    order: 4,
    text: "Any additional comments or feedback?",
    type: "text",
  },
];

// Default survey settings
export const defaultSurveySettings: SurveySettings = {
  surveyName: "Parent Satisfaction Survey (AI Draft)",
  targetAudience: "Parents",
  anonymity: true,
  startDate: "",
  endDate: "",
};

// Get question type label and styling (colors from globals.css only, no border)
export const getQuestionTypeInfo = (type: QuestionType) => {
  switch (type) {
    case "rating":
      return {
        label: "Rating Scale",
        color: "text-custom-orange",
        bgColor: "bg-custom-orange/10",
        icon: "Star",
      };
    case "yesno":
      return {
        label: "Yes/No",
        color: "text-custom-orange",
        bgColor: "bg-custom-orange/10",
        icon: "ToggleLeft",
      };
    case "multiple":
      return {
        label: "Multiple Choice",
        color: "text-custom-voilet-purple",
        bgColor: "bg-custom-voilet-purple/10",
        icon: "List",
      };
    case "text":
      return {
        label: "Short Text",
        color: "text-custom-teal",
        bgColor: "bg-custom-teal/10",
        icon: "Type",
      };
  }
};
