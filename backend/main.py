from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Annotated

import models
from database import SessionLocal, engine
from sqlalchemy.orm import Session

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
  'http://localhost:5173'
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_headers=['*'],
  allow_methods=['*']
)

class Student(BaseModel):
  name: str
  registration_number: str


def get_db():
  db = SessionLocal()
  try:
    yield db
  finally:
    db.close()

db_dependency = Annotated[Session, get_db]

# endpoints
@app.post("/students")
def add_student(student: Student, db: db_dependency):
  db_student= models.Students(
    name=student.name,
    registration_number=student.registration_number
  )
  db.add(db_student)
  db.commit()
  db.refresh(db_student)

  return db_student

@app.get("/students")
def get_students(db: db_dependency):
  db_students = db.query(models.Students).all()
  return db_students 