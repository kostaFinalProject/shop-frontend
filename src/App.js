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
import Signup from "./components/Login/signup";
//연규님이 하신거

import BoardshoppingLi from './components/BoardshoppingList/BoardshoppingLi.js';
import BoardshoppingSearch from './components/BoardshoppingSearch/BoardshoppingSearch.js';
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


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  return (
    <BrowserRouter>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/signup" element={<Signup />} />
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
        {/* 연규님이 하신거 */}
        <Route path="/BoardshoppingLi" element={<BoardshoppingLi />} />
        <Route path="/boardshoppingsearch" element={<BoardshoppingSearch />} />
        <Route path="/detailpage" element={<DetailPage />} />
        <Route path="/NewCreate" element={<NewCreate />} />
        <Route path="/QnA" element={<QnA />} />
        <Route path="/SearchProduct" element={<SearchProduct />} />
        <Route path="/SearchProfile" element={<SearchProfile />} />
        <Route path="/SearchStyle" element={<SearchStyle />} />
        <Route path="/TotalSearchHead" element={<TotalSearchHead />} />
        <Route path="/StyleDetail" element={<StyleDetail />} />
        <Route path="/StyleMain" element={<StyleMain />} />
        <Route path="/Styleprofile" element={<Styleprofile />} />
        <Route path="/StyleprofileMyInterestProduct" element={<StyleprofileMyInterestProduct />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;