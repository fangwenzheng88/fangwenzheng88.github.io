<template>
  <div class="home-container">
    <div class="subnav" ref="subnav" :style="asideStyle">
      <AsideTree
        :show="showAside"
        :currentKey="currentKey"
        :treeData="treeData"
        :outline="outline"
        @node-click="handleNodeClick"
        @login="login"
      />
      <i @click="showAside = !showAside" class="el-icon-s-unfold"></i>
    </div>
    <div
      class="page-content"
      v-loading="loading"
      element-loading-text="拼命加载中"
    >
      <div class="markdown-body" v-html="content"></div>
    </div>
    <el-backtop target=".page-content"></el-backtop>
  </div>
</template>

<script>
import axios from 'axios';
import marked from './marked';
import AsideTree from './AsideTree';
import treeData from '/tree.json';
export default {
  name: 'Home',
  components: {
    AsideTree
  },
  props: {
    id: String
  },
  data() {
    var w =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    let isPC = true;
    if (w <= 414) {
      isPC = false;
    }
    return {
      isPC,
      showAside: true,
      content: '',
      loading: false,
      currentKey: this.id,
      haspermission: false,
      outline: []
    };
  },
  computed: {
    asideStyle() {
      if (!this.showAside) {
        return {
          marginLeft: '-' + this.$refs.subnav.offsetWidth + 'px'
        };
      } else {
        return null;
      }
    },
    treeData() {
      let _treeData = treeData;
      if (!this.haspermission) {
        _treeData = filterNode(_treeData);
      }
      return _treeData;

      function filterNode(list) {
        let _list = list.filter((item) => {
          if (item.label.startsWith('_')) {
            return false;
          } else {
            if (item.children && item.children.length > 0) {
              return filterNode(item.children);
            }
            return true;
          }
        });
        return _list;
      }
    }
  },
  created() {
    if (this.id) {
      this.renderContent(decodeURIComponent(this.id));
    }
    if (localStorage.getItem('account') === 'admin') {
      this.haspermission = true;
    }
  },
  methods: {
    login() {
      this.$prompt('请输入账户', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          if (value === 'admin') {
            this.haspermission = true;
            localStorage.setItem('account', value);
          }
        })
        .catch(() => {});
    },
    renderContent(path) {
      this.loading = true;
      this.content = '';
      axios
        .get(path)
        .then((response) => {
          console.log(response);
          this.content = marked(response.data);
          this.$nextTick(function() {
            this.loading = false;
            this.outline = this.getTitle();
            console.log(this.outline);
          });
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleNodeClick(data) {
      if (!this.isPC) {
        this.showAside = false;
      }
      this.currentKey = data.id;
      this.renderContent(data.path);
      this.$router.push(`/article/${encodeURIComponent(data.path)}`);
    },
    getTitle() {
      let nav = [];
      document.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach((item) => {
        const level = item.nodeName.substring(1);
        let a = item.querySelector('a');
        let link = '';
        if (a) {
          link = a.href;
        }
        nav.push({
          title: item.innerText,
          level: level,
          link: link
        });
      });
      return nav;
    }
  }
};
</script>

<style lang="less">
.home-container {
  height: 100vh;
  min-height: 500px;
  display: flex;
  .subnav {
    position: relative;
    transition: margin-left 500ms;
    .el-icon-s-unfold {
      position: absolute;
      right: -24px;
      top: 50%;
      z-index: 999;
      font-size: 16px;
      padding: 8px 8px 8px 0;
      border-top-right-radius: 50%;
      border-bottom-right-radius: 50%;
      background-color: #f6f8fa;
      color: #c1c1c1;
    }
  }
  .page-content {
    flex-grow: 1;
    position: relative;
    min-width: 320px;
    overflow: auto;
    padding: 20px;
    scroll-behavior: smooth;
    .markdown-body {
      box-sizing: border-box;
      padding-bottom: 60px;
    }
  }
}
</style>
