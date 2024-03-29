from .base import *

DEBUG = False

SITE_URL = "https://gwlab.org.au"

STATIC_URL = "/cwfollowup/static/"

ALLOWED_HOSTS = ['*']

EMAIL_HOST = 'mail.swin.edu.au'
EMAIL_PORT = 25

GWCLOUD_JOB_CONTROLLER_API_URL = "http://adacs-job-controller.jobcontroller.svc.cluster.local:8000/job/apiv1"
GWCLOUD_AUTH_API_URL = "http://gwcloud-auth:8000/auth/graphql"
GWCLOUD_DB_SEARCH_API_URL = "http://gwcloud-db-search:8000/graphql"
GWLAB_GWCANDIDATE_GRAPHQL_URL = "http://gwlab-gwcandidate-django:8000/graphql"

try:
    from .environment import *
except ImportError:
    pass
