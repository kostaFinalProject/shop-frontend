import React, { useState, useEffect } from "react";
import './ProfileMyInterests.css';
import { Link } from 'react-router-dom';
import Masonry from 'react-masonry-css';

const ProfileMyInterests = ({ articleCollections }) => {
    const [myInterests, setMyInterests] = useState([]); // myInterests 상태 추가
    

    useEffect(() => {
        console.log("articleCollections received:", articleCollections);
    }, [articleCollections]);
    
    const breakpointColumnsObj = {
        default: 4,
        900: 3,
        500: 2,
        300: 1
    };

    // props로 받은 articleCollections 데이터를 myInterests에 설정
    useEffect(() => {
        if (articleCollections && Array.isArray(articleCollections)) {
            // 각 articleCollection 데이터에서 필요한 항목만 추출하여 myInterests에 설정
            const interests = articleCollections.map(item => ({
                articleCollectionId: item.articleCollectionId,
                articleId: item.articleId,
                content: item.content,
                img: item.imageUrl, 
                likeCount: item.likeCount,
                likeId: item.likeId,
                memberId: item.memberId,
                memberName: item.memberName,
            }));
            console.log("interests received:", interests);
            setMyInterests(interests); // 수정된 데이터로 상태 설정
        }
    }, [articleCollections]); // articleCollections이 변경될 때마다 실행

    return (
        <>
            {myInterests.length === 0 ? (
                // 저장된 게시글이 없는 경우 표시할 메시지
                <div
                    style={{
                        width: "100%",
                        height: "500px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                    }}
                >
                    저장된 게시글이 없습니다
                </div>
            ) : (
                // 저장된 게시글이 있을 경우 Masonry로 렌더링
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="ProfileMyInterests_list_body"
                    columnClassName="ProfileMyInterests_masonry_column"
                >
                    {myInterests.map((item, index) => (
                        <Link to={`/StyleDetail?articleId=${item.articleId}`} key={index}>
                            <li className="ProfileMyInterests_list_item">
                                <img
                                    src={`/uploads/${item.img}`}
                                    alt="interestData"
                                    className="ProfileMyInterests_list_item_img"
                                />
                                <span className="ProfileMyInterests_title_id">{item.memberId}</span>
                                <p className="ProfileMyInterests_MyInterests">{item.memberName}</p>
                            </li>
                        </Link>
                    ))}
                </Masonry>
            )}
        </>
    );
};

export default ProfileMyInterests;
