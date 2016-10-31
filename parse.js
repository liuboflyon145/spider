var cheerio = require("cheerio");
var server = require("./curl");


var url = "http://v.163.com/special/opencourse/englishs1.html"

server.download(url, function(data) {
  if (data) {
    console.log(data);

    var $ = cheerio.load(data);
    console.log('-----------');
    $("a").each(function(i, e) {
        console.log($(e).attr("href"));
    });

    console.log("done");
  } else {
      console.log("error");
  }
});
