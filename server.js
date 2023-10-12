const http = require("http");
const mongodb = require("mongodb");

let db;
const connectionString = 
"mongodb+srv://doni:kjil35Fo8aHsyx80@cluster0.xbvoiwi.mongodb.net/Reja";

mongodb.connect(
    connectionString, //1-Sring
    {
        useNewUrlParser: true,//2- true bilan useNewUrlParser va true bilan useUnifiedTopology
        useUnifiedTopology: true, 
    }, 
    (err, client) => {// 3- parametr bu callBack boladi
        try{ //2 - qadam
            console.log("MongoDB connection succead");

            module.exports = client; 
          
            const app = require("./app");
            console.log("I am here");
            const server = http.createServer(app);
             
            let PORT = 4000;
            server.listen(PORT, function () {
                console.log(`The server is running successfully on part : ${PORT}, http://localhost:${PORT}`//http://localhost:${PORT} orqali linkniyam consolda kora olamiz
                );
            });   

        }catch{ //1 - qadam
                
            console.log("ERROR on connection MongoDB");
        }  
    });