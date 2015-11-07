from flask import Flask, render_template, jsonify, session, request
import requests


app = Flask(__name__)

app.secret_key = 'things'

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/lectures.json')
def get_lectures():
    result = requests.get("http://fellowship.hackbrightacademy.com/api/lectures/").json()
    full_lecture_details = []
    for lecture in result:
        print "Getting {}".format(lecture['title'])
        full_lecture = requests.get(lecture['url']).json()
        full_lecture_details.append(full_lecture)
    return jsonify({'children':full_lecture_details})

if __name__ == "__main__":
    app.debug = True
    app.run(port=5001)