import { Db, MongoClient } from 'mongodb'
// import { createRequire } from 'node:module';
// Connection URL
const urlMongo = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017'
// Database Name
const dbName = process.env.mongoDbName || 'learning';
// Client
const clientMongo = new MongoClient(urlMongo)
// Database
const database = clientMongo.db(dbName);

class MongoDbClient {

    constructor(
        private dbName: string,
        private clientMongo: MongoClient,
        public database: Db,
    ) { }

    //async constructor with await only
    async then(resolve: any, reject: any) {

        // const require = createRequire(import.meta.url)
        // console.log("Object.keys", Object.keys(require.cache));
        // console.log("Object.values", Object.values(require.cache));

        console.log('MongoDbClient ... ');
        try {
            await this.connect()
            await this.ping()
            Object.assign(this, { then: null })
            resolve(this)
        } catch (error) {
            this.clientMongo.close()
            console.log('MongoDbClient error:', error);
        }
    }
    async connect() {
        // connect the client
        await this.clientMongo.connect();
        console.log('MongoDbClient connected to db-server');
    }
    async ping() {
        //connect db and verify connection    
        await this.database.command({ ping: 1 })
        console.log(`MongoDbClient connected to database: ${this.dbName}`);

    }
    async disconnect() {
        await this.clientMongo.close();
    }
    async reConnect() { }
}
//@ts-ignore 
export default await new MongoDbClient(dbName, clientMongo, database)
