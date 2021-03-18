from flask import Flask, request,render_template
import numpy as np
import urllib.request
import pickle
import copy
import cv2

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict/<url>', methods=['POST'])
def predict(url):
    urllib.request.urlretrieve("https://imgur.com/"+url, "sample.jpg")
    image_chess = cv2.imread('sample.jpg')
    found, corners = cv2.findChessboardCorners(image_chess, (23, 15))
    assert found == True, "can't find chessboard pattern"
    res = abs(corners[22,0,0]-corners[0,0,0])
    return str(res)

if __name__ == '__main__':
    app.run(host="127.0.0.1",port=5000,debug=True)