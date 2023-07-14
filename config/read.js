const readline = require("readline");
const fs = require("fs");
const path = require("path");
const writer = require("./write");

// 读取文件
module.exports = async (dir, name, extra) => {
  let outArr = [];
  let allArr = [];
  const filePath = path.join(__dirname, "..", "..", "ctd", "md", dir, name);
  // 创建可读流
  const stream = fs.createReadStream(filePath);
  // 创建逐行读取的接口
  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity, // 保留换行符
  });

  // 逐行读取文件内容
  rl.on('line', (line) => {
    allArr.push(line);
  });

  // 读取完成时触发的事件
  rl.on("close", () => {
    console.log(allArr.length);
    let data = writer(allArr, dir,name);
    console.log(data);
  });

  return "请查看" + filePath + ".tf.md";
};


