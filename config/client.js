const { Client } =  require("@elastic/elasticsearch");
const client = new Client({
    node: 'http://localhost:9200'
});
const INDEX_NAME = 'nativa-project';



module.exports = { client, INDEX_NAME };