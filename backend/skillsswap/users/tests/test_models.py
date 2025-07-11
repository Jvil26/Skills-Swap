from django.test import TestCase, override_settings
from django.conf import settings
from django.db.models import Prefetch
from django.core.files.uploadedfile import SimpleUploadedFile

from users_old.models import User, UserProfile, UserSkill
from skills.models import Skill

import os

# Create your tests here.

USERNAME = 'jusin'
NAME = 'Justin Sin'
EMAIL = 'justinsinsin25@gmail.com'
PHONE = '0123456789'
BIO = 'I am a pro piano player.'
GENDER = 'male'
PROFICIENCY = 'Advanced'
TEST_IMAGE_PATH = os.path.join(os.path.dirname(__file__), 'test_image.jpg')

@override_settings(DEFAULT_FILE_STORAGE='django.core.files.storage.FileSystemStorage')
class UsersTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create(username=USERNAME, name=NAME, email=EMAIL)
        self.piano_skill = Skill.objects.create(name="Piano")
        self.programming_skill = Skill.objects.create(name="Programming")
        self.piano_user_skill = UserSkill.objects.create(skill=self.piano_skill, user=self.user, proficiency=PROFICIENCY)
        self.programming_user_skill = UserSkill.objects.create(skill=self.programming_skill, user=self.user, proficiency=PROFICIENCY)
        with open(TEST_IMAGE_PATH, 'rb') as f:
            TEST_IMAGE = SimpleUploadedFile('test_image.jpg', f.read(), content_type='image/jpeg')
            self.user_profile = UserProfile.objects.create(user=self.user, bio=BIO, profile_pic=TEST_IMAGE, phone=PHONE, gender=GENDER)
    
    def test_user_creation(self):
        user = User.objects.get(username=USERNAME)
        self.assertEqual(user.username, USERNAME)
        self.assertEqual(user.name, NAME)
        self.assertEqual(user.email, EMAIL)
    
    def test_user_profile_creation(self):
        user_profile = UserProfile.objects.get(user=self.user)
        self.assertEqual(user_profile.user, self.user)
        self.assertEqual(user_profile.bio, BIO)
        self.assertTrue(user_profile.profile_pic.name.split('/')[-1].startswith('test_image'))
        self.assertEqual(user_profile.phone, PHONE)
        self.assertEqual(user_profile.gender, GENDER)


    def test_user_skill_creation(self):
        self.assertEqual(self.piano_user_skill.user, self.user)
        self.assertEqual(self.piano_user_skill.skill, self.piano_skill)
        self.assertEqual(self.piano_user_skill.proficiency, PROFICIENCY)

        self.assertEqual(self.programming_user_skill.user, self.user)
        self.assertEqual(self.programming_user_skill.skill, self.programming_skill)
        self.assertEqual(self.programming_user_skill.proficiency, PROFICIENCY)
    
    def test_user_has_skill(self):
        users = User.objects.prefetch_related(
            Prefetch('user_skills', queryset=UserSkill.objects.select_related('skill'))
        )
        self.assertEqual(users.count(), 1)
        expected_skill_names = ['Piano', 'Programming']
        user_skills = users[0].user_skills.all()
        skill_names = [us.skill.name for us in user_skills]
        self.assertEqual(skill_names, expected_skill_names)