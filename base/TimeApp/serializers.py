from rest_framework import serializers
from TimeApp.models import Item, Lot, Formula
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerailizer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['is_staff'] = user.is_staff

        return token

class LotSerializer(serializers.ModelSerializer):
    # formula = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    # items = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    class Meta:
        model = Lot
        fields = '__all__'

class FormulaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Formula
        fields = "__all__"

class ItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Item
        fields = "__all__"