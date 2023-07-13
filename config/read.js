const readline = require("readline");
const fs = require("fs");
const path = require("path");

// 去除空格
const regex_Logo_1 = (txt) => {
  const regex = /\!\[ExamTopics Logo\]\((.*?)\)/;
  const matches = txt.match(regex);

  if (matches) {
    return true;
  } else {
    return false;
  }
};

const regex_Logo_2 = (txt) => {
  const regex = /\!\[ExamTopics Logo\]\((.*?)\)/;
  const matches = txt.match(regex);

  if (matches) {
    const link = matches[1];
  }
  // else {
  //   console.log('未找到匹配项.');
  // }
};

// crawl
module.exports = async (dir, name, extra) => {
  let arr = []; 
  let preArr = [];
  
  const filePath = path.join(__dirname, "..", "..", "ctd", "md", dir, name);
  // 创建可读流
  const stream = fs.createReadStream(filePath);
  // 创建逐行读取的接口
  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity, // 保留换行符
  });
  const outArr = [];
  // 逐行读取文件内容
  rl.on("line", (line) => {
    if (regex_Logo_1(line)) {
      console.log("aa");
      outArr.push("## " + name);
      preArr.push(line);
    }

    // console.log(line); // 在这里处理每行的内容
    if (line != null) {
      arr.push(line);
    }
  });

  // 读取完成时触发的事件
  rl.on("close", () => {
    fileOutput(outArr);
    console.log("文件读取完成");
  });
  return "over" + extra + name + dir;
};

const fileOutput = (outArr) => {
  // 遍历列表
  outArr.forEach((item) => {
    console.log(item);
  });
};
