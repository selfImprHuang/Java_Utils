let cookiesArr = [], cookie = '';
const JD_API_HOST = 'https://ms.jr.jd.com/gw/generic/uc/h5/m';
const notify = $.isNode() ? require('./sendNotify') : '';
let message = "" 
//Node.js用户请在jdCookie.js处填写动动ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') that.log = () => {};
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
!(async () => {

    message += "<font color=\'#FFA500\'>[通知] </font><font color=\'#006400\' size='3'>天天提鹅</font> \n\n --- \n\n"
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取动动账号一cookie\n直接使用NobyDa的动动签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
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
      that.log(`\n***********开始【动动账号${$.index}】${$.nickName || $.UserName}********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `动动账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `动动账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await jdDailyEgg();
    }
    message = message +"----\n\n"
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      that.log(message)
     postToDingTalk(message)
      $.done();
    })
async function jdDailyEgg() {
  await toDailyHome()
  await toWithdraw()
  await toGoldExchange();
}
function toGoldExchange() {
  return new Promise(async resolve => {
    const body = {
      "timeSign": 0,
      "environment": "jrApp",
      "riskDeviceInfo": "{}"
    }
    $.post(taskUrl('toGoldExchange', body), (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            // that.log(data)
            data = JSON.parse(data);
            if (data.resultCode === 0) {
              if (data.resultData.code === '0000') {
                that.log(`兑换金币:${data.resultData.data.cnumber}`);
                message += "<font color=\'#778899\' size=2>" + `兑换金币:${data.resultData.data.cnumber}` + "</font>\n\n"
                that.log(`当前总金币:${data.resultData.data.goldTotal}`);
                message += "<font color=\'#778899\' size=2>" + `当前总金币:${data.resultData.data.goldTotal}` +"</font>\n\n"
              } else if (data.resultData.code !== '0000') {
                that.log(`兑换金币失败:${data.resultData.msg}`)
              }
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
function toWithdraw() {
  return new Promise(async resolve => {
    const body = {
      "timeSign": 0,
      "environment": "jrApp",
      "riskDeviceInfo": "{}"
    }
    $.post(taskUrl('toWithdraw', body), (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            // that.log(data)
            data = JSON.parse(data);
            if (data.resultCode === 0) {
              if (data.resultData.code === '0000') {
                message += "<font color=\'#778899\' size=2>" +`收取鹅蛋:${data.resultData.data.eggTotal}个成功` + "</font>\n\n"
                message += "<font color=\'#778899\' size=2>" + `当前总鹅蛋数量:${data.resultData.data.userLevelDto.userHaveEggNum}` + "</font>\n\n"
                that.log(`收取鹅蛋:${data.resultData.data.eggTotal}个成功`);
                that.log(`当前总鹅蛋数量:${data.resultData.data.userLevelDto.userHaveEggNum}`);
              } else if (data.resultData.code !== '0000') {
                that.log(`收取鹅蛋失败:${data.resultData.msg}`)
                message += "<font color=\'#778899\' size=2>" + `收取鹅蛋失败:${data.resultData.msg}` + "</font>\n\n"
              }
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
function toDailyHome() {
  return new Promise(async resolve => {
    const body = {
      "timeSign": 0,
      "environment": "jrApp",
      "riskDeviceInfo": "{}"
    }
    $.post(taskUrl('toDailyHome', body), (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            // that.log(data)
            data = JSON.parse(data);
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
function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      "headers": {
        "Accept": "application/json,text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
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
function taskUrl(function_id, body) {
  return {
    url: `${JD_API_HOST}/${function_id}`,
    body: `reqData=${encodeURIComponent(JSON.stringify(body))}`,
    headers: {
      'Accept' : `application/json`,
      'Origin' : `https://uua.jr.jd.com`,
      'Cookie' : cookie,
      'Content-Type' : `application/x-www-form-urlencoded;charset=UTF-8`,
      'Host' : `ms.jr.jd.com`,
      'Connection' : `keep-alive`,
      'User-Agent' : $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      'Referer' : `https://uua.jr.jd.com/uc-fe-wxgrowing/moneytree/index`,
      'Accept-Language' : `zh-cn`
    }
  }
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
    const dingtalk = "https://oapi.dingtalk.com/robot/send?access_token=18444b555747aad3381bc1d1e3dea72b03158e152a846f818d82a1ca946bd430"

    const message1 = "" + messgae
    that.log(messgae)

    const body = {
        "msgtype": "markdown",
        "markdown": {
            "title":"天天提鹅",
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