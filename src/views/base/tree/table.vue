<template>
    <el-card>
        <!-- 查询结果 -->
        <el-table v-loading="dataListLoading" :data="dataList" row-key="id" element-loading-text="正在查询中。。。" border fit highlight-current-row>
            <el-table-column label="序号" type="index" align="center" show-overflow-tooltip width="50px"/>
            <el-table-column align="center" label="类型" prop="type"/>
            <el-table-column align="center" label="编码" prop="code"/>
            <el-table-column align="center" label="名称" prop="name"/>
            <el-table-column align="center" label="排序序号" prop="orderNum"/>
            <el-table-column align="center" label="是否系统数据" prop="sys"/>
            <el-table-column align="center" label="备注" prop="remark"/>
            <el-table-column align="center" label="更新人" prop="orderNum"/>
            <el-table-column align="center" label="更新时间" prop="orderNum"/>
            <el-table-column align="center" label="操作" class-name="small-padding" width="160px">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="addOrUpdateHandleSetter(scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini" @click="deleteHandleSetter(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script>
export default {
  name: 'table'
}
</script>

<style scoped>

</style>
