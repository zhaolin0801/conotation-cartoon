/**
 * Created by behring on 2017/5/16.
 */
let Cartoon = require('.././models/cartoon');
let WechatUser = require('../models/wechat-user');

const CONTENT_TYPE_CARTOON = 1;

function replayRandomCartoonToUser(res, user) {
  Cartoon.count().then(count => {
    let category = '色系军团';
    let number = parseInt(Math.random()*count);
    Cartoon.queryOneBy(category, number).then(cartoon => {
      WechatUser.update(user,{'visitedCartoonCount': user.get('visitedCartoonCount') + 1});
      res.reply([
        {
          title: cartoon.get('category'),
          description: cartoon.get('title'),
          picurl: cartoon.get('qiniu_url')+previewThumbnail,
          url: baseUrl + '/cartoons/'+category+'/'+number
        }
      ]);
    }).catch(error => console.error(error));
  }).catch(error => console.error(error));

}

function isValidText(text) {
  return parseInt(text.trim()) === CONTENT_TYPE_CARTOON;
}

function isLimitVisitCartoonByUser(openId) {
  return new Promise((resolve, reject) => {
    WechatUser.findOrCreateByOpenId(openId).then(user => {
      let visitedCartoonCount = user.get('visitedCartoonCount');
      resolve({isLimit: visitedCartoonCount && visitedCartoonCount >= 3, user: user});
    }).catch(error => reject(error));
  });
}

module.exports = {
  replayRandomCartoonToUser: replayRandomCartoonToUser,
  isValidText: isValidText,
  isLimitVisitCartoonByUser: isLimitVisitCartoonByUser
};
