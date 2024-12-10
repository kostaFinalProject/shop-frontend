import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import Header from "./Header"; // 실제 Header 컴포넌트 경로에 맞게 수정

// 예시 카테고리 데이터
const mockCategories = [
  {
    name: "국내축구",
    items: [
      { name: "울산 HD FC", image: "/img/bhl.png" },
      { name: "김천상무 FC", image: "/img/bhl.png" },
    ],
  },
  {
    name: "해외축구",
    items: [
      { name: "레알 마드리드", image: "/img/bhl.png" },
      { name: "리버풀", image: "/img/bhl.png" },
    ],
  },
];

// 테스트: 카테고리 렌더링 확인
test("renders categories and items", () => {
  // Header 컴포넌트에 mockCategories 데이터를 전달하여 렌더링
  render(<Header categories={mockCategories} />);

  // 카테고리 이름이 제대로 렌더링 되었는지 확인
  mockCategories.forEach((category) => {
    expect(screen.getByText(category.name)).toBeInTheDocument();
  });

  // 카테고리의 첫 번째 아이템이 렌더링 되었는지 확인
  expect(screen.getByText(mockCategories[0].items[0].name)).toBeInTheDocument();
  expect(screen.getByText(mockCategories[0].items[1].name)).toBeInTheDocument();
});

// 테스트: 서브메뉴 클릭 시, 아이템 목록이 표시되는지 확인
test("shows submenu on category click", () => {
  render(<Header categories={mockCategories} />);

  // 첫 번째 카테고리를 클릭
  const firstCategory = screen.getByText(mockCategories[0].name);
  fireEvent.click(firstCategory);

  // 첫 번째 카테고리 아이템이 보여지는지 확인
  expect(screen.getByText(mockCategories[0].items[0].name)).toBeVisible();
  expect(screen.getByText(mockCategories[0].items[1].name)).toBeVisible();
});
