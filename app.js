//SELECTEURS
const form = document.querySelector('form');
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");
const clear = document.querySelector(".clear-btn");

//ECOUTEURS
document.addEventListener("DOMContentLoaded", getTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener("click", filterTodo);
clear.addEventListener("click", clearItems);

//FUNCTIONS
form.addEventListener('submit', (e) =>{
  e.preventDefault();
})

function addTodo(event) {
  event.preventDefault();
  if(todoInput.value !== ""){
    //Todo DIV
    const todoDiv = document.createElement("div");
    const a = document.createAttribute("draggable");
    a.value = "true";
    todoDiv.setAttributeNode(a);
    todoDiv.classList.add("todo");
    //Input checkbox
    todoDiv.insertAdjacentHTML( 'beforeend',
    `<input type="checkbox" name="checkbox" class="complete-btn">`);
    //Créer le Li
    const newTodo = document.createElement("li");
    newTodo.innerText = todoInput.value;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);
    //Ajouter la todo au localstorage
    saveLocalTodos(todoInput.value);
    hideContainer()
    //Bouton Supprimer
    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);
    //AJOUTER NOTRE TODO À TODO-LIST
    todoList.appendChild(todoDiv);
    todoInput.value = "";
    remainingItems()
  }
  drag()
}

function deleteCheck(e) {
  const item = e.target;
  //DELETE TODO
  if (item.classList[0] === "trash-btn") {
    const todo = item.parentElement;
    todo.classList.add("fall");
    removeLocalTodos(todo);
    todo.addEventListener("transitionend", function() {
      todo.remove();
      remainingItems()
      hideContainer()
    });
  }

  //CHECK MARK
  if (item.classList[0] === "complete-btn") {
    const todo = item.parentElement;
    todo.classList.toggle("completed");
    remainingItems()
  }

  drag()
}

function remainingItems() {
  const span = document.querySelector(".remaining span");

  activeTodos = document.querySelectorAll('ul > div:not(.completed)');
  span.innerHTML = activeTodos.length;
}

function activeFilter(e) {
  const elems = document.querySelectorAll(".active");
  [].forEach.call(elems, function(el) {
    el.classList.remove("active");
  });
  e.target.className = "active";
}

function filterTodo(e) {
  const todos = todoList.childNodes;
  todos.forEach(function (todo) {
    switch (e.target.id) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        if (todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "active":
        if (!todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
    }
    activeFilter(e)
  });
}

function clearItems(completed) {
  const completedTodos = document.getElementsByClassName("completed");
  const activeTodos = document.querySelectorAll('ul > div:not(.completed)');

  let todos = []
  localStorage.setItem("todos", JSON.stringify([]));

  for(var i = 0; i < activeTodos.length; i++) { 
    console.log(activeTodos[i].innerText)
    todos = JSON.parse(localStorage.getItem("todos"));
    todos.push(activeTodos[i].innerText);
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  while(completedTodos.length > 0){
    completedTodos[0].parentNode.removeChild(completedTodos[0]);
  }

  hideContainer()
}


function saveLocalTodos(todo) {
  //Checker si il y a des items existants
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos() {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
 
  todos.forEach(function (todo) {
    //Todo DIV
    const todoDiv = document.createElement("div");
    const a = document.createAttribute("draggable");
    a.value = "true";
    todoDiv.setAttributeNode(a);
    todoDiv.classList.add("todo");
    //Input checkbox
    todoDiv.insertAdjacentHTML( 'beforeend',
    `<input type="checkbox" name="checkbox" class="complete-btn">`);
    //Créer le Li
    const newTodo = document.createElement("li");
    newTodo.innerText = todo;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);
    //Bouton Supprimer
    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);
    //AJOUTER NOTRE TODO À TODO-LIST
    todoList.appendChild(todoDiv);
  });
  
  remainingItems()
  hideContainer()

}

function removeLocalTodos(todo) {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  const todoIndex = todo.children[0].innerText;
  todos.splice(todos.indexOf(todoIndex), 1);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function hideContainer() {
  const container = document.querySelector(".todo-container");
  const legend = document.querySelector(".legend");
  if (JSON.parse(localStorage.getItem("todos")).length === 0) {
    container.style.display = "none";
    legend.style.display = "none";
  } else {
    container.style.display = "block";
    legend.style.display = "block";
  }
}


window.addEventListener("load", function() {
  const items = document.getElementsByClassName('todo');
  console.log(items);
  dragged = null;
  let todoArray = JSON.parse(localStorage.getItem("todos"));

  for (let i of items) {
    i.addEventListener("dragstart", function(e) {
      current = i;
      e.target.classList.add("hint");
      console.log(i.childNodes[1].innerText)
      textDrop= i.childNodes[1].innerText
    });

    i.addEventListener("dragend", function(e) {
      e.target.classList.remove("hint");
    });

    i.addEventListener("dragover", (e) => {
      e.preventDefault(); 
    });

    i.addEventListener("drop", (e) => {

      e.preventDefault();
      if (i != current) {
        let currentpos = 0, droppedpos = 0;
        for (let it=0; it<items.length; it++) {
          if (current == items[it]) { currentpos = it; }
          if (i == items[it]) { droppedpos = it; }
        }
        if (currentpos < droppedpos) {
          i.parentNode.insertBefore(current, i.nextSibling);

          todoArray.splice(currentpos, 1)
          todoArray.splice(droppedpos, 0, String(textDrop))
          console.log(todoArray);
          localStorage.setItem("todos", JSON.stringify(todoArray));
        } else {
          i.parentNode.insertBefore(current, i);

          todoArray.splice(currentpos, 1)
          todoArray.splice(droppedpos, 0, String(textDrop))
          console.log(todoArray);
          localStorage.setItem("todos", JSON.stringify(todoArray));
        }
      }
    });
  }
});