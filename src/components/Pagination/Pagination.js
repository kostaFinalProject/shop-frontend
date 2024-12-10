import React from 'react';
import './Pagination.css';

function Pagination({ totalPages, currentPage, onPageChange }) {
  const handleClick = (page) => {
    if (page < 1 || page > totalPages) return; // 페이지 번호가 유효한 범위 내에 있는지 확인
    onPageChange(page);  // 페이지 번호 변경을 부모 컴포넌트로 알림
  };

  return (
    <ul id="Pagination_paging_ul">
      {/* << 버튼 */}
      <li className={`Pagination_paging_li ${currentPage === 1 ? 'disabled' : ''}`}>
        <button onClick={() => handleClick(1)} className="Pagination_paging_btn">
          &lt;&lt;
        </button>
      </li>

      {/* < 버튼 */}
      <li className={`Pagination_paging_li ${currentPage === 1 ? 'disabled' : ''}`}>
        <button onClick={() => handleClick(currentPage - 1)} className="Pagination_paging_btn">
          &lt;
        </button>
      </li>

      {/* 페이지 번호 버튼들 */}
      {[...Array(totalPages).keys()].map((_, index) => (
        <li key={index} className="Pagination_paging_li">
          <button
            onClick={() => handleClick(index + 1)}
            className={index + 1 === currentPage ? 'active' : 'Pagination_paging_btn'}
          >
            {index + 1}
          </button>
        </li>
      ))}

      {/* > 버튼 */}
      <li className={`Pagination_paging_li ${currentPage === totalPages ? 'disabled' : ''}`}>
        <button onClick={() => handleClick(currentPage + 1)} className="Pagination_paging_btn">
          &gt;
        </button>
      </li>

      {/* >> 버튼 */}
      <li className={`Pagination_paging_li ${currentPage === totalPages ? 'disabled' : ''}`}>
        <button onClick={() => handleClick(totalPages)} className="Pagination_paging_btn">
          &gt;&gt;
        </button>
      </li>
    </ul>
  );
}

export default Pagination;
