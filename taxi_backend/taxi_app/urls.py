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
    path('end_current_trip/', endCurrentTrip, name='end_current_trip'),
    path('view_trip/<int:id>/', viewTrip, name='view_trip'),
    path('update_trip/<int:id>/', updateTrip, name='update_trip'),
    path('update_hour_based_trip/<int:id>/', updateHourBasedTrip, name='update_hour_based_trip'),
    path('end_hour_based_trip/', endHourBasedTrip, name='end_hour_based_trip'),
    path('get_last_trip/<int:id>/', getLastTrip, name='get_last_trip'),
    path('get_ride_hours/<int:id>/', getRideHours, name='get_ride_hours'),
    path('delete_trip/<int:id>/', deleteTrip, name='delete_trip'),
    path('update_password/', updatePassword, name='update_password'),
    path('check_phone_number/', checkPhoneNumber, name='check_phone_number'),
    path('check_username/', checkUserName, name='check_username'),
    path('feedbacks/', feedbacks, name='feedbacks'),
]