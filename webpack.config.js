const path = require('path');

module.exports = {
    entry: './src/index.js', // 진입점 파일
    output: {
        path: path.resolve(__dirname, 'dist'), // 출력 디렉토리
        filename: 'bundle.js', // 출력 파일 이름
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/, // .js 또는 .jsx 파일에 대해
                exclude: /node_modules/, // node_modules 폴더 제외
                use: {
                    loader: 'babel-loader', // babel-loader 사용
                },
            },
            {
                test: /\.css$/, // .css 파일에 대해
                use: ['style-loader', 'css-loader'], // CSS 로더 사용
            },
            {
                test: /\.(png|jpg|gif|svg)$/, // 이미지 파일에 대해
                use: {
                    loader: 'file-loader', // 파일 로더 사용
                    options: {
                        name: '[path][name].[ext]', // 파일 이름 설정
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'], // 확장자 설정
    },
    devtool: 'source-map', // 소스 맵 설정
    devServer: {
        contentBase: path.join(__dirname, 'dist'), // 개발 서버의 콘텐츠 베이스
        compress: true,
        port: 9000, // 개발 서버 포트
    },
};