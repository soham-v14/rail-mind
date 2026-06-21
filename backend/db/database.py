import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL", "")

if not DATABASE_URL:
    DATABASE_URL = "sqlite:///./railmind.db"
    _connect_args = {"check_same_thread": False}
else:
    _connect_args = {}

engine = create_engine(DATABASE_URL, connect_args=_connect_args, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all tables. Safe to call repeatedly."""
    Base.metadata.create_all(bind=engine)
