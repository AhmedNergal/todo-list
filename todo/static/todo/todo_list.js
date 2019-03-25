document.addEventListener("DOMContentLoaded", () => {
    let newTodo = document.querySelector("#new-todo");
    let addTodo = document.querySelector("#add-todo");
    let todoList = document.querySelector("#todo-list");
    let checkboxes = document.querySelectorAll(".todo-checkbox");
    let removeButtons = document.querySelectorAll(".rem-btn");

    addTodo.addEventListener("click", () => {
        const newTodoContent = newTodo.value;
        newTodo.value = "";

        const data = new FormData();
        data.append("todo", newTodoContent);
        data.append("csrfmiddlewaretoken", CSRF_TOKEN);

        const request = new XMLHttpRequest();

        request.open("POST", "/add_todo");

        request.onload = function(){
            if (request.status == 200){
                let objects = JSON.parse(request.response);
                let newTodoId = objects["id"];
                let newTodoContent = objects["todo"];

                let li = document.createElement("li");
                let p = document.createElement("p");
                p.innerHTML = newTodoContent;
                let checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.className = "todo-checkbox"
                checkbox.name = newTodoId;
                checkbox.id = newTodoId;
                let label = document.createElement("label");
                label.htmlFor = newTodoId;

                let removeTodoButton = document.createElement("a");
                removeTodoButton.name = newTodoId;
                removeTodoButton.innerHTML = "<i class=\"fas fa-trash\"></i>";
                removeTodoButton.classList.add("btn", "btn-primary", "rem-btn");
                removeTodoButton.href = "/delete_todo/" + newTodoId;
                
                li.appendChild(checkbox);
                li.appendChild(label);
                li.appendChild(p);
                li.appendChild(removeTodoButton);

                todoList.appendChild(li);
            }
        }
        request.send(data)
    });

    checkboxes.forEach(function (box){
        box.addEventListener("click", () => {
            box.parentElement.childNodes[4].classList.toggle("completed");

            const request = new XMLHttpRequest();

            request.open("POST", "/switch_todo_state/" + box.name);

            const data = new FormData();
            data.append("csrfmiddlewaretoken", CSRF_TOKEN);
            request.send(data);
        });
    });

    removeButtons.forEach(function (button){
        button.addEventListener("click", () => {
            const request = new XMLHttpRequest();
            request.open("POST", "/delete_todo/" + button.name);
            request.onload = function (){
                if (request.status === 200){
                    button.parentElement.remove();
                }
            }
            const data = new FormData();
            data.append("csrfmiddlewaretoken", CSRF_TOKEN);
            request.send(data);
        });
    });

    
});