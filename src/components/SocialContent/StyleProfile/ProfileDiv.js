import React from "react";
import './ProfileDiv.css';

const ProfileDiv = () => {
    return (
        <>

            <div className="Styleprofile_profile">
                <div className="Styleprofile_profile_img">
                    <img src="https://fakeimg.pl/150x150/" alt="" />
                </div>

                <div className="Styleprofile_profile_text">

                    <div className="Styleprofile_profile_head">
                        <span className="Styleprofile_profile_nickname">j___c_y</span>
                        <button className="Styleprofile_follow_btn">팔로우</button>
                    </div>

                    <div className="Styleprofile_follow_following">
                        <div className="Styleprofile_follow">
                            <a href="#">follow</a>
                            <span>1,327</span>
                        </div>
                        <div className="Styleprofile_following">
                            <a href="#">팔로잉</a>
                            <span>327</span>

                        </div>
                    </div>

                    <div className="Styleprofile_profile_information">
                        <p>jco0807</p>
                        <p>@j___c_y</p>
                    </div>
                </div>
            </div>

        </>

    )
}

export default ProfileDiv;