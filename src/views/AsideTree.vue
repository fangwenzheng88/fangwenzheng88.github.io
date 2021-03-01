<template>
  <div class="aside-tree-container" :style="asideStyle">
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
        :default-expanded-keys="defaultExpandedKeys"
        :filter-node-method="filterNode"
        @node-click="handleNodeClick"
        ref="tree"
      >
        <span class="custom-tree-node" slot-scope="{ node }">
          <span v-if="node.isLeaf"><i class="el-icon-document"></i></span>
          <span v-else><i class="el-icon-folder"></i></span>
          <span>&nbsp;{{ node.label }}</span>
          <span v-if="!node.isLeaf">&nbsp;({{ node.childNodes.length }})</span>
        </span>
      </el-tree>
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
  </div>
</template>

<script>
export default {
  name: 'AsideTree',
  props: {
    show: {
      type: Boolean,
      required: false,
      default: true
    },
    treeData: {
      type: Array,
      required: true
    },
    outline: {
      type: Array,
      required: true
    },
    currentKey: {
      type: [Number, String],
      required: true
    }
  },
  computed: {
    asideStyle() {
      if (!this.show) {
        return {
          marginLeft: '-' + this.$el.offsetWidth + 'px'
        };
      } else {
        return null;
      }
    }
  },
  data() {
    return {
      activeName: '1',
      filterText: '',
      defaultExpandedKeys: this.treeData.map((item) => {
        return item.id;
      })
    };
  },
  methods: {
    resize(e) {
      console.log('resize', e);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      console.log(data);
      if (data.isLeaf) {
        this.$emit('node-click', data);
      }
    }
  }
};
</script>

<style scoped lang="less">
.aside-tree-container {
  position: relative;
  resize: horizontal;
  width: 300px;
  transition: margin-left 500ms;
  box-sizing: border-box;
  flex-grow: 0;
  flex-shrink: 0;
  border: 1px solid #f6f8fa;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 20px 20px 20px;
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
  .el-tree {
    font-size: 14px;
    color: #333;
  }
}
.outline-layout {
  list-style: none;
  padding: 0%;
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
</style>
