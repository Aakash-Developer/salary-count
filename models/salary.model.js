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
  overtime: { days: Number, hours: Number, minutes: Number },
});

export const SalaryModel = mongoose.model("Salary", salarySchema);
