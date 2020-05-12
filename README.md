# gmweb

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


### 说明方法
```
this.$smoke_get(`/api`+`${media_info}`).then(res => {
    console.log(res.data);
})
```

<el-submenu v-for="(item,index) in $store.state.userMenuList" :key="index" :index="`${item.menuComponent}`">
  <template slot="title">
    <i :class="item.icon"></i>
    <span>{{item.name}}</span>
  </template>
    <el-menu-item 
      v-for="(res,num) in item.includeSubsetList"
      :key="num"
      :index="`${res.menuComponent}`" 
      @click="active_router(item)"
    >{{num.name}}
    </el-menu-item>
</el-submenu>

this.$forceUpdate(); 强制刷新

@keyup.enter.native="name_search"  标签内添加回车事件

el-autocomplete的一个坑，el-autocomplete显示的时候必须有value字段，可以在返回的对象里面手动添加一个value属性，item.value = item.name;

this.$nextTick(() => {
  this.$refs['ruleForm'].resetFields();
})    重置表单