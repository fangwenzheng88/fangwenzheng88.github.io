<template>
  <div class="home">
    <el-container>
      <el-aside>
        <el-tabs type="card">
          <el-tab-pane label="目录">
            <el-input
              placeholder="输入关键字进行过滤"
              clearable
              v-model="filterText"
            ></el-input>
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
          </el-tab-pane>
          <el-tab-pane label="大纲">
            <ul class="outline-layout">
              <li
                v-for="(item, index) in outline"
                :key="index"
                class="outline-item"
                :class="'outline-level-' + item.level"
              >
                <a :href="item.link">{{ item.title }}</a>
              </li>
            </ul>
          </el-tab-pane>
        </el-tabs>
      </el-aside>
      <el-main v-loading="loading">
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
      <a data-name="${text}" class="anchor" name="${escapedText}" href="#${escapedText}" data-level="${level}">
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
      axios.get(path).then((response) => {
        console.log(response);
        this.content = marked(response.data);
        this.$nextTick(function() {
          this.outline = this.getTitle();
          console.log(this.outline);
        });
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
      /* content.replace(/(#+)[^#][^\n]*?(?:\n)/g, function(match, m1) {
        let title = match.replace('\n', '');
        let level = m1.length;
        nav.push({
          title: title.replace(/^#+/, '').replace(/\([^)]*?\)/, ''),
          level: level,
          link: '#' + title.replace(/^#+/, '').trim()
        });
      }); */
      let nav = [];
      document.querySelectorAll('h1,h2').forEach((item) => {
        let a = item.querySelector('a');
        nav.push({
          title: a.dataset.name,
          level: a.dataset.level,
          link: a.href
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
  min-height: 800px;
  @media screen and (max-width: 400px) {
    .el-aside {
      display: none;
    }
  }
  .el-aside {
    padding: 20px;
    resize: horizontal;
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
