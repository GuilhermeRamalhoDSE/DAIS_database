# Generated by Django 5.0.4 on 2024-04-22 10:43

import dais.models.contributionai_models
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dais', '0031_alter_screen_totem'),
    ]

    operations = [
        migrations.CreateModel(
            name='ContributionIA',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, verbose_name='nome')),
                ('file', models.FileField(blank=True, null=True, upload_to=dais.models.contributionai_models.contribuitionia_directory_path, verbose_name='file')),
                ('type', models.CharField(choices=[('VIDEO', 'Video'), ('IMAGE', 'Image'), ('3D', '3D')], max_length=10, verbose_name='tipologia')),
                ('trigger', models.CharField(max_length=255, verbose_name='trigger')),
                ('last_update_date', models.DateTimeField(auto_now=True, null=True, verbose_name="data dell'ultima aggiornazione")),
                ('detail', models.TextField(blank=True, null=True, verbose_name='dettaglio')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='data di creazione')),
                ('language', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dais.language', verbose_name='id lingua')),
                ('layer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dais.layer', verbose_name='id layer')),
            ],
            options={
                'verbose_name': 'Contribuiti IA',
                'verbose_name_plural': 'Contributi IA',
            },
        ),
    ]
