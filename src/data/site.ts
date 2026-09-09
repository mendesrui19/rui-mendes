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

export const education = [
  {
    id: "feup",
    school: "FEUP",
    title: "Master in Data Science and Engineering",
    period: "Sep 2026 — present",
    detail: "Faculty of Engineering of the University of Porto",
  },
  {
    id: "uminho",
    school: "University of Minho",
    title: "Bachelor’s in Information Systems Engineering and Management",
    period: "Sep 2023 — Jul 2026",
    detail: "Academic standing: 150/200. Computing with management and data.",
  },
];

export const experience = [
  {
    id: "ideal",
    title: "Technology Consultant & Product Management Intern",
    org: "Ideal Pc Shop",
    period: "Aug 2025 — Sep 2025",
    place: "Felgueiras · On-site",
  },
  {
    id: "cmf",
    title: "Summer Camp Monitor",
    org: "Felgueiras City Council",
    period: "Jul 2025 — Aug 2025",
    place: "Felgueiras · On-site",
  },
  {
    id: "softideia",
    title: "Full Stack Developer Intern",
    org: "Softideia",
    period: "Sep 2022 — Jun 2023",
    place: "Felgueiras · On-site",
  },
];

export const techStacks = [
  { id: "js", name: "JavaScript" },
  { id: "ts", name: "TypeScript" },
  { id: "react", name: "React" },
  { id: "next", name: "Next.js" },
  { id: "node", name: "Node.js" },
  { id: "laravel", name: "Laravel" },
  { id: "sql", name: "SQL" },
  { id: "prolog", name: "Prolog" },
  { id: "tw", name: "Tailwind" },
  { id: "supabase", name: "Supabase" },
];

export function getProject(id: string) {
  return projects.find((project) => project.id === id);
}
