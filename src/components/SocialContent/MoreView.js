import React from "react";
import './MoreView.css';
import { Link } from "react-router-dom";

const MoreView = () => {
    return (
        <>
         <div className="StyleDetail_container_title">@j_0_x_0님의 다른 스타일
                    <Link to="/Styleprofile">
                        <button className="more_btn">더보기</button>
                    </Link>

                </div>
                <div className="StyleDetail_container_img">
                    <div><a href="#"><img src="https://cdn.4mation.net/market/mainimage/sethb_72b2f7b4-6221-4b3d-8a64-319ba82bd7e1_1045x1436.jpeg" alt="" /></a></div>
                    <div><a href="#"><img src="https://fakeimg.pl/150x200/" alt="" /></a></div>
                    <div><a href="#"><img src="https://fakeimg.pl/150x200/" alt="" /></a></div>
                    <div><a href="#"><img src="https://fakeimg.pl/150x200/" alt="" /></a></div>
                </div>
        </>
    );
};

export default MoreView;