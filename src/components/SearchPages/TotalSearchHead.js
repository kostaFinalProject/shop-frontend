import React, { useState } from "react"
import './TotalSearchHead.css';
import { Link, useLocation } from "react-router-dom";

const TotalSearchHead = () => {

    const location = useLocation();
    const getActiveTab = () => {
        if (location.pathname === "/SearchProduct") return "product";
        if (location.pathname === "/SearchStyle") return "style";
        if (location.pathname === "/SearchProfile") return "profile";
        return "product"; // 기본값
    };
    const [activeTab, setActiveTab] = useState(getActiveTab()); // activeTab 상태 관리

    return (
        <>
            <div className="TotalSearchHead_full_screen">
                <div className="TotalSearchHead_search">
                    <form action="">
                        <div className="TotalSearchHead_search_container">
                            <input className="TotalSearchHead_search_input" type="text" placeholder="Search" />
                        </div>
                    </form>
                </div>

                <div className="TotalSearchHead_navi">
                    <ul>
                    <li>
                        <Link 
                            className={`product ${activeTab === "product" ? "active" : ""}`} 
                            to="/SearchProduct"
                            onClick={() => setActiveTab("product")}
                        >
                            상품
                        </Link>
                    </li>
                    <li>
                        <Link 
                            className={`style ${activeTab === "style" ? "active" : ""}`} 
                            to="/SearchStyle"
                            onClick={() => setActiveTab("style")}
                        >
                            스타일
                        </Link>
                    </li>
                    <li>
                        <Link 
                            className={`profile ${activeTab === "profile" ? "active" : ""}`} 
                            to="/SearchProfile"
                            onClick={() => setActiveTab("profile")}
                        >
                            프로필
                        </Link>
                    </li>
                    </ul>
                </div>
            </div>
        </>

    )
}

export default TotalSearchHead;


