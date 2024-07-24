from django.urls import path
from . import views
from .views import (
    intensity_values, likelihood_values, relevance_values, year_values, 
    country_values, topic_values, region_values,)

urlpatterns = [
    path('', views.filter_data, name='filter_data'),
     path('intensity-values/', intensity_values, name='intensity-values'),
    path('likelihood-values/', likelihood_values, name='likelihood-values'),
    path('relevance-values/', relevance_values, name='relevance-values'),
    path('year-values/', year_values, name='year-values'),
    path('country-values/', country_values, name='country-values'),
    path('topic-values/', topic_values, name='topic-values'),
    path('region-values/', region_values, name='region-values'),
]