import flask
from flask import render_template, request, flash, redirect, url_for
from werkzeug.exceptions import abort

from backend import FastNotes

todo_list = FastNotes()
app = flask.Flask(__name__)
app.config['SECRET_KEY'] = todo_list.secret_key


@app.route('/')
def index():
    all_posts = todo_list.db.get_all_posts()
    return render_template(todo_list.INDEX, posts=all_posts, index_active=todo_list.ELEMENT_ACTIVE)


@app.route('/about/')
def about():
    return render_template(todo_list.ABOUT, about_active=todo_list.ELEMENT_ACTIVE)


def get_post(post_id):
    post = todo_list.db.get_post(post_id)
    if post is None:
        abort(404)
    return post


@app.route('/<int:post_id>')
def post(post_id):
    post = get_post(post_id)
    return render_template(todo_list.POST, post=post)


@app.route('/create', methods=('GET', 'POST'))
def create():
    if request.method == 'POST':
        title = request.form['title']
        content = request.form['content']
        if not title:
            flash('Title is required!')
        else:
            todo_list.db.create_post(title, content)
            return redirect(url_for('index'))
    return render_template(todo_list.CREATE, create_active=todo_list.ELEMENT_ACTIVE)


@app.route('/<int:id>/edit', methods=('GET', 'POST'))
def edit(id):
    post = get_post(id)
    if request.method == 'POST':
        title = request.form['title']
        content = request.form['content']
        if not title:
            flash('Title is required!')
        else:
            todo_list.db.edit_post(title, content, id)
            return redirect(url_for('index'))
    return render_template(todo_list.EDIT, post=post)


@app.route('/<int:id>/delete', methods=('POST',))
def delete(id):
    post = get_post(id)
    todo_list.db.delete_post(id)
    flash('"{}" was successfully deleted!'.format(post['title']))
    return redirect(url_for('index'))


def start(host, port, debug):
    app.run(host, port, debug)
