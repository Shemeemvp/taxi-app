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
    

@api_view(('GET',))
def getTripNumber(request,id):
    usr = User.objects.get(id = id)
    drv = Driver.objects.get(user = usr)
    if drv:
        # Finding next Trip number w r t last Trip number if exists.
        nxtTRIP = ""
        lastTRIP = TSC_Form.objects.filter(driver = drv).last()
        if lastTRIP:
            trip_no = str(lastTRIP.trip_no)
            numbers = []
            stri = []
            for word in trip_no:
                if word.isdigit():
                    numbers.append(word)
                else:
                    stri.append(word)
            
            num=''
            for i in numbers:
                num +=i
            
            st = ''
            for j in stri:
                st = st+j

            trp_num = int(num)+1

            if num[0] == '0':
                if trp_num <10:
                    nxtTRIP = st+'0'+ str(trp_num)
                else:
                    nxtTRIP = st+ str(trp_num)
            else:
                nxtTRIP = st+ str(trp_num)
        else:
            nxtTRIP = 'TRP01'
        return Response({'status':True, 'tripNo':nxtTRIP})
    else:
        return Response({'status':False})
    
@api_view(['POST'])
def end_current_trip(request):
    if request.method == 'POST':
        try:
            usr = User.objects.get(id = request.data['user_id'])
            drv = Driver.objects.get(user = usr)
        except:
            usr = None
            drv = None

        print('USER===',usr,drv)

        request.data['user'] = usr.id if usr else None
        request.data['driver'] = drv.id if drv else None

        serializer = TCS_FormSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)