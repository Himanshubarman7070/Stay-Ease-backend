import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "GroceryProduct" },
  name: String,
  price: Number,
  quantity: Number,
});

const groceryOrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    deliveryStatus: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
    deliveryAddress: { type: String, default: "" },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    paymentPending: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("GroceryOrder", groceryOrderSchema);
