<template>
  <div class="home-container">
    <AsideTree
      :show="showAside"
      :currentKey="currentKey"
      :treeData="treeData"
      :outline="outline"
      @node-click="handleNodeClick"
    />
    <div
      class="page-content"
      v-loading="loading"
      element-loading-text="拼命加载中"
    >
      <i @click="showAside = !showAside" class="el-icon-s-unfold"></i>
      <div class="markdown-body" v-html="content"></div>
    </div>
    <el-backtop target=".markdown-body"></el-backtop>
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
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
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
      treeData: treeData,
      outline: []
    };
  },
  created() {
    if (this.id) {
      this.renderContent(decodeURIComponent(this.id));
    }
  },
  methods: {
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
  .page-content {
    min-width: 320px;
    flex-grow: 1;
    position: relative;
    .markdown-body {
      box-sizing: border-box;
      padding: 20px;
      height: 100%;
      scroll-behavior: smooth;
      overflow: auto;
    }
    .el-icon-s-unfold {
      position: absolute;
      left: 0;
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
}
</style>
