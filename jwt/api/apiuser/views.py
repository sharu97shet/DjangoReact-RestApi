from django.shortcuts import render , HttpResponse
from django.utils import timezone
from .serializers import *
from .models import * 
from django.db import connection
from django.shortcuts import render
from rest_framework.generics import GenericAPIView
from .utils import send_code_to_user
from rest_framework.response import Response
from rest_framework import status
from django.utils.encoding import smart_str, DjangoUnicodeDecodeError
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from rest_framework.views import APIView 
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
# Create your views here.
def home(request):
    return HttpResponse("jwt")

def run(request):
    rest1=Restaurant()
    #rest1.objects.delete
    restrecords=Restaurant.objects.get(id=1)
    rest=Restaurant.objects.first()
    print(rest.sales.all())
    user=User.objects.first()
    print(restrecords)
    
    getcreate=Rating.objects.get_or_create(restaurant=rest,
                                 user=user, rating=1
                                 )
    print(getcreate)


    salerecords=Sale.objects.filter(income__range=(3,4.5))
    print(salerecords.query)
    print([s.income for s in salerecords])

    
    # Sale.objects.create(restaurant=Restaurant.objects.first(),income=3.2,datetime=timezone.now())

    # print(restrecords.Rating_set.all())
   

    #print(connection.queries)
    # rest1.name="Italian Restaurant #1"
    # rest1.latitude=50.2
    # rest1.longitude=50.2
    # rest1.date_opened=timezone.now()
    # rest1.restaurant_type=Restaurant.TypeChoices.ITALIAN

    # rest1.save()


    return HttpResponse("yes")
    


class  usersotpview(APIView):
      def get(self,request):
            print(User.objects.filter(is_verified=False))
            in_active_users=User.objects.filter(is_verified=False)
            print(User.objects.values('is_verified','first_name','last_login','onetimepassword'))

            serializer = UserRegisterSerializer(in_active_users, many=True)
            
            return Response(serializer.data, status=status.HTTP_200_OK)



class RegisterView(GenericAPIView):
    serializer_class = UserRegisterSerializer

    def post(self, request):
        user = request.data
        print(request.data['first_name'],request.data['last_name'])
        if request.data['first_name']==request.data['last_name']:
             return Response({
                'data':request.data['first_name'],
                'message':'Both Firstname, lastname should not  be same'
            }, status=status.HTTP_201_CREATED)

        serializer=self.serializer_class(data=user)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            user_data=serializer.data
            send_code_to_user(user_data['email'])
            
            return Response({
                'data':user_data,
                'message':'thanks for signing up a passcode has be sent to verify your email'
            }, status=status.HTTP_201_CREATED)
        
        if not  serializer.is_valid(raise_exception=True):
              print(serializer.errors)
              return Response({'data':serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
            
        
      
    

class VerifyUserEmail(GenericAPIView):
    def post(self, request):
        try:
            passcode = request.data.get('otp')
            user_pass_obj=OneTimePassword.objects.get(otp=passcode)
            user=user_pass_obj.user
            if not user.is_verified:
                user.is_verified=True
                user.save()
                return Response({
                    'message':'account email verified successfully'
                }, status=status.HTTP_200_OK)
            return Response({'message':'passcode is invalid user is already verified'}, status=status.HTTP_204_NO_CONTENT)
        except OneTimePassword.DoesNotExist as identifier:
            return Response({'message':'passcode not provided'}, status=status.HTTP_400_BAD_REQUEST)
        
          


class LoginUserView(GenericAPIView):
    serializer_class=LoginSerializer
    def post(self, request):
        serializer= self.serializer_class(data=request.data, context={'request': request})
        if serializer.is_valid(raise_exception=True):
            print('data',serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)
    


class PasswordResetRequestView(GenericAPIView):
    serializer_class=PasswordResetRequestSerializer

    def post(self, request):
        serializer=self.serializer_class(data=request.data, context={'request':request})
        serializer.is_valid(raise_exception=True)
        return Response({'message':'we have sent you a link to reset your password'}, status=status.HTTP_200_OK)
        # return Response({'message':'user with that email does not exist'}, status=status.HTTP_400_BAD_REQUEST)
    



class PasswordResetConfirm(GenericAPIView):

    def get(self, request, uidb64, token):
        try:
            user_id=smart_str(urlsafe_base64_decode(uidb64))
            user=User.objects.get(id=user_id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                return Response({'message':'token is invalid or has expired'}, status=status.HTTP_401_UNAUTHORIZED)
            return Response({'success':True, 'message':'credentials is valid', 'uidb64':uidb64, 'token':token}, status=status.HTTP_200_OK)

        except DjangoUnicodeDecodeError as identifier:
            return Response({'message':'token is invalid or has expired'}, status=status.HTTP_401_UNAUTHORIZED)

class SetNewPasswordView(GenericAPIView):
    serializer_class=SetNewPasswordSerializer

    def patch(self, request):
        serializer=self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'success':True, 'message':"password reset is succesful"}, status=status.HTTP_200_OK)
    

class LogoutView(GenericAPIView):
    serializer_class=LogoutUserSerializer
    permission_classes = (AllowAny,)

    def post(self, request):
        try:
            refresh_token = request.data['refresh_token']
            print(f"Received refresh token: {refresh_token}")

            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(status=status.HTTP_200_OK)

        except Exception as e:
             print(f"Error during logout: {str(e)}")
             return Response(status=status.HTTP_400_BAD_REQUEST)

    # def post(self, request):
    #     try:
    #         refresh_token = request.data['refresh_token']
    #         token = RefreshToken(refresh_token)
    #         print(refresh_token)
    #         token.blacklist()
    #         return Response(status=status.HTTP_200_OK)
    #     except Exception as e:
    #         return Response(status=status.HTTP_400_BAD_REQUEST)

    # def post(self, request):
    #     serializer=self.serializer_class(data=request.data)
    #     serializer.is_valid(raise_exception=True)
    #     serializer.save()
    #     return Response(status=status.HTTP_204_NO_CONTENT) 


