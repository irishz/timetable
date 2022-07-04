from dataclasses import fields
from pyexpat import model
from rest_framework import serializers
from TimeApp.models import Item, Lot

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

class LotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lot
        fields = '__all__'