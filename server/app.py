#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import render_template, request, jsonify, make_response, session
from flask_restful import Resource, reqparse
from werkzeug.utils import secure_filename


# Local imports
from config import app, db, api, bcrypt
from models import User, Post, Message, Friend, Notification, Comment
# Views go here!

class Users(Resource):
    
    def get(self):
        users = [user.to_dict() for user in User.query.all()]
        return make_response(jsonify(users), 200)
    
    def post(self):

        new_user = User(
            username=request.get_json()['username'],
            password=request.get_json()['password'],
            name=request.get_json()['name'],
            email=request.get_json()['email'],
            profile_picture=request.get_json()['profile_picture'],
            banner_picture=request.get_json()['banner_picture'],
            bio=request.get_json()['bio']
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
        print(user)
        for attr in request.get_json():
            print(attr)
            setattr(user, attr, request.get_json()[attr])

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
            banner_picture=request.get_json()['banner_picture'],
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

class Comments(Resource):
    def get(self):
        comments = [comment.to_dict() for comment in Comment.query.all()]
        return make_response(jsonify(comments), 200)

    def post(self):
        data = request.get_json()
        new_comment = Comment(
            content=data['content'],
            post_id=data['post_id'],
            user_id=data['user_id'],
        )
        db.session.add(new_comment)
        db.session.commit()

        return make_response(jsonify(new_comment.to_dict()), 201)

class CommentsById(Resource):
    def delete(self, id):
        comment = Comment.query.filter_by(id=id).first()
        if comment == None:
            return({'error': '404: Not Found.'})
        db.session.delete(comment)
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

class FriendsById(Resource):
    def get(self, id):
        try:
            friend = Friend.query.filter_by(id=id).first()
            return make_response(jsonify(friend.to_dict()), 200)
        except:
            return make_response({'error': 'Friend not found.'})

    def patch(self, id):
        friend = Friend.query.filter(Friend.id == id).first()
        print(friend)
        if not friend:
            return jsonify({'error': 'Friend not found'}), 404

        friend.status = 'accepted'
        db.session.commit()
        
        return make_response(jsonify({
            'message': 'Friend accepted',
            'friend': {
                'id': friend.id,
                'status': friend.status,
            }
        }), 200)
        # response.status_code = 200

        # return response

class FriendsByUsername(Resource):
    def get(self, username):
        try:
            friends = Friend.query.filter_by(username=username).first()
            return make_response(jsonify(friends.to_dict()), 200)
            
        except:
            return make_response({'error': 'Friend not found'})

class FriendRequest(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('sender_id', type=int, required=True)
        parser.add_argument('recipient_id', type=int, required=True)
        args = parser.parse_args()

        sender = User.query.get(args['sender_id'])
        recipient = User.query.get(args['recipient_id'])

        if not sender or not recipient:
            return make_response({'error': 'Invalid sender or recipient ID'}, 400)

        if sender == recipient:
            return make_response({'error': 'Cannot send friend request to yourself'}, 400)

        existing_request = Friend.query.filter_by(user_id=args['sender_id'], friend_id=args['recipient_id']).first()
        if existing_request:
            return make_response({'error': 'Friend request already exists'}, 400)

        friend_request = Friend(user_id=args['sender_id'], friend_id=args['recipient_id'], status='Pending')
        db.session.add(friend_request)
        db.session.commit()

        notification = Notification(
            recipient_id=args['recipient_id'],
            sender_id=args['sender_id'],
            message="You have received a friend request.",
            friendship_id=friend_request.id
        )
        db.session.add(notification)
        db.session.commit()

        return make_response({'message': 'Friend request sent successfully'}, 201)

    def put(self, friend_request_id):
        data = request.get_json()
        friend_request = FriendRequest.query.get(friend_request_id)
        if not friend_request:
            return {'error': 'Friend request not found'}, 404

        action = data.get('action')
        if action == 'accept':
            friend_request.status = 'Accepted'
            user = User.query.get(friend_request.recipient_id)
            friend = User.query.get(friend_request.sender_id)
            user.friends.append(friend)
            friend.friends.append(user)

            db.session.commit()
            return {'message': 'Friend request accepted'}, 200
        elif action == 'reject':
            friend_request.status = 'Rejected'
            db.session.commit()
            return {'message': 'Friend request rejected'}, 200
        else:
            return {'error': 'Invalid action'}, 400

    def get(self, user_id):
        friend_requests = FriendRequest.query.filter_by(recipient_id=user_id, status='Pending').all()
        request_list = [{'id': request.id, 'sender_id': request.sender_id, 'sender_name': request.sender.name} for request in friend_requests]
        return make_response(jsonify(request_list), 200)

class Notifications(Resource):
    def get(self, id):
        try:
            notifications = Notification.query.filter_by(recipient_id=id).all()
            notification_list = [notification.to_dict() for notification in notifications]
            return make_response(jsonify(notification_list), 200)
        except:
            return make_response({'error': 'Notifications not found.'})

    def delete(self, id):
        notification = Notification.query.filter_by(id=id).first()
        if notification == None:
            return({'error': '404: Not Found.'})
        db.session.delete(notification)
        db.session.commit()
        return make_response('', 204)

class SignUp(Resource):
    def post(self):
        data = request.get_json()
        name=request.get_json()['name']
        username=data['username']
        password=data['password']
        email=data['email']

        if username and password:
            new_user = User(
                name=name,
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

api.add_resource(FriendRequest, '/friend-request')
api.add_resource(Notifications, '/notifications/<int:id>')
api.add_resource(Users, '/users')
api.add_resource(UsersById, '/users/<int:id>')
api.add_resource(Posts, '/posts')
api.add_resource(PostsById, '/posts/<int:id>')
api.add_resource(Comments, '/comments')
api.add_resource(CommentsById, '/comments/<int:id>')
api.add_resource(Messages, '/messages')
api.add_resource(MessagesById, '/messages/<int:id>')
api.add_resource(Friends, '/friends')
api.add_resource(FriendsById, '/friends/<int:id>')
api.add_resource(FriendsByUsername, '/friends/<string:username>')
api.add_resource(SignUp, '/signup')
api.add_resource(Login, '/login')
api.add_resource(CheckSession, '/check_session')
api.add_resource(Logout, '/logout')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

