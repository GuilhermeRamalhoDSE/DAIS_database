# Generated by Django 5.0.4 on 2024-04-15 14:14

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dais', '0022_periodds_active'),
    ]

    operations = [
        migrations.CreateModel(
            name='PeriodIA',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_date', models.DateField(verbose_name='Data di inizio')),
                ('end_date', models.DateField(verbose_name='Data di fine')),
                ('last_update', models.DateTimeField(auto_now=True, verbose_name="Data dell'ultimo aggiornamento")),
                ('active', models.BooleanField(default=True, verbose_name='Attivo')),
                ('group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dais.group', verbose_name='Gruppo')),
            ],
            options={
                'verbose_name': 'PeriodoIA',
                'verbose_name_plural': 'PeriodiIA',
            },
        ),
    ]