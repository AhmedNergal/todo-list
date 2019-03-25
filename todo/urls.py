from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("register", views.register, name="register"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_user, name="logout"),
    path("todo_list", views.todo_list, name="todo_list"),
    path("add_todo", views.add_todo, name="add_todo"),
    path("switch_todo_state/<int:todo_id>", views.switch_todo_state, name="switch_todo_state"),
    path("delete_todo/<int:todo_id>", views.delete_todo, name="delete_todo")
]