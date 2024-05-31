# Generated by Django 5.0.4 on 2024-05-30 15:46

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dais', '0059_license_total_totem'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='totem',
            options={},
        ),
        migrations.AlterField(
            model_name='totem',
            name='active',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='totem',
            name='comments',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='totem',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dais.group'),
        ),
        migrations.AlterField(
            model_name='totem',
            name='installation_date',
            field=models.DateField(),
        ),
        migrations.AlterField(
            model_name='totem',
            name='last_update',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='totem',
            name='name',
            field=models.CharField(max_length=255, null=True),
        ),
    ]
