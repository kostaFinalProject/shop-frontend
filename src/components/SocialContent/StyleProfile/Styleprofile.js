import React, { useState } from "react";
import './Styleprofile.css';
import ProfileDiv from "./ProfileDiv.js";
import ProfilePosts from './ProfilePosts.js';
import ProfileTags from './ProfileTags.js';

//data 가져오기
import { postsData } from "../PostsData/PostsData.js";
import { tagsData } from "../PostsData/TagsData.js";

const Styleprofile = () => {
    const [activeTab, setActiveTab] = useState('posts');

    return (
        <>
            <div className="Styleprofile_full_screen">
                {/* ------------------------- profile------------------------  */}
                <ProfileDiv />
                {/* -----------------------postlist,taglist ------------------------ */}
                {/* 게시글, 태그상품 탭 */}
                <div className="Styleprofile_post_tag">
                    <span
                        className={`Styleprofile_postlist ${activeTab === 'posts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('posts')}
                    >
                        게시글
                        <span>465</span>
                    </span>

                    <span
                        className={`Styleprofile_taglist ${activeTab === 'tags' ? 'active' : ''}`}
                        onClick={() => setActiveTab('tags')}
                    >
                        태그상품
                        <span>96</span>
                    </span>
                </div>

                {/* 탭에 따라 컴포넌트 렌더링 */}
                <div className="Styleprofile_sns_container">
                    {activeTab === 'posts' ? <ProfilePosts posts={postsData} /> : <ProfileTags tags={tagsData} />}
                </div>

            </div>
        </>
    );
};
export default Styleprofile;
