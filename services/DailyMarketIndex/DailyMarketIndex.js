require('dotenv').config()
var cron = require('node-cron');
const axios = require('axios');



///Everyday at midnight
cron.schedule('* * * * *', () => {
    axios.get("https://financialmodelingprep.com/api/v3/quotes/index?apikey="+process.env.STOCK_API).then(response => {
        // var params = {
        //     TableName:table,
        //     Item:{
        //         "UUID": uuidv4(),
        //         "service": "Service1",
        //         "time": Date.now(),
        //         "data":response.data
        //     }
        // };
    }).catch(error => console.log(error));
});