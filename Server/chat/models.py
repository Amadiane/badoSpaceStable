from django.db import models

# Create your models here.
from django.db import models

class Conversation(models.Model):
    name = models.CharField(max_length=255, blank=True, null=True)  # optionnel
    created_at = models.DateTimeField(auto_now_add=True)

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, related_name="messages", on_delete=models.CASCADE)
    sender_name = models.CharField(max_length=50)  # temporaire, plus tard tu remplaceras par User
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
