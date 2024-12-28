import React, { useState, useEffect } from "react";
import "./Categorymaker.css";
import AdminNavi from "./AdminComponent/AdminNavi";

const Categorymaker = () => {
  const [image, setImage] = useState(null); // 선택된 파일을 관리
  const [existingFiles, setExistingFiles] = useState(new Set()); // 이미 선택한 파일을 추적
  const [categoryName, setCategoryName] = useState(""); // 카테고리 이름을 관리
  const [categories, setCategories] = useState([]); // 상위 카테고리 상태


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

    // 중복 확인
    if (categories.some((category) => category.name === parentCategory)) {
      alert("이미 존재하는 카테고리 이름입니다.");
      return;
    }

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

    const parentCategory1 = document.getElementById("parentCategory1").value;
    const subCategoryName = document.getElementById("subCategoryName").value;

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

    // 중복 검사: 이미 존재하는 하위 카테고리 이름인지 확인 일단 안됨
    const parentCategory = categories.find(category => category.categoryId === parseInt(parentCategory1));
    if (parentCategory && parentCategory.subCategories) {
      const isDuplicate = parentCategory.subCategories.some(subCategory =>
        subCategory.categoryName.trim().toLowerCase() === subCategoryName.trim().toLowerCase()
      );
      if (isDuplicate) {
        alert("이미 존재하는 하위 카테고리 이름입니다.");
        return;
      }
    }


    // 카테고리 객체 생성
    const category = {
      name: subCategoryName,
      parentCategory: parentCategory1,
    };

    const formData = new FormData();
    formData.append("itemCategory", new Blob([JSON.stringify(category)], { type: "application/json" }));
    formData.append("file", image);

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

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
          e.target.reset();
          setImage(null);
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
          console.log("data", data);

          // 각 itemCategoryId에 대해 GET 요청 보내기
          for (const category of data) {
            const itemCategoryId = category.parentCategoryId; // itemCategoryId 추출
            const categoryResponse = await fetch(`http://localhost:8080/api/v1/item-categories/${itemCategoryId}`);
            if (categoryResponse.ok) {
              const categoryData = await categoryResponse.json();
              console.log(`Data for category ${itemCategoryId}:`, categoryData);
              // 필요한 경우 categoryData를 상태에 저장하거나 추가 작업 수행
              // 예: category.subCategories = categoryData.subCategories;
              category.subCategories = categoryData.subCategories; // 하위 카테고리 추가
            } else {
              console.error(`Failed to fetch category with ID ${itemCategoryId}.`);
            }
          }
        } else {
          console.error("Failed to fetch top categories.");
        }
      } catch (error) {
        console.error("Error fetching top categories:", error);
      }
    };

    fetchTopCategories();
  }, []);

  const generateCategoryList = (categories) => {
    return categories.map((category) => {
      if (category.parentCategory && category.subCategoryName) {
        return `${category.parentCategory}-${category.subCategoryName}`;
      }
      return category.name;
    });
  };


  return (
    <section className="categorymaker_section">
      <AdminNavi />
      <div className="categorymaker_info">
        <div className="categorymaker_content-name" style={{ marginBottom: 7, fontSize: 20 }}>
          카테고리 등록
        </div>
        <hr />
        {/* --------------------------- */}
        <div className="categorymaker_content">
          <div className="categorymaker_makecategory">
            <span className="categorymaker_Head">카테고리 만들기</span>

            <div className="categorymaker_upcategory">
              <span>상위 카테고리</span>
              <form id="categorymaker_updateCategoryForm" action="" method="post" onSubmit={handleparentCategorySubmit}>
                <input
                  type="text"
                  id="parentCategory"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)} // 카테고리 이름 입력
                />

                <button className="categorymaker_updateCategoryForm_button" type="submit" >
                  제출
                </button>
              </form>

            </div>

            <div className="categorymaker_downcategory">

              <span>하위 카테고리</span>
              <form id="handlesonCategorySubmit" action="" method="post" onSubmit={handlesonCategorySubmit}>
                <div className="categorymaker_parent_Box">
                  <select id="parentCategory1" name="parentCategory1" required>
                    <option value="">카테고리를 선택하세요</option>
                    {categories.map((category) => (
                      <option key={category.parentCategoryId} value={category.parentCategory}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="categorymaker_parent_Box">
                  <div className="categorymaker_parent_TeamName" >
                    팀명
                  </div>
                  <input type="text" id="subCategoryName" name="subCategoryName" />
                </div>

                <div className="categorymaker_parent_File_Box">
                  <div className="categorymaker_parent_File" >파일선택</div>
                  <input
                    className="categorymaker_parent_File_Input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {image && <div>선택된 파일: {image.name}</div>}
                </div>

                <button className="categorymaker_parent_Button" type="submit">
                  제출
                </button>
              </form>

            </div>

          </div>
          {/* 카테고리 리스트  */}
          <div className="categorymaker_categorylist">
            <div className="categorymaker_categorylist_Head">
              <span>카테고리 리스트</span>
              <button className="categorymaker_categorylist_Delete" onClick={() => alert("삭제 기능 구현 필요")}>삭제</button>
            </div>

            <div className="categorymaker_categorylist_Box">
              {categories.map((category) => (
                <div key={category.categoryId}>
                  <input type="checkbox" />
                  {category.name}
                  {category.subCategories && category.subCategories.length > 0 && (
                    <ul>
                      {category.subCategories.map((subCategory) => (
                        <li key={subCategory.categoryId}>
                          {subCategory.categoryName}
                        </li>
                      ))}
                    </ul>
                  )}
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
