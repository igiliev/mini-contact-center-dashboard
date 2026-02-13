import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { loadContacts, setPage, setSearch } from "../features/contacts/contactsSlice";
import styles from "./ContactsPage.module.scss";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("") || "?";
}

export default function ContactsPage() {
  const dispatch = useAppDispatch();
  const { list, loadingList, error, search, page } = useAppSelector((s) => s.contacts);

  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    dispatch(loadContacts());
  }, [dispatch, page, search]);

  function applySearch() {
    dispatch(setSearch(localSearch));
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerIcon} aria-hidden>
          {/* users icon */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
              stroke="rgba(6,182,212,0.95)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
              stroke="rgba(6,182,212,0.95)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M22 21v-2a4 4 0 0 0-3-3.87"
              stroke="rgba(20,184,166,0.95)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M16 3.13a4 4 0 0 1 0 7.75"
              stroke="rgba(20,184,166,0.95)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div>
          <h2 className={styles.headerTitle}>Contacts</h2>
          <p className={styles.headerSubtitle}>Manage and search your contact list</p>
        </div>
      </div>

      <div className={styles.searchCard}>
        <div className={styles.searchRow}>
          <div className={styles.searchInputWrap}>
            <span className={styles.searchIcon} aria-hidden>
              {/* search icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 21l-4.3-4.3"
                  stroke="rgba(15,23,42,0.6)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
                  stroke="rgba(15,23,42,0.6)"
                  strokeWidth="2"
                />
              </svg>
            </span>

            <input
              className={styles.searchInput}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search name/email/company/phone"
              onKeyDown={(e) => {
                if (e.key === "Enter") applySearch();
              }}
            />
          </div>
        </div>
      </div>

      <div className={styles.tableCard}>
        {loadingList && <div style={{ padding: 18 }}>Loading...</div>}
        {error && <div style={{ padding: 18, color: "crimson" }}>{error}</div>}

        <div className={styles.tableScroll}>        
          {list && (
            <>
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr>
                    <th className={styles.th}>Name</th>
                    <th className={styles.th}>Email</th>
                    <th className={styles.th}>Phone</th>
                    <th className={styles.th}>Company</th>
                  </tr>
                </thead>

                <tbody>
                  {list.data.map((c) => (
                    <tr key={c.id} className={styles.tbodyRow}>
                      <td className={styles.td}>
                        <div className={styles.nameCell}>
                          <div className={styles.avatar}>{initials(c.name)}</div>
                          <Link to={`/contacts/${c.id}`}>{c.name}</Link>
                        </div>
                      </td>

                      <td className={styles.td}>
                        <div className={styles.emailCell}>
                          <span className={styles.iconMini} aria-hidden>
                            {/* mail icon */}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path
                                d="M4 4h16v16H4V4Z"
                                stroke="rgba(6,182,212,0.9)"
                                strokeWidth="2"
                                strokeLinejoin="round"
                              />
                              <path
                                d="m4 7 8 6 8-6"
                                stroke="rgba(6,182,212,0.9)"
                                strokeWidth="2"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                          <span>{c.email}</span>
                        </div>
                      </td>

                      <td className={styles.td}>
                        {c.phone ? (
                          <span>{c.phone}</span>
                        ) : (
                          <span className={styles.mutedDash}>-</span>
                        )}
                      </td>

                      <td className={styles.td}>
                        {c.company ? <span>{c.company}</span> : <span className={styles.mutedDash}>-</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className={styles.footer}>
                <button
                  className={styles.pagerBtn}
                  disabled={list.current_page <= 1}
                  onClick={() => dispatch(setPage(list.current_page - 1))}
                >
                  ‹ Prev
                </button>

                <div className={styles.pagerInfo}>
                  Page <strong>{list.current_page}</strong> of <strong>{list.last_page}</strong>{" "}
                  <span style={{ opacity: 0.7 }}>(Total: {list.total})</span>
                </div>

                <button
                  className={styles.pagerBtn}
                  disabled={list.current_page >= list.last_page}
                  onClick={() => dispatch(setPage(list.current_page + 1))}
                >
                  Next ›
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}