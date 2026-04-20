import "./header.css";

function Header({ changeTab, user, onLogout, searchTerm, setSearchTerm }) {
  return (
    <>
      <header className="p-3 modern-header shadow-sm">
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
            <a
              href="/"
              className="d-flex align-items-center mb-2 mb-lg-0 text-dark text-decoration-none logo-title"
            >
              <span className="fs-4 fw-bold" style={{ color: "var(--primary-color)" }}>AutoTranscribe</span>
            </a>
            
            <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0 ms-5">
              <li>
                <a
                  href="#"
                  className="nav-link px-2 nav-text"
                  onClick={() => {
                    changeTab("Home");
                  }}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="nav-link px-2 nav-text"
                  onClick={() => {
                    changeTab("Features");
                  }}
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="nav-link px-2 nav-text"
                  onClick={() => {
                    changeTab("Faq");
                  }}
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="nav-link px-2 nav-text"
                  onClick={() => {
                    changeTab("About");
                  }}
                >
                  About
                </a>
              </li>
            </ul>

            <form
              className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3"
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                changeTab("Past Generations"); // optionally redirect to Past Gen on enter
              }}
            >
              <input
                type="text"
                placeholder="Search transcripts..."
                className="inputBox modern-input"
                value={searchTerm || ""}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>

            <div className="text-end">
              {user ? (
                <div className="d-flex align-items-center gap-3">
                  <span className="text-dark fw-medium" style={{color: 'var(--text-dark)'}}>Hi, {user.username}</span>
                  <button
                    type="button"
                    className="btn btn-outline-danger modern-btn"
                    onClick={onLogout}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary modern-btn"
                  onClick={() => {
                    changeTab("Login");
                  }}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
