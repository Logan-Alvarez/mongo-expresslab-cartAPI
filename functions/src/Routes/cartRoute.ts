import express from "express";
import { ObjectId } from "mongodb";
import { getClient } from "../db";
import Item from "../Models/Item";

const cartRoute = express.Router();

cartRoute.get("/cart-items", async (req, res) => {
  const maxPrice = parseInt(req.query.maxPrice as string);
  const product = req.query.product as string;
  const pageSize = parseInt(req.query.pageSize as string) || 0;

  let conditional = {};
  if (maxPrice) {
    conditional = { price: { $lte: maxPrice } };
  }
  if (product) {
    conditional = { name: product };
  }
  try {
    const client = await getClient();
    const results = await client
      .db()
      .collection<Item>("cartItems")
      .find(conditional)
      .limit(pageSize)
      .toArray();
    res.json(results).status(200);
  } catch (error) {
    console.log("ERROR");
    res.status(500).json({ message: "Internal Server Error" });
  }
});

cartRoute.get("/cart-items/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const client = await getClient();
    const item = await client
      .db()
      .collection<Item>("cartItems")
      .findOne({ _id: new ObjectId(id) });
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: "Item not found homie" });
    }
  } catch (err) {}
});

cartRoute.post("/cart-items", async (req, res) => {
  const newItem = req.body as Item;
  try {
    const client = await getClient();
    await client.db().collection<Item>("cartItems").insertOne(newItem);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

cartRoute.put("/cart-items/:id", async (req, res) => {
  const id = req.params.id;
  const item = req.body as Item;
  delete item._id; // remove _id from body so we only have one.
  try {
    const client = await getClient();
    const result = await client
      .db()
      .collection<Item>("cartItems")
      .replaceOne({ _id: new ObjectId(id) }, item);
    if (result.modifiedCount === 0) {
      res.status(404).json({ message: "Not Found" });
    } else {
      item._id = new ObjectId(id);
      res.json(item);
    }
  } catch {}
});

cartRoute.delete("/cart-items/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const client = await getClient();
    const item = await client
      .db()
      .collection<Item>("cartItems")
      .deleteOne({ _id: new ObjectId(id) });
    if (item.deletedCount === 0) {
      res.status(404).json({ message: "Id not found" });
    } else {
      res.status(204).end();
    }
  } catch (err) {}
});

export default cartRoute;
