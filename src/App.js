import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import Login from "./components/Login/Login";
import MyPageIntro from "./components/MyPage/MyPageIntro";
import MyPageOrder from "./components/MyPage/MyPageOrder";
import MyPageBasket from "./components/MyPage/MyPageBasket";
import MyPageInterest from "./components/MyPage/MyPageInterest";
import MyPageResentview from "./components/MyPage/MyPageResentview";
import MyPageCoupon from "./components/MyPage/MyPageCoupon";
import MyPageMileage from "./components/MyPage/MyPageMileage";
import MyPageAddress from "./components/MyPage/MyPageAddress";
import AddressRegisterForm from "./components/MyPage/AddressRegisterForm";
import StyleModify from "./components/MyPage/StyleModify";
import Footer from "./components/Footer/footer";
import Adminright from "./components/AdminPage/Adminright";
import Categorymaker from "./components/AdminPage/Categorymaker";
import Reportuser from "./components/AdminPage/Reportuser";
import Registproduct from "./components/AdminPage/Registproduct.js";
import Modifyproduct from "./components/AdminPage/modifyproduct.js";
import Admindelivery from "./components/AdminPage/Admindelivery.js";

//태온님이 하신거
import Signup from "./components/Login/signup";
import QnAcreate from "./components/QnA/QnACreate.js";
import QnAdetail from "./components/QnA/QnAdetail.js";

//연규님이 하신거
import BoardshoppingLi from './components/BoardshoppingList/BoardshoppingLi.js';
import DetailPage from './components/DetailPage/DetailPage.js';
import NewCreate from './components/NewCreate/NewCreate.js';
import QnA from './components/QnA/QnA.js';
import SearchProduct from "./components/SearchPages/SearchProduct.js";
import SearchProfile from "./components/SearchPages/SearchProfile.js";
import SearchStyle from "./components/SearchPages/SearchStyle.js";
import TotalSearchHead from "./components/SearchPages/TotalSearchHead.js";
import StyleDetail from "./components/SocialContent/StyleDetail.js";
import StyleMain from "./components/SocialContent//StyleMain/StyleMain.js";
import Styleprofile from "./components/SocialContent/StyleProfile/Styleprofile.js";
import StyleprofileMyInterestProduct from "./components/SocialContent/StyleProfile/StyleprofileMyInterestProduct.js";
import UpdateArticle from "./components/NewCreate/UpdateArticle.js";
import CheckoutPage from "./components/CheckoutPage/CheckoutPage.js";
import CartCheckoutPage from "./components/CheckoutPage/CartCheckoutPage .js";
import ProfileMyInterests from "./components/SocialContent/StyleProfile/ProfileMyInterests.js";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);



  useEffect(() => {
    console.log("로그인 상태가 변경되었습니다:", isLoggedIn);
  }, [isLoggedIn]);  // isLoggedIn 값이 변경될 때마다 실행됨

  const handleLoginSuccess = () => {
    console.log("로그인 성공 상태 변경 전:", isLoggedIn);
    setIsLoggedIn(true);
    // 상태 변경 후 로그는 useEffect에서 처리됨
  };

  return (
    <BrowserRouter>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/" element={<Main />} />
        <Route path="/MyPage" element={<MyPageIntro />} />
        <Route path="/MyPage/order" element={<MyPageOrder />} />
        <Route path="/MyPage/basket" element={<MyPageBasket />} />
        <Route path="/MyPage/interest" element={<MyPageInterest />} />
        <Route path="/MyPage/resentview" element={<MyPageResentview />} />
        <Route path="/MyPage/coupon" element={<MyPageCoupon />} />
        <Route path="/MyPage/mileage" element={<MyPageMileage />} />
        <Route path="/MyPage/address" element={<MyPageAddress />} />
        <Route path="/MyPage/address/addressregist" element={<AddressRegisterForm />} />
        <Route path="/MyPage/stylemodify" element={<StyleModify />} />
        <Route path="/AdminPage/reportuser" element={<Reportuser />} />
        <Route path="/AdminPage/categorymaker" element={<Categorymaker />} />
        <Route path="/AdminPage/adminright" element={<Adminright />} />
        <Route path="/AdminPage/registproduct" element={<Registproduct />} />
        <Route path="/AdminPage/modifyproduct" element={<Modifyproduct />} />
        <Route path="/AdminPage/admindelivery" element={<Admindelivery />} />

        {/* 태온님이 하신거 */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/QnAcreate" element={<QnAcreate />} />
        <Route path="/QnAdetail" element={<QnAdetail />} />
        {/* 연규님이 하신거 */}
        <Route path="/BoardshoppingLi" element={<BoardshoppingLi />} />
        <Route path="/detailpage" element={<DetailPage />} />
        <Route path="/NewCreate" element={<NewCreate />} />
        <Route path="/UpdateArticle/:articleId" element={<UpdateArticle />} />
        <Route path="/QnA" element={<QnA />} />
        <Route path="/SearchProduct" element={<SearchProduct />} />
        <Route path="/SearchProfile" element={<SearchProfile />} />
        <Route path="/SearchStyle" element={<SearchStyle />} />
        <Route path="/TotalSearchHead" element={<TotalSearchHead />} />
        <Route path="/StyleDetail" element={<StyleDetail />} />
        <Route path="/StyleMain" element={<StyleMain />} />
        <Route path="/Styleprofile" element={<Styleprofile />} />
        <Route path="/StyleprofileMyInterestProduct" element={<StyleprofileMyInterestProduct />} />
        <Route path="/CheckoutPage" element={<CheckoutPage />} />
        <Route path="/CartCheckoutPage" element={<CartCheckoutPage />} />
        <Route path="/ProfileMyInterests" element={<ProfileMyInterests/>} />

      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;