export const SITE = {
  name: 'Luxit',
  tagline: 'IT Solutions & AI Transformation at Your Service',
  description: 'Luxit empowers enterprises with end-to-end technology solutions — from AI strategy and automation to hospitality IT infrastructure. We transform operations across industries with precision and innovation.',
  url: 'https://luxit.io',
  email: 'hello@luxit.io',
} as const

export const SERVICES = [
  {
    title: 'AI Strategy & Consulting',
    description: 'From assessment to strategic planning, we map your AI transformation journey with precision.',
    icon: 'Brain' as const,
    features: ['AI Readiness Assessment', 'Technology Roadmap', 'Use Case Identification', 'ROI Modeling'],
  },
  {
    title: 'AI Agent Development',
    description: 'Custom AI agents that automate workflows, qualify leads, and drive revenue 24/7.',
    icon: 'Bot' as const,
    features: ['Custom Agent Builds', 'Multi-Agent Systems', 'OpenClaw Integration', 'Agent-as-a-Service'],
  },
  {
    title: 'Process Automation',
    description: 'Intelligent automation that transforms operations with measurable efficiency gains.',
    icon: 'Workflow' as const,
    features: ['Workflow Automation', 'Data Pipeline Design', 'Integration Architecture', 'Performance Optimization'],
  },
  {
    title: 'Training & Enablement',
    description: 'Equip your teams with AI skills and frameworks for sustainable adoption.',
    icon: 'GraduationCap' as const,
    features: ['Team Training Programs', 'AI Literacy Workshops', 'Change Management', 'Continuous Learning'],
  },
] as const

export const PHASES = [
  {
    number: '01',
    title: 'Discovery',
    description: 'Diagnose opportunity & readiness. We analyze your operations, identify high-impact AI use cases, and assess organizational readiness.',
    duration: '2-3 weeks',
  },
  {
    number: '02',
    title: 'Strategy',
    description: 'Design solutions & adoption plan. We architect your AI roadmap, select technologies, and create a phased implementation plan.',
    duration: '2-4 weeks',
  },
  {
    number: '03',
    title: 'Implementation',
    description: 'Full-scale deployment with change support. We build, integrate, and deploy AI solutions with comprehensive change management.',
    duration: '6-12 weeks',
  },
  {
    number: '04',
    title: 'Scaling',
    description: 'Expand, optimize, and extend AI continuously. We help you scale what works, optimize performance, and identify new opportunities.',
    duration: 'Ongoing',
  },
] as const

export const STATS = [
  { value: '14x', label: 'Average ROI for clients' },
  { value: '67%', label: 'Faster time to value' },
  { value: '89%', label: 'Process efficiency gain' },
  { value: '24/7', label: 'AI agent availability' },
] as const

export const INDUSTRIES = [
  'Hospitality',
  'Healthcare',
  'Financial Services',
  'Real Estate',
  'E-Commerce',
  'Legal',
  'Manufacturing',
  'Professional Services',
  'Technology',
] as const

export const HOSPITALITY_SERVICES = [
  {
    title: 'Network & Wi-Fi Solutions',
    description: 'Future-proof network infrastructure and reliable Wi-Fi systems with secure guest and employee segments.',
  },
  {
    title: 'VoIP & Communications',
    description: 'Elevate guest communications with cutting-edge VoIP solutions for high-quality interactions.',
  },
  {
    title: 'In-Room Entertainment',
    description: 'Tailor-made entertainment systems from interactive options to streaming services for memorable stays.',
  },
  {
    title: 'Security & Access Control',
    description: 'Comprehensive facility security with advanced CCTV surveillance and access control systems.',
  },
  {
    title: 'Digital Signage & Wayfinding',
    description: 'Engage and guide guests with interactive digital signage and wayfinding solutions.',
  },
  {
    title: 'Meeting Rooms & Conferencing',
    description: 'Transform conference spaces with cutting-edge technology for premium event hosting.',
  },
  {
    title: 'Technology Procurement',
    description: 'Streamlined supplier selection and provisioning for maximum cost efficiency and economies of scale.',
  },
  {
    title: 'Managed IT Support',
    description: 'Proactive IT support, responsive help desk, and back-office optimization for your property.',
  },
] as const

export const ASSESSMENT_QUESTIONS = [
  {
    id: 'data_readiness',
    category: 'Data Infrastructure',
    question: 'How would you describe your organization\'s data infrastructure?',
    options: [
      { value: 1, label: 'Mostly manual processes, spreadsheets, no centralized data' },
      { value: 2, label: 'Some digital systems but data is siloed across departments' },
      { value: 3, label: 'Centralized data warehouse with some integration' },
      { value: 4, label: 'Well-integrated data infrastructure with APIs and automation' },
      { value: 5, label: 'Advanced data platform with real-time pipelines and governance' },
    ],
  },
  {
    id: 'process_maturity',
    category: 'Process Maturity',
    question: 'How standardized are your core business processes?',
    options: [
      { value: 1, label: 'Ad-hoc, varies by team or individual' },
      { value: 2, label: 'Some processes documented but inconsistently followed' },
      { value: 3, label: 'Key processes standardized with some automation' },
      { value: 4, label: 'Most processes standardized with workflow automation' },
      { value: 5, label: 'Fully optimized processes with continuous improvement' },
    ],
  },
  {
    id: 'team_capability',
    category: 'Team & Culture',
    question: 'What is your team\'s current AI/ML expertise level?',
    options: [
      { value: 1, label: 'No AI expertise, limited technical skills' },
      { value: 2, label: 'Basic awareness, a few tech-savvy individuals' },
      { value: 3, label: 'Some team members with data/analytics skills' },
      { value: 4, label: 'Dedicated data team with some AI experience' },
      { value: 5, label: 'Strong AI/ML team with production experience' },
    ],
  },
  {
    id: 'tech_stack',
    category: 'Technology Stack',
    question: 'How would you rate your current technology infrastructure?',
    options: [
      { value: 1, label: 'Legacy systems, minimal cloud adoption' },
      { value: 2, label: 'Beginning cloud migration, some modern tools' },
      { value: 3, label: 'Hybrid cloud with API-first architecture' },
      { value: 4, label: 'Cloud-native with modern DevOps practices' },
      { value: 5, label: 'Advanced cloud-native with microservices and CI/CD' },
    ],
  },
  {
    id: 'strategic_alignment',
    category: 'Strategic Alignment',
    question: 'How does AI fit into your organization\'s strategic vision?',
    options: [
      { value: 1, label: 'AI is not part of our current strategy' },
      { value: 2, label: 'Exploring AI possibilities, no formal plans' },
      { value: 3, label: 'AI initiatives planned with allocated budget' },
      { value: 4, label: 'AI is a key strategic priority with executive sponsorship' },
      { value: 5, label: 'AI-first culture with transformation already underway' },
    ],
  },
  {
    id: 'pain_points',
    category: 'Business Impact',
    question: 'What is the biggest challenge AI could address for your business?',
    options: [
      { value: 1, label: 'Reducing manual, repetitive tasks' },
      { value: 2, label: 'Improving customer experience and response times' },
      { value: 3, label: 'Better data-driven decision making' },
      { value: 4, label: 'Scaling operations without proportional headcount' },
      { value: 5, label: 'Creating new revenue streams and competitive advantages' },
    ],
  },
] as const
