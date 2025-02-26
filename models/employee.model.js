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
    ifscCode: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  workingHours: 8,
  leaveBalance: {
    cl: {
      type: Number,
      default: 0,
    },
    pl: {
      type: Number,
      default: 0,
    },
  },
});

export const EmployeeModel = mongoose.model("Employee", EmployeeSchema);
