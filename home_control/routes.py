import os
import secrets
from flask import render_template, url_for, flash, redirect, request, jsonify
from home_control import app,  db, bcrypt
from home_control.forms import RegistrationForm, LoginForm
from home_control.models import  User
from flask_login import login_user, current_user, logout_user, login_required

@app.route("/")
@app.route("/control_center")
@login_required
def control_center():   
    #current_user.switch_status = '000000000000'
    #db.session.commit()
    return render_template('control_center.html', title='Control Center', user=current_user,switch = current_user.switch_status)    

@app.route("/update", methods=['POST'])
def update():
    user = User.query.filter_by(username=request.form['username']).first()    
    if user.switch_status[int(request.form['switch_id'])] == request.form['switch_status']:
        return jsonify({'update_commit' : 'already_done','switch_status' : user.switch_status[0]})

    elif user.update_commit == 'no':
        return jsonify({'update_commit' : 'wait'})
    
    elif user.update_commit == 'yes' and request.form['req_state']=='recheck':
        return jsonify({'update_commit' : 'complete','switch_status' : user.switch_status[0]})

    else:
        sw_temp = list(user.switch_status) 
        sw_temp[int(request.form['switch_id'])] = request.form['switch_status']
        user.switch_status = ''.join(sw_temp)
        user.update_commit = 'no' 
        db.session.commit()

        return jsonify({'update_commit' : 'done', 'switch_status' : user.switch_status[0]})

@app.route("/cs")
def control_switch():
    user = User.query.filter_by(username=request.args.get('un')).first()
    if request.args.get('rb') == '1':
            user.switch_status = '000000000000'
            db.session.commit()
            return ''
    elif request.args.get('rb') == '0' :
            return user.switch_status

    if user.update_commit == 'no':
        user.update_commit = 'yes'
        db.session.commit()
        return  user.switch_status
    else :
        return ''
    
    
@app.route("/add_user", methods=['GET', 'POST'])
def add_user():
    if 1==1:
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
