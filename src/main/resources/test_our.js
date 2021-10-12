/*
京东资产变动通知脚本：https://jdsharedresourcescdn.azureedge.net/jdresource/jd_bean_change.js
Modified time: 2021-05-17 15:25:41
统计昨日京豆的变化情况，包括收入，支出，以及显示当前京豆数量,目前小问题:下单使用京豆后,退款重新购买,计算统计会出现异常
统计红包以及过期红包
网页查看地址 : https://bean.m.jd.com/beanDetail/index.action?resourceValue=bean
支持京东双账号
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============QuantumultX==============
[task_local]
#京东资产变动通知
2 9 * * * https://jdsharedresourcescdn.azureedge.net/jdresource/jd_bean_change.js, tag=京东资产变动通知, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/jd.png, enabled=true
================Loon===============
[Script]
cron "2 9 * * *" script-path=https://jdsharedresourcescdn.azureedge.net/jdresource/jd_bean_change.js, tag=京东资产变动通知
=============Surge===========
[Script]
京东资产变动通知 = type=cron,cronexp="2 9 * * *",wake-system=1,timeout=3600,script-path=https://jdsharedresourcescdn.azureedge.net/jdresource/jd_bean_change.js
============小火箭=========
京东资产变动通知 = type=cron,script-path=https://jdsharedresourcescdn.azureedge.net/jdresource/jd_bean_change.js, cronexpr="2 9 * * *", timeout=3600, enable=true
 */
let roleMap = {
    "jd_4521b375ebb5d":"锟子怪",
    "jd_542c10c0222bc":"康子怪",
    "jd_66dcb31363ef6":"涛子怪",
    "18070420956_p":"奇怪子",
    "jd_45d917547c763":"跑腿小怪",
    "417040678_m":"斌子",
    "jd_73d88459d908e":"杰子怪",
    "jd_66ea783827d30":"军军酱",
    "jd_4311ac0ff4456":"居居酱"
}
let dingtalk = "https://oapi.dingtalk.com/robot/send?access_token=fa87e34729eaa6113fddfa857efebb477dea0a433d6eecfe93b1d3f5e24847b9"
const $ = new Env('京东资产变动通知');
let  jdFruitShareArr = [], isBox = false, notify, newShareCodes;
//助力好友分享码(最多4个,否则后面的助力失败),原因:动动农场每人每天只有四次助力机会
//此此内容是IOS用户下载脚本到本地使用，填写互助码的地方，同一动动账号的好友互助码请使用@符号隔开。
//下面给出两个账号的填写示例（iOS只支持2个动动账号）
let shareCodes =
 [ // 这个列表填入你要助力的好友的shareCode
]
let subTitle = '', option = {}, isFruitFinished = false;
const retainWater = 100;//保留水滴大于多少g,默认100g;
let jdNotify = false;//是否关闭通知，false打开通知推送，true关闭通知推送
let jdFruitBeanCard = false;//农场使用水滴换豆卡(如果出现限时活动时100g水换20豆,此时比浇水划算,推荐换豆),true表示换豆(不浇水),false表示不换豆(继续浇水),脚本默认是浇水
let randomCount = $.isNode() ? 0 : 0;
const JD_API_HOST = 'https://api.m.jd.com/client.action';
const urlSchema = `openjd://virtual?params=%7B%20%22category%22:%20%22jump%22,%20%22des%22:%20%22m%22,%20%22url%22:%20%22https://h5.m.jd.com/babelDiy/Zeus/3KSjXqQabiTuD1cJ28QskrpWoBKT/index.html%22%20%7D`;

let allMessage = '';
let message = "";
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '';
!(async () => {
  await requireConfig();
    message += "<font color=\'#FFA500\'>[通知] </font><font color=\'#006400\' size='3'>资产变动</font> \n\n --- \n\n"
    if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.beanCount = 0;
      $.incomeBean = 0;
      $.expenseBean = 0;
      $.todayIncomeBean = 0;
      $.errorMsg = '';
      $.isLogin = true;
      $.nickName = '';
      $.balance = 0;
      $.expiredBalance = 0;

      if($.UserName == "jd_66ea783827d30" || $.UserName == "jd_4311ac0ff4456"){
          continue 
      }
      username = $.UserName
      username = roleMap[username]
    
      await TotalBean();
       //加上名称
       message = message + "<font color=\'#778899\' size=1>【羊毛姐妹】<font color=\'#FFA500\' size=2>" +  username + `( ${$.nickName} )`+ " </font> </font> \n\n "

      console.log(`\n********开始【京东账号${$.index}】${$.nickName || $.UserName}******\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await bean();
      await showMsg();
      await shareCodesFormat();
      await jdFruit();
      await jdWish()
    }
    message +=  "----\n\n"
  }

  if ($.isNode() && allMessage) {
    await notify.sendNotify(`${$.name}`, `${allMessage}`, { url: `https://bean.m.jd.com/beanDetail/index.action?resourceValue=bean` })
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
        message = message + getPic()
        postToDingTalk(message)
      $.done();
    })


    function requireConfig() {
      return new Promise(resolve => {
        that.log('开始获取配置文件\n')
        notify = $.isNode() ? require('./sendNotify') : '';
        //Node.js用户请在jdCookie.js处填写动动ck;
        const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
        const jdFruitShareCodes = $.isNode() ? require('./jdFruitShareCodes.js') : '';
        //IOS等用户直接用NobyDa的jd cookie
        if ($.isNode()) {
          Object.keys(jdCookieNode).forEach((item) => {
            if (jdCookieNode[item]) {
              cookiesArr.push(jdCookieNode[item])
            }
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
        that.log(`共${cookiesArr.length}个动动账号\n`)
        resolve()
      })
    }

async function showMsg() {
  // if ($.errorMsg) return
  allMessage += `账号${$.index}：${$.nickName || $.UserName}\n今日收入：${$.todayIncomeBean}京豆 🐶\n昨日收入：${$.incomeBean}京豆 🐶\n昨日支出：${$.expenseBean}京豆 🐶\n当前京豆：${$.beanCount}(今日将过期${$.expirejingdou})京豆 🐶${$.message}${$.index !== cookiesArr.length ? '\n\n' : ''}`;
  message += "<font color=\'#990000\' size=2>" + `【总京豆】：${$.beanCount}( 今日将过期${$.expirejingdou} )京豆 🐶` +"</font>\n\n"
  message += "<font color=\'#778899\' size=1>" + `【今日收入】：${$.todayIncomeBean}京豆 🐶` +"</font>\n\n"
  message += "<font color=\'#778899\' size=1>" + `【昨日收入】：${$.incomeBean}京豆 🐶` +"</font>\n\n"
  message += "<font color=\'#778899\' size=1>" + `【昨日支出】：${$.expenseBean}京豆 🐶` +"</font>\n\n"
  


  message += "<font color=\'#990000\' size=2>" + `【当前总红包】：${$.balance}( 今日总过期${$.expiredBalance} )元 🧧` +"</font>\n\n"
  message += "<font color=\'#778899\' size=1>" + `【京喜红包】：${$.jxRed}( 今日将过期${$.jxRedExpire.toFixed(2)} )元 🧧` +"</font>\n\n"
  message += "<font color=\'#778899\' size=1>" + `【极速红包】：${$.jsRed}( 今日将过期${$.jsRedExpire.toFixed(2)} )元 🧧` +"</font>\n\n"
  message += "<font color=\'#778899\' size=1>" + `【京东红包】：${$.jdRed}( 今日将过期${$.jdRedExpire.toFixed(2)} )元 🧧` +"</font>\n\n"
  message += "<font color=\'#778899\' size=1>" + `【健康红包】：${$.jdhRed}( 今日将过期${$.jdhRedExpire.toFixed(2)} )元 🧧` +"</font>\n\n"
  // if ($.isNode()) {
  //   await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName}`, `账号${$.index}：${$.nickName || $.UserName}\n昨日收入：${$.incomeBean}京豆 🐶\n昨日支出：${$.expenseBean}京豆 🐶\n当前京豆：${$.beanCount}京豆 🐶${$.message}`, { url: `https://bean.m.jd.com/beanDetail/index.action?resourceValue=bean` })
  // }
  $.msg($.name, '', `账号${$.index}：${$.nickName || $.UserName}\n今日收入：${$.todayIncomeBean}京豆 🐶\n昨日收入：${$.incomeBean}京豆 🐶\n昨日支出：${$.expenseBean}京豆 🐶\n当前京豆：${$.beanCount}(今日将过期${$.expirejingdou})京豆🐶${$.message}`, {"open-url": "https://bean.m.jd.com/beanDetail/index.action?resourceValue=bean"});
}

async function bean() {
  // console.log(`北京时间零点时间戳:${parseInt((Date.now() + 28800000) / 86400000) * 86400000 - 28800000}`);
  // console.log(`北京时间2020-10-28 06:16:05::${new Date("2020/10/28 06:16:05+08:00").getTime()}`)
  // 不管哪个时区。得到都是当前时刻北京时间的时间戳 new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000

  //前一天的0:0:0时间戳
  const tm = parseInt((Date.now() + 28800000) / 86400000) * 86400000 - 28800000 - (24 * 60 * 60 * 1000);
  // 今天0:0:0时间戳
  const tm1 = parseInt((Date.now() + 28800000) / 86400000) * 86400000 - 28800000;
  let page = 1, t = 0, yesterdayArr = [], todayArr = [];
  do {
    let response = await getJingBeanBalanceDetail(page);
    // console.log(`第${page}页: ${JSON.stringify(response)}`);
    if (response && response.code === "0") {
      page++;
      let detailList = response.detailList;
      if (detailList && detailList.length > 0) {
        for (let item of detailList) {
          const date = item.date.replace(/-/g, '/') + "+08:00";
          if (new Date(date).getTime() >= tm1 && (!item['eventMassage'].includes("退还") && !item['eventMassage'].includes('扣赠'))) {
            todayArr.push(item);
          } else if (tm <= new Date(date).getTime() && new Date(date).getTime() < tm1 && (!item['eventMassage'].includes("退还") && !item['eventMassage'].includes('扣赠'))) {
            //昨日的
            yesterdayArr.push(item);
          } else if (tm > new Date(date).getTime()) {
            //前天的
            t = 1;
            break;
          }
        }
      } else {
        $.errorMsg = `数据异常`;
        $.msg($.name, ``, `账号${$.index}：${$.nickName}\n${$.errorMsg}`);
        t = 1;
      }
    } else if (response && response.code === "3") {
      console.log(`cookie已过期，或者填写不规范，跳出`)
      t = 1;
    } else {
      console.log(`未知情况：${JSON.stringify(response)}`);
      console.log(`未知情况，跳出`)
      t = 1;
    }
  } while (t === 0);
  for (let item of yesterdayArr) {
    if (Number(item.amount) > 0) {
      $.incomeBean += Number(item.amount);
    } else if (Number(item.amount) < 0) {
      $.expenseBean += Number(item.amount);
    }
  }
  for (let item of todayArr) {
    if (Number(item.amount) > 0) {
      $.todayIncomeBean += Number(item.amount);
    }
  }
  await queryexpirejingdou();//过期京豆
  await redPacket();//过期红包
  // console.log(`昨日收入：${$.incomeBean}个京豆 🐶`);
  // console.log(`昨日支出：${$.expenseBean}个京豆 🐶`)
}
function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      url: "https://me-api.jd.com/user_new/info/GetJDUserInfoUnion",
      headers: {
        Host: "me-api.jd.com",
        Accept: "*/*",
        Connection: "keep-alive",
        Cookie: cookie,
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        "Accept-Language": "zh-cn",
        "Referer": "https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&",
        "Accept-Encoding": "gzip, deflate, br"
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          $.logErr(err)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === "1001") {
              $.isLogin = false; //cookie过期
              return;
            }
            if (data['retcode'] === "0" && data.data && data.data.hasOwnProperty("userInfo")) {
              $.nickName = data.data.userInfo.baseInfo.nickname;
            }
            if (data['retcode'] === '0' && data.data && data.data['assetInfo']) {
              $.beanCount = data.data && data.data['assetInfo']['beanNum'];
            }
          } else {
            $.log('京东服务器返回空数据');
          }
        }
      } catch (e) {
        $.logErr(e)
      } finally {
        resolve();
      }
    })
  })
}
function getJingBeanBalanceDetail(page) {
  return new Promise(async resolve => {
    const options = {
      "url": `https://api.m.jd.com/client.action?functionId=getJingBeanBalanceDetail`,
      "body": `body=${escape(JSON.stringify({"pageSize": "20", "page": page.toString()}))}&appid=ld`,
      "headers": {
        'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        'Host': 'api.m.jd.com',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': cookie,
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            // console.log(data)
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
function queryexpirejingdou() {
  return new Promise(async resolve => {
    const options = {
      "url": `https://wq.jd.com/activep3/singjd/queryexpirejingdou?_=${Date.now()}&g_login_type=1&sceneval=2`,
      "headers": {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Host": "wq.jd.com",
        "Referer": "https://wqs.jd.com/promote/201801/bean/mybean.html",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.1 Mobile/15E148 Safari/604.1"
      }
    }
    $.expirejingdou = 0;
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            // console.log(data)
            data = JSON.parse(data.slice(23, -13));
            // console.log(data)
            if (data.ret === 0) {
              data['expirejingdou'].map(item => {
                console.log(`${timeFormat(item['time'] * 1000)}日过期京豆：${item['expireamount']}\n`);
              })
              $.expirejingdou = data['expirejingdou'][0]['expireamount'];
              // if ($.expirejingdou > 0) {
              //   $.message += `\n今日将过期：${$.expirejingdou}京豆 🐶`;
              // }
            }
          } else {
            console.log(`京东服务器返回空数据`)
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
function redPacket() {
  return new Promise(async resolve => {
    const options = {
      "url": `https://m.jingxi.com/user/info/QueryUserRedEnvelopesV2?type=1&orgFlag=JD_PinGou_New&page=1&cashRedType=1&redBalanceFlag=1&channel=1&_=${+new Date()}&sceneval=2&g_login_type=1&g_ty=ls`,
      "headers": {
        'Host': 'm.jingxi.com',
        'Accept': '*/*',
        'Connection': 'keep-alive',
        'Accept-Language': 'zh-cn',
        'Referer': 'https://st.jingxi.com/my/redpacket.shtml?newPg=App&jxsid=16156262265849285961',
        'Accept-Encoding': 'gzip, deflate, br',
        "Cookie": cookie,
        'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data).data
            $.jxRed = 0, $.jsRed = 0, $.jdRed = 0, $.jdhRed = 0, $.jxRedExpire = 0, $.jsRedExpire = 0, $.jdRedExpire = 0, $.jdhRedExpire = 0;
            let t = new Date()
            t.setDate(t.getDate() + 1)
            t.setHours(0, 0, 0, 0)
            t = parseInt((t - 1) / 1000)
            for (let vo of data.useRedInfo.redList || []) {
              if (vo.orgLimitStr && vo.orgLimitStr.includes("京喜")) {
                $.jxRed += parseFloat(vo.balance)
                if (vo['endTime'] === t) {
                  $.jxRedExpire += parseFloat(vo.balance)
                }
              } else if (vo.activityName.includes("极速版")) {
                $.jsRed += parseFloat(vo.balance)
                if (vo['endTime'] === t) {
                  $.jsRedExpire += parseFloat(vo.balance)
                }
              } else if (vo.orgLimitStr && vo.orgLimitStr.includes("京东健康")) {
                $.jdhRed += parseFloat(vo.balance)
                if (vo['endTime'] === t) {
                  $.jdhRedExpire += parseFloat(vo.balance)
                }
              } else {
                $.jdRed += parseFloat(vo.balance)
                if (vo['endTime'] === t) {
                  $.jdRedExpire += parseFloat(vo.balance)
                }
              }
            }
            $.jxRed = $.jxRed.toFixed(2)
            $.jsRed = $.jsRed.toFixed(2)
            $.jdRed = $.jdRed.toFixed(2)
            $.jdhRed = $.jdhRed.toFixed(2)
            $.balance = data.balance
            $.expiredBalance = ($.jxRedExpire + $.jsRedExpire + $.jdRedExpire).toFixed(2)
            $.message += `\n当前总红包：${$.balance}(今日总过期${$.expiredBalance})元 🧧\n京喜红包：${$.jxRed}(今日将过期${$.jxRedExpire.toFixed(2)})元 🧧\n极速红包：${$.jsRed}(今日将过期${$.jsRedExpire.toFixed(2)})元 🧧\n京东红包：${$.jdRed}(今日将过期${$.jdRedExpire.toFixed(2)})元 🧧\n健康红包：${$.jdhRed}(今日将过期${$.jdhRedExpire.toFixed(2)})元 🧧`;
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
      return [];
    }
  }
}
function timeFormat(time) {
  let date;
  if (time) {
    date = new Date(time)
  } else {
    date = new Date();
  }
  return date.getFullYear() + '-' + ((date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)) + '-' + (date.getDate() >= 10 ? date.getDate() : '0' + date.getDate());
}
// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}

//农场代码

async function jdFruit() {
    subTitle = `【动动账号${$.index}】${$.nickName}`;
    try {
      await initForFarm();
      if ($.farmInfo.farmUserPro) {
        // option['media-url'] = $.farmInfo.farmUserPro.goodsImage;
        message = message +  "<font color=\'#778899\' size=1>【水果名称】 " + `${$.farmInfo.farmUserPro.name}` + "</font>\n\n";
        // message +=  "<font color=\'#778899\' size=1>【已兑换水果】" + `${$.farmInfo.farmUserPro.winTimes}` +  "次</font>\n\n";
        that.log(`\n【动动账号${$.index}（${$.nickName || $.UserName}）的${$.name}好友互助码】${$.farmInfo.farmUserPro.shareCode}\n`);
        that.log(`\n【已成功兑换水果】${$.farmInfo.farmUserPro.winTimes}次\n`);
        await getHelp();
        await masterHelpShare();//助力好友
         await setHelp();
        if ($.farmInfo.treeState === 2 || $.farmInfo.treeState === 3) {
          option['open-url'] = urlSchema;
          message = message + "<font color=\'#778899\' size=1> " +  $.UserName + "\n【提醒⏰】" + fruitName + "已可领取\n请去动动APP或微信小程序查看\n点击弹窗即达</font>"
          $.msg($.name, ``, `【动动账号${$.index}】${$.nickName || $.UserName}\n【提醒⏰】${$.farmInfo.farmUserPro.name}已可领取\n请去动动APP或微信小程序查看\n点击弹窗即达`, option);
          if ($.isNode()) {
            await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName}水果已可领取`, `【动动账号${$.index}】${$.nickName || $.UserName}\n【提醒⏰】${$.farmInfo.farmUserPro.name}已可领取\n请去动动APP或微信小程序查看`);
          }
          return
        } else if ($.farmInfo.treeState === 1) {
          that.log(`\n${$.farmInfo.farmUserPro.name}种植中...\n`)
        } else if ($.farmInfo.treeState === 0) {
          //已下单购买, 但未开始种植新的水果
          option['open-url'] = urlSchema;
          $.msg($.name, ``, `【动动账号${$.index}】 ${$.nickName || $.UserName}\n【提醒⏰】您忘了种植新的水果\n请去动动APP或微信小程序选购并种植新的水果\n点击弹窗即达`, option);
          message = message + "<font color=\'#778899\' size=1> " +  $.UserName + " \n【提醒⏰】您忘了种植新的水果\n请去动动APP或微信小程序选购并种植新的水果\n点击弹窗即达" + "</font>"
          if ($.isNode()) {
            await notify.sendNotify(`${$.name} - 您忘了种植新的水果`, `动动账号${$.index} ${$.nickName}\n【提醒⏰】您忘了种植新的水果\n请去动动APP或微信小程序选购并种植新的水果`);
          }
          return
        }
        await doDailyTask();
        await doTenWater();//浇水十次
        await getFirstWaterAward();//领取首次浇水奖励
        await getTenWaterAward();//领取10浇水奖励
        await getWaterFriendGotAward();//领取为2好友浇水奖励
        await duck();
        await doTenWaterAgain();//再次浇水
        await predictionFruit();//预测水果成熟时间
      } else {
        that.log(`初始化农场数据异常, 请登录动动 app查看农场0元水果功能是否正常,农场初始化数据: ${JSON.stringify($.farmInfo)}`);
           }
    } catch (e) {
      that.log(`任务执行异常，请检查执行日志 ‼️‼️`);
      $.logErr(e);
    }
  }
  async function doDailyTask() {
    await taskInitForFarm();
    that.log(`开始签到`);
    if (!$.farmTask.signInit.todaySigned) {
      await signForFarm(); //签到
      if ($.signResult.code === "0") {
        that.log(`【签到成功】获得${$.signResult.amount}g💧\\n`)
        //message += `【签到成功】获得${$.signResult.amount}g💧\n`//连续签到${signResult.signDay}天
      } else {
        // message += `签到失败,详询日志\n`;
        that.log(`签到结果:  ${JSON.stringify($.signResult)}`);
      }
    } else {
      that.log(`今天已签到,连续签到${$.farmTask.signInit.totalSigned},下次签到可得${$.farmTask.signInit.signEnergyEachAmount}g\n`);
    }
    // 被水滴砸中
    that.log(`被水滴砸中： ${$.farmInfo.todayGotWaterGoalTask.canPop ? '是' : '否'}`);
    if ($.farmInfo.todayGotWaterGoalTask.canPop) {
      await gotWaterGoalTaskForFarm();
      if ($.goalResult.code === '0') {
        that.log(`【被水滴砸中】获得${$.goalResult.addEnergy}g💧\\n`);
        // message += `【被水滴砸中】获得${$.goalResult.addEnergy}g💧\n`
      }
    }
    that.log(`签到结束,开始广告浏览任务`);
    if (!$.farmTask.gotBrowseTaskAdInit.f) {
      let adverts = $.farmTask.gotBrowseTaskAdInit.userBrowseTaskAds
      let browseReward = 0
      let browseSuccess = 0
      let browseFail = 0
      for (let advert of adverts) { //开始浏览广告
        if (advert.limit <= advert.hadFinishedTimes) {
          // browseReward+=advert.reward
          that.log(`${advert.mainTitle}+ ' 已完成`);//,获得${advert.reward}g
          continue;
        }
        that.log('正在进行广告浏览任务: ' + advert.mainTitle);
        await browseAdTaskForFarm(advert.advertId, 0);
        if ($.browseResult.code === '0') {
          that.log(`${advert.mainTitle}浏览任务完成`);
          //领取奖励
          await browseAdTaskForFarm(advert.advertId, 1);
          if ($.browseRwardResult.code === '0') {
            that.log(`领取浏览${advert.mainTitle}广告奖励成功,获得${$.browseRwardResult.amount}g`)
            browseReward += $.browseRwardResult.amount
            browseSuccess++
          } else {
            browseFail++
            that.log(`领取浏览广告奖励结果:  ${JSON.stringify($.browseRwardResult)}`)
          }
        } else {
          browseFail++
          that.log(`广告浏览任务结果:   ${JSON.stringify($.browseResult)}`);
        }
      }
      if (browseFail > 0) {
        that.log(`【广告浏览】完成${browseSuccess}个,失败${browseFail},获得${browseReward}g💧\\n`);
        // message += `【广告浏览】完成${browseSuccess}个,失败${browseFail},获得${browseReward}g💧\n`;
      } else {
        that.log(`【广告浏览】完成${browseSuccess}个,获得${browseReward}g💧\n`);
        // message += `【广告浏览】完成${browseSuccess}个,获得${browseReward}g💧\n`;
      }
    } else {
      that.log(`今天已经做过浏览广告任务\n`);
    }
    //定时领水
    if (!$.farmTask.gotThreeMealInit.f) {
      //
      await gotThreeMealForFarm();
      if ($.threeMeal.code === "0") {
        that.log(`【定时领水】获得${$.threeMeal.amount}g💧\n`);
        // message += `【定时领水】获得${$.threeMeal.amount}g💧\n`;
      } else {
        // message += `【定时领水】失败,详询日志\n`;
        that.log(`定时领水成功结果:  ${JSON.stringify($.threeMeal)}`);
      }
    } else {
      that.log('当前不在定时领水时间断或者已经领过\n')
    }
    //给好友浇水
    if (!$.farmTask.waterFriendTaskInit.f) {
      if ($.farmTask.waterFriendTaskInit.waterFriendCountKey < $.farmTask.waterFriendTaskInit.waterFriendMax) {
        await doFriendsWater();
      }
    } else {
      that.log(`给${$.farmTask.waterFriendTaskInit.waterFriendMax}个好友浇水任务已完成\n`)
    }
    // await Promise.all([
    //   clockInIn(),//打卡领水
    //   executeWaterRains(),//水滴雨
    //   masterHelpShare(),//助力好友
    //   getExtraAward(),//领取额外水滴奖励
    //   turntableFarm()//天天抽奖得好礼
    // ])
    // await getAwardInviteFriend();
    await clockInIn();//打卡领水
    await executeWaterRains();//水滴雨
    await getExtraAward();//领取额外水滴奖励
    await turntableFarm()//天天抽奖得好礼
  }
  async function predictionFruit() {
    that.log('开始预测水果成熟时间\n');
    await initForFarm();
    await taskInitForFarm();
    let waterEveryDayT = $.farmTask.totalWaterTaskInit.totalWaterTaskTimes;//今天到到目前为止，浇了多少次水
      // message +=  "<font color=\'#778899\' size=1>【今日共浇水】" + `${waterEveryDayT}` + "次 </font>\n\n"
      message += "<font color=\'#778899\' size=1>【剩余 水滴】" + `${$.farmInfo.farmUserPro.totalEnergy}` + "g💧 </font> \n\n"
      message += "<font color=\'#778899\' size=1>【水果🍉进度】" + `${(($.farmInfo.farmUserPro.treeEnergy /
      $.farmInfo.farmUserPro.treeTotalEnergy) * 100).toFixed(2)}` + "%，已浇水" +`${$.farmInfo.farmUserPro.treeEnergy / 10}` + "次,还需"+`${($.farmInfo.farmUserPro.treeTotalEnergy - $.farmInfo.farmUserPro.treeEnergy) / 10}` +"次 </font> \n\n"
    if ($.farmInfo.toFlowTimes > ($.farmInfo.farmUserPro.treeEnergy / 10)) {
      message += "<font color=\'#778899\' size=1>【水果🍉进度】" + `【开花进度】再浇水${$.farmInfo.toFlowTimes - $.farmInfo.farmUserPro.treeEnergy / 10}次开花\n\n` +"</font>\n\n"
    } else if ($.farmInfo.toFruitTimes > ($.farmInfo.farmUserPro.treeEnergy / 10)) {
      message += "<font color=\'#778899\' size=1>【水果🍉进度】" + `【结果进度】再浇水${$.farmInfo.toFruitTimes - $.farmInfo.farmUserPro.treeEnergy / 10}次结果\n\n` + "</font>\n\n"
    }
    // 预测n天后水果课可兑换功能
    let waterTotalT = ($.farmInfo.farmUserPro.treeTotalEnergy - $.farmInfo.farmUserPro.treeEnergy - $.farmInfo.farmUserPro.totalEnergy) / 10;//一共还需浇多少次水
  
    let waterD = Math.ceil(waterTotalT / waterEveryDayT);
  
    message = message + "<font color=\'#BA55D3\' size=1>" + `【预测🍉收获时间】${waterD === 1 ? '明天' : waterD === 2 ? '后天' : waterD + '天之后'}(${timeFormat(24 * 60 * 60 * 1000 * waterD + Date.now())}日)可兑换水果🍉` +"</font>\n\n";
  }
  //浇水十次
  async function doTenWater() {
    jdFruitBeanCard = $.getdata('jdFruitBeanCard') ? $.getdata('jdFruitBeanCard') : jdFruitBeanCard;
    if ($.isNode() && process.env.FRUIT_BEAN_CARD) {
      jdFruitBeanCard = process.env.FRUIT_BEAN_CARD;
    }
    await myCardInfoForFarm();
    const { fastCard, doubleCard, beanCard, signCard  } = $.myCardInfoRes;
    if (`${jdFruitBeanCard}` === 'true' && JSON.stringify($.myCardInfoRes).match(`限时翻倍`) && beanCard > 0) {
      that.log(`您设置的是使用水滴换豆卡，且背包有水滴换豆卡${beanCard}张, 跳过10次浇水任务`)
      return
    }
    if ($.farmTask.totalWaterTaskInit.totalWaterTaskTimes < $.farmTask.totalWaterTaskInit.totalWaterTaskLimit) {
      that.log(`\n准备浇水十次`);
      let waterCount = 0;
      isFruitFinished = false;
      for (; waterCount < $.farmTask.totalWaterTaskInit.totalWaterTaskLimit - $.farmTask.totalWaterTaskInit.totalWaterTaskTimes; waterCount++) {
        that.log(`第${waterCount + 1}次浇水`);
        await waterGoodForFarm();
        that.log(`本次浇水结果:   ${JSON.stringify($.waterResult)}`);
        if ($.waterResult.code === '0') {
          that.log(`剩余水滴${$.waterResult.totalEnergy}g`);
          if ($.waterResult.finished) {
            // 已证实，waterResult.finished为true，表示水果可以去领取兑换了
            isFruitFinished = true;
            break
          } else {
            if ($.waterResult.totalEnergy < 10) {
              that.log(`水滴不够，结束浇水`)
              break
            }
            await gotStageAward();//领取阶段性水滴奖励
          }
        } else {
          that.log('浇水出现失败异常,跳出不在继续浇水')
          break;
        }
      }
      if (isFruitFinished) {
        option['open-url'] = urlSchema;
        $.msg($.name, ``, `【动动账号${$.index}】${$.nickName || $.UserName}\n【提醒⏰】${$.farmInfo.farmUserPro.name}已可领取\n请去动动APP或微信小程序查看\n点击弹窗即达`, option);
        $.done();
        if ($.isNode()) {
          await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName || $.UserName}水果已可领取`, `动动账号${$.index} ${$.nickName}\n${$.farmInfo.farmUserPro.name}已可领取`);
        }
      }
    } else {
      that.log('\n今日已完成10次浇水任务\n');
    }
  }
  //领取首次浇水奖励
  async function getFirstWaterAward() {
    await taskInitForFarm();
    //领取首次浇水奖励
    if (!$.farmTask.firstWaterInit.f && $.farmTask.firstWaterInit.totalWaterTimes > 0) {
      await firstWaterTaskForFarm();
      if ($.firstWaterReward.code === '0') {
        that.log(`【首次浇水奖励】获得${$.firstWaterReward.amount}g💧\n`);
        // message += `【首次浇水奖励】获得${$.firstWaterReward.amount}g💧\n`;
      } else {
        // message += '【首次浇水奖励】领取奖励失败,详询日志\n';
        that.log(`领取首次浇水奖励结果:  ${JSON.stringify($.firstWaterReward)}`);
      }
    } else {
      that.log('首次浇水奖励已领取\n')
    }
  }
  //领取十次浇水奖励
  async function getTenWaterAward() {
    //领取10次浇水奖励
    if (!$.farmTask.totalWaterTaskInit.f && $.farmTask.totalWaterTaskInit.totalWaterTaskTimes >= $.farmTask.totalWaterTaskInit.totalWaterTaskLimit) {
      await totalWaterTaskForFarm();
      if ($.totalWaterReward.code === '0') {
        that.log(`【十次浇水奖励】获得${$.totalWaterReward.totalWaterTaskEnergy}g💧\n`);
        // message += `【十次浇水奖励】获得${$.totalWaterReward.totalWaterTaskEnergy}g💧\n`;
      } else {
        // message += '【十次浇水奖励】领取奖励失败,详询日志\n';
        that.log(`领取10次浇水奖励结果:  ${JSON.stringify($.totalWaterReward)}`);
      }
    } else if ($.farmTask.totalWaterTaskInit.totalWaterTaskTimes < $.farmTask.totalWaterTaskInit.totalWaterTaskLimit) {
      // message += `【十次浇水奖励】任务未完成，今日浇水${$.farmTask.totalWaterTaskInit.totalWaterTaskTimes}次\n`;
      that.log(`【十次浇水奖励】任务未完成，今日浇水${$.farmTask.totalWaterTaskInit.totalWaterTaskTimes}次\n`);
    }
    that.log('finished 水果任务完成!');
  }
  //再次浇水
  async function doTenWaterAgain() {
    that.log('开始检查剩余水滴能否再次浇水再次浇水\n');
    await initForFarm();
    let totalEnergy  = $.farmInfo.farmUserPro.totalEnergy;
    that.log(`剩余水滴${totalEnergy}g\n`);
    await myCardInfoForFarm();
    const { fastCard, doubleCard, beanCard, signCard  } = $.myCardInfoRes;
    that.log(`背包已有道具:\n快速浇水卡:${fastCard === -1 ? '未解锁': fastCard + '张'}\n水滴翻倍卡:${doubleCard === -1 ? '未解锁': doubleCard + '张'}\n水滴换京豆卡:${beanCard === -1 ? '未解锁' : beanCard + '张'}\n加签卡:${signCard === -1 ? '未解锁' : signCard + '张'}\n`)
    if (totalEnergy >= 100 && doubleCard > 0) {
      //使用翻倍水滴卡
      for (let i = 0; i < new Array(doubleCard).fill('').length; i++) {
        await userMyCardForFarm('doubleCard');
        that.log(`使用翻倍水滴卡结果:${JSON.stringify($.userMyCardRes)}`);
      }
      await initForFarm();
      totalEnergy = $.farmInfo.farmUserPro.totalEnergy;
    }
    if (signCard > 0) {
      //使用加签卡
      for (let i = 0; i < new Array(signCard).fill('').length; i++) {
        await userMyCardForFarm('signCard');
        that.log(`使用加签卡结果:${JSON.stringify($.userMyCardRes)}`);
      }
      await initForFarm();
      totalEnergy = $.farmInfo.farmUserPro.totalEnergy;
    }
    jdFruitBeanCard = $.getdata('jdFruitBeanCard') ? $.getdata('jdFruitBeanCard') : jdFruitBeanCard;
    if ($.isNode() && process.env.FRUIT_BEAN_CARD) {
      jdFruitBeanCard = process.env.FRUIT_BEAN_CARD;
    }
    if (`${jdFruitBeanCard}` === 'true' && JSON.stringify($.myCardInfoRes).match('限时翻倍')) {
      that.log(`\n您设置的是水滴换豆功能,现在为您换豆`);
      if (totalEnergy >= 100 && $.myCardInfoRes.beanCard > 0) {
        //使用水滴换豆卡
        await userMyCardForFarm('beanCard');
        that.log(`使用水滴换豆卡结果:${JSON.stringify($.userMyCardRes)}`);
        if ($.userMyCardRes.code === '0') {
        //   message +="<font color=\'#BA55D3\' size=1>【水果🍉进度】" + `【水滴换豆卡】获得${$.userMyCardRes.beanCount}个京豆\n` + "</font>\n\n";
          return
        }
      } else {
        that.log(`您目前水滴:${totalEnergy}g,水滴换豆卡${$.myCardInfoRes.beanCard}张,暂不满足水滴换豆的条件,为您继续浇水`)
      }
    }
    // if (totalEnergy > 100 && $.myCardInfoRes.fastCard > 0) {
    //   //使用快速浇水卡
    //   await userMyCardForFarm('fastCard');
    //   that.log(`使用快速浇水卡结果:${JSON.stringify($.userMyCardRes)}`);
    //   if ($.userMyCardRes.code === '0') {
    //     that.log(`已使用快速浇水卡浇水${$.userMyCardRes.waterEnergy}g`);
    //   }
    //   await initForFarm();
    //   totalEnergy  = $.farmInfo.farmUserPro.totalEnergy;
    // }
    // 所有的浇水(10次浇水)任务，获取水滴任务完成后，如果剩余水滴大于等于60g,则继续浇水(保留部分水滴是用于完成第二天的浇水10次的任务)
    let overageEnergy = totalEnergy - retainWater;
    if (totalEnergy >= ($.farmInfo.farmUserPro.treeTotalEnergy - $.farmInfo.farmUserPro.treeEnergy)) {
      //如果现有的水滴，大于水果可兑换所需的对滴(也就是把水滴浇完，水果就能兑换了)
      isFruitFinished = false;
      for (let i = 0; i < ($.farmInfo.farmUserPro.treeTotalEnergy - $.farmInfo.farmUserPro.treeEnergy) / 10; i++) {
        await waterGoodForFarm();
        that.log(`本次浇水结果(水果马上就可兑换了):   ${JSON.stringify($.waterResult)}`);
        if ($.waterResult.code === '0') {
          that.log('\n浇水10g成功\n');
          if ($.waterResult.finished) {
            // 已证实，waterResult.finished为true，表示水果可以去领取兑换了
            isFruitFinished = true;
            break
          } else {
            that.log(`目前水滴【${$.waterResult.totalEnergy}】g,继续浇水，水果马上就可以兑换了`)
          }
        } else {
          that.log('浇水出现失败异常,跳出不在继续浇水')
          break;
        }
      }
      if (isFruitFinished) {
        option['open-url'] = urlSchema;
        $.msg($.name, ``, `【动动账号${$.index}】${$.nickName || $.UserName}\n【提醒⏰】${$.farmInfo.farmUserPro.name}已可领取\n请去动动APP或微信小程序查看\n点击弹窗即达`, option);
        $.done();
        if ($.isNode()) {
          await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName}水果已可领取`, `动动账号${$.index} ${$.nickName}\n${$.farmInfo.farmUserPro.name}已可领取`);
        }
      }
    } else if (overageEnergy >= 10) {
      that.log("目前剩余水滴：【" + totalEnergy + "】g，可继续浇水");
      isFruitFinished = false;
      for (let i = 0; i < parseInt(overageEnergy / 10); i++) {
        await waterGoodForFarm();
        that.log(`本次浇水结果:   ${JSON.stringify($.waterResult)}`);
        if ($.waterResult.code === '0') {
          that.log(`\n浇水10g成功,剩余${$.waterResult.totalEnergy}\n`)
          if ($.waterResult.finished) {
            // 已证实，waterResult.finished为true，表示水果可以去领取兑换了
            isFruitFinished = true;
            break
          } else {
            await gotStageAward()
          }
        } else {
          that.log('浇水出现失败异常,跳出不在继续浇水')
          break;
        }
      }
      if (isFruitFinished) {
        option['open-url'] = urlSchema;
        $.msg($.name, ``, `【动动账号${$.index}】${$.nickName || $.UserName}\n【提醒⏰】${$.farmInfo.farmUserPro.name}已可领取\n请去动动APP或微信小程序查看\n点击弹窗即达`, option);
        $.done();
        if ($.isNode()) {
          await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName}水果已可领取`, `动动账号${$.index} ${$.nickName}\n${$.farmInfo.farmUserPro.name}已可领取`);
        }
      }
    } else {
      that.log("目前剩余水滴：【" + totalEnergy + "】g,不再继续浇水,保留部分水滴用于完成第二天【十次浇水得水滴】任务")
    }
  }
  //领取阶段性水滴奖励
  function gotStageAward() {
    return new Promise(async resolve => {
      if ($.waterResult.waterStatus === 0 && $.waterResult.treeEnergy === 10) {
        that.log('果树发芽了,奖励30g水滴');
        await gotStageAwardForFarm('1');
        that.log(`浇水阶段奖励1领取结果 ${JSON.stringify($.gotStageAwardForFarmRes)}`);
        if ($.gotStageAwardForFarmRes.code === '0') {
          // message += `【果树发芽了】奖励${$.gotStageAwardForFarmRes.addEnergy}\n`;
          that.log(`【果树发芽了】奖励${$.gotStageAwardForFarmRes.addEnergy}\n`);
        }
      } else if ($.waterResult.waterStatus === 1) {
        that.log('果树开花了,奖励40g水滴');
        await gotStageAwardForFarm('2');
        that.log(`浇水阶段奖励2领取结果 ${JSON.stringify($.gotStageAwardForFarmRes)}`);
        if ($.gotStageAwardForFarmRes.code === '0') {
          // message += `【果树开花了】奖励${$.gotStageAwardForFarmRes.addEnergy}g💧\n`;
          that.log(`【果树开花了】奖励${$.gotStageAwardForFarmRes.addEnergy}g💧\n`);
        }
      } else if ($.waterResult.waterStatus === 2) {
        that.log('果树长出小果子啦, 奖励50g水滴');
        await gotStageAwardForFarm('3');
        that.log(`浇水阶段奖励3领取结果 ${JSON.stringify($.gotStageAwardForFarmRes)}`)
        if ($.gotStageAwardForFarmRes.code === '0') {
          // message += `【果树结果了】奖励${$.gotStageAwardForFarmRes.addEnergy}g💧\n`;
          that.log(`【果树结果了】奖励${$.gotStageAwardForFarmRes.addEnergy}g💧\n`);
        }
      }
      resolve()
    })
  }
  //天天抽奖活动
  async function turntableFarm() {
    await initForTurntableFarm();
    if ($.initForTurntableFarmRes.code === '0') {
      //领取定时奖励 //4小时一次
      let {timingIntervalHours, timingLastSysTime, sysTime, timingGotStatus, remainLotteryTimes, turntableInfos} = $.initForTurntableFarmRes;
  
      if (!timingGotStatus) {
        that.log(`是否到了领取免费赠送的抽奖机会----${sysTime > (timingLastSysTime + 60*60*timingIntervalHours*1000)}`)
        if (sysTime > (timingLastSysTime + 60*60*timingIntervalHours*1000)) {
          await timingAwardForTurntableFarm();
          that.log(`领取定时奖励结果${JSON.stringify($.timingAwardRes)}`);
          await initForTurntableFarm();
          remainLotteryTimes = $.initForTurntableFarmRes.remainLotteryTimes;
        } else {
          that.log(`免费赠送的抽奖机会未到时间`)
        }
      } else {
        that.log('4小时候免费赠送的抽奖机会已领取')
      }
      if ($.initForTurntableFarmRes.turntableBrowserAds && $.initForTurntableFarmRes.turntableBrowserAds.length > 0) {
        for (let index = 0; index < $.initForTurntableFarmRes.turntableBrowserAds.length; index++) {
          if (!$.initForTurntableFarmRes.turntableBrowserAds[index].status) {
            that.log(`开始浏览天天抽奖的第${index + 1}个逛会场任务`)
            await browserForTurntableFarm(1, $.initForTurntableFarmRes.turntableBrowserAds[index].adId);
            if ($.browserForTurntableFarmRes.code === '0' && $.browserForTurntableFarmRes.status) {
              that.log(`第${index + 1}个逛会场任务完成，开始领取水滴奖励\n`)
              await browserForTurntableFarm(2, $.initForTurntableFarmRes.turntableBrowserAds[index].adId);
              if ($.browserForTurntableFarmRes.code === '0') {
                that.log(`第${index + 1}个逛会场任务领取水滴奖励完成\n`)
                await initForTurntableFarm();
                remainLotteryTimes = $.initForTurntableFarmRes.remainLotteryTimes;
              }
            }
          } else {
            that.log(`浏览天天抽奖的第${index + 1}个逛会场任务已完成`)
          }
        }
      }
      //天天抽奖助力
      that.log('开始天天抽奖--好友助力--每人每天只有三次助力机会.')
      for (let code of newShareCodes) {
        if (code === $.farmInfo.farmUserPro.shareCode) {
          that.log('天天抽奖-不能自己给自己助力\n')
          continue
        }
        await lotteryMasterHelp(code);
        // that.log('天天抽奖助力结果',lotteryMasterHelpRes.helpResult)
        if ($.lotteryMasterHelpRes.helpResult.code === '0') {
          that.log(`天天抽奖-助力${$.lotteryMasterHelpRes.helpResult.masterUserInfo.nickName}成功\n`)
        } else if ($.lotteryMasterHelpRes.helpResult.code === '11') {
          that.log(`天天抽奖-不要重复助力${$.lotteryMasterHelpRes.helpResult.masterUserInfo.nickName}\n`)
        } else if ($.lotteryMasterHelpRes.helpResult.code === '13') {
          that.log(`天天抽奖-助力${$.lotteryMasterHelpRes.helpResult.masterUserInfo.nickName}失败,助力次数耗尽\n`);
          break;
        }
      }
      that.log(`---天天抽奖次数remainLotteryTimes----${remainLotteryTimes}次`)
      //抽奖
      if (remainLotteryTimes > 0) {
        that.log('开始抽奖')
        let lotteryResult = '';
        for (let i = 0; i < new Array(remainLotteryTimes).fill('').length; i++) {
          await lotteryForTurntableFarm()
          that.log(`第${i + 1}次抽奖结果${JSON.stringify($.lotteryRes)}`);
          if ($.lotteryRes.code === '0') {
            turntableInfos.map((item) => {
              if (item.type === $.lotteryRes.type) {
                that.log(`lotteryRes.type${$.lotteryRes.type}`);
                if ($.lotteryRes.type.match(/bean/g) && $.lotteryRes.type.match(/bean/g)[0] === 'bean') {
                  lotteryResult += `${item.name}个，`;
                } else if ($.lotteryRes.type.match(/water/g) && $.lotteryRes.type.match(/water/g)[0] === 'water') {
                  lotteryResult += `${item.name}，`;
                } else {
                  lotteryResult += `${item.name}，`;
                }
              }
            })
            //没有次数了
            if ($.lotteryRes.remainLotteryTimes === 0) {
              break
            }
          }
        }
        if (lotteryResult) {
          that.log(`【天天抽奖】${lotteryResult.substr(0, lotteryResult.length - 1)}\n`)
          // message += `【天天抽奖】${lotteryResult.substr(0, lotteryResult.length - 1)}\n`;
        }
      }  else {
        that.log('天天抽奖--抽奖机会为0次')
      }
    } else {
      that.log('初始化天天抽奖得好礼失败')
    }
  }
  //领取额外奖励水滴
  async function getExtraAward() {
    await masterHelpTaskInitForFarm();
    if ($.masterHelpResult.code === '0') {
      if ($.masterHelpResult.masterHelpPeoples && $.masterHelpResult.masterHelpPeoples.length >= 5) {
        // 已有五人助力。领取助力后的奖励
        if (!$.masterHelpResult.masterGotFinal) {
          await masterGotFinishedTaskForFarm();
          if ($.masterGotFinished.code === '0') {
            that.log(`已成功领取好友助力奖励：【${$.masterGotFinished.amount}】g水`);
            // message += "<font color=\'#778899\' size=1>【额外奖励】" + `${$.masterGotFinished.amount}` + "g水领取成功</font>\n\n";
          }
        } else {
          that.log("已经领取过5好友助力额外奖励");
        //   message += "<font color=\'#BA55D3\' size=1>【水果🍉进度】" + `【额外奖励】已被领取过\n` + "</font>\n\n";
        }
      } else {
        that.log("助力好友未达到5个");
        // message += "<font color=\'#778899\' size=1>【额外奖励】领取失败,原因：给您助力的人未达5个</font>\n\n";
      }
      if ($.masterHelpResult.masterHelpPeoples && $.masterHelpResult.masterHelpPeoples.length > 0) {
        let str = '';
        $.masterHelpResult.masterHelpPeoples.map((item, index) => {
          if (index === ($.masterHelpResult.masterHelpPeoples.length - 1)) {
            str += item.nickName || "匿名用户";
          } else {
            str += (item.nickName || "匿名用户") + ',';
          }
          let date = new Date(item.time);
          let time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getMinutes();
          that.log(`\n动动昵称【${item.nickName || "匿名用户"}】 在 ${time} 给您助过力\n`);
        })
        // message += "<font color=\'#778899\' size=1>【助力您的好友】 " + `${str}` +  "</font>\n\n"
      }
      that.log('领取额外奖励水滴结束\n');
    }
  }
  
  function getHelp() {
          newShareCodes = [];
          return new Promise(resolve => {
              $.get({
                  url: "http://api.tyh52.com/act/get/jd_fruit/3"
              }, (err, resp, data) => {
                  try {
                      if (data) {
                          data = JSON.parse(data);
                          if (data.code == 1) {
                              let list = data.data;
                              if (!(list instanceof Array)) {
                                  list = JSON.parse(list);
                              }
                              if (list.length > 0) {
                                  for (var i in list) {
                                      newShareCodes.push(list[i]);
                                  }
                              }
                          }
                      }
                  } catch (e) {
                      $.logErr(e, resp);
                  } finally {
                      resolve(data);
                  }
              })
          });
      }
  
      function setHelp() {
          return new Promise(resolve => {
              if ($.farmInfo.farmUserPro.shareCode) {
                  $.get({
                      url: "http://api.tyh52.com/act/set/jd_fruit/" + $.farmInfo.farmUserPro.shareCode
                  }, (err, resp, data) => {
                      try {
                          if (data) {
                              data = JSON.parse(data);
                              if (data.code == 1) {
                                  that.log("提交自己的邀請碼成功");
                              } else {
                                  that.log("提交邀请码失败，" + data.message);
                              }
                          }
                      } catch (e) {
                          $.logErr(e, resp);
                      } finally {
                          resolve(data);
                      }
                  })
              } else {
                  resolve();
              }
  
          });
      }
      
  //助力好友
  async function masterHelpShare() {
    that.log('开始助力好友')
    let salveHelpAddWater = 0;
    let remainTimes = 4;//今日剩余助力次数,默认4次（动动农场每人每天4次助力机会）。
    let helpSuccessPeoples = '';//成功助力好友
    that.log(`格式化后的助力码::${JSON.stringify(newShareCodes)}\n`);
  
    for (let code of newShareCodes) {
      that.log(`开始助力动动账号${$.index} - ${$.nickName}的好友: ${code}`);
      if (!code) continue;
      if (code === $.farmInfo.farmUserPro.shareCode) {
        that.log('不能为自己助力哦，跳过自己的shareCode\n')
        continue
      }
      await masterHelp(code);
      if ($.helpResult.code === '0') {
        if ($.helpResult.helpResult.code === '0') {
          //助力成功
          salveHelpAddWater += $.helpResult.helpResult.salveHelpAddWater;
          that.log(`【助力好友结果】: 已成功给【${$.helpResult.helpResult.masterUserInfo.nickName}】助力`);
          that.log(`给好友【${$.helpResult.helpResult.masterUserInfo.nickName}】助力获得${$.helpResult.helpResult.salveHelpAddWater}g水滴`)
          helpSuccessPeoples += ($.helpResult.helpResult.masterUserInfo.nickName || '匿名用户') + ',';
        } else if ($.helpResult.helpResult.code === '8') {
          that.log(`【助力好友结果】: 助力【${$.helpResult.helpResult.masterUserInfo.nickName}】失败，您今天助力次数已耗尽`);
        } else if ($.helpResult.helpResult.code === '9') {
          that.log(`【助力好友结果】: 之前给【${$.helpResult.helpResult.masterUserInfo.nickName}】助力过了`);
        } else if ($.helpResult.helpResult.code === '10') {
          that.log(`【助力好友结果】: 好友【${$.helpResult.helpResult.masterUserInfo.nickName}】已满五人助力`);
        } else {
          that.log(`助力其他情况：${JSON.stringify($.helpResult.helpResult)}`);
        }
        that.log(`【今日助力次数还剩】${$.helpResult.helpResult.remainTimes}次\n`);
        remainTimes = $.helpResult.helpResult.remainTimes;
        if ($.helpResult.helpResult.remainTimes === 0) {
          that.log(`您当前助力次数已耗尽，跳出助力`);
          break
        }
      } else {
        that.log(`助力失败::${JSON.stringify($.helpResult)}`);
      }
    }
    if (helpSuccessPeoples && helpSuccessPeoples.length > 0) {
    //   message += "<font color=\'#778899\' size=1> " + `【您助力的好友👬】${helpSuccessPeoples.substr(0, helpSuccessPeoples.length - 1)}\n` + "</font>\n\n";
    }
    if (salveHelpAddWater > 0) {
      // message += `【助力好友👬】获得${salveHelpAddWater}g💧\n`;
      that.log(`【助力好友👬】获得${salveHelpAddWater}g💧\n`);
    }
    // message += "<font color=\'#778899\' size=1>" + `【今日剩余助力👬】${remainTimes}次\n` + "</font>\n\n";
    that.log('助力好友结束，即将开始领取额外水滴奖励\n');
  }
  //水滴雨
  async function executeWaterRains() {
    let executeWaterRain = !$.farmTask.waterRainInit.f;
    if (executeWaterRain) {
      that.log(`水滴雨任务，每天两次，最多可得10g水滴`);
      that.log(`两次水滴雨任务是否全部完成：${$.farmTask.waterRainInit.f ? '是' : '否'}`);
      if ($.farmTask.waterRainInit.lastTime) {
        if (Date.now() < ($.farmTask.waterRainInit.lastTime + 3 * 60 * 60 * 1000)) {
          executeWaterRain = false;
          // message += `【第${$.farmTask.waterRainInit.winTimes + 1}次水滴雨】未到时间，请${new Date($.farmTask.waterRainInit.lastTime + 3 * 60 * 60 * 1000).toLocaleTimeString()}再试\n`;
          that.log(`\`【第${$.farmTask.waterRainInit.winTimes + 1}次水滴雨】未到时间，请${new Date($.farmTask.waterRainInit.lastTime + 3 * 60 * 60 * 1000).toLocaleTimeString()}再试\n`);
        }
      }
      if (executeWaterRain) {
        that.log(`开始水滴雨任务,这是第${$.farmTask.waterRainInit.winTimes + 1}次，剩余${2 - ($.farmTask.waterRainInit.winTimes + 1)}次`);
        await waterRainForFarm();
        that.log('水滴雨waterRain');
        if ($.waterRain.code === '0') {
          that.log('水滴雨任务执行成功，获得水滴：' + $.waterRain.addEnergy + 'g');
          that.log(`【第${$.farmTask.waterRainInit.winTimes + 1}次水滴雨】获得${$.waterRain.addEnergy}g水滴\n`);
          // message += `【第${$.farmTask.waterRainInit.winTimes + 1}次水滴雨】获得${$.waterRain.addEnergy}g水滴\n`;
        }
      }
    } else {
      // message += `【水滴雨】已全部完成，获得20g💧\n`;
    }
  }
  //打卡领水活动
  async function clockInIn() {
    that.log('开始打卡领水活动（签到，关注，领券）');
    await clockInInitForFarm();
    if ($.clockInInit.code === '0') {
      // 签到得水滴
      if (!$.clockInInit.todaySigned) {
        that.log('开始今日签到');
        await clockInForFarm();
        that.log(`打卡结果${JSON.stringify($.clockInForFarmRes)}`);
        if ($.clockInForFarmRes.code === '0') {
          // message += `【第${$.clockInForFarmRes.signDay}天签到】获得${$.clockInForFarmRes.amount}g💧\n`;
          that.log(`【第${$.clockInForFarmRes.signDay}天签到】获得${$.clockInForFarmRes.amount}g💧\n`)
          if ($.clockInForFarmRes.signDay === 7) {
            //可以领取惊喜礼包
            that.log('开始领取--惊喜礼包38g水滴');
            await gotClockInGift();
            if ($.gotClockInGiftRes.code === '0') {
              // message += `【惊喜礼包】获得${$.gotClockInGiftRes.amount}g💧\n`;
              that.log(`【惊喜礼包】获得${$.gotClockInGiftRes.amount}g💧\n`);
            }
          }
        }
      }
      if ($.clockInInit.todaySigned && $.clockInInit.totalSigned === 7) {
        that.log('开始领取--惊喜礼包38g水滴');
        await gotClockInGift();
        if ($.gotClockInGiftRes.code === '0') {
          // message += `【惊喜礼包】获得${$.gotClockInGiftRes.amount}g💧\n`;
          that.log(`【惊喜礼包】获得${$.gotClockInGiftRes.amount}g💧\n`);
        }
      }
      // 限时关注得水滴
      if ($.clockInInit.themes && $.clockInInit.themes.length > 0) {
        for (let item of $.clockInInit.themes) {
          if (!item.hadGot) {
            that.log(`关注ID${item.id}`);
            await clockInFollowForFarm(item.id, "theme", "1");
            that.log(`themeStep1--结果${JSON.stringify($.themeStep1)}`);
            if ($.themeStep1.code === '0') {
              await clockInFollowForFarm(item.id, "theme", "2");
              that.log(`themeStep2--结果${JSON.stringify($.themeStep2)}`);
              if ($.themeStep2.code === '0') {
                that.log(`关注${item.name}，获得水滴${$.themeStep2.amount}g`);
              }
            }
          }
        }
      }
      // 限时领券得水滴
      if ($.clockInInit.venderCoupons && $.clockInInit.venderCoupons.length > 0) {
        for (let item of $.clockInInit.venderCoupons) {
          if (!item.hadGot) {
            that.log(`领券的ID${item.id}`);
            await clockInFollowForFarm(item.id, "venderCoupon", "1");
            that.log(`venderCouponStep1--结果${JSON.stringify($.venderCouponStep1)}`);
            if ($.venderCouponStep1.code === '0') {
              await clockInFollowForFarm(item.id, "venderCoupon", "2");
              if ($.venderCouponStep2.code === '0') {
                that.log(`venderCouponStep2--结果${JSON.stringify($.venderCouponStep2)}`);
                that.log(`从${item.name}领券，获得水滴${$.venderCouponStep2.amount}g`);
              }
            }
          }
        }
      }
    }
    that.log('开始打卡领水活动（签到，关注，领券）结束\n');
  }
  //
  async function getAwardInviteFriend() {
    await friendListInitForFarm();//查询好友列表
    that.log(`查询好友列表数据：\n`)
    if ($.friendList) {
      that.log(`\n今日已邀请好友${$.friendList.inviteFriendCount}个 / 每日邀请上限${$.friendList.inviteFriendMax}个`);
      that.log(`开始删除${$.friendList.friends && $.friendList.friends.length}个好友,可拿每天的邀请奖励`);
      if ($.friendList.friends && $.friendList.friends.length > 0) {
        for (let friend of $.friendList.friends) {
          that.log(`\n开始删除好友 [${friend.shareCode}]`);
          const deleteFriendForFarm = await request('deleteFriendForFarm', { "shareCode": `${friend.shareCode}`,"version":8,"channel":1 });
          if (deleteFriendForFarm && deleteFriendForFarm.code === '0') {
            that.log(`删除好友 [${friend.shareCode}] 成功\n`);
          }
        }
      }
      await receiveFriendInvite();//为他人助力,接受邀请成为别人的好友
      if ($.friendList.inviteFriendCount > 0) {
        if ($.friendList.inviteFriendCount > $.friendList.inviteFriendGotAwardCount) {
          that.log('开始领取邀请好友的奖励');
          await awardInviteFriendForFarm();
          that.log(`领取邀请好友的奖励结果：：${JSON.stringify($.awardInviteFriendRes)}`);
        }
      } else {
        that.log('今日未邀请过好友')
      }
    } else {
      that.log(`查询好友列表失败\n`);
    }
  }
  //给好友浇水
  async function doFriendsWater() {
    await friendListInitForFarm();
    that.log('开始给好友浇水...');
    await taskInitForFarm();
    const { waterFriendCountKey, waterFriendMax } = $.farmTask.waterFriendTaskInit;
    that.log(`今日已给${waterFriendCountKey}个好友浇水`);
    if (waterFriendCountKey < waterFriendMax) {
      let needWaterFriends = [];
      if ($.friendList.friends && $.friendList.friends.length > 0) {
        $.friendList.friends.map((item, index) => {
          if (item.friendState === 1) {
            if (needWaterFriends.length < (waterFriendMax - waterFriendCountKey)) {
              needWaterFriends.push(item.shareCode);
            }
          }
        });
        //TODO ,发现bug,github action运行发现有些账号第一次没有给3个好友浇水
        that.log(`需要浇水的好友列表shareCodes:${JSON.stringify(needWaterFriends)}`);
        let waterFriendsCount = 0, cardInfoStr = '';
        for (let index = 0; index < needWaterFriends.length; index ++) {
          await waterFriendForFarm(needWaterFriends[index]);
          that.log(`为第${index+1}个好友浇水结果:${JSON.stringify($.waterFriendForFarmRes)}\n`)
          if ($.waterFriendForFarmRes.code === '0') {
            waterFriendsCount ++;
            if ($.waterFriendForFarmRes.cardInfo) {
              that.log('为好友浇水获得道具了');
              if ($.waterFriendForFarmRes.cardInfo.type === 'beanCard') {
                that.log(`获取道具卡:${$.waterFriendForFarmRes.cardInfo.rule}`);
                cardInfoStr += `水滴换豆卡,`;
              } else if ($.waterFriendForFarmRes.cardInfo.type === 'fastCard') {
                that.log(`获取道具卡:${$.waterFriendForFarmRes.cardInfo.rule}`);
                cardInfoStr += `快速浇水卡,`;
              } else if ($.waterFriendForFarmRes.cardInfo.type === 'doubleCard') {
                that.log(`获取道具卡:${$.waterFriendForFarmRes.cardInfo.rule}`);
                cardInfoStr += `水滴翻倍卡,`;
              } else if ($.waterFriendForFarmRes.cardInfo.type === 'signCard') {
                that.log(`获取道具卡:${$.waterFriendForFarmRes.cardInfo.rule}`);
                cardInfoStr += `加签卡,`;
              }
            }
          } else if ($.waterFriendForFarmRes.code === '11') {
            that.log('水滴不够,跳出浇水')
          }
        }
        // message += `【好友浇水】已给${waterFriendsCount}个好友浇水,消耗${waterFriendsCount * 10}g水\n`;
        that.log(`【好友浇水】已给${waterFriendsCount}个好友浇水,消耗${waterFriendsCount * 10}g水\n`);
        if (cardInfoStr && cardInfoStr.length > 0) {
          // message += `【好友浇水奖励】${cardInfoStr.substr(0, cardInfoStr.length - 1)}\n`;
          that.log(`【好友浇水奖励】${cardInfoStr.substr(0, cardInfoStr.length - 1)}\n`);
        }
      } else {
        that.log('您的好友列表暂无好友,快去邀请您的好友吧!')
      }
    } else {
      that.log(`今日已为好友浇水量已达${waterFriendMax}个`)
    }
  }
  //领取给3个好友浇水后的奖励水滴
  async function getWaterFriendGotAward() {
    await taskInitForFarm();
    const { waterFriendCountKey, waterFriendMax, waterFriendSendWater, waterFriendGotAward } = $.farmTask.waterFriendTaskInit
    if (waterFriendCountKey >= waterFriendMax) {
      if (!waterFriendGotAward) {
        await waterFriendGotAwardForFarm();
        that.log(`领取给${waterFriendMax}个好友浇水后的奖励水滴::${JSON.stringify($.waterFriendGotAwardRes)}`)
        if ($.waterFriendGotAwardRes.code === '0') {
          // message += `【给${waterFriendMax}好友浇水】奖励${$.waterFriendGotAwardRes.addWater}g水滴\n`;
          that.log(`【给${waterFriendMax}好友浇水】奖励${$.waterFriendGotAwardRes.addWater}g水滴\n`);
        }
      } else {
        that.log(`给好友浇水的${waterFriendSendWater}g水滴奖励已领取\n`);
        // message += `【给${waterFriendMax}好友浇水】奖励${waterFriendSendWater}g水滴已领取\n`;
      }
    } else {
      that.log(`暂未给${waterFriendMax}个好友浇水\n`);
    }
  }
  //接收成为对方好友的邀请
  async function receiveFriendInvite() {
    for (let code of newShareCodes) {
      if (code === $.farmInfo.farmUserPro.shareCode) {
        that.log('自己不能邀请自己成为好友噢\n')
        continue
      }
      await inviteFriend(code);
      // that.log(`接收邀请成为好友结果:${JSON.stringify($.inviteFriendRes.helpResult)}`)
      if ($.inviteFriendRes.helpResult.code === '0') {
        that.log(`接收邀请成为好友结果成功,您已成为${$.inviteFriendRes.helpResult.masterUserInfo.nickName}的好友`)
      } else if ($.inviteFriendRes.helpResult.code === '17') {
        that.log(`接收邀请成为好友结果失败,对方已是您的好友`)
      }
    }
    // that.log(`开始接受6fbd26cc27ac44d6a7fed34092453f77的邀请\n`)
    // await inviteFriend('6fbd26cc27ac44d6a7fed34092453f77');
    // that.log(`接收邀请成为好友结果:${JSON.stringify($.inviteFriendRes.helpResult)}`)
    // if ($.inviteFriendRes.helpResult.code === '0') {
    //   that.log(`您已成为${$.inviteFriendRes.helpResult.masterUserInfo.nickName}的好友`)
    // } else if ($.inviteFriendRes.helpResult.code === '17') {
    //   that.log(`对方已是您的好友`)
    // }
  }
  async function duck() {
    for (let i = 0; i < 10; i++) {
      //这里循环十次
      await getFullCollectionReward();
      if ($.duckRes.code === '0') {
        if (!$.duckRes.hasLimit) {
          that.log(`小鸭子游戏:${$.duckRes.title}`);
          // if ($.duckRes.type !== 3) {
          //   that.log(`${$.duckRes.title}`);
          //   if ($.duckRes.type === 1) {
          //     message += `【小鸭子】为你带回了水滴\n`;
          //   } else if ($.duckRes.type === 2) {
          //     message += `【小鸭子】为你带回快速浇水卡\n`
          //   }
          // }
        } else {
          that.log(`${$.duckRes.title}`)
          break;
        }
      } else if ($.duckRes.code === '10') {
        that.log(`小鸭子游戏达到上限`)
        break;
      }
    }
  }
  // ========================API调用接口========================
  //鸭子，点我有惊喜
  async function getFullCollectionReward() {
    return new Promise(resolve => {
      const body = {"type": 2, "version": 6, "channel": 2};
      $.post(taskUrl("getFullCollectionReward", body), (err, resp, data) => {
        try {
          if (err) {
            that.log('\n动动农场: API查询请求失败 ‼️‼️');
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
      })
    })
  }
  
  /**
   * 领取10次浇水奖励API
   */
  async function totalWaterTaskForFarm() {
    const functionId = 'totalWaterTaskForFarm';
    $.totalWaterReward = await request(functionId);
  }
  //领取首次浇水奖励API
  async function firstWaterTaskForFarm() {
    const functionId = 'firstWaterTaskForFarm';
    $.firstWaterReward = await request(functionId);
  }
  //领取给3个好友浇水后的奖励水滴API
  async function waterFriendGotAwardForFarm() {
    const functionId = 'waterFriendGotAwardForFarm';
    $.waterFriendGotAwardRes = await request(functionId, {"version": 4, "channel": 1});
  }
  // 查询背包道具卡API
  async function myCardInfoForFarm() {
    const functionId = 'myCardInfoForFarm';
    $.myCardInfoRes = await request(functionId, {"version": 5, "channel": 1});
  }
  //使用道具卡API
  async function userMyCardForFarm(cardType) {
    const functionId = 'userMyCardForFarm';
    $.userMyCardRes = await request(functionId, {"cardType": cardType});
  }
  /**
   * 领取浇水过程中的阶段性奖励
   * @param type
   * @returns {Promise<void>}
   */
  async function gotStageAwardForFarm(type) {
    $.gotStageAwardForFarmRes = await request('gotStageAwardForFarm', {'type': type});
  }
  //浇水API
  async function waterGoodForFarm() {
    await $.wait(1000);
    that.log('等待了1秒');
  
    const functionId = 'waterGoodForFarm';
    $.waterResult = await request(functionId);
  }
  // 初始化集卡抽奖活动数据API
  async function initForTurntableFarm() {
    $.initForTurntableFarmRes = await request('initForTurntableFarm', {version: 4, channel: 1});
  }
  async function lotteryForTurntableFarm() {
    await $.wait(2000);
    that.log('等待了2秒');
    $.lotteryRes = await request('lotteryForTurntableFarm', {type: 1, version: 4, channel: 1});
  }
  
  async function timingAwardForTurntableFarm() {
    $.timingAwardRes = await request('timingAwardForTurntableFarm', {version: 4, channel: 1});
  }
  
  async function browserForTurntableFarm(type, adId) {
    if (type === 1) {
      that.log('浏览爆品会场');
    }
    if (type === 2) {
      that.log('天天抽奖浏览任务领取水滴');
    }
    const body = {"type": type,"adId": adId,"version":4,"channel":1};
    $.browserForTurntableFarmRes = await request('browserForTurntableFarm', body);
    // 浏览爆品会场8秒
  }
  //天天抽奖浏览任务领取水滴API
  async function browserForTurntableFarm2(type) {
    const body = {"type":2,"adId": type,"version":4,"channel":1};
    $.browserForTurntableFarm2Res = await request('browserForTurntableFarm', body);
  }
  /**
   * 天天抽奖拿好礼-助力API(每人每天三次助力机会)
   */
  async function lotteryMasterHelp() {
    $.lotteryMasterHelpRes = await request(`initForFarm`, {
      imageUrl: "",
      nickName: "",
      shareCode: arguments[0] + '-3',
      babelChannel: "3",
      version: 4,
      channel: 1
    });
  }
  
  //领取5人助力后的额外奖励API
  async function masterGotFinishedTaskForFarm() {
    const functionId = 'masterGotFinishedTaskForFarm';
    $.masterGotFinished = await request(functionId);
  }
  //助力好友信息API
  async function masterHelpTaskInitForFarm() {
    const functionId = 'masterHelpTaskInitForFarm';
    $.masterHelpResult = await request(functionId);
  }
  //接受对方邀请,成为对方好友的API
  async function inviteFriend() {
    $.inviteFriendRes = await request(`initForFarm`, {
      imageUrl: "",
      nickName: "",
      shareCode: arguments[0] + '-inviteFriend',
      version: 4,
      channel: 2
    });
  }
  // 助力好友API
  async function masterHelp() {
    $.helpResult = await request(`initForFarm`, {
      imageUrl: "",
      nickName: "",
      shareCode: arguments[0],
      babelChannel: "3",
      version: 2,
      channel: 1
    });
  }
  /**
   * 水滴雨API
   */
  async function waterRainForFarm() {
    const functionId = 'waterRainForFarm';
    const body = {"type": 1, "hongBaoTimes": 100, "version": 3};
    $.waterRain = await request(functionId, body);
  }
  /**
   * 打卡领水API
   */
  async function clockInInitForFarm() {
    const functionId = 'clockInInitForFarm';
    $.clockInInit = await request(functionId);
  }
  
  // 连续签到API
  async function clockInForFarm() {
    const functionId = 'clockInForFarm';
    $.clockInForFarmRes = await request(functionId, {"type": 1});
  }
  
  //关注，领券等API
  async function clockInFollowForFarm(id, type, step) {
    const functionId = 'clockInFollowForFarm';
    let body = {
      id,
      type,
      step
    }
    if (type === 'theme') {
      if (step === '1') {
        $.themeStep1 = await request(functionId, body);
      } else if (step === '2') {
        $.themeStep2 = await request(functionId, body);
      }
    } else if (type === 'venderCoupon') {
      if (step === '1') {
        $.venderCouponStep1 = await request(functionId, body);
      } else if (step === '2') {
        $.venderCouponStep2 = await request(functionId, body);
      }
    }
  }
  
  // 领取连续签到7天的惊喜礼包API
  async function gotClockInGift() {
    $.gotClockInGiftRes = await request('clockInForFarm', {"type": 2})
  }
  
  //定时领水API
  async function gotThreeMealForFarm() {
    const functionId ='gotThreeMealForFarm';
    $.threeMeal = await request(functionId);
  }
  /**
   * 浏览广告任务API
   * type为0时, 完成浏览任务
   * type为1时, 领取浏览任务奖励
   */
  async function browseAdTaskForFarm(advertId, type) {
    const functionId = 'browseAdTaskForFarm';
    if (type === 0) {
      $.browseResult = await request(functionId, {advertId, type});
    } else if (type === 1) {
      $.browseRwardResult = await request(functionId, {advertId, type});
    }
  }
  // 被水滴砸中API
  async function gotWaterGoalTaskForFarm() {
    $.goalResult = await request('gotWaterGoalTaskForFarm', {type: 3});
  }
  //签到API
  async function signForFarm() {
    const functionId = 'signForFarm';
    $.signResult = await request(functionId);
  }
  /**
   * 初始化农场, 可获取果树及用户信息API
   */
  async function initForFarm() {
    return new Promise(resolve => {
      const option =  {
        url: `${JD_API_HOST}?functionId=initForFarm`,
        body: `body=${escape(JSON.stringify({"version":4}))}&appid=wh5&clientVersion=9.1.0`,
        headers: {
          "accept": "*/*",
          "accept-encoding": "gzip, deflate, br",
          "accept-language": "zh-CN,zh;q=0.9",
          "cache-control": "no-cache",
          "cookie": cookie,
          "origin": "https://home.m.jd.com",
          "pragma": "no-cache",
          "referer": "https://home.m.jd.com/myJd/newhome.action",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
          "Content-Type": "application/x-www-form-urlencoded"
        },
        timeout: 10000,
      };
      $.post(option, (err, resp, data) => {
        try {
          if (err) {
            that.log('\n动动农场: API查询请求失败 ‼️‼️');
            that.log(JSON.stringify(err));
            $.logErr(err);
          } else {
            if (safeGet(data)) {
              $.farmInfo = JSON.parse(data)
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
  
  // 初始化任务列表API
  async function taskInitForFarm() {
    that.log('\n初始化任务列表')
    const functionId = 'taskInitForFarm';
    $.farmTask = await request(functionId);
  }
  //获取好友列表API
  async function friendListInitForFarm() {
    $.friendList = await request('friendListInitForFarm', {"version": 4, "channel": 1});
    // that.log('aa', aa);
  }
  // 领取邀请好友的奖励API
  async function awardInviteFriendForFarm() {
    $.awardInviteFriendRes = await request('awardInviteFriendForFarm');
  }
  //为好友浇水API
  async function waterFriendForFarm(shareCode) {
    const body = {"shareCode": shareCode, "version": 6, "channel": 1}
    $.waterFriendForFarmRes = await request('waterFriendForFarm', body);
  }
  
  
  function readShareCode() {
    return new Promise(async resolve => {
      $.get({url: `http://jd.turinglabs.net/api/v2/jd/farm/read/${randomCount}/`, timeout: 10000,}, (err, resp, data) => {
        try {
          if (err) {
            that.log(`${JSON.stringify(err)}`)
            that.log(`${$.name} API请求失败，请检查网路重试`)
          } else {
            if (data) {
              that.log(`随机取个${randomCount}码放到您固定的互助码后面(不影响已有固定互助)`)
              data = JSON.parse(data);
            }
          }
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve(data);
        }
      })
      await $.wait(10000);
      resolve()
    })
  }
  function shareCodesFormat() {
    return new Promise(async resolve => {
      // that.log(`第${$.index}个动动账号的助力码:::${jdFruitShareArr[$.index - 1]}`)
      newShareCodes = [];
      // if (jdFruitShareArr[$.index - 1]) {
      //   newShareCodes = jdFruitShareArr[$.index - 1].split('@');
      // } else {
      //   that.log(`由于您第${$.index}个动动账号未提供shareCode,将采纳本脚本自带的助力码\n`)
      //   const tempIndex = $.index > shareCodes.length ? (shareCodes.length - 1) : ($.index - 1);
      //   newShareCodes = shareCodes[tempIndex].split('@');
      // }
      // const readShareCodeRes = await readShareCode();
      // if (readShareCodeRes && readShareCodeRes.code === 200) {
      //   // newShareCodes = newShareCodes.concat(readShareCodeRes.data || []);
      //   newShareCodes = [...new Set([...newShareCodes, ...(readShareCodeRes.data || [])])];
      // }
      // that.log(`第${$.index}个动动账号将要助力的好友${JSON.stringify(newShareCodes)}`)
      resolve();
    })
  }

  function request(function_id, body = {}, timeout = 1000){
    return new Promise(resolve => {
      setTimeout(() => {
        $.get(taskUrl(function_id, body), (err, resp, data) => {
          try {
            if (err) {
              that.log('\n动动农场: API查询请求失败 ‼️‼️')
              that.log(JSON.stringify(err));
              that.log(`function_id:${function_id}`)
              $.logErr(err);
            } else {
              if (safeGet(data)) {
                data = JSON.parse(data);
              }
            }
          } catch (e) {
            $.logErr(e, resp);
          } finally {
            resolve(data);
          }
        })
      }, timeout)
    })
  }
  function safeGet(data) {
    try {
      if (typeof JSON.parse(data) == "object") {
        return true;
      }
    } catch (e) {
      that.log(e);
      that.log(`动动服务器访问数据为空，请检查自身设备网络情况`);
      return false;
    }
  }
  function taskUrl(function_id, body = {}) {
    return {
      url: `${JD_API_HOST}?functionId=${function_id}&appid=wh5&body=${escape(JSON.stringify(body))}`,
      headers: {
        Cookie: cookie,
        UserAgent: $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
      },
      timeout: 10000,
    }
  }
  //-------------------------------------------------东东赚赚------------------------------------------------------------


async function jdWish() {
    $.bean = 0
    $.tuan = null
    $.hasOpen = false
    await getTaskList(true)
    await getUserTuanInfo()
    if (!$.tuan) {
      await openTuan()
      if ($.hasOpen) await getUserTuanInfo()
    }
    if ($.tuan) $.tuanList.push($.tuan)
    await helpFriends()
    await getUserInfo()
    $.nowBean = parseInt($.totalBeanNum)
    $.nowNum = parseInt($.totalNum)
    for (let i = 0; i < $.taskList.length; ++i) {
      let task = $.taskList[i]
      if (task['taskId'] === 1 && task['status'] !== 2) {
        that.log(`去做任务：${task.taskName}`)
        await doTask({"taskId": task['taskId'],"mpVersion":"3.4.0"})
      } else if (task['taskId'] !== 3 && task['status'] !== 2) {
        that.log(`去做任务：${task.taskName}`)
        if(task['itemId'])
          await doTask({"itemId":task['itemId'],"taskId":task['taskId'],"mpVersion":"3.4.0"})
        else
          await doTask({"taskId": task['taskId'],"mpVersion":"3.4.0"})
        await $.wait(3000)
      }
    }
    await getTaskList();
    await showMsg1();
  }
  
  
  function helpFriendTuan(body) {
    return new Promise(resolve => {
      $.get(taskTuanUrl("vvipclub_distributeBean_assist", body), async (err, resp, data) => {
        try {
          if (err) {
            that.log(`${JSON.stringify(err)}`)
            that.log(`${$.name} API请求失败，请检查网路重试`)
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data);
              if (data.success) {
                that.log('助力成功')
              } else {
                if (data.resultCode === '9200008') that.log('不能助力自己')
                else if (data.resultCode === '9200011') that.log('已经助力过')
                else if (data.resultCode === '2400205') that.log('团已满')
                else if (data.resultCode === '2400203') {that.log('助力次数已耗尽');$.canHelp = false}
                else that.log(`未知错误`)
              }
            }
          }
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve(data);
        }
      })
    })
  }
  
  function getUserTuanInfo() {
    let body = {"paramData": {"channel": "FISSION_BEAN"}}
    return new Promise(resolve => {
      $.get(taskTuanUrl("distributeBeanActivityInfo", body), async (err, resp, data) => {
        try {
          if (err) {
            that.log(`${JSON.stringify(err)}`)
            that.log(`${$.name} API请求失败，请检查网路重试`)
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data);
              if (data.data && !data.data.canStartNewAssist) {
                $.tuan = {
                  "activityIdEncrypted": data.data.id,
                  "assistStartRecordId": data.data.assistStartRecordId,
                  "assistedPinEncrypted": data.data.encPin,
                  "channel": "FISSION_BEAN"
                }
                $.tuanActId = data.data.id
              }
            }
          }
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve(data);
        }
      })
    })
  }
  
  function openTuan() {
    let body = {"activityIdEncrypted": $.tuanActId, "channel": "FISSION_BEAN"}
    return new Promise(resolve => {
      $.get(taskTuanUrl("vvipclub_distributeBean_startAssist", body), async (err, resp, data) => {
        try {
          if (err) {
            that.log(`${JSON.stringify(err)}`)
            that.log(`${$.name} API请求失败，请检查网路重试`)
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data);
              if (data['success']) {
                $.hasOpen = true
              }
            }
          }
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve(data);
        }
      })
    })
  }
  
  function getUserInfo() {
    return new Promise(resolve => {
      $.get(taskUrl1("interactIndex"), async (err, resp, data) => {
        try {
          if (err) {
            that.log(`${JSON.stringify(err)}`)
            that.log(`${$.name} API请求失败，请检查网路重试`)
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data);
              // if (data.data.shareTaskRes) {
              //   that.log(`\n【动动账号${$.index}（${$.nickName || $.UserName}）的${$.name}好友互助码】${data.data.shareTaskRes.itemId}\n`);
              // } else {
              //   that.log(`\n\n已满5人助力或助力功能已下线,故暂时无${$.name}好友助力码\n\n`)
              // }
            }
          }
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve(data);
        }
      })
    })
  }
  
  function getTaskList(flag = false) {
    return new Promise(resolve => {
      $.get(taskUrl1("interactTaskIndex"), async (err, resp, data) => {
        try {
          if (err) {
            that.log(`${JSON.stringify(err)}`)
            that.log(`${$.name} API请求失败，请检查网路重试`)
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data);
              $.taskList = data.data.taskDetailResList
              $.totalNum = data.data.totalNum
              $.totalBeanNum = data.data.totalBeanNum
              if (flag && $.taskList.filter(item => !!item && item['taskId']=== 3) && $.taskList.filter(item => !!item && item['taskId']=== 3).length) {
                   $.shareId=$.taskList.filter(item => !!item && item['taskId']=== 3)[0]['itemId'];
                that.log(`\n【动动账号${$.index}（${$.nickName || $.UserName}）的${$.name}好友互助码】${$.taskList.filter(item => !!item && item['taskId']=== 3)[0]['itemId']}\n`);
              }
            }
          }
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve(data);
        }
      })
    })
  }
  
  // 完成
  function doTask(body, func = "doInteractTask") {
    // that.log(taskUrl("doInteractTask", body))
    return new Promise(resolve => {
      $.get(taskUrl1(func, body), async (err, resp, data) => {
        try {
          if (err) {
            that.log(`${JSON.stringify(err)}`)
            that.log(`${$.name} API请求失败，请检查网路重试`)
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data);
              // that.log(data)
              if (func === "doInteractTask") {
                if (data.subCode === "S000") {
                  that.log(`任务完成，获得 ${data.data.taskDetailResList[0].incomeAmountConf} 金币，${data.data.taskDetailResList[0].beanNum} 京豆`)
                  $.bean += parseInt(data.data.taskDetailResList[0].beanNum)
                } else {
                  that.log(`任务失败，错误信息：${data.message}`)
                }
              } else {
                that.log(`${data.data.helpResDesc}`)
              }
            }
          }
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve(data);
        }
      })
    })
  }
  
  async function helpFriends() {
      await getHelp();
    for (let code of $.newShareCodes) {
      if (!code) continue
      await doTask({"itemId": code, "taskId": "3", "mpVersion": "3.4.0"}, "doHelpTask")
    }
    await setHelp();
  }
  
  function getHelp() {
      $.newShareCodes = [];
      return new Promise(resolve => {
        $.get({
          url: "http://api.tyh52.com/act/get/jdzz/3"
        }, (err, resp, data) => {
          try {
            if (data) {
              data = JSON.parse(data);
              if (data.code == 1) {
                let list = data.data;
                if (!(list instanceof Array)) {
                  list = JSON.parse(list);
                }
                if (list.length > 0) {
                  for (var i in list) {
                    $.newShareCodes.push(list[i]);
                  }
                }
              }
            }
          } catch (e) {
            $.logErr(e, resp);
          } finally {
            resolve(data);
          }
        })
      });
    }
  
    function setHelp() {
      return new Promise(resolve => {
        if ($.shareId) {
          $.get({
            url: "http://api.tyh52.com/act/set/jdzz/" + $.shareId
          }, (err, resp, data) => {
            try {
              if (data) {
                data = JSON.parse(data);
                if (data.code == 1) {
                  that.log("提交自己的邀請碼成功");
                } else {
                  that.log("提交邀请码失败，" + data.message);
                }
              }
            } catch (e) {
              $.logErr(e, resp);
            } finally {
              resolve(data);
            }
          })
        } else {
          resolve();
        }
  
      });
    }
    
    function getHelpTuan() {
      $.tuanList = [];
      return new Promise(resolve => {
        $.get({
          url: "http://api.tyh52.com/act/get/jdzzTuan/3"
        }, (err, resp, data) => {
          try {
            if (data) {
              data = JSON.parse(data);
              if (data.code == 1) {
                let list = data.data;
                if (!(list instanceof Array)) {
                  list = JSON.parse(list);
                }
                if (list.length > 0) {
                  for (var item of list) {
                      let its=item.split('@');
                      if(its.length==2){
                          let  tuan={
                                              "activityIdEncrypted": $.tuanActId,
                                              "assistStartRecordId": its[0],
                                              "assistedPinEncrypted": its[1],
                                              "channel": "FISSION_BEAN"
                                          }
                        $.tuanList.push(tuan);
                      }
                  }
                }
              }
            }
          } catch (e) {
            $.logErr(e, resp);
          } finally {
            resolve(data);
          }
        })
      });
    }
  
    function setHelpTuan() {
      return new Promise(resolve => {
        if ($.tuan) {
          $.get({
            url: "http://api.tyh52.com/act/set/jdzzTuan/" + $.tuan.assistStartRecordId+'@'+$.tuan.assistedPinEncrypted
          }, (err, resp, data) => {
            try {
              if (data) {
                  that.log(data);
                data = JSON.parse(data);
                if (data.code == 1) {
                  that.log("提交自己的开团碼成功");
                }else{
                    that.log("提交开团码失败，" + data.message);
                }
              }
            } catch (e) {
              $.logErr(e, resp);
            } finally {
              resolve(data);
            }
          })
        } else {
          resolve();
        }
  
      });
    }
  
  function taskUrl1(functionId, body = {}) {
    return {
      url: `${JD_API_HOST}?functionId=${functionId}&body=${escape(JSON.stringify(body))}&client=wh5&clientVersion=9.1.0`,
      headers: {
        'Cookie': cookie,
        'Host': 'api.m.jd.com',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json',
        'Referer': 'http://wq.jd.com/wxapp/pages/hd-interaction/index/index',
        'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
        'Accept-Language': 'zh-cn',
        'Accept-Encoding': 'gzip, deflate, br',
      }
    }
  }
  
  function taskTuanUrl(function_id, body = {}) {
    return {
      url: `${JD_API_HOST}?functionId=${function_id}&body=${escape(JSON.stringify(body))}&appid=swat_miniprogram&osVersion=5.0.0&clientVersion=3.1.3&fromType=wxapp&timestamp=${new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000}`,
      headers: {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded",
        "Host": "api.m.jd.com",
        "Referer": "https://servicewechat.com/wxa5bf5ee667d91626/108/page-frame.html",
        "Cookie": cookie,
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
      }
    }
  }
  
  
    
  function showMsg1() {
    return new Promise(async resolve => {
      that.log( "<font color=\'#778899\' size=2>" +  `本次获得${parseInt($.totalBeanNum) - $.nowBean}京豆，${parseInt($.totalNum) - $.nowNum}金币\n` + "</font>\n\n")
      message += "<font color=\'#778899\' size=2>"  + `累计获得${$.totalBeanNum}京豆，${$.totalNum}金币\n可兑换${$.totalNum / 10000}元无门槛红包` + "</font>\n\n"
      if (parseInt($.totalBeanNum) - $.nowBean > 0) {
        $.msg($.name, '', `动动账号${$.index} ${$.nickName}\n${message}`);
      } else {
        $.log(message)
      }
      // 云端大于10元无门槛红包时进行通知推送
      if ($.isNode() && $.totalNum >= 1000000) await notify.sendNotify(`${$.name} - 动动账号${$.index} - ${$.nickName}`, `动动账号${$.index} ${$.nickName}\n当前金币：${$.totalNum}个\n可兑换无门槛红包：${parseInt($.totalNum) / 10000}元\n`,)
      resolve();
    })
  }
  
  



//我加的函数
function postToDingTalk(messgae) {
    const message1 = "" + messgae
    that.log(messgae)

    const body = {
        "msgtype": "markdown",
        "markdown": {
            "title":"资产变动",
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