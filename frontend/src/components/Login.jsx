import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let result;
      if (isLogin) {
        result = await login(formData);
      } else {
        result = await register(formData);
      }

      if (result.success) {
        if (isLogin) {
          setSuccess('¡Inicio de sesión exitoso!');
          setTimeout(() => navigate('/dashboard'), 1000);
        } else {
          setSuccess('¡Usuario registrado exitosamente! Ahora puedes iniciar sesión.');
          setTimeout(() => {
            setIsLogin(true);
            setFormData({ name: '', password: '' });
            setSuccess('');
          }, 2000);
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error inesperado. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const switchToRegister = () => {
    setIsLogin(false);
    setError('');
    setSuccess('');
    setFormData({ name: '', password: '' });
  };

  const switchToLogin = () => {
    setIsLogin(true);
    setError('');
    setSuccess('');
    setFormData({ name: '', password: '' });
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🐾 Mascotas Virtuales</h1>
        <p>¡Cuida y juega con tus mascotas!</p>
      </div>

      <div className="login-form">
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
          {isLogin ? 'Iniciar Sesión' : 'Crear Nueva Cuenta'}
        </h2>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre de usuario:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ingresa tu nombre de usuario"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Ingresa tu contraseña"
            />
          </div>

          <button 
            type="submit" 
            className="btn" 
            style={{ width: '100%', marginTop: '20px' }}
            disabled={loading}
          >
            {loading ? 'Cargando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          {isLogin ? (
            <button 
              type="button" 
              className="btn" 
              style={{ background: 'transparent', color: '#667eea', border: '2px solid #667eea' }}
              onClick={switchToRegister}
            >
              ¿No tienes cuenta? Crear Nueva Cuenta
            </button>
          ) : (
            <button 
              type="button" 
              className="btn" 
              style={{ background: 'transparent', color: '#667eea', border: '2px solid #667eea' }}
              onClick={switchToLogin}
            >
              ¿Ya tienes cuenta? Iniciar Sesión
            </button>
          )}
        </div>

        {isLogin && (
          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' }}>
            <p><strong>Credenciales de administrador:</strong></p>
            <p>Usuario: Admin</p>
            <p>Contraseña: admin123</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login; 