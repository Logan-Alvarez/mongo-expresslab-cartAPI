import { ObjectId } from "mongodb";

export default interface Item {
  _id?: ObjectId;
  name: string;
  price: number;
  quantity: number;
}
