from django.contrib import admin
from .models import CWFollowupJob


@admin.register(CWFollowupJob)
class CWFollowupJobAdmin(admin.ModelAdmin):
    pass
