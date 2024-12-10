import React from "react";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Footer from "../Footer/footer";

function HomePage({ setIsLoggedIn }) {
  return (
    <div>
      <Header setIsLoggedIn={setIsLoggedIn} />
      <Main setIsLoggedIn={setIsLoggedIn} />
      <Footer />
    </div>
  );
}

export default HomePage;