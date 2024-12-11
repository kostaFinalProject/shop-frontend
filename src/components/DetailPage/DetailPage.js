import React from "react";
import './DetailPage.css';
import DetailInformation from "./DetailPageLement/DetailInformation.js";
import DetailSelect from "./DetailPageLement/DetailSelect.js";
import ScrollUp from '../ScrollUp/ScrollUp.js';

const DetailPage = () => {
    return (
        <div>  {/* 전체를 하나의 부모 엘리먼트로 감싸기 */}
            <div className="DetailPage_full_screen">
                <div className="DetailPage_detail_page">
                    {/* ---------------- 상세페이지 전체 설정 ----------------  */}
                    <div className="DetailPage_product_detail">
                        {/* ----------------상세페이지 이미지----------------  */}
                        <div className="DetailPage_detail_img">
                            <img src="https://cafe24.poxo.com/ec01/enemy0000/fYw07Q+e08011Z5Qzbz300jECh5aaMmmDMQ7QH7NAQ9NK2EXhqgvmfbzfda0mDNO/Jp2ZgYE1irrrDpzeiP8fA==/_/web/product/big/202404/35b52732a4971e965f2ce448033d881a.jpg" alt="상품 이미지" />
                        </div>

                        {/* --------------- 상세페이지 설명글 ----------------  */}
                        <div className="DetailPage_detail_text">
                            {/*DetailInformation 상품이름 가격 */}
                            <DetailInformation />
                            {/* -----------------사이즈 선택 --------------------- */}
                            <DetailSelect />

                            <div className="DetailPage_sub_button_menu">
                                <button className="DetailPage_basket_button"><a href="#">장바구니</a></button>
                                <button className="DetailPage_interest_product_button"><a href="#">관심상품</a></button>
                            </div>

                        </div>
                    </div>

                    {/* ----------상품상세설명 후기 버튼------------------  */}
                    <div className="DetailPage_product_detail_description">
                        <div className="DetailPage_button_product_detail_description"><a href="#product_detail_description">상품상세설명</a></div>
                        <div className="DetailPage_button_review"><a href="#review">후 기</a></div>
                    </div>

                    {/* ------------상품상세설명란------------------  */}
                    <div className="DetailPage_text_product_detail_description" id="product_detail_description">
                        <div className="DetailPage_text_product_detail_description_img">
                            <img src="https://cafe24.poxo.com/ec01/enemy0000/fYw07Q+e08011Z5Qzbz300jECh5aaMmmDMQ7QH7NAQ9NK2EXhqgvmfbzfda0mDNO/Jp2ZgYE1irrrDpzeiP8fA==/_/web/upload/NNEditor/20240410/E1848BE185A5E18489E185A6E186ABE18490E185B5E186A820E1848BE185A5E1848BE185B0E1848BE185B5.jpg" alt="상세 이미지" />
                        </div>
                    </div>

                    {/* ----------------------SNS 형식 후기글------------------ */}
                    <div className="DetailPage_sns_style">
                        <div className="DetailPage_sns_style_title"><a href="#" id="review">후기 및 스타일 </a></div>
                    </div>

                    <ul className="DetailPage_detail_page_review_list_body">
         

                        <li className="DetailPage_review_list_item">
                            <img src="https://cdn.4mation.net/talk/mainimage/axd189_049247ab-a2c1-46f6-8f7b-3a1f1b160ac5_1200x1600.jpg" alt="interestData" className='DetailPage_review_list_item_img' />
                            <span className="DetailPage_review_title_id">1</span>
                            <p className="DetailPage_review_MyInterests">2</p>

                        </li>

                        <li className="DetailPage_review_list_item">
                            <img src="https://cdn.4mation.net/talk/mainimage/axd189_049247ab-a2c1-46f6-8f7b-3a1f1b160ac5_1200x1600.jpg" alt="interestData" className='DetailPage_review_list_item_img' />
                            <span className="DetailPage_review_title_id">1</span>
                            <p className="DetailPage_review_MyInterests">2</p>

                        </li>


                        <li className="DetailPage_review_list_item">
                            <img src="https://cdn.4mation.net/talk/mainimage/axd189_049247ab-a2c1-46f6-8f7b-3a1f1b160ac5_1200x1600.jpg" alt="interestData" className='DetailPage_review_list_item_img' />
                            <span className="DetailPage_review_title_id">1</span>
                            <p className="DetailPage_review_MyInterests">2</p>

                        </li>


                        <li className="DetailPage_review_list_item">
                            <img src="https://cdn.4mation.net/talk/mainimage/axd189_049247ab-a2c1-46f6-8f7b-3a1f1b160ac5_1200x1600.jpg" alt="interestData" className='DetailPage_review_list_item_img' />
                            <span className="DetailPage_review_title_id">1</span>
                            <p className="DetailPage_review_MyInterests">2</p>

                        </li>
                    </ul>
                </div>

                <ScrollUp />

            </div>
            <div id="footer"></div>
        </div>
    );
};

export default DetailPage;
