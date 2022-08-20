# Generated by Django 4.0.5 on 2022-08-19 09:02

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('TimeApp', '0013_remove_formular_item_item_formular_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='formular',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='formulars', to='TimeApp.formular'),
        ),
        migrations.AlterField(
            model_name='lot',
            name='cooling_time',
            field=models.DateTimeField(default=datetime.datetime(2022, 8, 19, 16, 2, 51, 361806), null=True),
        ),
        migrations.AlterField(
            model_name='lot',
            name='end_extruder_time',
            field=models.DateTimeField(default=datetime.datetime(2022, 8, 19, 16, 2, 51, 361806), null=True),
        ),
        migrations.AlterField(
            model_name='lot',
            name='end_prepress_time',
            field=models.DateTimeField(default=datetime.datetime(2022, 8, 19, 16, 2, 51, 361806), null=True),
        ),
        migrations.AlterField(
            model_name='lot',
            name='end_prim_press_time',
            field=models.DateTimeField(default=datetime.datetime(2022, 8, 19, 16, 2, 51, 361806), null=True),
        ),
        migrations.AlterField(
            model_name='lot',
            name='end_sec_press_time',
            field=models.DateTimeField(default=datetime.datetime(2022, 8, 19, 16, 2, 51, 361806), null=True),
        ),
        migrations.AlterField(
            model_name='lot',
            name='kneader_time',
            field=models.DateTimeField(default=datetime.datetime(2022, 8, 19, 16, 2, 51, 360786), null=True),
        ),
        migrations.AlterField(
            model_name='lot',
            name='record_sec_press2_time',
            field=models.DateTimeField(default=datetime.datetime(2022, 8, 19, 16, 2, 51, 361806), null=True),
        ),
        migrations.AlterField(
            model_name='lot',
            name='record_sec_press_time',
            field=models.DateTimeField(default=datetime.datetime(2022, 8, 19, 16, 2, 51, 361806), null=True),
        ),
        migrations.AlterField(
            model_name='lot',
            name='start_prim_press_time',
            field=models.DateTimeField(default=datetime.datetime(2022, 8, 19, 16, 2, 51, 361806), null=True),
        ),
        migrations.AlterField(
            model_name='lot',
            name='start_sec_press2_time',
            field=models.DateTimeField(default=datetime.datetime(2022, 8, 19, 16, 2, 51, 361806), null=True),
        ),
        migrations.AlterField(
            model_name='lot',
            name='start_sec_press_time',
            field=models.DateTimeField(default=datetime.datetime(2022, 8, 19, 16, 2, 51, 361806), null=True),
        ),
        migrations.AlterField(
            model_name='lot',
            name='start_time',
            field=models.DateTimeField(default=datetime.datetime(2022, 8, 19, 16, 2, 51, 360786), null=True),
        ),
        migrations.AlterField(
            model_name='lot',
            name='steam_in_time',
            field=models.DateTimeField(default=datetime.datetime(2022, 8, 19, 16, 2, 51, 361806), null=True),
        ),
        migrations.AlterField(
            model_name='lot',
            name='workday',
            field=models.DateTimeField(default=datetime.datetime(2022, 8, 19, 16, 2, 51, 361806)),
        ),
    ]