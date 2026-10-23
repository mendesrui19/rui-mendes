export const site = {
  name: "Rui Mendes",
  firstName: "Rui",
  lastName: "Mendes",
  handle: "rui.dev",
  url: "rui-mendes.vercel.app",
  location: "Felgueiras, Porto",
  photo: "/assets/rui.jpg",
  role: "Master in Data Science and Engineering at FEUP",
  available: "Open to work",
  about:
    "Bachelor’s in Information Systems Engineering and Management at the University of Minho (150/200), combining software engineering with business. Internships as a full-stack developer (Laravel, Node.js, JavaScript) and as a technology consultant.",
  fact: "Felgueiras · FEUP · UMinho",
  social: {
    linkedin: "https://www.linkedin.com/in/ruimiguelmendes",
    github: "https://github.com/mendesrui19",
  },
};

export type AccessCode = {
  label: string;
  value: string;
  hint?: string;
};

export type AccessNote = {
  title: string;
  detail: string;
  codes?: AccessCode[];
};

export type ProjectLenses = {
  management?: string[];
  engineering?: string[];
  data?: string[];
};

export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
  image_urls: string[];
  imageFit?: "cover" | "contain";
  live_url?: string;
  github_url?: string;
  technologies: string;
  key_features: string;
  lenses?: ProjectLenses;
  access?: AccessNote;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    id: "rasto-pedrogao",
    title: "Rasto · Pedrógão Grande 2017",
    category: "Data",
    description:
      "Interactive 3D reconstruction of the Pedrógão Grande and Góis wildfires (17–22 June 2017), built on real terrain, satellite and official data.",
    image_url: "/assets/projects/rasto-incident.jpg",
    image_urls: [
      "/assets/projects/rasto-incident.jpg",
      "/assets/projects/rasto-dashboard.jpg",
      "/assets/projects/rasto-resources.jpg",
      "/assets/projects/rasto-drones.jpg",
      "/assets/projects/rasto-map2d.jpg",
    ],
    live_url: "https://rasto-pedrogao.vercel.app/",
    github_url: "https://github.com/mendesrui19/rasto-pedrogao",
    technologies: "Python, pandas, rasterio, SciPy, three.js, Sentinel-2",
    key_features:
      "3D terrain with Sentinel-2 imagery, fire progression timeline, burn severity, analysis dashboard, fatalities vs fire arrival, resources and drone views, 2D topo map, CSV and JSON export",
    featured: true,
    lenses: {
      data: [
        "Collected and cross-checked official reports (CTI, ADAI), ICNF/SGIF records and satellite data (Sentinel-2, NASA FIRMS, ERA5).",
        "Reconstructed the fire progression from the ADAI isochrone map and VIIRS/MODIS detections, and validated it against the official burned area: 47,998 ha vs ICNF 48,050 ha, 91% overlap.",
        "Digitized ANPC resource data and geolocated fatalities, command posts and road closures; dashboard covers growth rate, spread speed, FWI and fatalities vs fire arrival.",
      ],
      engineering: [
        "Python pipeline (rasterio, pandas, SciPy) turns DEM, imagery, dNBR severity and NDVI into data the browser can load.",
        "three.js app with 50 × 50 km terrain, a time-driven fire front, 10 toggleable layers and charts that scrub the map.",
        "Code generated with AI (Claude Code) under my direction; interface inspired by Dilum Sanjaya's FireTrace concept, whose code was not used.",
      ],
      management: [
        "Scoped as an illustrative study tool, not an official document; sources and limitations open on first visit.",
        "Real data kept separate from illustrative parts: vehicle, aircraft and drone positions are clearly labelled as simulated.",
        "Written in memory of the 66 victims, with an English and Portuguese interface.",
      ],
    },
  },
  {
    id: "goeverywhere",
    title: "GoEverywhere",
    category: "Web",
    description:
      "Last-mile delivery platform built by a team of five at UMinho: customer site, admin console, courier PWA with GPS and a Strapi API.",
    image_url: "/assets/projects/goeverywhere-about.jpg",
    image_urls: [
      "/assets/projects/goeverywhere-about.jpg",
      "/assets/projects/goeverywhere-product.jpg",
      "/assets/projects/goeverywhere-admin.jpg",
    ],
    technologies: "Vue 3, Vite, Strapi, PostgreSQL, Leaflet, PWA",
    key_features:
      "Customer ordering and live tracking, admin console for orders, couriers and customers, courier PWA with GPS, operations map, per-order chat, PDF invoices by email, Google sign-in",
    lenses: {
      management: [
        "Team of five working on one monorepo: feature branches per person, pull requests and review before merging to main.",
        "Requirements tracked by ID (RF14–RF28): order approval and rejection, priorities with alerts, courier states and zones.",
        "Three audiences served by three apps: customers, operations admins and couriers on the road.",
      ],
      engineering: [
        "Vue 3 + Vite Front-Office and Back-Office, a courier PWA and a Strapi (JavaScript) API on PostgreSQL.",
        "My work included the PDF invoice sent by webhook and email with download in both sites, separate chat channels per order, and back-office logistics flows.",
        "Leaflet operations map with live courier pins, mobile GPS over HTTPS and Google OAuth 2.0 login for admins.",
      ],
    },
  },
  {
    id: "mipoetry",
    title: "MiPoetry",
    category: "Community",
    description:
      "Mobile-first poetry social network: write, share and discover poems. Installable PWA with a feed, anthologies and demo accounts.",
    image_url: "/assets/projects/mipoetry.jpg",
    image_urls: ["/assets/projects/mipoetry.jpg"],
    imageFit: "contain",
    live_url: "https://mipoetry.vercel.app",
    github_url: "https://github.com/mendesrui19/MiPoetry",
    technologies: "Next.js, TypeScript, Supabase, PWA",
    key_features:
      "Poem editor, feed and discovery, anthologies, reactions, demo accounts, PWA install",
    lenses: {
      management: [
        "Public beta with a tester guide: signup, feed, anthologies, social and PWA install.",
        "Four seeded demo writers (inesmar, tomasverso, luaferreira, zepassaro) so reviewers can enter without creating an account.",
        "Scope is writing + community. Documented beta gaps stay honest: messages and collab verses are still local.",
      ],
      engineering: [
        "Next.js PWA with a Zustand store on the device and optional Supabase sync (auth, RLS, storage).",
        "TipTap editor with auto-save drafts, privacy (public / followers / private) and anthology books.",
        "Offline mutation queue flushed on reconnect — the app still opens without a network.",
      ],
    },
    access: {
      title: "How to sign in",
      detail:
        "Open the public beta. Demo password: teste123456. On a phone, Add to Home Screen to use it as an app.",
      codes: [
        { label: "inesmar", value: "teste123456", hint: "Haiku and nature" },
        { label: "tomasverso", value: "teste123456", hint: "Urban free verse" },
        { label: "luaferreira", value: "teste123456", hint: "Melancholy and night" },
        { label: "zepassaro", value: "teste123456", hint: "Experimental" },
      ],
    },
  },
  {
    id: "56-cervejaria",
    title: "56 Cervejaria Hamburgueria",
    category: "Web",
    description:
      "Public site and staff system for 56 Cervejaria Hamburgueria in Fafe: employee floor, kitchen display, cashier and manager dashboard.",
    image_url: "/assets/projects/cervejaria-site.jpg",
    image_urls: [
      "/assets/projects/cervejaria-site.jpg",
      "/assets/projects/cervejaria-login.png",
      "/assets/projects/cervejaria-hub.png",
      "/assets/projects/cervejaria-empregado.png",
      "/assets/projects/cervejaria-cozinha.png",
      "/assets/projects/cervejaria-caixa.png",
      "/assets/projects/cervejaria-gestor.png",
      "/assets/projects/cervejaria-catalogo.png",
    ],
    live_url: "https://56cervejariahamburgueria.vercel.app/",
    github_url: "https://github.com/mendesrui19/56Cervejaria-Hamburgueria",
    technologies: "Next.js, TypeScript, Drizzle, Neon",
    key_features:
      "Public restaurant site, PIN staff access, employee table floor, kitchen display, cashier payments, Gestor56 dashboard and catalogue",
    lenses: {
      management: [
        "Four staff roles after one PIN: floor (Empregado), kitchen, cashier and Gestor56.",
        "Table lifecycle livre → ocupada → a_pagar; service day starts at 04:00; catalogue, audit and period filters.",
        "Public site (digital menu, Glovo, reviews) kept separate from the operations hub.",
      ],
      engineering: [
        "Next.js staff apps with HMAC-signed PIN cookie, Neon + Drizzle persistence.",
        "Live state by HTTP polling (~3s) — kitchen tickets, split pay (cash, Multibanco, MB Way).",
        "Audit log for voids, transfers and cancels so the floor stays traceable.",
      ],
    },
    access: {
      title: "Staff system",
      detail:
        "Open /sistema and enter 5656. From the hub you can open Empregado, Cozinha, Caixa and Gestor56.",
      codes: [{ label: "Panel code", value: "5656" }],
    },
  },
  {
    id: "francesinha-festival",
    title: "Francesinha Festival",
    category: "Web",
    description:
      "Offline-first table POS for the Francesinha Festival: tables, adult/child menus, products, split bills and day close.",
    image_url: "/assets/projects/francesinha-cover.jpg",
    imageFit: "contain",
    image_urls: [
      "/assets/projects/francesinha-mesas.jpg",
      "/assets/projects/francesinha-pessoas.jpg",
      "/assets/projects/francesinha-produtos.jpg",
      "/assets/projects/francesinha-pagar.jpg",
      "/assets/projects/francesinha-precos.jpg",
      "/assets/projects/francesinha-relatorio.jpg",
    ],
    github_url: "https://github.com/mendesrui19/francesinhafestival",
    technologies: "HTML, CSS, JavaScript",
    key_features:
      "Table floor, people and groups, product menu, split payment, price admin, daily cash close, offline storage",
    lenses: {
      management: [
        "Event POS for tables, groups, adult/child menus and shared extras.",
        "Price and product admin (comida/bebida, included vs extra) during service.",
        "Split bills (items / all / equal), change calculator and end-of-day reset.",
      ],
      engineering: [
        "Offline-first tablet app: local state with sync to a Neon-backed API when online.",
        "Vanilla HTML/CSS/JS, PWA-ready, built for an old iPad in a noisy festival floor.",
        "Validated product/price payloads and conflict-aware save so two devices do not wipe each other.",
      ],
    },
  },
  {
    id: "xoxa-cs2",
    title: "XOXA FPS",
    category: "Web",
    description:
      "Streamer hub for XOXA FPS: live stream home, about, casino with monthly skin, and a CS2-style leaderboard.",
    image_url: "/assets/projects/xoxa-home.jpg",
    image_urls: [
      "/assets/projects/xoxa-home.jpg",
      "/assets/projects/xoxa-about.jpg",
      "/assets/projects/xoxa-casino.jpg",
      "/assets/projects/xoxa-leaderboard.jpg",
    ],
    live_url: "https://xoxafps.vercel.app/",
    github_url: "https://github.com/mendesrui19/Perfil_Informativo_XOXA_CS2",
    technologies: "React, TypeScript, Vite, Express, Socket.IO",
    key_features: "Live stream home, player profile, Twitch casino, CS2-ranked leaderboard",
    lenses: {
      management: [
        "Streamer hub: live home, about, sponsors, setup, prizes, missions and history.",
        "Admin CMS to edit content, missions, prizes, casino odds and progression live.",
        "Viewer loop is watch → earn points → play → climb ranks / redeem — scoped as a catalogue of games, not a bank.",
      ],
      engineering: [
        "React + Vite frontend with Express API, JWT, Helmet and rate limits.",
        "Socket.IO for live casino; Twitch login/status; file/media uploads.",
        "Rule-based ranks (Prata → Global Elite) and XP from points — deterministic, not a trained model.",
      ],
    },
  },
  {
    id: "sqz-catalogo",
    title: "SQZ Catalogue",
    category: "Web",
    description:
      "Editorial catalogue for SQZ — squiiz by Lemon Jelly. Cinematic home, about and a 29-piece jewellery grid.",
    image_url: "/assets/projects/sqz-home.jpg",
    image_urls: [
      "/assets/projects/sqz-home.jpg",
      "/assets/projects/sqz-sobre.jpg",
      "/assets/projects/sqz-destaques.jpg",
      "/assets/projects/sqz-produtos.jpg",
    ],
    github_url: "https://github.com/mendesrui19/teste",
    technologies: "React, Framer Motion, Lenis, Tailwind",
    key_features:
      "Cinematic lemon hero, editorial about, featured picks, filtered catalogue, custom cursor and smooth scroll",
    lenses: {
      management: [
        "Written PRD from the client brief: brand SQZ / squiiz by Lemon Jelly, slogan, catalogue-only (no checkout).",
        "Four design iterations (pop → dark editorial → light → brand assets) with a locked design system.",
        "29 pieces in 5 categories; featured picks and filter counts for merchandising.",
      ],
      engineering: [
        "React 18 + Router, Tailwind, Framer Motion, Lenis smooth scroll, custom cursor.",
        "Static product data in the frontend — catalogue only, no checkout or inventory API.",
        "Category filters, hover cards and a cinematic hero video without emojis (client constraint).",
      ],
    },
  },
  {
    id: "foto-shop",
    title: "Foto Shop",
    category: "Integration",
    description:
      "Camera e-commerce wired into business systems: products and orders from SAP, invoices in Moloni, workflows in n8n, plus admin and supplier portals.",
    image_url: "/assets/projects/fotoshop-home.jpg",
    image_urls: [
      "/assets/projects/fotoshop-home.jpg",
      "/assets/projects/fotoshop-store-home.jpg",
      "/assets/projects/fotoshop-store-cart.jpg",
      "/assets/projects/fotoshop-admin-dashboard.jpg",
      "/assets/projects/fotoshop-admin-products.jpg",
      "/assets/projects/fotoshop-admin-orders.jpg",
      "/assets/projects/fotoshop-admin-stock.jpg",
      "/assets/projects/fotoshop-admin-stock-alerts.jpg",
      "/assets/projects/fotoshop-admin-suppliers.jpg",
      "/assets/projects/fotoshop-admin-customers.jpg",
      "/assets/projects/fotoshop-supplier-dashboard.jpg",
      "/assets/projects/fotoshop-supplier-purchases.jpg",
    ],
    technologies: "React, Node.js, Express, SAP API, Moloni, n8n, Supabase, Stripe",
    key_features:
      "Store with cart and Stripe checkout, SAP products and orders, Moloni invoices, n8n webhooks, admin back-office for orders and products, supplier and customer management synced with SAP, multi-warehouse stock with alerts, supplier portal, barcode stock scanner",
    lenses: {
      management: [
        "Order-to-invoice flow across systems: checkout creates the SAP document, the Moloni invoice and an n8n event.",
        "Three portals for three roles: customers, store admins and suppliers (purchases, credit notes, new products).",
        "Back-office covers orders, customers, suppliers, estimates, delivery notes, warehouses and stock.",
      ],
      engineering: [
        "React frontend and an Express backend that wraps the SAP, Moloni (OAuth, token cached for 1 h) and n8n APIs.",
        "Supabase for customer and supplier accounts; Stripe for card payments.",
        "Barcode stock scanner in the browser (Quagga) and mocked SAP data when the ERP is unavailable in development.",
        "Screenshots use sample data (fictional customers and suppliers) because the live SAP and Moloni accounts are offline.",
      ],
    },
  },
  {
    id: "parking-system",
    title: "Distributed Parking System",
    category: "Systems",
    description:
      "Parking servers that talk to space sensors over TCP, expose a REST API and register with a central manager using RSA certificates and signed messages.",
    image_url: "/assets/projects/parking-detail.jpg",
    image_urls: ["/assets/projects/parking-detail.jpg", "/assets/projects/parking-slots.jpg"],
    technologies: "Python, Flask, TCP sockets, threading, RSA, ReportLab",
    key_features:
      "Multi-threaded TCP server for sensors, REST API, signed and verified messages, live occupancy dashboard, cost calculator, PDF reports, multi-park map",
    lenses: {
      engineering: [
        "Each park runs a multi-threaded TCP server; sensor clients register a space and report free or taken.",
        "Flask REST API (/info, /lugares, /custo, /status) with /secure routes whose responses are signed with RSA.",
        "The park registers with the manager using an X.509 certificate and checks signatures before trusting data.",
      ],
      data: [
        "Live occupancy: free and taken spaces, occupancy rate and a per-space grid that refreshes on its own.",
        "Pricing model with base fee, hourly rate and daily cap, plus a cost calculator for a given stay.",
        "PDF occupancy reports generated on demand with ReportLab.",
      ],
    },
  },
  {
    id: "triagem-sns24",
    title: "SNS24 Triage",
    category: "Data",
    description:
      "TIA + SIAD 2025/2026 project: an SNS24-inspired triage system with Prolog rules and a chatbot.",
    image_url: "/assets/projects/sns24-home.jpg",
    image_urls: [
      "/assets/projects/sns24-home.jpg",
      "/assets/projects/sns24-interview.jpg",
      "/assets/projects/sns24-result.jpg",
      "/assets/projects/sns24-chat.jpg",
    ],
    github_url: "https://github.com/mendesrui19/Projeto_Triagem_E_CHAT_BOT",
    technologies: "Prolog, Groovy, RapidMiner, Python, LangChain, Ollama",
    key_features: "Rule interview UI, learned decision trees, explainable inference, protocol chatbot",
    lenses: {
      management: [
        "TIA + SIAD 2025/2026 academic project, split into P1 (rules + learning) and P2 (chat).",
        "Scope is SNS24-style urgency routing — not diagnosis or a replacement for 112.",
        "Clear handoff: emergency / urgent / family doctor / self-care, with Portuguese explanations.",
      ],
      engineering: [
        "Modular Prolog: facts, knowledge, inference, explanation and a branching interview UI.",
        "Groovy export from RapidMiner / Altair AI Studio into regras_aprendidas.pl.",
        "Python RAG chatbot (LangChain + Chroma + Ollama) and a green/blue web UI for the interview and bot.",
      ],
      data: [
        "Symptom KB with forward chaining and certainty factors; explanations proved backward in Portuguese.",
        "Decision-tree learning in RapidMiner; leaf confidence from class proportions.",
        "RAG over sns24_kb.txt (Gemma 3 4B + nomic-embed-text) with conversational memory.",
      ],
    },
  },
];

export const education: {
  id: string;
  school: string;
  title: string;
  period: string;
  start: string;
  end?: string;
  detail: string;
}[] = [
  {
    id: "feup",
    school: "FEUP",
    title: "Master in Data Science and Engineering",
    period: "Sep 2026 — present",
    start: "2026-09",
    detail: "Faculty of Engineering of the University of Porto",
  },
  {
    id: "uminho",
    school: "University of Minho",
    title: "Bachelor’s in Information Systems Engineering and Management",
    period: "Sep 2023 — Jul 2026",
    start: "2023-09",
    end: "2026-07",
    detail: "Academic standing: 150/200. Computing with management and data.",
  },
];

export const experience: {
  id: string;
  title: string;
  org: string;
  period: string;
  start: string;
  end?: string;
  place: string;
}[] = [
  {
    id: "ideal",
    title: "Technology Consultant & Product Management Intern",
    org: "Ideal Pc Shop",
    period: "Aug 2025 — Sep 2025",
    start: "2025-08",
    end: "2025-09",
    place: "Felgueiras · On-site",
  },
  {
    id: "cmf",
    title: "Summer Camp Monitor",
    org: "Felgueiras City Council",
    period: "Jul 2025 — Aug 2025",
    start: "2025-07",
    end: "2025-08",
    place: "Felgueiras · On-site",
  },
  {
    id: "softideia",
    title: "Full Stack Developer Intern",
    org: "Softideia",
    period: "Sep 2022 — Jun 2023",
    start: "2022-09",
    end: "2023-06",
    place: "Felgueiras · On-site",
  },
];

export type SkillGroup = {
  id: string;
  label: string;
  color: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: "dev",
    label: "Languages & frameworks",
    color: "#4f8cff",
    items: ["PHP", "Laravel", "Node.js", "Python", "R", "JavaScript", "React", "HTML5", "CSS", "C++"],
  },
  {
    id: "data",
    label: "Data & databases",
    color: "#2dd4bf",
    items: ["SQL", "MySQL", "PostgreSQL", "PL/SQL", "Tableau", "Data Analytics", "Database Mgmt"],
  },
  {
    id: "eng",
    label: "Engineering",
    color: "#38bdf8",
    items: ["REST API", "Web Services", "DevOps", "Software Eng.", "Architecture", "Arduino", "Hardware Diag."],
  },
  {
    id: "biz",
    label: "Business & management",
    color: "#a5b4fc",
    items: ["IS Design", "IT Consulting", "Product Mgmt", "Customer Success", "Project Mgmt"],
  },
];

export const skillCount = skillGroups.reduce((sum, group) => sum + group.items.length, 0);

export function getProject(id: string) {
  return projects.find((project) => project.id === id);
}
