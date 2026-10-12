from sqlalchemy import Column, String, Integer
from database import Base

class Students(Base):
  __tablename__ = 'students'

  id= Column(Integer, primary_key=True, index=True)
  name= Column(String, index=True)
  registration_number= Column(String, unique=True, index=True)