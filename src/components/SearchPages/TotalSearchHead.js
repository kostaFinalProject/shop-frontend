import React, { useState, useEffect } from "react";
import './TotalSearchHead.css';
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const TotalSearchHead = () => {
    const location = useLocation();
    const navigate = useNavigate(); 
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
                    <select 
                        className="TotalSearchHead_Select"
                            onChange={(e) => {
                                const selectedPage = e.target.value;
                                if (selectedPage) {
                                    setActiveTab(selectedPage); // 선택된 탭 활성화
                                    navigate(`/${selectedPage}?keyword=`); // 페이지 이동
                                }
                            }}
                            value={activeTab} // 현재 활성 탭 반영
                        >
                             <option value="*">전체상품</option>
                            <option value="SearchProduct">상품</option>
                            <option value="SearchStyle">스타일</option>
                            <option value="SearchProfile">프로필</option>
                        </select>
                    </li>
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
