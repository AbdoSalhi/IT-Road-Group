import type { Lang } from './i18n';

/* ================================================================
   TRANSLATION DICTIONARY
   Every user-facing string lives here, keyed by language.
   Data arrays (services, industries, etc.) are translated via
   the `data` sub-object so pages can swap content by language.
   ================================================================ */

export type TranslationData = {
  // ---- Navbar ----
  nav: {
    home: string;
    about: string;
    services: string;
    industries: string;
    partners: string;
    blog: string;
    careers: string;
    contact: string;
    bookConsultation: string;
    toggleMenu: string;
    switchLanguage: string;
  };
  // ---- Footer ----
  footer: {
    ctaTitle: string;
    ctaSubtitle: string;
    startConversation: string;
    description: string;
    company: string;
    resources: string;
    getInTouch: string;
    address: string;
    rights: string;
    privacy: string;
    terms: string;
    social: string;
  };
  // ---- Logo aria ----
  logo: {
    ariaHome: string;
  };
  // ---- CTA Section ----
  cta: {
    defaultTitle: string;
    defaultSubtitle: string;
    bookFree: string;
    exploreServices: string;
  };
  // ---- Home: Hero ----
  hero: {
    badge: string;
    title1: string;
    title2: string;
    subtitle: string;
    bookConsultation: string;
    exploreServices: string;
    cards: { label: string; value: string }[];
  };
  // ---- Home: Integrated Expertise ----
  expertise: {
    eyebrow: string;
    title: string;
    subtitle: string;
    learnMore: string;
    bannerText: string;
    exploreAll: string;
    items: { n: string; title: string; body: string; tags: string[]; accent?: boolean }[];
  };
  // ---- Home: Industries preview ----
  homeIndustries: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  // ---- Home: Partners ----
  homePartners: {
    label: string;
  };
  // ---- Home: Testimonials ----
  testimonials: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { quote: string; author: string; role: string; company: string }[];
  };
  // ---- Home: Trusted by clients ----
  trusted: {
    eyebrow: string;
    title: string;
    subtitle: string;
    aria: string;
  };
  // ---- Home: Subsidiaries ----
  subsidiaries: {
    title: string;
    description: string;
  };
  // ---- Stats ----
  stats: { value: number; suffix: string; label: string }[];
  // ---- Services page ----
  services: {
    eyebrow: string;
    subtitle: string;
    requestQuote: string;
    techStack: string;
    processEyebrow: string;
    processTitle: string;
    processSubtitle: string;
    steps: { num: string; title: string; desc: string }[];
    faqEyebrow: string;
    faqTitle: string;
    ctaTitle: string;
    // Section labels used inside each expertise's detail view
    contextLabel: string;
    challengesLabel: string;
    scopeLabel: string;
    methodologyLabel: string;
    deliverablesLabel: string;
    teamLabel: string;
    proofLabel: string;
    prerequisitesLabel: string;
    whyUsLabel: string;
    items: {
      id: string;
      title: string;
      tagline: string;
      context: string;
      challenges: { title: string; description: string }[];
      scope: { title: string; description: string }[];
      methodology: { title: string; description: string }[];
      deliverables: { title: string; description: string }[];
      team: string[];
      proof: string[];
      prerequisites: string[];
      whyUs: string[];
    }[];
    faqs: { question: string; answer: string }[];
  };
  // ---- Industries page ----
  industriesPage: {
    eyebrow: string;
    title1: string;
    title2: string;
    subtitle: string;
    talkExpert: string;
    aiBadge: string;
    aiTitle1: string;
    aiTitle2: string;
    aiText: string;
    aiButton: string;
    ctaTitle: string;
    items: { id: string; name: string; description: string }[];
  };
  // ---- Partners page ----
  partnersPage: {
    eyebrow: string;
    title1: string;
    title2: string;
    subtitle: string;
    certEyebrow: string;
    certTitle: string;
    tiers: { title: string; desc: string }[];
    ctaTitle: string;
  };
  // ---- Blog page ----
  blog: {
    eyebrow: string;
    title1: string;
    title2: string;
    subtitle: string;
    featured: string;
    readArticle: string;
    latestEyebrow: string;
    latestTitle: string;
    newsletterTitle: string;
    newsletterText: string;
    placeholder: string;
    subscribe: string;
    ctaTitle: string;
    posts: { id: string; title: string; excerpt: string; category: string; date: string; readTime: string; featured?: boolean }[];
  };
  // ---- Careers page ----
  careers: {
    eyebrow: string;
    title1: string;
    title2: string;
    subtitle: string;
    cultureEyebrow: string;
    cultureTitle: string;
    cultureSubtitle: string;
    openEyebrow: string;
    openTitle: string;
    openSubtitle: string;
    apply: string;
    ctaTitle: string;
    benefits: { title: string; description: string }[];
    jobs: { title: string; department: string; location: string; type: string }[];
  };
  // ---- Contact page ----
  contact: {
    eyebrow: string;
    title1: string;
    title2: string;
    subtitle: string;
    emailLabel: string;
    officeLabel: string;
    officeValue1: string;
    officeAddressLines: string[];
    // Form
    step: (n: number, total: number) => string;
    step1Title: string;
    step2Title: string;
    step3Title: string;
    next: string;
    prev: string;
    submit: string;
    fullName: string;
    workEmail: string;
    phone: string;
    nameRequiredError: string;
    emailInvalidError: string;
    phoneInvalidError: string;
    successTitle: string;
    successText: string;
    newRequest: string;
    challenges: string[];
    companySizes: string[];
    faqEyebrow: string;
    faqTitle: string;
    faqs: { question: string; answer: string }[];
  };
  // ---- About page ----
  about: {
    eyebrow: string;
    title1: string;
    title2: string;
    subtitle: string;
    missionTitle: string;
    missionText: string;
    visionTitle: string;
    visionText: string;
    journeyEyebrow: string;
    journeyTitle: string;
    journeySubtitle: string;
    valuesEyebrow: string;
    valuesTitle: string;
    leadershipEyebrow: string;
    leadershipTitle: string;
    leadershipSubtitle: string;
    awardsTitle: string;
    awardsText: string;
    awards: string[];
    ctaTitle: string;
    timeline: { year: string; title: string; description: string }[];
    values: { title: string; description: string }[];
    leaders: { name: string; role: string; initials: string }[];
  };
  // ---- 404 ----
  notFound: {
    code: string;
    title: string;
    text: string;
    home: string;
    contact: string;
  };
  // ---- Client logos (aria only — names are brand names) ----
  clientLogosAria: string;
  // ---- AI Chat widget ----
  chat: {
    title: string;
    subtitle: string;
    openLabel: string;
    closeLabel: string;
    minimizeLabel: string;
    placeholder: string;
    send: string;
    greeting: string;
    unavailable: string;
    disclaimer: string;
    typing: string;
  };
};

const en: TranslationData = {
  nav: {
    home: 'Home',
    about: 'Who We Are',
    services: 'Services',
    industries: 'Industries',
    partners: 'Partners',
    blog: 'Blog',
    careers: 'Careers',
    contact: 'Contact',
    bookConsultation: 'Book a Consultation',
    toggleMenu: 'Toggle menu',
    switchLanguage: 'Switch language',
  },
  footer: {
    ctaTitle: "Ready to build what's next?",
    ctaSubtitle: "Let's talk about your project.",
    startConversation: 'Start a Conversation',
    description:
      'Enterprise digital transformation, cloud, AI, and software development for forward-thinking organizations.',
    company: 'Company',
    resources: 'Resources',
    getInTouch: 'Get in Touch',
    address:
      'SFFO0558 Compass Building, Al Shohada Road, Al Hamra Industrial Zone-FZ, Ras Al Khaimah, United Arab Emirates',
    rights: '© 2026 ITROAD Group. All rights reserved.',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    social: 'Social link',
  },
  logo: {
    ariaHome: 'ITROAD Group — go to homepage',
  },
  cta: {
    defaultTitle: "Let's build your future together",
    defaultSubtitle:
      'Book a free consultation with our experts and discover how ITROAD can accelerate your digital journey.',
    bookFree: 'Book a Free Consultation',
    exploreServices: 'Explore Services',
  },
  hero: {
    badge: 'Trusted by 60+ enterprises worldwide',
    title1: 'Digital transformation,',
    title2: 'engineered to last.',
    subtitle:
      'ITROAD Group partners with enterprises to design, build, and scale technology that drives real business outcomes.',
    bookConsultation: 'Book a Free Consultation',
    exploreServices: 'Explore Services',
    cards: [
      { label: 'Cloud', value: 'AWS · Azure · GCP' },
      { label: 'AI & Data', value: 'ML · GenAI · MLOps' },
      { label: 'Software', value: 'Web · Mobile · API' },
      { label: 'Security', value: 'Zero-Trust · SOC' },
    ],
  },
  expertise: {
    eyebrow: 'Integrated Expertise',
    title: 'Five expertises, one rigorous method',
    subtitle:
      'Integrated IT partner for global enterprises — Consulting, Delivery, Data, Cybersecurity, AI, connected by one rigorous method.',
    learnMore: 'Learn more',
    bannerText:
      'Five integrated expertises, one method — certified consulting, delivery, data, cybersecurity and AI for critical enterprises.',
    exploreAll: 'Explore all expertise',
    items: [
      {
        n: '01',
        title: 'Consulting & Audit',
        body: 'Diagnose with rigor, prioritize with method — before committing a single euro of transformation. IS audits, compliance (ISO 27001, RGPD, DNSSI), roadmap.',
        tags: ['CISA', 'COBIT', 'ISO 27001'],
      },
      {
        n: '02',
        title: 'Transformation & Delivery',
        body: 'A digital factory organized by tech pole — Java, .NET, PHP, Data, Mobile — with a dedicated QA team, SAFe agility and DevSecOps built in.',
        tags: ['SAFe', 'DevSecOps', 'PMP'],
      },
      {
        n: '03',
        title: 'Architecture & Data',
        body: 'Structure the IS and industrialize the data foundation. Enterprise architecture, API management, Data Platform, Data Governance.',
        tags: ['Apigee', 'Talend', 'Kubernetes'],
      },
      {
        n: '04',
        title: 'Cybersecurity & Run',
        body: '24/7 SOC/NOC, pentests, compliance and managed hosting. From perimeter defense to data protection across AWS, Azure and GCP.',
        tags: ['SOC 24/7', 'ISO 22301', 'GCP · Azure · AWS'],
      },
      {
        n: '05',
        title: 'AI & Data Science',
        body: 'From use-case framing to MLOps. GenAI agents, LLM integration, predictive ML — grounded on governed data, never a stranded POC.',
        tags: ['GenAI', 'MLOps', 'LLM'],
        accent: true,
      },
    ],
  },
  homeIndustries: {
    eyebrow: 'Industries',
    title: 'Deep expertise across sectors',
    subtitle: 'We understand the unique challenges and regulations of each industry we serve.',
  },
  homePartners: {
    label: 'Technology Partners',
  },
  testimonials: {
    eyebrow: 'Client Stories',
    title: 'Trusted by industry leaders',
    subtitle: "Don't take our word for it. Hear from the organizations we've helped transform.",
    items: [
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
    ],
  },
  trusted: {
    eyebrow: 'Client Trust',
    title: 'They Trust Us',
    subtitle:
      'Leading organizations trust ITROAD Group to deliver innovative, secure and high-quality digital transformation solutions.',
    aria: 'Client logos',
  },
  subsidiaries: {
    title: 'Our Subsidiaries',
    description:
      'IT Road Consulting positions itself as a leading player, both innovative, ambitious, and high-performing, in the fields of information technology and IT governance.',
  },
  stats: [
    { value: 15, suffix: '+', label: 'Years of Expertise' },
    { value: 250, suffix: '+', label: 'Projects Delivered' },
    { value: 60, suffix: '+', label: 'Enterprise Clients' },
    { value: 98, suffix: '%', label: 'Client Retention' },
  ],
  services: {
    eyebrow: 'Services',
    subtitle: 'From strategic audit to AI industrialization, one integrated team covering the full IT value chain — Consulting, Delivery, Architecture, Cybersecurity and AI.',
    requestQuote: 'Request a Quote',
    techStack: 'Technology & Partners',
    processEyebrow: 'How We Work',
    processTitle: 'A proven delivery process',
    processSubtitle: 'Transparent, collaborative, and built for results.',
    steps: [
      { num: '01', title: 'Discover', desc: 'We dive deep into your business, goals, and challenges.' },
      { num: '02', title: 'Design', desc: 'We architect the right solution and create a clear roadmap.' },
      { num: '03', title: 'Develop', desc: 'We build with agile sprints and continuous delivery.' },
      { num: '04', title: 'Deploy', desc: 'We launch, monitor, and optimize for the long term.' },
    ],
    faqEyebrow: 'FAQ',
    faqTitle: 'Common questions',
    ctaTitle: 'Ready to start your project?',
    contextLabel: 'Context',
    challengesLabel: 'The Challenges',
    scopeLabel: 'Our Expertise',
    methodologyLabel: 'How We Work',
    deliverablesLabel: 'Deliverables',
    teamLabel: 'Core Team',
    proofLabel: 'Certifications & References',
    prerequisitesLabel: 'Success Factors',
    whyUsLabel: 'Why IT Road',
    items: [
      {
        id: 'conseil-audit',
        title: 'Consulting & Audit',
        tagline: 'Turn your decisions into a strategic advantage.',
        context: 'Before any digital transformation, we assess your IT landscape, processes and governance to build a clear, prioritized, results-driven roadmap.',
        challenges: [
          { title: 'Complex architecture', description: 'Redundant applications and undocumented architecture slow every decision.' },
          { title: 'Unquantified technical debt', description: 'Invisible technical debt makes investment trade-offs unreliable.' },
          { title: 'Unclear governance', description: 'Blurred roles between IT and business dilute priorities.' },
          { title: 'Compliance risk', description: 'Missing audits expose the business to GDPR, DNSSI or ISO gaps.' },
          { title: 'Misaligned investment', description: 'Budgets committed without visibility into real impact.' },
        ],
        scope: [
          { title: 'Strategic & Organizational Audit', description: 'Align the IT trajectory with business priorities.' },
          { title: 'Technical Audit', description: 'Quantify risk and technical debt before committing budget.' },
          { title: 'IS Master Plan', description: 'Turn a diagnosis into an actionable roadmap.' },
          { title: 'GDPR, DNSSI, ISO Compliance', description: 'Protect the business against regulatory requirements.' },
          { title: 'Governance & Risk Management', description: 'Structure sustainable steering between IT and business.' },
        ],
        methodology: [
          { title: 'Discover', description: 'Scoping workshops with business and IT sponsors, document collection and access to existing tools.' },
          { title: 'Audit', description: 'Structured interviews, landscape mapping and gap analysis against target frameworks.' },
          { title: 'Prioritize', description: 'Findings presented to the steering committee; scenarios co-built with the client.' },
          { title: 'Build the Roadmap', description: 'IS master plan formalized with milestones, dependencies and quick wins.' },
        ],
        deliverables: [
          { title: 'Audit Report', description: 'Findings and gaps, structured by domain and criticality.' },
          { title: 'IS Master Plan', description: 'Prioritized transformation roadmap with milestones and dependencies.' },
          { title: 'Compliance Matrix', description: 'Gap mapping against DNSSI, GDPR and ISO 27001/9001/20000.' },
          { title: 'Governance Plan', description: 'Recommendations for structuring IT and business steering bodies.' },
        ],
        team: ['Senior consultants certified CISA', 'Governance experts certified COBIT', 'Security auditors certified CISSP & CEH', 'Project managers certified PMP', 'ISMS experts certified ISO 27001'],
        proof: ['CISA', 'CISSP', 'CEH', 'COBIT', 'PMP', 'ISO 27001', 'ISO 9001', 'ISO 20000', 'ISO 22301'],
        prerequisites: ['Availability of business & IT sponsors', 'Access to existing documentation & tools', 'Clear audit scope defined upfront'],
        whyUs: ['An independent diagnosis, not tied to a vendor.', 'A view that connects business stakes with technical constraints.', 'Certified consultants guaranteeing audit rigor.', 'A roadmap you can execute the next day.'],
      },
      {
        id: 'transformation-delivery',
        title: 'Transformation & Delivery',
        tagline: 'Accelerate your digital transformation without compromising quality.',
        context: 'Our teams take your projects end-to-end through an agile Digital Factory, DevSecOps practices and results-driven governance.',
        challenges: [
          { title: 'Long delays', description: 'A stretched delivery delays time-to-market and erodes sponsor trust.' },
          { title: 'Inconsistent quality', description: 'Surface-level agility lets defects slip into production.' },
          { title: 'Technical silos', description: 'Poor dev/ops communication creates friction at deployment.' },
          { title: 'No industrialization', description: 'Without CI/CD, every release stays risky and manual.' },
        ],
        scope: [
          { title: 'Agile Digital Factory', description: 'Absorb variable delivery load without losing quality.' },
          { title: 'DevSecOps', description: 'Integrate security and operations from the design phase.' },
          { title: 'Independent QA & Testing', description: 'Guarantee measurable quality at every release.' },
          { title: 'PMO & AMOA', description: 'Steer complex programs with clear governance.' },
        ],
        methodology: [
          { title: 'Scoping', description: 'Functional and technical scope defined, tech pole and team sizing chosen.' },
          { title: 'Sprint Planning', description: 'Agile rituals structured under the SAFe framework for multi-team contexts.' },
          { title: 'Agile Development', description: 'Development sprints with independent testing and continuous DevSecOps integration.' },
          { title: 'Deployment', description: 'Production rollout with cutover plan, rollback procedure and reinforced monitoring.' },
        ],
        deliverables: [
          { title: 'Product Backlog', description: 'Prioritized backlog with detailed user stories and complexity estimates.' },
          { title: 'Delivered Increments', description: 'Iterative releases tested and demoed at the end of each sprint.' },
          { title: 'Testing Report', description: 'Summary of automated, load and security test campaigns.' },
          { title: 'Deployment Plan', description: 'Architecture documentation and cutover procedure.' },
        ],
        team: ['Tech leads & developers (Java, .NET, PHP, Mobile)', 'Data scientists & data engineers', 'QA engineers: automation, load, security, performance', 'Certified Scrum Masters & agile coaches', 'PMP-certified project managers & PMO'],
        proof: ['PMP', 'SAFe', 'Scrum Master', 'DevSecOps', 'Java', '.NET', 'React', 'Flutter'],
        prerequisites: ['Product Owner available for backlog priorities', 'Timely access to dev/test environments', 'Agile framework validated upfront'],
        whyUs: ['An industrialized delivery, not a craft one.', 'Quality built into every sprint.', 'Multidisciplinary teams sized to your real need.', 'Continuous, visible deliveries at every stage.'],
      },
      {
        id: 'architecture-data',
        title: 'Architecture & Data',
        tagline: 'Build an evolving, data-driven information system.',
        context: 'We design modern, connected, scalable architectures that put your data to full use.',
        challenges: [
          { title: 'Siloed applications', description: "Systems that don't talk to each other multiply inconsistencies." },
          { title: 'Scattered data', description: 'Data spread across platforms blocks any reliable view.' },
          { title: 'Complex integrations', description: 'Ad hoc integrations slow down every new project.' },
          { title: 'Aging architecture', description: 'A dated core limits new use cases, including AI.' },
        ],
        scope: [
          { title: 'Enterprise & Solution Architecture', description: 'Design an IS able to absorb future change.' },
          { title: 'API Management', description: 'Connect systems without multiplying ad hoc integrations.' },
          { title: 'Data Platform & Governance', description: 'Make data a reliable, usable asset.' },
          { title: 'Business Intelligence & Analytics', description: 'Turn data into decisions.' },
        ],
        methodology: [
          { title: 'Map', description: 'Full inventory of the application catalog and data flows, risk areas identified.' },
          { title: 'Design', description: 'A 360° architecture vision co-built with reference standards and models.' },
          { title: 'Govern', description: 'Data governance model defined and Data Catalog deployed.' },
          { title: 'Industrialize', description: 'Integration strategy via API Management, scaled for future AI use cases.' },
        ],
        deliverables: [
          { title: 'Target Architecture', description: '360° vision and realistic transformation scenarios.' },
          { title: 'IS & Data Mapping', description: 'Documented catalog of the existing application landscape and data flows.' },
          { title: 'Data Governance Model', description: 'Roles, quality processes and governance bodies.' },
          { title: 'Data Platform', description: 'Data Catalog, Data Platform or Warehouse configured for your context.' },
        ],
        team: ['Enterprise & IS architects', 'Solution architects (integration, API Management)', 'Data engineers & data governance experts', 'Business Intelligence specialists'],
        proof: ['Apigee', 'Axway', 'IBM API Connect', 'WSO2', 'Talend', 'Denodo', 'Kubernetes', 'Microsoft Data Platform'],
        prerequisites: ['Business involvement in governance rules', 'Access to existing technical environments', 'Architecture standards agreed upfront'],
        whyUs: ['An architecture built to evolve.', 'A 360° view of your information system.', 'Governed data, the base of every reliable decision.', 'A foundation ready for your future AI use cases.'],
      },
      {
        id: 'cybersecurite-run',
        title: 'Cybersecurity & Run',
        tagline: 'Secure your systems and guarantee their availability.',
        context: 'From cybersecurity to daily operations, we protect your digital assets and keep your services running.',
        challenges: [
          { title: 'Cyberattacks', description: 'The exposure surface grows faster than internal protection.' },
          { title: 'Availability', description: 'Even a brief outage directly hits business and trust.' },
          { title: 'Compliance', description: 'Tightening regulation demands proven, not just declared, compliance.' },
          { title: 'Incident management', description: 'Without continuous monitoring, incidents are caught too late.' },
        ],
        scope: [
          { title: 'SOC & NOC', description: 'Detect and handle incidents before they hit the business.' },
          { title: 'Pentest & Security Audit', description: "Quantify the organization's real risk level." },
          { title: 'IAM & Vulnerability Management', description: 'Durably reduce the exposure surface.' },
          { title: 'Managed Services & TMA', description: 'Guarantee daily service continuity.' },
        ],
        methodology: [
          { title: 'Assess', description: 'Infrastructure audit and service scope defined against target SLAs.' },
          { title: 'Secure', description: 'Black-box/white-box penetration tests, DNSSI, GDPR and ISO 27001 compliance rollout.' },
          { title: 'Supervise', description: 'NOC and SOC deployed for detection and incident handling.' },
          { title: 'Maintain', description: 'Run-mode steering with regular reporting and continuous improvement.' },
        ],
        deliverables: [
          { title: 'Pentest Report', description: 'Summary of penetration tests with a remediation plan.' },
          { title: 'Compliance Dossier', description: 'DNSSI, GDPR and ISO 27001 compliance status.' },
          { title: 'Monitoring Dashboard', description: 'Availability, incident and performance indicators.' },
          { title: 'Service Center Report', description: 'Periodic summary of helpdesk and SOC activity.' },
        ],
        team: ['Cybersecurity engineers: pentest & compliance', 'SOC & NOC experts', 'Cloud architects certified GCP, Azure, AWS', 'Regulatory compliance officers'],
        proof: ['GCP', 'Azure', 'AWS', 'ISO 27005', 'ISO 31000', 'ISO 22301', 'DNSSI', 'RGPD'],
        prerequisites: ['SLAs defined before service start', 'Access to production environments', 'Single point of contact for incidents'],
        whyUs: ['Continuous monitoring, not a one-off check.', 'A measurable reduction of your exposure risk.', 'Guaranteed service continuity, even during incidents.', 'Expert support available over the long run.'],
      },
      {
        id: 'ia-data-science',
        title: 'AI & Data Science',
        tagline: 'Move from experimental AI to value-creating AI.',
        context: 'We design, industrialize and integrate AI solutions that automate processes and transform organizations for the long term.',
        challenges: [
          { title: 'POCs going nowhere', description: 'Most AI projects never reach production.' },
          { title: 'Data quality', description: 'Even a strong model is unusable on unreliable data.' },
          { title: 'AI ROI', description: 'Without a prioritized use case, AI stays costly and unproven.' },
          { title: 'Industrialization', description: 'Moving from prototype to production requires a structured MLOps chain.' },
        ],
        scope: [
          { title: 'AI Use Case Scoping', description: 'Prioritize AI by business value, not technology.' },
          { title: 'GenAI, LLM, Agents', description: 'Automate high-value business processes.' },
          { title: 'Machine Learning & Data Science', description: 'Make decisions reliable through data.' },
          { title: 'MLOps', description: 'Industrialize AI beyond the prototype.' },
        ],
        methodology: [
          { title: 'Identify Use Cases', description: 'Discovery workshops with the business to assess value and feasibility.' },
          { title: 'Build the AI MVP', description: 'Data foundations checked, then iterative development with short validation cycles.' },
          { title: 'Industrialize', description: 'Production deployment with a structured MLOps chain: monitoring, retraining, compliance.' },
          { title: 'Measure & Improve', description: 'Continuous tracking of model performance against defined success criteria.' },
        ],
        deliverables: [
          { title: 'Use Case Scoping Dossier', description: 'Mapping of AI use cases prioritized by value and feasibility.' },
          { title: 'Data Readiness Report', description: 'Data quality status with a remediation plan.' },
          { title: 'GenAI Solution or Model', description: 'Solution developed and validated by business users.' },
          { title: 'MLOps Production Setup', description: 'Production chain with monitoring and governance.' },
        ],
        team: ['AI strategy consultants', 'Data scientists & ML engineers', 'GenAI & LLM integration engineers', 'MLOps engineers for industrialization'],
        proof: ['AWS', 'Azure', 'GCP', 'MLOps', 'GenAI', 'LLM', 'RAG', 'Computer Vision'],
        prerequisites: ['A clear business sponsor per use case', 'Minimum data quality verified upfront', 'Success criteria defined in advance'],
        whyUs: ['AI chosen for its business value, not the technology.', 'Industrialized use cases, not simple demos.', 'Real integration with your existing systems.', 'End-to-end support, from scoping to production.'],
      },
    ],
    faqs: [
      { question: 'How do you price projects?', answer: 'We offer fixed-price, time-and-materials, and dedicated team models. We recommend the best fit after a discovery call.' },
      { question: 'What is your typical timeline?', answer: 'Most enterprise projects run 3–9 months. We provide a detailed roadmap after scoping.' },
      { question: 'Do you offer ongoing support?', answer: 'Yes. We provide managed services, SLAs, and 24/7 support options for all delivered solutions.' },
      { question: 'Can you work with our existing team?', answer: 'Absolutely. We integrate with in-house teams and can augment staff as needed.' },
    ],
  },
  industriesPage: {
    eyebrow: 'Industries',
    title1: 'We understand',
    title2: 'your industry',
    subtitle: 'Sector-specific expertise that means we speak your language and know your challenges.',
    talkExpert: 'Talk to an expert',
    aiBadge: 'AI Solutions',
    aiTitle1: 'The future is intelligent.',
    aiTitle2: "Let's build it together.",
    aiText: 'From generative AI to computer vision, we help you deploy AI that creates real business value.',
    aiButton: 'Schedule a Demo',
    ctaTitle: 'Your industry. Our expertise.',
    items: [
      { id: 'healthcare', name: 'Healthcare', description: 'HIPAA-compliant platforms, telemedicine, and clinical data systems.' },
      { id: 'finance', name: 'Finance', description: 'Banking platforms, payment systems, and regulatory technology.' },
      { id: 'retail', name: 'Retail', description: 'E-commerce, omnichannel commerce, and inventory intelligence.' },
      { id: 'education', name: 'Education', description: 'Learning platforms, student information systems, and EdTech.' },
      { id: 'government', name: 'Government', description: 'Secure e-government, digital identity, and public sector platforms.' },
      { id: 'manufacturing', name: 'Manufacturing', description: 'Industry 4.0, IoT, and smart factory solutions.' },
    ],
  },
  partnersPage: {
    eyebrow: 'Partners',
    title1: 'Stronger',
    title2: 'together',
    subtitle: "We've earned the highest partnership tiers with the world's leading technology companies.",
    certEyebrow: 'Certifications',
    certTitle: 'Verified expertise you can trust',
    tiers: [
      { title: 'Microsoft Gold Partner', desc: 'Certified across cloud, data, and dev competencies.' },
      { title: 'AWS Advanced Consulting', desc: 'Validated expertise in migration and managed services.' },
      { title: 'ISO 27001 Certified', desc: 'Information security management at the highest standard.' },
      { title: 'Google Cloud Partner', desc: 'Specialized in cloud infrastructure and AI/ML.' },
    ],
    ctaTitle: 'Partner with ITROAD',
  },
  blog: {
    eyebrow: 'Blog',
    title1: 'Insights from the',
    title2: 'frontier of tech',
    subtitle: 'Expert perspectives on AI, cloud, security, and digital transformation.',
    featured: 'Featured',
    readArticle: 'Read article',
    latestEyebrow: 'Latest',
    latestTitle: 'More articles',
    newsletterTitle: 'Stay in the loop',
    newsletterText: 'Get the latest insights delivered to your inbox.',
    placeholder: 'you@company.com',
    subscribe: 'Subscribe',
    ctaTitle: 'Have a project in mind?',
    posts: [
      { id: '1', title: 'The Enterprise Guide to Generative AI in 2026', excerpt: 'How leading organizations are deploying GenAI responsibly across operations, customer experience, and product development.', category: 'Artificial Intelligence', date: 'Jan 15, 2026', readTime: '8 min read', featured: true },
      { id: '2', title: 'Cloud Cost Optimization: A Practical Framework', excerpt: 'Seven strategies to reduce cloud spend without sacrificing performance or reliability.', category: 'Cloud', date: 'Jan 8, 2026', readTime: '6 min read' },
      { id: '3', title: 'Zero-Trust Architecture for Regulated Industries', excerpt: 'A blueprint for implementing zero-trust security in healthcare, finance, and government.', category: 'Cybersecurity', date: 'Dec 20, 2025', readTime: '10 min read' },
      { id: '4', title: 'Why Microservices Fail (And How to Succeed)', excerpt: 'Common pitfalls in microservice adoption and the architectural patterns that prevent them.', category: 'Software', date: 'Dec 12, 2025', readTime: '7 min read' },
    ],
  },
  careers: {
    eyebrow: 'Careers',
    title1: 'Build the future',
    title2: 'with us',
    subtitle: 'Join a team of passionate technologists who love solving hard problems.',
    cultureEyebrow: 'Our Culture',
    cultureTitle: 'Where great people do their best work',
    cultureSubtitle: 'We invest in our people because they are our greatest asset.',
    openEyebrow: 'Open Positions',
    openTitle: 'Find your next role',
    openSubtitle: "We're always looking for exceptional talent.",
    apply: 'Apply now',
    ctaTitle: "Don't see your role? Reach out anyway.",
    benefits: [
      { title: 'Growth Path', description: 'Clear career progression with mentorship and certifications.' },
      { title: 'Wellbeing', description: 'Comprehensive health coverage and flexible work arrangements.' },
      { title: 'Learning', description: 'Annual learning budget and access to top-tier courses.' },
      { title: 'Meaningful Work', description: 'Projects that impact millions of users across industries.' },
    ],
    jobs: [
      { title: 'Senior Cloud Architect', department: 'Cloud', location: 'Remote', type: 'Full-time' },
      { title: 'AI/ML Engineer', department: 'AI & Data', location: 'Tunis', type: 'Full-time' },
      { title: 'Full-Stack Developer', department: 'Engineering', location: 'Remote', type: 'Full-time' },
      { title: 'DevOps Engineer', department: 'Cloud', location: 'Dubai', type: 'Full-time' },
      { title: 'Security Consultant', department: 'Cybersecurity', location: 'Tunis', type: 'Contract' },
      { title: 'Product Designer', department: 'Design', location: 'Remote', type: 'Full-time' },
    ],
  },
  contact: {
    eyebrow: 'Contact',
    title1: "Let's start a conversation",
    title2: '',
    subtitle: 'Tell us about your project.',
    emailLabel: 'Email',
    officeLabel: 'Office',
    officeValue1: 'Dubai, United Arab Emirates',
    officeAddressLines: [
      'SFFO0558 Compass Building',
      'Al Shohada Road',
      'Al Hamra Industrial Zone-FZ',
      'Ras Al Khaimah',
      'United Arab Emirates',
    ],
    step: (n: number, total: number) => `Step ${n} / ${total}`,
    step1Title: 'What is your current challenge?',
    step2Title: 'Size of your organization',
    step3Title: 'Your professional contact details',
    next: 'Next',
    prev: 'Previous',
    submit: 'Send my request',
    fullName: 'Full name',
    workEmail: 'Work email',
    phone: 'Phone',
    nameRequiredError: 'Please enter your full name.',
    emailInvalidError: 'Please enter a valid email address.',
    phoneInvalidError: 'Please enter a valid phone number.',
    successTitle: 'Thank you for your request!',
    successText: 'We have received your information. Our team will study your needs and get back to you as soon as possible.',
    newRequest: 'Send a new request',
    challenges: ['AI / Data', 'Cybersecurity', 'Cloud Migration', 'Digital Transformation', 'Software Development', 'Other'],
    companySizes: ['1-10', '11-50', '51-250', '251-1000', '1000+'],
    faqEyebrow: 'FAQ',
    faqTitle: 'Before contacting us',
    faqs: [
      { question: 'How quickly will you respond?', answer: 'We respond to all inquiries within one business day, often the same day.' },
      { question: 'Do you sign NDAs?', answer: 'Yes, we routinely sign mutual NDAs before detailed discussions.' },
      { question: 'Where are you located?', answer: 'Our headquarters is in Tunis with offices in Dubai and remote teams worldwide.' },
      { question: 'What time zones do you cover?', answer: 'We operate across GMT, CET, and GST time zones with overlap for most clients.' },
    ],
  },
  about: {
    eyebrow: 'Who We Are',
    title1: 'We build technology that',
    title2: 'moves enterprises forward.',
    subtitle: 'Since 2009, ITROAD Group has been a trusted partner for digital transformation across the Middle East and Africa.',
    missionTitle: 'Our Mission',
    missionText: 'To empower organizations with innovative technology solutions that create lasting value, drive efficiency, and unlock new possibilities for growth.',
    visionTitle: 'Our Vision',
    visionText: "To be the region's most trusted digital transformation partner, recognized for technical excellence, innovation, and the measurable impact we create for every client.",
    journeyEyebrow: 'Our Journey',
    journeyTitle: 'A track record of growth',
    journeySubtitle: 'From a small team to a regional leader in enterprise technology.',
    valuesEyebrow: 'Our Values',
    valuesTitle: 'What drives us every day',
    leadershipEyebrow: 'Leadership',
    leadershipTitle: 'The people behind ITROAD',
    leadershipSubtitle: 'Experienced leaders committed to delivering excellence.',
    awardsTitle: 'Recognized for excellence',
    awardsText: 'Our work has been recognized by leading industry bodies and partners.',
    awards: ['Microsoft Gold Partner', 'AWS Advanced Consulting', 'ISO 27001 Certified', 'Top Employer 2025'],
    ctaTitle: 'Join 60+ enterprises who trust ITROAD',
    timeline: [
      { year: '2009', title: 'Founded', description: 'ITROAD Group established with a vision for enterprise digital transformation.' },
      { year: '2013', title: 'Regional Expansion', description: 'Opened offices across North Africa and the Middle East.' },
      { year: '2017', title: 'Cloud & AI Division', description: 'Launched dedicated cloud and artificial intelligence practices.' },
      { year: '2020', title: 'Global Partnerships', description: 'Achieved top-tier partnerships with Microsoft, AWS, and Google Cloud.' },
      { year: '2024', title: '250+ Projects', description: 'Surpassed 250 enterprise projects delivered across 6 industries.' },
    ],
    values: [
      { title: 'Integrity', description: 'We build trust through transparency and accountability.' },
      { title: 'Innovation', description: 'We push boundaries and embrace emerging technologies.' },
      { title: 'Client-Centric', description: 'Your success defines ours. Every decision starts with the client.' },
      { title: 'Excellence', description: 'We hold ourselves to the highest standards in everything we deliver.' },
    ],
    leaders: [
      { name: 'Youssef El Amrani', role: 'CEO & Founder', initials: 'YE' },
      { name: 'Leila Ben Salah', role: 'CTO', initials: 'LB' },
      { name: 'Omar Khelifi', role: 'VP of Delivery', initials: 'OK' },
      { name: 'Nadia Trabelsi', role: 'VP of Sales', initials: 'NT' },
    ],
  },
  notFound: {
    code: '404',
    title: 'This page took a wrong turn',
    text: "The page you're looking for doesn't exist or has been moved.",
    home: 'Back to Home',
    contact: 'Contact Us',
  },
  clientLogosAria: 'Client logos',
  chat: {
    title: 'ITROAD Assistant',
    subtitle: 'Ask about our services, industries, or get in touch',
    openLabel: 'Open chat assistant',
    closeLabel: 'Close chat',
    minimizeLabel: 'Minimize chat',
    placeholder: 'Type your message…',
    send: 'Send',
    greeting: "Hi! I'm the ITROAD Group assistant. Ask me anything about our services, industries, or how to get in touch.",
    unavailable: 'The AI assistant is temporarily unavailable. Please try again later or contact our team.',
    disclaimer: 'AI-generated answers based on itroad-group.com content.',
    typing: 'Typing…',
  },
};

const fr: TranslationData = {
  nav: {
    home: 'Accueil',
    about: 'Qui sommes-nous',
    services: 'Services',
    industries: 'Secteurs',
    partners: 'Partenaires',
    blog: 'Blog',
    careers: 'Carrières',
    contact: 'Contact',
    bookConsultation: 'Réserver une consultation',
    toggleMenu: 'Ouvrir le menu',
    switchLanguage: 'Changer de langue',
  },
  footer: {
    ctaTitle: 'Prêt à construire le futur ?',
    ctaSubtitle: 'Parlons de votre projet.',
    startConversation: 'Commencer une conversation',
    description:
      "Transformation numérique d'entreprise, cloud, IA et développement logiciel pour les organisations visionnaires.",
    company: 'Entreprise',
    resources: 'Ressources',
    getInTouch: 'Contact',
    address:
      '3ème étage, Building Optima Business Center, Lotissement Florida Centre Park 1, Sidi Maarouf, Bureau N 31-32-33, 20500, Casablanca',
    rights: '© 2026 ITROAD Group. Tous droits réservés.',
    privacy: 'Politique de confidentialité',
    terms: "Conditions d'utilisation",
    social: 'Lien social',
  },
  logo: {
    ariaHome: 'ITROAD Group — aller à la page d\'accueil',
  },
  cta: {
    defaultTitle: 'Construisons votre avenir ensemble',
    defaultSubtitle:
      "Réservez une consultation gratuite avec nos experts et découvrez comment ITROAD peut accélérer votre transition numérique.",
    bookFree: 'Réserver une consultation gratuite',
    exploreServices: 'Explorer les services',
  },
  hero: {
    badge: 'La confiance de 60+ entreprises dans le monde',
    title1: 'Transformation numérique,',
    title2: 'conçue pour durer.',
    subtitle:
      "ITROAD Group accompagne les entreprises pour concevoir, construire et déployer des technologies qui génèrent de réels résultats.",
    bookConsultation: 'Réserver une consultation gratuite',
    exploreServices: 'Explorer les services',
    cards: [
      { label: 'Cloud', value: 'AWS · Azure · GCP' },
      { label: 'IA & Données', value: 'ML · GenAI · MLOps' },
      { label: 'Logiciel', value: 'Web · Mobile · API' },
      { label: 'Sécurité', value: 'Zero-Trust · SOC' },
    ],
  },
  expertise: {
    eyebrow: 'Expertise intégrée',
    title: 'Cinq expertises, une méthode rigoureuse',
    subtitle:
      "Partenaire IT intégré pour les entreprises mondiales — Conseil, Delivery, Données, Cybersécurité, IA, reliés par une méthode rigoureuse.",
    learnMore: 'En savoir plus',
    bannerText:
      'Cinq expertises intégrées, une méthode — conseil certifié, delivery, données, cybersécurité et IA pour les entreprises critiques.',
    exploreAll: 'Explorer toute notre expertise',
    items: [
      {
        n: '01',
        title: 'Conseil & Audit',
        body: "Diagnostiquer avec rigueur, prioriser avec méthode — avant d'engager un seul euro de transformation. Audit SI, conformité (ISO 27001, RGPD, DNSSI), feuille de route.",
        tags: ['CISA', 'COBIT', 'ISO 27001'],
      },
      {
        n: '02',
        title: 'Transformation & Delivery',
        body: "Une usine digitale organisée par pôle technologique — Java, .NET, PHP, Data, Mobile — avec une équipe QA dédiée, agilité SAFe et DevSecOps intégrés.",
        tags: ['SAFe', 'DevSecOps', 'PMP'],
      },
      {
        n: '03',
        title: 'Architecture & Données',
        body: "Structurer le SI et industrialiser la fondation de données. Architecture d'entreprise, gestion d'API, Data Platform, Gouvernance des Données.",
        tags: ['Apigee', 'Talend', 'Kubernetes'],
      },
      {
        n: '04',
        title: 'Cybersécurité & Run',
        body: 'SOC/NOC 24/7, pentests, conformité et hébergement géré. De la défense du périmètre à la protection des données sur AWS, Azure et GCP.',
        tags: ['SOC 24/7', 'ISO 22301', 'GCP · Azure · AWS'],
      },
      {
        n: '05',
        title: 'IA & Data Science',
        body: "Du cadrage des cas d'usage au MLOps. Agents GenAI, intégration LLM, ML prédictif — fondés sur des données gouvernées, jamais un POC isolé.",
        tags: ['GenAI', 'MLOps', 'LLM'],
        accent: true,
      },
    ],
  },
  homeIndustries: {
    eyebrow: 'Secteurs',
    title: 'Expertise approfondie par secteur',
    subtitle: 'Nous comprenons les défis et réglementations uniques de chaque secteur que nous servons.',
  },
  homePartners: {
    label: 'Partenaires technologiques',
  },
  testimonials: {
    eyebrow: 'Témoignages clients',
    title: 'La confiance des leaders du secteur',
    subtitle: "Ne nous croyez pas sur parole. Écoutez les organisations que nous avons aidées à se transformer.",
    items: [
      {
        quote: "ITROAD a transformé toute notre infrastructure. Leur équipe a livré en avance et dépassé chaque étape.",
        author: 'Ahmed Benali',
        role: 'CTO',
        company: 'Mediterranean Bank',
      },
      {
        quote: "La plateforme IA qu'ils ont construite a réduit notre temps de traitement de 70 %. Un véritable partenaire technologique stratégique.",
        author: 'Sarah Mitchell',
        role: 'VP des Opérations',
        company: 'GlobalHealth Systems',
      },
      {
        quote: "Professionnels, innovants et fiables. ITROAD a compris notre métier avant d'écrire une seule ligne de code.",
        author: 'Karim Haddad',
        role: 'Directeur Digital',
        company: 'Ministère des Affaires Numériques',
      },
    ],
  },
  trusted: {
    eyebrow: 'Confiance client',
    title: 'Ils nous font confiance',
    subtitle:
      'Les organisations leaders font confiance à ITROAD Group pour des solutions de transformation numérique innovantes, sécurisées et de haute qualité.',
    aria: 'Logos clients',
  },
  subsidiaries: {
    title: 'Nos filiales',
    description:
      "IT Road Consulting se positionne comme un acteur majeur, à la fois innovant, ambitieux et performant, dans les domaines des technologies de l'information et de la gouvernance IT.",
  },
  stats: [
    { value: 15, suffix: '+', label: "Années d'expertise" },
    { value: 250, suffix: '+', label: 'Projets livrés' },
    { value: 60, suffix: '+', label: 'Clients entreprises' },
    { value: 98, suffix: '%', label: 'Rétention client' },
  ],
  services: {
    eyebrow: 'Services',
    subtitle: "De l'audit stratégique à l'industrialisation de l'IA, une équipe intégrée sur toute la chaîne de valeur IT — Conseil, Delivery, Architecture, Cybersécurité et IA.",
    requestQuote: 'Demander un devis',
    techStack: 'Technologies & Partenaires',
    processEyebrow: 'Notre méthode',
    processTitle: 'Un processus de livraison éprouvé',
    processSubtitle: 'Transparent, collaboratif et conçu pour les résultats.',
    steps: [
      { num: '01', title: 'Découverte', desc: 'Nous plongeons au cœur de votre activité, vos objectifs et vos défis.' },
      { num: '02', title: 'Conception', desc: 'Nous architecturons la bonne solution et créons une feuille de route claire.' },
      { num: '03', title: 'Développement', desc: 'Nous construisons avec des sprints agiles et une livraison continue.' },
      { num: '04', title: 'Déploiement', desc: 'Nous lançons, surveillons et optimisons sur le long terme.' },
    ],
    faqEyebrow: 'FAQ',
    faqTitle: 'Questions fréquentes',
    ctaTitle: 'Prêt à démarrer votre projet ?',
    contextLabel: 'Contexte',
    challengesLabel: 'Les enjeux',
    scopeLabel: 'Nos expertises',
    methodologyLabel: 'Comment nous intervenons',
    deliverablesLabel: 'Livrables',
    teamLabel: 'Équipe type mobilisée',
    proofLabel: 'Certifications & référentiels',
    prerequisitesLabel: 'Facteurs de succès',
    whyUsLabel: 'Pourquoi IT Road',
    items: [
      {
        id: 'conseil-audit',
        title: 'Conseil & Audit',
        tagline: 'Transformez vos décisions en avantage stratégique.',
        context: "Avant toute transformation digitale, nous analysons votre système d'information, vos processus et votre gouvernance pour construire une feuille de route claire, priorisée et orientée résultats.",
        challenges: [
          { title: 'Architecture complexe', description: 'Applications redondantes et architecture non documentée qui ralentissent chaque décision.' },
          { title: 'Dette technique non quantifiée', description: "Une dette technique invisible rend les arbitrages d'investissement approximatifs." },
          { title: 'Gouvernance floue', description: 'Des rôles mal définis entre DSI et métiers qui diluent les priorités.' },
          { title: 'Risques de conformité', description: "L'absence d'audit expose à des non-conformités RGPD, DNSSI ou ISO." },
          { title: 'Investissements mal priorisés', description: 'Des budgets engagés sans visibilité sur leur impact réel.' },
        ],
        scope: [
          { title: 'Audit stratégique & organisationnel', description: "Aligner la trajectoire IT sur les priorités métier." },
          { title: 'Audit technique', description: "Objectiver les risques et la dette technique avant d'engager le budget." },
          { title: 'Schéma Directeur SI', description: 'Transformer un diagnostic en feuille de route actionnable.' },
          { title: 'Conformité RGPD, DNSSI, ISO', description: "Sécuriser l'entreprise face aux exigences réglementaires." },
          { title: 'Gouvernance & Risk Management', description: 'Structurer un pilotage durable entre DSI et métiers.' },
        ],
        methodology: [
          { title: 'Découvrir', description: 'Ateliers de cadrage avec les sponsors métier et DSI, collecte documentaire et accès aux outils existants.' },
          { title: 'Auditer', description: "Entretiens structurés, cartographie de l'existant et identification des écarts." },
          { title: 'Prioriser', description: 'Constats présentés en comité de pilotage ; scénarios co-construits avec le client.' },
          { title: 'Construire la roadmap', description: 'Schéma directeur SI formalisé avec jalons, dépendances et quick-wins.' },
        ],
        deliverables: [
          { title: "Rapport d'audit", description: 'Constats et écarts identifiés, structurés par domaine et criticité.' },
          { title: 'Schéma Directeur SI', description: 'Feuille de route priorisée avec jalons et dépendances.' },
          { title: 'Matrice de conformité', description: 'Cartographie des écarts DNSSI, RGPD, ISO 27001/9001/20000.' },
          { title: 'Plan de gouvernance', description: 'Recommandations sur la structuration du pilotage DSI / métiers.' },
        ],
        team: ['Consultants seniors certifiés CISA', 'Experts gouvernance certifiés COBIT', 'Auditeurs sécurité certifiés CISSP & CEH', 'Chefs de projet certifiés PMP', 'Experts SMSI certifiés ISO 27001'],
        proof: ['CISA', 'CISSP', 'CEH', 'COBIT', 'PMP', 'ISO 27001', 'ISO 9001', 'ISO 20000', 'ISO 22301'],
        prerequisites: ['Disponibilité des sponsors métier et DSI', 'Accès à la documentation et aux outils existants', "Périmètre d'audit clairement défini"],
        whyUs: ["Un diagnostic indépendant, non lié à un éditeur.", "Une vision qui relie enjeux métier et contraintes techniques.", "Des consultants certifiés, garants de la rigueur de l'audit.", "Une feuille de route exécutable dès le lendemain."],
      },
      {
        id: 'transformation-delivery',
        title: 'Transformation & Delivery',
        tagline: 'Accélérez votre transformation digitale sans compromettre la qualité.',
        context: "Nos équipes prennent en charge vos projets de bout en bout grâce à une Digital Factory agile, des pratiques DevSecOps et une gouvernance orientée résultats.",
        challenges: [
          { title: 'Délais trop longs', description: 'Un delivery qui s\'étire retarde la mise sur le marché.' },
          { title: 'Qualité insuffisante', description: "Une agilité de façade laisse passer des défauts jusqu'en production." },
          { title: 'Silos techniques', description: 'Développement et exploitation qui communiquent mal freinent le déploiement.' },
          { title: 'Industrialisation absente', description: 'Sans CI/CD, chaque mise en production reste risquée et manuelle.' },
        ],
        scope: [
          { title: 'Digital Factory agile', description: 'Absorber une charge de delivery variable sans perdre en qualité.' },
          { title: 'DevSecOps', description: 'Intégrer sécurité et exploitation dès la conception.' },
          { title: 'QA & Testing indépendant', description: 'Garantir un niveau de qualité mesurable à chaque livraison.' },
          { title: 'PMO & AMOA', description: 'Piloter des programmes complexes avec une gouvernance claire.' },
        ],
        methodology: [
          { title: 'Cadrage', description: 'Périmètre fonctionnel et technique défini, pôle technique et équipe calibrés.' },
          { title: 'Sprint Planning', description: 'Rituels agiles structurés selon le framework SAFe pour les contextes multi-équipes.' },
          { title: 'Développement Agile', description: 'Sprints avec testing indépendant et intégration continue DevSecOps.' },
          { title: 'Déploiement', description: 'Mise en production avec plan de bascule, rollback et monitoring renforcé.' },
        ],
        deliverables: [
          { title: 'Product Backlog', description: 'Backlog priorisé avec user stories détaillées et estimation de complexité.' },
          { title: 'Incréments livrés', description: 'Livraisons itératives testées et démontrées en fin de sprint.' },
          { title: 'Rapport de testing', description: 'Synthèse des campagnes de tests automatisés, charge et sécurité.' },
          { title: 'Plan de déploiement', description: "Documentation d'architecture et procédure de bascule." },
        ],
        team: ['Tech leads & développeurs (Java, .NET, PHP, Mobile)', 'Data scientists & ingénieurs data', 'Ingénieurs QA : automatisation, charge, sécurité, performance', 'Scrum Masters et coachs agiles certifiés', 'Chefs de projet et PMO certifiés PMP'],
        proof: ['PMP', 'SAFe', 'Scrum Master', 'DevSecOps', 'Java', '.NET', 'React', 'Flutter'],
        prerequisites: ['Product Owner disponible côté client', 'Accès rapide aux environnements de dev/test', 'Framework agile validé en amont'],
        whyUs: ["Un delivery industrialisé, pas artisanal.", "Une qualité intégrée à chaque sprint.", "Des équipes multidisciplinaires selon votre besoin réel.", "Des livraisons continues et visibles à chaque étape."],
      },
      {
        id: 'architecture-data',
        title: 'Architecture & Données',
        tagline: "Construisez un système d'information évolutif et piloté par la donnée.",
        context: "Nous concevons des architectures modernes, connectées et évolutives qui permettent d'exploiter pleinement votre patrimoine de données.",
        challenges: [
          { title: 'Applications en silos', description: 'Des systèmes qui ne communiquent pas multiplient les incohérences.' },
          { title: 'Données dispersées', description: 'Une donnée éclatée entre plateformes empêche toute vision fiable.' },
          { title: 'Intégrations complexes', description: 'Des intégrations ad hoc freinent chaque nouveau projet.' },
          { title: 'Architecture vieillissante', description: "Un socle daté limite l'intégration de nouveaux usages, dont l'IA." },
        ],
        scope: [
          { title: "Architecture d'entreprise & solution", description: "Concevoir un SI capable d'absorber les évolutions futures." },
          { title: 'API Management', description: 'Connecter les systèmes sans multiplier les intégrations ad hoc.' },
          { title: 'Data Platform & Gouvernance', description: 'Faire de la donnée un actif fiable et exploitable.' },
          { title: 'Business Intelligence & Analytics', description: 'Transformer la donnée en décision.' },
        ],
        methodology: [
          { title: 'Cartographier', description: "Recensement exhaustif du catalogue applicatif et des flux de données, zones de risque identifiées." },
          { title: 'Designer', description: "Vision d'architecture à 360° co-construite avec les standards de référence." },
          { title: 'Gouverner', description: 'Modèle de gouvernance data défini et Data Catalog déployé.' },
          { title: 'Industrialiser', description: "Stratégie d'intégration via API Management, pensée pour les usages IA futurs." },
        ],
        deliverables: [
          { title: 'Dossier d\'architecture cible', description: 'Vision à 360° et scénarios de transformation réalistes.' },
          { title: 'Cartographie applicative et data', description: "Catalogue documenté de l'existant applicatif et des flux de données." },
          { title: 'Modèle de gouvernance data', description: 'Rôles, processus qualité et comitologie de gouvernance.' },
          { title: 'Plateforme Data', description: 'Data Catalog, Data Platform ou Warehouse configuré selon le contexte.' },
        ],
        team: ["Architectes d'entreprise et SI", 'Architectes solutions (intégration, API Management)', 'Data engineers & experts gouvernance data', 'Experts Business Intelligence'],
        proof: ['Apigee', 'Axway', 'IBM API Connect', 'WSO2', 'Talend', 'Denodo', 'Kubernetes', 'Microsoft Data Platform'],
        prerequisites: ['Implication des métiers dans la gouvernance data', 'Accès aux environnements techniques existants', "Standards d'architecture arbitrés en amont"],
        whyUs: ["Une architecture pensée pour évoluer.", "Une vision à 360° de votre système d'information.", "Une donnée gouvernée, condition de toute décision fiable.", "Un socle prêt pour vos futurs cas d'usage IA."],
      },
      {
        id: 'cybersecurite-run',
        title: 'Cybersécurité & Run',
        tagline: "Sécurisez vos systèmes et garantissez leur disponibilité.",
        context: "De la cybersécurité à l'exploitation quotidienne, nous protégeons vos actifs numériques et assurons la continuité de vos services.",
        challenges: [
          { title: 'Cyberattaques', description: "La surface d'exposition augmente plus vite que les moyens de protection." },
          { title: 'Disponibilité', description: "Une interruption de service, même brève, impacte l'activité et la confiance." },
          { title: 'Conformité', description: 'Le durcissement réglementaire exige une conformité prouvée, pas seulement déclarée.' },
          { title: 'Gestion des incidents', description: 'Sans supervision continue, les incidents sont détectés trop tard.' },
        ],
        scope: [
          { title: 'SOC & NOC', description: "Détecter et traiter les incidents avant qu'ils n'impactent l'activité." },
          { title: 'Pentest & audit sécurité', description: "Objectiver le niveau de risque réel de l'organisation." },
          { title: 'IAM & gestion des vulnérabilités', description: "Réduire la surface d'exposition durablement." },
          { title: 'Infogérance & TMA', description: 'Garantir la continuité de service au quotidien.' },
        ],
        methodology: [
          { title: 'Évaluer', description: "Audit de l'infrastructure existante et périmètre de service défini selon les SLA." },
          { title: 'Sécuriser', description: "Tests d'intrusion boîte noire/blanche et mise en conformité DNSSI, RGPD, ISO 27001." },
          { title: 'Superviser', description: 'NOC et SOC déployés pour la détection et le traitement des incidents.' },
          { title: 'Maintenir', description: 'Pilotage en mode Run avec reporting régulier et amélioration continue.' },
        ],
        deliverables: [
          { title: 'Rapport de pentest', description: "Synthèse des tests d'intrusion avec plan de remédiation." },
          { title: 'Dossier de conformité', description: 'État de conformité DNSSI, RGPD et ISO 27001.' },
          { title: 'Tableau de bord de supervision', description: "Indicateurs de disponibilité, d'incidents et de performance." },
          { title: "Rapport d'activité Service Center", description: 'Synthèse périodique de l\'activité du helpdesk et du SOC.' },
        ],
        team: ['Ingénieurs cybersécurité : pentest & compliance', 'Experts SOC & NOC', 'Architectes cloud certifiés GCP, Azure, AWS', 'Responsables conformité réglementaire'],
        proof: ['GCP', 'Azure', 'AWS', 'ISO 27005', 'ISO 31000', 'ISO 22301', 'DNSSI', 'RGPD'],
        prerequisites: ['SLA définis avant le démarrage', 'Accès aux environnements de production', 'Interlocuteur unique désigné côté client'],
        whyUs: ["Une surveillance continue, pas un contrôle ponctuel.", "Une réduction mesurable de vos risques d'exposition.", "Une continuité de service garantie, même en cas d'incident.", "Un support expert disponible dans la durée."],
      },
      {
        id: 'ia-data-science',
        title: 'IA & Data Science',
        tagline: "Passez d'une IA expérimentale à une IA créatrice de valeur.",
        context: "Nous concevons, industrialisons et intégrons des solutions d'Intelligence Artificielle qui automatisent les processus et transforment durablement les organisations.",
        challenges: [
          { title: 'Des POC sans lendemain', description: "La majorité des projets IA n'atteignent jamais la production." },
          { title: 'Data Quality', description: 'Un modèle performant reste inexploitable sur une donnée non fiable.' },
          { title: 'ROI IA', description: "Sans cas d'usage priorisé, l'IA reste coûteuse et sans impact mesurable." },
          { title: 'Industrialisation', description: 'Passer du prototype à la production exige une chaîne MLOps structurée.' },
        ],
        scope: [
          { title: "Cadrage & cas d'usage IA", description: "Prioriser l'IA par la valeur business, pas la technologie." },
          { title: 'GenAI, LLM, Agents', description: 'Automatiser des processus métier à forte valeur ajoutée.' },
          { title: 'Machine Learning & Data Science', description: 'Fiabiliser la décision par la donnée.' },
          { title: 'MLOps', description: "Industrialiser l'IA au-delà du prototype." },
        ],
        methodology: [
          { title: "Identifier les cas d'usage", description: "Ateliers de découverte avec les métiers, évaluation de la valeur et de la faisabilité." },
          { title: 'Construire le MVP', description: 'Fondations data vérifiées, puis développement itératif avec cycles courts de validation.' },
          { title: 'Industrialiser', description: 'Mise en production avec chaîne MLOps structurée : monitoring, réentraînement, conformité.' },
          { title: 'Mesurer et améliorer', description: 'Suivi continu de la performance du modèle au regard des critères de succès.' },
        ],
        deliverables: [
          { title: "Dossier de cadrage des cas d'usage", description: 'Cartographie des cas d\'usage priorisés par valeur et faisabilité.' },
          { title: 'Rapport d\'évaluation des fondations data', description: 'État de la qualité de la donnée et plan de remédiation.' },
          { title: 'Solution GenAI ou modèle', description: 'Solution développée et validée par les utilisateurs métier.' },
          { title: 'Dispositif MLOps de mise en production', description: 'Chaîne de production avec monitoring et gouvernance.' },
        ],
        team: ['Consultants en cadrage stratégique IA', 'Data scientists & ingénieurs ML', 'Ingénieurs GenAI & intégration LLM', "Ingénieurs MLOps pour l'industrialisation"],
        proof: ['AWS', 'Azure', 'GCP', 'MLOps', 'GenAI', 'LLM', 'RAG', 'Computer Vision'],
        prerequisites: ["Sponsor métier identifié pour chaque cas d'usage", 'Qualité minimale de la donnée vérifiée en amont', "Critères de succès définis à l'avance"],
        whyUs: ["Une IA choisie pour sa valeur business.", "Des cas d'usage industrialisés, pas de simples démos.", "Une intégration réelle à vos systèmes existants.", "Un accompagnement de bout en bout, du cadrage à la production."],
      },
    ],
    faqs: [
      { question: 'Comment fixez-vous le prix des projets ?', answer: 'Nous proposons des modèles à prix fixe, régie et équipe dédiée. Nous recommandons le meilleur format après un appel de découverte.' },
      { question: 'Quelle est votre durée typique ?', answer: 'La plupart des projets d\'entreprise durent 3 à 9 mois. Nous fournissons une feuille de route détaillée après le cadrage.' },
      { question: 'Proposez-vous un support continu ?', answer: 'Oui. Nous proposons des services gérés, des SLA et un support 24/7 pour toutes les solutions livrées.' },
      { question: 'Pouvez-vous travailler avec notre équipe existante ?', answer: 'Absolument. Nous nous intégrons aux équipes internes et pouvons renforcer les effectifs selon les besoins.' },
    ],
  },
  industriesPage: {
    eyebrow: 'Secteurs',
    title1: 'Nous comprenons',
    title2: 'votre secteur',
    subtitle: "Une expertise sectorielle qui signifie que nous parlons votre langage et connaissons vos défis.",
    talkExpert: 'Parler à un expert',
    aiBadge: 'Solutions IA',
    aiTitle1: 'Le futur est intelligent.',
    aiTitle2: 'Construisons-le ensemble.',
    aiText: "De l'IA générative à la vision par ordinateur, nous vous aidons à déployer une IA qui crée de la vraie valeur métier.",
    aiButton: 'Planifier une démo',
    ctaTitle: 'Votre secteur. Notre expertise.',
    items: [
      { id: 'healthcare', name: 'Santé', description: 'Plateformes conformes HIPAA, télémédecine et systèmes de données cliniques.' },
      { id: 'finance', name: 'Finance', description: 'Plateformes bancaires, systèmes de paiement et technologies réglementaires.' },
      { id: 'retail', name: 'Retail', description: 'E-commerce, commerce omnicanal et intelligence d\'inventaire.' },
      { id: 'education', name: 'Éducation', description: 'Plateformes d\'apprentissage, systèmes d\'information étudiants et EdTech.' },
      { id: 'government', name: 'Gouvernement', description: 'E-government sécurisé, identité numérique et plateformes du secteur public.' },
      { id: 'manufacturing', name: 'Industrie', description: 'Industrie 4.0, IoT et solutions d\'usine intelligente.' },
    ],
  },
  partnersPage: {
    eyebrow: 'Partenaires',
    title1: 'Plus forts',
    title2: 'ensemble',
    subtitle: "Nous avons obtenu les plus hauts niveaux de partenariat avec les leaders mondiaux de la technologie.",
    certEyebrow: 'Certifications',
    certTitle: 'Une expertise vérifiée à laquelle vous pouvez faire confiance',
    tiers: [
      { title: 'Microsoft Gold Partner', desc: 'Certifié sur les compétences cloud, données et développement.' },
      { title: 'AWS Advanced Consulting', desc: 'Expertise validée en migration et services gérés.' },
      { title: 'ISO 27001 Certified', desc: 'Management de la sécurité de l\'information au plus haut standard.' },
      { title: 'Google Cloud Partner', desc: 'Spécialisé dans l\'infrastructure cloud et l\'IA/ML.' },
    ],
    ctaTitle: 'Devenir partenaire d\'ITROAD',
  },
  blog: {
    eyebrow: 'Blog',
    title1: 'Perspectives depuis la',
    title2: 'frontière de la tech',
    subtitle: 'Analyses d\'experts sur l\'IA, le cloud, la sécurité et la transformation numérique.',
    featured: 'À la une',
    readArticle: 'Lire l\'article',
    latestEyebrow: 'Derniers articles',
    latestTitle: 'Plus d\'articles',
    newsletterTitle: 'Restez informé',
    newsletterText: 'Recevez les dernières analyses directement dans votre boîte mail.',
    placeholder: 'vous@entreprise.com',
    subscribe: 'S\'abonner',
    ctaTitle: 'Un projet en tête ?',
    posts: [
      { id: '1', title: 'Le guide de l\'IA générative en entreprise en 2026', excerpt: 'Comment les organisations leaders déploient l\'IA générative de manière responsable à travers les opérations, l\'expérience client et le développement produit.', category: 'Intelligence Artificielle', date: '15 janv. 2026', readTime: '8 min de lecture', featured: true },
      { id: '2', title: 'Optimisation des coûts cloud : un cadre pratique', excerpt: 'Sept stratégies pour réduire vos dépenses cloud sans sacrifier la performance ou la fiabilité.', category: 'Cloud', date: '8 janv. 2026', readTime: '6 min de lecture' },
      { id: '3', title: 'L\'architecture Zero-Trust pour les secteurs réglementés', excerpt: 'Un plan pour implémenter la sécurité zero-trust dans la santé, la finance et le gouvernement.', category: 'Cybersécurité', date: '20 déc. 2025', readTime: '10 min de lecture' },
      { id: '4', title: 'Pourquoi les microservices échouent (et comment réussir)', excerpt: 'Pièges courants dans l\'adoption des microservices et les patterns architecturaux qui les évitent.', category: 'Logiciel', date: '12 déc. 2025', readTime: '7 min de lecture' },
    ],
  },
  careers: {
    eyebrow: 'Carrières',
    title1: 'Construire le futur',
    title2: 'avec nous',
    subtitle: 'Rejoignez une équipe de technologues passionnés qui aiment résoudre des problèmes complexes.',
    cultureEyebrow: 'Notre culture',
    cultureTitle: 'Là où les grands talents font leur meilleur travail',
    cultureSubtitle: 'Nous investissons dans nos collaborateurs car ils sont notre plus grand atout.',
    openEyebrow: 'Postes ouverts',
    openTitle: 'Trouvez votre prochain poste',
    openSubtitle: 'Nous recherchons en permanence des talents exceptionnels.',
    apply: 'Postuler maintenant',
    ctaTitle: 'Vous ne voyez pas votre poste ? Contactez-nous quand même.',
    benefits: [
      { title: 'Évolution de carrière', description: 'Progression de carrière claire avec mentorat et certifications.' },
      { title: 'Bien-être', description: 'Couverture santé complète et modalités de travail flexibles.' },
      { title: 'Apprentissage', description: 'Budget d\'apprentissage annuel et accès aux meilleures formations.' },
      { title: 'Travail porteur de sens', description: 'Des projets qui impactent des millions d\'utilisateurs dans tous les secteurs.' },
    ],
    jobs: [
      { title: 'Architecte Cloud Senior', department: 'Cloud', location: 'Télétravail', type: 'CDI' },
      { title: 'Ingénieur IA/ML', department: 'IA & Données', location: 'Tunis', type: 'CDI' },
      { title: 'Développeur Full-Stack', department: 'Ingénierie', location: 'Télétravail', type: 'CDI' },
      { title: 'Ingénieur DevOps', department: 'Cloud', location: 'Dubaï', type: 'CDI' },
      { title: 'Consultant Sécurité', department: 'Cybersécurité', location: 'Tunis', type: 'Contrat' },
      { title: 'Product Designer', department: 'Design', location: 'Télétravail', type: 'CDI' },
    ],
  },
  contact: {
    eyebrow: 'Contact',
    title1: 'Commençons une conversation',
    title2: '',
    subtitle: 'Parlez-nous de votre projet.',
    emailLabel: 'Email',
    officeLabel: 'Bureau',
    officeValue1: 'Dubaï, Émirats Arabes Unis',
    officeAddressLines: [
      'SFFO0558 Compass Building',
      'Al Shohada Road',
      'Al Hamra Industrial Zone-FZ',
      'Ras Al Khaimah',
      'Émirats Arabes Unis',
    ],
    step: (n: number, total: number) => `Étape ${n} / ${total}`,
    step1Title: 'Quel est votre défi actuel ?',
    step2Title: 'Taille de votre organisation',
    step3Title: 'Vos coordonnées professionnelles',
    next: 'Suivant',
    prev: 'Précédent',
    submit: 'Envoyer ma demande',
    fullName: 'Nom complet',
    workEmail: 'Email professionnel',
    phone: 'Téléphone',
    nameRequiredError: 'Veuillez saisir votre nom complet.',
    emailInvalidError: 'Veuillez saisir une adresse email valide.',
    phoneInvalidError: 'Veuillez saisir un numéro de téléphone valide.',
    successTitle: 'Merci pour votre demande !',
    successText: 'Nous avons bien reçu vos informations. Notre équipe va étudier votre besoin et reviendra vers vous dans les meilleurs délais.',
    newRequest: 'Envoyer une nouvelle demande',
    challenges: ['IA / Données', 'Cybersécurité', 'Cloud Migration', 'Transformation Digitale', 'Développement Logiciel', 'Autre'],
    companySizes: ['1-10', '11-50', '51-250', '251-1000', '1000+'],
    faqEyebrow: 'FAQ',
    faqTitle: 'Avant de nous contacter',
    faqs: [
      { question: 'Avec quelle rapidité répondez-vous ?', answer: 'Nous répondons à toutes les demandes sous un jour ouvré, souvent le jour même.' },
      { question: 'Signez-vous des NDA ?', answer: 'Oui, nous signons systématiquement des NDA mutuels avant les discussions détaillées.' },
      { question: 'Où êtes-vous situés ?', answer: 'Notre siège est à Tunis avec des bureaux à Dubaï et des équipes distantes dans le monde entier.' },
      { question: 'Quels fuseaux horaires couvrez-vous ?', answer: 'Nous opérons sur les fuseaux GMT, CET et GST avec des chevauchements pour la plupart des clients.' },
    ],
  },
  about: {
    eyebrow: 'Qui sommes-nous',
    title1: 'Nous construisons des technologies qui',
    title2: 'font avancer les entreprises.',
    subtitle: "Depuis 2009, ITROAD Group est un partenaire de confiance pour la transformation numérique au Moyen-Orient et en Afrique.",
    missionTitle: 'Notre Mission',
    missionText: "Donner aux organisations les solutions technologiques innovantes qui créent une valeur durable, stimulent l'efficacité et ouvrent de nouvelles perspectives de croissance.",
    visionTitle: 'Notre Vision',
    visionText: "Être le partenaire de transformation numérique le plus fiable de la région, reconnu pour l'excellence technique, l'innovation et l'impact mesurable que nous créons pour chaque client.",
    journeyEyebrow: 'Notre parcours',
    journeyTitle: 'Un historique de croissance',
    journeySubtitle: "D'une petite équipe à un leader régional de la technologie d'entreprise.",
    valuesEyebrow: 'Nos valeurs',
    valuesTitle: 'Ce qui nous anime chaque jour',
    leadershipEyebrow: 'Direction',
    leadershipTitle: 'Les personnes derrière ITROAD',
    leadershipSubtitle: 'Des leaders expérimentés engagés dans l\'excellence.',
    awardsTitle: 'Reconnu pour l\'excellence',
    awardsText: 'Notre travail a été reconnu par les principales organisations et partenaires du secteur.',
    awards: ['Microsoft Gold Partner', 'AWS Advanced Consulting', 'ISO 27001 Certified', 'Top Employer 2025'],
    ctaTitle: 'Rejoignez les 60+ entreprises qui font confiance à ITROAD',
    timeline: [
      { year: '2009', title: 'Fondation', description: "ITROAD Group créé avec une vision de la transformation numérique d'entreprise." },
      { year: '2013', title: 'Expansion régionale', description: "Ouverture de bureaux en Afrique du Nord et au Moyen-Orient." },
      { year: '2017', title: 'Division Cloud & IA', description: "Lancement de pratiques dédiées au cloud et à l'intelligence artificielle." },
      { year: '2020', title: 'Partenariats mondiaux', description: 'Partenariats de premier niveau avec Microsoft, AWS et Google Cloud.' },
      { year: '2024', title: '250+ Projets', description: 'Plus de 250 projets d\'entreprise livrés dans 6 secteurs.' },
    ],
    values: [
      { title: 'Intégrité', description: 'Nous construisons la confiance par la transparence et la responsabilité.' },
      { title: 'Innovation', description: 'Nous repoussons les limites et adoptons les technologies émergentes.' },
      { title: 'Centré client', description: 'Votre succès définit le nôtre. Chaque décision commence par le client.' },
      { title: 'Excellence', description: 'Nous nous tenons aux plus hauts standards dans tout ce que nous livrons.' },
    ],
    leaders: [
      { name: 'Youssef El Amrani', role: 'CEO & Fondateur', initials: 'YE' },
      { name: 'Leila Ben Salah', role: 'CTO', initials: 'LB' },
      { name: 'Omar Khelifi', role: 'VP Delivery', initials: 'OK' },
      { name: 'Nadia Trabelsi', role: 'VP Sales', initials: 'NT' },
    ],
  },
  notFound: {
    code: '404',
    title: 'Cette page a fait demi-tour',
    text: "La page que vous recherchez n'existe pas ou a été déplacée.",
    home: 'Retour à l\'accueil',
    contact: 'Nous contacter',
  },
  clientLogosAria: 'Logos clients',
  chat: {
    title: 'Assistant ITROAD',
    subtitle: 'Posez vos questions sur nos services, secteurs, ou contactez-nous',
    openLabel: "Ouvrir l'assistant de discussion",
    closeLabel: 'Fermer la discussion',
    minimizeLabel: 'Réduire la discussion',
    placeholder: 'Écrivez votre message…',
    send: 'Envoyer',
    greeting: "Bonjour ! Je suis l'assistant ITROAD Group. Posez-moi vos questions sur nos services, nos secteurs, ou comment nous contacter.",
    unavailable: "L'assistant IA est temporairement indisponible. Merci de réessayer plus tard ou de contacter notre équipe.",
    disclaimer: 'Réponses générées par IA à partir du contenu itroad-group.com.',
    typing: 'En train d\'écrire…',
  },
};

export const translations: Record<Lang, TranslationData> = { en, fr };