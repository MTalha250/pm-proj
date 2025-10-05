// Generate and manage browser session ID for bookmarks (no auth)
export function getSessionId(): string {
  if (typeof window === "undefined") return "";

  let sessionId = localStorage.getItem("pm_session_id");

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    localStorage.setItem("pm_session_id", sessionId);
  }

  return sessionId;
}
