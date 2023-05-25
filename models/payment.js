const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
    {
        individual: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        amount: {
          type: Number,
          required: true,
        },
        status: {
          type: String,
          enum: {
            values: ["unpaid", "paid"],
            message: "{VALUE} is not an option",
          },
          default: "unpaid",
        },
        validUntil: {
          type: Date,
        },
        transaction_ref: {
          type: String,
        },
      },
      { timestamps: true }

);
module.exports = mongoose.model("Payment", paymentSchema);