from django.db import models

from cwfollowup.utils.jobs.request_job_status import request_job_status
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
        if (not self.is_uploaded and not self.viterbi_id):
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

    @property
    def job_status(self):
        return request_job_status(self)

    @classmethod
    def user_cwfollowup_job_filter(cls, qs, user_job_filter):
        """
        Used by UserCWFollowupJobFilter to filter only jobs owned by the requesting user

        :param qs: The UserCWFollowupJobFilter queryset
        :param user_job_filter: The UserCWFollowupJobFilter instance
        :return: The queryset filtered by the requesting user
        """
        return qs.filter(user_id=user_job_filter.request.user.user_id)

    @classmethod
    def public_cwfollowup_job_filter(cls, qs, public_job_filter):
        """
        Used by PublicCWFollowupJobFilter to filter only public jobs

        :param qs: The PublicCWFollowupJobFilter queryset
        :param public_job_filter: The PublicCWFollowupJobFilter instance
        :return: The queryset filtered by public jobs only
        """
        return qs.filter(private=False)

    @classmethod
    def cwfollowup_job_filter(cls, queryset, info):
        """
        Used by CWFollowupJobNode to filter which jobs are visible to the requesting user.

        A user must be logged in to view any CWFollowup jobs
        A user who is not a ligo user can not view ligo jobs

        :param queryset: The CWFollowupJobNode queryset
        :param info: The CWFollowupJobNode queryset info object
        :return: queryset filtered by ligo jobs if required
        """
        if info.context.user.is_anonymous:
            raise Exception("You must be logged in to perform this action.")

        return queryset


# Model to store which followups have been run for each followup job
class CWFollowup(models.Model):
    followup_job = models.ForeignKey(CWFollowupJob, related_name='followup', on_delete=models.CASCADE)
    followup = models.CharField(max_length=200)

    class Meta:
        unique_together = (
            ('followup_job', 'followup')
        )
