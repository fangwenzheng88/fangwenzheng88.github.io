<template>
  <div class="home">
    <el-container>
      <el-aside>
        <div class="tabs-layout">
          <el-tabs type="card" v-model="activeName">
            <el-tab-pane label="目录" name="1"></el-tab-pane>
            <el-tab-pane label="大纲" name="2"></el-tab-pane>
          </el-tabs>
        </div>
        <div v-if="activeName === '1'">
          <div class="search-layout">
            <el-input
              placeholder="输入关键字进行过滤"
              clearable
              v-model="filterText"
            ></el-input>
          </div>
          <el-tree
            class="filter-tree"
            :data="treeData"
            node-key="id"
            highlight-current
            :current-node-key="currentKey"
            default-expand-all
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
            ref="tree"
          ></el-tree>
        </div>
        <ul class="outline-layout" v-else>
          <li
            v-for="(item, index) in outline"
            :key="index"
            class="outline-item"
            :class="'outline-level-' + item.level"
          >
            <a :href="item.link">{{ item.title }}</a>
          </li>
        </ul>
      </el-aside>
      <el-main v-loading="loading" element-loading-text="拼命加载中">
        <div class="markdown-body" v-html="content"></div>
      </el-main>
    </el-container>
    <el-backtop target=".el-main"></el-backtop>
  </div>
</template>

<script>
import axios from 'axios';
import marked from 'marked';
import hljs from 'highlight.js';
var renderer = new marked.Renderer();
(renderer.heading = function(text, level) {
  var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
  return `
    <h${level}>
      <a class="anchor" name="${escapedText}" href="#${escapedText}">
        <span class="header-link"></span>
      </a>
      <span>${text}</span>
    </h${level}>
    `;
}),
  marked.setOptions({
    renderer,
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: false,
    smartLists: true,
    smartypants: true,
    highlight: function(code) {
      return hljs.highlightAuto(code).value;
    }
  });

export default {
  name: 'Home',
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  props: {
    id: String
  },
  data() {
    return {
      activeName: '1',
      filterText: '',
      currentKey: this.id,
      treeData: require('/tree.json'),
      content: '',
      loading: false,
      outline: []
    };
  },
  created() {
    if (this.id) {
      this.renderContent(decodeURIComponent(this.id));
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
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
      console.log(data);
      if (data.isLeaf) {
        this.currentKey = data.id;
        this.renderContent(data.path);
        this.$router.push(`/article/${encodeURIComponent(data.path)}`);
      }
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
.el-container {
  height: 100vh;
  min-height: 500px;
  @media screen and (max-width: 400px) {
    .el-aside {
      display: none;
    }
  }
  .el-aside {
    padding: 0 20px;
    resize: horizontal;
    .tabs-layout {
      position: sticky;
      top: 0;
      z-index: 5;
      padding-top: 20px;
      background-color: #fff;
    }
    .search-layout {
      position: sticky;
      top: 76px;
      z-index: 5;
    }
  }
  .el-main {
    min-width: 320px;
  }

  .outline-layout {
    font-size: 14px;
    a {
      color: #333;
    }
    .outline-item {
      line-height: 2;
      &.outline-level-2 {
        padding-left: 16px;
      }
      &.outline-level-3 {
        padding-left: 32px;
      }
      &.outline-level-4 {
        padding-left: 48px;
      }
      &.outline-level-5 {
        padding-left: 64px;
      }
      &.outline-level-6 {
        padding-left: 80px;
      }
    }
  }
}
</style>
