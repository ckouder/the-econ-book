from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, get_object_or_404
#from django.utils.safestring import SafeString
from .models import Concept
import json, random

# Create your views here
def specificConcept(request, name):
    concept = get_object_or_404(Concept, concept_name=name)

    return editpage(request, concept)

def initialize(request):
    concept = Concept.objects.filter(statistics__selected=True)
    count = concept.count()
    num = random.randint(0, count)
    concept = concept[num-1]

    return editpage(request, concept)

def editpage(request, concept):
    return render(request, 'classifier/edit.html', {
        'name': concept.concept_name,
        'description': concept.concept_description,
        'relations': concept.relations,
    })

def jsonres(concept):
    return JsonResponse({
        'name': concept.concept_name,
        'description': concept.concept_description,
        'relations': concept.relations,
    })