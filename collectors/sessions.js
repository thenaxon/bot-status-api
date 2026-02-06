import { readFile } from "node:fs/promises";

/**
 * Collect active sessions from OpenClaw sessions.json
 * Focuses on spawn sessions (sub-agents) for overnight task monitoring
 */
export async function collect(config) {
  const ocHome = config.openclawHome || process.env.OPENCLAW_HOME;
  const sessionsPath = ocHome 
    ? `${ocHome}/agents/main/sessions/sessions.json`
    : null;

  if (!sessionsPath) {
    return { 
      total: 0, 
      main: 0, 
      cron: 0, 
      spawn: 0, 
      spawns: [],
      note: "no openclawHome configured" 
    };
  }

  try {
    const sessions = JSON.parse(await readFile(sessionsPath, "utf8"));
    const entries = Object.entries(sessions);

    // Categorize sessions by type
    let main = 0;
    let cron = 0;
    let spawn = 0;
    const spawns = [];

    for (const [key, data] of entries) {
      if (key.includes(":spawn:") || key.includes(":subagent:") || key.startsWith("spawn:")) {
        spawn++;
        spawns.push({
          key,
          label: data.label || data.origin?.label || "Unknown Task",
          model: data.model || "unknown",
          tokens: data.totalTokens || 0,
          updatedAt: data.updatedAt ? new Date(data.updatedAt).toISOString() : null,
          status: data.abortedLastRun ? "aborted" : "running"
        });
      } else if (key.includes(":cron:")) {
        cron++;
      } else if (key.endsWith(":main")) {
        main++;
      }
    }

    // Sort spawns by most recently updated
    spawns.sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));

    return {
      total: entries.length,
      main,
      cron,
      spawn,
      spawns
    };
  } catch (err) {
    return { 
      total: 0, 
      main: 0, 
      cron: 0, 
      spawn: 0, 
      spawns: [],
      note: `failed to read sessions: ${err.message}` 
    };
  }
}
