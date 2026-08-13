interface EscalationRecord {
  clerkName: string;
  language: string;
  time: number;
}

const records: EscalationRecord[] = [];

export function logEscalation(entry: { clerkName: string; language: string }) {
  records.push({ ...entry, time: Date.now() });
}

export function getEscalationCount() {
  return records.length;
}

export function getRecentEscalations(limit = 50) {
  return [...records].reverse().slice(0, limit);
}
