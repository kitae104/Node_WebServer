const path = require('path');

module.exports = path.dirname(require.main.filename); // require.main.filename : 메인 파일의 경로를 반환