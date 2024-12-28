import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const [categories, setCategories] = useState([]); // 상위 카테고리
  const [subCategories, setSubCategories] = useState({}); // 하위 카테고리
  const [visibleSubmenu, setVisibleSubmenu] = useState(null); // 현재 보이는 하위 카테고리
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState(""); // 검색어 상태
  const [memberId, setMemberId] = useState(null);
  const [memberGrade, setMemberGrade] = useState("USER");

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("Refresh Token이 없습니다.");
      }

      const response = await fetch("http://localhost:8080/api/v1/members/refresh-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Refresh-Token": refreshToken,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const newAccessToken = data.newToken;
        localStorage.setItem("accessToken", newAccessToken);
        return newAccessToken;
      } else {
        throw new Error("Access Token 갱신 실패");
      }
    } catch (error) {
      console.error(error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      navigate("/login");
    }
  };

  const isAdmin = memberGrade === "SUPER_ADMIN" || memberGrade === "ADMIN";

  // 초기 isLoggedIn 상태 설정
  useEffect(() => {
    const initializeLoginState = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accessToken || !refreshToken) {
        setIsLoggedIn(false);
        return null;
      }

      try {
        // 회원 정보 조회 시도
        const userResponse = await fetch("http://localhost:8080/api/v1/members", {
          method: "GET",
          headers: {
            'Authorization': accessToken,
            'Refresh-Token': refreshToken,
            'Content-Type': 'application/json',
          },
        });

        if (userResponse.ok) {
          // 회원 정보 조회 성공
          const userData = await userResponse.json();
          setIsLoggedIn(true);
          setMemberId(userData.memberId);
          setMemberGrade(userData.grade);
          return userData.memberId;
        } else {
          // AccessToken 만료로 인한 실패 시
          const refreshResponse = await fetch("http://localhost:8080/api/v1/members/refresh-token", {
            method: "POST",
            headers: {
              'Refresh-Token': refreshToken,
              'Content-Type': "application/json",
            },
          });

          if (refreshResponse.ok) {
            const data = await refreshResponse.json();

            // 갱신된 AccessToken 저장
            localStorage.setItem("accessToken", data.newToken);

            // 갱신된 토큰으로 회원 정보 조회 재시도
            const retryResponse = await fetch("http://localhost:8080/api/v1/members", {
              method: "GET",
              headers: {
                'Authorization': localStorage.getItem("accessToken"),
                'Refresh-Token': refreshToken,
                'Content-Type': 'application/json',
              },
            });

            if (retryResponse.ok) {
              const retryData = await retryResponse.json();
              setIsLoggedIn(true);
              return retryData.memberId;
            } else {
              throw new Error("회원 정보 조회 실패");
            }
          } else {
            throw new Error("AccessToken 갱신 실패");
          }
        }
      } catch (error) {
        // 최종적으로 실패 시 로그아웃 처리
        console.error(error);
        setIsLoggedIn(false);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return null;
      }
    };

    const fetchMemberId = async () => {
      const memberId = await initializeLoginState();
      if (memberId) {
        console.log("현재 사용자 memberId", memberId);
        // memberId를 로컬스토리지에 저장
        localStorage.setItem("loggedInUserId", memberId); // localStorage에 memberId 저장

      } else {
        console.warn("로그인 상태가 아니거나memberId를가져오지 못했습니다.")
      }
    }

    fetchMemberId();
  }, [setIsLoggedIn]);



  // 카테고리 클릭 시 처리
  const handleCategoryClick = (categoryId) => {
    setVisibleSubmenu((prev) => (prev === categoryId ? null : categoryId)); // 토글
    if (!subCategories[categoryId]) {
      fetchChildrenCategories(categoryId); // 하위 카테고리 가져오기
    }

  };

  // 하위 카테고리 
  const handleSubCategoryClick = (categoryName) => {
    setVisibleSubmenu((prev) => (prev === categoryName ? null : categoryName)); // 토글
    if (!subCategories[categoryName]) {
      fetchChildrenCategories(categoryName); // 하위 카테고리 가져오기
    }
    navigate(`/BoardshoppingLi?categoryId=${categoryName}`);
  };

  document.addEventListener("DOMContentLoaded", () => {
    const categoryLinks = document.querySelectorAll(".category-link");

    categoryLinks.forEach((link, index) => {
      link.addEventListener("mouseover", () => {
        const submenu = link.nextElementSibling; // a 태그 뒤의 <ul>을 선택
        if (submenu) {
          submenu.classList.add(`a${index + 1}`);
        }
      });

      link.addEventListener("mouseout", () => {
        const submenu = link.nextElementSibling;
        if (submenu) {
          submenu.classList.remove(`a${index + 1}`);
        }
      });
    });
  });

  // 상위 카테고리 데이터 가져오기
  useEffect(() => {
    const fetchTopCategories = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/item-categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error("Failed to fetch top categories.");
        }
      } catch (error) {
        console.error("Error fetching top categories:", error);
      }
    };

    fetchTopCategories();
  }, []);

  // 특정 상위 카테고리의 하위 카테고리 데이터 가져오기
  const fetchChildrenCategories = async (categoryId) => {
    if (subCategories[categoryId]) {
      // 이미 하위 카테고리가 로드된 경우 API 호출 생략
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/v1/item-categories/${categoryId}`);
      if (response.ok) {
        const data = await response.json();
        console.log(`하위 카테고리 로드 (카테고리 ID: ${categoryId}):`, data);
        const updatedData = data.map(item => ({
          categoryId: item.categoryId,
          categoryName: item.categoryName,
          imageUrl: item.categoryImageUrl.replace('C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\', ''),
        }));
        console.log("updatedData", updatedData);
        setSubCategories((prev) => ({
          ...prev,
          [categoryId]: updatedData, // 해당 상위 카테고리 ID에 하위 카테고리 저장
        }));
      } else {
        console.error("Failed to fetch children categories.");
      }
    } catch (error) {
      console.error("Error fetching children categories:", error);
    }
  };

  const handleLogout = async function (event) {
    event.preventDefault();

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken || !refreshToken) {
      alert("로그아웃 실패: 토큰이 없습니다.");
      return;
    }

    const newToken = await refreshAccessToken();
    localStorage.setItem("accessToken", newToken);

    try {
      const response = await fetch("http://localhost:8080/api/v1/members/logout", {
        method: "POST",
        headers: {
          'Authorization': newToken,
          'Refresh-Token': refreshToken,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsLoggedIn(false);
        window.location.href = '/';
      } else {
        const errorMessage = await response.text();
        alert("로그아웃 실패: " + errorMessage);
        return;
      }
    } catch (error) {
      alert("로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  {/* 통합검색 핸들러 */ }
  const handleSearch = (event) => {
    event.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/SearchProduct?keyword=${searchKeyword}`); // 검색 페이지로 이동
    }
  };
  return (
    <header>
      <div className="headerContainer">
        <div className="headerMainContainer">
          <div className="left">
            <a href="/">
              <img className="logo" src="/img/shoplogo.webp" alt="logo" />
            </a>
          </div>

          {/* 통합검색 */}
          <div className="TotalSearchHead_search">
            <form onSubmit={handleSearch}>
              <div className="TotalSearchHead_search_container">
                <input
                  className="TotalSearchHead_search_input"
                  type="text"
                  placeholder="Search"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)} // 검색어 업데이트
                />
              </div>
            </form>
          </div>

          {isLoggedIn ? (
            <div className="right">
              <a href="/mypage">
                <img
                  src="/img/icon_header_mypage_b_512.svg"
                  alt="마이페이지"
                  className="icon"
                />
                <span>마이페이지</span>
              </a>
              {isAdmin && (
                <a href="/AdminPage/Adminright">
                <img src="/img/basket3.svg" alt="장바구니" className="icon" />
                <span>관리자페이지</span>
              </a>
              )}
              <a href="/" onClick={handleLogout}>
                <img
                  src="/img/box-arrow-right.svg"
                  alt="장바구니"
                  className="icon"
                />
                <span>로그아웃</span>
              </a>
            </div>
          ) : (
            <div className="right">
              <a href="/login">
                <img
                  src="/img/box-arrow-in-right.svg"
                  alt="로그인"
                  className="icon"
                />
                <span>로그인</span>
              </a>
              <a href="/signup">
                <img src="/img/person-add.svg" alt="회원가입" className="icon" />
                <span>회원가입</span>
              </a>
            </div>
          )}
        </div>

        <div className="headerNavContainer">
          <nav className="shop">
            <ul className="category">
              <li id="aaa">
                <a href="#" id="category">
                  <img src="/img/list.svg" alt="카테고리 아이콘" />
                  <span style={{ marginRight: "20px" }}>ALL</span>
                </a>
              </li>
              <li style={{ color: "#e2e2e2", transform: "translateX(18px)" }}>
                {" "} | {" "}
              </li>
              {categories.map((category) => (
                <li key={category.parentCategoryId} className="category">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCategoryClick(category.parentCategoryId);
                    }}
                  >
                    {category.name}
                  </a>
                  {visibleSubmenu === category.parentCategoryId && (
                    <ul
                      className="subcategories"
                      style={{
                        position: "absolute",
                        transform: "translate(300px, 100px)",
                        backgroundColor: "white",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                      }}
                    >
                      {(subCategories[category.parentCategoryId] || []).map((sub) => (
                        <li key={sub.categoryId}
                          onClick={() => handleSubCategoryClick(sub.categoryName)} // 이렇게 수정해야 합니다
                          className="subcategory"
                          style={{
                            width: "100px",
                            height: "100px",
                            fontSize: "14px",
                            textAlign: "center",
                          }}
                        >
                          <a href="#">
                            <div className="categorycircle">
                              <img
                                src={`/uploads/${sub.imageUrl}`}
                                alt={sub.categoryName}
                              />
                            </div>
                            <div>{sub.categoryName}</div>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="communitysection">
            <ul>
              <a href="/Qna">Q&A</a>
              <a href="/" >HOME</a>
              <a href="/BoardshoppingLi" >SHOP</a>
              <a href="/StyleMain">STYLE</a>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;