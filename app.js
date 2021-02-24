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
      data.push({
        id: filePath,
        label: item,
        isLeaf: true,
        path: filePath,
        children: []
      }); // 存放在files数组中
    } else {
      // 如果不是一个文件
      let treeNode = {
        id: filePath,
        label: item,
        isLeaf: false,
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
tree(data, './public/docs', 1);
console.log(JSON.stringify(data));
fs.writeFileSync('./tree.json', JSON.stringify(data));
