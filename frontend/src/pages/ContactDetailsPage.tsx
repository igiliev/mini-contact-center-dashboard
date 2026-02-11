import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { loadContact } from "../features/contacts/contactsSlice";

export default function ContactDetailsPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { selected, loadingSelected, error } = useAppSelector((s) => s.contacts);

  useEffect(() => {
    if (id) dispatch(loadContact(Number(id)));
  }, [dispatch, id]);

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", fontFamily: "system-ui" }}>
      <Link to="/">← Back</Link>

      {loadingSelected && <div>Loading...</div>}
      {error && <div style={{ color: "crimson" }}>{error}</div>}

      {selected && (
        <>
          <h2>{selected.name}</h2>
          <div>Email: {selected.email}</div>
          <div>Phone: {selected.phone ?? "-"}</div>
          <div>Company: {selected.company ?? "-"}</div>

          <h3 style={{ marginTop: 24 }}>Recent interactions</h3>
          {selected.interactions?.length ? (
            <ul>
              {selected.interactions.map((i) => (
                <li key={i.id} style={{ marginBottom: 8 }}>
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
