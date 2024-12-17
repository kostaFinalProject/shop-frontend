import React, { useState, useEffect } from "react";
import "./Categorymaker.css";

const Categorymaker = () => {
  const [image, setImage] = useState(null); // 선택된 파일을 관리
  const [existingFiles, setExistingFiles] = useState(new Set()); // 이미 선택한 파일을 추적
  const [categoryName, setCategoryName] = useState(""); // 카테고리 이름을 관리
  const [categories, setCategories] = useState([]); // 상위 카테고리 상태
    const [subCategories, setSubCategories] = useState({}); // 하위 카테고리 상태


  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      if (existingFiles.has(file.name)) {
        alert("이미 이 이미지를 선택했습니다.");
        event.target.value = null; // 필드를 초기화
      } else {
        existingFiles.add(file.name); // 새 파일 이름 추가
        setImage(file); // 파일을 상태에 저장
        setExistingFiles(new Set(existingFiles)); // 상태 업데이트
      }
    } else {
      setImage(null); // 파일이 없으면 상태 초기화
    }
  };


  function handleparentCategorySubmit(e) {
    e.preventDefault();

    const parentCategory = document.getElementById("parentCategory").value;

    // 선택된 이미지가 없으면 빈 파일로 설정
    const file = image ? image : new File([], "");

    // category 객체를 먼저 선언
    const category = {
      name: parentCategory,
      parentCategory: "",
      file,
    };

    // FormData 객체 생성
    const formData = new FormData();

    // 카테고리 정보를 'itemCategory'라는 이름으로 추가
    formData.append("itemCategory", new Blob([JSON.stringify(category)], { type: 'application/json' }));
    formData.append("file", file); // 이미지 파일 추가

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    // Fetch로 데이터 전송
    fetch('http://localhost:8080/api/v1/item-categories', {
      method: 'POST',
      headers: {
        'Authorization': accessToken,
        'Refresh-Token': refreshToken,
      },
      body: formData,
    })
      .then(response => {
        if (response.ok) {
          alert("카테고리 등록이 완료되었습니다.");

          // 폼 초기화
          document.getElementById("updateCategoryForm").reset();
          window.location.href = '/AdminPage/categorymaker';
        } else {
          response.text().then(errorMessage => {
            alert(`오류 발생: ${errorMessage}`);
          });
        }
      })
      .catch(error => {
        console.error("Error during item registration:", error);
        alert("서버 오류로 인해 카테고리 등록에 실패했습니다. 잠시 후 다시 시도해주세요.");
      });
  }

  function handlesonCategorySubmit(e) {
    e.preventDefault();

    // 부모 카테고리와 하위 카테고리 이름 가져오기
    const parentCategory1 = document.getElementById("parentCategory1").value;
    const subCategoryName = document.getElementById("subCategoryName").value;

    console.log("선택된 부모 카테고리:", parentCategory1);
    console.log("입력된 하위 카테고리 이름:", subCategoryName);

    if (!parentCategory1) {
      alert("부모 카테고리를 선택해주세요.");
      return;
    }

    if (!subCategoryName) {
      alert("하위 카테고리 이름을 입력해주세요.");
      return;
    }

    if (!image) {
      alert("이미지를 선택해주세요.");
      return;
    }

    // 카테고리 객체 생성
    const category = {
      name: subCategoryName,
      parentCategory: parentCategory1  // 상위 카테고리 ID 또는 이름 전달
    };

    // FormData 객체 생성
    const formData = new FormData();
    formData.append(
      "itemCategory",
      new Blob([JSON.stringify(category)], { type: "application/json" })
    );
    formData.append("file", image); // 선택된 이미지 추가

    // 로컬 스토리지에서 인증 토큰 가져오기
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    // 서버로 데이터 전송
    fetch("http://localhost:8080/api/v1/item-categories", {
      method: "POST",
      headers: {
        Authorization: accessToken,
        "Refresh-Token": refreshToken,
      },
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          alert("카테고리 등록이 완료되었습니다.");

          // 폼 초기화
          e.target.reset();
          setImage(null); // 선택된 이미지 초기화
          window.location.href = "/AdminPage/categorymaker";
        } else {
          response.text().then((errorMessage) => {
            alert(`오류 발생: ${errorMessage}`);
          });
        }
      })
      .catch((error) => {
        console.error("Error during category registration:", error);
        alert("서버 오류로 인해 카테고리 등록에 실패했습니다. 잠시 후 다시 시도해주세요.");
      });
  }




  useEffect(() => {
    const fetchTopCategories = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/item-categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data); // 기존 categories 상태에 데이터 저장
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

  const generateCategoryList = (categories) => {
    return categories.map((category, item) => {
      if (category.name && item.categoryName) {
        return `${category.name}-${category.categoryName}`;
      }
      return category.name;
    });
};


  return (
    <section className="categorymakersection">
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
            className="detail-select"
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
          카테고리 등록
        </div>
        <hr />
        <div className="content">
          <div className="makecategory">
            <span>카테고리 만들기</span>
            <div className="upcategory">

              <span>상위 카테고리</span>
              <form id="updateCategoryForm" action="" method="post" onSubmit={handleparentCategorySubmit}>
                <input
                  type="text"
                  id="parentCategory"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)} // 카테고리 이름 입력
                  style={{ width: 300, height: 20 }}
                />

                <button type="submit" style={{ width: 100 }}>
                  제출
                </button>
              </form>
            </div>

            <div className="downcategory">

              <span>하위 카테고리</span>
              <form id="handlesonCategorySubmit" action="" method="post" onSubmit={handlesonCategorySubmit}>
                <div>
                  <select id="parentCategory1" name="parentCategory1" required>
                    <option value="">카테고리를 선택하세요</option>
                    {categories.map((category) => (
                      <option key={category.parentCategoryId} value={category.parentCategory}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <input type="text" style={{ width: 300, height: 20 }} id="subCategoryName" name="subCategoryName" />
                <div>
                  파일선택
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {image && <div>선택된 파일: {image.name}</div>}
                </div>

                <button type="submit" style={{ width: 100 }}>
                  제출
                </button>
              </form>

            </div>

          </div>

          <div className="categorylist">
            <span>카테고리 리스트</span>
            <button onClick={() => alert("삭제 기능 구현 필요")}>삭제</button>
            <div className="categoryli">
              {generateCategoryList(categories).map((categoryName, index) => (
                <div key={index}>
                  <input type="checkbox" />
                  {categoryName}
                </div>
              ))}
            </div>
          </div>


        </div>
      </div>
    </section >
  );
};

export default Categorymaker;