export type Subject = {
  name: string;
  weightage: string;
  type: "Common" | "Core";
  href: string;
};

export type BranchConfig = {
  name: string;
  shortName: string;
  description: string;
  theme: {
    text: string;
    bgLight: string;
    bgBadge: string;
    border: string;
    borderHover: string;
    focus: string;
    glow: string;
    selection: string;
  };
  subjects: Subject[];
};

export const branchData: Record<string, BranchConfig> = {
  "gate-ee": {
    name: "Electrical Engineering",
    shortName: "EE",
    description: "Your ultimate toolkit for cracking GATE Electrical Engineering. Access full EE syllabus notes, PYQs, cutoffs, and targeted mock tests.",
    theme: {
      text: "text-green-500",
      bgLight: "bg-green-500/10",
      bgBadge: "bg-green-500/20",
      border: "border-green-500/30",
      borderHover: "hover:border-green-500/50",
      focus: "focus:border-green-500/50 focus:ring-green-500/50",
      glow: "bg-green-500/5",
      selection: "selection:bg-green-500/30",
    },
    subjects: [
      { name: "Engineering Mathematics", weightage: "13-15%", type: "Common", href: "/resources/gate-ee/mathematics" },
      { name: "General Aptitude", weightage: "15%", type: "Common", href: "/resources/gate-ee/aptitude" },
      { name: "Electric Circuits", weightage: "8-10%", type: "Core", href: "/resources/gate-ee/networks" },
      { name: "Electromagnetic Fields", weightage: "4-6%", type: "Core", href: "/resources/gate-ee/emt" },
      { name: "Signals & Systems", weightage: "7-9%", type: "Core", href: "/resources/gate-ee/signals-systems" },
      { name: "Electrical Machines", weightage: "9-11%", type: "Core", href: "/resources/gate-ee/electrical-machines" },
      { name: "Power Systems", weightage: "10-12%", type: "Core", href: "/resources/gate-ee/power-systems" },
      { name: "Control Systems", weightage: "8-10%", type: "Core", href: "/resources/gate-ee/control-systems" },
      { name: "Measurements", weightage: "4-5%", type: "Core", href: "/resources/gate-ee/measurements" },
      { name: "Analog & Digital Electronics", weightage: "7-9%", type: "Core", href: "/resources/gate-ee/analog-digital" },
      { name: "Power Electronics", weightage: "8-10%", type: "Core", href: "/resources/gate-ee/power-electronics" },
    ],
  },
  "gate-ece": {
    name: "Electronics & Communication",
    shortName: "ECE",
    description: "Master GATE ECE with our comprehensive resources. Dive into core electronics, communication systems, and advanced PYQs.",
    theme: {
      text: "text-blue-500",
      bgLight: "bg-blue-500/10",
      bgBadge: "bg-blue-500/20",
      border: "border-blue-500/30",
      borderHover: "hover:border-blue-500/50",
      focus: "focus:border-blue-500/50 focus:ring-blue-500/50",
      glow: "bg-blue-500/5",
      selection: "selection:bg-blue-500/30",
    },
    subjects: [
      { name: "Engineering Mathematics", weightage: "13-15%", type: "Common", href: "/resources/gate-ece/mathematics" },
      { name: "General Aptitude", weightage: "15%", type: "Common", href: "/resources/gate-ece/aptitude" },
      { name: "Networks, Signals & Systems", weightage: "9-11%", type: "Core", href: "/resources/gate-ece/networks-signals" },
      { name: "Electronic Devices", weightage: "8-10%", type: "Core", href: "/resources/gate-ece/electronic-devices" },
      { name: "Analog Circuits", weightage: "9-11%", type: "Core", href: "/resources/gate-ece/analog-circuits" },
      { name: "Digital Circuits", weightage: "8-10%", type: "Core", href: "/resources/gate-ece/digital-circuits" },
      { name: "Control Systems", weightage: "7-9%", type: "Core", href: "/resources/gate-ece/control-systems" },
      { name: "Communications", weightage: "10-12%", type: "Core", href: "/resources/gate-ece/communications" },
      { name: "Electromagnetics", weightage: "8-10%", type: "Core", href: "/resources/gate-ece/electromagnetics" },
    ],
  },
  "gate-cs": {
    name: "Computer Science & IT",
    shortName: "CS",
    description: "Crack GATE CS & IT with optimized study materials, coding concepts, data structures, and in-depth algorithmic analysis.",
    theme: {
      text: "text-purple-500",
      bgLight: "bg-purple-500/10",
      bgBadge: "bg-purple-500/20",
      border: "border-purple-500/30",
      borderHover: "hover:border-purple-500/50",
      focus: "focus:border-purple-500/50 focus:ring-purple-500/50",
      glow: "bg-purple-500/5",
      selection: "selection:bg-purple-500/30",
    },
    subjects: [
      { name: "Discrete Mathematics", weightage: "6-8%", type: "Common", href: "/resources/gate-cs/discrete-math" },
      { name: "Engineering Mathematics", weightage: "5-7%", type: "Common", href: "/resources/gate-cs/mathematics" },
      { name: "General Aptitude", weightage: "15%", type: "Common", href: "/resources/gate-cs/aptitude" },
      { name: "Digital Logic", weightage: "4-6%", type: "Core", href: "/resources/gate-cs/digital-logic" },
      { name: "Computer Organization (COA)", weightage: "7-9%", type: "Core", href: "/resources/gate-cs/coa" },
      { name: "Programming & Data Structures", weightage: "10-12%", type: "Core", href: "/resources/gate-cs/programming-ds" },
      { name: "Algorithms", weightage: "6-8%", type: "Core", href: "/resources/gate-cs/algorithms" },
      { name: "Theory of Computation", weightage: "7-9%", type: "Core", href: "/resources/gate-cs/toc" },
      { name: "Compiler Design", weightage: "4-6%", type: "Core", href: "/resources/gate-cs/compiler" },
      { name: "Operating Systems", weightage: "8-10%", type: "Core", href: "/resources/gate-cs/os" },
      { name: "Databases", weightage: "6-8%", type: "Core", href: "/resources/gate-cs/dbms" },
      { name: "Computer Networks", weightage: "7-9%", type: "Core", href: "/resources/gate-cs/networks" },
    ],
  },
  "gate-ce": {
    name: "Civil Engineering",
    shortName: "CE",
    description: "Build a solid foundation for GATE Civil Engineering. Get access to structural analysis, geotech, and environmental engineering notes.",
    theme: {
      text: "text-amber-500",
      bgLight: "bg-amber-500/10",
      bgBadge: "bg-amber-500/20",
      border: "border-amber-500/30",
      borderHover: "hover:border-amber-500/50",
      focus: "focus:border-amber-500/50 focus:ring-amber-500/50",
      glow: "bg-amber-500/5",
      selection: "selection:bg-amber-500/30",
    },
    subjects: [
      { name: "Engineering Mathematics", weightage: "13-15%", type: "Common", href: "/resources/gate-ce/mathematics" },
      { name: "General Aptitude", weightage: "15%", type: "Common", href: "/resources/gate-ce/aptitude" },
      { name: "Structural Engineering", weightage: "10-12%", type: "Core", href: "/resources/gate-ce/structural" },
      { name: "Geotechnical Engineering", weightage: "14-16%", type: "Core", href: "/resources/gate-ce/geotechnical" },
      { name: "Water Resources Engineering", weightage: "8-10%", type: "Core", href: "/resources/gate-ce/water-resources" },
      { name: "Environmental Engineering", weightage: "10-12%", type: "Core", href: "/resources/gate-ce/environmental" },
      { name: "Transportation Engineering", weightage: "8-10%", type: "Core", href: "/resources/gate-ce/transportation" },
      { name: "Geomatics Engineering", weightage: "4-6%", type: "Core", href: "/resources/gate-ce/geomatics" },
    ],
  },
  "gate-me": {
    name: "Mechanical Engineering",
    shortName: "ME",
    description: "Accelerate your prep for GATE Mechanical Engineering with focused resources on thermodynamics, fluid mechanics, and manufacturing.",
    theme: {
      text: "text-red-500",
      bgLight: "bg-red-500/10",
      bgBadge: "bg-red-500/20",
      border: "border-red-500/30",
      borderHover: "hover:border-red-500/50",
      focus: "focus:border-red-500/50 focus:ring-red-500/50",
      glow: "bg-red-500/5",
      selection: "selection:bg-red-500/30",
    },
    subjects: [
      { name: "Engineering Mathematics", weightage: "13-15%", type: "Common", href: "/resources/gate-me/mathematics" },
      { name: "General Aptitude", weightage: "15%", type: "Common", href: "/resources/gate-me/aptitude" },
      { name: "Applied Mechanics & Design", weightage: "15-17%", type: "Core", href: "/resources/gate-me/mechanics-design" },
      { name: "Fluid Mechanics & Thermal", weightage: "16-18%", type: "Core", href: "/resources/gate-me/fluid-thermal" },
      { name: "Materials & Manufacturing", weightage: "15-17%", type: "Core", href: "/resources/gate-me/manufacturing" },
    ],
  },
  "gate-in": {
    name: "Instrumentation Engineering",
    shortName: "IN",
    description: "Precision preparation for GATE IN. Master process control, sensors, transducers, and industrial instrumentation.",
    theme: {
      text: "text-teal-500",
      bgLight: "bg-teal-500/10",
      bgBadge: "bg-teal-500/20",
      border: "border-teal-500/30",
      borderHover: "hover:border-teal-500/50",
      focus: "focus:border-teal-500/50 focus:ring-teal-500/50",
      glow: "bg-teal-500/5",
      selection: "selection:bg-teal-500/30",
    },
    subjects: [
      { name: "Engineering Mathematics", weightage: "13-15%", type: "Common", href: "/resources/gate-in/mathematics" },
      { name: "General Aptitude", weightage: "15%", type: "Common", href: "/resources/gate-in/aptitude" },
      { name: "Electrical Circuits", weightage: "7-9%", type: "Core", href: "/resources/gate-in/circuits" },
      { name: "Signals & Systems", weightage: "8-10%", type: "Core", href: "/resources/gate-in/signals" },
      { name: "Control Systems", weightage: "9-11%", type: "Core", href: "/resources/gate-in/control" },
      { name: "Analog & Digital", weightage: "10-12%", type: "Core", href: "/resources/gate-in/analog-digital" },
      { name: "Measurements", weightage: "8-10%", type: "Core", href: "/resources/gate-in/measurements" },
      { name: "Sensors & Instrumentation", weightage: "10-12%", type: "Core", href: "/resources/gate-in/sensors" },
      { name: "Optical Instrumentation", weightage: "4-6%", type: "Core", href: "/resources/gate-in/optical" },
    ],
  },
};

export type BranchKey = keyof typeof branchData;