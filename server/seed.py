#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Post, Message, Friend

def seed_data():
    users = []
    for _ in range(5):
        user = User(
            username=fake.user_name(),
            email=fake.email(),
            profile_picture=fake.image_url(),
            bio=fake.text()
        )
        users.append(user)
        db.session.add(user)

    for _ in range(10):
        post = Post(
            type=fake.random_element(elements=('text', 'image')),
            content=fake.text(),
            title=fake.catch_phrase(),
            comments=fake.text(),
            user=fake.random_element(elements=users)
        )
        db.session.add(post)
        message = Message(
            subject=fake.catch_phrase(),
            content=fake.text(),
            attachments=fake.image_url()
        )
        db.session.add(message)
    db.session.commit()

    for user in users:
        print('hello')
        friend = fake.random_element(elements=users)
        while friend == user:
            friend = fake.random_element(elements=users)
        friend1 = Friend(user_id=user.id, friend_id=friend.id)
        friend2 = Friend(user_id=friend.id, friend_id=user.id)
        db.session.add(friend1)
        db.session.add(friend2)
    db.session.commit()
    
if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!
        User.query.delete()
        Post.query.delete()
        Message.query.delete()
        Friend.query.delete()
        seed_data()

        print('Data seeded successfully.')
