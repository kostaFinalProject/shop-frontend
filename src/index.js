import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("root"); // index.html 파일에서 "root" div 요소를 찾음
const root = ReactDOM.createRoot(rootElement);

root.render(
    // <React.StrictMode>
    <App />  /*{ App 컴포넌트 렌더링 }*/
  // </React.StrictMode>

);
