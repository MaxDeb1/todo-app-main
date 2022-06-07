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
window.addEventListener("load", drag);

form.addEventListener('submit', (e) =>{
  e.preventDefault()
  addTodo();
})

todoInput.addEventListener('input', function(event) {
  if (todoInput.value.length) {
    todoButton.removeAttribute('disabled'); 
  }
});

//FUNCTIONS
function addTodo() {
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
    todoButton.setAttribute("disabled",'disabled');
    remainingItems()
  }
  drag()
}

function deleteCheck(e) {
  const item = e.target;
  const todo = item.parentElement;

  //DELETE TODO
  if (item.classList[0] === "trash-btn") {
    todo.classList.add("fall");
    todo.addEventListener("transitionend", function() {
      todo.remove();
      remainingItems()
      hideContainer()
    });
    removeLocalTodos(todo)
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

function removeLocalTodos(todo) {
  let index = Array.from(todo.parentElement.children).indexOf(todo);
  let todos;
  
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
    console.log(todos);
  }

  todos.splice(index, 1);
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

function drag() {
  // (A) GET ALL LIST ITEMS
  const items = document.getElementsByClassName('todo');
  console.log(items);
  let todoArray = JSON.parse(localStorage.getItem("todos"));
  console.log(todoArray);

  // (B) MAKE ITEMS DRAGGABLE + SORTABLE
  for (let i of items) {
    // (B1) ATTACH DRAGGABLE
    i.draggable = true;

    i.onmousedown = function() {
      i.classList.add('grab');
    };
    
    i.onmouseup = function() {
      i.classList.remove('grab');
    };
    
    // (B2) DRAG START - YELLOW HIGHLIGHT DROPZONES
    i.ondragstart = (e) => {
      current = i;
      e.target.classList.add("hint");

      textDrop= i.childNodes[1].innerText
      console.log(textDrop);
    };
    
    // (B3) DRAG ENTER - RED HIGHLIGHT DROPZONE
    i.ondragenter = () => {
      if (i != current) { i.classList.add("active"); }
    };

    // (B4) DRAG LEAVE - REMOVE RED HIGHLIGHT
    i.ondragleave = () => {
      i.classList.remove("active");
    };

    // (B5) DRAG END - REMOVE ALL HIGHLIGHTS
    i.ondragend = (ev) => { for (let it of items) {
       ev.target.classList.remove("hint");
      for (let it of items) {
        it.classList.remove("active");
      }
    }};
 
    // (B6) DRAG OVER - PREVENT THE DEFAULT "DROP", SO WE CAN DO OUR OWN
    i.ondragover = (evt) => { evt.preventDefault(); };
 
    // (B7) ON DROP - DO SOMETHING
    i.ondrop = (evt) => {
      evt.preventDefault();
      if (i != current) {
        let currentpos = 0, droppedpos = 0;
        for (let it=0; it<items.length; it++) {
          if (current == items[it]) { currentpos = it; }
          if (i == items[it]) { droppedpos = it; }
        }
        if (currentpos < droppedpos) {
          i.parentNode.insertBefore(current, i.nextSibling);
        } else {
          i.parentNode.insertBefore(current, i);
        }
        todoArray.splice(currentpos, 1)
        todoArray.splice(droppedpos, 0, String(textDrop))
        localStorage.setItem("todos", JSON.stringify(todoArray));
      }
    };
  }
}