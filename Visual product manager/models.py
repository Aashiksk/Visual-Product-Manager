# models.py
import os
from sqlalchemy import create_engine, Integer, String, Column
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

DB_FILE = os.path.join(os.path.dirname(__file__), "products.db")
DATABASE_URL = f"sqlite:///{DB_FILE}"

engine = create_engine(DATABASE_URL, echo=False, future=True)

class Base(DeclarativeBase):
    pass

class Product(Base):
    __tablename__ = "products"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(200))
    category: Mapped[str] = mapped_column(String(100))
    image_filename: Mapped[str] = mapped_column(String(300))
    phash_hex: Mapped[str] = mapped_column(String(32))  # hex string

def init_db():
    Base.metadata.create_all(engine)
