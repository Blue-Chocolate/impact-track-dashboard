import { type  Donor } from "../types";

let donors: Donor[] = [
  { id: 1, name: "Alice", email: "alice@example.com", amount: 500 },
  { id: 2, name: "Bob", email: "bob@example.com", amount: 300 },
];

let nextId = 3;

export const fetchDonors = async (): Promise<Donor[]> => {
  return new Promise(res => setTimeout(() => res([...donors]), 300));
};

export const createDonor = async (donor: Omit<Donor, "id">): Promise<Donor> => {
  const newDonor = { ...donor, id: nextId++ };
  donors.push(newDonor);
  return new Promise(res => setTimeout(() => res(newDonor), 300));
};

export const updateDonor = async (updated: Donor): Promise<Donor> => {
  donors = donors.map(d => (d.id === updated.id ? updated : d));
  return new Promise(res => setTimeout(() => res(updated), 300));
};

export const deleteDonor = async (id: number): Promise<void> => {
  donors = donors.filter(d => d.id !== id);
  return new Promise(res => setTimeout(() => res(), 300));
};
