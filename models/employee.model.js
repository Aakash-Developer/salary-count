import mongoose from "mongoose";

const EmployeeSchema = mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },
  bankInfo: {
    acNo: String,
    bankName: String,
    branchName: String,
    ifscCode: string,
  },
});

export const EmployeeModel = mongoose.model("employee", EmployeeSchema);
