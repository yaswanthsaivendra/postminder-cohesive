"""
Django settings for core project.

Generated by 'django-admin startproject' using Django 3.2.6.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.2/ref/settings/
"""

from pathlib import Path
import os

import environ
# Initialise environment variables
env = environ.Env()
environ.Env.read_env()




# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-z9kyc=b-uu-32i%81(nuvvvl2@(eu7+!6o90vtag1cm1_@@9xh'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

 # setup cohesive app
import cohesive

cohesive.api_base = str(env("COHESIVE_BASE_URL"))
cohesive.api_key = str(env("COHESIVE_API_KEY"))
cohesive.app_id = str(env("COHESIVE_APP_ID"))
cohesive.app_secret = str(env("COHESIVE_APP_SECRET"))


import cohesive_django
cohesive_django.app_label = 'postminder'


# reporting usage
# import cohesive_django.usage as usage

# usage.track_usage(
#     workspace_id=request.auth_details.workspace_id,
#     instance_id=request.auth_details.instance_id,
#     used_items=1, // amount of items the user used
#     free_trial_items=10, // amount of items in the free trial
#     items_per_unit=200, // amount of items in a single unit. Billing is based on number of units consumed
# )




# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',


    #apps
    'youtube_auth.apps.YoutubeAuthConfig',
    'channels.apps.ChannelsConfig',
    'posts.apps.PostsConfig',



    #third-party-apps
    'rest_framework',
    'corsheaders',
    'django_crontab',
    'storages'

]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'cohesive_django.auth.AuthMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

STATIC_URL = '/static/'

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'



MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'



##  CORS
CORS_ALLOWED_ORIGINS = [
    "https://example.com",
    "https://sub.example.com",
    "http://localhost:3000",
    "http://127.0.0.1:9000",
    "https://postminder-frontend-apps-by-cohesive-0fyz.live.cohesive.so",
    "https://cohesive.so",
]
CORS_ALLOW_CREDENTIALS = True



## YOUTube Data API

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1" # should be removed in prod.


TOKEN_URI=  "https://oauth2.googleapis.com/token"
CLIENT_ID= "12529979733-2nvcfib0cob17j3j6p21bnkl6spm9olr.apps.googleusercontent.com"
CLIENT_SECRET= "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"
API_SERVICE_NAME= "youtube"
API_VERSION= "v3"
SCOPES = [
    'https://www.googleapis.com/auth/youtube',
    ]

REDIRECT_URIS = [
    "http://localhost:8080",
    "http://localhost:8000",
    "http://localhost:8000/oauth2callback",
    "http://127.0.0.1:8000/youtube_auth/oauth2callback/"
    ],
REDIRECT_URI = "https://cohesive.so/apps/localtesting/callback"


CLIENT_SECRETS_FILE = 'client_secret.json'

# cron jobs
CRONJOBS = [
    ('0 0 * * *', 'channels.cron.update_channel_analytics'),
    ('0 0 * * *', 'channels.cron.update_user_analytics'),
    ('*/1 * * * *', 'posts.cron.upload_posts'),
]


# AWS

AWS_ACCESS_KEY_ID = 'AKIAYPBZ3O4NHTXSWGOF'
AWS_SECRET_ACCESS_KEY = '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'
AWS_STORAGE_BUCKET_NAME = 'postminder'
AWS_S3_REGION_NAME = 'ap-south-1'
AWS_S3_CUSTOM_DOMAIN = '%s.s3.amazonaws.com' % AWS_STORAGE_BUCKET_NAME
AWS_S3_FILE_OVERWRITE = False
AWS_DEFAULT_ACL = None
AWS_S3_VERIFY = True
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
