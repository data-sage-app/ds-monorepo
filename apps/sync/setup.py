import psycopg2

def run_setup_script():
    # Define your connection parameters
    CONFIG = {
        "db_name": "your_db_name",
        "db_user": "your_db_user",
        "db_password": "your_db_password",
        "db_host": "your_db_host",
        "db_port": "your_db_port",
    }

    # Connect to the PostgreSQL database
    conn = psycopg2.connect(
        dbname=CONFIG["db_name"],
        user=CONFIG["db_user"],
        password=CONFIG["db_password"],
        host=CONFIG["db_host"],
        port=CONFIG["db_port"],
    )

    cursor = conn.cursor()

    # Open and read the SQL file
    with open("setup.sql", "r") as file:
        setup_sql = file.read()

    # Execute the SQL commands
    cursor.execute(setup_sql)

    # Commit the changes and close the connection
    conn.commit()
    cursor.close()
    conn.close()
    print("Setup script executed successfully!")

if __name__ == "__main__":
    run_setup_script()
