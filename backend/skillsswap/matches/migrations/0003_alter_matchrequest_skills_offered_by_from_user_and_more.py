# Generated by Django 5.2.3 on 2025-06-19 02:43

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("matches", "0002_alter_matchrequest_skills_offered_by_from_user_and_more"),
        ("users", "0005_userskill"),
    ]

    operations = [
        migrations.AlterField(
            model_name="matchrequest",
            name="skills_offered_by_from_user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="offer_matches",
                to="users.userskill",
            ),
        ),
        migrations.AlterField(
            model_name="matchrequest",
            name="skills_offered_by_to_user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="want_matches",
                to="users.userskill",
            ),
        ),
    ]
