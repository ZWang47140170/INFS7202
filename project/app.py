from flask import Flask, render_template, request, redirect, url_for, session, jsonify, abort, flash
import pymysql.cursors
from flask_session import Session
from datetime import datetime
import json
import qrcode

app = Flask(__name__)

# Configure secret key and Flask-Session
app.config['SECRET_KEY'] = 'your_secret_key_here'
app.config['SESSION_TYPE'] = 'filesystem'  # Options: 'filesystem', 'redis', 'memcached', etc.
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True  # To sign session cookies for extra security
app.config['SESSION_FILE_DIR'] = './sessions'  # Needed if using filesystem type

# Initialize the Flask-Session
Session(app)

# MySQL Configuration
mysql_config = {
    'host': 'localhost',  # Key-value pairs
    'user': 'root',
    'password': '812021536',
    'db': 'evldata',
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor
}
# Create MySQL connection
connection = pymysql.connect(**mysql_config)


@app.route('/')
def index():
    if 'uid' not in session:
        return redirect(url_for('login'))
    uid = session['uid']
    return render_template('index.html', uid=uid)


@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        userDetails = request.form
        username = userDetails['username']
        password = userDetails['password']
        with connection.cursor() as cursor:
            sql = "SELECT * FROM user WHERE username=%s AND password=%s"
            cursor.execute(sql, (username, password))
            user = cursor.fetchone()
        if user:
            session['username'] = user['username']
            session['uid'] = user['uid']
            return redirect(url_for('index'))
        else:
            error = 'Username or password is incorrect'
    return render_template('login.html', error=error)


@app.route('/register', methods=['GET', 'POST'])
def register():
    error = None
    if request.method == 'POST':
        userDetails = request.form
        username = userDetails['username']
        password = userDetails['password']
        phone = userDetails['phone']
        with connection.cursor() as cursor:
            # Check if the username already exists
            sql = "SELECT * FROM user WHERE username=%s"
            cursor.execute(sql, (username,))
            existing_user = cursor.fetchone()
            if existing_user:
                error = 'Username already exists, please choose another username.'
            else:
                # Insert the new user into the database
                sql = "INSERT INTO user (username, password, phone) VALUES (%s, %s, %s)"
                cursor.execute(sql, (username, password, phone))
                connection.commit()
                session['username'] = username
                # Redirect to the login page after successful registration
                return redirect(url_for('login'))
    return render_template('register.html', error=error)


def save_question(sid, question):
    # Iterate over the question array
    for q in question:
        # Convert the item array into JSON format string
        item_json = json.dumps(q['item'])
        # Execute SQL insertion operation using with statement
        with connection.cursor() as cursor:
            # Prepare SQL statement
            sql = "INSERT INTO question (sid, questionTitle, questionType, questionContent) VALUES (%s, %s, %s, %s)"
            val = (sid, q['title'], q['type'], item_json)
            # Execute SQL statement
            cursor.execute(sql, val)
    # Commit the transaction
    connection.commit()


@app.route('/saveData', methods=['POST'])
def save_data():
    data = request.json
    # Process the received JSON data here and save it to the database
    uid = session['uid']
    title = data['title']
    stopTime = data['time']
    # Get the current time
    current_time = datetime.now()
    # Format the current time as a string
    createTime = current_time.strftime("%Y-%m-%d %H:%M:%S")
    # Execute SQL query using with statement
    with connection.cursor() as cursor:
        # Prepare SQL statement
        sql = "INSERT INTO survey (uid, title, stopTime, createTime) VALUES (%s, %s, %s, %s)"
        val = (session['uid'], data['title'], data['time'], createTime)
        # Execute SQL statement
        cursor.execute(sql, val)
        # Get the ID of the last inserted row
        sid = cursor.lastrowid
    # Commit the transaction
    connection.commit()
    save_question(sid, data['question'])
    return jsonify({'message': 'Data received successfully!'})


@app.route('/new', methods=['GET', 'POST'])
def new():
    return render_template('new.html')


@app.route('/do', methods=['GET', 'POST'])
def do():
    sid = request.args.get('sid')
    return render_template('do.html', sid=sid)


@app.route('/view', methods=['GET', 'POST'])
def view():
    return render_template('view.html')


@app.route('/result', methods=['GET', 'POST'])
def result():
    return render_template('result.html')


@app.route('/quit', methods=['GET', 'POST'])
def quit():
    session.clear()
    return redirect(url_for('login'))



@app.route('/get_data', methods=['GET'])
def get_data():
    sid = request.args.get('sid')
    print(sid)
    # Query survey table data
    with connection.cursor() as cursor:
        survey_sql = "SELECT * FROM survey WHERE sid = %s"
        cursor.execute(survey_sql, (sid,))
        survey_data = cursor.fetchone()
    # Query question table data
    with connection.cursor() as cursor:
        question_sql = "SELECT * FROM question WHERE sid = %s"
        cursor.execute(question_sql, (sid,))
        question_data = cursor.fetchall()
    # Assuming question_data is a list of dictionaries containing JSON strings retrieved from the database
    for q in question_data:
        # Parse the JSON string in the questionContent field into a Python object
        q['questionContent'] = json.loads(q['questionContent'].encode('utf-8').decode('unicode-escape'))
    # Integrate data
    data = {
        'title': survey_data['title'],
        'time': survey_data['stopTime'],
        'questions': question_data
    }
    # Return data to the frontend
    return jsonify(data)


@app.route('/survey_info', methods=['GET'])
def get_survey_info():
    uid = session['uid']
    try:
        # Create a cursor using the connection object
        with connection.cursor() as cursor:
            # Execute the query statement to get survey information
            sql = "SELECT sid, title, stopTime FROM survey WHERE uid = %s"
            cursor.execute(sql, (uid,))
            # Get all survey information
            survey_info = cursor.fetchall()
            # If survey information is retrieved, return it to the frontend
            return jsonify({'status': 'success', 'survey_info': survey_info}), 200
            # if survey_info:
            #     print("True")
            #     return jsonify({'status': 'success', 'survey_info': survey_info}), 200
            # else:
            #     print("False")
            #     return jsonify({'status': 'error', 'message': 'No survey found for the given user ID.'}), 404
    except Exception as e:
        # If an exception occurs, return error information to the frontend
        return jsonify({'status': 'error', 'message': str(e)}), 500


@app.route('/delete_survey', methods=['DELETE'])
def delete_survey():
    # Get sid from request parameters
    sid = request.args.get('sid')

    # Delete records in the associated answer table
    with connection.cursor() as cursor:
        sql = "DELETE FROM answer WHERE sid = %s"
        cursor.execute(sql, (sid,))
        connection.commit()
    # Delete records in the associated question table
    with connection.cursor() as cursor:
        sql = "DELETE FROM question WHERE sid = %s"
        cursor.execute(sql, (sid,))
        connection.commit()
    # Delete records in the survey table
    with connection.cursor() as cursor:
        sql = "DELETE FROM survey WHERE sid = %s"
        cursor.execute(sql, (sid,))
        connection.commit()
    return 'Survey with SID {} has been successfully deleted'.format(sid), 200


@app.route('/qr', methods=['GET'])
def generate_qr_code():
    # Get the sid parameter passed in
    sid = request.args.get('sid')
    # Generate QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(f'http://127.0.0.1:5000/do?sid={sid}')
    qr.make(fit=True)
    qr_image = qr.make_image(fill_color="black", back_color="white")

    # Save the QR code to a file or return it to the frontend as a byte stream
    # Generate a file name with sid
    filename = f"qrcode_{sid}.png"
    # Concatenate file path
    qr_image_path = f"static/image/{filename}"
    qr_image.save(qr_image_path)

    # Return the QR code file path to the frontend
    return jsonify({'qr_code': qr_image_path}), 200


@app.route('/save_answers', methods=['POST'])
def save_answers():
    try:
        # Get JSON data from the frontend
        answer_data = request.json
        # print(answer_data)
        with connection.cursor() as cursor:
            # Assume the answer data is stored in a table named "answers"
            sql = "INSERT INTO answer (sid, uid, qid, content) VALUES (%s, %s, %s, %s)"
            for answer_entry in answer_data:
                sid = answer_entry['sid']
                qid = answer_entry['qid']
                uid = session['uid']
                answer = json.dumps(answer_entry['ans'])  # Convert answer data to JSON string
                # print(answer)
                cursor.execute(sql, (sid, uid, qid, answer))
            connection.commit()
        return jsonify({'message': 'Answers have been successfully saved'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/survey_results', methods=['GET'])
def get_survey_results():
    sid = request.args.get('sid')
    try:
        with connection.cursor() as cursor:
            # Get the relevant data from the answer table
            sql = "SELECT qid, content FROM answer WHERE sid = %s"
            cursor.execute(sql, (sid,))
            answers = cursor.fetchall()
        survey_title = None
        questions = []
        with connection.cursor() as cursor:
            # Get the survey title from the survey table
            sql = "SELECT title, stopTime FROM survey WHERE sid = %s"
            cursor.execute(sql, (sid,))
            survey = cursor.fetchone()
            survey_title = survey['title']
            stopTime = survey['stopTime']
            # Get the question title from the question table
            for answer in answers:
                qid = answer['qid']
                sql = "SELECT questionTitle, questionType FROM question WHERE sid = %s AND qid = %s"
                cursor.execute(sql, (sid, qid))
                question = cursor.fetchone()
                if question:
                    questions.append({
                        'questionTitle': question['questionTitle'],
                        'questionType': question['questionType'],
                        'questionContent': json.loads(answer['content'].encode('utf-8').decode('unicode-escape'))
                    })
        # Assemble the result data
        result = {
            'surveyTitle': survey_title,
            'time': stopTime,
            'questions': questions
        }
        print(result)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run()
