from flask import Flask, render_template, make_response, request, redirect
from flask_login import login_required, current_user, login_user, logout_user
import psycopg2
import snap7
from snap7.util import *
from loguru import logger

from datetime import datetime

from models import db, login, UserModel
from server_func import get_robots
from config import SECRET_KEY, PORT, SERV_IP, DB, CONNECT_DATA

plc_cam = snap7.client.Client()
plc_capture = snap7.client.Client()
plc_blowdown = snap7.client.Client()
plc_vacuum = snap7.client.Client()

logger.add('log/users.log', format='{time} {level} {message}', level='DEBUG')

app = Flask(__name__)
app.config['SECRET_KEY'] = SECRET_KEY
app.config['SQLALCHEMY_DATABASE_URI'] = DB
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

login.init_app(app)
login.login_view = 'login'


@app.before_first_request
def create_table():
    """Создание таблицы в бд если она не существует"""
    logger.info("Check table in DB.")
    db.create_all()


@app.route('/logout')
@login_required
def logout():
    """Выход пользователя из системы"""
    logger.info(f"User: {current_user.username} logout.")
    logout_user()
    return redirect('/')


@app.route('/', methods=['POST', 'GET'])
def login():
    """Авторизация"""
    if current_user.is_authenticated:
        return redirect('/main')
    if request.method == 'POST':
        user_login = request.form['login']
        password = request.form['password']
        user = UserModel.query.filter_by(login=user_login).first()
        if user is not None and user.check_password(password):
            logger.info(f"User: {user.username} login.")
            login_user(user)
            return redirect('/main')
    return render_template('login.html')


@app.route('/main', methods=('GET', 'POST'))
@login_required
def main():
    """Главная страница"""
    url = "/main"
    return render_template('main.html', url=url)


@app.route('/capture_control', methods=('GET', 'POST'))
@login_required
def capture_control():
    """Управление захватом"""
    spark_ip = {}
    try:
        spark_ip = get_robots()
    except Exception as err:
        logger.error(f"{type(err)}:\n{err}.")
    return render_template('capture_control.html', spark_ip=spark_ip)


@app.route('/material_transfer', methods=('GET', 'POST'))
@login_required
def material_transfer():
    """Управление захватом"""
    spark_ip = {}
    try:
        spark_ip = get_robots()
    except Exception as err:
        logger.error(f"{type(err)}:\n{err}.")
    return render_template('material_transfer.html', spark_ip=spark_ip)


@app.route('/machine_vision', methods=('GET', 'POST'))
@login_required
def machine_vision():
    """Техническое зрение"""
    spark_ip = {}
    try:
        spark_ip = get_robots()
    except Exception as err:
        logger.error(f"{type(err)}:\n{err}.")
    return render_template('machine_vision.html', spark_ip=spark_ip)


@app.route('/set_cam/<bit>/<ip>/<offset>/<name>', methods=('GET', 'POST'))
@login_required
def set_cam(bit, ip, offset, name):
    """вкл/выкл настройки камеры"""
    try:
        if bit == "1":
            plc_cam.connect(ip, 0, 1)
            data_write = bytearray(1)
            set_bool(data_write, 0, 6, True)
            plc_cam.db_write(601, 4 + 18 * int(offset), data_write)
            logger.info(f"User: {current_user.username} set on cam on robot {ip}: {name}.")
        elif bit == "0":
            data_write = bytearray(1)
            set_bool(data_write, 0, 6, False)
            plc_cam.db_write(601, 4 + 18 * int(offset), data_write)
            plc_cam.disconnect()
            logger.info(f"User: {current_user.username} set off cam on robot {ip}: {name}.")
    except Exception as err:
        logger.error(f"{type(err)}:\n{err}.")
    return make_response("OK", 200)


@app.route('/position/<ip>/<offset>/<name>', methods=('GET', 'POST'))
@login_required
def position(ip, offset, name):
    """Расположенеи камер"""
    y1 = int(request.form["cam_y1"])
    y2 = int(request.form["cam_y2"])
    x2 = int(request.form["cam_x2"])

    data_write = bytearray(2)
    set_int(data_write, 0, y1)
    set_int(data_write, 2, x2)
    set_int(data_write, 4, y2)

    plc_cam.db_write(39, 48 + 54 * int(offset), data_write)

    logger.info(f"User: {current_user.username} set position cam on robot {ip}: {name} "
                f"[y1: {y1}, y2: {y2}, x2: {x2}].")
    return make_response("OK", 200)


@app.route('/dpi/<ip>/<offset>/<name>', methods=('GET', 'POST'))
@login_required
def dpi(ip, offset, name):
    """DPI"""
    y1 = int(request.form["dpi_y1"])
    y2 = int(request.form["dpi_y2"])
    x2 = int(request.form["dpi_x2"])
    logger.info(f"User: {current_user.username} set DPI cam on robot {ip}: {name} "
                f"[y1: {y1}, y2: {y2}, x2: {x2}].")
    return make_response("OK", 200)


@app.route('/vacuum/<bit>/<ip>/<offset>/<name>/<click>', methods=('GET', 'POST'))
@login_required
def vacuum(bit, ip, offset, name, click):
    """Vacuum"""
    status = "on" if bit == "1" else "off"
    val = True if click == "1" else False
    if click == "1":
        logger.info(f"User: {current_user.username} {status} Vacuum on robot {ip}: {name}.")
    if bit == "1":
        try:
            if plc_vacuum.get_connected():
                plc_vacuum.disconnect()
            plc_vacuum.connect(ip, 0, 1)
            data_write = bytearray(1)
            set_bool(data_write, 0, 1, val)
            plc_vacuum.db_write(601, 1 + 18 * int(offset), data_write)
            plc_vacuum.disconnect()
        except Exception as err:
            logger.error(f"{type(err)}:\n{err}.")
            if plc_vacuum.get_connected():
                plc_vacuum.disconnect()
    elif bit == "0":
        try:
            if plc_vacuum.get_connected():
                plc_vacuum.disconnect()
            plc_vacuum.connect(ip, 0, 1)
            data_write = bytearray(1)
            set_bool(data_write, 0, 2, val)
            plc_vacuum.db_write(601, 1 + 18 * int(offset), data_write)
            plc_vacuum.disconnect()
        except Exception as err:
            logger.error(f"{type(err)}:\n{err}.")
            if plc_vacuum.get_connected():
                plc_vacuum.disconnect()
    return make_response("OK", 200)


@app.route('/blowdown/<bit>/<ip>/<offset>/<name>/<click>', methods=('GET', 'POST'))
@login_required
def blowdown(bit, ip, offset, name, click):
    status = "on" if bit == "1" else "off"
    val = True if click == "1" else False
    if click == "1":
        logger.info(f"User: {current_user.username} {status} blowdown on robot {ip}: {name}.")
    if bit == "1":
        try:
            if plc_blowdown.get_connected():
                plc_blowdown.disconnect()
            plc_blowdown.connect(ip, 0, 1)
            data_write = bytearray(1)
            set_bool(data_write, 0, 7, val)
            plc_blowdown.db_write(601, 1 + 18 * int(offset), data_write)
            plc_blowdown.disconnect()
        except Exception as err:
            logger.error(f"{type(err)}:\n{err}.")
            if plc_blowdown.get_connected():
                plc_blowdown.disconnect()
    elif bit == "0":
        try:
            if plc_blowdown.get_connected():
                plc_blowdown.disconnect()
            plc_blowdown.connect(ip, 0, 1)
            data_write = bytearray(1)
            set_bool(data_write, 0, 0, val)
            plc_blowdown.db_write(601, 2 + 18 * int(offset), data_write)
            plc_blowdown.disconnect()
        except Exception as err:
            logger.error(f"{type(err)}:\n{err}.")
            if plc_blowdown.get_connected():
                plc_blowdown.disconnect()
    return make_response("OK", 200)


@app.route('/wings/<bit>/<ip>/<offset>/<name>/<click>', methods=('GET', 'POST'))
@login_required
def wings(bit, ip, offset, name, click):
    print(bit, ip, offset, name, click)
    event = True if click == "1" else False
    print(event)
    try:
        if plc_capture.get_connected():
            plc_capture.disconnect()
        plc_capture.connect(ip, 0, 1)
        data_write = bytearray(1)
        set_bool(data_write, 0, int(bit), event)
        plc_capture.db_write(601, 18 * int(offset), data_write)
        plc_capture.disconnect()
    except Exception as err:
        logger.error(f"{type(err)}:\n{err}.")
        if plc_capture.get_connected():
            plc_capture.disconnect()
    return make_response("OK", 200)


@app.route('/material_transfer_bd/<ip>/<offset>/<name>/<post_from>/<post_to>', methods=('GET', 'POST'))
@login_required
def material_transfer_bd(ip, offset, name, post_from, post_to):
    """Переложить материал"""
    try:
        cnt = int(request.form["cnt"])
        depth = int(request.form["depth"])
        coating = request.form.get("coating", 0)
        task = f"web_task_{str(datetime.now())}"
    except Exception as err:
        logger.error(f"{type(err)}:\n{err}.")
    else:
        try:
            connect = psycopg2.connect(**CONNECT_DATA)
            cursor = connect.cursor()
            query = f"INSERT INTO tasks (task, i, status, stage, dcreate, device, zone_out, zone_in, qty, cover, depth)" \
                    f" VALUES ('{task}', 1, 0, 0, current_timestamp, " \
                    f"'{name}', {post_from}, {post_to}, {cnt}, {coating}, {depth});"
            cursor.execute(query)
            connect.commit()
            connect.close()
            cursor.close()
            logger.info(f"User: {current_user.username} execute query: {query}.")
        except Exception as err:
            logger.error(f"{type(err)}:\n{err}.")
    return make_response("OK", 200)


@app.route('/save_position/<ip>/<offset>/<name>/<click>', methods=('GET', 'POST'))
@login_required
def save_position(ip, offset, name, click):
    # print(ip, offset, name, click)
    bit = True if click == "1" else False
    # print(bit)
    data_write = bytearray(1)
    set_bool(data_write, 0, 7, bit)
    plc_cam.db_write(601, 4 + 18 * int(offset), data_write)
    if bit:
        logger.info(f"User: {current_user.username} save_position.")
    return make_response("OK", 200)


@app.after_request
def add_header(r):
    """что бы избавиться от кеширования"""
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Cache-Control'] = 'public, max-age=0'
    return r


if __name__ == "__main__":
    print(SERV_IP)
    app.run(port=PORT, host=SERV_IP)
