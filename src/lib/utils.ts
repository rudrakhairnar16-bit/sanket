export function getTodayIST(): string {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const ist = new Date(now.getTime() + istOffset);
  return ist.toISOString().split("T")[0];
}

export const DEPARTMENTS = [
  "Water Tax",
  "Property Tax",
  "Police",
  "Municipal",
  "Health",
  "Education",
] as const;


