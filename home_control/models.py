import datetime
from home_control import db, login_manager
from flask_login import UserMixin

@login_manager.user_loader
def load_user(username):
    return User.query.get(username)

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), unique=False, nullable=False)
    username = db.Column(db.String(25), unique=True, nullable=False)
    image_file = db.Column(db.String(20), nullable=False, default='default.jpg')
    switch_status = db.Column(db.String(10),nullable=False, default='000')
    password = db.Column(db.String(60), nullable=False) 

    def __repr__(self):
        return f"User('{self.name}', '{self.username}', '{self.image_file}'"
   