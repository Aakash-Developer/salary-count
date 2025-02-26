import { SalaryModel } from "../models/Salary.js";
import { EmployeeModel } from "../models/Employee.js";

const createSalary = async (req, res) => {
  try {
    const { employeeId, salary, workingDays, presentDays, casualLeaves, sickLeaves, deductions, incentives, overtime, month, year, daysAddon } = req.body;

    const employee = await EmployeeModel.findById(employeeId);
    if (!employee) return res.status(404).json({ status: 0, message: "Employee not found" });

    employee.leaveBalance.casual -= casualLeaves;
    employee.leaveBalance.sick -= sickLeaves;
    await employee.save();

    const newSalary = new SalaryModel({ employeeId, salary, workingDays, presentDays, casualLeaves, sickLeaves, deductions, incentives, overtime, month, year, daysAddon });
    await newSalary.save();

    res.status(201).json({ status: 1, message: "Salary added successfully", data: newSalary });
  } catch (error) {
    res.status(500).json({ status: 0, message: error.message });
  }
};

const getAllSalaries = async (req, res) => {
  try {
    const salaries = await SalaryModel.find().populate("employeeId");
    res.json({ status: 1, message: "Data received successfully", data: salaries });
  } catch (error) {
    res.status(500).json({ status: 0, message: error.message });
  }
};

const getSalaryById = async (req, res) => {
  try {
    const salary = await SalaryModel.findById(req.params.id).populate("employeeId");
    if (!salary) return res.status(404).json({ status: 0, message: "Salary not found" });
    res.json({ status: 1, message: "Data received successfully", data: salary });
  } catch (error) {
    res.status(500).json({ status: 0, message: error.message });
  }
};

const updateSalary = async (req, res) => {
  try {
    const { casualLeaves, sickLeaves } = req.body;
    const salary = await SalaryModel.findById(req.params.id);
    if (!salary) return res.status(404).json({ status: 0, message: "Salary not found" });

    const employee = await EmployeeModel.findById(salary.employeeId);
    if (!employee) return res.status(404).json({ status: 0, message: "Employee not found" });

    employee.leaveBalance.casual += salary.casualLeaves - casualLeaves;
    employee.leaveBalance.sick += salary.sickLeaves - sickLeaves;
    await employee.save();

    const updatedSalary = await SalaryModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ status: 1, message: "Salary updated successfully", data: updatedSalary });
  } catch (error) {
    res.status(500).json({ status: 0, message: error.message });
  }
};

const deleteSalary = async (req, res) => {
  try {
    const salary = await SalaryModel.findById(req.params.id);
    if (!salary) return res.status(404).json({ status: 0, message: "Salary not found" });

    const employee = await EmployeeModel.findById(salary.employeeId);
    if (employee) {
      employee.leaveBalance.casual += salary.casualLeaves;
      employee.leaveBalance.sick += salary.sickLeaves;
      await employee.save();
    }

    await salary.deleteOne();
    res.json({ status: 1, message: "Salary deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: 0, message: error.message });
  }
};

const calculateSalary = async (req, res) => {
  try {
    const { month, year } = req.query;
    const query = {};
    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);

    const salaries = await SalaryModel.find(query).populate("employeeId");
    if (!salaries.length) return res.status(404).json({ status: 0, message: "No salary data found" });

    const salaryDetails = salaries.map((salary) => {
      const totalPresentDays = salary.presentDays + salary.sickLeaves + salary.casualLeaves;
      const unpaidLeaves = salary.workingDays - totalPresentDays;
      const oneDaySalary = salary.salary / salary.workingDays;
      const addonsDayPayment = salary.daysAddon * oneDaySalary;

      const hourlySalary = oneDaySalary / 8; // Assuming 8 working hours a day
      const overtimePay = (salary.overtime?.days || 0) * oneDaySalary + (salary.overtime?.hours || 0) * hourlySalary + (salary.overtime?.minutes || 0) * (hourlySalary / 60);

      const totalSalary = totalPresentDays * oneDaySalary + overtimePay + addonsDayPayment + salary.incentives - salary.deductions;

      return {
        employeeId: salary.employeeId._id,
        employeeName: salary.employeeId.name,
        baseSalary: salary.salary,
        workingDays: salary.workingDays,
        presentDays: salary.presentDays,
        sickLeaves: salary.sickLeaves,
        casualLeaves: salary.casualLeaves,
        unpaidLeaves,
        overtimeDays: salary.overtime?.days || 0,
        overtimeHours: salary.overtime?.hours || 0,
        overtimeMinutes: salary.overtime?.minutes || 0,
        incentives: salary.incentives,
        deductions: salary.deductions,
        totalSalary: totalSalary.toFixed(2),
      };
    });

    res.json({ status: 1, message: "Salary calculation completed successfully", data: salaryDetails });
  } catch (error) {
    res.status(500).json({ status: 0, message: "Server error", error });
  }
};

export { createSalary, getAllSalaries, calculateSalary, getSalaryById, updateSalary, deleteSalary };

// router.post("/", createSalary);
// router.get("/", getAllSalaries);
// router.get("/calculate?month=2&year=2025", calculateSalary);
// router.get("/:id", getSalaryById);
// router.put("/:id", updateSalary);
// router.delete("/:id", deleteSalary);
