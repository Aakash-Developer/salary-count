app.post("/calculate-salary", async (req, res) => {
  try {
    const salaries = await Salary.find().populate("employeeId"); // Fetch all salary records with employee details

    if (!salaries || salaries.length === 0) {
      return res.status(404).json({ error: "No salary data found" });
    }

    const salaryDetails = salaries.map((salary) => {
      const totalPresentDays = salary.presentDays + salary.sickLeaves + salary.casualLeaves;
      const totalLeaves = salary.workingDays - salary.presentDays;
      const unpaidLeaves = salary.workingDays - totalPresentDays;
      const totalPaidLeaves = salary.sickLeaves + salary.casualLeaves;
      const oneDaySalary = salary.salary / salary.workingDays;
      const hourlySalary = oneDaySalary / 8;
      const overtimePay = salary.overtime.days * oneDaySalary + salary.overtime.hours * hourlySalary + salary.overtime.minutes * (hourlySalary / 60);

      const totalSalary = totalPresentDays * oneDaySalary + overtimePay + salary.incentives - salary.deductions;

      return {
        employeeId: salary.employeeId._id,
        employeeName: salary.employeeId.name,
        baseSalary: salary.salary,
        workingDays: salary.workingDays,
        presentDays: salary.presentDays,
        sickLeaves: salary.sickLeaves,
        casualLeaves: salary.casualLeaves,
        unpaidLeaves: unpaidLeaves,
        totalPaidLeaves: totalPaidLeaves,
        overtimeDays: salary.overtime.days,
        overtimeHours: salary.overtime.hours,
        overtimeMinutes: salary.overtime.minutes,
        incentives: salary.incentives,
        deductions: salary.deductions,
        totalSalary: totalSalary.toFixed(2),
      };
    });

    res.json({ status: 1, message: "Data received successfully.", salaryDetails });
  } catch (error) {
    res.status(500).json({ status: 0, message: "Server error", error });
  }
});
