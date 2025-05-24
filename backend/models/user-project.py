import sqlite3


def create_project_table():
    """This is creating the whole table where all the projects will go."""
    conn = sqlite3.connect("gus.db")
    cur = conn.cursor()

    cur.execute("""CREATE TABLE User_Project (
        user_id INTEGER,
        project_id INTEGER,
        PRIMARY KEY (user_id, project_id),
        FOREIGN KEY (user_id) REFERENCES User(user_id),
        FOREIGN KEY (project_id) REFERENCES Project(project_id)
    );
    """)

    conn.commit()
    conn.close()

create_project_table()


