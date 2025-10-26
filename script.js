$(document).ready(function () {
  // Simulated async fetch with error handling
  const fetchEmployees = () => {
    const sample = [
      { id: 1, name: "Harshita Suri", role: "Senior Developer", email: "harshita.suri@cginfinity.com" },
      { id: 2, name: "Lakshya Deewan", role: "UI/UX Designer", email: "lakshya.deewan@cginfinity.com" },
      { id: 3, name: "Nitin Pandey", role: "Project Manager", email: "nitin.pandey@cginfinity.com" },
      { id: 4, name: "Samriddhi Gupta", role: "QA Lead", email: "samriddhi.gupta@cginfinity.com" },
      { id: 5, name: "Tapasya Tiwari", role: "DevOps Engineer", email: "tapasya.tiwari@cginfinity.com" },
      { id: 6, name: "Neha", role: "HR Director", email: "neha@cginfinity.com" },
      { id: 7, name: "Darshan Begani", role: "Technical Support", email: "darshan.begani@cginfinity.com" },
      { id: 8, name: "Nikhil Singhal", role: "Software Engineer", email: "nikhil.singhal@cginfinity.com" },
      { id: 9, name: "Harshit Sachdeva", role: "Full Stack Developer", email: "harshit.sachdeva@cginfinity.com" }
    ];

    return new Promise((resolve, reject) => {
      // simulate network delay
      setTimeout(() => {
        // simulate occasional error (very low chance)
        if (Math.random() < 0.02) {
          reject(new Error("Failed to fetch employees"));
        } else {
          resolve(sample);
        }
      }, 500);
    });
  };

  let employees = [];

  function displayEmployees(data) {
    const $list = $("#employeeList");
    $list.empty();
    if (!data.length) {
      $list.append('<p class="empty">No employees found.</p>');
      return;
    }

    data.forEach(emp => {
      const $card = $(
        `<div class="card" data-id="${emp.id}">
          <h3>${emp.name}</h3>
          <p class="role">${emp.role}</p>
          <p class="email">${emp.email}</p>
          <span class="remove-link" data-id="${emp.id}">Remove</span>
        </div>`
      );
      $list.append($card);
    });
  }

  async function init() {
    try {
      employees = await fetchEmployees();
      displayEmployees(employees);
    } catch (err) {
      console.error(err);
      $("#employeeList").html('<p class="error">Could not load employees. Try refreshing.</p>');
    }
  }

  // Search (by name or role)
  $("#searchBox").on("input", function () {
    const q = String($(this).val() || "").trim().toLowerCase();
    if (!q) {
      displayEmployees(employees);
      return;
    }
    const filtered = employees.filter(emp =>
      emp.name.toLowerCase().includes(q) || emp.role.toLowerCase().includes(q)
    );
    displayEmployees(filtered);
  });

  // Open modal on card click (delegation)
  $("#employeeList").on("click", ".card", function (e) {
    if ($(e.target).hasClass("remove-link")) return; // ignore remove clicks
    const id = Number($(this).data("id"));
    const emp = employees.find(x => x.id === id);
    if (!emp) return;

    $("#employeeDetails").html(
      `<h2 id="employeeDetailsTitle">${emp.name}</h2>
       <p><strong>Role:</strong> ${emp.role}</p>
       <p><strong>Email:</strong> ${emp.email}</p>`
    );

    // show modal with animation and accessibility attribute
    $("#employeeModal").attr('aria-hidden', 'false').fadeIn(200);
  });

  // Close modal handlers
  function closeModal() {
    $("#employeeModal").attr('aria-hidden', 'true').fadeOut(180);
  }

  $("#closeModal").on("click", closeModal);
  // clicking overlay (but not content) closes
  $("#employeeModal").on("click", function (e) {
    if (e.target.id === 'employeeModal') closeModal();
  });
  // ESC key
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  // Add employee
  $("#addEmployeeForm").on("submit", function (e) {
    e.preventDefault();
    try {
      const name = String($("#empName").val() || "").trim();
      const role = String($("#empRole").val() || "").trim();
      const email = String($("#empEmail").val() || "").trim();
      if (!name || !role || !email) return;

      const newId = employees.length ? Math.max(...employees.map(e => e.id)) + 1 : 1;
      employees.push({ id: newId, name, role, email });
      displayEmployees(employees);
      this.reset();
    } catch (err) {
      console.error('Failed to add employee', err);
    }
  });

  // Remove employee
  $("#employeeList").on("click", ".remove-link", function (e) {
    e.stopPropagation();
    const id = Number($(this).data("id"));
    employees = employees.filter(emp => emp.id !== id);
    displayEmployees(employees);
  });

  // Initialize app
  init();
});

