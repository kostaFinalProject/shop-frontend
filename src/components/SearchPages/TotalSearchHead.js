import React, { useState, useEffect } from "react";
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

    const [activeTab, setActiveTab] = useState(getActiveTab());
    const [keyword, setKeyword] = useState("");

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const searchKeyword = queryParams.get("keyword");
        if (searchKeyword) {
            setKeyword(searchKeyword); // URL에서 검색어 가져와서 상태 업데이트
        }
    }, [location]);

    return (
        <div className="TotalSearchHead_full_screen">
            <div className="TotalSearchHead_navi">
                <ul>
                    <li>
                        <Link
                            className={`product ${activeTab === "product" ? "active" : ""}`}
                            to={`/SearchProduct?keyword=${keyword}`} // 검색어를 쿼리 파라미터로 추가
                            onClick={() => setActiveTab("product")}
                        >
                            상품
                        </Link>
                    </li>
                    <li>
                        <Link
                            className={`style ${activeTab === "style" ? "active" : ""}`}
                            to={`/SearchStyle?keyword=${keyword}`} // 검색어를 쿼리 파라미터로 추가
                            onClick={() => setActiveTab("style")}
                        >
                            스타일
                        </Link>
                    </li>
                    <li>
                        <Link
                            className={`profile ${activeTab === "profile" ? "active" : ""}`}
                            to={`/SearchProfile?keyword=${keyword}`} // 검색어를 쿼리 파라미터로 추가
                            onClick={() => setActiveTab("profile")}
                        >
                            프로필
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default TotalSearchHead;
