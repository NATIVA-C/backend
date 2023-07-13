const readline = require("readline");
const fs = require("fs");
const path = require("path");

// 去除空格
const removeBlock = (txt) => {
  if (txt && typeof txt === "string") {
    return txt.replace(/[\t|\n]*/gi, "");
  } else {
    return txt;
  }
};

// crawl
module.exports = async (dir, name, extra) => {
  // 获取网源的页面内容
  // let crawlUrl = "https://search.jd.com/Search?keyword=" + keyword;
  // // 解析页面内容 cheerio 类似于jquery
  // const $ = cheerio.load(data);
  // let arr = []; // 存储列表
  // 读取文件的路径
  // const filePath = "path/to/your/name.md";
  // 读取文件的相对路径
  console.log(__dirname);
  const filePath = path.join(__dirname, '..', '..','ctd','md',dir, name);
  console.log(filePath);
  //   // 创建可读流
  //   const stream = fs.createReadStream(filePath);

  //   // 创建逐行读取的接口
  //   const rl = readline.createInterface({
  //     input: stream,
  //     crlfDelay: Infinity, // 保留换行符
  //   });

  //   // 逐行读取文件内容
  //   rl.on("line", (line) => {
  //     console.log(line); // 在这里处理每行的内容
  //   });

  //   // 读取完成时触发的事件
  //   rl.on("close", () => {
  //     console.log("文件读取完成");
  //   });

  return "over" + extra + name + dir;
};
