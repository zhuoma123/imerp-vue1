<template>
  <d2-container class="page">
    <div style="padding: 15px;">
    <el-row>
      <el-col :span="8">
        <el-card class="box-card card-sys-info">
          <div slot="header" class="clearfix">
            <div class="card-header"><d2-icon name="info-circle"/> 系统信息
            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
            </div>
          </div>
          <div class="info-item" style="margin-top: 0px;">
            系统名称：
          </div>
          <div class="info-item">
            系统名称：
          </div>
          <div class="info-item">
            系统名称：
          </div>
          <div class="info-item">
            系统名称：
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card class="box-card r-box-card ">
          <el-row class="data-row-top">
            <el-col :span="6">
              <el-row>
                <el-col :span="8"><d2-icon name="shopping-bag" class="data-icon"/></el-col>
                <el-col :span="16">
                  <el-row class="data-num">100</el-row>
                  <el-row class="data-label">已销售</el-row>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="6">
              <el-row>
                <el-col :span="8"><d2-icon name="truck" class="data-icon data-color-fh"/></el-col>
                <el-col :span="16">
                  <el-row class="data-num">100</el-row>
                  <el-row class="data-label">待发货订单</el-row>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="6">
              <el-row>
                <el-col :span="8"><d2-icon name="mail-reply-all" class="data-icon data-color-blue"/></el-col>
                <el-col :span="16">
                  <el-row class="data-num">100</el-row>
                  <el-row class="data-label">待退货订单</el-row>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="6">
              <el-row>
                <el-col :span="8"><d2-icon name="edit" class="data-icon"/></el-col>
                <el-col :span="16">
                  <el-row class="data-num">100</el-row>
                  <el-row class="data-label">待审批订单</el-row>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row class="data-row">
            <el-col :span="6">
              <el-row>
                <el-col :span="8"><d2-icon name="cny" class="data-icon data-color-zs"/></el-col>
                <el-col :span="16">
                  <el-row class="data-num">100</el-row>
                  <el-row class="data-label">今日销售额</el-row>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="6">
              <el-row>
                <el-col :span="8"><d2-icon name="dollar" class="data-icon data-color-gree"/></el-col>
                <el-col :span="16">
                  <el-row class="data-num">100</el-row>
                  <el-row class="data-label">今日毛利额</el-row>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="6">
              <el-row>
                <el-col :span="8"><d2-icon name="line-chart" class="data-icon"/></el-col>
                <el-col :span="16">
                  <el-row class="data-num">100</el-row>
                  <el-row class="data-label">月销售额</el-row>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="6">
              <el-row>
                <el-col :span="8"><d2-icon name="bar-chart" class="data-icon"/></el-col>
                <el-col :span="16">
                  <el-row class="data-num">100</el-row>
                  <el-row class="data-label">月毛利额</el-row>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row class="data-el-row">
      <el-col :span="12">
        <el-row>
          <el-tabs style="height: 125px;" type="border-card">
          <el-tab-pane label="今日">
            <el-row>
              <el-col :span="8" class='order-data'>
                <div class="order-num">0/0</div>
                <div class="order-label">成交量/交易量</div>
              </el-col>
              <el-col :span="8" class='order-data'>
                <div class="order-num">0/0</div>
                <div class="order-label">成交量/交易量</div>
              </el-col>
              <el-col :span="8" class='order-data'>
                <div class="order-num">0/0</div>
                <div class="order-label">成交量/交易量</div>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="昨日">
            <el-row>
              <el-col :span="8" class='order-data'>
                <div class="order-num">0/0</div>
                <div class="order-label">成交量/交易量</div>
              </el-col>
              <el-col :span="8" class='order-data'>
                <div class="order-num">0/0</div>
                <div class="order-label">成交量/交易量</div>
              </el-col>
              <el-col :span="8" class='order-data'>
                <div class="order-num">0/0</div>
                <div class="order-label">成交量/交易量</div>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="最近七天">
            <el-row>
              <el-col :span="8" class='order-data'>
                <div class="order-num">0/0</div>
                <div class="order-label">成交量/交易量</div>
              </el-col>
              <el-col :span="8" class='order-data'>
                <div class="order-num">0/0</div>
                <div class="order-label">成交量/交易量</div>
              </el-col>
              <el-col :span="8" class='order-data'>
                <div class="order-num">0/0</div>
                <div class="order-label">成交量/交易量</div>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="本月">
            <el-row>
              <el-col :span="8" class='order-data'>
                <div class="order-num">0/0</div>
                <div class="order-label">成交量/交易量</div>
              </el-col>
              <el-col :span="8" class='order-data'>
                <div class="order-num">0/0</div>
                <div class="order-label">成交量/交易量</div>
              </el-col>
              <el-col :span="8" class='order-data'>
                <div class="order-num">0/0</div>
                <div class="order-label">成交量/交易量</div>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
        </el-row>
        <el-row style="margin-top:15px;">
          <el-card class="order-chart">
            <ve-line :data="chartData"></ve-line>
          </el-card>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card card-prod-info r-box-card">
          <div slot="header" class="clearfix">
            <div class="card-header"><d2-icon name="info-circle"/> 商品排行
              <el-link class="order-date" type="success" style="margin-left: 100px;">今日</el-link>
              <el-link class="order-date">昨日</el-link>
              <el-link class="order-date">最近七天</el-link>
              <el-link class="order-date">本月</el-link>
            </div>
          </div>
          <el-table
            :data="tableData"
            stripe
            :header-cell-style="tableHeaderStyle"
            style="width: 100%">
            <el-table-column type="index" label="排名"></el-table-column>
            <el-table-column
              prop="prod"
              label="商品名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="qty"
              label="成交数量"
              width="180">
            </el-table-column>
            <el-table-column
              prop="amt"
              label="成交金额">
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
  </d2-container>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      tableData: [
        {
          prod: '刹车鼓',
          qty: 100,
          amt: 2000.00
        },{
          prod: '刹车鼓',
          qty: 100,
          amt: 2000.00
        },{
          prod: '刹车鼓',
          qty: 100,
          amt: 2000.00
        },{
          prod: '刹车鼓',
          qty: 100,
          amt: 2000.00
        },{
          prod: '刹车鼓',
          qty: 100,
          amt: 2000.00
        },{
          prod: '刹车鼓',
          qty: 100,
          amt: 2000.00
        },{
          prod: '刹车鼓',
          qty: 100,
          amt: 2000.00
        },{
          prod: '刹车鼓',
          qty: 100,
          amt: 2000.00
        },{
          prod: '刹车鼓',
          qty: 100,
          amt: 2000.00
        }],
      chartData: {
        columns: ['日期', '访问用户', '下单用户', '下单率'],
        rows: [
          { '日期': '1/1', '访问用户': 1393, '下单用户': 1093, '下单率': 0.32 },
          { '日期': '1/2', '访问用户': 3530, '下单用户': 3230, '下单率': 0.26 },
          { '日期': '1/3', '访问用户': 2923, '下单用户': 2623, '下单率': 0.76 },
          { '日期': '1/4', '访问用户': 1723, '下单用户': 1423, '下单率': 0.49 },
          { '日期': '1/5', '访问用户': 3792, '下单用户': 3492, '下单率': 0.323 },
          { '日期': '1/6', '访问用户': 4593, '下单用户': 4293, '下单率': 0.78 }
        ]
      }
    }
  },
  methods: {
    // 修改table header的背景色
    tableHeaderStyle({ row, column, rowIndex, columnIndex }) {
      return 'height:28px;padding:0;'
    }
  }
}
</script>

<style scoped>
    .page >>> .d2-container-full__body {
    overflow:auto !important;
  }
</style>

<style lang="scss" scoped>
.r-box-card {
  margin-left: 15px;
}

.page {
  overflow:auto !important;
  font-size: 12px;

  .data-el-row {
    margin-top: 15px;
  }

  .box-card {
    .card-header {
      margin: -18px -20px; 
      padding: 10px 20px; 
      font-size: 14px;
    }
  }

  .card-sys-info {
    height: 175px;

    .info-item {
      margin-top: 10px;
    }
  }

  .data-icon {
    font-size: 50px;
    color:#1d58c2;
  }
  .data-row-top {
    border-bottom: #cccccc 1px solid;
    padding-bottom: 15px;
  }
  .data-row {
    margin-top: 19px;
  }

  .data-color-fh {
    color: #f56c6c;
  }

  .data-color-zs {
    color: #8c40e2;
  }

  .data-color-blue {
    color: #2f74ff;
  }

  .data-color-hs {
    color: #293849;
  }

  .data-color-gree {
    color: #67c23a;
  }

  .data-num {
    font-size: 20px;
  }

  .data-label {
    margin-top: 10px;
  }


  .order-data {
    font-size: 15px;
    text-align: center;
    padding-top: 12px;
  }

  .order-chart {
    height: 400px;
  }

  .card-prod-info {
    height: 540px;

    .table-header {
      height: 28px;
    }

    .order-date {
      margin-left: 20px;
    }
  }

  .logo {
    width: 120px;
  }
  .btn-group {
    color: $color-text-placehoder;
    font-size: 12px;
    line-height: 12px;
    margin-top: 0px;
    margin-bottom: 20px;
    .btn-group__btn {
      color: $color-text-sub;
      &:hover {
        color: $color-text-main;
      }
      &.btn-group__btn--link {
        color: $color-primary;
      }
    }
  }
}
</style>
