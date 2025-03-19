# Generated by Django 4.2 on 2024-11-07 18:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0009_team'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='team',
            options={'verbose_name_plural': 'Team'},
        ),
        migrations.RemoveField(
            model_name='user',
            name='full_name',
        ),
        migrations.AddField(
            model_name='profile',
            name='full_name',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
