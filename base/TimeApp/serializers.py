from rest_framework import serializers
from TimeApp.models import Item, Lot
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Formular

class MyTokenObtainPairSerailizer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['is_staff'] = user.is_staff

        return token

class LotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lot
        fields = '__all__'

class FormularSerializer(serializers.ModelSerializer):
    class Meta:
        model = Formular
        fields = "__all__"

class ItemSerializer(serializers.ModelSerializer):
    formulars = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Item
        fields = ['item_id', 'item', 'init', 'kneader', 'end_extruder', 'end_prepress', 'start_prim_press', 'end_prim_press',
                  'steam_in', 'start_sec_press', 'start_sec_press2', 'cooling', 'record_sec_press', 'record_sec_press2',
                  'end_sec_press', 'extra1', 'formulars']
        extra_kwargs = {"item": {"error_messages": {"required": "กรุณาเลือก Item!"}}}