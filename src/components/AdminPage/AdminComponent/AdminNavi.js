import React from "react";
import './AdminNavi.css';

const AdminNavi = () =>{
    return (
        <>
        <div className="AdminNavi_list">
        <div className="AdminNavi_introduce">
          <div className="AdminNavi_name">
            <strong style={{ marginRight: 5, marginLeft: 10 }}>최고 관리자</strong>
            님
          </div>
        </div>
        <div className="AdminNavi_detail">
          {/* <div className="AdminNavi_detail-list" /> */}
          {/* <div
            className="AdminNavi_detail-noselect"
            onClick={() => (window.location.href = "/AdminPage/reportuser")}
          >
            <div className="AdminNavi_item">신고 유저 관리</div>
          </div> */}
          <div
            className="AdminNavi_detail-noselect"
            onClick={() => (window.location.href = "/AdminPage/adminright")}
          >
            <div className="AdminNavi_item">관리자 권한 관리</div>
          </div>
          <div
            className="AdminNavi_detail-noselect"
            onClick={() => (window.location.href = "/AdminPage/categorymaker")}
          >
            <div className="AdminNavi_item">카테고리 등록</div>
          </div>
          <div
            className="AdminNavi_detail-noselect"
            onClick={() => (window.location.href = "/AdminPage/registproduct")}
          >
            <div className="AdminNavi_item">상품 등록</div>
          </div>
          {/* <div
            className="AdminNavi_detail-noselect"
            onClick={() => (window.location.href = "/AdminPage/modifyproduct")}
          >
            <div className="AdminNavi_item">상품 수정</div>
          </div> */}
          {/* <div
            className="AdminNavi_detail-select"
            onClick={() => (window.location.href = "/AdminPage/admindelivery")}
          >
            <div className="AdminNavi_item">배송 관리</div>
          </div> */}
        </div>
      </div>

        </>
    );
};

export default AdminNavi;

