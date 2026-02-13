import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { editContact, loadContact, removeContact } from "../features/contacts/contactsSlice";
import styles from "./ContactDetailsPage.module.scss";
import {
  IconBack,
  IconMail,
  IconPhone,
  IconBuilding,
  IconPencil,
  IconSave,
  IconX,
  IconTrash,
} from "../ui/icons";


type FormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("") || "?";
}

function ContactEditForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: FormState;
  onSave: (payload: { name: string; email: string; phone: string | null; company: string | null }) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormState>(initial);

  return (
    <div className={styles.formGrid}>
      <div className={styles.field}>
        <div className={styles.label}>Full Name</div>
        <input
          className={styles.input}
          value={form.name}
          placeholder="Enter full name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div className={styles.field}>
        <div className={styles.label}>Email Address</div>
        <input
          className={styles.input}
          value={form.email}
          placeholder="Enter email address"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <div className={styles.field}>
        <div className={styles.label}>Phone Number</div>
        <input
          className={styles.input}
          value={form.phone}
          placeholder="Enter phone number"
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </div>

      <div className={styles.field}>
        <div className={styles.label}>Company</div>
        <input
          className={styles.input}
          value={form.company}
          placeholder="Enter company name"
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
      </div>

      <div className={styles.actions}>
        <button
          className={styles.primaryBtn}
          onClick={() =>
            onSave({
              name: form.name,
              email: form.email,
              phone: form.phone || null,
              company: form.company || null,
            })
          }
        >
          {/* save icon */}
          <IconSave width={16} height={16} />
          Save Changes
        </button>

        <button className={styles.secondaryBtn} onClick={onCancel}>
          {/* x icon */}
          <IconX width={16} height={16} />
          Cancel
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
  }, [selected?.id]);

  async function onSave(payload: { name: string; email: string; phone: string | null; company: string | null }) {
    if (!selected) return;

    const res = await dispatch(editContact({ id: selected.id, payload }));
    if (editContact.fulfilled.match(res)) {
      dispatch(loadContact(selected.id));
      alert("Saved!");
    }
  }

  function onCancel() {
    // simple: go back (matches screenshot "Cancel" intent)
    nav("/");
  }

  async function onDelete() {
    if (!selected) return;
    const ok = confirm(`Delete ${selected.name}?`);
    if (!ok) return;

    const res = await dispatch(removeContact(selected.id));
    if (removeContact.fulfilled.match(res)) nav("/");
  }

  if (loadingSelected) {
    return <div className={styles.page}>Loading...</div>;
  }

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.backRow}>
        {/* back arrow */}
        <IconBack width={18} height={18} />
        Back
      </Link>

      {error && <div style={{ color: "crimson", marginBottom: 12 }}>{error}</div>}

      {selected && (
        <>
          <div className={styles.header}>
            <div className={styles.avatar}>{initials(selected.name)}</div>
            <div className={styles.titleBlock}>
              <h1 className={styles.name}>{selected.name}</h1>
              <p className={styles.subtitle}>Contact Information</p>
            </div>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <div className={`${styles.infoIcon} ${styles.iconEmail}`} aria-hidden>
                {/* mail */}
                <IconMail height={18} width={18} />
              </div>
              <div>
                <p className={styles.infoLabel}>Email</p>
                <p className={styles.infoValue}>{selected.email}</p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={`${styles.infoIcon} ${styles.iconPhone}`} aria-hidden>
                {/* phone */}
                <IconPhone width={18} height={18} />
              </div>
              <div>
                <p className={styles.infoLabel}>Phone</p>
                <p className={styles.infoValue}>{selected.phone ?? <span className={styles.mutedValue}>Not provided</span>}</p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={`${styles.infoIcon} ${styles.iconCompany}`} aria-hidden>
                {/* building */}
                <IconBuilding width={18} height={18} />
              </div>
              <div>
                <p className={styles.infoLabel}>Company</p>
                <p className={styles.infoValue}>
                  {selected.company ?? <span className={styles.mutedValue}>Not provided</span>}
                </p>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitleRow}>
              <div className={styles.cardTitleIcon} aria-hidden>
                {/* pencil */}
                <IconPencil width={18} height={18} />
              </div>
              <h3 className={styles.cardTitle}>Edit Contact</h3>
            </div>

            <ContactEditForm
              key={selected.id}
              initial={initialForm}
              onSave={onSave}
              onCancel={onCancel}
            />
          </div>

          <div className={`${styles.card} ${styles.sectionSpacing}`}>
            <h3 className={styles.cardTitle} style={{ marginBottom: 0 }}>
              Recent Interactions
            </h3>

            {selected.interactions?.length ? (
              <ul style={{ marginTop: 14 }}>
                {selected.interactions.map((i) => (
                  <li key={i.id} style={{ marginBottom: 10 }}>
                    <strong>{i.type}</strong> — {new Date(i.timestamp).toLocaleString()}
                    {i.note ? <div>{i.note}</div> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.emptyState}>
                <div>
                  <div className={styles.emptyIcon} aria-hidden>
                    {/* mail icon */}
                    <IconMail width={22} height={22} />
                  </div>
                  <p className={styles.emptyTitle}>No interactions yet</p>
                  <p className={styles.emptySub}>Contact activity will appear here</p>
                </div>
              </div>
            )}
          </div>

          <div className={styles.deleteWrap}>
            <button className={styles.deleteBtn} onClick={onDelete}>
              {/* trash */}
              <IconTrash width={18} height={18} />
              Delete Contact
            </button>
          </div>
        </>
      )}
    </div>
  );
}
