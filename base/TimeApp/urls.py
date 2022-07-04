from django.urls import re_path, path
from TimeApp.views import ItemAPI
from TimeApp.views import ItemDetailAPI

urlpatterns = [
    re_path(r'^item$', ItemAPI.as_view()),
    re_path(r'^item/([0-9]+)$', ItemDetailAPI.as_view()),
]
