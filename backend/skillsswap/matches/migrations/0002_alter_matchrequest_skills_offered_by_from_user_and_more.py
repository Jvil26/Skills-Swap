# Generated by Django 5.2.3 on 2025-06-18 22:43

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("matches", "0001_initial"),
        ("skills", "0002_remove_skill_created_at_remove_skill_proficiency_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="matchrequest",
            name="skills_offered_by_from_user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="offer_matches",
                to="skills.userskill",
            ),
        ),
        migrations.AlterField(
            model_name="matchrequest",
            name="skills_offered_by_to_user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="want_matches",
                to="skills.userskill",
            ),
        ),
    ]
