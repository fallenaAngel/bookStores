var homeJson = require('./data/home.json'),
  recommend1 = require('./data/recommend/recommend1.json'),
  recommend2 = require('./data/recommend/recommend2.json'),
  recommend3 = require('./data/recommend/recommend3.json'),
  bookRackData = require('./data/BookMain.json'),
  searchListZhu = require('./data/search-zhu.json'),
  searchListTian = require('./data/search-tian.json'),
  detailList = require('./data/bookDetail.json'),
  chapterData1 = require('./data/chapter/chapter1.json'),
  chapterData2 = require('./data/chapter/chapter2.json'),
  chapterData3 = require('./data/chapter/chapter3.json'),
  chapterData4 = require('./data/chapter/chapter4.json'),
  chapterData5 = require('./data/chapter/chapter5.json'),
  chapterData6 = require('./data/chapter/chapter6.json')

var jsonObj = {
  '/api/index': homeJson,
  '/api/recommend?pageNum=1&count=10': recommend1,
  '/api/recommend?pageNum=2&count=10': recommend2,
  '/api/recommend?pageNum=3&count=10': recommend3,
  '/api/bookRackList': bookRackData,
  '/api/searchList?val=诛仙': searchListZhu,
  '/api/searchList?val=择天记': searchListTian,
  '/api/detailList?fiction_id=352876': detailList,
  '/api/chapterCon?fiction_id=352876&chapterNum=0': chapterData1,
  '/api/chapterCon?fiction_id=352876&chapterNum=1': chapterData2,
  '/api/chapterCon?fiction_id=352876&chapterNum=2': chapterData3,
  '/api/chapterCon?fiction_id=352876&chapterNum=3': chapterData4,
  '/api/chapterCon?fiction_id=352876&chapterNum=4': chapterData5,
  '/api/chapterCon?fiction_id=352876&chapterNum=5': chapterData6
}
module.exports = function(url) {
  if (jsonObj[url]) {
    return jsonObj[url]
  } else {
    return false
  }
}
