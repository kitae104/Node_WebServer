const fs = require('fs'); // 파일 시스템 모듈을 가져옴

const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {  // 파일 삭제
        if (err) {
            throw err;
        }
    });
}

exports.deleteFile = deleteFile; // deleteFile 함수를 내보냄