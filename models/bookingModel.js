const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  carNumber: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },

  returnAt: { type: Date },   // 🔥 ngày giờ trả thực tế

  totalAmount: { type: Number, required: true },

  lateMinutes: { type: Number, default: 0 },
  lateDays: { type: Number, default: 0 },
  lateFee: { type: Number, default: 0 },

  finalAmount: { type: Number }  // 🔥 tổng tiền cuối cùng
});

module.exports = mongoose.model("Booking", BookingSchema);