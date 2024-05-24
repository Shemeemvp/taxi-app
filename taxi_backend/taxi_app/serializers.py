from rest_framework import serializers
from django.contrib.auth import authenticate, login, logout
from .models import User
from taxi_app.models import *
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False)
    class Meta:
        model = User
        fields = ('id', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        username = validated_data.pop('username', None)
        password = validated_data.pop('password')
        user = User.objects.create_user(username=username, password=password)
        refresh = RefreshToken.for_user(user)
        return {
            'user': user,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
    
class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = ['full_name', 'mobile']

class RegistrationSerializer(serializers.Serializer):
    user_name = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    full_name = serializers.CharField(max_length=100)
    mobile = serializers.CharField(max_length=15)

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['user_name'],
            password=validated_data['password']
        )
        Driver.objects.create(
            user=user,
            full_name=validated_data['full_name'],
            mobile=validated_data['mobile']
        )
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            refresh = RefreshToken.for_user(user)
            return {
                'userID':user.id,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        raise serializers.ValidationError("Incorrect Credentials")
    
class TCS_FormSerializer(serializers.ModelSerializer):
    class Meta:
        model = TSC_Form
        fields = '__all__'