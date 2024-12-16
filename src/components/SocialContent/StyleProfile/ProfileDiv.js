import './ProfileDiv.css';

const ProfileDiv = ({ headers, profile, setProfile }) => {
    if (!profile) {
        return <div>Loading...</div>;
    }

    const handleFollowToggle = async () => {
        try {
            if (profile.follow === "Followed") {
                // 언팔로우 요청
                const response = await fetch(
                    `http://localhost:8080/api/v1/followers/${profile.followerId}`,
                    {
                        method: "DELETE",
                        headers: headers,
                    }
                );
    
                if (response.ok) {
                    // 언팔로우 성공 시 상태 업데이트
                    setProfile((prevProfile) => ({
                        ...prevProfile,
                        follow: "Not Follow", // 상태 변경
                        followeeCount: prevProfile.followeeCount - 1, // 팔로워 수 감소
                        followerId: null, // followerId 제거
                    }));
                    alert("언팔로우 되었습니다.");
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "언팔로우 요청 실패");
                }
            } else {
                // 팔로우 요청
                const response = await fetch(
                    `http://localhost:8080/api/v1/followers/${profile.memberId}`,
                    {
                        method: "POST",
                        headers: headers,
                    }
                );
    
                if (response.ok) {
                    const data = await response.json(); // 서버 응답 데이터
    
                    // 팔로우 성공 시 상태 업데이트
                    setProfile((prevProfile) => ({
                        ...prevProfile,
                        follow: "Followed", // 상태 변경
                        followeeCount: prevProfile.followeeCount + 1, // 팔로워 수 증가
                        followerId: data.followerId, // 서버에서 받은 followerId 반영
                    }));
                    alert("팔로우 요청을 보냈습니다.");
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "팔로우 요청 실패");
                }
            }
        } catch (error) {
            console.error("팔로우/언팔로우 요청 에러:", error);
            alert("요청 중 문제가 발생했습니다. 다시 시도해주세요.");
        }
    };    

    return (
        <div className="Styleprofile_profile">
            <div className="Styleprofile_profile_img">
                <img src={profile.memberProfileImageUrl} alt="Profile" />
            </div>

            <div className="Styleprofile_profile_text">
                <div className="Styleprofile_profile_head">
                    <span className="Styleprofile_profile_nickname">{profile.memberNickname}</span>
                    <button
                        className="Styleprofile_follow_btn"
                        onClick={handleFollowToggle}
                        style={{
                            backgroundColor: profile.follow === "Followed" ? "blue" : "black",
                            color: "white",
                        }}
                        hidden={profile.follow === "Me"} // "Me"일 때 버튼 숨기기
                    >
                        {profile.follow === "Followed" ? "언팔로우" : "팔로우"}
                    </button>
                </div>

                <div className="Styleprofile_follow_following">
                    <div className="Styleprofile_follow">
                        <a href="#">팔로워</a>
                        <span>{profile.followeeCount}</span>
                    </div>
                    <div className="Styleprofile_following">
                        <a href="#">팔로잉</a>
                        <span>{profile.followerCount}</span>
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
