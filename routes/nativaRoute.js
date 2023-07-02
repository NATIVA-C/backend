const router = require('koa-router')()
const { client, INDEX_NAME } = require('../config/client');
const crawl = require('../config/crawl');

router.prefix('/nativaRoute')

// default
router.get('/', function (ctx, next) {
  ctx.body = 'this is a nativa response!'
})

// 爬虫 书本列表
router.get('/crawl/:keyword', async (ctx, next) => {
    // 爬虫解析
    let keyword = ctx.params.keyword;
    let data =  await crawl(keyword);
    
    //格式化列表数据
    const d = data.flatMap(doc => {
        return [{index: { _index: INDEX_NAME}},doc]
    })

    // 批量入库
    const resBulk = await client.bulk({
        body: d
    });

    // 提示
    if(resBulk.body.errors){
        ctx.body = '批量入库操作 系统异常';
    }else{
        ctx.body = resBulk.body;
    }
    
});

// 搜索 书本列表 （从本地ES搜索）查询 分页，匹配，普通搜索
router.get('/search/:keyword/:pageNo/:pageSize', async (ctx, next) => {

    // 获取参数
    let keyword = ctx.params.keyword;
    let pageNo = ctx.params.pageNo;
    let pageSize = ctx.params.pageSize;

    // 查询
    const resSearch =  await client.search({
        index: INDEX_NAME,
        body: {
            query: {
                match: {
                    title: keyword
                }
            }
        },
        from: (pageNo-1)*pageSize,
        size: pageSize
    })


    // 搜素逻辑
    ctx.body = {
        pageNo: pageNo,
        pageSize: pageSize,
        totals: resSearch.body.hits.total.value,
        list: resSearch.body.hits.hits.map(v => v._source),
    };
});

// 高亮搜索
router.get('/search/highlight/:keyword/:pageNo/:pageSize', async (ctx, next) => {
    // 获取参数
    let keyword = ctx.params.keyword;
    let pageNo = ctx.params.pageNo;
    let pageSize = ctx.params.pageSize;

    // 查询
    const resSearch =  await client.search({
        index: INDEX_NAME,
        body: {
            query: {
                match: {
                    title: keyword
                }
            },
            // 高亮查询
            highlight:{
                pre_tags: "<span style='color:red;'>",
                post_tags: "</span>",
                fields: {
                    title: {}
                }
            }
        },
        from: (pageNo-1)*pageSize,
        size: pageSize
    })

    // 替换 高亮属性字段
    let list = resSearch.body.hits.hits.map(v => {
        v._source.title = v.highlight.title[0];
        return v._source;
    })

    // 搜素逻辑
    ctx.body = {
        pageNo: pageNo,
        pageSize: pageSize,
        totals: resSearch.body.hits.total.value,
        list: list,
    };
});


module.exports = router
