<template>
  <div class="add-post-page">
    <div class="page-header">
      <h1>添加新评分帖子</h1>
      <p>您可以在这里添加新的评分帖子或自定义类别</p>
    </div>
    
    <el-tabs v-model="activeTab">
      <el-tab-pane label="添加帖子" name="addPost">
        <el-card class="form-card">
          <el-form :model="postForm" label-width="120px" :rules="postRules" ref="addPostForm">
            <el-form-item label="类型" prop="type">
              <el-radio-group v-model="postForm.type">
                <el-radio label="course">课程</el-radio>
                <el-radio label="food">外卖</el-radio>
                <el-radio label="goods">生活用品</el-radio>
                <el-radio 
                  v-for="customType in customTypes" 
                  :key="customType.type" 
                  :label="customType.type">
                  {{ customType.type }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            
            <el-form-item label="帖子名称" prop="name">
              <el-input v-model="postForm.name" placeholder="输入评分帖子名称"></el-input>
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="submitPostForm">添加帖子</el-button>
              <el-button @click="resetPostForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
      
      <el-tab-pane label="添加自定义类别" name="addCategory">
        <el-card class="form-card">
          <el-form :model="categoryForm" label-width="120px" :rules="categoryRules" ref="addCategoryForm">
            <el-form-item label="类别名称" prop="name">
              <el-input v-model="categoryForm.name" placeholder="输入新的类别名称"></el-input>
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="submitCategoryForm">添加类别</el-button>
              <el-button @click="resetCategoryForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    
    <el-card class="post-types-card" v-if="hasCustomTypes">
      <h3>自定义分类列表</h3>
      <el-table :data="customTypes" style="width: 100%">
        <el-table-column prop="type" label="分类名称"></el-table-column>
        <el-table-column prop="count" label="帖子数量"></el-table-column>
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
      activeTab: 'addPost',
      postForm: {
        type: 'course',
        name: ''
      },
      categoryForm: {
        name: ''
      },
      postRules: {
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入评分帖子名称', trigger: 'blur' }
        ]
      },
      categoryRules: {
        name: [
          { required: true, message: '请输入自定义类别名称', trigger: 'blur' }
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
    submitPostForm() {
      this.$refs.addPostForm.validate(valid => {
        if (valid) {
          const type = this.postForm.type;
          
          // 添加评分帖子
          const result = store.addPost(type, this.postForm.name);
          
          if (result.success) {
            this.$message.success('添加帖子成功');
            this.resetPostForm();
            
            // 根据类型跳转到对应页面
            const routeMap = {
              course: '/course',
              food: '/food',
              goods: '/goods'
            };
            
            if (routeMap[type]) {
              this.$router.push(routeMap[type]);
            } else {
              // 自定义类型
              this.$router.push(`/custom?type=${type}`);
            }
          } else {
            this.$message.error(result.message);
          }
        } else {
          return false;
        }
      });
    },
    submitCategoryForm() {
      this.$refs.addCategoryForm.validate(valid => {
        if (valid) {
          // 添加自定义类别
          const typeName = this.categoryForm.name;
          const result = store.addPostType(typeName);
          
          if (result.success) {
            this.$message.success('添加类别成功');
            this.resetCategoryForm();
          } else {
            this.$message.error(result.message || '类别已存在');
          }
        } else {
          return false;
        }
      });
    },
    resetPostForm() {
      this.$refs.addPostForm.resetFields();
    },
    resetCategoryForm() {
      this.$refs.addCategoryForm.resetFields();
    },
    viewCategory(type) {
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