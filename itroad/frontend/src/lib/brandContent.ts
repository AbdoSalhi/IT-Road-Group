export type KeyNumber =
  | { type: 'stat'; value: number; suffix: string; label: string }
  | { type: 'highlight'; text: string };

export interface ServiceItem {
  title: string;
  description: string;
}

export interface TechStackGroup {
  category: string;
  items: string[];
}

export interface PartnerItem {
  name: string;
  description: string;
}

export interface BrandContent {
  /** Must match an id in src/lib/data.ts `subsidiaries` array. */
  id: string;
  name: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  keyNumbers: KeyNumber[];
  about?: { title: string; paragraphs: string[] };
  whyUs?: { title: string; points: string[] };
  services: ServiceItem[];
  process?: string[];
  sectors: string[];
  clients?: string[];
  partners?: PartnerItem[];
  techStack?: TechStackGroup[];
  testimonial?: { quote: string; author: string; role: string };
  footerAddressLines: string[];
  footerEmail?: string;
  footerPhone?: string;
}

export const brandContents: Record<string, BrandContent> = {
  /* ============================================================
     1. IT ROAD CONSULTING MAROC
     ============================================================ */
  'itroad-consulting': {
    id: 'itroad-consulting',
    name: 'IT Road Consulting Maroc',
    tagline: 'Votre partenaire de transformation digitale de bout en bout au Maroc',
    heroTitle: 'Accompagnons ensemble votre transformation digitale',
    heroSubtitle:
      "De l'audit stratégique à l'implémentation technique — IT Road Consulting est votre partenaire de confiance pour moderniser votre système d'information et accélérer votre croissance.",
    ctaPrimary: 'Démarrer un projet',
    ctaSecondary: 'Découvrir nos services',
    keyNumbers: [
      { type: 'stat', value: 120, suffix: '+', label: 'collaborateurs' },
      { type: 'stat', value: 150, suffix: '+', label: 'clients satisfaits' },
      { type: 'stat', value: 400, suffix: '+', label: 'projets réalisés' },
      { type: 'stat', value: 4000, suffix: '+', label: 'jours de production par mois' },
      { type: 'stat', value: 10, suffix: '+', label: "ans d'expertise" },
    ],
    services: [
      {
        title: 'Consulting & Gouvernance SI',
        description:
          "Audit et urbanisation des systèmes d'information, élaboration de schémas directeurs, stratégie et gouvernance SI, assistance à la maîtrise d'ouvrage. Nous vous aidons à aligner votre SI avec votre stratégie business long terme.",
      },
      {
        title: 'Architecture & Data Management',
        description:
          "Architecture d'entreprise et des SI, modélisation des données, urbanisation des flux d'information, mise en place de référentiels et de nomenclatures. Nous construisons les fondations qui rendent votre SI agile et évolutif.",
      },
      {
        title: 'Transformation Digitale & Digital Factory',
        description:
          "Transformation digitale de bout en bout, intégration d'applications de gestion, développement d'applications spécifiques, mise en œuvre de plateformes digitales. Notre Digital Factory accélère votre passage au numérique grâce à des assets réutilisables.",
      },
      {
        title: 'AI Solution Factory',
        description:
          "Conception et déploiement de solutions IA sur mesure, automatisation des processus métier, data science appliquée, initiatives IA de bout en bout. Nous intégrons l'intelligence artificielle dans chaque maillon de votre chaîne de valeur.",
      },
      {
        title: 'Nearshore / Offshore',
        description:
          "Modèle nearshore compétitif depuis Casablanca — mêmes fuseaux horaires, collaborateurs francophones, coûts optimisés sans compromis sur la qualité. IT Road Consulting est l'un des prestataires nearshore les plus reconnus sur la place.",
      },
      {
        title: 'Cybersécurité & Services Managés',
        description:
          'Audit de sécurité, gestion des risques, mise en conformité, Help Desk 24/7, supervision des infrastructures. Nous sécurisons vos actifs digitaux et assurons la continuité de votre activité.',
      },
    ],
    process: ['Audit', 'Stratégie', 'Architecture', 'Transformation', 'Delivery', 'Opération', 'Optimisation'],
    sectors: ['Finance & Banque', 'E-gouvernement', 'Industrie', 'Énergie', 'BTP', 'Presse & Médias', 'Services'],
    clients: [
      'Royal Air Maroc',
      'BMCE Bank',
      'Société Générale',
      'BPI France',
      'Crédit Agricole Maroc',
      'GIZ',
      'ONHYM',
      'ORMVA',
      'Ministère des Affaires Étrangères',
      'Ministère de la Sécurité',
      'ONDA',
    ],
    testimonial: {
      quote:
        "IT Road a collaboré avec la RAM pour promouvoir la démarche architecture de son SI et de ses données afin de l'accompagner dans sa transformation digitale.",
      author: 'Aymane Moumine',
      role: 'Royal Air Maroc',
    },
    footerAddressLines: ['Building Optima Business Center', 'Sidi Maarouf', 'Casablanca, Maroc'],
    footerPhone: '+212 (0) 7 02 07 40 46',
    footerEmail: 'contact@itroad.ma',
  },

  /* ============================================================
     2. B TECH CONSULTING FRANCE
     ============================================================ */
  btech: {
    id: 'btech',
    name: 'B Tech Consulting France',
    tagline: "L'expertise Data, Architecture & Conseil au service des entreprises européennes",
    heroTitle: "L'expertise IT sans compromis — conseil pur, résultats concrets",
    heroSubtitle:
      "B Tech Consulting est le cabinet d'expertise Data, Architecture et Conseil implanté à Paris. Nous ne faisons pas de delivery — nous faisons de l'excellence. Chaque mission commence par un diagnostic rigoureux et débouche sur une roadmap actionnable.",
    ctaPrimary: 'Prendre rendez-vous',
    ctaSecondary: 'Découvrir notre approche',
    keyNumbers: [
      { type: 'highlight', text: "Cabinet d'expertise pure basé à Paris" },
      { type: 'highlight', text: 'Missions en France et en Europe' },
      { type: 'highlight', text: 'Offre offshore compétitive via IT Road Maroc' },
      { type: 'highlight', text: 'Spécialistes Data, Architecture, Transformation SI' },
    ],
    about: {
      title: 'Notre modèle',
      paragraphs: [
        'B Tech Consulting ne livre pas de code — nous livrons de la clarté.',
        'Vous arrivez avec un problème complexe. Vous repartez avec une vision, une roadmap et un plan d\'action priorisé. L\'implémentation, si nécessaire, est orchestrée via notre partenaire IT Road Consulting Maroc.',
      ],
    },
    whyUs: {
      title: 'Pourquoi B Tech ?',
      points: [
        "Expertise pure sans conflit d'intérêt avec les éditeurs",
        'Approche agnostique — nous recommandons ce qui vous convient, pas ce que nous vendons',
        'Synergie avec IT Road Group pour l\'implémentation nearshore',
        "Consultants seniors avec +10 ans d'expérience terrain",
      ],
    },
    services: [
      {
        title: 'Conseil & Architecture SI',
        description:
          "Élaboration de schémas directeurs, urbanisation des SI, définition des cibles d'architecture, plans de transformation. Nous construisons la vision technologique qui guide vos investissements IT sur 3 à 5 ans.",
      },
      {
        title: 'Data Strategy & Management',
        description:
          'Stratégie Data, gouvernance des données, architecture data lakes et data warehouses, modélisation, qualité des données. Nous transformons vos données en actifs stratégiques.',
      },
      {
        title: "Roadmap & Plan d'Organisation",
        description:
          "Définition des roadmaps technologiques, plans d'organisation IT, modèles de gouvernance, plans de capacité. Nous vous donnons une vision claire et priorisée de votre transformation.",
      },
      {
        title: 'Delivery via Digital Factory',
        description:
          "Pour les chantiers nécessitant de l'implémentation, B Tech s'appuie sur la Digital Factory d'IT Road Consulting Maroc — une équipe dédiée, réactive et compétitive en nearshore.",
      },
      {
        title: 'Offre Offshore & Nearshore',
        description:
          'B Tech orchestre et supervise depuis Paris, IT Road Maroc exécute depuis Casablanca. Le meilleur des deux mondes : expertise européenne, compétitivité marocaine, sans décalage horaire.',
      },
      {
        title: "Initiatives IA de bout en bout",
        description:
          "Définition de la stratégie IA, identification des cas d'usage, architecture des solutions IA, accompagnement à l'intégration. B Tech pilote vos projets IA de la conception au déploiement.",
      },
    ],
    sectors: ['Finance', 'Banque & Assurance', 'E-gouvernement', 'Industrie', 'Énergie', 'Retail', 'Santé'],
    footerAddressLines: ["8 Ter Place Henri d'Astier", '94220 Charenton-le-Pont', 'Paris, France'],
  },

  /* ============================================================
     3. SMARTWAY
     ============================================================ */
  smartway: {
    id: 'smartway',
    name: 'Smartway',
    tagline: 'Votre partenaire pour déployer des plateformes digitales métier clé en main',
    heroTitle: 'Des plateformes digitales métier prêtes à l\'emploi',
    heroSubtitle:
      "Smartway conçoit, déploie et opère des plateformes digitales adaptées aux besoins métier de chaque secteur. De la définition du besoin au go-live — nous transformons vos processus en solutions digitales performantes et évolutives.",
    ctaPrimary: 'Voir nos plateformes',
    ctaSecondary: 'Demander une démo',
    keyNumbers: [],
    about: {
      title: 'Notre différence',
      paragraphs: [
        'Smartway ne vend pas des logiciels — Smartway déploie des solutions qui fonctionnent.',
        "Nous combinons l'expertise métier de nos consultants et la puissance technique d'IT Road Group pour livrer des plateformes opérationnelles, pas des promesses.",
      ],
    },
    services: [
      {
        title: 'Conception de plateformes digitales métier',
        description:
          "Analyse des besoins métier, conception fonctionnelle, architecture de la plateforme, UX/UI design. Nous partons de votre réalité terrain pour concevoir des solutions que vos équipes adoptent naturellement.",
      },
      {
        title: 'Déploiement & Intégration',
        description:
          'Implémentation des plateformes, intégration avec les SI existants, migration des données, tests et recette. Nous gérons la complexité technique pour que vous vous concentriez sur votre métier.',
      },
      {
        title: 'Plateformes sur mesure',
        description:
          "Développement d'applications spécifiques, configurateurs métier, workflows digitaux, tableaux de bord décisionnels. Chaque plateforme est taillée sur mesure selon vos contraintes et votre secteur.",
      },
      {
        title: 'Initiatives IA intégrées',
        description:
          "Intégration de l'IA dans vos plateformes : automatisation des tâches, recommandations intelligentes, analyse prédictive, chatbots métier. Smartway intègre l'IA de façon pragmatique et mesurable.",
      },
      {
        title: 'Maintenance & Évolution',
        description:
          'TMA (Tierce Maintenance Applicative), support utilisateurs, évolutions fonctionnelles, monitoring de performance. Nous restons à vos côtés bien après le go-live.',
      },
      {
        title: 'Formation & Accompagnement au changement',
        description:
          "Formation des équipes, conduite du changement, documentation utilisateur, support post-déploiement. Une plateforme ne vaut que si elle est adoptée.",
      },
    ],
    sectors: [
      'Agriculture & Agritech',
      'Éducation & Formation',
      'Santé & Services sociaux',
      'BTP & Immobilier',
      'Commerce & Distribution',
      'Administration publique',
    ],
    footerAddressLines: ['Agadir', 'Maroc'],
    footerEmail: 'contact@smartway.ma',
  },

  /* ============================================================
     4. IT ROAD TECHNOLOGY
     ============================================================ */
  'itroad-technology': {
    id: 'itroad-technology',
    name: 'IT Road Technology',
    tagline: "L'ingénierie logicielle et les services managés au cœur de votre performance IT",
    heroTitle: 'La puissance technique au service de votre business',
    heroSubtitle:
      "IT Road Technology est le bras technologique d'IT Road Group. Nous concevons, développons et opérons les systèmes qui font tourner votre business — avec rigueur, fiabilité et innovation.",
    ctaPrimary: 'Démarrer un projet tech',
    ctaSecondary: 'Parler à un expert',
    keyNumbers: [],
    services: [
      {
        title: 'Développement logiciel sur mesure',
        description:
          'Applications web et mobile, APIs et microservices, architectures cloud-native, refonte de systèmes legacy. Nous codons ce que les autres ne font que promettre.',
      },
      {
        title: 'Intégration de solutions & ERP',
        description:
          "Intégration d'ERP, CRM, progiciels métier, middleware et ESB, APIs d'échange inter-systèmes. Nous connectons vos outils pour qu'ils fonctionnent comme un seul système cohérent.",
      },
      {
        title: 'DevOps & Cloud',
        description:
          'CI/CD avec CloudBees, infrastructure as code, containerisation (Docker, Kubernetes), déploiement cloud (AWS, Azure, GCP), monitoring. Nous industrialisons votre delivery logiciel.',
      },
      {
        title: 'API Management & Intégration',
        description:
          'API design, sécurisation et gouvernance des APIs avec Axway, gestion des flux de données, MFT (Managed File Transfer). Nous sécurisons et optimisons tous vos échanges de données.',
      },
      {
        title: 'Services Managés & Help Desk',
        description:
          'MCO (Maintien en Condition Opérationnelle), TMA, supervision 24/7, Help Desk niveau 1-2-3, gestion des incidents. Nous opérons votre SI pour que vous puissiez vous concentrer sur votre cœur de métier.',
      },
      {
        title: 'Lab & R&D',
        description:
          'Veille technologique, prototypage rapide, POC (Proof of Concept), innovation ouverte. Notre Lab teste les technologies de demain pour vous aujourd\'hui.',
      },
    ],
    sectors: [],
    partners: [
      { name: 'Axway', description: "Leader mondial de l'API Management et du MFT" },
      { name: 'CloudBees', description: 'Référence mondiale en automatisation DevOps' },
      { name: '(à compléter)', description: '' },
    ],
    techStack: [
      { category: 'Frontend', items: ['React', 'Next.js', 'Angular', 'Vue.js'] },
      { category: 'Backend', items: ['Java', 'Python', 'Node.js', '.NET'] },
      { category: 'Cloud', items: ['AWS', 'Azure', 'GCP'] },
      { category: 'DevOps', items: ['CloudBees', 'Jenkins', 'Docker', 'Kubernetes', 'Terraform'] },
      { category: 'Data', items: ['Spark', 'Kafka', 'dbt', 'Airflow'] },
      { category: 'IA', items: ['Python', 'LangChain', 'OpenAI', 'Claude'] },
    ],
    footerAddressLines: ['Centre Cléopâtre, Centre Urbain Nord', 'Tunis, Tunisie'],
    footerEmail: 'contact@itroad-technology.com',
  },
};

export const BRAND_IDS = Object.keys(brandContents);
