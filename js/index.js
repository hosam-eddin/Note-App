// HTML Elements
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
const updateBtn = document.getElementById("updateBtn");
const gridBtn = document.getElementById("gridBtn");
const barsBtn = document.getElementById("barsBtn");
const sections = document.querySelectorAll("section");
const tasksCartona = document.querySelectorAll(".tasks");

const containers = {
  nextUp: document.getElementById("nextUp"),
  inProgress: document.getElementById("inProgress"),
  done: document.getElementById("done"),
};

// APP Variables
let taskContainer = JSON.parse(localStorage.getItem("tasks")) || [];
let updatedIndex = 0;

for (let i = 0; i < taskContainer.length; i++) {
  displayTask(i);
}

// HTML Functions
const showModal = () => {
  Modal.classList.replace("d-none", "d-flex");
  AddTaskBtn.classList.replace("d-none", "d-flex");
  updateBtn.classList.replace("d-flex", "d-none");
  window.scrollTo(0, 0);
  document.body.style.overflow = "hidden";
};

const hideModal = () => {
  Modal.classList.replace("d-flex", "d-none");
  document.body.style.overflow = "auto";
};

function addTask() {
  const task = {
    status: statusInput.value,
    category: categoryInput.value,
    title: titleInput.value,
    description: descriptionInput.value,
  };
  taskContainer.push(task);

  localStorage.setItem("tasks", JSON.stringify(taskContainer));

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
  for (const el in containers) {
    if (containers.hasOwnProperty(el)) {
      containers[el].innerHTML = "";
    }
  }
}

function getTaskInfo(index) {
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
  let taskHTML = `
    <div class="task" id="task_${index}">
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
  const red = Math.trunc(Math.random() * 256);
  const green = Math.trunc(Math.random() * 256);
  const blue = Math.trunc(Math.random() * 256);
  let color = `#${red.toString(16).padStart(2, "0")}${green
    .toString(16)
    .padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;
  return color + "42";
}

function changeColor(index) {
  const color = generatedColor();
  const sectionId = `task_${index}`;
  const section = document.getElementById(sectionId);
  section.style.backgroundColor = color;
  localStorage.setItem(`generatedColor_${sectionId}`, color);
}

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

window.addEventListener("load", applyColorFromLocalStorage);

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

  for (let i = 0; i < sections.length; i++) {
    sections[i].classList.remove("col-md-6", "col-lg-4");
    sections[i].style.overflow = "auto";
  }

  for (let j = 0; j < tasksCartona.length; j++) {
    tasksCartona[j].setAttribute("data-view", "bars");
  }
}

function changeToGrid() {
  barsBtn.classList.remove("active");
  gridBtn.classList.add("active");

  for (let i = 0; i < sections.length; i++) {
    sections[i].classList.add("col-md-6", "col-lg-4");
  }

  for (let j = 0; j < tasksCartona.length; j++) {
    tasksCartona[j].removeAttribute("data-view");
  }
}

// HTML Events
AddBtn.addEventListener("click", showModal);
updateBtn.addEventListener("click", updateTask);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    hideModal();
  }
});

Modal.addEventListener("click", (e) => {
  if (e.target.id === "modal") {
    hideModal();
  }
});

searchInput.addEventListener("input", handleSearch);
barsBtn.addEventListener("click", changeToBars);
gridBtn.addEventListener("click", changeToGrid);

function handleSearch() {
  const searchValue = searchInput.value.trim().toLowerCase();

  taskContainer.forEach((task, index) => {
    const taskTitle = task.title.toLowerCase();
    const taskCategory = task.category.toLowerCase();
    const taskElement = document.getElementById(`task_${index}`);

    if (taskTitle.includes(searchValue) || taskCategory.includes(searchValue)) {
      taskElement.style.display = "block";
    } else {
      taskElement.style.display = "none";
    }
  });
}

function displayAllTasks() {
  taskContainer.forEach((task, index) => {
    const taskElement = document.getElementById(`task_${index}`);
    taskElement.style.display = "block";
  });
}

displayAllTasks();

AddTaskBtn.addEventListener("click", addTask);
modeBtn.addEventListener("click", changeMode);
