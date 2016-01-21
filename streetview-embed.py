from flask import Flask

app = Flask(__name__, static_url_path='')


@app.route('/')
def root():
    return app.send_static_file('index.html')


@app.route('/beta')
def beta():
    return app.send_static_file('new-api.html')


if __name__ == '__main__':
    app.run()
