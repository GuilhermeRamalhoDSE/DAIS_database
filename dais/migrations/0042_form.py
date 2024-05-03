# Generated by Django 5.0.4 on 2024-05-03 08:21

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dais', '0041_alter_totem_active'),
    ]

    operations = [
        migrations.CreateModel(
            name='Form',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, verbose_name='Nome')),
                ('last_update', models.DateTimeField(auto_now=True, verbose_name="Data Dell'ultimo aggiornamento")),
                ('api', models.BooleanField(default=False, verbose_name='API')),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dais.client', verbose_name='Clienti')),
                ('module', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dais.module', verbose_name='Modulo')),
            ],
            options={
                'verbose_name': 'Form',
            },
        ),
    ]