import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

function Header() {
    const [isLoggedIn, user] = useAuthStore((state) => [state.isLoggedIn, state.user])

    
    return (
        <header className="navbar-dark bg-dark navbar-sticky header-static">
            <nav className="navbar navbar-expand-lg">
                <div className="container">
                    <Link className="navbar-brand" to="/">
                        <img className="navbar-brand-item dark-mode-item" src="../../assets/logo.png" style={{ width: "200px" }} alt="logo" />
                    </Link>
                    <button className="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="h6 d-none d-sm-inline-block text-white">Menu</span>
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarCollapse">
                        
                        <ul className="navbar-nav navbar-nav-scroll ms-auto">
                            <li className="nav-item dropdown">
                                <Link className="nav-link active" to="/">
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle active" href="#" id="pagesMenu" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Pages
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="pagesMenu">
                                    <li>
                                        <Link className="dropdown-item" to="/about/">
                                            <i className="bi bi-person-lines-fill"></i> About
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/contact/">
                                            <i className="bi bi-telephone-fill"></i> Contact
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            {isLoggedIn() ? (
                                <>
                                    <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle active" href="#" id="pagesMenu" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Dashboard
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="pagesMenu">
                                    <li>
                                        <Link className="dropdown-item" to="/dashboard/">
                                            <i className="fas fa-user"></i> Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/posts/">
                                            <i className="bi bi-grid-fill"></i> Posts
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/add-post/">
                                            <i className="fas fa-plus-circle"></i> Add Post
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/comments/">
                                            <i className="bi bi-chat-left-quote-fill"></i> Comments
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/notifications/">
                                            <i className="fas fa-bell"></i> Notifications
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/profile/">
                                            <i className="fas fa-user-gear"></i> Profile
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                                </>
                            ) : (
                                <>
                                
                                </>
                            )}
                            
                            <li className="nav-item">
                                {isLoggedIn() ? (
                                    <>
                                        <Link to={"/logout/"} className="btn btn-danger" href="dashboard.html">
                                            Logout <i className="fas fa-off"></i>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link to={"/register/"} className="btn btn-success" href="dashboard.html">
                                            Register <i className="fas fa-user-plus"></i>
                                        </Link>
                                        <Link to={"/login/"} className="btn btn-success ms-2" href="dashboard.html">
                                            Login <i className="fas fa-sign-in-alt"></i>
                                        </Link>
                                    </>
                                )}
                                
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;
