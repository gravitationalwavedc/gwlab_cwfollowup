# Generated by Django 2.2.28 on 2023-01-31 00:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cwfollowup', '0006_filedownloadtoken'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='cwjobcandidate',
            name='job',
        ),
        migrations.RemoveField(
            model_name='cwfollowupjob',
            name='cw_job',
        ),
        migrations.AddField(
            model_name='cwfollowupjob',
            name='candidate_group_id',
            field=models.IntegerField(default=0),
        ),
        migrations.DeleteModel(
            name='CWJob',
        ),
        migrations.DeleteModel(
            name='CWJobCandidate',
        ),
    ]
