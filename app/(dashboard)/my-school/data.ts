// Type for the location object
interface Location {
  country: string;
  state: string;
  city: string;
}

// Type for each stat item
interface StatItem {
  id: number;
  icon: string;
  text: string;
  year?: number; // optional because only the first stat has year
  name?: string; // optional because only principal has name
  number?: number; // optional because only student has number
  rating?: number; // optional because only rating has rating
  bgColor: string;
}

// Type for the whole header card
export interface HeaderCardProps {
  schoolname: string;
  logo: string;
  location: Location;
  stats: StatItem[];
  types: string[];
  id: string | number;
}

export type InfoCard = {
  id: number;
  label: string;
  icon: string;
  value: string | number; // kyun ke kabhi text hai, kabhi number (1996)
  bgColor: string;
};

export type AboutSectionData = {
  schooldescription: string;
  infoCards: InfoCard[];
};

type OurLeaderShipProps = {
  id: number;
  name: string;
  img: string;
  icon: string;
  title: string;
};

export const HeaderCardData: HeaderCardProps = {
  id: 1,
  schoolname: "International Academy of Excellence",

  logo: "/images/GreenwoodAcademyLogo.png",
  location: {
    country: "Singapor",
    state: "",
    city: "singapor",
  },

  types: ["Private", "Secondary"],

  stats: [
    {
      id: 1,
      icon: "/images/svg/calander.svg",
      text: "Founded",
      year: 1995,
      bgColor: "bg-custom-blue/10",
    },
    {
      id: 2,
      icon: "/images/svg/yellow-person.svg",
      text: "Principal",
      name: "Dr.Sarah Jhonson",
      bgColor: "bg-custom-yellow/10",
    },
    {
      id: 3,
      icon: "/images/svg/twopersons.svg",
      text: "Students",
      number: 1250,
      bgColor: "bg-custom-teal/20",
    },
    {
      id: 4,
      icon: "/images/svg/outlinestar.svg",
      text: "Rating",
      rating: 4.8,
      bgColor: "bg-custom-yellow/10",
    },
  ],
};

export const aboutsectiondata = {
  schooldescription:
    "International Academy of Excellence is a premier educational institution committed to fostering global citizenship and academic excellence. Our diverse community oflearners from over 40 countries creates a rich multicultural environment that preparesstudents for success in an interconnected world. We offer a comprehensive curriculumthat combines rigorous academics with character development, ensuring our graduatesare well-prepared for university and beyond.",
  infoCards: [
    {
      id: 1,
      label: "Curriculum",
      icon: "/images/svg/yellowcap.svg",
      value: "IB, Cambridge, Local",
      bgColor: "bg-custom-yellow/40",
    },
    {
      id: 2,
      label: "Established",
      icon: "/images/svg/puplecalander.svg",
      value: 1996,
      bgColor: "bg-custom-purple/20",
    },
    {
      id: 3,
      label: "Location",
      icon: "/images/svg/bluelocation.svg",
      value: "Marina Bay, Singapore",
      bgColor: "bg-custom-teal/10",
    },
  ],
};

export const campusGallary = [
  "/images/Background(3).png",
  "/images/Background(3).png",
  "/images/Background(3).png",
  "/images/Background(3).png",
];

export type PrincipalProps = {
  id: number;
  name: string;
  title: string;
  image: string;
  message?: string; // Optional welcome message
};

export const OurLeaderShipData: OurLeaderShipProps[] = [
  {
    id: 1,
    name: "Dr. Sahar Johnson",
    title: "Principal",
    img: "/images/sara.png",
    icon: "/images/svg/whitepersonicon.svg",
  },
  {
    id: 2,
    name: "Ms. Emily Rodrigue",
    title: "Head of Academics",
    img: "/images/emily.png",
    icon: "/images/svg/whitepersonicon.svg",
  },
  {
    id: 3,
    name: "Mr. David Chen",
    title: "Vice Principal",
    img: "/images/david.png",
    icon: "/images/svg/whitepersonicon.svg",
  },
  {
    id: 4,
    name: "Dr. Michael Thompson",
    title: "Head of Science Department",
    img: "/images/thomson.png",
    icon: "/images/svg/whitepersonicon.svg",
  },
  {
    id: 5,
    name: "Ms. Lisa Wang",
    title: "Head of Student Affairs",
    img: "/images/lisa.png",
    icon: "/images/svg/whitepersonicon.svg",
  },
  {
    id: 6,
    name: "Mr. James Wilson",
    title: "Head of Sports & Activities",
    img: "/images/james.png",
    icon: "/images/svg/whitepersonicon.svg",
  },
];
