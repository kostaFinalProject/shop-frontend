import React, { useEffect, useState } from "react";
import "./ScrollUp.css";

const ScrollUp = () => {
  const [isVisible, setIsVisible] = useState(false);

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    setIsVisible(scrollTop > 200); // 스크롤 위치가 200px 이상이면 버튼 보이기
  };

  // 페이지 상단으로 이동
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // 부드럽게 스크롤
    });
  };

  useEffect(() => {
    // 스크롤 이벤트 등록
    window.addEventListener("scroll", handleScroll);

    // 컴포넌트 언마운트 시 이벤트 제거
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <button
      className="scroll_Up_Top_Btn"
      id="scrollToTopBtn"
      onClick={scrollToTop}
      style={{ display: isVisible ? "block" : "none" }} // 버튼 표시 여부
    >
      UP
    </button>
  );
};

export default ScrollUp;
