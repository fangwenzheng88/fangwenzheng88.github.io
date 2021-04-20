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
          path: filePath
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
      data.sort(SortLikeWin);
      let nexttarget = path.join(target, item); // 拼接文件夹的绝对路径 目的：以当前文件夹为目录
      let nextdeep = deep + 1;
      tree(treeNode.children, nexttarget, nextdeep); // 再次调用tree函数  替换参数
    }
  });
}
let data = [];
console.log('#########开始生成./public/docs文档目录');
tree(data, './public/docs', 1);
function loopTree(data, parent) {
  data.forEach((item, index) => {
    if (item.children instanceof Array && item.children.length === 0) {
      parent && parent.children.splice(index, 1);
    }

    item.children &&
      item.children.length > 0 &&
      loopTree(item.children, item, index);
  });

  return data;
}
data = loopTree(data);
data = loopTree(data);
data = loopTree(data);
data = loopTree(data);
data = loopTree(data);
data = loopTree(data);
data = loopTree(data);
data = loopTree(data);
data = loopTree(data);
data = loopTree(data);
data = loopTree(data);
data = loopTree(data);
fs.writeFileSync('./tree.json', JSON.stringify(data));
console.log('#########./tree.json文档目录生成结束');

function SortLikeWin(v1, v2) {
  var a = v1.label;
  var b = v2.label;
  var reg = /[0-9]+/g;
  var lista = a.match(reg);
  var listb = b.match(reg);
  if (!lista || !listb) {
    return a.localeCompare(b);
  }
  for (
    var i = 0, minLen = Math.min(lista.length, listb.length);
    i < minLen;
    i++
  ) {
    //数字所在位置序号
    var indexa = a.indexOf(lista[i]);
    var indexb = b.indexOf(listb[i]);
    //数字前面的前缀
    var prefixa = a.substring(0, indexa);
    var prefixb = b.substring(0, indexb);
    //数字的string
    var stra = lista[i];
    var strb = listb[i];
    //数字的值
    var numa = parseInt(stra);
    var numb = parseInt(strb);
    //如果数字的序号不等或前缀不等，属于前缀不同的情况，直接比较
    if (indexa != indexb || prefixa != prefixb) {
      return a.localeCompare(b);
    } else {
      //数字的string全等
      if (stra === strb) {
        //如果是最后一个数字，比较数字的后缀
        if (i == minLen - 1) {
          return a.substring(indexa).localeCompare(b.substring(indexb));
        }
        //如果不是最后一个数字，则循环跳转到下一个数字，并去掉前面相同的部分
        else {
          a = a.substring(indexa + stra.length);
          b = b.substring(indexa + stra.length);
        }
      }
      //如果数字的string不全等，但值相等
      else if (numa == numb) {
        //直接比较数字前缀0的个数，多的更小
        return strb.lastIndexOf(numb + '') - stra.lastIndexOf(numa + '');
      } else {
        //如果数字不等，直接比较数字大小
        return numa - numb;
      }
    }
  }
}
