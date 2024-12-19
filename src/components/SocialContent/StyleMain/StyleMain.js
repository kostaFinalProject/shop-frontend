import React, { useState } from "react";
import './StyleMain.css';
import ProfilePosts from "../StyleProfile/ProfilePosts.js";
import { postsData } from "../PostsData/PostsData.js";
import { TeamLogo } from "./TeamLogoData/TeamLogo.js";  // TeamLogo에서 데이터 가져오기

const StyleMain = () => {
    const [activeTab, setActiveTab] = useState('posts');
    const [selectedCategory, setSelectedCategory] = useState('');  // 카테고리 상태 추가
    const [selectedTeam, setSelectedTeam] = useState(null);  // 선택된 팀 상태 추가

    // 카테고리 클릭 시 해당 팀들 보여주는 함수
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setSelectedTeam(null);  // 카테고리 변경 시 선택된 팀 초기화
    };

    // 팀 클릭 시 해당 팀의 게시글을 보여주는 함수
    const handleTeamClick = (team) => {
        setSelectedTeam(team);
    };

    // 선택된 팀에 맞는 게시글 필터링 (예시: selectedTeam이 울산 HD FC라면 울산 관련 게시글만 표시)
    const filteredPosts = postsData.filter(post =>
        post.team === selectedTeam
    );

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
                <ul className="StyleMain_detail_page_review_list_body">
                    {selectedTeam ? (
                        <ProfilePosts posts={postsData} />
                    ) : (
                        <p>팀을 선택해주세요.</p>
                    )}
                </ul>
            </div>
        </>
    );
};

export default StyleMain;
