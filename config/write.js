const fs = require('fs');
const path = require('path');
// 将每个元素逐行写入 .md 文件
module.exports = async (outputArr, name) => {
    const outputPath = path.join(name + '.tr.md');
    const stream = fs.createWriteStream(outputPath);
    outputArr.forEach((line) => {
        stream.write(line + '\n');
    });

    stream.end();
    return "文件写入成功";
};

