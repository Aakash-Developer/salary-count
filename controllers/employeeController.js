import { EmployeeModel } from "../models/employee.model";

// Create a new employee
export const createEmployee = async (req, res) => {
  try {
    const employee = new EmployeeModel(req.body);
    await employee.save();
    res.status(201).json({ status: 1, message: "Employee created successfully", data: employee });
  } catch (error) {
    res.status(400).json({ status: 0, message: error.message });
  }
};

// Get all employees (only active employees)
export const getEmployees = async (req, res) => {
  try {
    const employees = await EmployeeModel.find({ isActive: true }).populate("departmentId");
    res.status(200).json({ status: 1, message: "Data received", data: employees });
  } catch (error) {
    res.status(500).json({ status: 0, message: error.message });
  }
};

// Get a single employee by ID
export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await EmployeeModel.findById(id).populate("departmentId");
    if (!employee) {
      return res.status(404).json({ status: 0, message: "Employee not found" });
    }
    res.status(200).json({ status: 1, message: "Data received", data: employee });
  } catch (error) {
    res.status(500).json({ status: 0, message: error.message });
  }
};

// Update an employee by ID
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEmployee = await EmployeeModel.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).populate("departmentId");
    if (!updatedEmployee) {
      return res.status(404).json({ status: 0, message: "Employee not found" });
    }
    res.status(200).json({ status: 1, message: "Employee updated successfully", data: updatedEmployee });
  } catch (error) {
    res.status(400).json({ status: 0, message: error.message });
  }
};

// Deactivate an employee by ID
export const deactivateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const deactivatedEmployee = await EmployeeModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!deactivatedEmployee) {
      return res.status(404).json({ status: 0, message: "Employee not found" });
    }
    res.status(200).json({ status: 1, message: "Employee deactivated successfully", data: deactivatedEmployee });
  } catch (error) {
    res.status(500).json({ status: 0, message: error.message });
  }
};
