from faker import Faker
from random import randint, choice
from datetime import datetime, timedelta

from config import app, db
from models import User, Post, Message, Friend, Interest, Comment, Like, Notification

fake = Faker()

def generate_user():
    user = User(
        username=fake.user_name(),
        email=fake.email(),
        name=fake.name(),
        age=randint(18, 65),
        profile_picture=fake.image_url(),
        banner_picture=fake.image_url(),
        bio=fake.text(),
    )
    user.password = fake.password()
    return user

def generate_notification(sender, recipient):
    notification = Notification(
        sender=sender,
        recipient=recipient,
        message="You have a new friend request.",
        timestamp=datetime.utcnow(),
        status='unread'
    )
    return notification

def generate_post(user):
    post = Post(
        content=fake.text(),
        title=fake.sentence(),
        user=user
    )
    return post

def generate_message(sender, receiver):
    message = Message(
        subject=fake.sentence(),
        content=fake.text(),
        status=choice(['unread', 'read']),
        sender=sender,
        receiver=receiver
    )
    return message

def generate_friend(user, friend):
    friend_status = choice(['pending', 'accepted', 'rejected'])
    friendship = Friend.query.filter_by(user_id=user.id, friend_id=friend.id).first()
    if not friendship:
        friendship = Friend(
            user_id=user.id,
            friend_id=friend.id,
            status=friend_status
        )
    return friendship

def generate_interest(user):
    interest = Interest(
        name=fake.word(),
        user=user
    )
    return interest

def generate_comment(user, post):
    comment = Comment(
        content=fake.text(),
        user_id=user.id,  # Use the 'user_id' attribute instead of 'user'
        post_id=post.id   # Use the 'post_id' attribute instead of 'post'
    )
    return comment

def generate_like(user, post):
    like = Like(
        user_id=user.id,  # Use the 'user_id' attribute instead of 'user'
        post_id=post.id   # Use the 'post_id' attribute instead of 'post'
    )
    return like

def generate_seed_data():
    db.create_all()

    users = []
    for _ in range(1):
        user = generate_user()
        users.append(user)

    db.session.add_all(users)
    db.session.commit()

    for user in users:
        for _ in range(1):
            post = generate_post(user)
            db.session.add(post)

    db.session.commit()

    for _ in range(10):
        sender = choice(users)
        receiver = choice(users)
        message = generate_message(sender, receiver)
        db.session.add(message)

    db.session.commit()

    for user in users:
        friend_count = randint(1, 3)
        for _ in range(friend_count):
            friend = choice(users)
            friendship = generate_friend(user, friend)
            db.session.add(friendship)

    db.session.commit()

    for user in users:
        for _ in range(1):
            interest = generate_interest(user)
            db.session.add(interest)

    db.session.commit()

    posts = Post.query.all()

    for user in users:
        for _ in range(1):
            post = choice(posts)
            comment = generate_comment(user, post)
            db.session.add(comment)

    db.session.commit()

    for user in users:
        for _ in range(1):
            post = choice(posts)
            like = generate_like(user, post)
            db.session.add(like)

    db.session.commit()

    for user in users:
        for _ in range(1):
            sender = choice(users)
            recipient = choice(users)
            notification = generate_notification(sender, recipient)
            db.session.add(notification)
    db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        print("Starting seed...")

        User.query.delete()
        Post.query.delete()
        Message.query.delete()
        Friend.query.delete()
        Interest.query.delete()
        Like.query.delete()
        Comment.query.delete()
        Notification.query.delete()

        generate_seed_data()

        print("Data seeded successfully.")