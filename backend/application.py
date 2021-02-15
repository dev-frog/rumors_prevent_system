from app import app
from flask import Flask
from flask import request
from flask import jsonify
from bs4 import BeautifulSoup
from joblib import dump, load
from bs4.element import Comment
import mysql.connector as mysql
import urllib.request
import requests
import validators
import time
import json
import re

app = Flask(__name__)

# db = mysql.connect(
#     host = "localhost",
#     user = "root",
#     passwd = "froghunter",
#     database = "newsdb"
# )

# cursor = db.cursor()
# query = "SELECT name, user_name FROM users"

@app.route('/parse_url', methods=["POST"])

# validates the url sent by the user, return error if not confirm to proper url format
def parse_url():
    message,prediction,title,error = ['','','','']
    request_url = json.loads(request.data).get('url')
    if request_url is None:
        error = "No url in request data"
    valid=valid=validators.url(request_url)
    if not valid:
        error = "Not a valid url"
    if not error:
        try:
            html = requests.get(request_url).content
            text_content = text_from_html(html)
            title = article_title_from_html(html)
            message = text_content
            prediction = prediction_response(text_content)
        except Exception as e:
            error = str(e)
    return {'message':message, "title":title, "prediction":prediction, 'error':error}

# takes all the text from <p> tags in the website, which is the article
def text_from_html(body):
    soup = BeautifulSoup(body, 'html.parser')
    ps = soup.findAll('p')
    all_text = ""
    for p in ps:
        all_text = all_text + p.text
    return all_text.strip()

def containsBold(text):
    return 'bold' in text

# gets the article title from the website
def article_title_from_html(body):
    title = "title not found"
    soup = BeautifulSoup(body, "html.parser")
    all_h = soup.findAll(["h1", "h2", "h3"])
    if all_h:
        title = all_h[0].text.strip()
    else:
        title_span = soup.find('span', {'style':containsBold})
        if title_span:
            title = title_span.text.strip()
    return title

# run the ML model on the submitted article
def prediction_response(text):
    pac = load("../models/fake_news_classifier.joblib")
    tfidf_vectorizer = load("../models/tfidf_vectorizer.joblib")
    vectorized_string = tfidf_vectorizer.transform([text])
    prediction = pac.predict(vectorized_string)
    return str(prediction[0])
    
# Output: array(['FAKE'], dtype='<U4')

