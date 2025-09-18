// src/features/impactEntries/api/impactApi.ts
import { type ImpactEntry } from "../types";

let mockEntries: ImpactEntry[] = [
  { id: 1, title: "School Support", beneficiaries: 120 },
  { id: 2, title: "Health Campaign", beneficiaries: 80 },
];

export async function fetchImpactEntries(): Promise<ImpactEntry[]> {
  return new Promise((res) => setTimeout(() => res(mockEntries), 500));
}

export async function createImpactEntry(
  entry: Omit<ImpactEntry, "id">
): Promise<ImpactEntry> {
  const newEntry = { ...entry, id: Date.now() };
  mockEntries.push(newEntry);
  return new Promise((res) => setTimeout(() => res(newEntry), 300));
}

export async function updateImpactEntry(
  entry: ImpactEntry
): Promise<ImpactEntry> {
  mockEntries = mockEntries.map((e) => (e.id === entry.id ? entry : e));
  return new Promise((res) => setTimeout(() => res(entry), 300));
}

export async function deleteImpactEntry(id: number): Promise<void> {
  mockEntries = mockEntries.filter((e) => e.id !== id);
  return new Promise((res) => setTimeout(() => res(), 300));
}
