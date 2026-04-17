const PROJECTS_CACHE_KEY = "portfolio_projects_cache_v1";
const FEATURED_PROJECTS_CACHE_KEY = "portfolio_featured_projects_cache_v1";
const RESUME_CACHE_KEY = "portfolio_resume_cache_v1";

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readJSON(key) {
  if (!isBrowser()) return null;

  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function writeJSON(key, value) {
  if (!isBrowser()) return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota and serialization errors.
  }
}

function removeKey(key) {
  if (!isBrowser()) return;

  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore storage errors.
  }
}

export function readCachedProjects() {
  const cached = readJSON(PROJECTS_CACHE_KEY);
  return Array.isArray(cached) ? cached : [];
}

export function readCachedFeaturedProjects() {
  const cached = readJSON(FEATURED_PROJECTS_CACHE_KEY);
  return Array.isArray(cached) ? cached : [];
}

export function writeCachedProjects(projects = []) {
  const normalized = Array.isArray(projects) ? projects : [];
  writeJSON(PROJECTS_CACHE_KEY, normalized);
  writeJSON(
    FEATURED_PROJECTS_CACHE_KEY,
    normalized.filter((project) => project?.featured),
  );
}

export function writeCachedFeaturedProjects(projects = []) {
  const normalized = Array.isArray(projects) ? projects : [];
  writeJSON(FEATURED_PROJECTS_CACHE_KEY, normalized);
}

export function upsertCachedProject(project) {
  if (!project?._id) return;

  const existing = readCachedProjects();
  const nextProjects = [
    ...existing.filter((item) => item?._id !== project._id),
    project,
  ].sort((left, right) => {
    const leftOrder = Number.isFinite(left?.order)
      ? left.order
      : Number.MAX_SAFE_INTEGER;
    const rightOrder = Number.isFinite(right?.order)
      ? right.order
      : Number.MAX_SAFE_INTEGER;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    const leftCreatedAt = left?.createdAt
      ? new Date(left.createdAt).getTime()
      : 0;
    const rightCreatedAt = right?.createdAt
      ? new Date(right.createdAt).getTime()
      : 0;
    return rightCreatedAt - leftCreatedAt;
  });
  writeCachedProjects(nextProjects);
}

export function removeCachedProject(projectId) {
  if (!projectId) return;

  const nextProjects = readCachedProjects().filter(
    (project) => project?._id !== projectId,
  );
  writeCachedProjects(nextProjects);
}

export function readCachedResume() {
  const cached = readJSON(RESUME_CACHE_KEY);
  return cached && typeof cached === "object" ? cached : null;
}

export function writeCachedResume(resume) {
  if (!resume || typeof resume !== "object") return;
  writeJSON(RESUME_CACHE_KEY, resume);
}

export function clearCachedResume() {
  removeKey(RESUME_CACHE_KEY);
}

export { PROJECTS_CACHE_KEY, FEATURED_PROJECTS_CACHE_KEY, RESUME_CACHE_KEY };
