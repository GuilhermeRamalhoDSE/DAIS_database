# Generated by Django 5.0.4 on 2024-05-06 15:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dais', '0047_formfield'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='formfield',
            options={'ordering': ['number'], 'verbose_name': 'Campo di Form', 'verbose_name_plural': 'Campi di Form'},
        ),
        migrations.RenameField(
            model_name='formfield',
            old_name='numero',
            new_name='number',
        ),
    ]