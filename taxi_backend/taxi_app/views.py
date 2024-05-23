from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .serializers import *
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
import json
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated

# Create your views here.
def home(request):
    return HttpResponse('Ok')
        
class RegistrationView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user_data = serializer.save()
            if user_data:
                user_json = json.dumps(user_data)
                return Response(user_json, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            # return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        print('request==',request)
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            print('==DATA==',serializer.validated_data)
            return Response(serializer.validated_data)
        else:
            print('==ERROR==',serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
@api_view(('GET',))
def getDriverName(request,id):
    usr = User.objects.get(id = id)
    drv = Driver.objects.get(user = usr)
    if drv:
        return Response({'status':True, 'name':drv.full_name})
    else:
        return Response({'status':False})