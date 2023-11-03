/// ! =========> HTML Elements
const root = document.querySelector(":root");
const AddBtn = document.getElementById("newTask");
const Modal = document.getElementById("modal");
const AddTaskBtn = document.getElementById("addBtn");
const modeBtn = document.getElementById("mode");
const statusInput = document.getElementById("status");
const categoryInput = document.getElementById("category");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const searchInput = document.getElementById("searchInput");
const updateBtn = document.getElementById("updateBtn"); // Assuming you have this button in your HTML

var gridBtn = document.getElementById("gridBtn");
var barsBtn = document.getElementById("barsBtn");
var sections = document.querySelectorAll("section");
var tasksCartona = document.querySelectorAll(".tasks");

let containers = {
  nextUp: document.getElementById("nextUp"),
  inProgress: document.getElementById("inProgress"),
  done: document.getElementById("done"),
};

/// =========> APP Variables
let taskContainer = [] && JSON.parse(localStorage.getItem("tasks"));
let updatedIndex = 0;
for (let i = 0; i < taskContainer.length; i++) {
  displayTask(i);
}

/// ? =========> HTML Functions
showModal = () => {
  Modal.classList.replace("d-none", "d-flex");
  AddTaskBtn.classList.replace("d-none", "d-flex");
  updateBtn.classList.replace("d-flex", "d-none");
  // Scroll to the top of the window
  window.scrollTo(0, 0);

  // Disable scrolling on the body
  document.body.style.overflow = "hidden";
};
hideModal = () => {
  Modal.classList.replace("d-flex", "d-none");

  // Enable scrolling on the body
  document.body.style.overflow = "auto";
};

function addTask() {
  let task = {
    status: statusInput.value,
    category: categoryInput.value,
    title: titleInput.value,
    description: descriptionInput.value,
  };
  console.log(task);
  taskContainer.push(task);

  //! LocalStorage
  localStorage.setItem("tasks", JSON.stringify(taskContainer));

  console.log(taskContainer);
  displayTask(taskContainer.length - 1);
  hideModal();
}

function deleteTask(index) {
  taskContainer.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(taskContainer));
  empty();
  for (let i = 0; i < taskContainer.length; i++) {
    displayTask(i);
  }
  location.reload();
}

function empty() {
  for (el in containers) {
    containers[el].innerHTML = "";
    console.log(containers[el]);
  }
}

function getTaskInfo(index) {
  console.log(index);
  showModal();
  statusInput.value = taskContainer[index].status;
  categoryInput.value = taskContainer[index].category;
  titleInput.value = taskContainer[index].title;
  descriptionInput.value = taskContainer[index].description;

  AddTaskBtn.classList.add("d-none");

  updateBtn.classList.replace("d-none", "d-flex");

  updatedIndex = index;
}

function updateTask() {
  taskContainer[updatedIndex].status = statusInput.value;
  taskContainer[updatedIndex].category = categoryInput.value;
  taskContainer[updatedIndex].title = titleInput.value;
  taskContainer[updatedIndex].description = descriptionInput.value;

  localStorage.setItem("tasks", JSON.stringify(taskContainer));
  empty();
  for (let i = 0; i < taskContainer.length; i++) {
    displayTask(i);
  }
  location.reload();
}

function displayTask(index) {
  // Ensure that each section has a unique id (you can use the task's index as an id)
  let taskHTML = `
    <div class="task  " id="task_${index}">
    <h3 class="text-capitalize">${taskContainer[index]?.title}</h3>
    <p class="description text-capitalize">${taskContainer[index]?.description}</p>
    <h4 class="category ${taskContainer[index]?.category} text-capitalize">${taskContainer[index]?.category}</h4>
    <ul class="task-options list-unstyled d-flex gap-3 fs-5 m-0">
      <li><i class="bi bi-pencil-square" onclick="getTaskInfo(${index})"></i></li>
      <li><i class="bi bi-trash-fill" onclick="deleteTask(${index})"></i></li>
      <li><i class="bi bi-palette-fill" onclick="changeColor(${index})"></i></li>
    </ul>
</div>
    `;
  containers[taskContainer[index].status].innerHTML += taskHTML;
}

function generatedColor() {
  // Generate random values for red, green, and blue components
  const red = Math.trunc(Math.random() * 256); // 0 to 255
  const green = Math.trunc(Math.random() * 256); // 0 to 255
  const blue = Math.trunc(Math.random() * 256); // 0 to 255

  // Create a CSS color string in the format "rgb(red, green, blue)"
  let color = `#${red.toString(16).padStart(2, "0")}${green
    .toString(16)
    .padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;

  return color + "42";
}

function changeColor(index) {
  const color = generatedColor();
  const sectionId = `task_${index}`;

  // Set the background color for the specific section
  const section = document.getElementById(sectionId);
  section.style.backgroundColor = color;

  // Save the generated color to localStorage for this specific section
  localStorage.setItem(`generatedColor_${sectionId}`, color);
}

// Function to apply the color from localStorage on page load for each section
function applyColorFromLocalStorage() {
  for (let index = 0; index < taskContainer.length; index++) {
    const sectionId = `task_${index}`;
    const color = localStorage.getItem(`generatedColor_${sectionId}`);
    if (color) {
      const section = document.getElementById(sectionId);
      section.style.backgroundColor = color;
    }
  }
}

// Call applyColorFromLocalStorage when the page loads
window.addEventListener("load", applyColorFromLocalStorage);

// Dark Mode
function changeMode() {
  if (modeBtn.classList.contains("bi-brightness-high-fill")) {
    modeBtn.classList.replace("bi-brightness-high-fill", "bi-moon-stars-fill");
    root.style.setProperty("--main-black", "#fff");
    root.style.setProperty("--sec-black", "#dadada");
    root.style.setProperty("--text-color", "#242526");
  } else {
    modeBtn.classList.replace("bi-moon-stars-fill", "bi-brightness-high-fill");
    root.style.setProperty("--main-black", "#0d1117");
    root.style.setProperty("--sec-black", "#161b22");
    root.style.setProperty("--text-color", "#a5a6a7");
  }
}

function changeToBars() {
  gridBtn.classList.remove("active");
  barsBtn.classList.add("active");

  for (var i = 0; i < sections.length; i++) {
    sections[i].classList.remove("col-md-6", "col-lg-4");
    sections[i].style.overflow = "auto";
  }

  for (var j = 0; j < tasksCartona.length; j++) {
    tasksCartona[j].setAttribute("data-view", "bars");
  }
}

function changeToBars() {
  gridBtn.classList.remove("active");
  barsBtn.classList.add("active");

  for (var i = 0; i < sections.length; i++) {
    sections[i].classList.remove("col-md-6", "col-lg-4");
    sections[i].style.overflow = "auto";
  }

  for (var j = 0; j < tasksCartona.length; j++) {
    tasksCartona[j].setAttribute("data-view", "bars");
  }
}

function changeToGrid() {
  barsBtn.classList.remove("active");
  gridBtn.classList.add("active");

  for (var i = 0; i < sections.length; i++) {
    sections[i].classList.add("col-md-6", "col-lg-4");
  }

  for (var j = 0; j < tasksCartona.length; j++) {
    tasksCartona[j].removeAttribute("data-view");
  }
}
/// ! =========> HTML Events
AddBtn.addEventListener("click", showModal);
updateBtn.addEventListener("click", updateTask);
// hide modal
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    hideModal();
  }
});
Modal.addEventListener("click", (e) => {
  if (e.target.id == "modal") {
    hideModal();
  }
});


// Add an event listener to the search input
searchInput.addEventListener("input", handleSearch);
barsBtn.addEventListener("click", changeToBars);
gridBtn.addEventListener("click", changeToGrid);

function handleSearch() {
  const searchValue = searchInput.value.trim().toLowerCase();

  // Loop through taskContainer and filter tasks based on search input
  taskContainer.forEach((task, index) => {
    const taskTitle = task.title.toLowerCase();
    const taskCategory = task.category.toLowerCase();
    const taskElement = document.getElementById(`task_${index}`);

    if (taskTitle.includes(searchValue) || taskCategory.includes(searchValue)) {
      // Display the task if it matches the search criteria
      taskElement.style.display = "block";
    } else {
      // Hide the task if it doesn't match the search criteria
      taskElement.style.display = "none";
    }
  });
}

// Function to initially display all tasks
function displayAllTasks() {
  taskContainer.forEach((task, index) => {
    const taskElement = document.getElementById(`task_${index}`);
    taskElement.style.display = "block";
  });
}

// Call the displayAllTasks function to display all tasks initially
displayAllTasks();

AddTaskBtn.addEventListener("click", addTask);
modeBtn.addEventListener("click", changeMode);
