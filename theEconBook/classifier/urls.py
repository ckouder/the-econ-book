from django.urls import path
from . import views

urlpatterns = [
    path('edit/<name>', views.specificConcept, name='edit'),
    path('edit',views.initialize),
]