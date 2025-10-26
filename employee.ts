interface Employee {
  id: number;
  name: string;
  role: string;
  email: string;
}

class EmployeeManager {
  private employees: Employee[] = [];

  constructor(initialData: Employee[]) {
    this.employees = initialData;
  }

  addEmployee(name: string, role: string, email: string): void {
    const newId = this.employees.length
      ? Math.max(...this.employees.map(e => e.id)) + 1
      : 1;
    const newEmployee: Employee = { id: newId, name, role, email };
    this.employees.push(newEmployee);
  }

  removeEmployee(id: number): void {
    this.employees = this.employees.filter(emp => emp.id !== id);
  }

  filterEmployees(query: string): Employee[] {
    return this.employees.filter(emp =>
      emp.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  getEmployeeById(id: number): Employee | undefined {
    return this.employees.find(emp => emp.id === id);
  }

  getAllEmployees(): Employee[] {
    return [...this.employees];
  }
}
