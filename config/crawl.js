const axios = require('axios');
const cheerio = require('cheerio');


// 去除空格
const removeBlock = (txt) => {
    if(txt && typeof txt === 'string'){
        return txt.replace(/[\t|\n]*/ig,'');
    }else{
        return txt;
    }
}


// crawl
module.exports = async (keyword) => {
    // 获取网源的页面内容
    let crawlUrl = 'https://search.jd.com/Search?keyword='+keyword;
    const { data } = await axios.get(crawlUrl,{
        headers: {
            'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
        }
    })
    // 解析页面内容 cheerio 类似于jquery
    const $ = cheerio.load(data);
    let arr = []; // 存储列表
    // console.log(data)
    $('.gl-warp .gl-item').each((index,e) => {arr.push({
            title: removeBlock($(e).find('.p-name').eq(0).text()),
            img: $(e).find('.p-img img').eq(0).attr('data-lazy-img'),
            price: removeBlock($(e).find('.p-price').eq(0).text()),
            href:  $(e).find('.p-img a').eq(0).attr('href'),
            merchant: removeBlock($(e).find('.hd-shopname').eq(0).text()),
        })
    })

    return arr;
}