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
                li.classList.add("todo-item")
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

                li.appendChild(document.createTextNode(""));
                li.appendChild(checkbox);
                li.appendChild(label);
                li.appendChild(document.createTextNode(""));
                li.appendChild(p);
                li.appendChild(document.createTextNode(""));
                li.appendChild(removeTodoButton);
                li.appendChild(document.createTextNode(""));

                todoList.appendChild(li);
            }
        }
        request.send(data)
    });

    document.addEventListener("click", function(event){
        if (event.target.classList.contains("todo-checkbox")){
            let checkbox = event.target;
            console.log(checkbox.name);

            const request = new XMLHttpRequest();

            request.open("POST", "/switch_todo_state/" + checkbox.name);

            request.onload = function(){
                if (request.status == 200){
                    checkbox.parentElement.childNodes[4].classList.toggle("completed");
                }
            }

            const data = new FormData();
            data.append("csrfmiddlewaretoken", CSRF_TOKEN);
            request.send(data);
        } else if (event.target.classList.contains("rem-btn")){
            let removeTodoButton = event.target;

            const request = new XMLHttpRequest();
            request.open("POST", "/delete_todo/" + removeTodoButton.name);

            request.onload = function(){
                if (request.status == 200){
                    removeTodoButton.parentElement.remove();
                }
            }

            const data = new FormData();
            data.append("csrfmiddlewaretoken", CSRF_TOKEN);

            request.send(data);
        }
    }, false);
});