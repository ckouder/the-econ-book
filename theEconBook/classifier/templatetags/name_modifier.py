from django import template
import re

register = template.Library()

@register.filter
def rep(value):
    return value.replace('-', ' ')

