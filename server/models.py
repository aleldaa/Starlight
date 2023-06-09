from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
import re
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import datetime

from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = ('-comments.user', '-sent_friend_requests', '-received_friend', '-friend_requests', '-received_friend_requests', '-posts.user', '-messages_sent.sender', '-messages_received.receiver', '-received_notifications', '-sent_notifications')

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String)
    name = db.Column(db.String)
    age = db.Column(db.Integer)
    profile_picture = db.Column(db.String)
    banner_picture = db.Column(db.String)
    bio = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    comments = db.relationship('Comment', backref='user')
    posts = db.relationship('Post', backref='user')
    messages_sent = db.relationship('Message', backref='sender', foreign_keys='Message.sender_id')
    messages_received = db.relationship('Message', backref='receiver', foreign_keys='Message.receiver_id')
    interests = db.relationship('Interest', backref='user', lazy=True)
    received_notifications = db.relationship('Notification', back_populates='recipient', foreign_keys='Notification.recipient_id')
    sent_notifications = db.relationship('Notification', back_populates='sender', foreign_keys='Notification.sender_id')
    friends = db.relationship('Friend', backref='user_friend', foreign_keys='Friend.user_id')
    users = db.relationship('Friend', backref='user_user', foreign_keys='Friend.friend_id', viewonly=True)

    @validates('username')
    def validate_username(self, key, username):
        usernames = db.session.query(User.username).all()
        if not username:
            raise ValueError("Username required.")
        elif username in usernames:
            raise ValueError("Usernames must be unique.")
        return username
    
    @validates('email')
    def validate_email(self, key, email):
        emails = db.session.query(User.email).all()
        if not email:
            raise ValueError("Email address required.")
        elif '@' not in email:
            raise ValueError("Please enter a valid email address.")
        elif email in emails:
            raise ValueError("Email address must be unique.")
        return email
    
    @validates('password')
    def validate_password(self, key, password):
        if not (8 <= len(password) <= 16):
            raise ValueError("Password must be between 8 and 16 characters long.")
        elif not re.search(r'[A-Z]', password):
            raise ValueError("Password must contain at least one capital letter.")
        elif not re.search(r'\d', password):
            raise ValueError("Password must contain at least one numeric character")
        elif not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            raise ValueError("Password must contain at least one special character.")
        return password

    @hybrid_property
    def password_hash(self):
        raise Exception('password hashes may not be viewed')

    @password_hash.setter
    def password(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

class Post(db.Model, SerializerMixin):
    __tablename__ = 'posts'

    serialize_rules = ( '-comments.user', '-user.friends', '-user.interests', '-user.messages_received', '-user.messages_sent', '-user.posts', '-user.users')

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String)
    title = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

class Message(db.Model, SerializerMixin):
    __tablename__ = 'messages'

    serialize_rules = ('-sender', '-receiver')

    id = db.Column(db.Integer, primary_key=True)
    subject = db.Column(db.String)
    content = db.Column(db.String)
    status = db.Column(db.String)
    attachments = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    receiver_id = db.Column(db.Integer, db.ForeignKey('users.id'))

class Friend(db.Model, SerializerMixin):
    __tablename__ = 'friends'

    serialize_rules = ('-notification_id', '-user_user.users', '-user_friend.friends', '-user_user.friends', '-user_friend.users')

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    friend_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    status = db.Column(db.String, nullable=False)
    notification_id = db.relationship('Notification', back_populates="friend")

    # sender = db.relationship('User', foreign_keys=[friend_id], backref='sent_friend_requests')
    # recipient = db.relationship('User', backref='received_friend', foreign_keys=[user_id], viewonly=True)

    __table_args__ = (db.UniqueConstraint('user_id', 'friend_id'),)

class Interest(db.Model, SerializerMixin):
    __tablename__ = 'interests'

    serialize_rules = ('-user',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

class Comment(db.Model, SerializerMixin):
    __tablename__ = 'comments'

    serialize_rules = ('-post',  '-comment', '-user.posts', '-user.users')

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    
    post = db.relationship('Post', backref='comments')

    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

class Like(db.Model, SerializerMixin):
    __tablename__ = 'likes'

    serialize_rules = ('-user', '-post')

    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    status = db.Column(db.Boolean)

    song_id = db.Column(db.Integer, db.ForeignKey('songs.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)

class Song(db.Model, SerializerMixin):
    __tablename__ = 'songs'

    serialize_rules = ('-user',) 

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    artist = db.Column(db.String)
    album = db.Column(db.String)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

class Notification(db.Model, SerializerMixin):
    __tablename__ = 'notifications'

    serialize_rules = ('-friend', '-recipient.sent_notifications', '-sender.received_notifications')

    id = db.Column(db.Integer, primary_key=True)
    recipient_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    friendship_id = db.Column(db.Integer, db.ForeignKey('friends.id'))
    message = db.Column(db.String)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String, default='unread')

    recipient = db.relationship('User', foreign_keys=[recipient_id], back_populates='received_notifications')
    sender = db.relationship('User', foreign_keys=[sender_id], back_populates='sent_notifications')
    friend = db.relationship('Friend', foreign_keys=[friendship_id], back_populates='notification_id')