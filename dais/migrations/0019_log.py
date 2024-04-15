# Generated by Django 5.0.4 on 2024-04-15 08:27

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dais', '0018_license_languages'),
    ]

    operations = [
        migrations.CreateModel(
            name='Log',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField(auto_now_add=True, verbose_name='Data')),
                ('typology', models.CharField(choices=[('Artificial Intelligence', 'Intelligenza artificiale'), ('Digital Signage', 'Digital Signage')], max_length=24, verbose_name='Tipologia')),
                ('information', models.TextField(verbose_name='Informazioni')),
                ('totem', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dais.totem', verbose_name='Totem')),
            ],
            options={
                'verbose_name': 'Log',
                'verbose_name_plural': 'Logs',
            },
        ),
    ]