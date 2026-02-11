export type Interaction = {
  id: number;
  type: string;
  timestamp: string; // ISO
  note: string | null;
};

export type Contact = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  created_at?: string;
  updated_at?: string;
  interactions?: Interaction[];
};

export type Paginated<T> = {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
};
