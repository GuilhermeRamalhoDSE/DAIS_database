# Generated by Django 5.0.4 on 2024-04-11 13:43

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dais', '0011_license_voices'),
    ]

    operations = [
        migrations.CreateModel(
            name='Group',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, verbose_name='Nome')),
                ('typology', models.CharField(choices=[('Artificial Intelligence', 'Intelligenza artificiale'), ('Digital Signage', 'Digital Signage')], max_length=24, verbose_name='Tipologia')),
                ('total_totems', models.IntegerField(verbose_name='Totale Totem')),
                ('comments', models.TextField(blank=True, null=True, verbose_name='Commenti')),
                ('license', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dais.license', verbose_name='Licenza')),
            ],
            options={
                'verbose_name': 'Gruppo',
                'verbose_name_plural': 'Gruppi',
            },
        ),
    ]
