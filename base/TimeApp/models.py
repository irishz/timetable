from django.db import models
from datetime import datetime

from django.forms import IntegerField

class Item(models.Model):
    item_id = models.AutoField(primary_key=True)
    item = models.CharField(max_length=40)
    init = models.IntegerField(default=0, blank=True, null=True)
    kneader = models.IntegerField(default=0, blank=True, null=True)
    end_extruder = models.IntegerField(default=0, blank=True, null=True)
    end_prepress = models.IntegerField(default=0, blank=True, null=True)
    start_prim_press = models.IntegerField(default=0, blank=True, null=True)
    end_prim_press = models.IntegerField(default=0, blank=True, null=True)
    steam_in = models.IntegerField(default=0, blank=True, null=True)
    start_sec_press = models.IntegerField(default=0, blank=True, null=True)
    start_sec_press2 = models.IntegerField(default=0, blank=True, null=True)
    cooling = models.IntegerField(default=0, blank=True, null=True)
    record_sec_press = models.IntegerField(default=0, blank=True, null=True)
    record_sec_press2 = models.IntegerField(default=0, blank=True, null=True)
    end_sec_press = models.IntegerField(default=0, blank=True, null=True)
    extra1 = models.IntegerField(default=0, blank=True, null=True)

class Lot(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='items')
    batch_no = models.IntegerField(default=0, blank=True, null=True)
    run_no = models.IntegerField(default=0, blank=True, null=True)
    mc_no = models.IntegerField(default=0, blank=True, null=True)
    block_qty = models.IntegerField(default=0, blank=True, null=True)
    block_temp = models.IntegerField(default=0, blank=True, null=True)
    start_time = models.DateTimeField(default=datetime.now(), null=True)
    kneader_time = models.DateTimeField(default=datetime.now(), null=True)
    end_extruder_time = models.DateTimeField(default=datetime.now(), null=True)
    end_prepress_time = models.DateTimeField(default=datetime.now(), null=True)
    start_prim_press_time = models.DateTimeField(default=datetime.now(), null=True)
    end_prim_press_time = models.DateTimeField(default=datetime.now(), null=True)
    steam_in_time = models.DateTimeField(default=datetime.now(), null=True)
    start_sec_press_time = models.DateTimeField(default=datetime.now(), null=True)
    start_sec_press2_time = models.DateTimeField(default=datetime.now(), null=True)
    cooling_time = models.DateTimeField(default=datetime.now(), null=True)
    record_sec_press_time = models.DateTimeField(default=datetime.now(), null=True)
    record_sec_press2_time = models.DateTimeField(default=datetime.now(), null=True)
    end_sec_press_time = models.DateTimeField(default=datetime.now(), null=True)
    workday = models.DateTimeField(default=datetime.now(), null=False)
    flag = models.IntegerField(default=0, blank=False, null=False)
