import React from "react";
import "./navbar.css";

const Navbar = () => {
  return (
    <nav class="navbar navbar-expand-lg navbar-light bg-dark">
      <div class="container">
        <a class="navbar-brand" href="/">
          Home
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="/myStake">
                My Stake
              </a>
            </li>
          </ul>
          <form class="d-flex">
            {/* <button class="btn btn-outline-success" type="submit">
              My Stake
            </button> */}

            <button class="btn btn-outline-success" type="submit">
              Connect Wallet
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
