import sqlite3


def create_project_table():
    """This is creating the whole table where all the projects will go."""
    conn = sqlite3.connect("gus.db")
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS Project (
        project_id INTEGER PRIMARY KEY AUTOINCREMENT,
        gus_name TEXT NOT NULL,
        project_title TEXT NOT NULL,
        level INTEGER CHECK(level BETWEEN 0 AND 100) DEFAULT 0,
        deadline DATE,
        is_active BOOLEAN DEFAULT 1,
        created_time DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    """)

    conn.commit()
    conn.close()

create_project_table()
