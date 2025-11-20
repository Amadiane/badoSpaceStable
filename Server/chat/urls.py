from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework import routers
from .views import ConversationViewSet, MessageViewSet


router = DefaultRouter()
router.register(r'conversations', ConversationViewSet)
router.register(r'messages', MessageViewSet)


urlpatterns = [
   path('', include(router.urls)),
]