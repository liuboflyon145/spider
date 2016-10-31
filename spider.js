var request = require('request');
let cheerio = require('cheerio'),
http = require('http'),
fs = require('fs'),
data = require('./data'),
bufferhelper  = require('bufferhelper'),
baseUrl = 'http://www.epkmn.cn/'
dest='/Users/liubo/images'


function fetch_image(image_url,image_name,city){
    try {
        let dest_path = dest +"/"+city;
        request(image_url,function(error,response,body){
            console.log(body);
            if(!error&&response.statusCode==200){
                fs.createWriteStream(dest_path+"/"+image_name);
            }
        })
    }catch (e){
          // console.log('----------e2',e);
    }

}

function make_dir  (city){
    let dest_path = dest+'/'+city,
    dir_path = fs.existsSync(dest_path);
    if (!dir_path){
        console.log('==========',dest_path,dir_path)
        fs.mkdir(dest_path);
    }
}

function  request_image(order,city) {
    var url = baseUrl+'/photo'+order+'.html?city='+city;
    try {
      request(url, function (error, response, body) {
          if (!error && response.statusCode == 200) {
              let $ = cheerio.load(body),
                  reg = /^(\s|\S)+(jpg|png|JPG|PNG)+$/;
              $('a').each(function (i,e) {
                  let src_path =$(e).attr("href");
                  if(reg.test(src_path)){
                      let name = src_path.substr(src_path.indexOf('/')+1),
                      image_url = baseUrl+src_path;
                      console.log('----',image_url);
                      fetch_image(image_url,name,city);
                  }else {
                      // console.log('爬出图片格式错误',src_path);
                  }
              });
          }else if(!error){
              // console.log('------code',response.statusCode);
          }
      });
    }catch (e){
      // console.log('-------e1',e);
    }
}

let cities = data;
cities.forEach(function (city) {
    if (city!=undefined&&city!=null&&city!="") {
        make_dir(city);
        for (var i = 1; i < 5; i++) {
            // console.log('for i ' ,i,city);
            request_image(i, city);
        }
    }else {
      console.log('=============');
    }
});
