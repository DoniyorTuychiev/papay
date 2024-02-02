const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose"); 

const connectionString = process.env.MONGO_URL;
//env ichidagila: PORT = 4000
//MONGO_URL = mongodb+srv://doni:kjil35Fo8aHsyx80@cluster0.xbvoiwi.mongodb.net/Papay

mongoose.connect(
  connectionString, //1-Sring
  {
    useNewUrlParser: true, //2- true bilan useNewUrlParser va true bilan useUnifiedTopology
    useUnifiedTopology: true,
  },
  (err, goose) => {
    try {
      //2 - qadam
      console.log("MongoDB connection succead");
      const server = require("./app"); //socet ni ishlatishimiz uchun http dan instence olindi. shuning uchun app ni shunde jonatmasdan http

      let PORT = process.env.PORT || 4000;
      server.listen(PORT, function () {
        console.log(
          `The server is running successfully on part : ${PORT}, http://localhost:${PORT}`
        );
      });
    } catch (err) {
      //1 - qadam
      console.log(`ERROR on connection MongoDB, ${err.message}`);
    }
  }
);
