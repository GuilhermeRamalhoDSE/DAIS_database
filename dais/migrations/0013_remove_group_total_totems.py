# Generated by Django 5.0.4 on 2024-04-11 14:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dais', '0012_group'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='group',
            name='total_totems',
        ),
    ]