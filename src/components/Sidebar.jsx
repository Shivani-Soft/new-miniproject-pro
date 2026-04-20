import styles from "./sidebar.module.css";

function Sidebar({ changeTab, currTab, user, onLogout }) {
  return (
    <>
      <div
        className={`d-flex flex-column flex-shrink-0 p-3 modern-sidebar shadow-sm ${styles.container}`}
        style={{ width: "280px" }}
      >
        <a
          href="/"
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none px-2"
        >
          <span className="fs-4 fw-bold" style={{ color: "var(--primary-color)" }}>Menu</span>
        </a>

        <hr className="sidebar-divider" />

        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item" onClick={() => changeTab("Home")}>
            <a
              href="#"
              className={`nav-link sidebar-link ${currTab === "Home" ? "active-link" : "text-dark"}`}
              aria-current="page"
            >
              Home
            </a>
          </li>

          {user && (
            <li
              onClick={() => {
                changeTab("Past Generations");
              }}
            >
              <a
                href="#"
                className={`nav-link sidebar-link ${currTab === "Past Generations" ? "active-link" : "text-dark"}`}
              >
                Past Generations
              </a>
            </li>
          )}
        </ul>

        <hr className="sidebar-divider" />

        {user ? (
          <div className="dropdown mt-auto">
            <a
              href="#"
              className="d-flex align-items-center text-dark text-decoration-none dropdown-toggle px-2 py-1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <div className="rounded-circle me-2 bg-primary text-white d-flex align-items-center justify-content-center" style={{width: 32, height: 32}}>
                {user.username.charAt(0).toUpperCase()}
              </div>
              <strong>{user.username}</strong>
            </a>

            <ul className="dropdown-menu text-small shadow">
              <li>
                <a className="dropdown-item" href="#">
                  Profile
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a className="dropdown-item" href="#" onClick={onLogout}>
                  Sign out
                </a>
              </li>
            </ul>
          </div>
        ) : (
          <div className="mt-auto px-2 text-muted small">
            Please log in to access your profile.
          </div>
        )}
      </div>
    </>
  );
}

export default Sidebar;
