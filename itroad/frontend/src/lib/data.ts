import {
  Cloud, Brain, Code2, ShieldCheck, Network, Smartphone, Database, LineChart,
  HeartPulse, Landmark, ShoppingBag, GraduationCap, Building2, Factory,
  type LucideIcon,
} from 'lucide-react';

export type Service = {
  id: string;
  icon: LucideIcon;
  title: string;
  short: string;
  description: string;
  features: string[];
  accent: string;
};

export const services: Service[] = [
  {
    id: 'cloud',
    icon: Cloud,
    title: 'Cloud Solutions',
    short: 'Migrate, optimize, and scale on the cloud.',
    description: 'Cloud architecture, migration, and managed services across AWS, Azure, and Google Cloud.',
    features: ['Cloud Migration', 'Multi-Cloud Strategy', 'DevOps & CI/CD', 'Cost Optimization'],
    accent: 'from-brand-500 to-brand-700',
  },
  {
    id: 'ai',
    icon: Brain,
    title: 'AI & Data',
    short: 'Intelligent systems that learn and adapt.',
    description: 'Machine learning, NLP, computer vision, and data platforms that turn data into decisions.',
    features: ['Machine Learning', 'Generative AI', 'Data Engineering', 'MLOps'],
    accent: 'from-electric-500 to-cyan-500',
  },
  {
    id: 'software',
    icon: Code2,
    title: 'Custom Software',
    short: 'Tailored platforms built for scale.',
    description: 'Enterprise applications, web and mobile platforms engineered for performance and longevity.',
    features: ['Web Platforms', 'Mobile Apps', 'API & Microservices', 'Legacy Modernization'],
    accent: 'from-brand-600 to-electric-500',
  },
  {
    id: 'cybersecurity',
    icon: ShieldCheck,
    title: 'Cybersecurity',
    short: 'Protect what matters most.',
    description: 'Security assessments, SOC services, and zero-trust architecture for regulated industries.',
    features: ['Security Audits', 'SOC & Monitoring', 'Zero-Trust', 'Compliance'],
    accent: 'from-navy-700 to-brand-700',
  },
  {
    id: 'infrastructure',
    icon: Network,
    title: 'Infrastructure',
    short: 'Resilient networks and systems.',
    description: 'Network design, data center solutions, and IT infrastructure management for enterprises.',
    features: ['Network Design', 'Data Center', 'System Integration', 'Managed IT'],
    accent: 'from-brand-500 to-navy-600',
  },
  {
    id: 'digital',
    icon: Smartphone,
    title: 'Digital Transformation',
    short: 'Reimagine how your business operates.',
    description: 'End-to-end transformation strategy, process automation, and change management.',
    features: ['Strategy & Roadmap', 'Process Automation', 'Change Management', 'Digital Operations'],
    accent: 'from-electric-500 to-brand-600',
  },
];

export type Industry = {
  id: string;
  icon: LucideIcon;
  name: string;
  description: string;
  accent: string;
  accentText: string;
};

export const industries: Industry[] = [
  { id: 'healthcare', icon: HeartPulse, name: 'Healthcare', description: 'HIPAA-compliant platforms, telemedicine, and clinical data systems.', accent: 'from-rose-500 to-pink-600', accentText: 'text-rose-600' },
  { id: 'finance', icon: Landmark, name: 'Finance', description: 'Banking platforms, payment systems, and regulatory technology.', accent: 'from-emerald-500 to-teal-600', accentText: 'text-emerald-600' },
  { id: 'retail', icon: ShoppingBag, name: 'Retail', description: 'E-commerce, omnichannel commerce, and inventory intelligence.', accent: 'from-amber-500 to-orange-600', accentText: 'text-amber-600' },
  { id: 'education', icon: GraduationCap, name: 'Education', description: 'Learning platforms, student information systems, and EdTech.', accent: 'from-violet-500 to-purple-600', accentText: 'text-violet-600' },
  { id: 'government', icon: Building2, name: 'Government', description: 'Secure e-government, digital identity, and public sector platforms.', accent: 'from-brand-500 to-navy-700', accentText: 'text-brand-600' },
  { id: 'manufacturing', icon: Factory, name: 'Manufacturing', description: 'Industry 4.0, IoT, and smart factory solutions.', accent: 'from-cyan-500 to-electric-600', accentText: 'text-cyan-600' },
];

export type Stat = { value: number; suffix: string; label: string };

export const stats: Stat[] = [
  { value: 15, suffix: '+', label: 'Years of Expertise' },
  { value: 250, suffix: '+', label: 'Projects Delivered' },
  { value: 60, suffix: '+', label: 'Enterprise Clients' },
  { value: 98, suffix: '%', label: 'Client Retention' },
];

export type Partner = {
  name: string;
  src: string;
};

export const partners: Partner[] = [
  { name: 'Axway', src: '/logos/Axway.png' },
  { name: 'Apigee', src: '/logos/apigee.webp' },
  { name: 'CloudBees', src: '/logos/CloudBees.webp' },
  { name: 'Denodo', src: '/logos/denodo.webp' },
  { name: 'Google Cloud', src: '/logos/google_cloud.webp' },
  { name: 'Huawei', src: '/logos/Huawei.webp' },
  { name: 'Liferay', src: '/logos/Liferay.png' },
  { name: 'Microsoft Data Platform', src: '/logos/microsoft_data_platform.png' },
  { name: 'Report One', src: '/logos/reportone.png' },
  { name: 'Talend', src: '/logos/Logo-talend.jpg' },
  { name: 'WSO2', src: '/logos/wso2.webp' },
];

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  company: string;
};

export const testimonials: Testimonial[] = [
  {
    quote: 'ITROAD transformed our entire infrastructure. Their team delivered ahead of schedule and exceeded every milestone.',
    author: 'Ahmed Benali',
    role: 'CTO',
    company: 'Mediterranean Bank',
  },
  {
    quote: 'The AI platform they built reduced our processing time by 70%. A truly strategic technology partner.',
    author: 'Sarah Mitchell',
    role: 'VP of Operations',
    company: 'GlobalHealth Systems',
  },
  {
    quote: 'Professional, innovative, and reliable. ITROAD understood our business before they wrote a single line of code.',
    author: 'Karim Haddad',
    role: 'Digital Director',
    company: 'Ministry of Digital Affairs',
  },
];

export type TimelineItem = { year: string; title: string; description: string };

export const timeline: TimelineItem[] = [
  { year: '2009', title: 'Founded', description: 'ITROAD Group established with a vision for enterprise digital transformation.' },
  { year: '2013', title: 'Regional Expansion', description: 'Opened offices across North Africa and the Middle East.' },
  { year: '2017', title: 'Cloud & AI Division', description: 'Launched dedicated cloud and artificial intelligence practices.' },
  { year: '2020', title: 'Global Partnerships', description: 'Achieved top-tier partnerships with Microsoft, AWS, and Google Cloud.' },
  { year: '2024', title: '250+ Projects', description: 'Surpassed 250 enterprise projects delivered across 6 industries.' },
];

export type Value = { icon: LucideIcon; title: string; description: string };

export const values: Value[] = [
  { icon: ShieldCheck, title: 'Integrity', description: 'We build trust through transparency and accountability.' },
  { icon: Brain, title: 'Innovation', description: 'We push boundaries and embrace emerging technologies.' },
  { icon: HeartPulse, title: 'Client-Centric', description: 'Your success defines ours. Every decision starts with the client.' },
  { icon: LineChart, title: 'Excellence', description: 'We hold ourselves to the highest standards in everything we deliver.' },
];

export type Leader = { name: string; role: string; initials: string };

export const leaders: Leader[] = [
  { name: 'Youssef El Amrani', role: 'CEO & Founder', initials: 'YE' },
  { name: 'Leila Ben Salah', role: 'CTO', initials: 'LB' },
  { name: 'Omar Khelifi', role: 'VP of Delivery', initials: 'OK' },
  { name: 'Nadia Trabelsi', role: 'VP of Sales', initials: 'NT' },
];

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  featured?: boolean;
};

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Enterprise Guide to Generative AI in 2026',
    excerpt: 'How leading organizations are deploying GenAI responsibly across operations, customer experience, and product development.',
    category: 'Artificial Intelligence',
    date: 'Jan 15, 2026',
    readTime: '8 min read',
    featured: true,
  },
  {
    id: '2',
    title: 'Cloud Cost Optimization: A Practical Framework',
    excerpt: 'Seven strategies to reduce cloud spend without sacrificing performance or reliability.',
    category: 'Cloud',
    date: 'Jan 8, 2026',
    readTime: '6 min read',
  },
  {
    id: '3',
    title: 'Zero-Trust Architecture for Regulated Industries',
    excerpt: 'A blueprint for implementing zero-trust security in healthcare, finance, and government.',
    category: 'Cybersecurity',
    date: 'Dec 20, 2025',
    readTime: '10 min read',
  },
  {
    id: '4',
    title: 'Why Microservices Fail (And How to Succeed)',
    excerpt: 'Common pitfalls in microservice adoption and the architectural patterns that prevent them.',
    category: 'Software',
    date: 'Dec 12, 2025',
    readTime: '7 min read',
  },
];

export type JobOpening = { title: string; department: string; location: string; type: string };

export const jobOpenings: JobOpening[] = [
  { title: 'Senior Cloud Architect', department: 'Cloud', location: 'Remote', type: 'Full-time' },
  { title: 'AI/ML Engineer', department: 'AI & Data', location: 'Tunis', type: 'Full-time' },
  { title: 'Full-Stack Developer', department: 'Engineering', location: 'Remote', type: 'Full-time' },
  { title: 'DevOps Engineer', department: 'Cloud', location: 'Dubai', type: 'Full-time' },
  { title: 'Security Consultant', department: 'Cybersecurity', location: 'Tunis', type: 'Contract' },
  { title: 'Product Designer', department: 'Design', location: 'Remote', type: 'Full-time' },
];

export type Benefit = { icon: LucideIcon; title: string; description: string };

export const benefits: Benefit[] = [
  { icon: LineChart, title: 'Growth Path', description: 'Clear career progression with mentorship and certifications.' },
  { icon: HeartPulse, title: 'Wellbeing', description: 'Comprehensive health coverage and flexible work arrangements.' },
  { icon: Brain, title: 'Learning', description: 'Annual learning budget and access to top-tier courses.' },
  { icon: Database, title: 'Meaningful Work', description: 'Projects that impact millions of users across industries.' },
];

export type FAQ = { question: string; answer: string };

export const serviceFaqs: FAQ[] = [
  { question: 'How do you price projects?', answer: 'We offer fixed-price, time-and-materials, and dedicated team models. We recommend the best fit after a discovery call.' },
  { question: 'What is your typical timeline?', answer: 'Most enterprise projects run 3–9 months. We provide a detailed roadmap after scoping.' },
  { question: 'Do you offer ongoing support?', answer: 'Yes. We provide managed services, SLAs, and 24/7 support options for all delivered solutions.' },
  { question: 'Can you work with our existing team?', answer: 'Absolutely. We integrate with in-house teams and can augment staff as needed.' },
];

export const contactFaqs: FAQ[] = [
  { question: 'How quickly will you respond?', answer: 'We respond to all inquiries within one business day, often the same day.' },
  { question: 'Do you sign NDAs?', answer: 'Yes, we routinely sign mutual NDAs before detailed discussions.' },
  { question: 'Where are you located?', answer: 'Our headquarters is in Tunis with offices in Dubai and remote teams worldwide.' },
  { question: 'What time zones do you cover?', answer: 'We operate across GMT, CET, and GST time zones with overlap for most clients.' },
];

export type ClientLogo = { name: string; text: string };

export const clientLogos: ClientLogo[] = [
  { name: 'Mediterranean Bank', text: 'MB' },
  { name: 'GlobalHealth Systems', text: 'GHS' },
  { name: 'Ministry of Digital Affairs', text: 'MDA' },
  { name: 'Telecom North Africa', text: 'TNA' },
  { name: 'SmartLogistics', text: 'SL' },
  { name: 'EduTech Platform', text: 'ET' },
  { name: 'RetailChain Group', text: 'RC' },
  { name: 'EnergyCorp', text: 'EC' },
  { name: 'InsurePlus', text: 'IP' },
  { name: 'AgriTech Solutions', text: 'AT' },
];

export type SubsidiaryIcon = 'chart' | 'globe' | 'screen';

export type Subsidiary = {
  id: string;
  name: string;
  addressLines: string[];
  icon: SubsidiaryIcon;
  lat: number;
  lng: number;
  isHQ?: boolean;
  city: string;
};

export const subsidiaries: Subsidiary[] = [
  {
    id: 'itroad-group',
    name: 'ITROAD GROUP',
    addressLines: ['SFFO0558 Compass Building', 'Al Shohada Road, Al Hamra Industrial Zone-FZ', 'Ras Al Khaimah, United Arab Emirates'],
    icon: 'chart',
    lat: 25.665015,
    lng: 55.786285,
    isHQ: true,
    city: 'Dubai, United Arab Emirates',
  },
  {
    id: 'btech',
    name: 'BTECH',
    addressLines: ['8 Ter Place Henri d\'Astier', '94220 Charenton-le-Pont', 'Paris, France'],
    icon: 'chart',
    lat: 48.8566,
    lng: 2.3522,
    city: 'Paris, France',
  },
  {
    id: 'itroad-consulting',
    name: 'ITROAD CONSULTING',
    addressLines: ['3ème étage, Building Optima Business Center', 'Sidi Maarouf', 'Casablanca, Morocco'],
    icon: 'globe',
    lat: 33.5731,
    lng: -7.6298,
    city: 'Casablanca, Morocco',
  },
  {
    id: 'smartway',
    name: 'SMARTWAY',
    addressLines: ['Agadir', 'Morocco'],
    icon: 'globe',
    lat: 30.4278,
    lng: -9.5981,
    city: 'Agadir, Morocco',
  },
  {
    id: 'itroad-technology',
    name: 'ITROAD TECHNOLOGY',
    addressLines: ['C3-1, 3ème étage', 'Centre Cléopâtre, Centre Urbain Nord', '1082 Tunis, Tunisia'],
    icon: 'screen',
    lat: 36.8065,
    lng: 10.1815,
    city: 'Tunis, Tunisia',
  },
  {
    id: 'wikreate',
    name: 'WIKREATE',
    addressLines: ['2ème étage n°4, 18 Rue Al Habacha', 'Casablanca 20130', 'Morocco'],
    icon: 'screen',
    lat: 33.5931,
    lng: -7.5698,
    city: 'Casablanca, Morocco',
  },
];
