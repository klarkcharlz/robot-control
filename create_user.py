from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from models import UserModel


engine = create_engine("sqlite:///users.db")
Session = sessionmaker(bind=engine)
session = Session()

# менять тут
login = "admin"
username = "admin"
password = "admin"
access = "admin"

if __name__ == "__main__":
    user = UserModel(login=login, username=username, access=access)
    user.set_password(password)
    session.add(user)
    session.commit()
