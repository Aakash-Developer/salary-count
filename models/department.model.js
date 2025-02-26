import mongoose from "mongoose";

const DepartmentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
});

export const DepartmentModel = mongoose.model("Department", DepartmentSchema);
