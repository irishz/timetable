# Generated by Django 4.0.5 on 2022-07-18 06:29

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('TimeApp', '0003_alter_lot_cooling_time_alter_lot_end_extruder_time_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lot',
            name='cooling_time',
            field=models.DateTimeField(default=datetime.datetime(2022, 7, 18, 13, 29, 33, 119886)),
        ),
        migrations.AlterField(
            model_name='lot',
            name='end_extruder_time',
            field=models.DateTimeField(default=datetime.datetime(2022, 7, 18, 13, 29, 33, 119886)),
        ),
        migrations.AlterField(
            model_name='lot',
            name='end_prepress_time',
            field=models.DateTimeField(default=datetime.datetime(2022, 7, 18, 13, 29, 33, 119886)),
        ),
        migrations.AlterField(
            model_name='lot',
            name='end_prim_press_time',
            field=models.DateTimeField(default=datetime.datetime(2022, 7, 18, 13, 29, 33, 119886)),
        ),
        migrations.AlterField(
            model_name='lot',
            name='end_sec_press_time',
            field=models.DateTimeField(default=datetime.datetime(2022, 7, 18, 13, 29, 33, 119886)),
        ),
        migrations.AlterField(
            model_name='lot',
            name='kneader_time',
            field=models.DateTimeField(default=datetime.datetime(2022, 7, 18, 13, 29, 33, 119886)),
        ),
        migrations.AlterField(
            model_name='lot',
            name='record_sec_press2_time',
            field=models.DateTimeField(default=datetime.datetime(2022, 7, 18, 13, 29, 33, 119886)),
        ),
        migrations.AlterField(
            model_name='lot',
            name='record_sec_press_time',
            field=models.DateTimeField(default=datetime.datetime(2022, 7, 18, 13, 29, 33, 119886)),
        ),
        migrations.AlterField(
            model_name='lot',
            name='start_prim_press_time',
            field=models.DateTimeField(default=datetime.datetime(2022, 7, 18, 13, 29, 33, 119886)),
        ),
        migrations.AlterField(
            model_name='lot',
            name='start_sec_press2_time',
            field=models.DateTimeField(default=datetime.datetime(2022, 7, 18, 13, 29, 33, 119886)),
        ),
        migrations.AlterField(
            model_name='lot',
            name='start_sec_press_time',
            field=models.DateTimeField(default=datetime.datetime(2022, 7, 18, 13, 29, 33, 119886)),
        ),
        migrations.AlterField(
            model_name='lot',
            name='start_time',
            field=models.DateTimeField(default=datetime.datetime(2022, 7, 18, 13, 29, 33, 119886)),
        ),
        migrations.AlterField(
            model_name='lot',
            name='steam_in_time',
            field=models.DateTimeField(default=datetime.datetime(2022, 7, 18, 13, 29, 33, 119886)),
        ),
    ]
