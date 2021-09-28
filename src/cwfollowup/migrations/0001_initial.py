# Generated by Django 2.2.16 on 2021-09-28 04:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CWJob',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.IntegerField()),
                ('creation_time', models.DateTimeField(auto_now_add=True)),
                ('last_updated', models.DateTimeField(auto_now_add=True)),
                ('is_uploaded', models.BooleanField(default=False)),
                ('viterbi_id', models.CharField(blank=True, max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='CWJobCandidate',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('source_dataset', models.CharField(blank=True, choices=[['o1', 'O1'], ['o2', 'O2'], ['o3', 'O3'], ['o4', 'O4']], default='o1', max_length=2, null=True)),
                ('candidate_frequency', models.FloatField()),
                ('target_binary', models.BooleanField(default=True)),
                ('orbit_tp', models.FloatField(blank=True, null=True)),
                ('asini', models.FloatField(blank=True, null=True)),
                ('orbit_period', models.FloatField(blank=True, null=True)),
                ('job', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='candidate', to='cwfollowup.CWJob')),
            ],
        ),
        migrations.CreateModel(
            name='CWFollowupJob',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.IntegerField()),
                ('name', models.CharField(max_length=55)),
                ('description', models.TextField(blank=True, null=True)),
                ('private', models.BooleanField(default=False)),
                ('creation_time', models.DateTimeField(auto_now_add=True)),
                ('last_updated', models.DateTimeField(auto_now_add=True)),
                ('cw_job', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='followup_job', to='cwfollowup.CWJob')),
            ],
        ),
        migrations.CreateModel(
            name='CWFollowup',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('followup', models.CharField(max_length=200)),
                ('followup_job', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='followup', to='cwfollowup.CWFollowupJob')),
            ],
            options={
                'unique_together': {('followup_job', 'followup')},
            },
        ),
    ]
