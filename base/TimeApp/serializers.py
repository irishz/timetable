from rest_framework import serializers
from TimeApp.models import Item, Lot

class LotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lot
        fields = '__all__'

class ItemSerializer(serializers.ModelSerializer):
    lots = LotSerializer(many=True, read_only=True)
    class Meta:
        model = Item
        fields = ['item_id', 'item', 'init', 'kneader', 'end_extruder', 'end_prepress', 'start_prim_press', 'end_prim_press', 'steam_in', 'start_sec_press', 'start_sec_press2', 'cooling', 'record_sec_press', 'record_sec_press2', 'end_sec_press', 'extra1', 'lots']
        extra_kwargs = {"item": {"error_messages": {"required": "กรุณาเลือก Item!"}}}