from django.contrib import admin
from django.urls import path
from taxi_app import views

urlpatterns = [
    path('', views.home, name='home'),
]
