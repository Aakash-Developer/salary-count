import mongoose from "mongoose";

const salarySchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  salary: Number,
  workingDays: Number,
  presentDays: Number,
  casualLeaves: Number,
  sickLeaves: Number,
  deductions: Number,
  incentives: Number,
  daysAddon: Number,
  month: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    require: true,
  },
  year: {
    type: Number,
    require: true,
  },
  overtime: { days: Number, hours: Number, minutes: Number },
});

export const SalaryModel = mongoose.model("Salary", salarySchema);
