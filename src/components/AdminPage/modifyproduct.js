import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Modifyproduct.css";

const Modifyproduct = () => {
  const [imageList, setImageList] = useState([{ file: null, checked: false }]); // 초기 상태에 파일 입력 하나 추가
  const [existingFiles, setExistingFiles] = useState(new Set());
  const [categories, setCategories] = useState([]); // 상위 카테고리 상태
  const [subCategories, setSubCategories] = useState({}); // 하위 카테고리 상태
  const [selectedCategory, setSelectedCategory] = useState(""); // 선택된 상위 카테고리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const [items, setItems] = useState([]); // 상태에 데이터를 저장할 배열
  const [selectedItem, setSelectedItem] = useState(null); // 선택된 아이템 데이터 저장



  // 데이터 가져오기
  useEffect(() => {
    axios.get('http://localhost:8080/api/v1/items')
      .then(response => {
        console.log(response.data); // 전체 데이터 구조 확인
        setItems(response.data.content); // content 배열만 상태에 저장
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  //모달
  const openModal = () => {
    setIsModalOpen(true);
    setSelectedItem(items); // 선택된 아이템의 데이터를 상태에 저장
    document.body.style.overflow = 'hidden'; // 스크롤 막기
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto'; // 스크롤 다시 활성화

  };

  //이미지
  const addImageInput = () => {
    setImageList(prevList => [...prevList, { file: null, checked: false }]);
  };

  const handleFileChange = (index, event) => {
    const file = event.target.files[0];
    const newImages = [...imageList];
    const previousFileName = newImages[index]?.file?.name;

    if (file) {
      if (existingFiles.has(file.name) && file.name !== previousFileName) {
        alert('이미 이 이미지를 선택했습니다.');
        event.target.value = null; // 필드를 초기화
      } else {
        if (previousFileName) {
          existingFiles.delete(previousFileName); // 이전 파일 이름 제거
        }
        existingFiles.add(file.name);
        newImages[index] = { file, checked: newImages[index].checked }; // 파일 업데이트
        setImageList(newImages);
      }
    } else {
      if (previousFileName) {
        existingFiles.delete(previousFileName);
        newImages[index] = { file: null, checked: newImages[index].checked }; // 파일 초기화
        setImageList(newImages);
      }
    }
  };

  // 체크된 이미지 삭제
  const removeCheckedImages = () => {
    const newImages = imageList.filter((image) => !image.checked);
    setImageList(newImages.length > 0 ? newImages : [{ file: null, checked: false }]); // 최소 하나의 입력 필드 유지

    // 중복된 파일 이름 제거
    const newExistingFiles = new Set(newImages.map((image) => image.file?.name).filter(Boolean));
    setExistingFiles(newExistingFiles);
  };

  const toggleCheck = (index) => {
    const newImages = [...imageList];
    newImages[index].checked = !newImages[index].checked; // 체크 상태 토글
    setImageList(newImages);
  };

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
      return; // 이미 하위 카테고리가 로드된 경우 API 호출 생략
    }

    try {
      const response = await fetch(`http://localhost:8080/api/v1/item-categories/${categoryId}`);
      if (response.ok) {
        const data = await response.json();
        const updatedData = data.map(item => ({
          categoryId: item.categoryId,
          categoryName: item.categoryName,
          imageUrl: item.categoryImageUrl.replace('C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\', ''),
        }));
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

  // 상위 카테고리 선택 시 하위 카테고리 가져오기
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    fetchChildrenCategories(categoryId);
  };

  function handleUpdateItemSubmit(e) {
    e.preventDefault();

    // 하위 카테고리 값 가져오기
    const itemCategory = document.getElementById("subcategory").value;

    // 상품명, 가격, 제조사 값 가져오기
    const name = document.getElementById("name").value;
    const price = parseFloat(document.getElementById("price").value);
    const manufacturer = document.getElementById("manufacturer").value;


    // 사이즈별 수량 값 가져오기
    const sizes = ["XS", "S", "M", "L", "XL", "2XL"];
    const stockQuantities = sizes.map(size => {
      const input = document.querySelector(`input[name='stockQuantity-${size}']`)

      // input이 null인지 확인
      if (input) {
        return { size, stockQuantity: parseInt(input.value, 10) || 0 };
      } else {
        console.warn(`Input for size ${size} not found.`);
        return { size, stockQuantity: 0 }; // 기본값으로 0 설정
      }
    });

    // **유효성 검사 추가** - 가격은 음수가 될 수 없습니다.
    if (price < 0 || sizes < 0) {
      alert("가격은 음수가 될 수 없습니다. 올바른 값을 입력하세요.");
      return; // 유효하지 않으면 제출 중단
    }

    // 이미지 파일 리스트 처리
    const images = [];
    const imageInputs = document.querySelectorAll(".image-list input[type='file']");
    imageInputs.forEach(input => {
      if (input.files[0]) {
        images.push(input.files[0]);
      }
    });

    // FormData 객체 생성
    const formData = new FormData();

    const item = {
      itemCategory,
      name,
      price,
      manufacturer,
      itemSizes: stockQuantities,
    };
    formData.append("item", new Blob([JSON.stringify(item)], { type: 'application/json' }));
    console.log(item);


    // 이미지 파일들 추가
    images.forEach(image => {
      formData.append('files', image);
    });

    // Fetch로 데이터 전송
    fetch(`http://localhost:8080/api/v1/items/${itemid}`, {
      method: 'PUT',
      headers: {
        'Authorization': accessToken,
        'Refresh-Token': refreshToken,
      },
      body: formData,
    })
      .then(response => {
        if (response.ok) {
          alert("상품 수정이 완료되었습니다.");

          // **폼 초기화**
          document.getElementById("updateItemForm").reset();
          setImageList([{ file: null, checked: false }]); // 이미지 입력 필드 초기화
          setSelectedCategory(""); // 선택된 카테고리 초기화
          setExistingFiles(new Set()); // 기존 파일 이름 초기화
          window.location.href = '/AdminPage/modifyproduct';
        } else {
          response.text().then(errorMessage => {
            alert(`오류 발생: ${errorMessage}`);
          });
        }
      })
      .catch(error => {
        console.error("Error during item registration:", error);
        alert("서버 오류로 인해 상품 등록에 실패했습니다. 잠시 후 다시 시도해주세요.");
      });
  }

  return (
    <section className="modifyproductsection">

      <div className="list">
        <div className="introduce">
          <div className="name">
            <strong style={{ marginRight: 5, marginLeft: 10 }}>최고 관리자</strong>
            님
          </div>
        </div>
        <div className="detail">
          <div className="detail-list" />
          <div
            className="detail-noselect"
            onClick={() => (window.location.href = "/AdminPage/reportuser")}
          >
            <div className="item">신고 유저 관리</div>
          </div>
          <div
            className="detail-noselect"
            onClick={() => (window.location.href = "/AdminPage/adminright")}
          >
            <div className="item">관리자 권한 관리</div>
          </div>
          <div
            className="detail-noselect"
            onClick={() => (window.location.href = "/AdminPage/categorymaker")}
          >
            <div className="item">카테고리 등록</div>
          </div>
          <div
            className="detail-noselect"
            onClick={() => (window.location.href = "/AdminPage/registproduct")}
          >
            <div className="item">상품 등록</div>
          </div>
          <div
            className="detail-select"
            onClick={() => (window.location.href = "/AdminPage/modifyproduct")}
          >
            <div className="item">상품 수정</div>
          </div>
          <div
            className="detail-noselect"
            onClick={() => (window.location.href = "/AdminPage/admindelivery")}
          >
            <div className="item">배송 관리</div>
          </div>
        </div>
      </div>

      <div className="info">
        <div className="content-name" style={{ marginBottom: 7, fontSize: 20 }}>
          상품수정
        </div>
        <hr />
        <div className="typelist">
          <table border={0} summary="">
            <colgroup>
              <col style={{ width: "auto" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "15%" }} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">이름</th>
                <th scope="col">가격</th>
                <th scope="col">할인율</th>
                <th scope="col">상태</th>
                <th scope="col">버튼</th>
              </tr>
            </thead>
            <tbody className="data">
              {items.map(item => (
                <tr key={item.id}>
                  <th scope="col">{item.name}</th>
                  <th scope="col">{item.price}</th>
                  <th scope="col">{item.discountPercent}</th>
                  <th scope="col">{item.itemStatus}</th>
                  <th scope="col">
                    <button id="modal-open" onClick={() => openModal(item)}>수정</button>
                    <button id="delete">삭제</button>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>

          {isModalOpen && (
            <div id="popup" className="modal" onClick={closeModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* 탭 */}
                <div className="tabs">
                  수정하기
                </div>
                {/* 페이지 내용 */}
                <div id="page1">
                  <article>
                    <form id="updateItemForm" action="" method="post" onSubmit={handleUpdateItemSubmit}>

                      <div className="categoryselect">
                        <div className="mainselect">
                          <div className="category">상위 카테고리</div>
                          <div>
                            <select
                              id="maincategory"
                              name="maincategory"
                              required
                              onChange={handleCategoryChange}
                            >
                              <option value="">카테고리를 선택하세요</option>
                              {categories.map((category) => (
                                <option key={category.parentCategoryId} value={category.parentCategoryId}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="subselect">
                          <div className="category">하위 카테고리</div>
                          <div>
                            <select id="subcategory" name="subcategory" required disabled={!selectedCategory}>
                              {selectedCategory && subCategories[selectedCategory]
                                ? subCategories[selectedCategory].map((sub) => (
                                  <option key={sub.categoryName} value={sub.categoryName}>
                                    {sub.categoryName}
                                  </option>
                                ))
                                : <option value="">상위 카테고리를 먼저 선택하세요</option>}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="name">상품명</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={selectedItem?.name || ""}
                          onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="price">가격</label>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={selectedItem?.price || ""}
                          onChange={(e) => setSelectedItem({ ...selectedItem, price: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="manufacturer">제조사</label>
                        <input
                          type="text"
                          id="manufacturer"
                          name="manufacturer"
                          value={selectedItem?.manufacturer || ""}
                          onChange={(e) => setSelectedItem({ ...selectedItem, manufacturer: e.target.value })}
                          required
                        />
                      </div>

                      {/* 사이즈별 재고 입력 */}
                      <div className="form-group">
                        <label>수량 (사이즈별)</label>
                        {["XS", "S", "M", "L", "XL", "2XL"].map((size) => (
                          <div key={size} className="size-group">
                            <label>{size}</label>
                            <input
                              type="number"
                              id={`stockQuantity-${size}`} // 템플릿 리터럴 수정
                              name={`stockQuantity-${size}`} // 템플릿 리터럴 수정
                              data-size={size}
                              min="0"
                              placeholder={`${size} 수량을 등록해 주세요`} // 템플릿 리터럴 수정
                            />
                          </div>
                        ))}
                      </div>

                      <div className="form-group">
                        <label>이미지 등록</label>
                        <ul className="image-list" id="imageList">
                          {imageList.map((item, index) => (
                            <li key={index}>
                              {index > 0 && (
                                <input
                                  type="checkbox"
                                  id={`checkbox-${index}`}
                                  checked={item.checked} // 체크 상태 반영
                                  value={selectedItem?.repImgUrl || ""}
                                  onChange={() => toggleCheck(index)} // 체크 상태 변경
                                />
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(index, e)}
                                required
                              />
                              {index === 0 && <span className="rep-img-label">대표 이미지</span>}
                            </li>
                          ))}
                        </ul>
                        <button type="button" className="add-image-btn" onClick={addImageInput}>
                          + 이미지 추가
                        </button>
                        <button type="button" className="remove-image-btn" onClick={removeCheckedImages} disabled={imageList.length <= 1}>
                          선택 이미지 삭제
                        </button>
                      </div>
                      <button type="submit">수정하기</button>
                    </form>
                  </article>
                </div>
                {/* 모달 닫기 버튼 */}
                <button id="close" onClick={closeModal}>Close</button>
              </div>
            </div>
          )}

          <p className="loading" style={{ display: "none" }}>
            <i className="xi-spinner-3 xi spin" />
          </p>
          {/* <p className="empty">주문 내역이 없습니다.</p> */}
        </div>
      </div>
    </section >
  );
};

export default Modifyproduct;
