import { projects, type Project } from "@/data/site";

export type ProjectMatch = {
  project: Project;
  score: number;
  hits: string[];
};

const STOP = new Set([
  "a",
  "an",
  "and",
  "for",
  "from",
  "in",
  "of",
  "on",
  "or",
  "the",
  "to",
  "with",
  "need",
  "looking",
  "someone",
  "who",
  "can",
]);

function hit(term: string, item: string) {
  if (item === term) return true;
  if (term.length >= 4 && item.startsWith(term)) return true;
  if (term.length >= 4 && item.includes(term)) return true;
  return false;
}

function tokens(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9+#]+/)
    .filter((item) => item.length > 1 && !STOP.has(item));
}

function documentOf(project: Project) {
  const lens = project.lenses
    ? [...(project.lenses.management ?? []), ...(project.lenses.engineering ?? []), ...(project.lenses.data ?? [])].join(" ")
    : "";

  return {
    title: tokens(project.title),
    category: tokens(project.category),
    tech: tokens(project.technologies),
    body: tokens(`${project.description} ${project.key_features} ${lens}`),
  };
}

const INDEX = projects.map((project) => ({ project, doc: documentOf(project) }));

export function matchProjects(query: string): ProjectMatch[] {
  const terms = tokens(query);
  if (!terms.length) return [];

  return INDEX.map(({ project, doc }) => {
    const hits = new Set<string>();
    let score = 0;

    for (const term of terms) {
      const inTitle = doc.title.some((item) => hit(term, item));
      const inCategory = doc.category.some((item) => hit(term, item));
      const inTech = doc.tech.some((item) => hit(term, item));
      const inBody = doc.body.some((item) => hit(term, item));

      if (inTitle) {
        score += 6;
        hits.add(term);
      }
      if (inTech) {
        score += 4;
        hits.add(term);
      }
      if (inCategory) {
        score += 3;
        hits.add(term);
      }
      if (inBody) {
        score += 2;
        hits.add(term);
      }
    }

    return { project, score, hits: [...hits].slice(0, 4) };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.project.title.localeCompare(b.project.title));
}
