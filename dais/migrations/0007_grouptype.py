# Generated by Django 5.0.4 on 2024-06-19 15:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dais', '0006_remove_license_license_code'),
    ]

    operations = [
        migrations.CreateModel(
            name='GroupType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
            ],
        ),
    ]
