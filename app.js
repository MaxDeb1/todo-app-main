//SELECTEURS
const form = document.querySelector('form');
const todoInput = document.querySelector(".todo-input");
const addButton = document.querySelector(".add-button");
const todoItemsList = document.querySelector(".todo-items");
const filterOption = document.querySelector(".filter-todo");
const clear = document.querySelector(".clear-btn");

//ECOUTEURS
filterOption.addEventListener("click", filterTodo);
clear.addEventListener("click", clearItems);
window.addEventListener("load", hideContainer);

form.addEventListener('submit', (e) => {
  e.preventDefault()
  addTodo(todoInput.value);
})

addButton.addEventListener("click", (e) => {
  e.preventDefault()
  addTodo(todoInput.value);
})

todoInput.addEventListener('input', () => {
  if (todoInput.value.length) {
    addButton.removeAttribute('disabled'); 
  }
});

//FUNCTIONS
let todos = []

function addTodo(item) {
  // if item is not empty
  if (item !== '') {
    // make a todo object, which has id, name, and completed properties
    const todo = {
      id: Date.now(),
      name: item,
      completed: false
    };

    // then add it to todos array
    todos.push(todo);
    addToLocalStorage(todos);
    
    // finally clear the input box value
    todoInput.value = '';

    addButton.setAttribute("disabled",'disabled');
  }
}

// function to add todos to local storage
function addToLocalStorage(todos) {
  // conver the array to string then store it.
  localStorage.setItem('todos', JSON.stringify(todos));
  // render them to screen
  renderTodos();
}

// function to render given todos to screen
function renderTodos() {
  todos = JSON.parse(localStorage.getItem("todos"));
// clear everything inside <ul> with class=todo-items
  todoItemsList.innerHTML = '';

// run through each item inside todos
  todos.forEach(function(item) {
    // check if the item is completed
    const checked = item.completed ? 'checked': null;
  
// make a <li> element and fill it
    const li = document.createElement('li');
    const a = document.createAttribute("draggable");
    a.value = "true";
    li.setAttributeNode(a);
    li.setAttribute('class', 'item');
    li.setAttribute('data-key', item.id);

    // if item is completed, then add a class to <li> called 'checked', 
    // which will add line-through style
    if (item.completed === true) {
      li.classList.add('checked');
    }
    
    li.insertAdjacentHTML( 'beforeend',
    `<input type="checkbox" class="complete-btn" ${checked}>
      <div class="todo">${item.name}</div>
     <button class="delete-button"></button>
    `);
    // finally add the <li> to the <ul>
    todoItemsList.append(li);
  });
  // update the counter
  remainingItems();

  hideContainer();
  drag();
}


// function helps to get everything from local storage
function getFromLocalStorage() {
  const reference = localStorage.getItem('todos');
  // if reference exists
  if (reference) {
    // converts back to array and store it in todos array
    todos = JSON.parse(reference);
    renderTodos(todos);
  }
}

// initially get everything from localStorage
getFromLocalStorage();


// Add addEventListener for click event in all delete-button and checkbox
todoItemsList.addEventListener('click', function(event) {
  // check if the event is on checkbox
  if (event.target.type === 'checkbox') {
    // toggle the state
    toggle(event.target.parentElement.getAttribute('data-key'));
  }
  
  // check if that is a delete-button
  if (event.target.classList.contains('delete-button')) {
    item = event.target.parentElement;
    item.classList.add("fall");
    item.addEventListener("transitionend", function() {
      // get id from data-key attribute's value of parent <li> where the delete-button is present
      deleteTodo(event.target.parentElement.getAttribute('data-key'));

      hideContainer()
    });
  }
});

// toggle the value to completed and not completed
function toggle(id) {
  todos.forEach(function(item) {
    // use == not ===, because here types are different. One is number and other is string
    if (item.id == id) {
      // toggle the value
      item.completed = !item.completed;
    }
  });
  
  // update the localStorage
  addToLocalStorage(todos);
  // update the counter
  remainingItems();
}

// deletes a todo from todos array, then updates localstorage and renders updated list to screen
function deleteTodo(id) {
  // filters out the <li> with the id and updates the todos array
  todos = todos.filter(function(item) {
    // use != not !==, because here types are different. One is number and other is string
    return item.id != id;
  });
  
  // update the localStorage
  addToLocalStorage(todos);
  // update the counter
  remainingItems();
}


function remainingItems() {
  const span = document.querySelector(".remaining span");

  activeTodos = document.querySelectorAll('ul > li:not(.checked)');
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
  const items = todoItemsList.childNodes;
  items.forEach(function (item) {
    switch (e.target.id) {
      case "all":
        item.style.display = "flex";
        break;
      case "completed":
        if (item.classList.contains("checked")) {
          item.style.display = "flex";
        } else {
          item.style.display = "none";
        }
        break;
      case "active":
        if (!item.classList.contains("checked")) {
          item.style.display = "flex";
        } else {
          item.style.display = "none";
        }
        break;
    }
    activeFilter(e)
  });
}

function clearItems() {
  todos = todos.filter(item => item.completed !== true);

  // Update local storage
  addToLocalStorage(todos);
}

function hideContainer() {
  const container = document.querySelector(".todo-container");
  const legend = document.querySelector(".legend");

  if (todos.length === 0) {
    container.style.display = "none";
    legend.style.display = "none";
  } else {
    container.style.display = "block";
    legend.style.display = "block";
  }
}


function drag() {
  // (A) GET ALL LIST ITEMS
  const items = document.getElementsByClassName('item');
  let nodes = Array.from(items);
  let arrayFromLocalStorage = JSON.parse(localStorage.getItem("todos"));

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
    
    // (B2) DRAG START - RED HIGHLIGHT
    i.ondragstart = (e) => {
      current = i;
      e.target.classList.add("hint");

      fromIndex = nodes.indexOf(e.target);
    };
    
    // (B3) DRAG ENTER - YELLOW HIGHLIGHT DROPZONE
    i.ondragenter = (e) => {
      if (i != current) { 
        i.classList.add("active");
        
        toIndex = nodes.indexOf(e.target);
      }
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

        // Update local storage
        const element = arrayFromLocalStorage.splice(fromIndex, 1)[0];

        arrayFromLocalStorage.splice(toIndex, 0, element);
        localStorage.setItem('todos', JSON.stringify(arrayFromLocalStorage))
        addToLocalStorage(arrayFromLocalStorage);
      }
    };
  }
}