import os,django
import json
import re
from django.db.utils import IntegrityError

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "theEconBook.settings")
django.setup()

from classifier.models import Concept, Relations, Statistics

source_path = '../data/microeconomics.json'

with open(source_path) as source:
    content = json.load(source)
    for concept in content:
        name = str(concept[0]).lower().replace(r' ', '-')
        description = concept[1]

        print(name)

        try:
            c = Concept.objects.get_or_create(\
                concept_name = name,
                concept_description = description,
                relations = Relations.objects.create(\
                    role_government = 0,
                    role_company = 0,
                    role_household = 0,
                    role_central_bank = 0,
                    action_production = 0,
                    action_distribution = 0,
                    action_consumption = 0,
                ),
                statistics = Statistics.objects.create(\
                    n = 0,
                    sum_x_square = 0,
                    sum_x = 0,
                    var_x = 0,
                    selected = True,
                ),
            )
        except IntegrityError:
            c = None

    print("Done!")
