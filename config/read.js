const readline = require("readline");
const fs = require("fs");
const path = require("path");
const amazonWriter = require("./amazonWrite");
const microsoftWriter = require("./microsofWrite");

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

  let data = '';
  // 读取完成时触发的事件
  rl.on("close", () => {
    switch (dir) {
      case 'Amazon':
        // 执行 Amazon 相关操作
        console.log('原来有:');
        console.log(allArr.length);
        data = amazonWriter(allArr, dir,name);
        console.log(data);
        break;
      case 'Microsoft':
        // 执行 Microsoft 相关操作
        console.log('原来有:');
        console.log(allArr.length);
        data = microsoftWriter(allArr, dir,name);
        console.log(data);
        break;
      case 'LIP':
        // 执行 LIP 相关操作
        console.log('执行 LIP 相关操作');
        break;
      default:
        // 未知项目
        console.log('未知项目');
        break;
    }
  });
  
  return "请查看" + filePath + ".tf.md";
};


