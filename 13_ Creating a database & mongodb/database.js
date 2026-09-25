//NOTES

//Go to mongodb website
//create a free mo cluster
//create a user
//get the connection string (URI)
//Install mongo DB compass
//Create a database
//Install mongodb backage : npm i mongodb
//Create a connection from code
//Documents CRUD - Create, Read, Update, Delete

require("./preload.cjs");

require("dotenv").config();
const { MongoClient } = require("mongodb");

const url = process.env.MONGODB_URI;
const client = new MongoClient(url);

const dbName = "HelloWorld";

async function main() {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection("User");

    const data = {
        firstname: "Dikshhya",
        secondname: "Khanal",
        city: "pokhara",
        phone: "9813965138"
    }

    // Find All Documents
    const findResult = await collection.find({}).toArray();
    console.log('Found document =>', findResult)

    //Insert a Document
    const insertResult = await collection.insertOne(data);
    console.log('Inserted documents =>', insertResult);

    //Update a document
    const updateResult = await collection.updateOne({ firstname: "Dikshhya" }, { $set: { firstname: "Dikshya" } })
    console.log('Updated documents =>', updateResult);

    //Find Documents with a Query Filter with firstname Ramit
    const filteredDocs = await collection.find({ firstname: "Ramit" }).toArray();
    console.log('Found documents filtered by {firstname: "Ramit"} =>', filteredDocs);

    // Remove a document
    const deleteResult = await collection.deleteMany({ firstname: "Dikshhya" });
    console.log('Deleted documents =>', deleteResult);

    //count
    const countResult = await collection.countDocuments({});
    console.log('Count=>', countResult);
    



    return "done.";

}

main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());

