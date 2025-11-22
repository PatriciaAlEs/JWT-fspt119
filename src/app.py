# ----------------------------------------------------------------> ENDPOINTS DE PERFIL (GET, PUT, DELETE)
from src.api.email import send_email
from datetime import timedelta
from email.message import EmailMessage
import smtplib
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import create_access_token
from flask_jwt_extended import decode_token
from src.api.commands import setup_commands
from src.api.admin import setup_admin
from src.api.routes import api
from src.api.models import db, User
from src.api.utils import APIException, generate_sitemap
from flask_swagger import swagger
from flask_migrate import Migrate
from flask import Flask, request, jsonify, url_for, send_from_directory
import os
import random



"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""


# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../dist/')
# ----------------------------------------------------------------> ya está instanciado FLASK
app = Flask(__name__)
app.url_map.strict_slashes = False

# Allow CORS for the whole app (useful for the frontend dev server)
CORS(app)


# de mi .env pongo el nombre de mi variable JWT_SECRET_KEY
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')


@app.route("/prueba", methods=["GET"])
def prueba():
    return jsonify({"msg": "Bienvenido a la ruta de prueba"})


# # ----------------------------------------------------------------> ENDPOINT DE REGISTRO
@app.route("/register", methods=["POST"])
def register():
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({'msg': 'El body debe tener info, la que requiere la tabla'}), 400

    email = body.get("email")
    password = body.get("password")
    if not email or not password:
        return jsonify({'msg': 'Falta email o contraseña en el registro'}), 400

    # Verifica si ya existe el usuario
    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({'msg': 'Ya existe un usuario con ese correo'}), 400

    # Crear nuevo usuario
    new_user = User(email=email, is_active=True)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "msg": "Usuario creado correctamente",
        "user": {"email": new_user.email}
    }), 201


# ----------------------------------------------------------------> ENDPOINT DE LOGIN
@app.route("/login", methods=["POST"])
def login():
    body = request.get_json(silent=True)
    print(body)
    if body is None:
        return jsonify({'msg': 'El body debe tener info, la que requiere la tabla'}), 400
    email = body.get("email")
    password = body.get("password")
    if not email or not password:
        return jsonify({'msg': 'Falta email o contraseña en el registro'}), 400
    user = User.query.filter_by(email=email).first()
    # chequeamos con la función tambien de mis modelos que compara las contraseñas
    if user is None or not user.checkpassword(password):
        return jsonify({'msg': 'El usuario no existe o la contraseña no es correcta'}), 400
    # recordar convertirlo a str porque espera un string la autorizacion
    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "token": access_token,
        "user": user.serialize()
    }), 200


@app.route("/private", methods=["GET"])
@jwt_required()
def private():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    user = User.query.get(current_user)
    return jsonify(user.serialize()), 200


# ----------------------------------------------------------------> ENDPOINT PROTEGIDO PARA EL GENERADOR (ejemplo)
@app.route('/generator-data', methods=['GET'])
@jwt_required()
def generator_data():
    # Devuelve datos de ejemplo que solo un usuario autenticado puede obtener
    current_user = get_jwt_identity()
    user = User.query.get(current_user)
    sample_prefixes = ['Srv', 'Gen', 'Core', 'Mint', 'Aero']
    return jsonify({
        'msg': 'Acceso concedido al generador',
        'user': user.serialize() if user else None,
        'server_prefixes': sample_prefixes
    }), 200


# ----------------------------------------------------------------> ENDPOINT PROTEGIDO QUE GENERA NOMBRES


def _rand(arr):
    return arr[random.randint(0, len(arr) - 1)]


# Reproducimos las categorías y estilos en el backend (versión simplificada)
CATEGORIES = {
    'rpg': {
        'prefixes': ['Aer', 'Bel', 'Cal', 'Dor', 'El', 'Fin', 'Gal', 'Har', 'Ith', 'Jar', 'Kel', 'Lun', 'Mor', 'Ner', 'Or', 'Pel', 'Qir', 'Ryn', 'Sol', 'Tor'],
        'middles': ['an', 'or', 'en', 'is', 'ar', 'il', 'us', 'ath', 'ion', 'el', 'ir'],
        'suffixes': ['dor', 'wen', 'thas', 'mar', 'gorn', 'dil', 'wyn', 'nor', 'ion', 'rus', 'mir', 'thil']
    },
    'shooter': {
        'prefixes': ['Ghost', 'Viper', 'Zero', 'Alpha', 'Blaze', 'Raptor', 'Strike', 'Delta', 'Nova', 'Echo', 'Reaper', 'Shadow', 'Specter'],
        'middles': ['_', '-', 'X', '', 'Z', 'Rx'],
        'suffixes': ['01', '99', 'Pro', 'Elite', 'Sniper', 'Shot', 'Ops', 'Core', 'Edge']
    },
    'br': {
        'prefixes': ['Sky', 'Storm', 'Grim', 'Wild', 'Iron', 'Titan', 'Prime', 'Blade', 'Rogue', 'Pulse', 'Venom', 'Apex', 'Crimson', 'Vortex', 'Phantom'],
        'middles': ['', '-', '_', '', 'X', 'Rx', 'Z'],
        'suffixes': ['Survivor', 'Runner', 'King', 'Queen', 'Slayer', 'Champion', 'Drift', 'Edge', 'Hunter', 'Breaker', 'Master']
    }
}


def _apply_style(name, styles):
    out = name
    if styles.get('fantasy'):
        out = out.replace('X', 'a').replace('0', 'o')
    if styles.get('futuristic'):
        out = ''.join([c.upper() if i % 2 else c for i, c in enumerate(out)])
    if styles.get('grim'):
        out = ''.join([c for c in out if c.lower() not in 'aeiou'])
    if styles.get('silly'):
        out = out + random.choice(['~', '!!', '_o_', '~'])
    return out


@app.route('/generate', methods=['POST'])
@jwt_required()
def generate_names():
    body = request.get_json(silent=True)
    if not body:
        return jsonify({'msg': 'Faltan datos'}), 400

    category = body.get('category', 'rpg')
    styles = body.get('styles', {})
    count = int(body.get('count', 8))
    mandatory = body.get('mandatory', '')

    # Limitamos la cantidad
    if count < 1:
        count = 1
    if count > 10:
        count = 10

    if category not in CATEGORIES:
        return jsonify({'msg': 'Categoría inválida'}), 400

    cat = CATEGORIES[category]

    results = []
    for _ in range(count):
        if mandatory and mandatory.strip():
            a = mandatory.strip().capitalize()
        else:
            a = _rand(cat['prefixes'])
        b = _rand(cat['middles'])
        c = _rand(cat['suffixes'])
        name = f"{a}{b}{c}"
        name = _apply_style(name, styles)
        results.append(name)

    return jsonify({'results': results}), 200


# ----------------------------------------------------------------> ENDPOINT DE RECUPERACION (simulado)
@app.route("/recover", methods=["POST"])
def recover():
    body = request.get_json(silent=True)
    if not body or "email" not in body:
        return jsonify({'msg': 'Se requiere un email'}), 400

    email = body["email"]
    user = User.query.filter_by(email=email).first()

    # Respuesta genérica (seguridad)
    generic_msg = {
        'msg': 'Si el email existe, se ha enviado un enlace de recuperación'}

    if not user:
        return jsonify(generic_msg), 200

    # Crear token JWT con expiración de 1 hora
    token = create_access_token(identity=str(
        user.id), expires_delta=timedelta(hours=1))

    # Generar el link del frontend
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    reset_link = f"{frontend_url.rstrip('/')}/reset?token={token}"

    # Envío de correo: delegar a la capa de email (support Mailgun/SendGrid/SMTP/MailHog)
    subject = 'Recuperar contraseña - Tu App'
    text_body = f"Para restablecer tu contraseña visita:\n{reset_link}"
    html_body = f"""
        <p>Hola,</p>
        <p>Para restablecer tu contraseña, haz clic aquí:</p>
        <p><a href=\"{reset_link}\">{reset_link}</a></p>
        <p>El enlace expirará en 1 hora.</p>
    """

    ok, err = send_email(email, subject, text_body, html_body)
    if ok:
        print(f"✅ Enlace de recuperación enviado a {email}")
    else:
        print("❌ Error enviando correo:", err)

    return jsonify(generic_msg), 200


# ----------------------------------------------------------------> ENDPOINT PARA RESETEAR CONTRASEÑA


@app.route("/reset-password", methods=["POST"])
def reset_password():
    body = request.get_json(silent=True)
    if not body or "token" not in body or "password" not in body:
        return jsonify({'msg': 'Faltan datos'}), 400

    token = body["token"]
    new_password = body["password"]

    try:
        # Decodifica el token del enlace
        decoded = decode_token(token)
        user_id = decoded["sub"]  # identidad del token
    except Exception as e:
        print("❌ Error al decodificar token:", e)
        return jsonify({'msg': 'Token inválido o expirado'}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({'msg': 'Usuario no encontrado'}), 404

    # Actualizamos la contraseña con tu método de modelo
    user.set_password(new_password)
    db.session.commit()

    return jsonify({'msg': 'Contraseña actualizada correctamente'}), 200


@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
