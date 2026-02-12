import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { loadContacts, setPage, setSearch } from "../features/contacts/contactsSlice";
import { logout } from "../features/auth/authSlice";
import { addContact } from "../features/contacts/contactsSlice";

export default function ContactsPage() {
  const dispatch = useAppDispatch();
  const { list, loadingList, error, search, page } = useAppSelector((s) => s.contacts);
  // const token = useAppSelector((s) => s.auth.token);

  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    dispatch(loadContacts());
  }, [dispatch, page, search]);

  function applySearch() {
    dispatch(setSearch(localSearch));
  }

  async function onLogout() {
  await dispatch(logout());
}

async function quickAdd() {
  // temporary quick add (we'll replace with a proper form modal next)
  const random = Math.floor(Math.random() * 100000);
  await dispatch(
    addContact({
      name: `New Contact ${random}`,
      email: `new${random}@example.com`,
      phone: null,
      company: null,
    })
  );
  dispatch(loadContacts());
}

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto", fontFamily: "system-ui" }}>
      <h2>Contacts</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={quickAdd}>+ Add Contact</button>
        <button onClick={onLogout}>Logout</button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Search name/email/company/phone"
          style={{ flex: 1 }}
        />
        <button onClick={applySearch}>Search</button>
      </div>

      {loadingList && <div>Loading...</div>}
      {error && <div style={{ color: "crimson" }}>{error}</div>}

      {list && (
        <>
          <table width="100%" cellPadding={8} style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th align="left">Name</th>
                <th align="left">Email</th>
                <th align="left">Phone</th>
                <th align="left">Company</th>
              </tr>
            </thead>
            <tbody>
              {list.data.map((c) => (
                <tr key={c.id} style={{ borderTop: "1px solid #ddd" }}>
                  <td>
                    <Link to={`/contacts/${c.id}`}>{c.name}</Link>
                  </td>
                  <td>{c.email}</td>
                  <td>{c.phone ?? "-"}</td>
                  <td>{c.company ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
            <button disabled={list.current_page <= 1} onClick={() => dispatch(setPage(list.current_page - 1))}>
              Prev
            </button>
            <div>
              Page {list.current_page} / {list.last_page} (Total: {list.total})
            </div>
            <button
              disabled={list.current_page >= list.last_page}
              onClick={() => dispatch(setPage(list.current_page + 1))}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
