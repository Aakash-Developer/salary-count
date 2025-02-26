import { DepartmentModel } from "../models/department.model";
import { EmployeeModel } from "../models/employee.model";

// Create a new department
const createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;
    const department = new DepartmentModel({ name, description });
    await department.save();
    res.status(201).json({ status: 1, message: "Department created successfully", data: department });
  } catch (error) {
    res.status(400).json({ status: 0, message: error.message });
  }
};

// Get all departments
const getDepartments = async (req, res) => {
  try {
    const departments = await DepartmentModel.find();
    res.status(200).json({ status: 1, message: "Data received", data: departments });
  } catch (error) {
    res.status(500).json({ status: 0, message: error.message });
  }
};

// Get a single department by ID with employees
const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await DepartmentModel.findById(id);
    if (!department) {
      return res.status(404).json({ status: 0, message: "Department not found" });
    }
    const employees = await EmployeeModel.find({ departmentID: id });
    res.status(200).json({ status: 1, message: "Data received", data: { department, employees } });
  } catch (error) {
    res.status(500).json({ status: 0, message: error.message });
  }
};

// Update a department by ID
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDepartment = await DepartmentModel.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedDepartment) {
      return res.status(404).json({ status: 0, message: "Department not found" });
    }
    res.status(200).json({ status: 1, message: "Department updated successfully", data: updatedDepartment });
  } catch (error) {
    res.status(400).json({ status: 0, message: error.message });
  }
};

// Delete a department by ID
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDepartment = await DepartmentModel.findByIdAndDelete(id);
    if (!deletedDepartment) {
      return res.status(404).json({ status: 0, message: "Department not found" });
    }
    res.status(200).json({ status: 1, message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: 0, message: error.message });
  }
};

export const departmentAction = { getDepartments, createDepartment, getDepartmentById, updateDepartment, deleteDepartment };
