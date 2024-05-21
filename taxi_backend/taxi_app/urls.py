from django.contrib import admin
from django.urls import path
from taxi_app.views import *

urlpatterns = [
    path('', home, name='home'),
    path('register_user/', RegistrationView.as_view(), name='register_user'),
    path('user_login/', LoginView.as_view(), name='user_login'),
]