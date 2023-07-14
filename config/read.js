const readline = require("readline");
const fs = require("fs");
const path = require("path");
const writer = require("./write");
const preArr = [];
const allArr = [];

const insertData = (data) => {
  preArr.push(data); // 插入新数据
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

// 读取文件
module.exports = async (dir, name, extra) => {
  let outArr = [];
  const filePath = path.join(__dirname, "..", "..", "ctd", "md", dir, name);
  // 创建可读流
  const stream = fs.createReadStream(filePath);
  // 创建逐行读取的接口
  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity, // 保留换行符
  });

  // 逐行读取文件内容
  rl.on("line", (line) => {
    //每行保留到内存
    allArr.push(line);
    //regex_Logo_1
    if (regex_Logo_1(line)) {
      outArr.push("## " + name);
      insertData(line);
    }
  });

  // 读取完成时触发的事件
  rl.on("close", () => {
    let data = writer(outArr, filePath);
    console.log(data);
  });
  return "请查看" + filePath + ".tf.md";
};


