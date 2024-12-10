import React, { useState } from "react";
import './StyleMain.css';
import ProfilePosts from "../StyleProfile/ProfilePosts.js";
import { postsData } from "../PostsData/PostsData.js";

  

const StyleMain = () => {
    const [activeTab, setActiveTab] = useState('posts');

    return (
        <>
            <div className="StyleMain_full_screen">
                {/* -------------------------  banner------------------------  */}
                <div className="StyleMain_banner">STYLE,banner</div>

                {/* ------------------------- navigation ------------------------  */}

                <div className="StyleMain_navigation">
                    <li><a href="#">국내축구</a></li>
                    <li><a href="#">해외축구</a></li>
                    <li><a href="#">국내야구</a></li>
                    <li><a href="#">여자배구</a></li>
                    <li><a href="#">e스포츠</a></li>
                </div>

                {/* ------------------------- keyword_search ------------------------  */}
                <div className="StyleMain_keyword_search">
                    <div className="StyleMain_search_list">
                        <a href="#">
                            <img src="https://cafe24.poxo.com/ec01/enemy0000/fYw07Q+e08011Z5Qzbz300jECh5aaMmmDMQ7QH7NAQ9NK2EXhqgvmfbzfda0mDNO/Jp2ZgYE1irrrDpzeiP8fA==/_/web/product/big/202411/7d090c9573a58fe7fb7553e5cc8ea5b2.jpg" alt="" />
                            <p>!!</p>

        국내축구
          name: "울산 HD FC",

          name: "김천상무 FC",

          name: "강원 FC",

          name: "포항 노틸러스",

          name: "FC서울",

          name: "수원FC",

          name: "제주 유나이티드",

          name: "대전 하나 시티즌",

          name: "광주 FC",

          name: "전북 현대 모터스",

          name: "대구FC",

          name: "인천 유나이티드",

      name: "해외축구",

          name: "레알 마드리드",

          name: "리버풀",

          name: "맨체스터 시티",

          name: "맨체스터 유나이티드",

          name: "첼시",

          name: "토트넘",

          name: "첼시",

          name: "바이에른 뮌헨",

          name: "유벤투스",

          name: "AC밀란",

          name: "인터 밀란",

          name: "PSG",

          name: "알 힐랄",

      name: "국내야구",

          name: "LG",

          name: "KIA",

          name: "삼성",

          name: "두산",

          name: "SSG",

          name: "KT",

          name: "롯데",

          name: "한화",

          name: "NC",

          name: "키움",

      name: "여자배구",

          name: "흥국생명",

          name: "현대건설",

          name: "IBK기업은행",

          name: "정관장",

          name: "한국도로공사",

          name: "페퍼저축은행",

          name: "GS칼텍스",

      name: "e스포츠",

          name: "T1",

          name: "젠지",

          name: "한화",

          name: "KT",

          name: "담원기아",
   
          name: "광동",
    
          name: "피어엑스",
          name:"농심",
   
          name: "DRX",
          name:"브리온",
  



                </div>

                {/* ------------------------ sorting ------------------------  */}
                <div className="StyleMain_sorting">
                    <span><a href="#">인기순</a></span>
                    <span><a href="#">최신순</a></span>
                </div>


            </div>
            {/* ----------------------SNS 형식 후기글------------------ */}
            <div className="StyleMain_sns_container">
                <ul className="StyleMain_detail_page_review_list_body">
                    <ProfilePosts posts={postsData}/>
                    {/* <li className="StyleMain_detail_page_review_list_item">
                        <div className="StyleMain_detail_page_review_list_item_img">
                            <img src="https://cafe24.poxo.com/ec01/enemy0000/fYw07Q+e08011Z5Qzbz300jECh5aaMmmDMQ7QH7NAQ9NK2EXhqgvmfbzfda0mDNO/Jp2ZgYE1irrrDpzeiP8fA==/_/web/product/big/202411/7d090c9573a58fe7fb7553e5cc8ea5b2.jpg" alt="" />
                        </div>
                        <div className="StyleMain_detail_page_review_content">

                            <div className="StyleMain_detail_page_review_title">
                                <img src="https://fakeimg.pl/26x26/" alt="" className="detail_page_review_title_img" />
                                    <span className="detail_page_review_title_id">아이디</span>
                                    <span className="detail_page_review_title_like">♡4</span>
                            </div>
                            <p className="StyleMain_detail_page_review_body_tag">#겨울코디추천 #겨울코디추천 #아우터추천 #연말선물 #연말룩 #사이즈팁 #KICKS
                            </p>
                        </div>
                    </li> */}
                    
                </ul>


            </div>
        </>


    );
};

export default StyleMain;
