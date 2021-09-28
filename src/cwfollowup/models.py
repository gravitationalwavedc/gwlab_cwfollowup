from django.db import models

from .variables import cwfollowup_parameters


class CWJob(models.Model):
    user_id = models.IntegerField()
    creation_time = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now_add=True)

    is_uploaded = models.BooleanField(default=False)
    viterbi_id = models.CharField(max_length=255, null=True)

    def save(self, *args, **kwargs):
        if (self.is_uploaded and self.viterbi_id):
            raise Exception("You cannot mark this CWJob as uploaded while providing a Viterbi job ID")
        if (not self.is_uploaded and not self.viterbi_job):
            raise Exception("You cannot mark this CWJob as not uploaded without providing a Viterbi Job ID")
        super().save(*args, **kwargs)


# Candidates returned from a different continuous wave search
class CWJobCandidate(models.Model):
    job = models.ForeignKey(CWJob, related_name='candidate', on_delete=models.CASCADE)
    source_dataset = models.CharField(
        max_length=2,
        choices=cwfollowup_parameters.SOURCE_DATASETS,
        default=cwfollowup_parameters.O1[0],
    )
    candidate_frequency = models.FloatField()
    target_binary = models.BooleanField(default=True)
    orbit_tp = models.FloatField(null=True)
    asini = models.FloatField(null=True)
    orbit_period = models.FloatField(null=True)


# Model to hold all the information for a followup job
# Can either use a Viterbi job or an uploaded job as a ForeignKey
class CWFollowupJob(models.Model):
    user_id = models.IntegerField()
    name = models.CharField(max_length=55, null=False)
    description = models.TextField(null=True)
    private = models.BooleanField(default=False)
    creation_time = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now_add=True)

    cw_job = models.ForeignKey(
        CWJob,
        related_name="followup_job",
        on_delete=models.PROTECT,
        blank=True,
        null=True
    )


# Model to store which followups have been run for each followup job
class CWFollowup(models.Model):
    followup_job = models.ForeignKey(CWFollowupJob, related_name='followup', on_delete=models.CASCADE)
    followup = models.CharField(max_length=200)

    class Meta:
        unique_together = (
            ('followup_job', 'followup')
        )
