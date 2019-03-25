from django.shortcuts import render
from django.http import HttpResponseRedirect, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse
from django.contrib.auth.models import User
from .models import Todo
from django.views.decorators.csrf import ensure_csrf_cookie

# Create your views here.

def index(request):
    return render(request, "todo/index.html", {"user":request.user})

def register(request):
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse(index))
    else:
        if request.method == "POST":
            first_name = request.POST["first-name"]
            last_name = request.POST["last-name"]
            username = request.POST["username"]
            email = request.POST["email"]
            password = request.POST["password"]

            new_user = User.objects.create_user(username=username, email=email, password=password)
            new_user.first_name = first_name
            new_user.last_name = last_name
            new_user.save()

            login(request, new_user)

            return HttpResponseRedirect(reverse(index))
        
        elif request.method == "GET":
            return render(request, "todo/register.html")

def login_view(request):
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse(index))
    else:
        if request.method == "POST":
            username = request.POST["username"]
            password = request.POST["password"]

            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)
                return HttpResponseRedirect(reverse(index))
            else:
                message = "Wrong username or password"
                return render(request, "todo/error.html", {"message":message})
        elif request.method == "GET":
            return render(request, "todo/login.html")

def logout_user(request):
    logout(request)
    return render(request, "todo/index.html")

@ensure_csrf_cookie
def todo_list(request):
    if request.user.is_authenticated == True:
        try:
            user = request.user
            todos = Todo.objects.filter(user=user).order_by("id")
        except Todo.DoesNotExist:
            todos = None

        context = {
            "todos": todos,
            "user": request.user
        }

        return render(request, "todo/todo_list.html", context)

    else:
        return render(request, "todo/login.html")

@ensure_csrf_cookie
def add_todo(request):
    todo = request.POST["todo"]
    user = request.user

    new_todo = Todo(user=user, todo=todo)
    new_todo.save()

    todo_id = new_todo.id
    todo_content = new_todo.todo

    context = {
        "id" : todo_id,
        "todo" : todo_content
    } 

    return JsonResponse(context)

def switch_todo_state(request, todo_id):
    user = request.user
    todo = Todo.objects.filter(user=user).get(id=todo_id)
    todo.is_completed = not todo.is_completed
    todo.save()

    return HttpResponseRedirect(reverse(todo_list))

def delete_todo(request, todo_id):
    user = request.user
    todo = Todo.objects.filter(user=user).get(id=todo_id)
    todo.delete()

    return HttpResponseRedirect(reverse(todo_list))


