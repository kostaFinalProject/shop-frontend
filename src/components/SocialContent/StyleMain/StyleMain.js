import React, { useState, useEffect } from "react";
import './StyleMain.css';
import ProfilePosts from "../StyleProfile/ProfilePosts.js";
import { TeamLogo } from "./TeamLogoData/TeamLogo.js";  // TeamLogo에서 데이터 가져오기

const StyleMain = () => {
    const [selectedCategory, setSelectedCategory] = useState('');  // 카테고리 상태
    const [selectedTeam, setSelectedTeam] = useState(null);  // 선택된 팀 상태
    const [articles, setArticles] = useState([]);  // 게시글 상태
    const [loading, setLoading] = useState(false);  // 로딩 상태
    const [error, setError] = useState(null);  // 오류 상태
    const [items, setItems] = useState([]);  // items 상태 (필터링된 게시글)

    // 서버에서 게시글을 가져오는 함수
    const getArticles = async (tag, item, page = 0, size = 12) => {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        const params = new URLSearchParams({
            tag: tag || "",
            item: item || "",
            page: page.toString(),
            size: size.toString(),
        });
        const url = `http://localhost:8080/api/v1/articles?${params.toString()}`;  // 쿼리 파라미터 포함한 URL

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: accessToken,
                    "Refresh-Token": refreshToken,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log("게시글 조회 결과:", result);

            // 받은 데이터를 업데이트하여 itemImage 필드 추가
            const updatedArticles = result.content.map((item) => ({
                ...item,
                // replace 는 앞 ""으로 변환하여 상대 경로로 수정
                itemImage: item.imageUrl.replace("C:\\kostafinalfrontend\\frontend-jhs\\public\\uploads\\", ""),

            }));

            setItems(updatedArticles);
            setArticles(updatedArticles);  // 여기에 setArticles 추가
            console.log("updatedArticles", updatedArticles);
            return updatedArticles;
        } catch (error) {
            console.error("게시글 조회 실패:", error);
            throw error; // 호출하는 곳에서 에러를 처리할 수 있도록
        }

    };


    // ------------------------------------------------
    // 게시글을 가져오는 함수
    const loadArticles = async (tag = "", item = "") => {
        setLoading(true);
        setError(null);
        try {
            const data = await getArticles(tag, item);
            // getArticles에서 반환된 data를 사용하여 articles 상태를 업데이트
            setArticles(data);  // 여기서는 data가 이미 updatedArticles이므로 그대로 사용
        } catch (error) {
            setError("게시글을 불러오는 데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 카테고리 클릭 시 해당 팀들 보여주는 함수
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setSelectedTeam(null);  // 카테고리 변경 시 선택된 팀 초기화
    };


    // 팀 클릭 시 해당 팀의 게시글을 보여주는 함수
    const handleTeamClick = (team) => {
        setSelectedTeam(team);
        loadArticles(`#${team}`, "itemCategory"); // 예시로 태그와 item 값을 넘겨줌
    };



    useEffect(() => {
        loadArticles(); // 초기 페이지 로드 시 전체 게시글 조회
    }, []);




    return (
        <>
            <div className="StyleMain_full_screen">
                {/* ------------------------- banner ------------------------ */}
                <div className="StyleMain_banner">STYLE,banner</div>

                {/* ------------------------- navigation ------------------------ */}
                <div className="StyleMain_navigation">
                    {Object.keys(TeamLogo).map(category => (
                        <li key={category}>
                            <a href="#" onClick={() => handleCategoryClick(category)}>
                                {category}
                            </a>
                        </li>
                    ))}
                </div>

                {/* ------------------------- keyword_search ------------------------ */}
                <div className="StyleMain_keyword_search">
                    <div className="StyleMain_search_list">
                        {selectedCategory && TeamLogo[selectedCategory].map(team => (
                            <a href="#" key={team.name} onClick={() => handleTeamClick(team.name)}>
                                <img src={team.img} alt={team.name} className="StyleMain_search_list_img" />
                                <p>
                                    {team.name.split('\n').map((line, idx) => (
                                        <React.Fragment key={idx}>
                                            {line}
                                            <br />
                                        </React.Fragment>
                                    ))}
                                </p>
                            </a>
                        ))}
                    </div>
                </div>

                {/* ------------------------ sorting ------------------------ */}
                <div className="StyleMain_sorting">
                    <span><a href="#">인기순</a></span>
                    <span><a href="#">최신순</a></span>
                </div>
            </div>

            {/* ---------------------- SNS 형식 후기글 ------------------ */}
            <div className="StyleMain_sns_container">
                {loading && <p>로딩 중...</p>}
                {error && <p>{error}</p>}

                <ul className="StyleMain_detail_page_review_list_body">
                    {articles && articles.length > 0 ? (
                        <ProfilePosts posts={articles} />
                    ) : (
                        <p>게시글이 없습니다.</p>
                    )}
                </ul>


            </div>
        </>
    );
};

export default StyleMain;
