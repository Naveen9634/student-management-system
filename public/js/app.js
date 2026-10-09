
const API_URL = "/api/students";

const form = document.getElementById("studentForm");
const studentId = document.getElementById("studentId");
const fullName = document.getElementById("full_name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const courseSelect = document.getElementById("course_id");
const table = document.getElementById("studentTable");
const message = document.getElementById("message");
const searchInput = document.getElementById("searchInput");
const sortBy = document.getElementById("sortBy");
const sortOrder = document.getElementById("sortOrder");
const recordCount = document.getElementById("recordCount");

let students = [];
let searchTimer;

// Display messages
function showMessage(text, type = "success") {
    message.textContent = text;
    message.className = type;
}

// API request helper
async function request(url, options = {}) {
    const response = await fetch(url, options);

    let result;

    try {
        result = await response.json();
    } catch {
        throw new Error("Invalid server response");
    }

    if (!response.ok) {
        throw new Error(result.message || "Request failed");
    }

    return result;
}

// Load courses
async function loadCourses() {
    const result = await request(`${API_URL}/courses`);

    courseSelect.replaceChildren(
        new Option("Select course", "")
    );

    result.data.forEach(course => {
        courseSelect.add(
            new Option(course.course_name, course.id)
        );
    });

    document.getElementById("totalCourses").textContent =
        result.data.length;
}

// Load students using backend search and sorting
async function loadStudents() {
    try {
        const params = new URLSearchParams({
            search: searchInput.value.trim(),
            sortBy: sortBy.value,
            order: sortOrder.value
        });

        const result = await request(
            `${API_URL}?${params.toString()}`
        );

        students = result.data;
        renderStudents();
    } catch (error) {
        showMessage(error.message, "error");
        table.replaceChildren();

        const row = table.insertRow();
        const cell = row.insertCell();

        cell.colSpan = 6;
        cell.textContent = "Unable to load students.";

        recordCount.textContent = "";
    }
}

// Render table
function renderStudents() {
    table.replaceChildren();

    document.getElementById("totalStudents").textContent =
        students.length;

    recordCount.textContent =
        `Showing ${students.length} student record(s)`;

    if (students.length === 0) {
        const row = table.insertRow();
        const cell = row.insertCell();

        cell.colSpan = 6;
        cell.textContent = "No students found.";
        return;
    }

    students.forEach(student => {
        const row = table.insertRow();

        [
            student.id,
            student.full_name,
            student.email,
            student.phone || "-",
            student.course_name || "Not assigned"
        ].forEach(value => {
            const cell = row.insertCell();
            cell.textContent = value;
        });

        const actions = row.insertCell();

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit";
        editButton.addEventListener("click", () => {
            editStudent(student.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete";
        deleteButton.addEventListener("click", () => {
            deleteStudent(student.id);
        });

        actions.append(editButton, deleteButton);
    });
}

// Add or update student
form.addEventListener("submit", async event => {
    event.preventDefault();

    if (!form.reportValidity()) {
        return;
    }

    const payload = {
        full_name: fullName.value.trim(),
        email: email.value.trim(),
        phone: phone.value.trim(),
        course_id: courseSelect.value || null
    };

    const isEditing = Boolean(studentId.value);

    const url = isEditing
        ? `${API_URL}/${studentId.value}`
        : API_URL;

    try {
        const result = await request(url, {
            method: isEditing ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        showMessage(result.message);
        resetForm();
        await loadStudents();
    } catch (error) {
        showMessage(error.message, "error");
    }
});

// Edit student
function editStudent(id) {
    const student = students.find(
        item => String(item.id) === String(id)
    );

    if (!student) {
        return;
    }

    studentId.value = student.id;
    fullName.value = student.full_name;
    email.value = student.email;
    phone.value = student.phone || "";
    courseSelect.value = student.course_id || "";

    document.getElementById("formTitle").textContent =
        "Edit Student";

    document.getElementById("submitBtn").textContent =
        "Update Student";

    document.getElementById("cancelBtn").classList.remove("hidden");

    form.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// Delete student
async function deleteStudent(id) {
    if (!confirm("Are you sure you want to delete this student?")) {
        return;
    }

    try {
        const result = await request(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        showMessage(result.message);
        await loadStudents();
    } catch (error) {
        showMessage(error.message, "error");
    }
}

// Reset form
function resetForm() {
    form.reset();
    studentId.value = "";

    document.getElementById("formTitle").textContent =
        "Add New Student";

    document.getElementById("submitBtn").textContent =
        "Add Student";

    document.getElementById("cancelBtn").classList.add("hidden");
}

// Cancel editing
document.getElementById("cancelBtn").addEventListener(
    "click",
    resetForm
);

// Search with a small delay
searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);

    searchTimer = setTimeout(() => {
        loadStudents();
    }, 300);
});

// Sort when dropdowns change
sortBy.addEventListener("change", loadStudents);
sortOrder.addEventListener("change", loadStudents);

// Start application
async function init() {
    try {
        await loadCourses();
        await loadStudents();
    } catch (error) {
        showMessage(error.message, "error");
    }
}

init();