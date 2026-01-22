import Link from "next/link";
import {
  ArrowLeft,
  GraduationCap,
  CheckCircle2,
  Clock,
  BookOpen,
  FileText,
  Target,
  TrendingUp,
  Users,
  ShoppingCart,
  Search,
  Mail,
  Share2,
  BarChart3,
  Briefcase,
  Presentation,
  Brain,
  DollarSign,
  Calculator,
  MessageSquare,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Courses | Blaine Powers - DesignFi Studio",
  description:
    "Academic courses completed by Blaine Powers, Owner & CEO of DesignFi Studio, from higher education institutions.",
  openGraph: {
    title: "Courses | Blaine Powers - DesignFi Studio",
    description: "Academic courses completed by Blaine Powers.",
    url: "https://designfi.studio/about/courses",
    type: "website",
  },
  alternates: {
    canonical: "https://designfi.studio/about/courses",
  },
};

// Course data structure
interface Course {
  id: string;
  name: string;
  code: string;
  status: "completed" | "in-progress" | "registered" | "not-started";
  grade?: string;
  term: string;
  credits: number;
  icon: React.ComponentType<{ className?: string }>;
}

// Icon mapping for different course types
const getCourseIcon = (name: string, code: string) => {
  const lowerName = name.toLowerCase();
  const lowerCode = code.toLowerCase();

  if (lowerName.includes("marketing") || lowerCode.includes("104")) {
    if (lowerName.includes("social")) return Share2;
    if (lowerName.includes("email")) return Mail;
    if (lowerName.includes("content")) return FileText;
    if (lowerName.includes("internet") || lowerName.includes("digital")) return TrendingUp;
    if (lowerName.includes("seo") || lowerName.includes("analytics")) return Search;
    if (lowerName.includes("advertising")) return Target;
    if (lowerName.includes("research")) return BarChart3;
    if (lowerName.includes("e-commerce")) return ShoppingCart;
    if (lowerName.includes("inbound")) return TrendingUp;
    if (lowerName.includes("personal brand")) return Users;
    if (lowerName.includes("integrated") || lowerName.includes("campaign")) return Target;
    return TrendingUp;
  }
  if (lowerName.includes("business") || lowerCode.includes("102")) return Briefcase;
  if (lowerName.includes("design") || lowerCode.includes("104-175")) return Presentation;
  if (lowerName.includes("computer") || lowerCode.includes("103")) return FileText;
  if (lowerName.includes("project management") || lowerCode.includes("196") || lowerCode.includes("104-152")) return Briefcase;
  if (lowerName.includes("technical") || lowerName.includes("reporting") || lowerCode.includes("801-197")) return FileText;
  if (lowerName.includes("speech") || lowerCode.includes("801-198")) return MessageSquare;
  if (lowerName.includes("psychology") || lowerCode.includes("809-198")) return Brain;
  if (lowerName.includes("economics") || lowerCode.includes("809-195")) return DollarSign;
  if (lowerName.includes("math") || lowerCode.includes("804")) return Calculator;
  if (lowerName.includes("strengths") || lowerCode.includes("890")) return Users;
  return BookOpen;
};

// Program Courses
const programCourses: Course[] = [
  // Completed Courses - Fall 2024
  {
    id: "1",
    name: "Business Concepts",
    code: "102-169",
    status: "completed",
    grade: "A",
    term: "Fall 2024",
    credits: 2,
    icon: Briefcase,
  },
  {
    id: "2",
    name: "Digital Design Components",
    code: "104-175",
    status: "completed",
    grade: "A",
    term: "Fall 2024",
    credits: 2,
    icon: Presentation,
  },
  {
    id: "3",
    name: "Marketing Principles",
    code: "104-114",
    status: "completed",
    grade: "A",
    term: "Fall 2024",
    credits: 3,
    icon: TrendingUp,
  },
  {
    id: "4",
    name: "Computer Applications for Business",
    code: "103-111",
    status: "completed",
    grade: "A",
    term: "Fall 2024",
    credits: 3,
    icon: FileText,
  },
  // Completed Courses - Spring 2025
  {
    id: "5",
    name: "Content Marketing",
    code: "104-177",
    status: "completed",
    grade: "A",
    term: "Spring 2025",
    credits: 3,
    icon: FileText,
  },
  {
    id: "6",
    name: "Internet Marketing",
    code: "104-169",
    status: "completed",
    grade: "A",
    term: "Spring 2025",
    credits: 2,
    icon: TrendingUp,
  },
  {
    id: "7",
    name: "Marketing Research",
    code: "104-155",
    status: "completed",
    grade: "B",
    term: "Spring 2025",
    credits: 3,
    icon: BarChart3,
  },
  {
    id: "8",
    name: "Digital Advertising",
    code: "104-176",
    status: "completed",
    grade: "A",
    term: "Spring 2025",
    credits: 3,
    icon: Target,
  },
  // Completed Courses - Fall 2025
  {
    id: "9",
    name: "Email Marketing",
    code: "104-134",
    status: "completed",
    grade: "A",
    term: "Fall 2025",
    credits: 3,
    icon: Mail,
  },
  {
    id: "10",
    name: "Social Media Strategies",
    code: "104-109",
    status: "completed",
    grade: "A",
    term: "Fall 2025",
    credits: 3,
    icon: Share2,
  },
  {
    id: "11",
    name: "E-Commerce",
    code: "104-106",
    status: "completed",
    grade: "A",
    term: "Fall 2025",
    credits: 3,
    icon: ShoppingCart,
  },
  {
    id: "12",
    name: "SEO and Marketing Analytics",
    code: "104-174",
    status: "completed",
    grade: "A",
    term: "Fall 2025",
    credits: 3,
    icon: Search,
  },
  // In Progress / Remaining Courses - Spring 2026
  {
    id: "13",
    name: "Personal Brand",
    code: "104-183",
    status: "in-progress",
    term: "Spring 2026",
    credits: 2,
    icon: Users,
  },
  {
    id: "14",
    name: "Inbound Marketing",
    code: "104-140",
    status: "in-progress",
    term: "Spring 2026",
    credits: 3,
    icon: TrendingUp,
  },
  {
    id: "15",
    name: "Integrated Marketing Campaign",
    code: "104-117",
    status: "registered",
    term: "Spring 2026",
    credits: 3,
    icon: Target,
  },
  {
    id: "16",
    name: "Project Management",
    code: "196-188",
    status: "registered",
    term: "Spring 2026",
    credits: 3,
    icon: Briefcase,
  },
];

// General Studies Courses
const generalStudiesCourses: Course[] = [
  {
    id: "gs1",
    name: "Technical Reporting",
    code: "801-197",
    status: "completed",
    grade: "A",
    term: "Fall 2024",
    credits: 3,
    icon: FileText,
  },
  {
    id: "gs2",
    name: "Speech",
    code: "801-198",
    status: "completed",
    grade: "A",
    term: "Fall 2025",
    credits: 3,
    icon: MessageSquare,
  },
  {
    id: "gs3",
    name: "Intro to Psychology",
    code: "809-198",
    status: "completed",
    grade: "A",
    term: "Summer 2025",
    credits: 3,
    icon: Brain,
  },
  {
    id: "gs4",
    name: "Strengths Seminar",
    code: "890-106",
    status: "completed",
    grade: "PCR",
    term: "Fall 2024",
    credits: 1,
    icon: Users,
  },
  {
    id: "gs5",
    name: "Economics",
    code: "809-195",
    status: "completed",
    grade: "A",
    term: "Summer 2025",
    credits: 3,
    icon: DollarSign,
  },
  {
    id: "gs6",
    name: "Math with Business Applications",
    code: "804-123",
    status: "completed",
    grade: "A",
    term: "Spring 2025",
    credits: 3,
    icon: Calculator,
  },
];

const StatusBadge = ({
  status,
  grade,
}: {
  status: Course["status"];
  grade?: string;
}) => {
  if (status === "completed" && grade) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/30">
        <CheckCircle2 className="h-3 w-3" />
        Completed • {grade}
      </span>
    );
  }
  if (status === "in-progress") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-400 border border-blue-500/30">
        <Clock className="h-3 w-3" />
        In Progress
      </span>
    );
  }
  if (status === "registered") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/20 px-3 py-1 text-xs font-medium text-violet-400 border border-violet-500/30">
        <BookOpen className="h-3 w-3" />
        Registered
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-500/20 px-3 py-1 text-xs font-medium text-slate-400 border border-slate-500/30">
      <Clock className="h-3 w-3" />
      Not Started
    </span>
  );
};

const CourseCard = ({ course }: { course: Course }) => {
  const Icon = course.icon;
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 p-3 border border-white/10">
          <Icon className="h-5 w-5 text-violet-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white mb-1">
                {course.name}
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
                <span className="font-mono">{course.code}</span>
                <span>•</span>
                <span>{course.credits} {course.credits === 1 ? "Credit" : "Credits"}</span>
                <span>•</span>
                <span>{course.term}</span>
              </div>
            </div>
            <StatusBadge status={course.status} grade={course.grade} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CoursesPage() {
  const completedProgramCourses = programCourses.filter(
    (c) => c.status === "completed"
  ).length;
  const totalProgramCourses = programCourses.length;
  const completedGeneralStudies = generalStudiesCourses.filter(
    (c) => c.status === "completed"
  ).length;
  const totalGeneralStudies = generalStudiesCourses.length;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      {/* Back Button */}
      <Link
        href="/about"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to About
      </Link>

      {/* Header */}
      <div className="max-w-3xl space-y-4 mb-10">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 p-3">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-4xl font-semibold text-white">Courses</h1>
        </div>
        <p className="text-lg text-slate-300">
          Digital Marketing Associate Degree Program at Western Wisconsin Technical College
        </p>
      </div>

      {/* Program Courses Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Program Courses
            </h2>
            <p className="text-sm text-slate-400">
              {completedProgramCourses} of {totalProgramCourses} courses completed
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 mb-1">Current GPA</p>
            <p className="text-2xl font-bold text-emerald-400">3.909</p>
            <p className="text-xs text-slate-500">Min Required: 2.000</p>
          </div>
        </div>

        {/* Completed Courses */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-emerald-400 mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Completed Courses ({completedProgramCourses})
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {programCourses
              .filter((c) => c.status === "completed")
              .map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
          </div>
        </div>

        {/* Remaining Courses */}
        {programCourses.some((c) => c.status !== "completed") && (
          <div>
            <h3 className="text-lg font-medium text-blue-400 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Remaining Courses (
              {totalProgramCourses - completedProgramCourses})
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {programCourses
                .filter((c) => c.status !== "completed")
                .map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
            </div>
          </div>
        )}
      </div>

      {/* General Studies Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              General Studies
            </h2>
            <p className="text-sm text-slate-400">
              {completedGeneralStudies} of {totalGeneralStudies} courses completed
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 mb-1">Current GPA</p>
            <p className="text-2xl font-bold text-emerald-400">4.000</p>
            <p className="text-xs text-slate-500">Min Required: 2.000</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {generalStudiesCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}

