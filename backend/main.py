
import os
import time

import psycopg
from psycopg.rows import dict_row
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(
    title="Student Management API",
    version="1.0.0",
    root_path="/api",
    docs_url="/docs",
    openapi_url="/openapi.json",
)

# PostgreSQL connection settings
DATABASE_URL = (
    f"postgresql://{os.getenv('POSTGRES_USER', 'student_user')}:"
    f"{os.getenv('POSTGRES_PASSWORD', 'local_dev_password')}@"
    f"{os.getenv('POSTGRES_HOST', 'db')}:5432/"
    f"{os.getenv('POSTGRES_DB', 'students_db')}"
)


# Student input validation
class StudentCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    course: str = Field(min_length=1, max_length=100)


# Create a database connection
def get_connection():
    return psycopg.connect(
        DATABASE_URL,
        row_factory=dict_row,
    )


# Create the database table when the application starts
@app.on_event("startup")
def startup():
    for attempt in range(10):
        try:
            with get_connection() as conn:
                conn.execute(
                    """
                    CREATE TABLE IF NOT EXISTS students (
                        id SERIAL PRIMARY KEY,
                        name VARCHAR(100) NOT NULL,
                        course VARCHAR(100) NOT NULL
                    )
                    """
                )

            print("PostgreSQL connected. Students table is ready.")
            return

        except psycopg.OperationalError:
            if attempt == 9:
                raise

            print("Waiting for PostgreSQL...")
            time.sleep(2)


# Home endpoint
@app.get("/")
def home():
    return {"message": "Student Management API is running"}


# Get all students
@app.get("/students")
def get_students():
    with get_connection() as conn:
        students = conn.execute(
            "SELECT id, name, course FROM students ORDER BY id"
        ).fetchall()

    return students


# Add a student
@app.post("/students", status_code=201)
def add_student(student: StudentCreate):
    name = student.name.strip()
    course = student.course.strip()

    if not name or not course:
        raise HTTPException(
            status_code=400,
            detail="Name and course cannot be empty",
        )

    with get_connection() as conn:
        new_student = conn.execute(
            """
            INSERT INTO students (name, course)
            VALUES (%s, %s)
            RETURNING id, name, course
            """,
            (name, course),
        ).fetchone()

    return new_student


# Delete a student by ID
@app.delete("/students/{student_id}")
def delete_student(student_id: int):
    with get_connection() as conn:
        deleted_student = conn.execute(
            "DELETE FROM students WHERE id = %s RETURNING id",
            (student_id,),
        ).fetchone()

    if deleted_student is None:
        raise HTTPException(
            status_code=404,
            detail="Student not found",
        )

    return {
        "message": "Student deleted successfully",
        "id": student_id,
    }