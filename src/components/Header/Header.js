import React, { useState, useEffect } from "react";
import "./Header.css";

const Header = ( {isLoggedIn, setIsLoggedIn}) => {
  const [visibleSubmenu, setVisibleSubmenu] = useState(null);

  useEffect(() => {
    console.log("Header에서 isLoggedIn 상태:", isLoggedIn);
  }, [isLoggedIn]); // isLoggedIn 상태가 변경될 때마다 출력

  const handleCategoryClick = (index) => {
    setVisibleSubmenu(visibleSubmenu === index ? null : index);
  };

  const handleDocumentClick = (event) => {
    if (!event.target.closest(".hasChild")) {
      setVisibleSubmenu(null);
    }
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


  const categories = [
    {
      name: "국내축구",
      items: [
        {
          name: "울산 HD FC",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "김천상무 FC",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "강원 FC",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "포항 노틸러스",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "FC서울",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "수원FC",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "제주 유나이티드",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "대전 하나 시티즌",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "광주 FC",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "전북 현대 모터스",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "대구FC",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "인천 유나이티드",
          image: "/img/bhl.png", // 이미지 경로
        },
      ],
    },
    {
      name: "해외축구",
      items: [
        {
          name: "레알 마드리드",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "리버풀",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "맨체스터 시티",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "맨체스터 유나이티드",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "첼시",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "토트넘",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "첼시",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "바이에른 뮌헨",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "유벤투스",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "AC밀란",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "인터 밀란",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "PSG",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "알 힐랄",
          image: "/img/bhl.png", // 이미지 경로
        },
      ],
    },
    {
      name: "국내야구",
      items: [
        {
          name: "LG",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "KIA",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "삼성",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "두산",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "SSG",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "KT",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "롯데",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "한화",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "NC",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "키움",
          image: "/img/bhl.png", // 이미지 경로
        },
      ],
    },
    {
      name: "여자배구",
      items: [
        {
          name: "흥국생명",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "현대건설",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "IBK기업은행",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "정관장",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "한국도로공사",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "페퍼저축은행",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "GS칼텍스",
          image: "/img/bhl.png", // 이미지 경로
        },
      ],
    },
    {
      name: "e스포츠",
      items: [
        {
          name: "T1",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "젠지",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "한화",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "KT",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "담원기아",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "광동",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "피어엑스",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "농심",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "DRX",
          image: "/img/bhl.png", // 이미지 경로
        },
        {
          name: "브리온",
          image: "/img/bhl.png", // 이미지 경로
        },
      ],
    },
  ];




  return (
    <header>
      <div className="headerContainer">
        <div className="headerMainContainer">
          <div className="left">
            <a href="/">
              <img src="https://fakeimg.pl/150x35/" alt="logo" />
            </a>
          </div>
          <div className="TotalSearchHead_search">
                    <form action="">
                        <div className="TotalSearchHead_search_container">
                            <input className="TotalSearchHead_search_input" type="text" placeholder="Search" />
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
              <a href="/MyPage/basket">
                <img src="/img/basket3.svg" alt="장바구니" className="icon" />
                <span>장바구니</span>
              </a>
              <a href="/CheckoutPage">
                <img src="/img/list.svg" alt="장바구니" className="icon" />
                <span>결제창</span>
              </a>
              <a href="/" onClick={() => setIsLoggedIn(false)}>
                <img src="/img/box-arrow-right.svg" alt="장바구니" className="icon" />
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
                  <span>카테고리</span>
                </a>
              </li>
              <li style={{ color: "#e2e2e2", transform: "translateX(18px)" }}>
                {" "}
                |{" "}
              </li>
              {categories.map((category, index) => (
                <li
                  key={index}
                  className={`hasChild categorypond ${visibleSubmenu === index ? "selected" : ""
                    }`}
                >
                  <a
                    href={`/item-sort.html?category=${category.name}`}
                    className="category-link"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCategoryClick(index);
                    }}
                  >
                    {category.name}
                  </a>
                  <ul
                    className={`submenu1 a${index + 1}`}
                    style={{
                      opacity: visibleSubmenu === index ? "1" : "0",
                      visibility: visibleSubmenu === index ? "visible" : "hidden",
                    }}
                  >
                    {category.items.map((item, subIndex) => (
                      <li key={subIndex}>
                        <a href="#">
                          <div className="categorycircle">
                            <img
                              src={item.image} // 이미지 경로를 동적으로 표시
                              alt={item.name}
                            />
                          </div>
                          <div className="categorycircle">{item.name}</div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>
          <div className="communitysection">
            <ul>
              <a href="/StyleMain">STYLE</a>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;