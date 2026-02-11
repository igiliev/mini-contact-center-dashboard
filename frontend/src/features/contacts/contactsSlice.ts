import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { Contact, Paginated } from "./contactsTypes";
import * as api from "./contactsApi";

type ApiError = { message?: string };

type ContactsState = {
  list: Paginated<Contact> | null;
  selected: Contact | null;
  loadingList: boolean;
  loadingSelected: boolean;
  saving: boolean;
  error: string | null;
  search: string;
  page: number;
};

const initialState: ContactsState = {
  list: null,
  selected: null,
  loadingList: false,
  loadingSelected: false,
  saving: false,
  error: null,
  search: "",
  page: 1,
};

export const loadContacts = createAsyncThunk<
  Paginated<Contact>,
  void,
  { state: { contacts: ContactsState }; rejectValue: string }
>("contacts/loadContacts", async (_, thunkApi) => {
  try {
    const { page, search } = thunkApi.getState().contacts;
    return await api.fetchContacts({ page, search: search || undefined });
  } catch (e: unknown) {
    if (axios.isAxiosError<ApiError>(e)) {
      return thunkApi.rejectWithValue(e.response?.data?.message ?? "Failed to load contacts");
    }
    return thunkApi.rejectWithValue("Failed to load contacts");
  }
});

export const loadContact = createAsyncThunk<Contact, number, { rejectValue: string }>(
  "contacts/loadContact",
  async (id, thunkApi) => {
    try {
      return await api.fetchContact(id);
    } catch (e: unknown) {
      if (axios.isAxiosError<ApiError>(e)) {
        return thunkApi.rejectWithValue(e.response?.data?.message ?? "Failed to load contact");
      }
      return thunkApi.rejectWithValue("Failed to load contact");
    }
  }
);

export const addContact = createAsyncThunk<Contact, Omit<Contact, "id" | "interactions">, { rejectValue: string }>(
  "contacts/addContact",
  async (payload, thunkApi) => {
    try {
      return await api.createContact(payload);
    } catch (e: unknown) {
      if (axios.isAxiosError<ApiError>(e)) {
        return thunkApi.rejectWithValue(e.response?.data?.message ?? "Failed to create contact");
      }
      return thunkApi.rejectWithValue("Failed to create contact");
    }
  }
);

export const editContact = createAsyncThunk<
  Contact,
  { id: number; payload: Omit<Contact, "id" | "interactions"> },
  { rejectValue: string }
>("contacts/editContact", async ({ id, payload }, thunkApi) => {
  try {
    return await api.updateContact(id, payload);
  } catch (e: unknown) {
    if (axios.isAxiosError<ApiError>(e)) {
      return thunkApi.rejectWithValue(e.response?.data?.message ?? "Failed to update contact");
    }
    return thunkApi.rejectWithValue("Failed to update contact");
  }
});

export const removeContact = createAsyncThunk<void, number, { rejectValue: string }>(
  "contacts/removeContact",
  async (id, thunkApi) => {
    try {
      await api.deleteContact(id);
    } catch (e: unknown) {
      if (axios.isAxiosError<ApiError>(e)) {
        return thunkApi.rejectWithValue(e.response?.data?.message ?? "Failed to delete contact");
      }
      return thunkApi.rejectWithValue("Failed to delete contact");
    }
  }
);

const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    setSearch(state, action: { payload: string }) {
      state.search = action.payload;
      state.page = 1;
    },
    setPage(state, action: { payload: number }) {
      state.page = action.payload;
    },
    clearSelected(state) {
      state.selected = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(loadContacts.pending, (s) => {
      s.loadingList = true;
      s.error = null;
    });
    b.addCase(loadContacts.fulfilled, (s, a) => {
      s.loadingList = false;
      s.list = a.payload;
    });
    b.addCase(loadContacts.rejected, (s, a) => {
      s.loadingList = false;
      s.error = a.payload ?? "Failed to load contacts";
    });

    b.addCase(loadContact.pending, (s) => {
      s.loadingSelected = true;
      s.error = null;
    });
    b.addCase(loadContact.fulfilled, (s, a) => {
      s.loadingSelected = false;
      s.selected = a.payload;
    });
    b.addCase(loadContact.rejected, (s, a) => {
      s.loadingSelected = false;
      s.error = a.payload ?? "Failed to load contact";
    });

    b.addCase(addContact.pending, (s) => {
      s.saving = true;
      s.error = null;
    });
    b.addCase(addContact.fulfilled, (s) => {
      s.saving = false;
    });
    b.addCase(addContact.rejected, (s, a) => {
      s.saving = false;
      s.error = a.payload ?? "Failed to create contact";
    });

    b.addCase(editContact.pending, (s) => {
      s.saving = true;
      s.error = null;
    });
    b.addCase(editContact.fulfilled, (s, a) => {
      s.saving = false;
      if (s.selected?.id === a.payload.id) s.selected = { ...s.selected, ...a.payload };
    });
    b.addCase(editContact.rejected, (s, a) => {
      s.saving = false;
      s.error = a.payload ?? "Failed to update contact";
    });

    b.addCase(removeContact.pending, (s) => {
      s.saving = true;
      s.error = null;
    });
    b.addCase(removeContact.fulfilled, (s) => {
      s.saving = false;
    });
    b.addCase(removeContact.rejected, (s, a) => {
      s.saving = false;
      s.error = a.payload ?? "Failed to delete contact";
    });
  },
});

export const { setSearch, setPage, clearSelected } = contactsSlice.actions;
export default contactsSlice.reducer;
