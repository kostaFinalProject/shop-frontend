import './ProfileDiv.css';

const ProfileDiv = ({ headers, profile }) => {
    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div className="Styleprofile_profile">
            <div className="Styleprofile_profile_img">
                <img src={profile.memberProfileImageUrl} alt="Profile" />
            </div>

            <div className="Styleprofile_profile_text">
                <div className="Styleprofile_profile_head">
                    <span className="Styleprofile_profile_nickname">{profile.memberNickname}</span>
                    <button className="Styleprofile_follow_btn">
                        {profile.followerId ? "팔로우 취소" : "팔로우"}
                    </button>
                </div>

                <div className="Styleprofile_follow_following">
                    <div className="Styleprofile_follow">
                        <a href="#">팔로워</a>
                        <span>{profile.followerCount}</span>
                    </div>
                    <div className="Styleprofile_following">
                        <a href="#">팔로잉</a>
                        <span>{profile.followeeCount}</span>
                    </div>
                </div>

                <div className="Styleprofile_profile_information">
                    <p>{profile.memberIntroduction}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfileDiv;
