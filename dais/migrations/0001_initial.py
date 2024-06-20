# Generated by Django 5.0.4 on 2024-06-20 10:34

import dais.models.avatar_models
import dais.models.button_models
import dais.models.campaignai_models
import dais.models.campaignds_models
import dais.models.contributionai_models
import dais.models.contributionds_models
import dais.models.formation_models
import django.db.models.deletion
import django.utils.timezone
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Avatar',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('file', models.FileField(upload_to=dais.models.avatar_models.avatar_directory_path)),
                ('last_update_date', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='ButtonType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('email', models.EmailField(max_length=254)),
                ('address', models.CharField(max_length=255)),
                ('phone', models.CharField(max_length=20)),
                ('active', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='GroupType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Language',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Module',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('slug', models.SlugField(max_length=255, null=True, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='ScreenType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Voice',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='ClientModule',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dais.client')),
            ],
        ),
        migrations.CreateModel(
            name='Form',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('last_update', models.DateTimeField(auto_now=True)),
                ('api', models.BooleanField(default=False)),
                ('client_module', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='dais.clientmodule')),
            ],
        ),
        migrations.CreateModel(
            name='FormData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data', models.JSONField()),
                ('form', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dais.form')),
            ],
        ),
        migrations.CreateModel(
            name='FormField',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('number', models.IntegerField()),
                ('field_type', models.CharField(choices=[('Text', 'Text'), ('Number', 'Number'), ('Date', 'Date')], default='text', max_length=50)),
                ('required', models.BooleanField(default=False)),
                ('form', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fields', to='dais.form')),
            ],
        ),
        migrations.CreateModel(
            name='Group',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('comments', models.TextField(blank=True, null=True)),
                ('last_update', models.DateTimeField(default=django.utils.timezone.now)),
                ('needs_update', models.BooleanField(default=False)),
                ('client', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='dais.client')),
                ('forms', models.ManyToManyField(blank=True, to='dais.form')),
                ('typology', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='dais.grouptype')),
            ],
        ),
        migrations.AddField(
            model_name='clientmodule',
            name='groups',
            field=models.ManyToManyField(blank=True, to='dais.group'),
        ),
        migrations.CreateModel(
            name='CampaignDS',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('last_update', models.DateTimeField(auto_now=True)),
                ('active', models.BooleanField(default=True)),
                ('logo', models.FileField(blank=True, null=True, upload_to=dais.models.campaignds_models.campaign_file_path)),
                ('background', models.FileField(blank=True, null=True, upload_to=dais.models.campaignds_models.campaign_file_path)),
                ('footer', models.CharField(blank=True, max_length=255, null=True)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dais.group')),
            ],
        ),
        migrations.CreateModel(
            name='CampaignAI',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('last_update', models.DateTimeField(auto_now=True)),
                ('active', models.BooleanField(default=True)),
                ('logo', models.FileField(blank=True, null=True, upload_to=dais.models.campaignai_models.campaign_file_path)),
                ('background', models.FileField(blank=True, null=True, upload_to=dais.models.campaignai_models.campaign_file_path)),
                ('footer', models.CharField(blank=True, max_length=255, null=True)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dais.group')),
            ],
        ),
        migrations.CreateModel(
            name='Layer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('layer_number', models.IntegerField()),
                ('name', models.CharField(max_length=255)),
                ('last_update_date', models.DateTimeField(auto_now=True)),
                ('trigger', models.CharField(max_length=255)),
                ('avatar', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dais.avatar')),
                ('campaignai', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dais.campaignai')),
                ('parent', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='children', to='dais.layer')),
            ],
        ),
        migrations.CreateModel(
            name='ContributionAI',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('file', models.FileField(blank=True, null=True, upload_to=dais.models.contributionai_models.contribuitionia_directory_path)),
                ('type', models.CharField(choices=[('VIDEO', 'Video'), ('IMAGE', 'Image'), ('3D', '3D')], max_length=10)),
                ('trigger', models.CharField(max_length=255)),
                ('last_update_date', models.DateTimeField(auto_now=True, null=True)),
                ('detail', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('language', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dais.language')),
                ('layer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dais.layer')),
            ],
        ),
        migrations.CreateModel(
            name='License',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('address', models.CharField(blank=True, max_length=255, null=True)),
                ('tel', models.CharField(blank=True, max_length=20, null=True)),
                ('active', models.BooleanField(default=True)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('total_totem', models.IntegerField(default=0)),
                ('avatars', models.ManyToManyField(blank=True, to='dais.avatar')),
                ('buttontypes', models.ManyToManyField(blank=True, to='dais.buttontype')),
                ('grouptypes', models.ManyToManyField(blank=True, to='dais.grouptype')),
                ('languages', models.ManyToManyField(blank=True, to='dais.language')),
                ('modules', models.ManyToManyField(blank=True, to='dais.module')),
                ('screentypes', models.ManyToManyField(blank=True, to='dais.screentype')),
                ('voices', models.ManyToManyField(blank=True, to='dais.voice')),
            ],
        ),
        migrations.AddField(
            model_name='client',
            name='license',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dais.license'),
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('first_name', models.CharField(max_length=255)),
                ('last_name', models.CharField(max_length=255)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('last_login', models.DateTimeField(blank=True, null=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='custom_user_set', related_query_name='user', to='auth.group')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='custom_user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
                ('license', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='users', to='dais.license')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='clientmodule',
            name='module',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='dais.module'),
        ),
        migrations.CreateModel(
            name='PasswordResetToken',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('token', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='TimeSlot',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_time', models.TimeField()),
                ('end_time', models.TimeField()),
                ('is_random', models.BooleanField(blank=True, default=False)),
                ('campaignds', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dais.campaignds')),
            ],
        ),
        migrations.CreateModel(
            name='ContributionDS',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=255)),
                ('file', models.FileField(upload_to=dais.models.contributionds_models.contribuitionds_directory_path)),
                ('created_at', models.DateTimeField(blank=True, default=django.utils.timezone.now)),
                ('time_slot', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dais.timeslot')),
            ],
        ),
        migrations.CreateModel(
            name='Totem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, null=True)),
                ('installation_date', models.DateField(null=True)),
                ('active', models.BooleanField(default=False)),
                ('comments', models.TextField(blank=True, null=True)),
                ('last_update', models.DateTimeField(default=django.utils.timezone.now)),
                ('group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dais.group')),
            ],
        ),
        migrations.CreateModel(
            name='Screen',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('typology', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dais.screentype')),
                ('totem', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='dais.totem')),
            ],
        ),
        migrations.CreateModel(
            name='Log',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('typology', models.CharField(choices=[('Artificial Intelligence', 'AI'), ('Digital Signage', 'DS')], max_length=24)),
                ('information', models.TextField()),
                ('client', models.CharField(blank=True, default='', max_length=100)),
                ('campaign', models.CharField(blank=True, default='', max_length=100)),
                ('logtype', models.CharField(blank=True, default='', max_length=100)),
                ('license', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dais.license')),
                ('totem', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='dais.totem')),
            ],
        ),
        migrations.CreateModel(
            name='TouchScreenInteractions',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('last_update', models.DateTimeField(default=django.utils.timezone.now)),
                ('client_module', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='dais.clientmodule')),
            ],
        ),
        migrations.CreateModel(
            name='Button',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('url', models.URLField(blank=True, null=True)),
                ('file', models.FileField(blank=True, null=True, upload_to=dais.models.button_models.button_directory_path)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('button_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dais.buttontype')),
                ('form', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='dais.form')),
                ('interaction', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dais.touchscreeninteractions')),
            ],
        ),
        migrations.CreateModel(
            name='Formation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('file', models.FileField(blank=True, null=True, upload_to=dais.models.formation_models.formation_directory_path)),
                ('trigger', models.CharField(max_length=255)),
                ('last_update_date', models.DateTimeField(auto_now=True)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('language', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dais.language')),
                ('layer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dais.layer')),
                ('voice', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dais.voice')),
            ],
        ),
    ]
