from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column
import bcrypt  # se importa en los modelos porque aquí es donde se "guarda" la contraseña

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'user'

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(
        Boolean(), default=True, nullable=False)

    def set_password(self, password):
        """Hashea la contraseña antes de guardarla."""
        hasheador = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        # Guardar el hash en la columna `password_hash`
        self.password_hash = hasheador.decode('utf-8')

    def checkpassword(self, password):
        """Verifica una contraseña en texto plano contra el hash almacenado."""
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    def serialize(self):
        """Solo devuelve datos seguros (sin contraseña)."""
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "is_active": self.is_active
        }
