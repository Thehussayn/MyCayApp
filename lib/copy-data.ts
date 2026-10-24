/**
 * MyCayApp by Jeje-Ola — Content Source of Truth
 * Derived strictly from 01 - PX__01_Website_Copy.pdf
 * Prepared by Pingxtra Tech Ltd for Jeje-Ola Properties Nig. Ltd. (RC.1317171)
 */

export interface PropertyItem {
  id: string;
  slug: string;
  title: string;
  category: "Residential" | "Commercial" | "Land";
  location: string;
  district?: "Guzape" | "Maitama" | "Katampe";
  priceFormatted: string;
  priceNumeric?: number;
  specs: {
    bedrooms?: number;
    bathrooms?: number;
    areaSqFt?: string;
    unitsAvailable?: number;
    titleType?: string;
  };
  status: "Available" | "Selling Fast" | "Delivered" | "Off-Plan";
  tag: string;
  heroImage: string;
  gallery?: string[];
  description: string;
  features?: string[];
  investmentHighlight: string;
}

export interface InvestmentPlanData {
  id: "giap" | "wealthstream";
  name: string;
  fullName: string;
  tagline: string;
  badge: string;
  headline: string;
  summary: string;
  model: string;
  returns: string;
  involvement: string;
  exitPolicy: string;
  ownership: string;
  bestFor: string;
  capitalRange: string;
  corePillars: string[];
}

export const COMPANY_INFO = {
  name: "Jeje-Ola Properties Nig. Ltd.",
  brandName: "MyCayApp by Jeje-Ola",
  registration: "RC.1317171",
  experienceYears: "18+",
  propertiesDelivered: "900+",
  headquarters: {
    name: "Guzape Smart Office Complex",
    address: "Plot 1059, Adamu Allero Crescent, Guzape, Abuja, Nigeria",
    phone: ["+234 8066 873 988", "+234 8075 464 774"],
    email: "info@jejeolaproperties.com.ng",
    hours: "Monday–Friday, 9:00am–5:00pm WAT",
  },
  leadership: {
    founderAndCeo: {
      name: "Alhaji (Dr.) Teslim Jeje-Ola Sanusi",
      title: "Founder & CEO",
      tenure: "Over three decades of recognised character, transparency, and consistency.",
      delivered: "900+ premium properties delivered under his leadership."
    },
    chairman: {
      name: "Alhaji Abdulazeez O. Isa (FCNA, FCTI)",
      title: "Chairman",
      role: "Strategic leadership, financial governance, and regulatory oversight."
    }
  }
};

export const HERO_COPY = {
  editorialHeadline: [
    "Premium Real Estate.",
    "Trusted Investment.",
    "Lasting Legacy."
  ],
  subheadline:
    "For over 18 years, Jeje-Ola Properties has helped families, executives, and diaspora investors own homes, secure futures, and grow wealth through Nigeria's most reliable real-estate investment platform.",
  primaryCta: {
    label: "Start Investing",
    href: "/invest"
  },
  secondaryCta: {
    label: "About Jeje-Ola",
    href: "/about"
  },
  heroMeta: {
    locationBadge: "Guzape Smart Office Complex · Abuja",
    complianceBadge: "RC.1317171 · Fully Registered & Compliant"
  }
};

export const TRUST_STATS = [
  {
    value: "18+",
    unit: "Years",
    label: "Institutional Track Record",
    detail: "Preserving capital and trust since 2008"
  },
  {
    value: "900+",
    unit: "Properties",
    label: "Delivered to Distinguished Clients",
    detail: "Across Abuja, Ilorin & major Nigerian hubs"
  },
  {
    value: "70/30",
    unit: "Profit Split",
    label: "GIAP Shared Growth Model",
    detail: "Aligned interest — we only profit when you do"
  },
  {
    value: "20–24%",
    unit: "Annual ROI",
    label: "WealthStream Passive Income",
    detail: "Fixed, predictable, real-estate backed returns"
  },
  {
    value: "100%",
    unit: "Title Verification",
    label: "Full Legal Protection",
    detail: "Every deed registered directly in your name"
  }
];

export const WHO_WE_SERVE = [
  {
    id: "diaspora",
    title: "Diaspora Investors",
    summary:
      "Invest in Nigerian real estate from anywhere in the world, with full local representation, verified documents, and transparent reporting.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85",
    alt: "Diaspora professional reviewing Nigerian real estate investment documentation"
  },
  {
    id: "hnwi",
    title: "High-Net-Worth Individuals",
    summary:
      "Premium properties and private investment plans designed around your portfolio goals.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85",
    alt: "Executive reviewing private real estate investment portfolio"
  },
  {
    id: "executives",
    title: "Government Officials & Executives",
    summary:
      "Discreet, professional service trusted by ministers, ambassadors, and senior leaders.",
    image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=1200&q=85",
    alt: "Senior institutional leader in executive boardroom setting"
  },
  {
    id: "families",
    title: "Premium Families",
    summary:
      "A home that protects your family today and grows in value for the next generation.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
    alt: "Family residence in Abuja"
  }
];

export const INVESTMENT_PLANS: Record<"giap" | "wealthstream", InvestmentPlanData> = {
  giap: {
    id: "giap",
    name: "GIAP",
    fullName: "Global Investor Advantage Plan",
    tagline: "Built for People Who Want to Own — Not Just Invest",
    badge: "70/30 Shared Growth",
    headline: "Your Guided Path to Real Estate Wealth & Ownership",
    summary:
      "A guided 70/30 wealth-building scheme. We help you identify and purchase verified high-growth property, manage it throughout its lifecycle, and orchestrate the resale at peak valuation. You retain full ownership and take 70% of net profits.",
    model: "Guided Acquisition & Profit-Sharing",
    returns: "70% of Net Profit upon Strategic Resale",
    involvement: "Guided Decision-Making (You retain final approval)",
    exitPolicy: "At strategic market appreciation (18–36 months typical)",
    ownership: "100% in your legal name",
    bestFor: "Long-term generational wealth, diaspora security & capital appreciation",
    capitalRange: "Flexible entry based on property asset class",
    corePillars: [
      "Nigeria's first guided real-estate investment structure",
      "True aligned interest: We only profit when you profit",
      "Zero agency fees, legal search fees, or management retainers on entry",
      "Decisions backed by the GIAP Decision Support System, not market hype",
      "Full title deed and ownership registered strictly in your name"
    ]
  },
  wealthstream: {
    id: "wealthstream",
    name: "WealthStream",
    fullName: "WealthStream Investment Plan",
    tagline: "Earn Effortlessly. We Do the Work.",
    badge: "20%–24% Fixed Annual ROI",
    headline: "Predictable, Guaranteed Returns Backed by Institutional Real Estate",
    summary:
      "A fixed-return, real-estate-backed passive cash flow vehicle. Earn 20% annual ROI paid lump sum, or 24% annual ROI paid out as 2.0% monthly cash flow directly to your bank account. Completely hands-free, asset-secured, and predictable.",
    model: "Fixed Annual ROI backed by tangible real estate portfolio",
    returns: "20% (Annual payout) or 24% (Monthly 2.0% payout)",
    involvement: "100% Hands-free passive execution",
    exitPolicy: "Principal fully refundable upon standard 6-month notice",
    ownership: "Capital held against institutional asset collateral",
    bestFor: "Predictable passive cash flow, retirement funding & high-yield stability",
    capitalRange: "₦1,000,000 to ₦1,000,000,000+",
    corePillars: [
      "Guaranteed, predictable monthly or annual cash distributions",
      "Direct bank disbursements on fixed schedules without delay",
      "100% backed by tangible prime commercial and residential properties",
      "Zero tenant hassles, property management, or maintenance friction",
      "Clear, transparent exit mechanism with 6-month capital withdrawal notice"
    ]
  }
};

export const WHY_JEJE_OLA = [
  {
    number: "01",
    title: "Aligned Interest",
    description:
      "We only profit when you profit. Under our GIAP model, we charge zero agency fees, no commissions, and no legal entry fees. Our financial success is mathematically tied to yours."
  },
  {
    number: "02",
    title: "Legal Protection",
    description:
      "Every investment is backed by formal legal agreements drafted by commercial counsel. The title and deed remain 100% registered directly in your name."
  },
  {
    number: "03",
    title: "Verified Properties",
    description:
      "We confirm ownership, validate titles, inspect every site, and check land history before you commit."
  },
  {
    number: "04",
    title: "Hands-Free Experience",
    description:
      "From acquisition and infrastructure development to tenant curation and eventual resale, Jeje-Ola coordinates every detail. You earn while we execute."
  },
  {
    number: "05",
    title: "Transparent Reporting",
    description:
      "Track your property portfolio, valuation milestones, monthly statement yields, and verified documents in real time through the MyCayApp investor portal."
  },
  {
    number: "06",
    title: "Proven Track Record",
    description:
      "Over 900 properties delivered across 18 unbroken years of integrity. Trusted by ministers, ambassadors, corporate entities, and discerning families nationwide."
  }
];

export const FEATURED_PROPERTIES: PropertyItem[] = [
  {
    id: "prop-01",
    slug: "guzape-luxury-smart-villa",
    title: "The Guzape Smart Residence",
    category: "Residential",
    location: "Guzape Diplomatic Zone, Abuja",
    district: "Guzape",
    priceFormatted: "₦380,000,000",
    priceNumeric: 380000000,
    specs: {
      bedrooms: 5,
      bathrooms: 6,
      areaSqFt: "680 sqm",
      titleType: "Certificate of Occupancy (C of O)"
    },
    status: "Available",
    tag: "Prime Residential",
    heroImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85"
    ],
    description:
      "An architectural masterwork situated on elevated Guzape topography offering panoramic city views, bespoke Italian marble finishes, full smart-home automation, and private infinity pool.",
    features: [
      "5 Ensuite Bedrooms with Private Balconies",
      "Integrated Smart Home Automation & Security",
      "Elevated Guzape Panoramic City Views",
      "Private Swimming Pool & Landscaped Terrace",
      "Certificate of Occupancy (C of O)"
    ],
    investmentHighlight: "Estimated annual capital appreciation: 22% based on Guzape infrastructure expansion."
  },
  {
    id: "prop-02",
    slug: "maitama-executive-commercial-hub",
    title: "Maitama Commercial Pavilion",
    category: "Commercial",
    location: "Maitama District, Abuja",
    district: "Maitama",
    priceFormatted: "Price on Request",
    specs: {
      areaSqFt: "1,850 sqm leasable",
      unitsAvailable: 4,
      titleType: "Federal C of O"
    },
    status: "Available",
    tag: "High-Yield Commercial",
    heroImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=85"
    ],
    description:
      "Ultra-modern commercial complex featuring grade-A executive office suites, multi-tier biometric security, dedicated transformer substation, and high-speed fibre infrastructure.",
    features: [
      "1,850 sqm Premium Grade-A Leasable Space",
      "Biometric Access & Multi-Tier Surveillance",
      "Dedicated 500kVA Transformer Substation",
      "High-Speed Fibre & Redundant Power Infrastructure",
      "Federal Certificate of Occupancy"
    ],
    investmentHighlight: "Projected annual rental yield: 14.5% in prime diplomatic commercial corridor."
  },
  {
    id: "prop-03",
    slug: "katampe-panoramic-plots",
    title: "The Crestview Residential Plots",
    category: "Land",
    location: "Katampe Extension, Abuja",
    district: "Katampe",
    priceFormatted: "₦95,000,000 / Plot",
    priceNumeric: 95000000,
    specs: {
      areaSqFt: "800 sqm – 1,200 sqm",
      titleType: "Right of Occupancy (R of O) / AGIS"
    },
    status: "Available",
    tag: "Strategic Land Banking",
    heroImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85"
    ],
    description:
      "Fully serviced residential plots with asphalted road network, underground drainage, street lighting, and dedicated security gatehouse in Abuja's fastest-growing luxury corridor.",
    features: [
      "800 sqm – 1,200 sqm Serviced Residential Plots",
      "Asphalted Internal Access Road & Underground Drainage",
      "Dedicated Security Gatehouse & Street Lighting",
      "Fast-Growing Luxury Residential Corridor",
      "Right of Occupancy (R of O) / AGIS Validated"
    ],
    investmentHighlight: "GIAP-eligible land asset with projected 65% valuation growth across 24 months."
  }
];

export const PROPERTIES: PropertyItem[] = FEATURED_PROPERTIES;

export const PROPERTIES_PAGE_COPY = {
  meta: {
    title: "Premium Properties for Sale in Abuja & Nigeria — Jeje-Ola Properties",
    description:
      "Browse premium residential, commercial, and land properties verified and delivered by Jeje-Ola Properties. 900+ completed projects across the FCT and beyond."
  },
  hero: {
    kicker: "Curated Portfolio",
    headline: "Premium Properties, Verified and Delivered",
    subheadline:
      "Browse verified residential, commercial, and land properties across Abuja and Nigeria, backed by 18 years of institutional excellence and legal protection."
  },
  deliveredStrip: {
    kicker: "Delivered Portfolio",
    heading: "Over 900 Projects Delivered Across 18 Years",
    description:
      "Beyond our currently available listings, Jeje-Ola Properties has successfully developed, managed, and delivered over 900 residential, commercial, and land assets across the Federal Capital Territory and Nigeria. For institutional acquisitions or unlisted private inventory, speak directly with our advisory desk.",
    ctaLabel: "Inquire on Unlisted Portfolio",
    ctaHref: "/contact"
  },
  cta: {
    headline: "Need Guidance on the Right Property?",
    subheadline:
      "Book a private consultation with our advisory team at the Guzape Smart Office Complex or via secure video conference, and let us match your portfolio goals with verified assets.",
    primaryCta: {
      label: "Book Free Consultation",
      href: "/contact"
    },
    phone: "+234 8066 873 988"
  }
};

export const TESTIMONIALS = [
  {
    quote:
      "A trustworthy and highly principled individual with over three decades of recognised character, transparency, and consistency. We recommend Jeje-Ola Properties without hesitation.",
    author: "Prince Adeleke Abdulrasheed",
    organization: "Adeayworld Energy Limited",
    role: "Managing Director"
  }
];

export const LATEST_INSIGHTS = [
  {
    slug: "invest-nigerian-real-estate-from-abroad",
    title: "How to Invest in Nigerian Real Estate from Abroad",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1600&q=85"
  },
  {
    slug: "understanding-real-estate-appreciation-abuja",
    title: "Understanding Real Estate Appreciation in Abuja",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85"
  },
  {
    slug: "giap-vs-traditional-property-investment",
    title: "GIAP vs Traditional Property Investment: Which Is Right for You?",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85"
  }
];

export const SMART_OFFICE_SPECS = [
  "Biometric smart door and facial access control systems",
  "Intelligent lighting and energy efficiency management",
  "Executive client lounge and private consultation suites",
  "High-tech boardroom and digital property presentation suites",
  "Real estate architectural innovation and design studio",
  "Landscaped outdoor terraces and enhanced 24/7 surveillance"
];

export const ABOUT_COPY = {
  meta: {
    title: "About Jeje-Ola Properties — 18 Years of Real Estate Excellence in Nigeria",
    description:
      "From humble beginnings in Ilorin to Nigeria's premier real-estate and investment company. Discover the story, leadership, and values that have shaped Jeje-Ola Properties."
  },
  hero: {
    kicker: "About Jeje-Ola Properties",
    headline: "Eighteen Years. One Promise. Built on Integrity.",
    introParagraphs: [
      "For over 18 years, Jeje-Ola Properties has stood for one thing — keeping promises. From our humble beginnings in Ilorin to our new ultra-modern Smart Office Complex in Guzape, Abuja, our story is one of trust, consistency, and quiet excellence.",
      "We did more than sell land and houses. We built confidence. We helped families secure their future. And we gave thousands of people a reason to believe in what real estate can offer."
    ],
    heroImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85"
  },
  story: {
    sectionKicker: "Our Journey",
    heading: "From Ilorin to Abuja",
    statement: "A journey rooted in trust, community, and quiet excellence.",
    paragraphs: [
      "Our journey began in Ilorin — a city that taught us the true value of trust, community, and consistency. Six years ago, we extended that same promise to Abuja, the Federal Capital Territory. It was a bigger market, a bigger dream, and a bigger responsibility.",
      "Today, our reach spans the FCT and other major Nigerian cities. We serve government officials, diplomatic missions, high-net-worth individuals, corporate organisations, and premium families — and our work has earned the trust of ministers, ambassadors, legislators, and industry icons."
    ],
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?auto=format&fit=crop&w=1400&q=85"
  },
  trackRecord: {
    kicker: "Institutional Track Record",
    heading: "Evidence of Integrity",
    metrics: [
      {
        value: "18+",
        label: "Years of Trusted Experience",
        detail: "Unbroken consistency in delivering on real estate promises across Nigeria."
      },
      {
        value: "900+",
        label: "Properties Delivered",
        detail: "Completed residential, commercial, and land assets entrusted to our stewardship."
      }
    ]
  },
  visualLegacy: {
    kicker: "Visual Legacy & Craft",
    heading: "Architecture Rooted in Permanence",
    statement:
      "Every development reflects our insistence on structural integrity, meticulous craftsmanship, and lasting architectural value.",
    primaryImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
    secondaryImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85"
  },
  leadership: {
    kicker: "Leadership",
    heading: "The Leadership Behind the Legacy",
    founder: {
      name: "Alhaji (Dr.) Teslim Jeje-Ola Sanusi",
      role: "Founder & CEO",
      bio: "A real-estate leader recognised for over three decades of impeccable character, transparency, and consistency. Under his leadership, Jeje-Ola Properties has delivered 900+ premium properties and built a reputation that endures.",
      portrait: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85"
    },
    chairman: {
      name: "Alhaji Abdulazeez O. Isa (FCNA, FCTI)",
      role: "Chairman",
      bio: "Strategic leadership, financial governance, and regulatory oversight across Jeje-Ola Properties' expanding portfolio of assets and developments.",
      portrait: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=1200&q=85"
    }
  },
  values: [
    {
      number: "01",
      title: "Integrity",
      description: "We do what we say, and we say what we mean."
    },
    {
      number: "02",
      title: "Transparency",
      description: "Every fee, every step, every document — visible and verifiable."
    },
    {
      number: "03",
      title: "Aligned Interest",
      description: "Our success is tied to yours. We grow when you grow."
    },
    {
      number: "04",
      title: "Excellence",
      description: "Premium finishing, structural integrity, smart features, and high investment returns."
    },
    {
      number: "05",
      title: "Innovation",
      description: "From cutting-edge smart offices to digital investment tools, we evolve with you."
    }
  ],
  smartOffice: {
    kicker: "Physical Permanence",
    heading: "The Guzape Smart Office Complex",
    description:
      "Our new Ultra-Modern Smart Office Complex in Guzape, Abuja symbolises Jeje-Ola Properties' next phase of growth and service excellence.",
    address: "Plot 1059, Adamu Allero Crescent, Guzape, Abuja",
    features: [
      "Smart door and access control systems",
      "Intelligent lighting and energy solutions",
      "Executive offices and a luxury client lounge",
      "High-tech conference rooms",
      "Digital property presentation suites",
      "A real estate innovation and design studio",
      "Landscaped outdoor spaces",
      "Enhanced security and surveillance installations"
    ],
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85"
  },
  cta: {
    headline: "Your Future is a Decision Away.",
    subheadline:
      "Book a free consultation with our investment team and discover how you can build wealth through real estate the Jeje-Ola way.",
    primaryCta: {
      label: "Book Free Consultation",
      href: "/contact"
    },
    phone: "+234 8066 873 988"
  }
};

export const INVEST_PAGE_COPY = {
  meta: {
    title: "Invest in Nigerian Real Estate — GIAP & WealthStream | Jeje-Ola Properties",
    description:
      "Grow wealth safely with two transparent, real-estate-backed investment plans. Choose GIAP for guided 70/30 property investment, or WealthStream for 20–24% fixed annual returns."
  },
  hero: {
    headline: "Two Plans. One Promise. Real Estate That Works for You.",
    subheadline:
      "Whether you want to own property and share in its growth, or earn predictable monthly income without lifting a finger, we have a plan built for you. Both are backed by real estate, structured with legal protection, and designed to put your interest first.",
    giapVisual: {
      tagline: "Own Property. Share in Growth.",
      title: "Global Investor Advantage Plan (GIAP)",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
      badge: "70% Profit Share"
    },
    wealthStreamVisual: {
      tagline: "Predictable Passive Income.",
      title: "WealthStream Investment Plan",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
      badge: "20%–24% Annual ROI"
    }
  },
  twoPaths: {
    kicker: "The Two Investment Paths",
    heading: "Choose Your Path to Real Estate Wealth",
    giap: {
      name: "GIAP",
      fullName: "Global Investor Advantage Plan",
      numeral: "70%",
      label: "Profit Share on Resale",
      summary:
        "Own verified high-growth real estate registered 100% in your name, with hands-off lifecycle guidance and 70% share of net capital gains upon strategic resale.",
      href: "/invest/giap"
    },
    wealthstream: {
      name: "WealthStream",
      fullName: "WealthStream Investment Plan",
      numeral: "20–24%",
      label: "Fixed Annual Cash Flow",
      summary:
        "Earn predictable, asset-backed passive returns distributed monthly (2.0%) or annually, while your underlying principal remains completely untouched.",
      href: "/invest/wealthstream"
    }
  },
  giapStory: {
    kicker: "Direct Property Ownership",
    name: "GIAP",
    fullName: "Global Investor Advantage Plan",
    numeral: "70%",
    numeralLabel: "Your Share of Net Profit on Resale",
    summary:
      "A guided 70/30 wealth-building scheme. We help you identify and purchase verified high-growth property with full legal title registered in your name. When the property is resold at peak valuation, you receive your full capital back plus 70% of the net profit.",
    alignmentStatement:
      "If the property does not appreciate, we earn nothing. Our financial interest is 100% aligned with yours.",
    journeySteps: ["Choose", "Verify", "Own", "Grow", "Resell", "Share Profit"],
    ctaText: "Explore GIAP",
    ctaHref: "/invest/giap",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85"
  },
  wealthStreamStory: {
    kicker: "Fixed-Return Real-Estate Asset",
    name: "WealthStream",
    fullName: "WealthStream Investment Plan",
    numeral: "20–24%",
    numeralLabel: "Fixed Annual ROI · Tangible Real-Estate Backed",
    summary:
      "A fixed-return, real-estate-backed passive cash flow vehicle. Earn 20% annual ROI paid lump sum, or 24% annual ROI paid out as monthly cash distributions directly to your bank account—completely hands-free.",
    keyFacts: [
      "20% annual ROI for yearly payout",
      "24% annual ROI with monthly (2.0%) payout",
      "Principal remains untouched until withdrawal",
      "Structured exit process with 6-month notice period"
    ],
    ctaText: "Explore WealthStream",
    ctaHref: "/invest/wealthstream",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85"
  },
  comparison: {
    kicker: "Side-by-Side Evaluation",
    heading: "Compare Investment Structures",
    subheading:
      "A direct factual comparison to help you choose the vehicle best aligned with your liquidity and wealth goals.",
    dimensions: [
      {
        feature: "Investment model",
        giap: "Buy property, share profit",
        wealthstream: "Fixed annual ROI"
      },
      {
        feature: "Your ownership",
        giap: "Property in your name",
        wealthstream: "Capital with us"
      },
      {
        feature: "Return",
        giap: "70% of profit on resale",
        wealthstream: "20%–24% per year"
      },
      {
        feature: "Best for",
        giap: "Long-term wealth & legacy",
        wealthstream: "Predictable passive income"
      },
      {
        feature: "Involvement",
        giap: "Guided decisions",
        wealthstream: "Fully hands-free"
      },
      {
        feature: "Capital range",
        giap: "Flexible",
        wealthstream: "₦1 million to ₦1 billion"
      },
      {
        feature: "Exit",
        giap: "At resale",
        wealthstream: "6-month withdrawal notice"
      }
    ]
  },
  decisionSupport: {
    kicker: "Goal Alignment",
    heading: "Which Path Matches Your Priority?",
    subheading:
      "Identify your immediate financial objectives to determine the most suitable structure.",
    paths: [
      {
        title: "If Your Priority Is:",
        priorities: [
          "Owning tangible physical property in Abuja",
          "Building long-term generational wealth and family legacy",
          "Participating directly in capital appreciation gains",
          "Retaining registered title deeds in your legal name"
        ],
        planName: "Global Investor Advantage Plan (GIAP)",
        planHighlight: "Direct Ownership · 70% Resale Profit Share",
        ctaLabel: "Explore GIAP",
        ctaHref: "/invest/giap"
      },
      {
        title: "If Your Priority Is:",
        priorities: [
          "Earning predictable, recurring passive cash flow",
          "Receiving 2.0% monthly or 20% annual bank payouts",
          "Zero involvement, management, or maintenance friction",
          "Retaining principal security with defined 6-month exit notice"
        ],
        planName: "WealthStream Investment Plan",
        planHighlight: "Fixed 20%–24% Annual ROI · 100% Hands-Free",
        ctaLabel: "Explore WealthStream",
        ctaHref: "/invest/wealthstream"
      }
    ]
  },
  onboarding: {
    kicker: "The Investor Journey",
    heading: "Start Investing in Five Simple Steps",
    subheading:
      "From registration to real-time performance tracking, our onboarding is structured for clarity, security, and speed.",
    steps: [
      {
        number: "01",
        title: "Register Online",
        description: "Create your investor account in under 2 minutes."
      },
      {
        number: "02",
        title: "Get Verified",
        description: "Our team reviews your registration. Approved within 1–3 business days."
      },
      {
        number: "03",
        title: "Complete Your Biodata",
        description:
          "Once approved, log in and complete your investor profile (KYC, ID, next of kin, bank details)."
      },
      {
        number: "04",
        title: "Choose Your Plan",
        description: "Select GIAP, WealthStream, or both. Multiple investments allowed."
      },
      {
        number: "05",
        title: "Track Everything",
        description: "Real-time dashboard, automated reports, in-app and email notifications."
      }
    ],
    primaryCta: {
      label: "Create Your Investor Account",
      href: "/register"
    },
    secondaryCta: {
      label: "Book Free Consultation",
      href: "/contact"
    }
  },
  cta: {
    headline: "Your Future is a Decision Away.",
    subheadline:
      "Book a private consultation with our advisory team at the Guzape Smart Office Complex or via secure video conference, and discover how you can build wealth through real estate the Jeje-Ola way.",
    primaryCta: {
      label: "Book Free Consultation",
      href: "/contact"
    },
    phone: "+234 8066 873 988"
  }
};

export const GIAP_PAGE_DATA = {
  meta: {
    title: "GIAP — Global Investor Advantage Plan | 70/30 Real Estate Investment | Jeje-Ola",
    description:
      "A guided 70/30 real-estate wealth-building scheme. We help you buy the right property, manage it, and resell it. You keep your capital plus 70% of the profit. Property stays in your name."
  },
  hero: {
    badge: "Direct Property Ownership",
    planName: "Global Investor Advantage Plan (GIAP)",
    headline: "Built for People Who Want to Own — Not Just Invest.",
    subheadline:
      "GIAP is Nigeria's first guided real-estate investment structure. We don't just sell you land — we walk with you, protect your interest, and only earn when you do.",
    primaryCta: {
      label: "Book Free Consultation",
      href: "/contact"
    },
    secondaryLink: {
      label: "Explore How GIAP Works",
      href: "#how-it-works"
    },
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85",
    imageCaption: "The Guzape Luxury Smart Villa · Abuja Prime Development"
  },
  whyExists: {
    kicker: "Why GIAP Exists",
    heading: "Bridging the Distance and Trust Gap in Property Ownership",
    paragraphs: [
      "For many people, owning property is more than an investment — it is security, peace of mind, and a legacy. But the journey is not always simple, especially when you live far away or do not have someone you truly trust on the ground.",
      "GIAP was created to bridge that gap. It is our promise to walk with you, guide you, and protect your interest every step of the way."
    ],
    highlight:
      "Owning property is security, peace of mind, and a lasting family legacy."
  },
  howItWorks: {
    kicker: "The 8-Step Lifecycle",
    heading: "How GIAP Works",
    subheading:
      "A fully coordinated, eight-step investment journey from initial budget selection to final 70/30 profit distribution.",
    steps: [
      {
        number: "01",
        title: "You Choose Your Budget",
        description: "Tell us your investment amount and long-term goals."
      },
      {
        number: "02",
        title: "We Search the Best Locations",
        description: "Our team studies the market, growth patterns, and government plans."
      },
      {
        number: "03",
        title: "We Verify Every Document",
        description: "Ownership, land history, titles, environment, and seller authenticity."
      },
      {
        number: "04",
        title: "You Make the Final Decision",
        description: "Expert advice, but you are always in control."
      },
      {
        number: "05",
        title: "You Purchase in Your Name",
        description: "All documents carry your name. Full ownership."
      },
      {
        number: "06",
        title: "We Manage and Guide the Investment",
        description: "Monitoring, advising, and tracking appreciation."
      },
      {
        number: "07",
        title: "When the Property Appreciates, We Handle the Resale",
        description: "Safely and strategically."
      },
      {
        number: "08",
        title: "Profit Is Shared 70/30",
        description: "You receive your full capital back plus 70% of the profit."
      }
    ]
  },
  differentiation: {
    kicker: "What Makes GIAP Different",
    heading: "Three Foundational Pillars of Aligned Real Estate",
    subheading:
      "Unlike traditional property transactions crowded with hidden commissions and disconnected advisors, GIAP is engineered for shared accountability.",
    pillars: [
      {
        number: "01",
        title: "Nigeria's First Guided Real-Estate Structure",
        description:
          "We help you decide what to buy, when to buy, where to buy, why that location matters, the resale potential, and how to protect the investment across its entire lifecycle."
      },
      {
        number: "02",
        title: "A 70/30 Shared-Interest Model",
        description:
          "Most property companies charge agency, legal, inspection, commission, documentation, and development fees upfront. GIAP removes all of that. We earn only when you earn — a rare alignment in Nigerian real estate."
      },
      {
        number: "03",
        title: "Decisions Based on Data — Not Hype",
        description:
          "No 'buy here, it will appreciate' speculation. GIAP decisions are based on data, location potential, infrastructure expansion, and market analysis, powered by the GIAP Decision Support System."
      }
    ]
  },
  financialModel: {
    kicker: "The 70/30 Financial Model",
    heading: "A Worked Financial Example",
    subheading:
      "An illustrative look at how capital return and profit sharing work in practice.",
    initialAcquisition: 100000000,
    illustrativeResale: 200000000,
    illustrativeProfit: 100000000,
    investorShare: 70000000,
    companyShare: 30000000,
    totalReturned: 170000000,
    investorPercentage: "70%",
    companyPercentage: "30%",
    disclaimer:
      "Calculation is illustrative and actual returns depend on the resale outcome. If the property does not appreciate, we do not earn anything. Our profit is tied to yours — fully aligned."
  },
  safeguards: {
    kicker: "Security & Legal Ownership",
    heading: "Institutional Protection for Every Property",
    subheading:
      "Real estate built on legal certainty, individual title custody, and zero upfront fee friction.",
    items: [
      {
        title: "Property Registered in Your Name",
        description:
          "All deed documents, survey plans, and official titles carry your name directly. You retain 100% legal ownership of the physical asset."
      },
      {
        title: "Formal Legal Agreement Protects Both Parties",
        description:
          "Every GIAP partnership is governed by an enforceable commercial agreement drafted by independent legal counsel, outlining profit-sharing terms and fiduciary duties."
      },
      {
        title: "Resale Only With Your Consent",
        description:
          "No asset is ever sold without your explicit approval. Resale is coordinated through Jeje-Ola to protect market timing and maximize capital gains."
      },
      {
        title: "No Agency, Legal, or Search Fees on Entry",
        description:
          "We charge zero agency fees, zero legal fees, and zero site-search fees when you enter GIAP. We only earn our 30% performance share when net profit is realized upon resale."
      }
    ]
  },
  faqs: [
    {
      question: "Can I invest from abroad?",
      answer:
        "Yes — diaspora investors are a core audience. We coordinate remote identity verification, digital documentation, regular photo and video milestones, and direct consultations across international time zones."
    },
    {
      question: "What is the minimum investment?",
      answer:
        "Flexible — entry amounts vary depending on available property asset classes and your capital strategy. Book a free consultation with our team to explore current portfolio opportunities."
    },
    {
      question: "Can I choose the property myself?",
      answer:
        "Yes — we advise, you decide. Our research team presents rigorously vetted locations and growth data, but final acquisition approval rests entirely with you."
    },
    {
      question: "What happens if the property doesn't appreciate?",
      answer:
        "We don't earn either. Our interest is 100% aligned with yours. If the property yields no net capital gain upon resale, Jeje-Ola earns zero performance fee."
    },
    {
      question: "How long is a typical investment cycle?",
      answer:
        "Varies by property type — typically 18–36 months, allowing strategic infrastructure development and corridor appreciation to mature before resale."
    }
  ],
  cta: {
    headline: "Your Future is a Decision Away.",
    subheadline:
      "Book a private consultation with our investment advisory team at the Guzape Smart Office Complex or via secure video conference, and discover how GIAP protects and grows your capital.",
    primaryCta: {
      label: "Book Free Consultation",
      href: "/contact"
    },
    phone: "+234 8066 873 988"
  }
};

export const WEALTHSTREAM_PAGE_DATA = {
  meta: {
    title: "WealthStream Investment Plan — 20–24% Annual ROI Real-Estate-Backed | Jeje-Ola",
    description:
      "Earn 20% yearly or 24% annually with monthly payouts. WealthStream is a fixed-return, real-estate-backed passive income plan from Jeje-Ola Properties. Hands-free, secure, predictable."
  },
  hero: {
    badge: "Fixed-Return Real-Estate Asset",
    planName: "WealthStream Investment Plan",
    headline: "Earn Effortlessly. We Do the Work.",
    subheadline:
      "A premium, real-estate-backed investment model designed for investors who want guaranteed passive income — 20% to 24% fixed annual ROI, depending on your payout preference.",
    primaryCta: {
      label: "Book Free Consultation",
      href: "/contact"
    },
    secondaryLink: {
      label: "Explore The Payout Model",
      href: "#model"
    },
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85",
    imageCaption: "Prime Commercial & Luxury Residential Assets Backing WealthStream Capital"
  },
  model: {
    kicker: "The WealthStream Model",
    heading: "Two Structured Payout Options",
    subheading:
      "Select the distribution frequency aligned with your cash-flow lifestyle. Both options are fixed annual rates backed by institutional real estate.",
    clarification:
      "All rates represent annual ROI. Monthly payouts are distributed as 2.0% monthly cash disbursements directly to your bank account (totaling 24% per year), not a 24% return each month. Your principal remains completely untouched throughout.",
    options: [
      {
        rate: "24%",
        period: "Annual Rate",
        frequency: "Monthly Payouts",
        distributionDetail: "2.0% Monthly Cash Disbursement",
        annualReturnOn20M: "₦4,800,000 / year",
        monthlyReturnOn20M: "₦400,000 / month",
        description:
          "Ideal for investors seeking consistent monthly income to support recurring expenses, family commitments, or lifestyle cash flow. Distributions are deposited directly to your bank account on schedule.",
        tag: "Most Popular for Cash Flow"
      },
      {
        rate: "20%",
        period: "Annual Rate",
        frequency: "Yearly Payout",
        distributionDetail: "Single Lump Sum Distribution",
        annualReturnOn20M: "₦4,000,000 / year",
        monthlyReturnOn20M: "Paid at 12-Month Maturity",
        description:
          "Ideal for investors focusing on capital accumulation or scheduled annual project expenditures. Receive your full 20% fixed return in one lump sum at the end of every 12-month period.",
        tag: "Optimized for Annual Projects"
      }
    ]
  },
  howItWorks: {
    kicker: "How It Works",
    heading: "Five Simple Steps to Passive Income",
    subheading:
      "From initial capital allocation to predictable distributions and structured exit, WealthStream requires zero ongoing effort from you.",
    steps: [
      {
        number: "01",
        title: "You Invest",
        description: "Contribute an agreed amount (for example, ₦10 million or ₦20 million)."
      },
      {
        number: "02",
        title: "We Put Your Money to Work",
        description: "Jeje-Ola invests in secure, high-performing real estate ventures. Zero involvement on your part."
      },
      {
        number: "03",
        title: "You Choose Your Payout Plan",
        description: "Select monthly (24% annual rate) or yearly (20% annual rate) distributions."
      },
      {
        number: "04",
        title: "You Earn Steady, Fixed Returns",
        description: "20% if yearly payout, 24% if monthly payout. Principal stays untouched."
      },
      {
        number: "05",
        title: "Withdrawal Process",
        description: "6-month notice required; no ROI during notice period; full principal returned at the end."
      }
    ]
  },
  calculator: {
    kicker: "Interactive ROI Projection",
    heading: "Calculate Your Fixed Cash Flow",
    subheading:
      "Estimate your monthly and annual distributions based on approved WealthStream rates.",
    defaultAmount: 20000000,
    minAmount: 1000000,
    maxAmount: 1000000000,
    presets: [5000000, 10000000, 20000000, 50000000, 100000000],
    disclaimer:
      "Calculations are illustrative projections based on approved 20% (yearly) and 24% (monthly) rates. They do not constitute a guaranteed return or personalized investment recommendation. No reinvestment or compounding is assumed."
  },
  safeguards: {
    kicker: "Investment Safeguards",
    heading: "Asset-Backed Security & Predictability",
    subheading:
      "WealthStream is anchored in institutional physical real estate, not speculative markets.",
    items: [
      {
        title: "100% Backed by Real Estate Collateral",
        description:
          "Every naira invested in WealthStream is supported by Jeje-Ola's prime commercial and residential development assets across Abuja and Nigeria."
      },
      {
        title: "Direct Bank Account Distributions",
        description:
          "Monthly or annual earnings are credited directly to your registered commercial bank account on fixed schedules without intermediaries or manual redemption requests."
      },
      {
        title: "Zero Operational or Tenant Friction",
        description:
          "Enjoy true passive income. Jeje-Ola coordinates all tenant management, leasing, facility maintenance, and operational oversight end-to-end."
      },
      {
        title: "Principal Preservation & Segregation",
        description:
          "Your underlying capital principal remains completely untouched throughout the investment tenure until you formally request withdrawal."
      }
    ]
  },
  withdrawals: {
    kicker: "Withdrawals & Capital Exit",
    heading: "A Transparent, Orderly Exit Mechanism",
    subheading:
      "Real estate capital requires disciplined liquidity management. Our withdrawal process is structured with clarity and fairness.",
    noticePeriod: "6 Months",
    terms: [
      {
        title: "Standard 6-Month Written Notice",
        description:
          "To request the return of your initial principal, simply submit a formal withdrawal notice to your investment manager."
      },
      {
        title: "No ROI Accrual During Notice Window",
        description:
          "During the 6-month notice period, capital is prepared for orderly exit from active developments, and no further ROI distributions accrue."
      },
      {
        title: "100% Full Principal Returned",
        description:
          "At the conclusion of the 6-month notice period, your complete initial investment amount is transferred back to your registered bank account."
      }
    ]
  },
  whoIsItFor: {
    kicker: "Investor Fit",
    heading: "Who WealthStream Is For",
    subheading:
      "Engineered for discerning individuals who value predictable cash flow, physical asset security, and freedom from operational burdens.",
    profiles: [
      {
        title: "Busy Professionals",
        description: "Earn predictable passive income without taking time away from demanding careers."
      },
      {
        title: "Diaspora Investors",
        description: "A trusted, transparent Nigeria-based partner delivering secure dollar or naira yields."
      },
      {
        title: "Executives & Business Owners",
        description: "Establish a resilient, secondary cash-flow stream uncorrelated to core business risks."
      },
      {
        title: "Retirees",
        description: "Consistent monthly or annual income to preserve lifestyle comfort and financial independence."
      },
      {
        title: "High-Net-Worth Individuals",
        description: "Secure, real-estate-backed capital deployment for institutional-grade preservation."
      },
      {
        title: "Transparency-Driven Investors",
        description: "A tangible, property-backed alternative to volatile schemes or opaque financial vehicles."
      }
    ]
  },
  faqs: [
    {
      question: "Is my principal safe?",
      answer:
        "Yes — your investment is 100% backed by tangible physical real estate assets in Jeje-Ola's prime development portfolio, and supported by a structured, contractual exit process."
    },
    {
      question: "How do I receive payouts?",
      answer:
        "Distributions are sent directly via bank transfer to your registered commercial bank account on fixed monthly or annual schedules without manual claims."
    },
    {
      question: "Can I top up my investment?",
      answer:
        "Yes — multiple investments and capital top-ups are permitted under one unified investor account at any time."
    },
    {
      question: "Can I switch payout frequency?",
      answer:
        "Subject to plan terms and account review — speak to your dedicated investment manager to adjust distribution preferences."
    },
    {
      question: "What if I need to withdraw early?",
      answer:
        "A standard 6-month notice applies to all withdrawals. No ROI accrues during the 6-month notice period, and your full initial principal is returned at the end."
    }
  ],
  cta: {
    headline: "Your Future is a Decision Away.",
    subheadline:
      "Book a private consultation with our investment advisory team at the Guzape Smart Office Complex or via secure video conference, and discover how WealthStream delivers predictable passive returns.",
    primaryCta: {
      label: "Book Free Consultation",
      href: "/contact"
    },
    phone: "+234 8066 873 988"
  }
};

export interface ServiceItem {
  id: string;
  slug: string;
  number: string;
  name: string;
  description: string;
  signatureImage: string;
  secondaryImage?: string;
  imageAlt: string;
  iconName: "Home" | "Building2" | "KeyRound" | "Compass" | "Trees" | "Cpu";
  gallery?: string[];
  process?: { number: string; title: string; description: string }[];
  faqs?: { question: string; answer: string }[];
}

export const SERVICES_PAGE_DATA: {
  meta: {
    title: string;
    description: string;
  };
  hero: {
    kicker: string;
    headline: string;
    introduction: string;
    primaryCta: {
      label: string;
      href: string;
    };
    secondaryLink: {
      label: string;
      href: string;
    };
    image: string;
    imageCaption: string;
  };
  services: ServiceItem[];
  cta: {
    headline: string;
    subheadline: string;
    primaryCta: {
      label: string;
      href: string;
    };
    phone: string;
  };
} = {
  meta: {
    title: "End-to-End Real Estate Services — Jeje-Ola Properties",
    description:
      "From the first sketch to the final key, Jeje-Ola Properties is your partner for every stage of property ownership and development across residential, commercial, architecture, and estate management."
  },
  hero: {
    kicker: "Integrated Capabilities",
    headline: "End-to-End Real Estate Services",
    introduction:
      "From the first sketch to the final key, Jeje-Ola Properties is your partner for every stage of property ownership and development.",
    primaryCta: {
      label: "Book Free Consultation",
      href: "/contact"
    },
    secondaryLink: {
      label: "Explore All Six Services",
      href: "#services-list"
    },
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85",
    imageCaption: "Maitama Executive Commercial Hub · Institutional Architecture"
  },
  services: [
    {
      id: "residential-property-sales",
      slug: "residential-property-sales",
      number: "01",
      name: "Residential Property Sales",
      description: "Premium homes for families and individuals.",
      signatureImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85",
      imageAlt: "Premium residential villa delivered by Jeje-Ola Properties in Guzape, Abuja",
      iconName: "Home"
    },
    {
      id: "commercial-property-development",
      slug: "commercial-property-development",
      number: "02",
      name: "Commercial Property Development",
      description: "Office complexes, retail, and mixed-use.",
      signatureImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85",
      imageAlt: "Executive commercial office complex developed in prime Abuja corridor",
      iconName: "Building2"
    },
    {
      id: "estate-management",
      slug: "estate-management",
      number: "03",
      name: "Estate Management",
      description: "Full-service property and tenant management.",
      signatureImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
      imageAlt: "Pristine serviced residential estate under professional Jeje-Ola management",
      iconName: "KeyRound"
    },
    {
      id: "interior-exterior-architecture",
      slug: "interior-exterior-architecture",
      number: "04",
      name: "Interior & Exterior Architecture",
      description: "Bespoke design with timeless appeal.",
      signatureImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
      secondaryImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
      imageAlt: "Contemporary architectural facade and bespoke interior living space",
      iconName: "Compass"
    },
    {
      id: "landscape-design",
      slug: "landscape-design",
      number: "05",
      name: "Landscape Design",
      description: "Outdoor environments that elevate every property.",
      signatureImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85",
      imageAlt: "Curated architectural estate landscape and outdoor leisure environment",
      iconName: "Trees"
    },
    {
      id: "smart-home-security-integration",
      slug: "smart-home-security-integration",
      number: "06",
      name: "Smart Home & Security Integration",
      description: "Intelligent living, fully integrated.",
      signatureImage: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1600&q=85",
      imageAlt: "Intelligent residential environment with integrated ambient smart home technology",
      iconName: "Cpu"
    }
  ],
  cta: {
    headline: "Your Future is a Decision Away.",
    subheadline:
      "Book a private consultation with our architectural and advisory teams at the Guzape Smart Office Complex or via secure video conference, and discover how our end-to-end services bring your vision to life.",
    primaryCta: {
      label: "Book Free Consultation",
      href: "/contact"
    },
    phone: "+234 8066 873 988"
  }
};

export interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  category: "Market Analysis" | "Investor Education" | "Diaspora Guides" | "Property Spotlights" | "News & Press" | "Estate Management Tips";
  image: string;
  imageAlt: string;
  isFeatured?: boolean;
  author?: string;
  publishDate?: string;
  readTime?: string;
  summary?: string;
  body?: string[];
}

export const INSIGHTS_PAGE_DATA: {
  meta: {
    title: string;
    description: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    introduction: string;
  };
  categories: readonly string[];
  featuredArticle: ArticleItem;
  pillarArticles: ArticleItem[];
  newsletter: {
    headline: string;
    subheadline: string;
    ctaLabel: string;
  };
} = {
  meta: {
    title: "Real Estate Insights & Investor Resources — Jeje-Ola Properties",
    description:
      "Market analysis, investor guides, and stories from Nigeria's premium real-estate sector. Stay informed with Jeje-Ola Properties."
  },
  hero: {
    eyebrow: "Insights & Intelligence",
    headline: "Insights for Smart Investors and Homeowners",
    introduction:
      "Market analysis, investor guides, and stories from Nigeria's premium real-estate sector."
  },
  categories: [
    "All",
    "Market Analysis",
    "Investor Education",
    "Diaspora Guides",
    "Property Spotlights",
    "News & Press",
    "Estate Management Tips"
  ] as const,
  featuredArticle: {
    id: "diaspora-invest-safely",
    slug: "how-diaspora-nigerians-can-invest-in-real-estate-safely",
    title: "How Diaspora Nigerians Can Invest in Real Estate Safely (Complete 2026 Guide)",
    category: "Diaspora Guides",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1600&q=85",
    imageAlt: "Executive diaspora investor reviewing Nigerian real estate portfolio",
    isFeatured: true
  },
  pillarArticles: [
    {
      id: "diaspora-invest-safely",
      slug: "how-diaspora-nigerians-can-invest-in-real-estate-safely",
      title: "How Diaspora Nigerians Can Invest in Real Estate Safely (Complete 2026 Guide)",
      category: "Diaspora Guides",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1600&q=85",
      imageAlt: "Executive diaspora investor reviewing Nigerian real estate portfolio",
      isFeatured: true
    },
    {
      id: "giap-vs-wealthstream",
      slug: "giap-vs-wealthstream-which-investment-plan-is-right-for-you",
      title: "GIAP vs WealthStream — Which Investment Plan Is Right for You?",
      category: "Investor Education",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85",
      imageAlt: "Architectural real estate development representing structured investment vehicles",
      isFeatured: false
    },
    {
      id: "abuja-appreciation-locations",
      slug: "understanding-real-estate-appreciation-in-abuja-5-locations-to-watch",
      title: "Understanding Real Estate Appreciation in Abuja: 5 Locations to Watch",
      category: "Market Analysis",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85",
      imageAlt: "Abuja prime commercial corridor highlighting growth sectors in the FCT",
      isFeatured: false
    },
    {
      id: "hidden-fees-nigerian-real-estate",
      slug: "the-true-cost-of-hidden-fees-in-nigerian-real-estate",
      title: "The True Cost of Hidden Fees in Nigerian Real Estate",
      category: "Investor Education",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=85",
      imageAlt: "Clear legal property documentation and transparent real estate governance",
      isFeatured: false
    },
    {
      id: "why-smart-office-matters",
      slug: "why-a-smart-office-matters-inside-jeje-olas-new-guzape-headquarters",
      title: "Why a Smart Office Matters: Inside Jeje-Ola's New Guzape Headquarters",
      category: "News & Press",
      image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=85",
      imageAlt: "Contemporary architectural facade of Jeje-Ola Properties Guzape Smart Office Complex",
      isFeatured: false
    }
  ],
  newsletter: {
    headline: "Stay Informed on Nigerian Real Estate",
    subheadline: "Market analysis, investment guides, and property opportunities delivered directly to your inbox.",
    ctaLabel: "Subscribe"
  }
};

export const CONTACT_PAGE_DATA = {
  meta: {
    title: "Contact Jeje-Ola Properties — Book a Free Consultation",
    description:
      "Visit our Guzape office, call us, or send a message. Our team is ready to guide your real estate and investment journey."
  },
  hero: {
    eyebrow: "Let's Talk",
    headline: "Let's Talk About Your Future",
    introduction:
      "Visit our Guzape office, call us, or send a message. Our team is ready to guide your real estate and investment journey.",
    officeImage: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85",
    officeImageAlt: "Jeje-Ola Properties Guzape Smart Office Complex façade in Abuja"
  },
  office: {
    title: "Guzape Smart Office Complex",
    address: {
      line1: "Plot 1059, Adamu Allero Crescent",
      city: "Guzape, Abuja",
      country: "Nigeria"
    },
    phones: [
      { display: "+234 8066 873 988", value: "+2348066873988" },
      { display: "+234 8075 464 774", value: "+2348075464774" }
    ],
    email: "info@jejeolaproperties.com.ng",
    hours: "Monday–Friday, 9:00am–5:00pm WAT",
    map: {
      embedQuery: "Plot 1059, Adamu Allero Crescent, Guzape, Abuja",
      directionsUrl: "https://maps.google.com/?q=Plot+1059+Adamu+Allero+Crescent+Guzape+Abuja"
    }
  },
  form: {
    reasons: [
      "General",
      "Property Inquiry",
      "Investment Inquiry",
      "Press",
      "Careers",
      "Partnership"
    ],
    consentText: "I consent to having Jeje-Ola Properties store and process my information to respond to this inquiry.",
    submitLabel: "Send Message"
  }
};


