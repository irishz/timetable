from django.db import models
from django.forms import DateTimeField, IntegerField
from datetime import datetime
# Create your models here.
class Item(models.Model):
    item_id = models.AutoField(primary_key=True)
    item = models.CharField(max_length=40)
    init = models.IntegerField(default=0, blank=True, null=True)
    kneader = models.IntegerField(default=0, blank=True, null=True)
    extruder = models.IntegerField(default=0, blank=True, null=True)
    prepress = models.IntegerField(default=0, blank=True, null=True)
    m2_prim_press = models.IntegerField(default=0, blank=True, null=True)
    primary_press = models.IntegerField(default=0, blank=True, null=True)
    m2_sec_press = models.IntegerField(default=0, blank=True, null=True)
    secpress1 = models.IntegerField(default=0, blank=True, null=True)
    secpress2 = models.IntegerField(default=0, blank=True, null=True)
    secpress3 = models.IntegerField(default=0, blank=True, null=True)
    mc_finish = models.IntegerField(default=0, blank=True, null=True)
    extra1 = models.IntegerField(default=0, blank=True, null=True)
    extra2 = models.IntegerField(default=0, blank=True, null=True)
    extra3 = models.IntegerField(default=0, blank=True, null=True)

class Lot(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='items')
    kneader_time = models.DateTimeField(default=datetime.now())
    extruder_time = models.DateTimeField(default=datetime.now())
    prepress_time = models.DateTimeField(default=datetime.now())
    m2_prim_press_time = models.DateTimeField(default=datetime.now())
    primary_press_time = models.DateTimeField(default=datetime.now())
    m2_sec_press_time = models.DateTimeField(default=datetime.now())
    secpress1_time = models.DateTimeField(default=datetime.now())
    secpress2_time = models.DateTimeField(default=datetime.now())
    secpress3_time = models.DateTimeField(default=datetime.now())
    mc_finish_time = models.DateTimeField(default=datetime.now())
    extra1_time = models.DateTimeField(default=datetime.now())
    extra2_time = models.DateTimeField(default=datetime.now())
    extra3_time = models.DateTimeField(default=datetime.now())
