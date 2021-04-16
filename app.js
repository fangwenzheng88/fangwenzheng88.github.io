const fs = require('fs');
const path = require('path');
function tree(data, target, deep) {
  let infos = fs.readdirSync(target); // 读取当前文件目录

  infos.forEach((item) => {
    let tmpdir = path.join(target, item); //拼接文件的绝对路径
    let stat = fs.statSync(tmpdir); // 获取文件的状态
    let filePath = tmpdir
      .split(path.sep)
      .join('/')
      .replace(/^public/, '');
    if (stat.isFile()) {
      // 如果是一个文件
      if (/(\.md|\.html|\.htm)$/.test(filePath)) {
        data.push({
          id: filePath,
          label: item,
          isFile: true,
          level: deep,
          path: filePath,
          children: []
        }); // 存放在files数组中
      }
    } else {
      // 如果不是一个文件
      let treeNode = {
        id: filePath,
        label: item,
        isFile: false,
        level: deep,
        path: filePath,
        children: []
      };
      data.push(treeNode); // 存放在dirs数组中
      let nexttarget = path.join(target, item); // 拼接文件夹的绝对路径 目的：以当前文件夹为目录
      let nextdeep = deep + 1;
      tree(treeNode.children, nexttarget, nextdeep); // 再次调用tree函数  替换参数
    }
  });
}
let data = [];
console.log('#########开始生成./public/docs文档目录');
tree(data, './public/docs', 1);
fs.writeFileSync('./tree.json', JSON.stringify(data));
console.log('#########./tree.json文档目录生成结束');
