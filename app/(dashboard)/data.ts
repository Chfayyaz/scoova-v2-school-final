type NotificationTypes = {
  id: number;
  title: string;
  message: string;
  time: string;
  type: "review" | "subscription" | "security";
  image: string;

  actionText?: string;
  isNew: boolean;
};
export const notifications: NotificationTypes[] = [
  {
    id: 1,
    image: "/images/svg/star.svg",
    title: "New Review Added",
    message:
      "Samantha Wills left a 5-star review for the 'Advanced Mathematics' course.",
    time: "2 hours ago",
    type: "review",

    isNew: true,
  },
  {
    id: 2,
    image: "/images/svg/bell.svg",
    title: "Subscription Reminder",
    message:
      "Your school’s premium subscription is set to expire in 7 days. Please renew to avoid service interruption.",
    time: "1 day ago",
    type: "subscription",

    actionText: "Renew Now",
    isNew: true,
  },
  {
    id: 3,
    image: "/images/svg/alert.svg",
    title: "Security Alert: New Login",
    message:
      "A new login to your admin account was detected from a new device in London, UK.",
    time: "3 days ago",
    type: "security",

    isNew: false,
  },
  {
    id: 4,
    image: "/images/svg/star.svg",
    title: "New Review Added",
    message:
      "James Wilson left a 4-star review for the 'Physics Fundamentals' course.",
    time: "5 hours ago",
    type: "review",
    isNew: false,
  },
  {
    id: 5,
    image: "/images/svg/bell.svg",
    title: "Payment Successful",
    message:
      "Your monthly subscription payment of $29.99 has been processed successfully.",
    time: "2 days ago",
    type: "subscription",
    isNew: false,
  },
  {
    id: 6,
    image: "/images/svg/alert.svg",
    title: "Password Changed",
    message:
      "Your account password was successfully updated. If this wasn't you, please contact support.",
    time: "4 days ago",
    type: "security",
    isNew: false,
  },
  {
    id: 7,
    image: "/images/svg/star.svg",
    title: "New Review Added",
    message:
      "Emily Davis left a 5-star review for the 'English Literature' course.",
    time: "1 week ago",
    type: "review",
    isNew: false,
  },
];

type SidebarItem = {
  id: number;
  title: string;
  slug: string;
  icon: string;
};

export const sidebarData: SidebarItem[] = [
  {
    id: 1,
    title: "Dashboard",
    slug: "/",
    icon: "/images/svg/clock.svg",
  },
  {
    id: 2,
    title: "My School",
    slug: "my-school",
    icon: "/images/svg/cap.svg",
  },
  {
    id: 3,
    title: "Reviews",
    slug: "reviews",
    icon: "/images/svg/reviews.svg",
  },
  {
    id: 4,
    title: "Analytics",
    slug: "analytics",
    icon: "/images/svg/analytics.svg",
  },

  {
    id: 5,
    title: "Job Management",
    icon: "/images/svg/job.svg",
    slug: "job-management",
  },
  {
    id: 6,
    title: "Pulse Survey",
    slug: "pulse-survey",
    icon: "/images/svg/puls.svg",
  },
  {
    id: 7,
    title: "Settings",
    slug: "settings",
    icon: "/images/svg/settings.svg",
  },
];

// Dashboard Data Types
export type MetricCard = {
  id: number;
  title: string;
  value: string | number;
  change: string;
  changeType: "positive" | "negative";
  icon: string;
  bgColor: string;
};

export type ActivityItem = {
  id: string | number;
  type:
    | "review"
    | "staff"
    | "enrollment"
    | "profile"
    | "survey_created"
    | "survey_published"
    | "school_followed"
    | "review_submitted"
    | "school_staff_added"
    | "school_staff_removed";
  title: string;
  description: string;
  time: string;
  rating?: number;
  author?: string;
  icon: string;
  bgColor: string;
};

export type ReviewItem = {
  id: string | number;
  author: string;
  authorType: string;
  time: string;
  title: string;
  description: string;
  helpfulCount: number;
  icon: string;
  bgColor: string;
  rating: number;
  
};

export type SchoolInfo = {
  name: string;
  address: string;
  principal: string;
  phone: string;
};

// Dashboard Data
export const schoolInfo: SchoolInfo = {
  name: "Greenwood Academy",
  address: "123 Education Street, Springfield, IL 62701",
  principal: "Principal: Dr. Sarah Johnson",
  phone: "Phone: (555) 123-4567",
};

export const metrics: MetricCard[] = [
  {
    id: 1,
    title: "Total Reviews",
    value: 342,
    change: "+12%",
    changeType: "positive",
    icon: "/images/svg/text.svg",
    bgColor: "bg-custom-blue/10",
  },
  {
    id: 2,
    title: "Avg Rating",
    value: 4.8,
    change: "+0.2",
    changeType: "positive",
    icon: "/images/svg/outlinestar.svg",
    bgColor: "bg-custom-yellow/10",
  },
  {
    id: 3,
    title: "Engagement",
    value: "87%",
    change: "+8%",
    changeType: "positive",
    icon: "/images/svg/chart.svg",
    bgColor: "bg-custom-green/10",
  },
  {
    id: 4,
    title: "Total Followers",
    value: 650,
    change: "+9%",
    changeType: "positive",
    icon: "/images/svg/persons.svg",
    bgColor: "bg-[#D0BCFF4D]",
  },
];

export const activities: ActivityItem[] = [
  {
    id: 1,
    type: "review",
    title: "New 5-star review by John Smith",
    description: "5★ - Excellent teaching staff and facilities",
    time: "2 hours ago",
    rating: 5,
    author: "John Smith",
    icon: "/images/svg/star.svg",
    bgColor: "bg-custom-yellow/10",
  },
  {
    id: 2,
    type: "staff",
    title: "Staff member added",
    description: "Mr. Ali Hassan (Mathematics Teacher, Grade 9-12)",
    time: "4 hours ago",
    icon: "/images/svg/personplus.svg",
    bgColor: "bg-custom-teal/10",
  },
  {
    id: 3,
    type: "enrollment",
    title: "Student enrollment updated",
    description: "15 new students for Fall 2024",
    time: "1 day ago",
    icon: "/images/svg/greencap.svg",
    bgColor: "bg-custom-green/10",
  },
  {
    id: 4,
    type: "review",
    title: "New 4-star review by Maria Garcia",
    description: "4★ - Great extracurricular programs",
    time: "2 days ago",
    rating: 4,
    author: "Maria Garcia",
    icon: "/images/svg/star.svg",
    bgColor: "bg-custom-yellow/10",
  },
  {
    id: 5,
    type: "profile",
    title: "School profile updated",
    description: "Contact information and facilities list",
    time: "3 days ago",
    icon: "/images/svg/purpalsetting.svg",
    bgColor: "bg-custom-purple/10",
  },
];

export const reviews: ReviewItem[] = [
  {
    id: 1,
    author: "Alumni",
    authorType: "Alumni",
    time: "1 month ago",
    title: "Great foundation for university success",
    description:
      "Outstanding school with dedicated teachers. My daughter has thrived here academically and socially.",
    helpfulCount: 18,
    icon: "/images/svg/greencap.svg",
    bgColor: "bg-custom-teal/20",
    rating: 5,
  },
  {
    id: 2,
    author: "Alumni",
    authorType: "Alumni",
    time: "1 month ago",
    title: "Great foundation for university success",
    description:
      "Outstanding school with dedicated teachers. My daughter has thrived here academically and socially.",
    helpfulCount: 18,
    icon: "/images/svg/greencap.svg",
    bgColor: "bg-custom-teal/20",
    rating: 3,
  },
  {
    id: 3,
    author: "Alumni",
    authorType: "Alumni",
    time: "1 month ago",
    title: "Great foundation for university success",
    description:
      "Outstanding school with dedicated teachers. My daughter has thrived here academically and socially.",
    helpfulCount: 18,
    icon: "/images/svg/greencap.svg",
    bgColor: "bg-custom-teal/20",
    rating: 2,
  },
];
