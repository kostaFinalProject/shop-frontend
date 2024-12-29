import React, { useState, useEffect } from "react";
import './ProfileTags.css';
import { Link } from 'react-router-dom';

const ProfileTags = ({ headers, profile }) => {
    const [item, setItem] = useState(null);

    const isPrivateAccount = profile.memberStatus === "PRIVATE" && profile.follow === "Not Follow";

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
        return <div className="ProfileTags_private_account_message">
          비공개 계정입니다.
          </div>;
    }
    if (!item) {
        return <div>Loading...</div>;
    }

    return (
        <>
          <div className="ProfileTags_container">
            <ul className="ProfileTags_list_body">
              {item.length === 0 ? (
                <div className="ProfileTags_private_account_message">
                  등록된 상품 태그가 없습니다.
                </div>
              ) : (
                item.map((item) => (
                  <Link to={`/DetailPage?itemId=${item.itemId}`} key={item.itemId}>
                    <li className="ProfileTags_list_item">
                      <div className="ProfileTags_list_item_img">
                        <img src={`/uploads/${item.imageUrl}`} alt="tag" />
                      </div>
                      <div className="ProfileTags_content">
                        <div className="ProfileTags_title">
                          <span className="ProfileTags_title_id">
                            {item.itemName}
                          </span>
                        </div>
                      </div>
                    </li>
                  </Link>
                ))
              )}
            </ul>
          </div>
        </>
      );
      
};

export default ProfileTags;
