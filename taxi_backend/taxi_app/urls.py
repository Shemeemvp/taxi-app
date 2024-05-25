from django.contrib import admin
from django.urls import path
from taxi_app.views import *

urlpatterns = [
    path('', home, name='home'),
    path('register_user/', RegistrationView.as_view(), name='register_user'),
    path('user_login/', LoginView.as_view(), name='user_login'),
    path('get_driver/<int:id>/', getDriverName, name='get_driver'),
    path('get_trip_no/<int:id>/', getTripNumber, name='get_trip_no'),
    path('all_trips/<int:id>/', allTrips, name='all_trips'),
    path('end_current_trip/', end_current_trip, name='end_current_trip'),
    path('feedbacks/', feedbacks, name='feedbacks'),
]