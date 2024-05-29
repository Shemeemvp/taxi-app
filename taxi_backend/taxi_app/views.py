from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .serializers import *
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
import json
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
import qrcode
from django.conf import settings
import os
from django.core.files import File


# Create your views here.
def home(request):
    return HttpResponse('Ok')
        
class RegistrationView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = RegistrationSerializer(data=request.data)
        if User.objects.filter(username = request.data['user_name']).exists():
            return Response({'status':False, 'message':'Username already exists.!'}, status=status.HTTP_400_BAD_REQUEST)
        elif Driver.objects.filter(mobile = request.data['mobile']).exists():
            return Response({'status':False, 'message':'Mobile No. exists.!'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            if serializer.is_valid():
                user_data = serializer.save()
                if user_data:
                    user_json = json.dumps(user_data)
                    return Response(user_json, status=status.HTTP_201_CREATED)
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
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
def endCurrentTrip(request):
    if request.method == 'POST':
        print('REQ===',request.data)
        try:
            usr = User.objects.get(id = request.data['user_id'])
            drv = Driver.objects.get(user = usr)
        except:
            usr = None
            drv = None

        request.data['user'] = usr.id if usr else None
        request.data['driver'] = drv.id if drv else None

        
        trp_no = request.data['trip_no']

        while TSC_Form.objects.filter(driver = drv, trip_no__iexact = trp_no).exists():
            trp_no = getNextTripNumber(trp_no)

        request.data['trip_no'] = trp_no

        serializer = TCS_FormSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()

            tripId = serializer.data['id']
            trip = TSC_Form.objects.get(id = tripId)
            qr = qrcode.make(f"{settings.BASE_URL}/qr_details")

            image_directory = os.path.join(settings.MEDIA_ROOT, "images")
            if not os.path.exists(image_directory):
                os.makedirs(image_directory)
            image_path = os.path.join(settings.MEDIA_ROOT, "images", "trip" + str(trip.id) + ".png")
            qr.save(image_path)
            with open(image_path, "rb") as reopen:
                djangofile = File(reopen)
                trip.bill_qr = djangofile
                trip.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def endHourBasedTrip(request):
    if request.method == 'POST':
        try:
            usr = User.objects.get(id = request.data['user_id'])
            drv = Driver.objects.get(user = usr)
        except:
            usr = None
            drv = None

        request.data['user'] = usr.id if usr else None
        request.data['driver'] = drv.id if drv else None

        
        trp_no = request.data['trip_no']

        while TSC_Form.objects.filter(driver = drv, trip_no__iexact = trp_no).exists():
            trp_no = getNextTripNumber(trp_no)

        request.data['trip_no'] = trp_no

        serializer = TCS_FormSerializer(data=request.data)
        if serializer.is_valid():

            serializer.save()

            tripId = serializer.data['id']
            trip = TSC_Form.objects.get(id = tripId)
            
            rideHours = request.data['ride_hours']
            for i in rideHours:
                TripRideHours.objects.create(trip = trip, start_time = i.get('startTime'), end_time = i.get('endTime'), hours = i.get('hours'))
            
            qr = qrcode.make(f"{settings.BASE_URL}/qr_details")

            image_directory = os.path.join(settings.MEDIA_ROOT, "images")
            if not os.path.exists(image_directory):
                os.makedirs(image_directory)
            image_path = os.path.join(settings.MEDIA_ROOT, "images", "trip" + str(trip.id) + ".png")
            qr.save(image_path)
            with open(image_path, "rb") as reopen:
                djangofile = File(reopen)
                trip.bill_qr = djangofile
                trip.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def allTrips(request, id):
    try:
        usr = get_object_or_404(User, id=id)
        drv = get_object_or_404(Driver, user=usr)
    except:
        return JsonResponse({'status': False}, status=status.HTTP_404_NOT_FOUND)

    trips = TSC_Form.objects.filter(driver=drv).order_by('-id')
    serializer = AllTripsSerializer(trips, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def feedbacks(request):
    fb = Customer_Feedbacks.objects.all()
    serializer = FeedbackSerializer(fb, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def viewTrip(request, id):
    try:
        trp = get_object_or_404(TSC_Form, id = id)
    except:
        return JsonResponse({'status': False}, status=status.HTTP_404_NOT_FOUND)
    serializer = TCS_FormSerializer(trp)
    extHr = 0
    if serializer.data['trip_charge_type'] == 'hour':
        hrs = TripRideHours.objects.filter(trip = trp)

        for i in hrs:
            hr = int(i.hours.split(':')[0])
            mint = float(i.hours.split(':')[1])
            minute = mint/60
            if hr > i.trip.max_hour:
                extHr += (hr - i.trip.max_hour)
            if mint > 0:
                extHr += (mint / 60)

    return Response({'data':serializer.data, 'extraHours':"{:.2f}".format(extHr)}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def deleteTrip(request, id):
    try:
        trip = TSC_Form.objects.get(id = id)
        trip.delete()
        return Response({"status":True}, status=status.HTTP_200_OK)
    except:
        return Response({"status":False}, status=status.HTTP_400_BAD_REQUEST)
    
def getNextTripNumber(trp):
    trip_no = trp
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

    return nxtTRIP

@api_view(['GET'])
def getLastTrip(request, id):
    try:
        user = get_object_or_404(User, id = id)
    except:
        return JsonResponse({'status': False}, status=status.HTTP_404_NOT_FOUND)
    
    trip = TSC_Form.objects.filter(user = user).last()
    if trip:
        serializer = TCS_FormSerializer(trip)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return JsonResponse({'status': False}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def getRideHours(request, id):
    try:
        trip = get_object_or_404(TSC_Form, id = id)
    except:
        return JsonResponse({'status': False}, status=status.HTTP_404_NOT_FOUND)
    
    hrs = TripRideHours.objects.filter(trip = trip)
    if hrs:
        serializer = TripRideHoursSerializer(hrs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return JsonResponse({'status': False}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['PUT'])
def updateTrip(request, id):
    form = get_object_or_404(TSC_Form, id=id)

    serializer = TCS_FormSerializer(form, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT'])
def updateHourBasedTrip(request, id):
    trip = get_object_or_404(TSC_Form, id=id)

    serializer = TCS_FormSerializer(trip, data=request.data)
    rideHours = request.data['ride_hours']
    if serializer.is_valid():
        serializer.save()
        
        TripRideHours.objects.filter(trip = trip).delete()
        for i in rideHours:
            TripRideHours.objects.create(trip = trip, start_time = i.get('startTime'), end_time = i.get('endTime'), hours = i.get('hours'))

        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def updatePassword(request):
    if request.method == 'POST':
        uName = request.data['username']

        if not User.objects.filter(username = uName).exists():
            return Response({'status':False, 'message':'Username not found.!'},status=status.HTTP_404_NOT_FOUND)
        else:
            user = User.objects.get(username = uName)
            pas = request.data['password']
            user.set_password(pas)
            user.save()
            return Response({'status':True, 'message':'Password Updated successfully'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def checkUserName(request):
    if request.method == 'POST':
        uname = request.data['userName']
        if User.objects.filter(username = uname).exists():
            return Response({'status':True, 'is_exists': True, 'message':'Username already Exists.!'})
        else:
            return Response({'status':True, 'is_exists': False, 'message':''})

@api_view(['POST'])
def checkPhoneNumber(request):
    if request.method == 'POST':
        phn = request.data['mobile']
        if Driver.objects.filter(mobile__iexact = phn).exists():
            return Response({'status':True, 'is_exists': True, 'message':'Mobile No. already Exists.!'})
        else:
            return Response({'status':True, 'is_exists': False, 'message':''})