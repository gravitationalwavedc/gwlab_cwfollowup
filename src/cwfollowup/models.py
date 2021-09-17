from django.db import models

from .variables import cwfollowup_parameters


# Viterbi job for which to run followups
class ViterbiJob(models.Model):
    user_id = models.IntegerField()
    viterbi_id = models.CharField(max_length=255, blank=False, null=False)


# Holds the results of a different continuous wave search code
class UploadedCWJob(models.Model):
    user_id = models.IntegerField()

    creation_time = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now_add=True)


# Candidates returned from a different continuous wave search
class UploadedCWJobCandidate(models.Model):
    job = models.ForeignKey(UploadedCWJob, related_name='parameter', on_delete=models.CASCADE)
    source_dataset = models.CharField(
        max_length=2,
        choices=cwfollowup_parameters.SOURCE_DATASETS,
        default=cwfollowup_parameters.O1[0],
        null=True,
        blank=True
    )
    candidate_frequency = models.FloatField(null=False, blank=False)
    target_binary = models.BooleanField(default=True, null=False, blank=False)
    orbit_tp = models.FloatField(null=True, blank=True)
    asini = models.FloatField(null=True, blank=True)
    orbit_period = models.FloatField(null=True, blank=True)


# Model to hold all the information for a followup job
# Can either use a Viterbi job or an uploaded job as a ForeignKey
class CWFollowupJob(models.Model):
    user_id = models.IntegerField()
    name = models.CharField(max_length=55, blank=False, null=False)
    description = models.TextField(blank=True, null=True)
    private = models.BooleanField(default=False)
    creation_time = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now_add=True)

    is_uploaded = models.BooleanField(blank=False, default=False)
    uploaded_job = models.ForeignKey(
        UploadedCWJob,
        related_name="followup_job",
        on_delete=models.PROTECT,
        blank=True,
        null=True
    )
    viterbi_job = models.ForeignKey(
        ViterbiJob,
        related_name="followup_job",
        on_delete=models.PROTECT,
        blank=True,
        null=True
    )

    @property
    def cw_job(self):
        if self.is_uploaded:
            return self.uploaded_job
        else:
            return self.viterbi_job

    def save(self, *args, **kwargs):
        if (self.is_uploaded and not self.uploaded_job):
            raise Exception("You cannot mark this followup as uploaded without providing an UploadedCWJob")
        if (not self.is_uploaded and not self.viterbi_job):
            raise Exception("You cannot mark this followup as not uploaded without providing a ViterbiJob")
        super().save(*args, **kwargs)


# Model to store which followups have been run for each followup job
class CWFollowup(models.Model):
    followup_job = models.ForeignKey(CWFollowupJob, related_name='followup', on_delete=models.CASCADE)
    followup = models.CharField(max_length=200)

    class Meta:
        unique_together = (
            ('followup_job', 'followup')
        )
