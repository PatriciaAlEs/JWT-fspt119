
from flask import request, jsonify, Blueprint
from flask_cors import CORS
from api.utils import generate_sitemap, APIException
from api.models import db, User
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError

# Blueprint y CORS deben ir primero
api = Blueprint('api', __name__)
CORS(api)

# ----------------------------------------------------------------> ENDPOINTS DE PERFIL (GET, PUT, DELETE)


@api.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user = get_jwt_identity()
    user = User.query.get(current_user)
    if not user:
        return jsonify({'msg': 'Usuario no encontrado'}), 404
    return jsonify({
        'email': user.email,
        'name': getattr(user, 'name', ''),
        'is_active': user.is_active
    }), 200


@api.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user = get_jwt_identity()
    user = User.query.get(current_user)
    if not user:
        return jsonify({'msg': 'Usuario no encontrado'}), 404
    body = request.get_json(silent=True)
    if not body:
        return jsonify({'msg': 'Faltan datos'}), 400
    email = body.get('email')
    name = body.get('name')
    password = body.get('password')
    # Validaciones básicas
    if email:
        if email != user.email:
            if User.query.filter_by(email=email).first():
                return jsonify({'msg': 'Ya existe un usuario con ese email'}), 400
            user.email = email
    if name is not None:
        user.name = name
    if password:
        if len(password) < 6:
            return jsonify({'msg': 'La contraseña debe tener al menos 6 caracteres'}), 400
        user.set_password(password)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({'msg': 'Error de integridad al actualizar'}), 400
    return jsonify({'msg': 'Datos actualizados correctamente'}), 200


@api.route('/profile', methods=['DELETE'])
@jwt_required()
def delete_profile():
    current_user = get_jwt_identity()
    user = User.query.get(current_user)
    if not user:
        return jsonify({'msg': 'Usuario no encontrado'}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({'msg': 'Cuenta eliminada correctamente'}), 200

# Otros endpoints


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200
