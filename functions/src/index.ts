//IMPORTS
import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
import cartRoute from "./Routes/cartRoute";

//app.use is a way to register and use middleware.
//SYNTAX app.use(path,middleware functions(req,res))

const app = express(); //Creates a new instance of express.
app.use(cors()); //Cross-Origin-Resource-Sharing. Makes your server accessible to any domain that requests a resource from your server via a broweser.
app.use(express());

app.use("/", cartRoute);

export const api = functions.https.onRequest(app);
