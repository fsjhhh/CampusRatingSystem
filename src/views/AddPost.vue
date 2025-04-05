<template>
  <div class="add-post-page">
    <div class="page-header">
      <h1>添加新评分对象</h1>
      <p>您可以在这里添加新的评分对象</p>
    </div>
    
    <el-card class="form-card">
      <el-form :model="form" label-width="120px" :rules="rules" ref="addPostForm">
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio label="course">课程</el-radio>
            <el-radio label="food">外卖</el-radio>
            <el-radio label="goods">生活用品</el-radio>
            <el-radio label="custom">自定义类别</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="自定义类别" prop="customType" v-if="form.type === 'custom'">
          <el-input v-model="form.customType" placeholder="输入新的类别名称"></el-input>
        </el-form-item>
        
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="输入评分对象名称"></el-input>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="submitForm">添加</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <el-card class="post-types-card" v-if="hasCustomTypes">
      <h3>自定义分类列表</h3>
      <el-table :data="customTypes" style="width: 100%">
        <el-table-column prop="type" label="分类名称"></el-table-column>
        <el-table-column prop="count" label="对象数量"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="viewCategory(scope.row.type)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import store from '@/store';

export default {
  name: 'AddPostView',
  data() {
    return {
      form: {
        type: 'course',
        customType: '',
        name: ''
      },
      rules: {
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        customType: [
          { required: true, message: '请输入自定义类别名称', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入评分对象名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    customTypes() {
      const types = Object.keys(store.state.posts).filter(type => 
        !['course', 'food', 'goods'].includes(type)
      );
      
      return types.map(type => ({
        type,
        count: store.state.posts[type].length
      }));
    },
    hasCustomTypes() {
      return this.customTypes.length > 0;
    }
  },
  methods: {
    submitForm() {
      this.$refs.addPostForm.validate(valid => {
        if (valid) {
          const type = this.form.type === 'custom' ? this.form.customType : this.form.type;
          
          // 如果是自定义类型，先添加类型
          if (this.form.type === 'custom') {
            store.addPostType(type);
          }
          
          // 添加评分对象
          store.addPost(type, this.form.name);
          
          this.$message.success('添加成功');
          this.resetForm();
          
          // 如果不是自定义类型，跳转到对应类型页面
          if (this.form.type !== 'custom') {
            const routeMap = {
              course: '/course',
              food: '/food',
              goods: '/goods'
            };
            
            this.$router.push(routeMap[this.form.type]);
          }
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.addPostForm.resetFields();
    },
    viewCategory(type) {
      // 由于是自定义类型，需要创建一个动态路由
      // 这里我们可以使用查询参数来传递类型
      this.$router.push(`/custom?type=${type}`);
    }
  }
}
</script>

<style scoped>
.add-post-page {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
  text-align: center;
}

.page-header h1 {
  color: #409EFF;
  margin-bottom: 10px;
}

.form-card {
  margin-bottom: 30px;
}

.post-types-card {
  margin-top: 30px;
}
</style>