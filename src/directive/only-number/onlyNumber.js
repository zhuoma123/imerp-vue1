export default {
  inserted(el, vDir, vNode) {
    // vDir.value 有指令的参数
    let content;
    //按键按下=>只允许输入 数字/小数点
    el.addEventListener("keypress", event => {
      let e = event || window.event;
      let inputKey = String.fromCharCode(typeof e.charCode === 'number' ? e.charCode : e.keyCode);
      let re = /\d|\./;
      content = e.target.value;
      //定义方法,阻止输入
      function preventInput() {
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          e.returnValue = false;
        }
      }
      let arg_fix = 0;//默认保留至整数
      if (typeof vDir.value !== 'object') {
        arg_fix = parseFloat(vDir.value);
        if (!arg_fix) {
          arg_fix = 0;
        }
      } else if (vDir.value.fix) {
        arg_fix = parseFloat(vDir.value.fix);
      }

      if (!re.test(inputKey) && !e.ctrlKey) {
        preventInput();
      } else if (content.indexOf(".") > 0 && inputKey == ".") {
        //已有小数点,再次输入小数点
        preventInput();
      } else if (arg_fix > 0 && content.indexOf(".") > 0 && 
          content.substr( content.indexOf(".") + 1).length + 1 > arg_fix) {
        //小数点位数
        preventInput();
      }
    });
    //按键弹起=>并限制最大最小
    el.addEventListener("keyup", event => {
      let e = event || window.event;
      content = parseFloat(e.target.value);
      if (!content) {
        content = 0.00;
      }
      let arg_max = "";
      let arg_min = "";
      if (vDir.value) {
        arg_max = parseFloat(vDir.value.max);
        arg_min = parseFloat(vDir.value.min);
      }
      if (arg_max && content > arg_max) {
        e.target.value = arg_max;
        content = arg_max;
      }
      if (arg_min && content < arg_min) {
        e.target.value = arg_min;
        content = arg_min;
      }
    });
    //失去焦点=>保留指定位小数
    el.addEventListener("focusout", event => {//此处会在 el-input 的 @change 后执行
      let e = event || window.event;
      content = parseFloat(e.target.value);
      if (!content) {
        content = 0.00;
      }
      let arg_fix = 0;//默认保留至整数
      if (typeof vDir.value === 'number') {
        arg_fix = vDir.value;
      } else if (vDir.value.precision) {
        arg_fix = parseFloat(vDir.value.fix);
      }
      e.target.value = Number(content.toFixed(arg_fix));
      // -- callback写法1
      // vNode.data.model.callback = ()=>{
      //     e.target.value = content.toFixed(arg_precision)
      // }
      // vNode.data.model.callback();
      // -- callback 写法2
      // vNode.data.model.callback(
      //     e.target.value = content.toFixed(arg_precision)
      // )
    })
  }
}