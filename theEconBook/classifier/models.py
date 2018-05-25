import datetime
import random

from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField


# Create your models here.

class Concept(models.Model):
    def __str__(self):
        return self.concept_name

    concept_name = models.CharField(max_length=200, unique=True)
    concept_description = models.TextField(max_length=1000)
    relations = JSONField()
    statistics = JSONField()