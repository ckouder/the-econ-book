# Generated by Django 2.0.5 on 2018-05-11 13:30

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Concept',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('concept_name', models.CharField(max_length=200, unique=True)),
                ('concept_description', models.TextField(max_length=1000)),
                ('relations', django.contrib.postgres.fields.jsonb.JSONField()),
                ('statistics', django.contrib.postgres.fields.jsonb.JSONField()),
            ],
        ),
    ]
