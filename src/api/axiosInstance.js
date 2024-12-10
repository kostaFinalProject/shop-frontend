// src/api/axiosInstance.js
import axios from "axios";

// 토큰 저장소 (로컬 스토리지 또는 상태 관리 라이브러리 사용 가능)
const getAccessToken = () => localStorage.getItem("access_token");
const getRefreshToken = () => localStorage.getItem("refresh_token");

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// 요청 인터셉터 추가: Authorization 헤더 설정
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        const refreshToken = getRefreshToken();
        if (refreshToken) {
            config.headers["Refresh-Token"] = refreshToken;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 추가: 토큰 갱신 처리
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Refresh Token으로 Access Token 갱신
                const refreshResponse = await axiosInstance.post("/auth/refresh-token", {
                    refreshToken: getRefreshToken(),
                });

                const newAccessToken = refreshResponse.data.accessToken;
                localStorage.setItem("access_token", newAccessToken);

                // 갱신된 토큰으로 요청 재시도
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error("토큰 갱신 실패:", refreshError);
                // 로그아웃 처리 또는 사용자 알림
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/login"; // 로그인 페이지로 이동
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
