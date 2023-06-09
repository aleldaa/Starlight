#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, jsonify, make_response, session
from flask_restful import Resource

# Local imports
from config import app, db, api, bcrypt
from models import User, Post, Message, Friend
# Views go here!

# Lauren unable to pull for some reason
class Users(Resource):
    
    def get(self):
        users = [user.to_dict() for user in User.query.all()]
        return make_response(jsonify(users), 200)
    
    def post(self):

        new_user = User(
            username=request.form['username'],
            password=request.form['password'],
            email=request.form['email'],
            profile_picture=request.form['profile_picture'],
            bio=request.form['bio']
        )

        db.session.add(new_user)
        db.session.commit()

        user_dict = new_user.to_dict()

        response = make_response(
            user_dict,
            201
        )

        return response

# GET & PATCH working for Lauren; not POST
class UsersById(Resource):

    def get(self, id):
         
        user_dict = User.query.filter_by(id=id).first().to_dict()

        response = make_response(
            user_dict,
            200
        )
        return response

    def patch(self, id):

        user = User.query.filter_by(id=id).first()
        for attr in request.form:
            setattr(user, attr, request.form[attr])

        db.session.add(user)
        db.session.commit()

        response_dict = user.to_dict()

        response = make_response(
            response_dict,
            200
        )

        return response
        
    def post(self):
        data = request.get_json()

        new_user = User(
            id = data['id'],
            username=data['username'],
            password=data['password'],
            email=data['email'],
            profile_picture=data['profile_picture'],
            bio=data['bio']
        )

        db.session.add(new_user)
        db.session.commit()

        return make_response(jsonify(new_user.to_dict()), 201)
    
    def delete(self, id):

        user = User.query.filter_by(id=id).first()

        db.session.delete(user)
        db.session.commit()

        response_dict = {"message": "record successfully deleted"}

        response = make_response(
            response_dict,
            200
        )

        return response

class Posts(Resource):
    def get(self):
        posts = [post.to_dict() for post in Post.query.all()]
        return make_response(jsonify(posts), 200)

    def post(self):
        data = request.get_json()
        print(data)
        new_post = Post(
            content=data['content'],
            title=data['title'],
            user_id=data['user_id']
        )
        db.session.add(new_post)
        db.session.commit()
        return make_response(jsonify(new_post.to_dict()), 201)

class PostsById(Resource):
    def get(self, id):
        try:
            post = Post.query.filter_by(id=id).first()
            return make_response(jsonify(post.to_dict()), 200)
        except:
            return make_response({'error': 'Post not found.'})

    def patch(self, id):
        data = request.get_json()
        post = Post.query.filter_by(id=id).first()
        for attr in data:
            setattr(post, attr, data[attr])
        db.session.add(post)
        db.session.commit()
        return make_response(jsonify(post.to_dict()), 202)

    def delete(self, id):
        post = Post.query.filter_by(id=id).first()
        if post == None:
            return({'error': '404: Not Found.'})
        db.session.delete(post)
        db.session.commit()
        return make_response('', 204)

class Messages(Resource):
    def get(self):
        messages = [message.to_dict() for message in Message.query.all()]
        return make_response(jsonify(messages), 200)

    def post(self):
        data = request.get_json()
        new_message = Message(
            subject=data['subject'],
            content=data['content'],
            sender_id=data['sender_id'],
            receiver_id=data['receiver_id'],
        )
        db.session.add(new_message)
        db.session.commit()
        return make_response(jsonify(new_message.to_dict()), 201)

class MessagesById(Resource):
    def get(self, id):
        try:
            message = Message.query.filter_by(id=id).first()
            return make_response(jsonify(message.to_dict()), 200)
        except:
            return make_response({'error': 'Message not found.'})

    def patch(self, id):
        data = request.get_json()
        message = Message.query.filter_by(id=id).first()
        for attr in data:
            setattr(message, attr, data[attr])
        db.session.add(message)
        db.session.commit()
        return make_response(jsonify(message.to_dict()), 202)

    def delete(self, id):
        message = Message.query.filter_by(id=id).first()
        if message == None:
            return({'error': '404: Not Found.'})
        db.session.delete(message)
        db.session.commit()
        return make_response('', 204)

class Friends(Resource):
    def get(self):
        friends = [friend.to_dict() for friend in Friend.query.all()]
        return make_response(jsonify(friends), 200)

class FriendsByUsername(Resource):
    def get(self, username):
        try:
            friends = Friend.query.filter_by(username=username).first()
            return make_response(jsonify(friends.to_dict()), 200)
        except:
            return make_response({'error': 'Friend not found'})

class SignUp(Resource):
    def post(self):
        data = request.get_json()
        username=data['username']
        password=data['password']
        email=data['email']

        if username and password:
            new_user = User(
                username=username,
                email=email,
            )
            new_user.password = password
            db.session.add(new_user)
            db.session.commit()

            session['user_id'] = new_user.id
            return new_user.to_dict(), 201

        return {'error': '422 Unprocessable Entity'}, 422


class Login(Resource):
    def post(self):
        data = request.get_json()

        username = data['username']
        password = data['password']
        
        user = User.query.filter_by(username=username).first()
        if user and user.authenticate(password):
            session['user_id'] = user.id
            return make_response(user.to_dict(), 200)
        else:
            return make_response("Invalid credentials", 401)

class CheckSession(Resource):
    def get(self):
        if session.get('user_id'):
            user = User.query.filter(User.id == session['user_id']).first()
            return user.to_dict(), 200
        return None, 404

class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        return {'message': '204: No Content'}, 204

api.add_resource(Users, '/users')
api.add_resource(UsersById, '/users/<int:id>')
api.add_resource(Posts, '/posts')
api.add_resource(PostsById, '/posts/<int:id>')
api.add_resource(Messages, '/messages')
api.add_resource(MessagesById, '/messages/<int:id>')
api.add_resource(Friends, '/friends')
api.add_resource(FriendsByUsername, '/friends/<string:username>')
api.add_resource(SignUp, '/signup')
api.add_resource(Login, '/login')
api.add_resource(CheckSession, '/check_session')
api.add_resource(Logout, '/logout')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

