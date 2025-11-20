import sqlite3
from datetime import datetime

DB_NAME = "documents.db"

def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            file_hash TEXT UNIQUE NOT NULL,
            title TEXT,
            upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def add_document(filename, file_hash, title):
    conn = get_db_connection()
    try:
        cursor = conn.execute(
            'INSERT INTO documents (filename, file_hash, title) VALUES (?, ?, ?)',
            (filename, file_hash, title)
        )
        conn.commit()
        return cursor.lastrowid
    except sqlite3.IntegrityError:
        return None
    finally:
        conn.close()

def get_documents():
    conn = get_db_connection()
    documents = conn.execute('SELECT * FROM documents ORDER BY upload_date DESC').fetchall()
    conn.close()
    return [dict(doc) for doc in documents]

def get_document_by_hash(file_hash):
    conn = get_db_connection()
    document = conn.execute('SELECT * FROM documents WHERE file_hash = ?', (file_hash,)).fetchone()
    conn.close()
    return dict(document) if document else None
