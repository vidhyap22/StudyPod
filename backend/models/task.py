import sqlite3


def create_project_table():
    """This is creating the whole table where all the projects will go."""
    conn = sqlite3.connect("gus.db")
    cur = conn.cursor()

    cur.execute("""CREATE TABLE Task (
        task_id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_name TEXT,
        user_id INTEGER,
        project_id INTEGER,
        is_completed BOOLEAN DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES User(user_id),
        FOREIGN KEY (project_id) REFERENCES Project(project_id)
    );
    """)

    conn.commit()
    conn.close()

create_project_table()

