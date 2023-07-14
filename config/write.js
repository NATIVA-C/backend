const fs = require('fs');
const path = require('path');

// 将每个元素逐行写入 .md 文件
module.exports = async (allArr, filePath,name) => {
    let outPutArr = [];
    for (let i = 0; i < allArr.length; i++) {
        let txt = allArr[i];
        //regex_Logo_1
        if (regex_Logo_1(txt)) {
            outPutArr.push("## " + name.replace(".md",""));
            continue;
        }


        outPutArr.push(txt);
    }

    console.log("-------------------------------");
    console.log(outPutArr.length);

    const outputPath = path.join(filePath + '.tr.md');
    const stream = fs.createWriteStream(outputPath);
    outPutArr.forEach((line) => {
        stream.write(line + '\n');
    });

    stream.end();
    return "文件写入成功";
};

// 匹配logo
const regex_Logo_1 = (txt) => {
    const regex = /\!\[ExamTopics Logo\]\((.*?)\)/;
    const matches = txt.match(regex);

    if (matches) {
        return true;
    } else {
        return false;
    }
};

const regex_tile_2 = (txt) => {
    const regex = /\!\[ExamTopics Logo\]\((.*?)\)/;
    const matches = txt.match(regex);

    if (matches) {
        const link = matches[1];
    }
    // else {
    //   console.log('未找到匹配项.');
    // }
};
