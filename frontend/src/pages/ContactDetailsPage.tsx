import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { editContact, loadContact, removeContact } from "../features/contacts/contactsSlice";

type FormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
};

function ContactEditForm({
  initial,
  onSave,
  onDelete,
}: {
  contactId: number;
  initial: FormState;
  onSave: (payload: { name: string; email: string; phone: string | null; company: string | null }) => void;
  onDelete: () => void;
}) {
  const [form, setForm] = useState<FormState>(initial);

  return (
    <div style={{ display: "grid", gap: 10, maxWidth: 400 }}>
      <input
        value={form.name}
        placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        value={form.email}
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        value={form.phone}
        placeholder="Phone"
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <input
        value={form.company}
        placeholder="Company"
        onChange={(e) => setForm({ ...form, company: e.target.value })}
      />

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={() =>
            onSave({
              name: form.name,
              email: form.email,
              phone: form.phone || null,
              company: form.company || null,
            })
          }
        >
          Save
        </button>

        <button onClick={onDelete} style={{ background: "crimson", color: "white" }}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default function ContactDetailsPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const nav = useNavigate();

  const { selected, loadingSelected, error } = useAppSelector((s) => s.contacts);

  // Load contact
  useEffect(() => {
    if (id) dispatch(loadContact(Number(id)));
  }, [dispatch, id]);

  const initialForm = useMemo<FormState>(() => {
    return {
      name: selected?.name ?? "",
      email: selected?.email ?? "",
      phone: selected?.phone ?? "",
      company: selected?.company ?? "",
    };
  }, [selected?.id]); // reset only when switching contacts

  async function onSave(payload: { name: string; email: string; phone: string | null; company: string | null }) {
    if (!selected) return;

    const res = await dispatch(
      editContact({
        id: selected.id,
        payload,
      })
    );

    if (editContact.fulfilled.match(res)) {
      dispatch(loadContact(selected.id));
      alert("Saved!");
    }
  }

  async function onDelete() {
    if (!selected) return;

    const ok = confirm(`Delete ${selected.name}?`);
    if (!ok) return;

    const res = await dispatch(removeContact(selected.id));
    if (removeContact.fulfilled.match(res)) nav("/");
  }

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", fontFamily: "system-ui" }}>
      <Link to="/">← Back</Link>

      {loadingSelected && <div>Loading...</div>}
      {error && <div style={{ color: "crimson" }}>{error}</div>}

      {selected && (
        <>
          <h2 style={{ marginTop: 20 }}>{selected.name}</h2>

          <div>Email: {selected.email}</div>
          <div>Phone: {selected.phone ?? "-"}</div>
          <div>Company: {selected.company ?? "-"}</div>

          <h3 style={{ marginTop: 30 }}>Edit Contact</h3>

          {/* key forces remount when selected.id changes, resetting internal form state */}
          <ContactEditForm
            key={selected.id}
            contactId={selected.id}
            initial={initialForm}
            onSave={onSave}
            onDelete={onDelete}
          />

          <h3 style={{ marginTop: 40 }}>Recent interactions</h3>

          {selected.interactions?.length ? (
            <ul>
              {selected.interactions.map((i) => (
                <li key={i.id} style={{ marginBottom: 10 }}>
                  <strong>{i.type}</strong> — {new Date(i.timestamp).toLocaleString()}
                  {i.note ? <div>{i.note}</div> : null}
                </li>
              ))}
            </ul>
          ) : (
            <div>No interactions.</div>
          )}
        </>
      )}
    </div>
  );
}
