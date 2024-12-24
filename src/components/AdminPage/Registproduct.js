import React, { useState, useEffect } from 'react';
import "./Registproduct.css";

const Registproduct = () => {
  const [imageList, setImageList] = useState([{ file: null, checked: false }]); // 초기 상태에 파일 입력 하나 추가
  const [existingFiles, setExistingFiles] = useState(new Set());
  const [categories, setCategories] = useState([]); // 상위 카테고리 상태
  const [subCategories, setSubCategories] = useState({}); // 하위 카테고리 상태
  const [selectedCategory, setSelectedCategory] = useState(""); // 선택된 상위 카테고리
  const [itemDetailImage, setItemDetailImage] = useState(null);

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

  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  function handleCreateItemSubmit(e) {
    e.preventDefault();

    // 하위 카테고리 값 가져오기
    const itemCategory = document.getElementById("subcategory").value;

    // 상품명, 가격, 제조사 값 가져오기
    const name = document.getElementById("name").value;
    const price = parseFloat(document.getElementById("price").value);
    const manufacturer = document.getElementById("manufacturer").value;

    //판매자 seller 가져오기
    const seller = document.getElementById("seller").value;
    // 사이즈별 수량 값 가져오기
    const sizes = ["XS", "S", "M", "L", "XL", "2XL"];
    const stockQuantities = sizes.map(size => {
      const input = document.querySelector(`input[name='stockQuantity-${size}']`);

      if (input) {
        return { size, stockQuantity: parseInt(input.value, 10) || 0 };
      } else {
        console.warn(`Input for size ${size} not found.`);
        return { size, stockQuantity: 0 };
      }
    });

    // **유효성 검사 추가**
    if (price < 0 || sizes < 0) {
      alert("가격은 음수가 될 수 없습니다. 올바른 값을 입력하세요.");
      return;
    }

    // 이미지 파일 리스트 처리
    const imageInputs = document.querySelectorAll(".image-list input[type='file']");
    const itemImages = Array.from(imageInputs)
      .map(input => input.files[0])
      .filter(file => file !== undefined); // 파일이 있는 경우만 추가

    // 상세 이미지 파일 가져오기
    const itemDetailImageInput = document.getElementById("itemDetailImage");
    const itemDetailImage = itemDetailImageInput.files[0];

    if (!itemDetailImage) {
      alert("상세 이미지를 추가해주세요.");
      return;
    }

    // FormData 객체 생성
    const formData = new FormData();

    // `item` 객체 추가
    const item = {
      itemCategory,
      name,
      price,
      manufacturer,
      seller,
      itemSizes: stockQuantities,
    };
    formData.append("item", new Blob([JSON.stringify(item)], { type: 'application/json' }));

    // 여러 이미지 파일 추가
    itemImages.forEach(image => {
      formData.append("itemImages", image);
    });

    // 상세 이미지 파일 추가
    formData.append("itemDetailImage", itemDetailImage);

    // Fetch로 데이터 전송
    fetch('http://localhost:8080/api/v1/items', {
      method: 'POST',
      headers: {
        'Authorization': accessToken,
        'Refresh-Token': refreshToken,
      },
      body: formData,
    })
      .then(response => {
        if (response.ok) {
          alert("상품 등록이 완료되었습니다.");

          // 폼 초기화
          document.getElementById("createItemForm").reset();
          window.location.href = '/AdminPage/registproduct';
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
    <section className="registproductsection">

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
            className="detail-select"
            onClick={() => (window.location.href = "/AdminPage/registproduct")}
          >
            <div className="item">상품 등록</div>
          </div>
          <div
            className="detail-noselect"
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
          상품등록
        </div>
        <hr />
        <form id="createItemForm" action="" method="post" onSubmit={handleCreateItemSubmit}>
          {/* 카테고리 선택 */}
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

          {/* 상품 정보 입력 */}
          <div className="form-group">
            <label htmlFor="name">상품명</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className="form-group">
            <label htmlFor="price">가격</label>
            <input type="number" id="price" name="price" required />
          </div>
          <div className="form-group">
            <label htmlFor="manufacturer">제조사</label>
            <input type="text" id="manufacturer" name="manufacturer" required />
          </div>
          <div className="form-group">
            <label htmlFor="seller">판매자</label>
            <input type="text" id="seller" name="seller" required />
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

          {/* 이미지 업로드 */}
          <div className="form-group">
            <label>제품이미지 등록</label>
            <ul className="image-list" id="imageList">
              {imageList.map((item, index) => (
                <li key={index}>
                  {index > 0 && (
                    <input
                      type="checkbox"
                      id={`checkbox-${index}`}
                      checked={item.checked}
                      onChange={() => toggleCheck(index)}
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(index, e)}
                    required={index === 0}
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


          {/* 이미지 업로드 */}
          <div className="form-group">
            <label>상세이미지 등록</label>
            <input
              type="file"
              id="itemDetailImage"
              accept="image/*"
              required
            />
          </div>

          {/* 제출 버튼 */}
          <button type="submit">등록하기</button>
        </form>
      </div>
    </section>
  );
};

export default Registproduct;