# Generated by Django 5.0.4 on 2024-05-09 10:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dais', '0050_totem_last_update'),
    ]

    operations = [
        migrations.AddField(
            model_name='clientmodule',
            name='groups',
            field=models.ManyToManyField(blank=True, to='dais.group', verbose_name='Gruppi'),
        ),
    ]