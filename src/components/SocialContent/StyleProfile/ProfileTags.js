import React, { useState, useEffect } from "react";
import './ProfileTags.css';
import { Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";

const ProfileTags = ({ headers, profile }) => {
    const [item, setItem] = useState(null);

    // 비공개 계정 여부 판단
    const isPrivateAccount = profile.memberStatus === "PRIVATE" && profile.followerId === null;

    useEffect(() => {
        if (!isPrivateAccount) {
            const fetchData = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/api/v1/members/items/${profile.memberId}`, {
                        method: "GET",
                        headers: headers, // 상위에서 전달받은 인증 헤더 사용
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const processedData = data.content.map((item) => ({
                            itemId: item.itemId,
                            itemName: item.itemName,
                            imageUrl: item.imageUrl.replace("C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\","")
                        }));
                        setItem(processedData);
                    } else {
                        console.error("Error fetching posts:", response.statusText);
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };

            fetchData();
        }
    }, [isPrivateAccount, profile.memberId, headers]);

    if (isPrivateAccount) {
        return (
            <div className="private-account-message">비공개 계정입니다.</div>
        );
    }

    if (!item) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="Styleprofile_sns_container">
                <ul className="Styleprofile_detail_page_review_list_body">
                    {item.map((item) => (
                        <Link to={`/DetailPage?itemId=${item.itemId}`} key={item.itemId}>
                            <li className="Styleprofile_detail_page_review_list_item">
                                <div className="Styleprofile_detail_page_review_list_item_img">
                                    <img src={`/uploads/${item.imageUrl}`} alt="tag" />
                                </div>
                                <div className="Styleprofile_detail_page_review_content">
                                    <div className="Styleprofile_detail_page_review_title">
                                        <span className="Styleprofile_detail_page_review_title_id">{item.itemName}</span>
                                    </div>
                                </div>
                            </li>
                        </Link>

                    ))}
                </ul>
            </div></>

    );
};

export default ProfileTags;
