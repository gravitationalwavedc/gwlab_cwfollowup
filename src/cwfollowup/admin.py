from django.contrib import admin
from .models import CWFollowupJob, CWJob, CWJobCandidate


@admin.register(CWFollowupJob)
class CWFollowupJobAdmin(admin.ModelAdmin):
    pass


class CWJobCandidateAdmin(admin.TabularInline):
    model = CWJobCandidate

    def has_change_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(CWJob)
class CWJobAdmin(admin.ModelAdmin):
    inlines = [CWJobCandidateAdmin, ]
