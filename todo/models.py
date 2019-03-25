from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Todo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    todo = models.CharField(max_length=255)
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user}'s todo = ({self.todo}), its status is {self.is_completed}"

