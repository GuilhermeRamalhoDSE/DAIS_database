# Generated by Django 5.0.4 on 2024-06-04 07:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dais', '0064_log_campaign_log_client_log_totem_alter_log_license'),
    ]

    operations = [
        migrations.AddField(
            model_name='log',
            name='logtype',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
    ]