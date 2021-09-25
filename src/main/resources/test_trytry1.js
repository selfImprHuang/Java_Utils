/*
 * 由ZCY01二次修改：脚本默认不运行
 * 由 X1a0He 修复：依然保持脚本默认不运行
 * 如需运行请自行添加环境变量：JD_TRY，值填 true 即可运行
 * TG交流群：https://t.me/jd_zero205
 * TG通知频道：https://t.me/jd_zero205_tz
 *
 update 2021/09/05
 京东试用：脚本更新地址 https://github.com/zero205/JD_tencent_scf/raw/main/jd_try.js
 脚本兼容: Node.js
 每天最多关注300个商店，但用户商店关注上限为500个。
 请配合取关脚本试用，使用 jd_unsubscribe.js 提前取关至少250个商店确保京东试用脚本正常运行。
 *
 * X1a0He留
 * 由于没有兼容Qx，原脚本已失效，建议原脚本的兼容Qx注释删了
 * 脚本是否耗时只看args_xh.maxLength的大小
 * 上一作者说了每天最多300个商店，总上限为500个，jd_unsubscribe.js我已更新为批量取关版
 * 请提前取关至少250个商店确保京东试用脚本正常运行
 * 没有写通知，是否申请成功没有进行通知，但脚本会把状态log出日志
 */
 let maxSize = 100
 let totalPages = 999999 //总页数
 const $ = new Env('京东试用')
 const URL = 'https://api.m.jd.com/client.action'
 let trialActivityIdList = []
 let trialActivityTitleList = []
 let notifyMsg = ''
 let message = ""
 let process={
     env:{
         "JD_TRY":"true"
     }
 }
 // default params
 let args_xh = {
     /*
      * 是否进行通知
      * 可设置环境变量：JD_TRY_NOTIFY
      * */
 //     isNotify: process.env.JD_TRY_NOTIFY || true,
     // 商品原价，低于这个价格都不会试用
     jdPrice: process.env.JD_TRY_PRICE || 20,
     /*
      * 获取试用商品类型，默认为1
      * 1 - 精选
      * 2 - 闪电试用
      * 3 - 家用电器(可能会有变化)
      * 4 - 手机数码(可能会有变化)
      * 5 - 电脑办公(可能会有变化)
      * 可设置环境变量：JD_TRY_TABID
      * */
     // TODO: tab ids as array(support multi tabIds)
     // tabId: process.env.JD_TRY_TABID && process.env.JD_TRY_TABID.split('@').map(Number) || [1],
     tabId: process.env.JD_TRY_TABID || 1,
     /*
      * 试用商品标题过滤
      * 可设置环境变量：JD_TRY_TITLEFILTERS，关键词与关键词之间用@分隔
      * */
     titleFilters: ["毛囊", "瘙痒", "外用", "止痒", "软膏", "一盒", "阴囊", "万藓灵", "u盘", "工作手册", "手册", "采耳", "奶瓶", "打钉枪", "领结", "长裤", "秋裤", "泳衣", "安全裤", "保暖女裤", "护腿套", "职业装", "女装", "保暖裤", "打底", "掏耳朵", "肥佬", "胖子", "青春痘", "粉刺", "煤油", "敏肌", "敏感","补墙","天线","办公杯","反光板","表带","刮痧板","精油","葛根","虾青素","抑菌","防撞条","把手","遮挡布","纸巾盒","美缝","会议","丸","同仁堂","试听课","休闲鞋","养芝堂","注射针","卸妆水","净水剂","清水剂","纳米砖","绿草皮","翻身","矫正器","胶囊","减肥","静脉曲张","拔毒膏","柔肤水","润颜乳","花萃","洁面","赠品","精华乳","祛斑霜","化妆","福来油","额头贴","唇釉","足浴粉","指套","复印纸","hpv","墨粉","剪钳","钳", "中国电信","充电头","鼻毛器","筒灯","墨盒","hdmi","HDMI","平衡线","解码线","有机肥","尿素","蚯蚓粪","肥料","猫玩具","腮红","裸妆", "粉饼","狗狗沐浴露","教材","增生贴","黄膏贴","转换器","热熔胶枪","充电桩","美工刀","裁纸刀","卡尺","避光垫","睫毛","梯子","纱窗","哑光","防静电","脚垫","香薰精油","牙刷替换头","车轮","灶台贴纸","修眉剪", "雨衣", "倒车镜", "雨披", "男童", "鹿鞭","染发剂","吸顶灯","电话卡","手机卡","led开关电源","燃气报警器","短袜","长筒袜","延迟喷雾","漱口水","绑带","削皮刀","剥虾","抽屉轨道","纱网","汤勺","电话牌","办公会议茶杯","亿优信", "假睫毛", "模具", "轮胎" ,"阴部" ,"猫咪玩具" ,"蛋白粉","口腔抑菌" , "替换头","磨脚石","辅食","色料","线上课程","纹眉色料","灯泡","开果器","烧水棒","刷牙头","宝宝","会议杯子","轮胎专用胶水","金属探测器","蚊帐","反光贴","泡沫胶","座套","维生素","咽炎","会员卡","钙咀嚼片","美胸","线上课程","粉底","参肽片","玛咖片","钥匙扣","水龙头","围裙","水平仪","补水","玻尿酸","连衣裙","玻璃防雾剂", "梳子", "座套", "视线盲区贴纸", "卧铺垫" ,"定做榻榻米","别针","抽纸一包装","儿童","反光条贴","门槛条","腋毛神器","幼儿配方","甲醛","地吸","定做","汽车脚垫","砂盆","电池","加温器","矫正带","手机维修","锁精环","包皮","扩音器","龟头","猫粮","狗粮","神露","前列腺","硅胶","儿童成长","孕妇","尤尖锐湿疣","痔疮","乳腺","蟑螂药","用友","自慰","儿童口罩","啪啪","门把手","鞋带","丰胸","多功能尺子","情趣","适配器","尼龙管","铆管","哺乳套装","屏蔽袋","SD卡","条码","钢化蛋","鸭肠","猪油","绿幕","尿素霜","婴儿","分流器","VGA","纸尿裤","墨盒","水晶头","眼霜","机顶盒","数据线","交换机","屏风","地漏","彩带","便秘","插座","密封条","玻璃镜片","摄像头镜片","腰带","皮带","裤头","眼镜","框","老花","USB","雨刮","车漆","帽","宠物","幼儿园","收纳","衣架","鼠标垫","卡套","避孕套","架","夹","手机壳","小学","牙刷头","安全帽","挂钩","油漆","烟","笔","保护套","飞机","手套","护肤","洗面","清洁","膜","理发","润滑","延时","usb","坐垫","酒","毛孔","墨水","托","耳罩","袖套","丝袜","飞机杯","袜子","滤网","砂纸","眼影","钢化膜","鞋垫","内裤","面膜","手机卡","流量卡","胶带","艾条","便签纸","电池","花籽","工作服","眉笔","口红","挑逗","卡托","保护套","字帖","钉子","坐垫","数据线","座垫","电缆剪","巾","月子","睡裤", "尿", "奶粉", "哨", "培训", "班", "教", "考","头","卸妆","美甲","老人用品","半身不遂","痉挛","液","冻干粉","舒缓水","霜","爸爸装","补墙","天线","办公杯","反光板","表带","刮痧","葛根","虾青素","抑菌","精华", "乳液","防撞条","把手","遮挡布","纸巾盒","美缝","丸","同仁堂","休闲鞋","养芝堂","注射针","纳米砖","绿草皮","翻身","矫正器","胶囊","减肥","静脉曲张","拔毒膏","柔肤水","润颜乳","花萃","洁面","赠品","精华乳","祛斑霜","化妆","福来油","唇釉","足浴粉","复印纸","hpv","钳", "中国电信","充电头","鼻毛","筒灯","hdmi","HDMI","腮红","妆", "粉饼","狗狗沐浴露","教材","平衡线","解码线","有机肥","尿素","蚯蚓粪","肥料","猫玩具","贴","热熔胶枪","充电桩","美工刀","裁纸刀","卡尺","避光垫","吸顶灯","报警器","延时","延迟","漱口水","绑带","削皮刀","剥虾","轨道","纱网","汤勺","牌","会议","亿优信","纱窗","哑光","静电","精油","车轮","修眉", "雨衣", "倒车镜", "雨披","男童","鹿鞭","睫毛","模具","轮胎" ,"阴部" ,"猫咪","蛋白粉","替换头","磨脚","辅食","色料","纹眉","灯泡","开果器","烧水棒","牙刷头","刷牙头","宝宝","轮胎专用胶水","金属探测","蚊帐","泡沫","维生素","咽炎","会员","嚼片","美胸","粉底","参肽片","玛咖片","钥匙扣","水龙头","围裙","水平仪","补水","玻尿酸","连衣裙","剂", "梳", "座套", "卧铺垫" ,"别针","一包装","贴","门槛条","腋毛","幼儿","甲醛","地吸","定做","脚垫","砂盆","电池","加温器","矫正","维修","锁精环","包皮","扩音器","龟头","猫粮","狗粮","前列腺","硅胶","孕妇","疣","疮","乳腺","蟑螂药","用友","自慰","儿童","啪啪","门把手","鞋带","丰胸","尺","情趣","适配","管","哺乳","袋","SD","条码","钢化蛋","鸭肠","猪油","幕","婴","分流","VGA","纸尿裤","水晶头","霜","机顶盒","交换","屏风","地漏","带","便秘","插座","密封条","镜片","腰带","皮带","裤头","眼镜","框","老花","USB","雨刮","宠物","幼儿园","衣架","鼠标垫","架","夹","手机壳","小学","牙刷头","帽","挂钩","漆","烟","笔","飞机","护肤","洗面","清洁","理发","润滑","延时","usb","酒","毛孔","墨","托","耳罩","袖套","丝袜","飞机杯","袜子","滤网","砂纸","眼影","膜","鞋垫","内裤","面膜","卡","胶带","艾条","便签纸","电池","花籽","工作服","眉笔","口红","挑逗","卡托","保护套","字帖","钉子","坐垫","数据线","座垫","修护","非卖品","露","windows","转接","转换","压片","剪","口腔","护理","耳塞","定制","享底价","梯","筷子","LED", "妇女","课","线上","培训","教材","号码卡","实验课","孩子","女款","女鞋","男裤","男鞋","筒袜","保健","咬钩","内衣","南极人","护踝","牛仔裤","泥灸","犬粮","扩音器"],     // 试用价格(中了要花多少钱)，高于这个价格都不会试用，小于等于才会试用
     trialPrice: 100,
     /*
      * 最小提供数量，例如试用商品只提供2份试用资格，当前设置为1，则会进行申请
      * 若只提供5分试用资格，当前设置为10，则不会申请
      * 可设置环境变量：JD_TRY_MINSUPPLYNUM
      * */
     minSupplyNum: process.env.JD_TRY_MINSUPPLYNUM || 1,
     /*
      * 过滤大于设定值的已申请人数，例如下面设置的1000，A商品已经有1001人申请了，则A商品不会进行申请，会被跳过
      * 可设置环境变量：JD_TRY_APPLYNUMFILTER
      * */
     applyNumFilter: process.env.JD_TRY_APPLYNUMFILTER || 99999,
     /*
      * 商品试用之间和获取商品之间的间隔, 单位：毫秒(1秒=1000毫秒)
      * 可设置环境变量：JD_TRY_APPLYINTERVAL
      * */
     applyInterval: process.env.JD_TRY_APPLYINTERVAL || 5000,
     /*
      * 商品数组的最大长度，通俗来说就是即将申请的商品队列长度
      * 例如设置为20，当第一次获取后获得12件，过滤后剩下5件，将会进行第二次获取，过滤后加上第一次剩余件数
      * 例如是18件，将会进行第三次获取，直到过滤完毕后为20件才会停止，不建议设置太大
      * 可设置环境变量：JD_TRY_MAXLENGTH
      * */
     maxLength:  60
 }
 
 !(async() => {
     // console.log(`\n本脚本默认不运行，也不建议运行\n如需运行请自行添加环境变量：JD_TRY，值填：true\n`)
     await $.wait(1000)
     if(process.env.JD_TRY && process.env.JD_TRY === 'true'){
         await requireConfig()
         if(!$.cookiesArr[0]){
             $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {
                 "open-url": "https://bean.m.jd.com/"
             })
             return
         }
             for(let i = 0; i < $.cookiesArr.length; i++){
                 message += "<font color=\'#FFA500\'>[通知] </font><font color=\'#006400\' size='3'>试用生鲜美食</font> \n\n --- \n\n"
                 if($.cookiesArr[i]){
                     $.cookie = $.cookiesArr[i];
                     $.UserName = decodeURIComponent($.cookie.match(/pt_pin=(.+?);/) && $.cookie.match(/pt_pin=(.+?);/)[1])
                     $.index = i + 1;
                     $.isLogin = true;
                     $.nickName = '';
                     await totalBean();
                     console.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
                     if(!$.isLogin){
                         $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {
                             "open-url": "https://bean.m.jd.com/bean/signIndex.action"
                         });
                         await $.notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
                         continue
                     }
 
                     username = $.UserName
                     if ($.UserName == "jd_4521b375ebb5d"){
                        username = "锟子"
                      }
                      if ($.UserName == "jd_542c10c0222bc"){
                        username = "康子"
                      }
                      if($.UserName == "jd_66dcb31363ef6"){
                        username = "涛子"
                      }
                      if($.UserName == "18070420956_p"){
                          username = "奇怪子"
                      }
                      if($.UserName == "jd_45d917547c763"){
                          username = "跑腿小弟子"
                      }
                      if ($.UserName == "jd_66ea783827d30"){
                         username = "军子"
                      }
                      if ($.UserName == "jd_4311ac0ff4456"){
                        username = "居子"
                      }
                      //加上名称
                      message = message + "<font color=\'#778899\' size=2>【羊毛姐妹】<font color=\'#FFA500\' size=3>" +  username + " </font> </font> \n\n "
 
                     $.totalTry = 0
                     $.totalSuccess = 0
                     let size = 1;
                     let list = [3,9,5,6,12,13,14,15,16] 
                    for (let i =0;i<list.length;i++){
                        while(trialActivityIdList.length < args_xh.maxLength && size < maxSize &&  size < totalPages){
                            console.log(`\n正在进行第 ${size} 次获取试用商品\n`)
                            console.log(`\n当前产品页面总长度为${totalPages} 页\n`)
                            await try_feedsList(list[i], size++) 
                            if(trialActivityIdList.length < args_xh.maxLength){
                                console.log(`间隔延时中，请等待 ${args_xh.applyInterval} ms`)
                                await $.wait(args_xh.applyInterval);
                            }
                        }
                         size = 1 
                    }
                     
                     console.log("正在执行试用申请...")
                     await $.wait(args_xh.applyInterval);
                     for(let i = 0; i < trialActivityIdList.length; i++){
                         await try_apply(trialActivityTitleList[i], trialActivityIdList[i])
                         console.log(`间隔延时中，请等待 ${args_xh.applyInterval} ms\n`)
                         await $.wait(args_xh.applyInterval);
                     }
                     console.log("试用申请执行完毕...")
     
                     // await try_MyTrials(1, 1)    //申请中的商品
                     await try_MyTrials(1, 2)    //申请成功的商品
                     // await try_MyTrials(1, 3)    //申请失败的商品
                     await showMsg()
                 }
                  postToDingTalk(message)
                  message = ""
             }      
         await $.notify.sendNotify(`${$.name}`, notifyMsg);
     } else {
         console.log(`\n您未设置运行【京东试用】脚本，结束运行！\n`)
     }
 })().catch((e) => {
     console.log(`❗️ ${$.name} 运行错误！\n${e}`)
     postToDingTalk(e)
 }).finally(() => {
  $.done()
 })
 
 function requireConfig(){
     return new Promise(resolve => {
         console.log('开始获取配置文件\n')
         $.notify = $.isNode() ? require('./sendNotify') : { sendNotify: async() => { } }
         //获取 Cookies
         $.cookiesArr = []
         if($.isNode()){
             //Node.js用户请在jdCookie.js处填写京东ck;
             const jdCookieNode = require('./jdCookie.js');
             Object.keys(jdCookieNode).forEach((item) => {
                 if(jdCookieNode[item]){
                     $.cookiesArr.push(jdCookieNode[item])
                 }
             })
             if(process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => { };
         } else {
             //IOS等用户直接用NobyDa的jd $.cookie
             $.cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
         }
         console.log(`共${$.cookiesArr.length}个京东账号\n`)
         for (const key in args_xh) {
             if(typeof args_xh[key] == 'string') {
                 args_xh[key] = Number(args_xh[key])
             }
         }
         // console.debug(args_xh)
         resolve()
     })
 }
 
 //获取商品列表并且过滤 By X1a0He
 function try_feedsList(tabId, page){
     return new Promise((resolve, reject) => {
         const body = JSON.stringify({
             "tabId": `${tabId}`,
             "page": page,
             "previewTime": ""
         });
         let option = taskurl_xh('newtry', 'try_feedsList', body)
         $.get(option, (err, resp, data) => {
             try{
                 if(err){
                     console.log(`🚫 ${arguments.callee.name.toString()} API请求失败，请检查网路\n${JSON.stringify(err)}`)
                 } else {
                     // console.debug(data)
                     // return
                     data = JSON.parse(data)
                     if(data.success){
                         $.totalPages = data.data.pages
                         totalPages = $.totalPages
                         console.log(`获取到商品 ${data.data.feedList.length} 条\n`)
                         for(let i = 0; i < data.data.feedList.length; i++){
                             if(trialActivityIdList.length > args_xh.maxLength){
                                 console.log('商品列表长度已满.结束获取')
                             }else
                             if(data.data.feedList[i].applyState === 1){
                                 console.log(`商品已申请试用：${data.data.feedList[i].skuTitle}`)
                                 continue
                             }else
                             if(data.data.feedList[i].applyState !== null){
                                 console.log(`商品状态异常,跳过：${data.data.feedList[i].skuTitle}`)
                                 continue
                             }else
                             if(data.data.feedList[i].skuTitle){
                                 console.log(`检测第 ${page} 页 第 ${i + 1} 个商品\n${data.data.feedList[i].skuTitle}`)
                                 if(parseFloat(data.data.feedList[i].jdPrice) <= args_xh.jdPrice){
                                     console.log(`商品被过滤，${data.data.feedList[i].jdPrice} < ${args_xh.jdPrice} \n`)
                                 }else if(parseFloat(data.data.feedList[i].supplyNum) < args_xh.minSupplyNum && data.data.feedList[i].supplyNum !== null){
                                     console.log(`商品被过滤，提供申请的份数小于预设申请的份数 \n`)
                                 }else if(parseFloat(data.data.feedList[i].applyNum) > args_xh.applyNumFilter && data.data.feedList[i].applyNum !== null){
                                     console.log(`商品被过滤，已申请试用人数大于预设人数 \n`)
                                 }else if(parseFloat(data.data.feedList[i].trialPrice) > args_xh.trialPrice){
                                     console.log(`商品被过滤，期待价格高于预设价格 \n`)
                                 }else if(args_xh.titleFilters.some(fileter_word => data.data.feedList[i].skuTitle.includes(fileter_word))){
                                     console.log('商品被过滤，含有关键词 \n')
                                 }else{
                                     console.log(`商品通过，将加入试用组，trialActivityId为${data.data.feedList[i].trialActivityId}\n`)
                                     trialActivityIdList.push(data.data.feedList[i].trialActivityId)
                                     trialActivityTitleList.push(data.data.feedList[i].skuTitle)
                                 }
                             }else{
                                 console.log('skuTitle解析异常')
                                 return
                             }
                         }
                         console.log(`当前试用组id如下，长度为：${trialActivityIdList.length}\n${trialActivityIdList}\n`)
                     } else {
                         console.log(`💩 获得试用列表失败: ${data.message}`)
                     }
                 }
             } catch(e){
                  console.log(e);
                 reject(`⚠️ ${arguments.callee.name.toString()} API返回结果解析出错\n${e}\n${JSON.stringify(data)}`)
                 console.log(`${JSON.stringify(data)}`)
             } finally{
                 resolve()
             }
         })
     })
 }
 
 function try_apply(title, activityId){
     return new Promise((resolve, reject) => {
         console.log(`申请试用商品中...`)
         console.log(`商品：${title}`)
         console.log(`id为：${activityId}`)
         const body = JSON.stringify({
             "activityId": activityId,
             "previewTime": ""
         });
         let option = taskurl_xh('newtry', 'try_apply', body)
         $.get(option, (err, resp, data) => {
             try{
                 if(err){
                     console.log(`🚫 ${arguments.callee.name.toString()} API请求失败，请检查网路\n${JSON.stringify(err)}`)
                 } else {
                     $.totalTry++
                     data = JSON.parse(data)
                     if(data.success && data.code === "1"){  // 申请成功
                         message += "<font color=\'#778899\' size=2>"  + title + "</font>\n\n" 
                         message += "<font color=\'#778899\' size=2>"  + `--------` + "</font>\n\n"
                         console.log(data.message)
                         $.totalSuccess++
                     } else if(data.code === "-106"){
                         console.log(data.message)   // 未在申请时间内！
                     } else if(data.code === "-110"){
                         console.log(data.message)   // 您的申请已成功提交，请勿重复申请…
                     } else if(data.code === "-120"){
                         console.log(data.message)   // 您还不是会员，本品只限会员申请试用，请注册会员后申请！
                     } else if(data.code === "-167"){
                         console.log(data.message)   // 抱歉，此试用需为种草官才能申请。查看下方详情了解更多。
                     } else {
                         console.log("申请失败", JSON.stringify(data))
                         message += "<font color=\'#778899\' size=2>"  + JSON.stringify(data) + "</font>\n\n" 
                         message += "<font color=\'#778899\' size=2>"  + `--------` + "</font>\n\n"
                     }
                 }
             } catch(e){
                 reject(`⚠️ ${arguments.callee.name.toString()} API返回结果解析出错\n${e}\n${JSON.stringify(data)}`)
             } finally{
                 resolve()
             }
         })
     })
 }
 
 function try_MyTrials(page, selected){
     return new Promise((resolve, reject) => {
         switch(selected){
             case 1:
                 console.log('正在获取已申请的商品...')
                 break;
             case 2:
                 console.log('正在获取申请成功的商品...')
                 break;
             case 3:
                 console.log('正在获取申请失败的商品...')
                 break;
             default:
                 console.log('selected错误')
         }
         const body = JSON.stringify({
             "page": page,
             "selected": selected,   // 1 - 已申请 2 - 成功列表，3 - 失败列表
             "previewTime": ""
         });
         let option = taskurl_xh('newtry', 'try_MyTrials', body)
         option.headers.Referer = 'https://pro.m.jd.com/'
         $.get(option, (err, resp, data) => {
             try{
                 if(err){
                     console.log(`🚫 ${arguments.callee.name.toString()} API请求失败，请检查网路\n${JSON.stringify(err)}`)
                 } else {
                     // console.log(data)
                     // return
                     data = JSON.parse(data)
                     if(data.success){
                         //temp adjustment
                         if(selected == 2){
                             if (data.success && data.data) {
                                 $.successList = data.data.list.filter(item => {
                                    
                                     return item.text.text.includes('请尽快领取')
                                 })
                                 console.log(`待领取: ${$.successList.length}个`)
                             } else {
                                 console.log(`获得成功列表失败: ${data.message}`)
                             }
                         }
                         if(data.data.list.length > 0){
                             for(let item of data.data.list){
                                 console.log(`申请时间：${new Date(parseInt(item.applyTime)).toLocaleString()}`)
                                 console.log(`申请商品：${item.trialName}`)
                                 console.log(`当前状态：${item.text.text}`)
                                 console.log(`剩余时间：${remaining(item.leftTime)}`)
                                 console.log()


                                 message += "<font color=\'#4B0082\' size=1>"  + `申请商品：${item.trialName}` + "</font>\n\n"
                                 message += "<font color=\'#4B0082\' size=1>"  + `当前状态：${item.text.text}` + "</font>\n\n"
                                 message += "<font color=\'#4B0082\' size=1>"  + `-----\n\n` + "</font>\n\n"

                             }
                         }
                          // else {
                         //     switch(selected){
                         //         case 1:
                         //             console.log('无已申请的商品\n')
                         //             break;
                         //         case 2:
                         //             console.log('无申请成功的商品\n')
                         //             break;
                         //         case 3:
                         //             console.log('无申请失败的商品\n')
                         //             break;
                         //         default:
                         //             console.log('selected错误')
                         //     }
                         // }
                     } else {
                         console.log(`ERROR:try_MyTrials`)
                     }
                 }
             } catch(e){
                 reject(`⚠️ ${arguments.callee.name.toString()} API返回结果解析出错\n${e}\n${JSON.stringify(data)}`)
             } finally{
                 resolve()
             }
         })
     })
 }
 
 function remaining(time){
     let days = parseInt(time / (1000 * 60 * 60 * 24));
     let hours = parseInt((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
     let minutes = parseInt((time % (1000 * 60 * 60)) / (1000 * 60));
     return `${days} 天 ${hours} 小时 ${minutes} 分`
 }
 
 function taskurl_xh(appid, functionId, body = JSON.stringify({})){
     return {
         "url": `${URL}?appid=${appid}&functionId=${functionId}&clientVersion=10.1.2&client=wh5&body=${encodeURIComponent(body)}`,
         'headers': {
             'Host': 'api.m.jd.com',
             'Accept-Encoding': 'gzip, deflate, br',
             'Cookie': $.cookie,
             'Connection': 'keep-alive',
             'UserAgent': 'jdapp;iPhone;10.1.2;15.0;ff2caa92a8529e4788a34b3d8d4df66d9573f499;network/wifi;model/iPhone13,4;addressid/2074196292;appBuild/167802;jdSupportDarkMode/1;Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1',
             'Accept-Language': 'zh-cn',
             'Referer': 'https://prodev.m.jd.com/'
         },
     }
 }
 
 async function showMsg(){
     let message1 = `京东账号${$.index} ${$.nickName || $.UserName}\n🎉 本次申请：${$.totalSuccess}/${$.totalTry}个商品🛒\n🎉 ${$.successList.length}个商品待领取`
     message += "<font color=\'#778899\' size=2>" + `🎉 本次申请：${$.totalSuccess}/${$.totalTry}个商品🛒\n🎉 ${$.successList.length}个商品待领取` + "</font>\n\n" 
     if(!args_xh.jdNotify || args_xh.jdNotify === 'false'){
         $.msg($.name, ``, message1, {
             "open-url": 'https://try.m.jd.com/user'
         })
         if($.isNode())
             notifyMsg += `${message1}\n\n`
     } else {
         console.log(message1)
     }
 }
 
 function totalBean(){
     return new Promise(async resolve => {
         const options = {
             "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
             "headers": {
                 "Accept": "application/json,text/plain, */*",
                 "Content-Type": "application/x-www-form-urlencoded",
                 "Accept-Encoding": "gzip, deflate, br",
                 "Accept-Language": "zh-cn",
                 "Connection": "keep-alive",
                 "Cookie": $.cookie,
                 "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
                 "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
             },
             "timeout": 10000,
         }
         $.post(options, (err, resp, data) => {
             try{
                 if(err){
                     console.log(`${JSON.stringify(err)}`)
                     console.log(`${$.name} API请求失败，请检查网路重试`)
                 } else {
                     if(data){
                         data = JSON.parse(data);
                         if(data['retcode'] === 13){
                             $.isLogin = false; //cookie过期
                             return
                         }
                         if(data['retcode'] === 0){
                             $.nickName = (data['base'] && data['base'].nickname) || $.UserName;
                         } else {
                             $.nickName = $.UserName
                         }
                     } else {
                         console.log(`京东服务器返回空数据`)
                     }
                 }
             } catch(e){
                 $.logErr(e, resp)
             } finally{
                 resolve();
             }
         })
     })
 }
 
 function jsonParse(str){
     if(typeof str == "string"){
         try{
             return JSON.parse(str);
         } catch(e){
             console.log(e);
             $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
             return [];
         }
     }
 }
 
 // 来自 @chavyleung 大佬
 // https://raw.githubusercontent.com/chavyleung/scripts/master/Env.js
 function Env(name, opts){
     class Http{
         constructor(env){
             this.env = env
         }
 
         send(opts, method = 'GET'){
             opts = typeof opts === 'string' ? {
                 url: opts
             } : opts
             let sender = this.get
             if(method === 'POST'){
                 sender = this.post
             }
             return new Promise((resolve, reject) => {
                 sender.call(this, opts, (err, resp, body) => {
                     if(err) reject(err)
                     else resolve(resp)
                 })
             })
         }
 
         get(opts){
             return this.send.call(this.env, opts)
         }
 
         post(opts){
             return this.send.call(this.env, opts, 'POST')
         }
     }
 
     return new (class{
         constructor(name, opts){
             this.name = name
             this.http = new Http(this)
             this.data = null
             this.dataFile = 'box.dat'
             this.logs = []
             this.isMute = false
             this.isNeedRewrite = false
             this.logSeparator = '\n'
             this.startTime = new Date().getTime()
             Object.assign(this, opts)
             this.log('', `🔔${this.name}, 开始!`)
         }
 
         isNode(){
             return 'undefined' !== typeof module && !!module.exports
         }
 
         isQuanX(){
             return 'undefined' !== typeof $task
         }
 
         isSurge(){
             return 'undefined' !== typeof $httpClient && 'undefined' === typeof $loon
         }
 
         isLoon(){
             return 'undefined' !== typeof $loon
         }
 
         toObj(str, defaultValue = null){
             try{
                 return JSON.parse(str)
             } catch{
                 return defaultValue
             }
         }
 
         toStr(obj, defaultValue = null){
             try{
                 return JSON.stringify(obj)
             } catch{
                 return defaultValue
             }
         }
 
         getjson(key, defaultValue){
             let json = defaultValue
             const val = this.getdata(key)
             if(val){
                 try{
                     json = JSON.parse(this.getdata(key))
                 } catch{ }
             }
             return json
         }
 
         setjson(val, key){
             try{
                 return this.setdata(JSON.stringify(val), key)
             } catch{
                 return false
             }
         }
 
         getScript(url){
             return new Promise((resolve) => {
                 this.get({
                     url
                 }, (err, resp, body) => resolve(body))
             })
         }
 
         runScript(script, runOpts){
             return new Promise((resolve) => {
                 let httpapi = this.getdata('@chavy_boxjs_userCfgs.httpapi')
                 httpapi = httpapi ? httpapi.replace(/\n/g, '').trim() : httpapi
                 let httpapi_timeout = this.getdata('@chavy_boxjs_userCfgs.httpapi_timeout')
                 httpapi_timeout = httpapi_timeout ? httpapi_timeout * 1 : 20
                 httpapi_timeout = runOpts && runOpts.timeout ? runOpts.timeout : httpapi_timeout
                 const [key, addr] = httpapi.split('@')
                 const opts = {
                     url: `http://${addr}/v1/scripting/evaluate`,
                     body: {
                         script_text: script,
                         mock_type: 'cron',
                         timeout: httpapi_timeout
                     },
                     headers: {
                         'X-Key': key,
                         'Accept': '*/*'
                     }
                 }
                 this.post(opts, (err, resp, body) => resolve(body))
             }).catch((e) => this.logErr(e))
         }
 
         loaddata(){
             if(this.isNode()){
                 this.fs = this.fs ? this.fs : require('fs')
                 this.path = this.path ? this.path : require('path')
                 const curDirDataFilePath = this.path.resolve(this.dataFile)
                 const rootDirDataFilePath = this.path.resolve(process.cwd(), this.dataFile)
                 const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath)
                 const isRootDirDataFile = !isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath)
                 if(isCurDirDataFile || isRootDirDataFile){
                     const datPath = isCurDirDataFile ? curDirDataFilePath : rootDirDataFilePath
                     try{
                         return JSON.parse(this.fs.readFileSync(datPath))
                     } catch(e){
                         return {}
                     }
                 } else return {}
             } else return {}
         }
 
         writedata(){
             if(this.isNode()){
                 this.fs = this.fs ? this.fs : require('fs')
                 this.path = this.path ? this.path : require('path')
                 const curDirDataFilePath = this.path.resolve(this.dataFile)
                 const rootDirDataFilePath = this.path.resolve(process.cwd(), this.dataFile)
                 const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath)
                 const isRootDirDataFile = !isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath)
                 const jsondata = JSON.stringify(this.data)
                 if(isCurDirDataFile){
                     this.fs.writeFileSync(curDirDataFilePath, jsondata)
                 } else if(isRootDirDataFile){
                     this.fs.writeFileSync(rootDirDataFilePath, jsondata)
                 } else {
                     this.fs.writeFileSync(curDirDataFilePath, jsondata)
                 }
             }
         }
 
         lodash_get(source, path, defaultValue = undefined){
             const paths = path.replace(/\[(\d+)\]/g, '.$1').split('.')
             let result = source
             for(const p of paths){
                 result = Object(result)[p]
                 if(result === undefined){
                     return defaultValue
                 }
             }
             return result
         }
 
         lodash_set(obj, path, value){
             if(Object(obj) !== obj) return obj
             if(!Array.isArray(path)) path = path.toString().match(/[^.[\]]+/g) || []
             path.slice(0, -1).reduce((a, c, i) => (Object(a[c]) === a[c] ? a[c] : (a[c] = Math.abs(path[i + 1]) >> 0 === +path[i + 1] ? [] : {})), obj)[
                 path[path.length - 1]
                 ] = value
             return obj
         }
 
         getdata(key){
             let val = this.getval(key)
             // 如果以 @
             if(/^@/.test(key)){
                 const [, objkey, paths] = /^@(.*?)\.(.*?)$/.exec(key)
                 const objval = objkey ? this.getval(objkey) : ''
                 if(objval){
                     try{
                         const objedval = JSON.parse(objval)
                         val = objedval ? this.lodash_get(objedval, paths, '') : val
                     } catch(e){
                         val = ''
                     }
                 }
             }
             return val
         }
 
         setdata(val, key){
             let issuc = false
             if(/^@/.test(key)){
                 const [, objkey, paths] = /^@(.*?)\.(.*?)$/.exec(key)
                 const objdat = this.getval(objkey)
                 const objval = objkey ? (objdat === 'null' ? null : objdat || '{}') : '{}'
                 try{
                     const objedval = JSON.parse(objval)
                     this.lodash_set(objedval, paths, val)
                     issuc = this.setval(JSON.stringify(objedval), objkey)
                 } catch(e){
                     const objedval = {}
                     this.lodash_set(objedval, paths, val)
                     issuc = this.setval(JSON.stringify(objedval), objkey)
                 }
             } else {
                 issuc = this.setval(val, key)
             }
             return issuc
         }
 
         getval(key){
             if(this.isSurge() || this.isLoon()){
                 return $persistentStore.read(key)
             } else if(this.isQuanX()){
                 return $prefs.valueForKey(key)
             } else if(this.isNode()){
                 this.data = this.loaddata()
                 return this.data[key]
             } else {
                 return (this.data && this.data[key]) || null
             }
         }
 
         setval(val, key){
             if(this.isSurge() || this.isLoon()){
                 return $persistentStore.write(val, key)
             } else if(this.isQuanX()){
                 return $prefs.setValueForKey(val, key)
             } else if(this.isNode()){
                 this.data = this.loaddata()
                 this.data[key] = val
                 this.writedata()
                 return true
             } else {
                 return (this.data && this.data[key]) || null
             }
         }
 
         initGotEnv(opts){
             this.got = this.got ? this.got : require('got')
             this.cktough = this.cktough ? this.cktough : require('tough-cookie')
             this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar()
             if(opts){
                 opts.headers = opts.headers ? opts.headers : {}
                 if(undefined === opts.headers.Cookie && undefined === opts.cookieJar){
                     opts.cookieJar = this.ckjar
                 }
             }
         }
 
         get(opts, callback = () => { }){
             if(opts.headers){
                 delete opts.headers['Content-Type']
                 delete opts.headers['Content-Length']
             }
             if(this.isSurge() || this.isLoon()){
                 if(this.isSurge() && this.isNeedRewrite){
                     opts.headers = opts.headers || {}
                     Object.assign(opts.headers, {
                         'X-Surge-Skip-Scripting': false
                     })
                 }
                 $httpClient.get(opts, (err, resp, body) => {
                     if(!err && resp){
                         resp.body = body
                         resp.statusCode = resp.status
                     }
                     callback(err, resp, body)
                 })
             } else if(this.isQuanX()){
                 if(this.isNeedRewrite){
                     opts.opts = opts.opts || {}
                     Object.assign(opts.opts, {
                         hints: false
                     })
                 }
                 $task.fetch(opts).then(
                     (resp) => {
                         const {
                             statusCode: status,
                             statusCode,
                             headers,
                             body
                         } = resp
                         callback(null, {
                             status,
                             statusCode,
                             headers,
                             body
                         }, body)
                     },
                     (err) => callback(err)
                 )
             } else if(this.isNode()){
                 this.initGotEnv(opts)
                 this.got(opts).on('redirect', (resp, nextOpts) => {
                     try{
                         if(resp.headers['set-cookie']){
                             const ck = resp.headers['set-cookie'].map(this.cktough.Cookie.parse).toString()
                             if(ck){
                                 this.ckjar.setCookieSync(ck, null)
                             }
                             nextOpts.cookieJar = this.ckjar
                         }
                     } catch(e){
                         this.logErr(e)
                     }
                     // this.ckjar.setCookieSync(resp.headers['set-cookie'].map(Cookie.parse).toString())
                 }).then(
                     (resp) => {
                         const {
                             statusCode: status,
                             statusCode,
                             headers,
                             body
                         } = resp
                         callback(null, {
                             status,
                             statusCode,
                             headers,
                             body
                         }, body)
                     },
                     (err) => {
                         const {
                             message: error,
                             response: resp
                         } = err
                         callback(error, resp, resp && resp.body)
                     }
                 )
             }
         }
 
         post(opts, callback = () => { }){
             // 如果指定了请求体, 但没指定`Content-Type`, 则自动生成
             if(opts.body && opts.headers && !opts.headers['Content-Type']){
                 opts.headers['Content-Type'] = 'application/x-www-form-urlencoded'
             }
             if(opts.headers) delete opts.headers['Content-Length']
             if(this.isSurge() || this.isLoon()){
                 if(this.isSurge() && this.isNeedRewrite){
                     opts.headers = opts.headers || {}
                     Object.assign(opts.headers, {
                         'X-Surge-Skip-Scripting': false
                     })
                 }
                 $httpClient.post(opts, (err, resp, body) => {
                     if(!err && resp){
                         resp.body = body
                         resp.statusCode = resp.status
                     }
                     callback(err, resp, body)
                 })
             } else if(this.isQuanX()){
                 opts.method = 'POST'
                 if(this.isNeedRewrite){
                     opts.opts = opts.opts || {}
                     Object.assign(opts.opts, {
                         hints: false
                     })
                 }
                 $task.fetch(opts).then(
                     (resp) => {
                         const {
                             statusCode: status,
                             statusCode,
                             headers,
                             body
                         } = resp
                         callback(null, {
                             status,
                             statusCode,
                             headers,
                             body
                         }, body)
                     },
                     (err) => callback(err)
                 )
             } else if(this.isNode()){
                 this.initGotEnv(opts)
                 const {
                     url,
                     ..._opts
                 } = opts
                 this.got.post(url, _opts).then(
                     (resp) => {
                         const {
                             statusCode: status,
                             statusCode,
                             headers,
                             body
                         } = resp
                         callback(null, {
                             status,
                             statusCode,
                             headers,
                             body
                         }, body)
                     },
                     (err) => {
                         const {
                             message: error,
                             response: resp
                         } = err
                         callback(error, resp, resp && resp.body)
                     }
                 )
             }
         }
 
         /**
          *
          * 示例:$.time('yyyy-MM-dd qq HH:mm:ss.S')
          *    :$.time('yyyyMMddHHmmssS')
          *    y:年 M:月 d:日 q:季 H:时 m:分 s:秒 S:毫秒
          *    其中y可选0-4位占位符、S可选0-1位占位符，其余可选0-2位占位符
          * @param {*} fmt 格式化参数
          *
          */
         time(fmt){
             let o = {
                 'M+': new Date().getMonth() + 1,
                 'd+': new Date().getDate(),
                 'H+': new Date().getHours(),
                 'm+': new Date().getMinutes(),
                 's+': new Date().getSeconds(),
                 'q+': Math.floor((new Date().getMonth() + 3) / 3),
                 'S': new Date().getMilliseconds()
             }
             if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (new Date().getFullYear() + '').substr(4 - RegExp.$1.length))
             for(let k in o)
                 if(new RegExp('(' + k + ')').test(fmt))
                     fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
             return fmt
         }
 
         /**
          * 系统通知
          *
          * > 通知参数: 同时支持 QuanX 和 Loon 两种格式, EnvJs根据运行环境自动转换, Surge 环境不支持多媒体通知
          *
          * 示例:
          * $.msg(title, subt, desc, 'twitter://')
          * $.msg(title, subt, desc, { 'open-url': 'twitter://', 'media-url': 'https://github.githubassets.com/images/modules/open_graph/github-mark.png' })
          * $.msg(title, subt, desc, { 'open-url': 'https://bing.com', 'media-url': 'https://github.githubassets.com/images/modules/open_graph/github-mark.png' })
          *
          * @param {*} title 标题
          * @param {*} subt 副标题
          * @param {*} desc 通知详情
          * @param {*} opts 通知参数
          *
          */
         msg(title = name, subt = '', desc = '', opts){
             const toEnvOpts = (rawopts) => {
                 if(!rawopts) return rawopts
                 if(typeof rawopts === 'string'){
                     if(this.isLoon()) return rawopts
                     else if(this.isQuanX()) return {
                         'open-url': rawopts
                     }
                     else if(this.isSurge()) return {
                         url: rawopts
                     }
                     else return undefined
                 } else if(typeof rawopts === 'object'){
                     if(this.isLoon()){
                         let openUrl = rawopts.openUrl || rawopts.url || rawopts['open-url']
                         let mediaUrl = rawopts.mediaUrl || rawopts['media-url']
                         return {
                             openUrl,
                             mediaUrl
                         }
                     } else if(this.isQuanX()){
                         let openUrl = rawopts['open-url'] || rawopts.url || rawopts.openUrl
                         let mediaUrl = rawopts['media-url'] || rawopts.mediaUrl
                         return {
                             'open-url': openUrl,
                             'media-url': mediaUrl
                         }
                     } else if(this.isSurge()){
                         let openUrl = rawopts.url || rawopts.openUrl || rawopts['open-url']
                         return {
                             url: openUrl
                         }
                     }
                 } else {
                     return undefined
                 }
             }
             if(!this.isMute){
                 if(this.isSurge() || this.isLoon()){
                     $notification.post(title, subt, desc, toEnvOpts(opts))
                 } else if(this.isQuanX()){
                     $notify(title, subt, desc, toEnvOpts(opts))
                 }
             }
             if(!this.isMuteLog){
                 let logs = ['', '==============📣系统通知📣==============']
                 logs.push(title)
                 subt ? logs.push(subt) : ''
                 desc ? logs.push(desc) : ''
                 console.log(logs.join('\n'))
                 this.logs = this.logs.concat(logs)
             }
         }
 
         log(...logs){
             if(logs.length > 0){
                 this.logs = [...this.logs, ...logs]
             }
             console.log(logs.join(this.logSeparator))
         }
 
         logErr(err, msg){
             const isPrintSack = !this.isSurge() && !this.isQuanX() && !this.isLoon()
             if(!isPrintSack){
                 this.log('', `❗️${this.name}, 错误!`, err)
             } else {
                 this.log('', `❗️${this.name}, 错误!`, err.stack)
             }
         }
 
         wait(time){
             return new Promise((resolve) => setTimeout(resolve, time))
         }
 
         done(val = {}){
             const endTime = new Date().getTime()
             const costTime = (endTime - this.startTime) / 1000
             this.log('', `🔔${this.name}, 结束! 🕛 ${costTime} 秒`)
             this.log()
             if(this.isSurge() || this.isQuanX() || this.isLoon()){
                 $done(val)
             }
         }
     })(name, opts)
 }
 
 
 //我加的函数
 function postToDingTalk(messgae) {
     const dingtalk = "https://oapi.dingtalk.com/robot/send?access_token=18444b555747aad3381bc1d1e3dea72b03158e152a846f818d82a1ca946bd430"
 
     const message1 = "" + messgae
     that.log(messgae)
 
     const body = {
         "msgtype": "markdown",
         "markdown": {
             "title":"试用生鲜美食",
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