import React from "react";
import ReactDOM from "react-dom";
import Header from "./Header"; // Header 컴포넌트 경로

const mockCategories = [
  {
    name: "국내축구",
    items: [
      { name: "울산 HD FC", image: "/img/ulsan.png" },
      { name: "포항 스틸러스", image: "/img/pohang.png" },
    ],
  },
  {
    name: "해외축구",
    items: [
      { name: "레알 마드리드", image: "/img/realmadrid.png" },
      { name: "바르셀로나", image: "/img/barcelona.png" },
    ],
  },
];

// Header 컴포넌트에 mock 데이터 전달
ReactDOM.render(
  <React.StrictMode>
    <Header categories={mockCategories} />
  </React.StrictMode>,
  document.getElementById("root")
);
