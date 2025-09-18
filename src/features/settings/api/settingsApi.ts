import { type Setting } from "../types";

let settings: Setting[] = [
  { id: 1, key: "projectTemplate", value: "Default Template" },
  { id: 2, key: "impactCategory", value: "Education" },
];

let nextId = 3;

export const fetchSettings = async (): Promise<Setting[]> => {
  return new Promise(res => setTimeout(() => res([...settings]), 300));
};

export const createSetting = async (setting: Omit<Setting, "id">): Promise<Setting> => {
  const newSetting = { ...setting, id: nextId++ };
  settings.push(newSetting);
  return new Promise(res => setTimeout(() => res(newSetting), 300));
};

export const updateSetting = async (updated: Setting): Promise<Setting> => {
  settings = settings.map(s => (s.id === updated.id ? updated : s));
  return new Promise(res => setTimeout(() => res(updated), 300));
};

export const deleteSetting = async (id: number): Promise<void> => {
  settings = settings.filter(s => s.id !== id);
  return new Promise(res => setTimeout(() => res(), 300));
};
