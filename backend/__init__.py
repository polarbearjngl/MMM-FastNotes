import uuid

from backend.database import Database


class FastNotes:
    INDEX = 'index.html'
    POST = 'post.html'
    CREATE = 'create.html'
    EDIT = 'edit.html'
    ABOUT = 'about.html'

    ELEMENT_ACTIVE = 'active'

    def __init__(self):
        self.db = Database()
        self.secret_key = uuid.uuid4().hex
