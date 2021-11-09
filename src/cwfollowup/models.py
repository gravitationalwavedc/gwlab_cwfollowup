import uuid
import datetime

from django.conf import settings
from django.db import models
from django.utils import timezone

from cwfollowup.utils.jobs.request_file_download_id import request_file_download_id
from cwfollowup.utils.jobs.request_file_list import request_file_list
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
    job = models.ForeignKey(CWJob, related_name='candidates', on_delete=models.CASCADE)
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

    job_controller_id = models.IntegerField(default=None, blank=True, null=True)

    def as_json(self):
        candidates = [
            {
                'source_dataset': candidate.source_dataset,
                'candidate_frequency': candidate.candidate_frequency,
                'target_binary': candidate.target_binary,
                'orbit_tp': candidate.orbit_tp,
                'asini': candidate.asini,
                'orbit_period': candidate.orbit_period
            }
            for candidate in self.cw_job.candidates.all()
        ]
        return dict(
            name=self.name,
            description=self.description,
            candidates=candidates,
            followups=list(self.followups.all().values_list('followup', flat=True))
        )

    @property
    def job_status(self):
        return request_job_status(self)

    def get_file_list(self, path='', recursive=True):
        return request_file_list(self, path, recursive)

    def get_file_download_id(self, path):
        return request_file_download_id(self, path)

    @classmethod
    def get_by_id(cls, bid, user):
        """
        Get CWFollowupJob by the provided id

        This function will raise an exception if:-
        * the job requested is a ligo job, but the user is not a ligo user
        * the job requested is private an not owned by the requesting user

        :param bid: The id of the CWFollowupJob to return
        :param user: The GWCloudUser instance making the request
        :return: CWFollowupJob
        """
        job = cls.objects.get(id=bid)

        # Users can only access the job if it is public or the user owns the job
        if job.private and user.user_id != job.user_id:
            raise Exception("Permission Denied")

        return job

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
    followup_job = models.ForeignKey(CWFollowupJob, related_name='followups', on_delete=models.CASCADE)
    followup = models.CharField(max_length=200)

    class Meta:
        unique_together = (
            ('followup_job', 'followup')
        )


class FileDownloadToken(models.Model):
    """
    This model tracks files from job file lists which can be used to generate file download tokens from the job
    controller
    """
    # The job this token is for
    job = models.ForeignKey(CWFollowupJob, on_delete=models.CASCADE, db_index=True)
    # The token sent to the client and used by the client to generate a file download token
    token = models.UUIDField(unique=True, default=uuid.uuid4, db_index=True)
    # The file path this token is for
    path = models.TextField()
    # When the token was created
    created = models.DateTimeField(auto_now_add=True, db_index=True)

    @classmethod
    def get_by_token(cls, token):
        """
        Returns the instance matching the specified token, or None if expired or not found
        """
        # First prune any old tokens which may have expired
        cls.prune()

        # Next try to find the instance matching the specified token
        inst = cls.objects.filter(token=token)
        if not inst.exists():
            return None

        return inst.first()

    @classmethod
    def create(cls, job, paths):
        """
        Creates a bulk number of FileDownloadToken objects for a specific job and list of paths, and returns the
        created objects
        """
        data = [
            cls(
                job=job,
                path=p
            ) for p in paths
        ]

        return cls.objects.bulk_create(data)

    @classmethod
    def prune(cls):
        """
        Removes any expired tokens from the database
        """
        cls.objects.filter(
            created__lt=timezone.now() - datetime.timedelta(seconds=settings.FILE_DOWNLOAD_TOKEN_EXPIRY)
        ).delete()

    @classmethod
    def get_paths(cls, job, tokens):
        """
        Returns a list of paths from a list of tokens, any token that isn't found will have a path of None

        The resulting list, will have identical size and ordering to the provided list of tokens
        """
        # First prune any old tokens which may have expired
        cls.prune()

        # Get all objects matching the list of tokens
        objects = {
            str(rec.token): rec.path for rec in cls.objects.filter(job=job, token__in=tokens)
        }

        # Generate the list and return
        return [
            objects[str(tok)] if str(tok) in objects else None for tok in tokens
        ]
