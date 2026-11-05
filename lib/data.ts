// Single source of truth for site content. Edit here; the UI updates everywhere.

export const profile = {
  name: "Voicu Tulai",
  firstName: "Voicu",
  lastName: "Tulai",
  role: "Engineering Leader",
  title: "Director, Software Engineering",
  location: "Port Moody, BC",
  tagline:
    "Hands-on engineering leader scaling teams, platforms and the AI-native software delivery lifecycle across Nokia, HERE and Salesforce / Tableau.",
  summary:
    "Hands-on, high-performing engineering leader with extensive experience scaling teams and architecture across organizations of all sizes. I combine strategic vision with a bias for action, bridging deep system design and coding expertise with people leadership to foster trust, multiply team performance, and deliver customer-centric value.",
  summaryCoda:
    "Throughout my career, as a people leader, architect, and developer, I have consistently been rated as a top performer.",
};

// Contact links. Leave a value empty ("") to hide it from the site.
export const contact = {
  email: "vtulai@yahoo.com",
  linkedin: "https://www.linkedin.com/in/voicu-tulai/",
  github: "https://github.com/vtulai70",
  phone: "", // e.g. "(555) 555-5555"
  location: "Port Moody, BC",
};

export const stats = [
  { value: 29, suffix: "+", label: "Years building software", sub: "Since 1997" },
  { value: 30, suffix: "+", label: "Engineers & managers led", sub: "Across 5 teams" },
  { value: 40, suffix: "%", label: "Inner-loop time reduction", sub: "Developer experience" },
  { value: 100, prefix: "$", suffix: "M+", label: "Revenue program managed", sub: "HERE Technologies" },
];

export const pillars = [
  {
    index: "01",
    title: "Developer Productivity & Software Delivery",
    body: "Adapting internal SDLC platforms to AI-assisted workflows, driving results through data-informed decisions, cross-functional alignment, and streamlined team structures.",
    tags: ["CI/CD", "DORA metrics", "Inner loop"],
  },
  {
    index: "02",
    title: "Team Growth & Leadership",
    body: "Building empowering engineering environments, coaching engineering managers and senior talent, and holding a rigorous technical bar.",
    tags: ["Coaching", "Org design", "Hiring"],
  },
  {
    index: "03",
    title: "AI Integration & Technology Adoption",
    body: "Guiding the cultural and technical transformations that unlock the full potential of AI-native software development.",
    tags: ["Agentic workflows", "LLMs", "MCP"],
  },
];

export const competencies = [
  "Engineering leadership",
  "System architecture & development",
  "Product management",
  "Program management",
  "Strategic planning",
  "Continuous integration & software delivery",
  "AI-assisted development & workflows",
  "Agile & KPI-based prioritization",
];

export const tools = [
  { name: "AWS", group: "Cloud" },
  { name: "Kubernetes", group: "Cloud" },
  { name: "Docker", group: "Cloud" },
  { name: "Terraform", group: "Cloud" },
  { name: "Python", group: "Code" },
  { name: "C++", group: "Code" },
  { name: "JavaScript", group: "Code" },
  { name: "SQL", group: "Data" },
  { name: "Tableau", group: "Data" },
  { name: "OpenAI SDK", group: "AI" },
  { name: "LangChain", group: "AI" },
  { name: "LangGraph", group: "AI" },
  { name: "Claude Code", group: "AI" },
  { name: "MCP", group: "AI" },
];

export type Role = {
  company: string;
  org?: string;
  title: string;
  start: number;
  end: number | "Present";
  era: string;
  highlights: string[];
  tags: string[];
};

export const career: Role[] = [
  {
    company: "Salesforce",
    org: "Tableau",
    title: "Director, Software Engineering",
    start: 2021,
    end: 2026,
    era: "AI-native delivery",
    highlights: [
      "Led the Developer Experience and Software Delivery group for core Tableau products: 5 teams, 30+ developers and managers spanning developer experience, releases, security, compliance, and cost efficiency.",
      "Restructured CI/CD systems for AI-assisted development with dynamic scaling, warm agents, AI-driven failure analysis and self-healing, Terraform migration, containerization, and modern branching models.",
      "Drove significant improvements in lead time for changes, MTTR, and deployment frequency.",
      "Migrated CI/CD infrastructure to AWS and decommissioned the legacy Tableau data centres.",
      "Re-architected end-to-end testing frameworks onto standard orchestration, cutting the code footprint by 50% while increasing parallelism, observability, and maintainability.",
      "Grew and mentored high-performing leaders and globally distributed engineering teams.",
    ],
    tags: ["AWS", "Terraform", "AI ops", "DORA", "Leadership"],
  },
  {
    company: "Salesforce",
    org: "Tableau",
    title: "Senior Product Manager",
    start: 2019,
    end: 2020,
    era: "Product thinking",
    highlights: [
      "Owned strategy and roadmaps for the Developer Experience and Software Delivery teams.",
      "Defined, prioritized, and delivered features that reduced inner-loop time by 40%, improved developer experience, and lowered operational costs.",
      "Established the teams' key performance metrics with an integrated tracking and reporting framework.",
    ],
    tags: ["Roadmaps", "KPIs", "DevEx"],
  },
  {
    company: "HERE Technologies",
    title: "Senior Engineering Manager",
    start: 2013,
    end: 2019,
    era: "Platforms & monetization",
    highlights: [
      "Built a 10-developer agile team from scratch, delivering services for customer account lifecycle management, automated billing, and customer analytics across all company products.",
      "Implemented multiple developer business models, including freemium tiers.",
      "Built an analytics pipeline exposing customer usage patterns across SDKs and cloud services to inform product strategy.",
    ],
    tags: ["Billing", "Analytics", "Team building"],
  },
  {
    company: "HERE Technologies",
    title: "Senior Program Manager",
    start: 2012,
    end: 2013,
    era: "Platforms & monetization",
    highlights: [
      "Managed one of the company's core strategic programs, generating over $100M in revenue.",
    ],
    tags: ["Strategic program", "$100M+"],
  },
  {
    company: "Nokia",
    title: "Lead Software Architect",
    start: 2007,
    end: 2012,
    era: "The mobile era",
    highlights: [
      "Architected and delivered key Nokia services, including the Nokia App Store, Client Platform, N-Gage, and the Music / Multimedia Frameworks.",
    ],
    tags: ["Architecture", "App Store", "N-Gage"],
  },
  {
    company: "Nokia",
    title: "Lead Software Designer (Contract)",
    start: 2004,
    end: 2007,
    era: "The mobile era",
    highlights: [
      "Managed a contracted engineering team developing the Nokia Multimedia Framework and Application Management System.",
    ],
    tags: ["Multimedia", "Symbian"],
  },
  {
    company: "Intrinsyc Software",
    title: "Applications Group Lead",
    start: 2000,
    end: 2007,
    era: "Embedded foundations",
    highlights: [
      "Owned full-lifecycle delivery from proposal and requirements through development and testing across diverse client projects.",
      "Networking team lead for the Symbian CDMA stack and architect on Windows CE initiatives.",
      "Instructed official developer training courses for Windows CE and Symbian OS.",
    ],
    tags: ["Symbian", "Windows CE", "Networking"],
  },
];

export const earlierRoles = [
  { title: "Lead Software Engineer / Part Owner", company: "CT Technologies", years: "1999 – 2004" },
  { title: "R&D Manager", company: "Pinpoint Technologies", years: "1997 – 2000" },
  { title: "Senior Software Engineer", company: "Glenayre Technologies", years: "1997 – 1998" },
];

export const education = {
  degree: "M.Sc.",
  school: "Polytechnic University Timisoara",
  year: "1995",
};

export const certifications = {
  featured: [
    "AI Engineer Production Track: Deploy LLMs & Agents at Scale",
    "AI Leader: Generative AI & Agentic AI for Leaders & Founders",
    "AI Engineer Agentic Track: The Complete Agent & MCP Course",
    "Claude Code: Agent Skills, Agent Loop, Code Agents, MCP",
  ],
  other: [
    "Strategic Innovation for Team Leaders",
    "Java, PHP, and Web Application Security",
    "Present with Power",
    "Salesforce Trailhead Ranger",
    "Salesforce Certified Scrum Master",
    "Learning Terraform",
  ],
};

export type Hobby = {
  name: string;
  stat: string;
  statLabel: string;
  detail: string;
  places?: string[];
};

export const hobbies: Hobby[] = [
  {
    name: "Scuba diving",
    stat: "250+",
    statLabel: "dives",
    detail: "Diving in BC and internationally. Rescue Diver, with Nitrox and Wreck certifications.",
  },
  {
    name: "Sea kayaking",
    stat: "L2",
    statLabel: "Paddle Canada",
    detail: "Paddle Canada Level 2 certified, with many kayaking expeditions in BC.",
  },
  {
    name: "Trail running",
    stat: "50k",
    statLabel: "races",
    detail: "Several 50k races, including the Diez Vista 50k and the Frosty 50k.",
  },
  {
    name: "Backpacking",
    stat: "8+",
    statLabel: "trails & parks",
    detail: "Many multi-day trips across BC and Alberta.",
    places: [
      "North Coast Trail",
      "Nootka Trail",
      "West Coast Trail",
      "Juan de Fuca Trail",
      "Mount Assiniboine",
      "Skoki Valley",
      "Rockwall",
      "Manning Park",
    ],
  },
];

// Professional interests, drawn from the resume summary. Shown on the site and given to the twin.
export const currentFocus = [
  "AI-native software development",
  "Agentic workflows & MCP",
  "Developer productivity",
  "CI/CD & software delivery",
  "Growing engineering leaders",
];

export const volunteering = [
  { role: "Coral Reef Conservation Volunteer", org: "Reef Renewal Foundation Bonaire" },
  { role: "Sea Turtle Conservation Volunteer", org: "ProTECTOR Inc" },
];

// Portfolio slots. Set `href` and `status: "live"` when a piece is ready.
export type PortfolioItem = {
  kind: string;
  title: string;
  blurb: string;
  href: string;
  status: "live" | "soon";
};

export const portfolio: PortfolioItem[] = [
  {
    kind: "Case studies",
    title: "Platform transformations",
    blurb: "Deep dives into CI/CD re-architecture, cloud migration, and measurable delivery gains.",
    href: "",
    status: "soon",
  },
  {
    kind: "AI engineering",
    title: "Agents & experiments",
    blurb: "Agentic workflows, MCP integrations, and LLM tooling built with LangGraph and Claude Code.",
    href: "",
    status: "soon",
  },
  {
    kind: "Writing",
    title: "Notes on leadership",
    blurb: "Essays on scaling teams, developer experience, and leading AI-native engineering orgs.",
    href: "",
    status: "soon",
  },
  {
    kind: "Talks",
    title: "Speaking & workshops",
    blurb: "Talks and workshops on software delivery, platform strategy, and AI adoption.",
    href: "",
    status: "soon",
  },
];

export const nav = [
  { id: "about", label: "About" },
  { id: "journey", label: "Journey" },
  { id: "capabilities", label: "Capabilities" },
  { id: "portfolio", label: "Portfolio" },
  { id: "contact", label: "Contact" },
];
