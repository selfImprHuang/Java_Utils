const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写动动ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';

//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') that.log = () => {};
} else {
  let cookiesData = $.getdata('CookiesJD') || "[]";
  cookiesData = jsonParse(cookiesData);
  cookiesArr = cookiesData.map(item => item.cookie);
  cookiesArr.reverse();
  cookiesArr.push(...[$.getdata('CookieJD2'), $.getdata('CookieJD')]);
  cookiesArr.reverse();
  cookiesArr = cookiesArr.filter(item => item !== "" && item !== null && item !== undefined);
}
let message = '', subTitle = '';

const JD_API_HOST = 'https://api.m.jd.com/client.action';
!(async () => {

  message += "<font color=\'#FFA500\'>[通知] </font><font color=\'#006400\' size='3'>动动超市</font> \n\n --- \n\n"
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取动动账号一cookie\n直接使用NobyDa的动动签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      await TotalBean();

      username = $.UserName
      if ($.UserName == "jd_66ea783827d30"){
        username = "跑腿小弟"
      }
      if ($.UserName == "jd_4521b375ebb5d"){
        username = "锟锟"
      }
      if ($.UserName == "jd_542c10c0222bc"){
        username = "康康"
      }
       //加上名称
       message = message + "<font color=\'#778899\' size=2>【羊毛姐妹】<font color=\'#FFA500\' size=3>" +  username + " </font> </font> \n\n "
      that.log(`\n开始【动动账号${$.index}】${$.nickName || $.UserName}\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `动动账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `动动账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      subTitle = '';
      await jdShop();
    }
    message += "----\n\n"
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
      message = message + "<font color=\'#778899\' size=2>" +`❌ ${$.name}, 失败! 原因: ${e}!` +  "</font>\n\n"
    })
    .finally(() => {
      message += getPic()
       that.log(message)
       // postToDingTalk(message)
      $.done();
    })
async function jdShop() {
  const taskData = await getTask();
  if (taskData.code === '0') {
    if (!taskData.data.taskList) {
      that.log(`${taskData.data.taskErrorTips}\n`);
      $.msg($.name, '', `动动账号 ${$.index} ${$.nickName}\n${taskData.data.taskErrorTips}`);
      message += "<font color=\'#778899\' size=2>" + `${taskData.data.taskErrorTips}`  + "</font>\n\n"
    } else {
      const { taskList } = taskData.data;
      let beanCount = 0;
      for (let item of taskList) {
        if (item.taskStatus === 3) {
          that.log(`${item.shopName} 已拿到2京豆\n`)
          message += "<font color=\'#778899\' size=2>" + `成功领取${beanCount}京豆`  + "</font>\n\n"
        } else {
          that.log(`taskId::${item.taskId}`)
          const doTaskRes = await doTask(item.taskId);
          if (doTaskRes.code === '0') {
            beanCount += 2;
          }
        }
      }
      that.log(`beanCount::${beanCount}`);
        message += "<font color=\'#778899\' size=2>" + `成功领取${beanCount}京豆`  + "</font>\n\n"
        $.msg($.name, '', `动动账号 ${$.index} ${$.nickName}\n成功领取${beanCount}京豆`);
    }
  }
}
function doTask(taskId) {
  that.log(`doTask-taskId::${taskId}`)
  return new Promise(resolve => {
    const body = { 'taskId': `${taskId}` };
    const options = {
      url: `${JD_API_HOST}`,
      body: `functionId=takeTask&body=${escape(JSON.stringify(body))}&appid=ld`,
      headers: {
        'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
        'Host': 'api.m.jd.com',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': cookie,
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          that.log('\n进店领豆: API查询请求失败 ‼️‼️')
          $.logErr(err);
        } else {
          // that.log(data)
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
function getTask(body = {}) {
 return new Promise(resolve => {
   const options = {
     url: `${JD_API_HOST}`,
     body: `functionId=queryTaskIndex&body=${escape(JSON.stringify(body))}&appid=ld`,
     headers: {
       'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
       'Host': 'api.m.jd.com',
       'Content-Type': 'application/x-www-form-urlencoded',
       'Cookie': cookie,
     }
   }
   $.post(options, (err, resp, data) => {
     try {
       if (err) {
         that.log('\n进店领豆: API查询请求失败 ‼️‼️')
         $.logErr(err);
       } else {
         // that.log(data)
         data = JSON.parse(data);
       }
     } catch (e) {
       $.logErr(e, resp);
     } finally {
       resolve(data);
     }
   })
 })
}
function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      "headers": {
        "Accept": "application/json,text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0")
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === 13) {
              $.isLogin = false; //cookie过期
              return
            }
            if (data['retcode'] === 0) {
              $.nickName = (data['base'] && data['base'].nickname) || $.UserName;
            } else {
              $.nickName = $.UserName
            }
          } else {
            that.log(`动动服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      that.log(e);
      $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
      return [];
    }
  }
}


//我加的函数
function postToDingTalk(messgae) {
    const dingtalk = "https://oapi.dingtalk.com/robot/send?access_token=fa87e34729eaa6113fddfa857efebb477dea0a433d6eecfe93b1d3f5e24847b9"

    const message1 = "" + messgae
    that.log(messgae)

    const body = {
        "msgtype": "markdown",
        "markdown": {
            "title":"动动超市",
            "text": message1
        },
        "at": {
            "atMobiles": [],
            "isAtAll": false
        }
    }


    $.post(toDingtalk(dingtalk,JSON.stringify(body)), (data,status,xhr)=>{
        try {
            that.log(resp)
            that.log(data)
            if (err) {
                that.log(JSON.stringify(err));
                $.logErr(err);
            } else {
                if (safeGet(data)) {
                    $.duckRes = JSON.parse(data);
                }
            }
        } catch (e) {
            $.logErr(e, resp)
        } finally {
            resolve();
        }
    },"json")
}


function toDingtalk(urlmain, bodyMain) {
    return {
        url: urlmain,
        body:bodyMain,
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        timeout: 10000,
    }
}

function getPic(){
    let code = ["1.gif","2.png","3.png","4.png","5.gif","6.gif","7.gif","8.gif","9.gif","10.png","11.png"]
    let address = "\n\n ![screenshot](https://cdn.jsdelivr.net/gh/selfImprHuang/Go-Tool@v1.2/test/emptyDirTest/3/"

        pos = parseInt(11*Math.random())
    address = address + code[pos] + ")"
    return address
}