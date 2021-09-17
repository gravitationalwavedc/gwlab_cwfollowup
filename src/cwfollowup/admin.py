from django.contrib import admin
from .models import CWFollowupJob, ViterbiJob, UploadedCWJob, UploadedCWJobCandidate


@admin.register(CWFollowupJob)
class CWFollowupJobAdmin(admin.ModelAdmin):
    pass


class UploadedCWJobCandidateAdmin(admin.TabularInline):
    model = UploadedCWJobCandidate

    def has_change_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(UploadedCWJob)
class UploadedCWJobAdmin(admin.ModelAdmin):
    inlines = [UploadedCWJobCandidateAdmin, ]


@admin.register(ViterbiJob)
class ViterbiJobAdmin(admin.ModelAdmin):
    pass
