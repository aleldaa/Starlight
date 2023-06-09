from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
import re
from sqlalchemy.ext.hybrid import hybrid_property

from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    # serialize_only = ('username', 'friends.user_friend')
    serialize_rules = ('-posts.user', '-messages_sent.sender', '-messages_recieved.reciever', '-friends.user_friend', '-users.user_user', '-friends.user_user', '-users.user_friend')

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String)
    profile_picture = db.Column(db.String)
    bio = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    posts = db.relationship('Post', backref='user')
    messages_sent = db.relationship('Message', backref='sender', foreign_keys='Message.sender_id')
    messages_received = db.relationship('Message', backref='reciever', foreign_keys='Message.receiver_id')
    friends = db.relationship('Friend', backref='user_friend', foreign_keys='Friend.friend_id')
    users = db.relationship('Friend', backref='user_user', foreign_keys='Friend.user_id')

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

    serialize_rules = ('-user.posts',)

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String, nullable=True)
    content = db.Column(db.String)
    title = db.Column(db.String)
    comments = db.Column(db.String, nullable=True)
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

    serialize_rules = ('-user_user.users', '-user_friend.friends' '-user_user.friends', '-user_friend.users')

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    friend_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    # user = db.relationship('User', foreign_keys=[user_id])
    # friend = db.relationship('User', foreign_keys=[friend_id])

    __table_args__ = (db.UniqueConstraint('user_id', 'friend_id'),)

    @validates('user_id')
    def validate_user_id(self, key, user_id):
        user = User.query.get(user_id)
        if not user:
            raise ValueError("Invalid user_id. User does not exist.")
        return user_id
    
    @validates('friend_id')
    def validate_friend_id(self, key, friend_id):
        friend = User.query.filter_by(id=friend_id).first()
        if not friend:
            raise ValueError("Invalid friend_id. User does not exist.")
        return friend_id