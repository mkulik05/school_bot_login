const logger = require("./logger")("creds_db")
// const mongo_creds = require("./mongo_creds.json");
const { MongoClient } = require("mongodb");
let url = ""
const args = process.argv
if (args[args.length-1] == "server") {
        console.log("server mode")
        const m_creds = require("./mongo_creds.json")
        url =
        `mongodb://${m_creds.user}:${m_creds.password}@40.90.237.194:27017/school_bot?authSource=school_bot&readPreference=primary&gssapiServiceName=mongodb&appname=MongoDB%20Compass%20Beta&ssl=false`;
} else {
        console.log("test mode")
        url =
        'mongodb://localhost:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false';
}
const dbName = "school_bot";


let add_creds = async (creds, tg_id) => {
  const client = new MongoClient(url, { useUnifiedTopology: true });
  logger.info({tg_id:tg_id}, "created new mongo client(add_creds)");
  try {
    await client.connect();
    const db = client.db(dbName);
    let col = db.collection("creds");
    if (col == null) {
      await db.createCollection("creds", (err, res) => {
        if (err) {
          logger.error({tg_id:tg_id}, "error in creating collection", err);
        }
        logger.info({tg_id:tg_id}, "system collection created!");
        db.close();
      });
    }
    let result = await col.findOne({});
    //logger.debug("result", result)
    if (result == null) {
      await col.insertOne( {[tg_id]: creds});
    } else {
        console.log(tg_id, typeof tg_id)
        result[tg_id] = creds
        await col.replaceOne({}, result);
      
    
    }
  } catch (err) {
    logger.error({tg_id:tg_id}, "error", err.stack);
  } finally {
    await client.close();
  }
};
module.exports = add_creds;
