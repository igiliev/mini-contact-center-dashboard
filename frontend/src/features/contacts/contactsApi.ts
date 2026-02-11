import { http } from "../../api/http";
import type { Contact, Paginated } from "./contactsTypes";

export async function fetchContacts(params: { page?: number; search?: string }) {
  const res = await http.get<Paginated<Contact>>("/api/contacts", { params });
  return res.data;
}

export async function fetchContact(id: number) {
  const res = await http.get<Contact>(`/api/contacts/${id}`);
  return res.data;
}

export async function createContact(payload: Omit<Contact, "id" | "interactions">) {
  const res = await http.post<Contact>("/api/contacts", payload);
  return res.data;
}

export async function updateContact(id: number, payload: Omit<Contact, "id" | "interactions">) {
  const res = await http.put<Contact>(`/api/contacts/${id}`, payload);
  return res.data;
}

export async function deleteContact(id: number) {
  await http.delete(`/api/contacts/${id}`);
}
