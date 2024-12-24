import React, { useState } from "react";
import "./QnA.css";
import Pagination from "../Pagination/Pagination";

const QnA = () => {
  // 더미 데이터 준비
  const dummyPosts = Array.from({ length: 45 }, (_, index) => ({
    id: index + 1,
    productInfo: "https://placehold.co/70x70",
    title: `글 제목 ${index + 1}`,
    writer: `작성자 ${index + 1}`,
    date: `2024-12-${String(index + 1).padStart(2, "0")}`,
  }));

  // 상태 관리
  const [currentPage, setCurrentPage] = useState(1);
  const [searchDate, setSearchDate] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const postsPerPage = 10; // 한 페이지당 보여줄 글 수

  // 검색 조건에 맞는 게시글 필터링
  const filteredPosts = dummyPosts.filter((post) => {
    const matchDate =
      searchDate === "" || post.date.includes(searchDate); // 날짜 필터링
    const matchKey =
      searchKey === "" ||
      (searchKey === "subject" && post.title.includes(searchValue)) ||
      (searchKey === "content" && post.title.includes(searchValue)) ||
      (searchKey === "writer_name" && post.writer.includes(searchValue)) ||
      (searchKey === "member_id" && post.writer.includes(searchValue)) ||
      (searchKey === "nick_name" && post.writer.includes(searchValue)) ||
      (searchKey === "product" && post.productInfo.includes(searchValue)); // 제목, 내용 등 필터링
    return matchDate && matchKey;
  });

  // 현재 페이지의 데이터 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // ---------------notice form-------------
  const handleSubmit = (e) => {
    e.preventDefault(); // 폼 기본 동작 방지
    console.log("검색 조건:", { searchDate, searchKey, searchValue });
  };

  return (
    <>
      <div className="QnA_full_screen">
        <div className="QnA_title_logo">
          <h2>Q&A</h2>
        </div>

        {/* --------------notice_board------------------  */}
        <div className="QnA_notice_board">
          <table border="1">
            <colgroup>
              <col style={{ width: "80px" }} />
              <col style={{ width: "100px" }} />
              <col style={{ width: "910px" }} />
              <col style={{ width: "150px" }} />
              <col style={{ width: "120px" }} />
            </colgroup>
            <thead className="QnA_board_thead">
              <tr>
                <th scope="col">번호</th>
                <th scope="col">상품정보</th>
                <th scope="col">제목</th>
                <th scope="col">작성자</th>
                <th scope="col">작성일</th>
              </tr>
            </thead>
            <tbody className="QnA_board_tbody">
              {currentPosts.map((post) => (
                <tr key={post.id}>
                  <td>{post.id}</td>
                  <td>
                    <a href="#">
                      <img src={post.productInfo} alt={`Product ${post.id}`} />
                    </a>
                  </td>
                  <td className="QnA_tbody_title">
                    <a href="#">
                      <p>{post.title}</p>
                    </a>
                  </td>
                  <td>{post.writer}</td>
                  <td>{post.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --------------------Notice from-------------------- */}
        <div className="QnA_notice_form">
          <form onSubmit={handleSubmit}>
            <select
              className="QnA_selArray"
              id="search_date"
              name="search_date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            >
              <option value="week">일주일</option>
              <option value="month">한달</option>
              <option value="month3">세달</option>
              <option value="all">전체</option>
            </select>
            <select
              className="QnA_selArray"
              id="search_key"
              name="search_key"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            >
              <option value="subject">제목</option>
              <option value="content">내용</option>
              <option value="writer_name">글쓴이</option>
              <option value="member_id">아이디</option>
              <option value="nick_name">별명</option>
              <option value="product">상품정보</option>
            </select>
            <input
              id="search"
              name="search"
              className="QnA_notice_form_input"
              placeholder="검색어를 입력하세요"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              type="text"
            />
            <button type="submit" className="QnA_btnNormal">
              찾기
            </button>
          </form>
        </div>

        {/* --------------------------페이징처리-------------------- */}
        <div className="QnA_paging">
          <Pagination
            totalPages={Math.ceil(filteredPosts.length / postsPerPage)}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
};

export default QnA;