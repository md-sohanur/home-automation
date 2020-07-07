import os
import secrets
from flask import render_template, url_for, flash, redirect, request
from home_control import app,  db, bcrypt
from home_control.forms import RegistrationForm, LoginForm
from home_control.models import  User
from flask_login import login_user, current_user, logout_user, login_required

switch = [0 , 0 , 0]
flag = False

@app.route("/")
@app.route("/control_center")
@login_required
def control_center():
    global switch
    img_file = url_for('static', filename = 'profile_pics/' + current_user.image_file)
    return render_template('control_center.html', title='Control Center', user=current_user, image_file=img_file,switch = switch)    

@app.route("/control")
def control():
    global switch
    switch_value = request.args.get('id') 
    switch[int(switch_value[0])] = int(switch_value[1])
    global flag
    flag = True
    return redirect(url_for('control_center'))

@app.route("/sw_code")
def sw_code():
    global flag
    if flag == True:
        flag = False
        return ','+str(switch[0])+str(switch[1])+str(switch[2])
    else:
        return str(int(flag))
    
@app.route("/add_user", methods=['GET', 'POST'])
@login_required
def add_user():
    if current_user.username == 'admin':
        form = RegistrationForm()
        if form.validate_on_submit():
            if form.picture.data:
                picture_file = save_picture(form.picture.data)
            else:
                picture_file = 'default.jpg'
                
            hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
            user = User(username=form.username.data,name=form.name.data, image_file=picture_file, password=hashed_password)
            db.session.add(user)
            db.session.commit()
            flash('New account has been created! Enabled to log in', 'success')
            return redirect(url_for('user_login'))
        return render_template('add_user.html', title='Register', form=form, user = current_user)
    else:
        return "<h1>Request Rejected !!!</h1><h2>Admin Login Required</h2>"
    
def save_picture(form_picture):
    random_hex = secrets.token_hex(8)
    _, f_ext = os.path.splitext(form_picture.filename)
    picture_fn = random_hex + f_ext
    picture_path = os.path.join(app.root_path, 'static/profile_pics', picture_fn)
    form_picture.save(picture_path)

    return picture_fn

@app.route("/user_login", methods=['GET', 'POST'])
def user_login():
    if current_user.is_authenticated:
        return redirect(url_for('control_center'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user and bcrypt.check_password_hash(user.password, form.password.data):
            login_user(user, remember=form.remember.data)
            return redirect(url_for('control_center'))
        else:
            flash('Login Unsuccessful! Please check Meter ID and password', 'danger')
    return render_template('user_login.html', title='Login', form=form)

@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for('user_login'))
