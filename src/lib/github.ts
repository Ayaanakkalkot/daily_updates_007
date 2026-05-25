const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const GITHUB_OWNER = process.env.GITHUB_OWNER!;
const GITHUB_REPO = process.env.GITHUB_REPO!;
const API = "https://api.github.com";

const headers = () => ({
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github+json",
  "Content-Type": "application/json",
  "X-GitHub-Api-Version": "2022-11-28",
});

export type UpdateData = { points: string[] };

const USER_FOLDERS: Record<string, string> = {
  "ayaan.a@zintlr.com": "ayaan",
  "yashwanth.a@zintlr.com": "yashwanth",
};

export function getUserFolder(username: string): string {
  return USER_FOLDERS[username] || username.split("@")[0].replace(/\./g, "_");
}

function updatesPath(userFolder: string) {
  return `updates/${userFolder}`;
}

function serialize(date: string, data: UpdateData): string {
  const lines = data.points.map((p) => `- ${p}`).join("\n");
  return `# ${date}\n\n${lines || "_Nothing logged_"}\n`;
}

function deserialize(content: string): UpdateData {
  const lines = content
    .split("\n")
    .filter((l) => l.startsWith("- "))
    .map((l) => l.slice(2).trim())
    .filter(Boolean);
  return { points: lines };
}

export async function getUpdate(date: string, userFolder: string): Promise<UpdateData | null> {
  const url = `${API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${updatesPath(userFolder)}/${date}.md`;
  const res = await fetch(url, { headers: headers(), cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub GET failed: ${res.status}`);
  const json = await res.json();
  const content = Buffer.from(json.content, "base64").toString("utf-8");
  return deserialize(content);
}

export async function saveUpdate(date: string, data: UpdateData, userFolder: string): Promise<void> {
  const url = `${API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${updatesPath(userFolder)}/${date}.md`;
  const content = Buffer.from(serialize(date, data)).toString("base64");

  const existing = await fetch(url, { headers: headers(), cache: "no-store" });
  let sha: string | undefined;
  if (existing.ok) sha = (await existing.json()).sha;

  const body: Record<string, string> = { message: `update(${userFolder}): ${date}`, content };
  if (sha) body.sha = sha;

  const res = await fetch(url, { method: "PUT", headers: headers(), body: JSON.stringify(body) });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || `GitHub PUT failed: ${res.status}`);
  }
}

export async function listUpdates(userFolder: string): Promise<{ date: string; data: UpdateData }[]> {
  const url = `${API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${updatesPath(userFolder)}`;
  const res = await fetch(url, { headers: headers(), cache: "no-store" });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`GitHub list failed: ${res.status}`);

  const files: { name: string; download_url: string }[] = await res.json();
  const mdFiles = files
    .filter((f) => f.name.endsWith(".md"))
    .sort((a, b) => b.name.localeCompare(a.name));

  return Promise.all(
    mdFiles.map(async (f) => {
      const date = f.name.replace(".md", "");
      const r = await fetch(f.download_url, { cache: "no-store" });
      const text = await r.text();
      return { date, data: deserialize(text) };
    })
  );
}
