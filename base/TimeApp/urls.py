from django.urls import re_path, path
from TimeApp.views import ItemAPI, LotAPI
from TimeApp.views import ItemDetailAPI
from TimeApp.views import LotItemAPI

urlpatterns = [
    re_path(r'^item$', ItemAPI.as_view()),
    re_path(r'^item/([0-9]+)$', ItemDetailAPI.as_view()),
    re_path(r'^lot$', LotAPI.as_view()),
    path('lotitem/<int:item>', LotItemAPI.as_view()),
]
