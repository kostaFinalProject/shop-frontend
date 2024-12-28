import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import "./Modifyproduct.css";

const Modifyproduct = () => {
  const { state } = useLocation();
  const itemData = state?.itemData || {};

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [imageList, setImageList] = useState(
    itemData.imageUrls?.map((url) => ({ file: null, checked: false })) || []
  );
  const [itemDetailImage, setItemDetailImage] = useState(null);
  const [name, setName] = useState(itemData.name || "");
  const [price, setPrice] = useState(itemData.price || 0);
  const [manufacturer, setManufacturer] = useState(itemData.manufacturer || "");
  const [seller, setSeller] = useState(itemData.seller || "");
  const [stockQuantities, setStockQuantities] = useState(
    itemData.itemSizes?.map((size) => ({
      size: size.itemSize,
      stockQuantity: size.stockQuantity,
    })) || []
  );

  const [existingFiles, setExistingFiles] = useState(new Set());

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
          imageUrl: item.categoryImageUrl.replace('C:\\Users\\dusrb\\FinalTotalProject\\frontend\\frontend-jhs-Ingu\\frontend-jhs-Ingu\\public\\uploads\\', ''),
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

  // 수정 API 호출
  const handleCreateItemSubmit = (e) => {
    e.preventDefault();

    const itemCategory = document.getElementById("subcategory").value;
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
      .filter(file => file !== undefined);

    // 상세 이미지 파일 가져오기
    const itemDetailImageInput = document.getElementById("itemDetailImage");
    const itemDetailImage = itemDetailImageInput.files[0];

    if (!itemDetailImage) {
      alert("상세 이미지를 추가해주세요.");
      return;
    }
    // FormData 생성
    const formData = new FormData();

    // 기본 상품 정보
    const item = {
      itemCategory,
      name,
      price,
      manufacturer,
      seller,
      itemSizes: stockQuantities.map((size) => ({
        size: size.size,
        stockQuantity: size.stockQuantity,
      })),
    };

    formData.append("item", new Blob([JSON.stringify(item)], { type: "application/json" }));

    imageList.forEach((image) => {
            if (image.file) {
                formData.append("itemImages", image.file);
            }
        });
        if (typeof itemDetailImage === "object") {
            formData.append("itemDetailImage", itemDetailImage);
        }

    fetch(`http://localhost:8080/api/v1/items/${itemData.itemId}`, {
      method: "PUT",
      headers: {
        Authorization: accessToken,
        "Refresh-Token": refreshToken,
      },
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          alert("상품 수정이 완료되었습니다.");
          window.location.href = `/DetailPage?itemId=${itemData.itemId}`;
        } else {
          response.text().then((errorMessage) => {
            alert(`수정 실패: ${errorMessage}`);
          });
        }
      })
      .catch((error) => {
        console.error("Error during item modification:", error);
        alert("서버 오류로 인해 수정에 실패했습니다. 잠시 후 다시 시도해주세요.");
      });
  };

  return (
    <section className="Modityproduct_section">
      <div className="Modityproduct_info">
        <div
          className="Modityproduct_content-name"
          style={{ marginBottom: 7, fontSize: 20 }}
        >
          상품수정
        </div>
        <hr />
        <form id="createItemForm" action="" method="post" onSubmit={handleCreateItemSubmit}>
          {/* 카테고리 선택 */}
          <div className="Modityproduct_categoryselect">
            <div className="Modityproduct_mainselect">
              <div className="Modityproduct_category">상위 카테고리</div>
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
            <div className="Modityproduct_subselect">
              <div className="Modityproduct_category">하위 카테고리</div>
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
          <div className="Modityproduct_form-group">
            <label htmlFor="name">상품명</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="Modityproduct_form-group">
            <label htmlFor="price">가격</label>
            <input
              type="number"
              id="price"
              name="price"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
            />
          </div>
          <div className="Modityproduct_form-group">
            <label htmlFor="manufacturer">제조사</label>
            <input
              type="text"
              id="manufacturer"
              name="manufacturer"
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
              required
            />
          </div>
          <div className="Modityproduct_form-group">
            <label htmlFor="seller">판매자</label>
            <input
              type="text"
              id="seller"
              name="seller"
              value={seller}
              onChange={(e) => setSeller(e.target.value)}
              required
            />
          </div>

          {/* 사이즈별 재고 입력 */}
          <div className="Modityproduct_form-group">
            <label>수량 (사이즈별)</label>
            {stockQuantities.map((stock, index) => (
              <div key={stock.size} className="size-group">
                <label>{stock.size}</label>
                <input
                  type="number"
                  id={`stockQuantity-${stock.size}`}
                  name={`stockQuantity-${stock.size}`}
                  value={stock.stockQuantity}
                  onChange={(e) => {
                    const updatedQuantities = [...stockQuantities];
                    updatedQuantities[index].stockQuantity = Number(
                      e.target.value
                    );
                    setStockQuantities(updatedQuantities);
                  }}
                  min="0"
                  placeholder={`${stock.size} 수량을 수정해 주세요`}
                />
              </div>
            ))}
          </div>

          {/* 이미지 업로드 */}
          <div className="Modityproduct_form-group">
            <label>제품이미지 등록</label>
            <ul className="Modityproduct_image-list" id="imageList">
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
                  />
                  {item.url && <span>{item.url}</span>}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="Modityproduct_add-image-btn"
              onClick={addImageInput}
            >
              + 이미지 추가
            </button>
            <button
              type="button"
              className="Modityproduct_remove-image-btn"
              onClick={removeCheckedImages}
              disabled={imageList.length <= 1}
            >
              선택 이미지 삭제
            </button>
          </div>

          {/* 상세 이미지 업로드 */}
          <div className="Modityproduct_form-group">
            <label>상세이미지 등록</label>
            <input
              type="file"
              id="itemDetailImage"
              accept="image/*"
              onChange={(e) => setItemDetailImage(e.target.files[0])}
            />
            {typeof itemDetailImage === "string" && <span>{itemDetailImage}</span>}
          </div>

          {/* 제출 버튼 */}
          <button type="submit" style={{marginBottom: "20px"}}>수정하기</button>
        </form>
      </div>
    </section>
  );
};

export default Modifyproduct;
