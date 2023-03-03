# Generated by Django 4.1.6 on 2023-03-02 11:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('youtube_auth', '0002_remove_credential_user_and_more'),
        ('channels', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='channel',
            name='creator',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='creator', to='youtube_auth.credential'),
        ),
        migrations.AlterField(
            model_name='useranalytics',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='youtube_auth.credential'),
        ),
    ]
