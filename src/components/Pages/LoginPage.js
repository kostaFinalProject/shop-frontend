import React from "react";
import Header from "../Header/Header";
import Login from "../Login/Login";
import Footer from "../Footer/footer";

function LoginPage({ setIsLoggedIn }) {
  return (
    <div>
      <Header setIsLoggedIn={setIsLoggedIn} />
      <Login setIsLoggedIn={setIsLoggedIn} /> {/* Login에 setIsLoggedIn 전달 */}
      <Footer />
    </div>
  );
}

export default LoginPage;
