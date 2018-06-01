from django.db import models


# Create your models here.


class Statistics(models.Model):
    n = models.IntegerField(default=0)
    sum_x_square = models.FloatField(default=0)
    sum_x = models.FloatField(default=0)
    var_x = models.FloatField(default=0)
    selected = models.BooleanField(default=True)
    

class Relations(models.Model):
    role_government = models.FloatField(default=0)
    role_company = models.FloatField(default=0)
    role_household = models.FloatField(default=0)
    role_central_bank = models.FloatField(default=0)
    action_production = models.FloatField(default=0)
    action_distribution = models.FloatField(default=0)
    action_consumption = models.FloatField(default=0)


class Concept(models.Model):
    def __str__(self):
        return self.concept_name

    concept_name = models.CharField(max_length=200, unique=True)
    concept_description = models.TextField(max_length=1000)
    relations = models.OneToOneField(Relations, on_delete=models.CASCADE)
    statistics = models.OneToOneField(Statistics, on_delete=models.CASCADE)
