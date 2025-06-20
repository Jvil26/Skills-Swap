# Generated by Django 5.2.3 on 2025-06-19 02:43

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("skills", "0004_alter_userskill_unique_together_and_more"),
        ("users", "0004_remove_user_password"),
    ]

    operations = [
        migrations.CreateModel(
            name="UserSkill",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "skill_type",
                    models.CharField(
                        choices=[("Offered", "offered"), ("Wanted", "wanted")],
                        max_length=10,
                    ),
                ),
                (
                    "proficiency",
                    models.CharField(
                        blank=True,
                        choices=[("pro", "Pro"), ("noob", "Noob")],
                        max_length=10,
                        null=True,
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("last_updated", models.DateTimeField(auto_now=True)),
                (
                    "skill",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="user_skill_entries",
                        to="skills.skill",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="user_skills",
                        to="users.user",
                    ),
                ),
            ],
            options={
                "unique_together": {("user", "skill", "skill_type")},
            },
        ),
    ]
