import os
import sqlite3
import pathlib


class Database:
    DATABASE = f'{pathlib.Path(__file__).parent.absolute()}{os.sep}database.db'
    SCHEMA = f'{pathlib.Path(__file__).parent.absolute()}{os.sep}schema.sql'

    def __init__(self):
        try:
            self.get_all_posts()
        except sqlite3.OperationalError:
            with open(self.SCHEMA) as f:
                conn = sqlite3.connect(self.DATABASE)
                conn.executescript(f.read())
                conn.commit()
                conn.close()

    def _get_connection(self):
        conn = sqlite3.connect(self.DATABASE)
        conn.row_factory = sqlite3.Row
        return conn

    def get_all_posts(self):
        conn = self._get_connection()
        posts = conn.execute('SELECT * FROM posts').fetchall()
        conn.close()
        return posts

    def get_post(self, post_id):
        conn = self._get_connection()
        post = conn.execute('SELECT * FROM posts WHERE id = ?',
                            (post_id, )).fetchone()
        conn.close()
        return post

    def create_post(self, title, content):
        conn = self._get_connection()
        conn.execute('INSERT INTO posts (title, content) VALUES (?, ?)',
                     (title, content))
        conn.commit()
        conn.close()

    def edit_post(self, title, content, post_id):
        conn = self._get_connection()
        conn.execute('UPDATE posts SET title = ?, content = ? WHERE id = ?',
                     (title, content, post_id))
        conn.commit()
        conn.close()

    def delete_post(self, post_id):
        conn = self._get_connection()
        conn.execute('DELETE FROM posts WHERE id = ?', (post_id,))
        conn.commit()
        conn.close()
