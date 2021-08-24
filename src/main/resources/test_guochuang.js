
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';

const randomCount = $.isNode() ? 20 : 5;
const notify = $.isNode() ? require('./sendNotify') : '';
let merge = {}
let codeList = []
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [],message =- "",timeout,l,
    cookie = '';
if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    })
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') that.log = () => {};
} else {
    cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}

const JD_API_HOST = `https://api.m.jd.com/client.action`;

!(async () => {
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的动动签到获取', 'https://bean.m.jd.com/', {
            "open-url": "https://bean.m.jd.com/"
        });
        return;
    }
    message += "<font color=\'#FFA500\'>[通知] </font><font color=\'#006400\' size='3'>动动国创</font> \n\n --- \n\n"
  

    for (let i = 0; i < cookiesArr.length; i++) {
        cookie = cookiesArr[i];
        if (cookie) {
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
            $.index = i + 1;
            $.isLogin = true;
            $.nickName = '';
            $.beans = 0
            $.cando = true
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

            that.log(`\n******开始【动动账号${$.index}】${$.nickName || $.UserName}*********\n`);
            if (!$.isLogin) {
                $.msg($.name, `【提示】cookie已失效`, `动动账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {
                    "open-url": "https://bean.m.jd.com/bean/signIndex.action"
                });

                if ($.isNode()) {
                    await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `动动账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
                }
                continue
            }
        let actdata=   await getid("superBrandSecondFloorMainPage","secondfloor")       
        if($.cando){
        $.actid = actdata.actid
        $.enpid = actdata.enpid
      //{actid,actname,enpid}
         //     await doTask("44spR7W6XFhQXzMvPva99WYLTscr", "1000000157", "3") //关注
         //   await superBrandTaskLottery()
            await getCode()
            
            await doTask("secondfloor",$.enpid,$.taskList[0].encryptAssignmentId,$.taskList[0].ext.followShop[0].itemId,$.taskList[0].assignmentType)            
            await doTask("secondfloor",$.enpid,$.taskList[2].encryptAssignmentId,$.taskList[2].ext.brandMemberList[0].itemId,$.taskList[2].assignmentType)            
            let signdata=   await getid("showSecondFloorSignInfo","sign")
            await doTask("sign",signdata.enpid,signdata.eid,1,5)
            that.log("开始抽奖")
                await superBrandTaskLottery()
                await superBrandTaskLottery()
                await superBrandTaskLottery()   
            }
           
            cookie = cookiesArr[i];
            if (cookie) {
               $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
                $.index = i + 1;
                $.isLogin = true;
                $.nickName = '';
            //    $.beans = 0
         //       message = ''
    
                //   await shareCodesFormat();
                that.log(`\n******开始【动动账号${$.index}】\n`);
         
           for (l = 0; l < codeList.length; l++) {
           that.log(`为 ${codeList[l]}助力中`)
                    await doTask("secondfloor",$.enpid,$.inviteenaid, codeList[l], 2)
                }
            } 

            cookie = cookiesArr[i];
            if (cookie) {
               $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
                $.index = i + 1;
                $.isLogin = true;
                $.nickName = '';
                //   await shareCodesFormat();
                that.log(`\n******开始【动动账号${$.index}】抽奖\n`);
                    await superBrandTaskLottery()
                    await superBrandTaskLottery()
                    await superBrandTaskLottery()   
             //     that.log(`共获得${$.beans} 京豆`)
            }
            message = message + "<font color=\'#778899\' size=2>" + `共获得${$.beans} 京豆\n` + "</font>\n\n"
        }
        message = message +"----\n\n"
    }
})()
.catch((e) => {
    $.logErr(e)
    message = message + "<font color=\'#778899\' size=2>" + e + "</font>\n\n"
    })
    .finally(() => {
        message = message + getPic()
        that.log(message)
        // postToDingTalk(message)
        $.done()
    })
//获取活动信息

function getid(functionid,source) {
    return new Promise(async (resolve) => {
        const options = taskPostUrl(functionid, `{"source":"${source}"}`)
        //  that.log(options)
        $.post(options, async (err, resp, data) => {
            try {
                if (err) {
                    that.log(`${JSON.stringify(err)}`);
                    that.log(`${$.name} API请求失败，请检查网路重试`);
                } else {
                    data = JSON.parse(data);
              //      that.log(data)
                   if ( data.data && data.code === "0"&&data.data.result) {
                        let json = {}
                        let result =data.data.result
                        json.actid = result.activityBaseInfo.activityId
                        json.actname= result.activityBaseInfo.activityName
                        json.enpid = result.activityBaseInfo.encryptProjectId
                        if(source === "sign"){json.eid=result.activitySign1Info.encryptAssignmentId}
                       resolve(json)
                       that.log(`当前活动：${json.actname}  ${json.actid}`)
                    }else{
                    that.log("获取失败")
                    $.cando = false
                    resolve()
                    }

                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}
function getsignid() {
    return new Promise(async (resolve) => {
        const options = taskPostUrl("superBrandSecondFloorMainPage", `{"source":"secondfloor"}`)
        //  that.log(options)
        $.post(options, async (err, resp, data) => {
            try {
                if (err) {
                    that.log(`${JSON.stringify(err)}`);
                    that.log(`${$.name} API请求失败，请检查网路重试`);
                } else {
                    data = JSON.parse(data);
              //      that.log(data)
                   if ( data.data && data.code === "0") {
                        $.actid = data.data.result.activityBaseInfo.activityId
                        $.actname=data.data.result.activityBaseInfo.activityName
                        $.enpid = data.data.result.activityBaseInfo.encryptProjectId
                        that.log(`当前活动：${actname}  ${$.actid}`)
                    }

                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

function getCode() {
    return new Promise(async (resolve) => {
        const options = taskPostUrl("superBrandTaskList", `{"source":"secondfloor","activityId":${$.actid},"assistInfoFlag":1}`)
        //  that.log(options)
        $.post(options, async (err, resp, data) => {
            try {
                if (err) {
                    that.log(`${JSON.stringify(err)}`);
                    that.log(`${$.name} API请求失败，请检查网路重试`);
                } else {
                    data = JSON.parse(data);
                    //    that.log(data.data.result)
                    if (data && data.data && data.code === "0") {
                        if (data.data.result && data.data.result.taskList && data.data.result.taskList[3]) {
                           $.taskList = data.data.result.taskList
                            let result = data.data.result.taskList[3]
                           let encryptAssignmentId = result.encryptAssignmentId
                            let itemid = result.ext.assistTaskDetail.itemId
                            $.inviteenaid=result.encryptAssignmentId
                            codeList[codeList.length] = itemid
                            that.log(`获取邀请码成功 ${itemid}`);
                        } else {
                            that.log(data)
                        }
                    }

                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

function doTask(source,pid,encryptAssignmentId, id, type) {
    return new Promise(async (resolve) => {
        const options = taskPostUrl(`superBrandDoTask`, `{"source":"${source}","activityId":${$.actid},"encryptProjectId":"${pid}","encryptAssignmentId":"${encryptAssignmentId}","assignmentType":${type},"itemId":"${id}","actionType":0}`)
   //    that.log(options)
          $.post(options, async (err, resp, data) => {
            try {
                if (err) {
                    that.log(`${JSON.stringify(err)}`);
                    that.log(`${$.name} API请求失败，请检查网路重试`);
                } else {
                    //      that.log(data)
                    data = JSON.parse(data);
                    if (data && data.code === "0") {
                        if (data.data.bizCode === "0") {
                            that.log("任务成功啦~")
                        } else {
                            that.log(data.data.bizMsg)
                        }
                        resolve(data.data.bizCode)
                    } else {
                        that.log(data)
                    }
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

function superBrandTaskLottery() {
    return new Promise(async (resolve) => {
        const options = taskPostUrl("superBrandTaskLottery", `{"source":"secondfloor","activityId":${$.actid}}`)
        $.post(options, async (err, resp, data) => {
            try {
                if (err) {
                    that.log(`${JSON.stringify(err)}`);
                    that.log(`${$.name} API请求失败，请检查网路重试`);
                } else {
                    data = JSON.parse(data);
                 //   that.log(data)
                    if (data && data.code === "0") {
                        if (data.data.bizCode === "TK000") {
                            that.log(`获得 你猜获得了啥🐶  ${data.data.bizMsg}`)
                            message += "<font color=\'#778899\' size=2>" + `获得 你猜获得了啥🐶  ${data.data.bizMsg}` + "</font>\n\n"
                        } else {
                            that.log(data.data.bizMsg)
                        }
                    } else {
                        that.log(data)
                    }
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}



function taskPostUrl(functionid, body) {
    const time = Date.now();
    return {
        url: `https://api.m.jd.com/api?functionId=${functionid}&appid=ProductZ4Brand&client=wh5&t=${time}&body=${encodeURIComponent(body)}`,
        body: "",
        headers: {
            Accept: "application/json,text/plain, */*",
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-cn",
            Connection: "keep-alive",
            Cookie: cookie,
            Host: "api.m.jd.com",
            Referer: "https://prodev.m.jd.com/mall/active/NrHM6Egy96gxeG4eb7vFX7fYXf3/index.html?activityId=1000007&encryptProjectId=cUNnf3E6aMLQcEQbTVxn8AyhjXb&assistEncryptAssignmentId=2jpJFvC9MBNC7Qsqrt8WzEEcVoiT&assistItemId=S5ijz_8ukVww&tttparams=GgS7lUeyJnTGF0IjoiMzMuMjUyNzYyIiwiZ0xuZyI6IjEwNy4xNjA1MDcifQ6%3D%3D&lng=107.147022&lat=33.255229&sid=e5150a3fdd017952350b4b41294b145w&un_area=27_2442_2444_31912",
            "User-Agent": "jdapp;android;9.4.4;10;3b78ecc3f490c7ba;network/UNKNOWN;model/M2006J10C;addressid/138543439;aid/3b78ecc3f490c7ba;oaid/7d5870c5a1696881;osVer/29;appBuild/85576;psn/3b78ecc3f490c7ba|541;psq/2;uid/3b78ecc3f490c7ba;adk/;ads/;pap/JA2015_311210|9.2.4|ANDROID 10;osv/10;pv/548.2;jdv/0|iosapp|t_335139774|appshare|CopyURL|1606277982178|1606277986;ref/com.jd.lib.personal.view.fragment.JDPersonalFragment;partner/xiaomi001;apprpd/MyJD_Main;Mozilla/5.0 (Linux; Android 10; M2006J10C Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045227 Mobile Safari/537.36",
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
    const dingtalk = "https://oapi.dingtalk.com/robot/send?access_token=fa87e34729eaa6113fddfa857efebb477dea0a433d6eecfe93b1d3f5e24847b9"

    const message1 = "" + messgae
    that.log(messgae)

    const body = {
        "msgtype": "markdown",
        "markdown": {
            "title":"动动国创",
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
