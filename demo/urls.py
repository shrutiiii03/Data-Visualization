# demo/urls.py
from django.contrib import admin
from django.urls import path, include
from visualizer.views import dashboard, filter_data  
urlpatterns = [
    path('admin/', admin.site.urls),
    path('visualizer/', include('visualizer.urls')),
    path('', dashboard, name='dashboard'),  
    path('dashboard/', filter_data, name='filter_data'), 
]