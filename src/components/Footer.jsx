function Footer({ changeTab }) {
  return (
    <>
      <div className="container">
        {" "}
        <footer className="py-3 my-4">
          {" "}
          <ul className="nav justify-content-center border-bottom pb-3 mb-3">
            {" "}
            <li
              className="nav-item"
              onClick={() => {
                changeTab("Home");
              }}
            >
              <a href="#" className="nav-link px-2 text-body-secondary">
                Home
              </a>
            </li>{" "}
            <li className="nav-item">
              <a
                href="#"
                className="nav-link px-2 text-body-secondary"
                onClick={() => {
                  changeTab("Features");
                }}
              >
                Features
              </a>
            </li>{" "}
            <li className="nav-item">
              <a
                href="#"
                className="nav-link px-2 text-body-secondary"
                onClick={() => {
                  changeTab("Faq");
                }}
              >
                FAQs
              </a>
            </li>{" "}
            <li className="nav-item">
              <a
                href="#"
                className="nav-link px-2 text-body-secondary"
                onClick={() => {
                  changeTab("About");
                }}
              >
                About
              </a>
            </li>{" "}
          </ul>{" "}
          <p className="text-center text-body-secondary">
            © 2025 Develop By Vivek Kumar,Vaishnavi Gupta,Shivani,Neha
          </p>{" "}
        </footer>{" "}
      </div>
    </>
  );
}
export default Footer;
