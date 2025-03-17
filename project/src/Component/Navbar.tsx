import imgNav from "../assets/LOGO_white.png";
import "../Style/Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar-container">
      <header className="d-flex flex-wrap align-items-center py-2 ps-2">
        <div className="logo">
          <a href="/" className="link-body-emphasis text-decoration-none">
            <img src={imgNav} height={40} />
          </a>
          <div className="header">Production</div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
