from django.urls import re_path, path
from TimeApp.views import ItemAPI, LotAPI
from TimeApp.views import ItemDetailAPI
from TimeApp.views import LotItemAPI
from rest_framework_simplejwt.views import TokenRefreshView
from .views import FormulaAPI, FormulaDetailAPI, LotDetailAPI, MyTokenObtainPairView

urlpatterns = [
    re_path(r'^item$', ItemAPI.as_view()),
    re_path(r'^item/([0-9]+)$', ItemDetailAPI.as_view()),
    re_path(r'^lot$', LotAPI.as_view()),
    re_path(r'^lot/([0-9]+)$', LotDetailAPI.as_view()),
    re_path(r'^formula$', FormulaAPI.as_view()),
    re_path(r'^formula/([0-9]+)$', FormulaDetailAPI.as_view()),
    path('lotitem/<int:item>', LotItemAPI.as_view()),
    path('token/', MyTokenObtainPairView.as_view(), name="token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh")
]
