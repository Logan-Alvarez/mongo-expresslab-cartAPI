import * as functions from "firebase-functions";
import { MongoClient } from "mongodb";

const uri: string = functions.config().mongodb.uri;

let client: MongoClient = new MongoClient(uri);

export const getClient = async () => {
  //async function getClient allows promise based behavior.
  await client.connect(); //await suspends execution until promise is fulfilled or rejected
  return client; //returns a client request.
};
