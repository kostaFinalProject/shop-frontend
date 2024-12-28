import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./QnA.css";
import Pagination from "../Pagination/Pagination";

const QnA = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // 상태 관리
  const [currentPage, setCurrentPage] = useState(1);
  const [qnaPosts, setQnaPosts] = useState([]); // QnA 게시글 저장
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수

  const postsPerPage = 10; // 한 페이지당 보여줄 글 수

  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  // API 호출 (QnA 데이터 가져오기)
  useEffect(() => {
    const fetchQnaPosts = async () => {
      try {
        // 헤더 추가 (JWT 인증)
        const headers = {
          "Content-Type": "application/json",
        };

        if (accessToken && refreshToken) {
          headers["Authorization"] = accessToken;
          headers["Refresh-Token"] = refreshToken;
        }

        // API 호출
        const response = await fetch(
          `http://localhost:8080/api/v1/qna?page=${currentPage - 1}&size=${postsPerPage}`,
          { headers }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // 이미지 경로 포맷팅
        const formattedPosts = data.content.map(post => ({
          ...post,
          repImgYn: post.repImgYn.replace("C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\", ""),
        }));

        setQnaPosts(formattedPosts);  // 데이터 저장
        setTotalPages(data.totalPages); // 전체 페이지 수 저장

      } catch (error) {
        console.error("Error fetching QnA posts:", error);
      }
    };

    // URL 쿼리 매개변수 업데이트
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("page", currentPage);
    navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true });

    fetchQnaPosts();
  }, [currentPage]); // currentPage가 변경될 때마다 API 호출

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleTitleClick = async (questionId) => {
    navigate(`/QnAdetail?questionId=${questionId}`);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}. ${month}. ${day}. ${hours}:${minutes}`;
};

  return (
    <>
      <div className="QnA_full_screen">
        <div className="QnA_title_logo">
          <h2>Q&A</h2>
        </div>

        {/* QnA 게시글 목록 */}
        <div className="QnA_notice_board">
          <table border="1">
            <colgroup>
              <col style={{ width: "80px" }} />
              <col style={{ width: "100px" }} />
              <col style={{ width: "910px" }} />
              <col style={{ width: "150px" }} />
              <col style={{ width: "120px" }} />
              <col style={{ width: "120px" }} />
            </colgroup>
            <thead className="QnA_board_thead">
              <tr>
                <th scope="col">번호</th>
                <th scope="col">상품정보</th>
                <th scope="col">제목</th>
                <th scope="col">작성자</th>
                <th scope="col">작성일</th>
                <th scope="col">상태</th>
              </tr>
            </thead>
            <tbody className="QnA_board_tbody">
              {qnaPosts.map((post) => (
                <tr key={post.questionId}>
                  <td>{post.questionId}</td>
                  <td>
                    <a href="#">
                      <img
                        src={`/uploads/${post.repImgYn}`}
                        alt={`Product ${post.questionId}`}
                        style={{ width: "90px", height: "80px" }}
                      />
                    </a>
                  </td>
                  <td className="QnA_tbody_title">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault(); // 기본 동작 방지
                        handleTitleClick(post.questionId);
                      }}
                    >
                      <p>{post.title}</p>
                    </a>
                  </td>
                  <td>{post.memberNickname}</td>
                  <td style={{ fontSize: "15px" }}>{formatDate(post.createAt)}</td>
                  <td>{post.questionStatus === "PROGRESS" ? "답변 중" : "답변 완료"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이징처리 */}
        <div className="QnA_paging">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
};

export default QnA;
