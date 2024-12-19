import React, { useState, useEffect } from "react";
import './test.css';

const Test = () => {

  //상품검색
  const [products, setProducts] = useState([]); // 선택된 상품들
  const [searchQuery, setSearchQuery] = useState(""); // 검색어
  const [searchResults, setSearchResults] = useState([]); // 검색 결과
  const [isSearching, setIsSearching] = useState(false); // 검색 중인지 여부
  const [items, setItems] = useState([]); // 상태에 데이터를 저장할 배열
  const [selectedItems, setSelectedItems] = useState([]); // 선택된 상품 데이터 저장

  // 실시간 검색 함수
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true); // 검색 중 상태
    try {
      const response = await fetch(`http://localhost:8080/api/v1/items`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      // data.content가 배열인지 확인
      if (Array.isArray(data.content)) {
        // 검색어에 따라 필터링
        const filteredResults = data.content.filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filteredResults); // 필터링된 결과를 searchResults에 설정
      } else {
        console.error("검색 결과가 배열이 아닙니다:", data);
        setSearchResults([]); // 배열이 아닐 경우 빈 배열로 설정
      }
    } catch (error) {
      console.error("상품 검색 오류:", error);
      setSearchResults([]); // 오류 발생 시 빈 배열로 설정
    } finally {
      setIsSearching(false); // 검색 완료 상태
    }
  };

  // 검색어 변경 처리
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query); // 실시간 검색 호출
  };

  // 검색 결과에서 상품 선택
  const handleProductSelect = (product) => {
    if (!products.includes(product.name)) {
      setProducts((prev) => [...prev, product.name]);
      setSelectedItems((prev) => [...prev, product]); // 선택된 상품 데이터 추가
      setSearchQuery(""); // 검색어 초기화
      setSearchResults([]); // 검색 결과 초기화
    }
  };

  // 데이터 가져오기
  useEffect(() => {
    fetch('http://localhost:8080/api/v1/items')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data); // 전체 데이터 구조 확인
        setItems(data.content); // content 배열만 상태에 저장
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  //여기까지


  return (
    <div className="NewCreate_full_screen">
      <div className="NewCreate_text_cover">
        <label className="NewCreate_Name" htmlFor="tag_product">
          상품 검색
        </label>
        <div className="NewCreate_search_cover">
          <input
            type="text"
            id="tag_product"
            name="tag_product"
            className="NewCreate_Text_input"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="상품명을 입력하세요"
          />
          <ul className="search-results">
            {Array.isArray(searchResults) && searchResults.map((product) => (
              <li
                key={product.itemId} // itemId를 key로 사용
                onClick={() => handleProductSelect(product)}
                className="search-result-item"
              >
                {product.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 선택된 상품만 표시 */}
      <div className="NewCreate_selected_products">
        {selectedItems.map((item) => (
          <div key={item.itemId} className="NewCreate_products">
            <div className='StyleDetail_Lookup_List_Img'>
              <img src={`/uploads/${item.imgUrl}`} alt={item.name} />
            </div>

            <div className='StyleDetail_Lookup_List_Content'>
              <p>{item.name}</p>
            </div>
            <div className='StyleDetail_Lookup_List_Price'>
              <p>{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Test;
