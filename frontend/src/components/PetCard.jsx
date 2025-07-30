import React, { useState } from 'react';
import { petService } from '../services/api';

const PetCard = ({ pet, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAction = async (action) => {
    setLoading(true);
    setMessage('');
    
    try {
      console.log(`Ejecutando acción: ${action} para mascota: ${pet._id}`);
      
      let result;
      switch (action) {
        case 'dormir':
          result = await petService.dormir(pet._id);
          break;
        case 'jugar':
          result = await petService.jugar(pet._id);
          break;
        case 'alimentar':
          result = await petService.alimentar(pet._id);
          break;
        case 'banar':
          result = await petService.banar(pet._id);
          break;
        case 'acariciar':
          result = await petService.acariciar(pet._id);
          break;
        case 'curar':
          result = await petService.curar(pet._id);
          break;
        default:
          return;
      }

      console.log('Resultado de la acción:', result);

      // Mostrar advertencia si existe
      if (result.advertencia) {
        setMessage(result.advertencia);
        setTimeout(() => setMessage(''), 5000);
      } else if (result.message) {
        setMessage(result.message);
        setTimeout(() => setMessage(''), 3000);
      }

      // Actualizar la mascota en el componente padre
      const updatedPet = result.pet || result;
      console.log('Mascota actualizada:', updatedPet);
      onUpdate(updatedPet);
    } catch (error) {
      console.error('Error en acción:', error);
      setMessage(error.response?.data?.error || 'Error al realizar la acción');
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const getPetEmoji = (type) => {
    switch (type.toLowerCase()) {
      case 'perro': return '🐕';
      case 'gato': return '🐱';
      case 'conejo': return '🐰';
      case 'hamster': return '🐹';
      case 'pájaro': return '🐦';
      case 'pez': return '🐠';
      default: return '🐾';
    }
  };

  const getStatusColor = (value, isReverse = false) => {
    if (isReverse) {
      return value <= 20 ? '#ff6b6b' : value <= 50 ? '#f39c12' : '#4ecdc4';
    }
    return value <= 20 ? '#ff6b6b' : value <= 50 ? '#f39c12' : '#4ecdc4';
  };

  const isDead = pet.isDead || 
    pet.salud <= 0 || 
    pet.felicidad <= 0 || 
    pet.sueno <= -50 || 
    pet.hambre >= 100 || 
    pet.limpieza <= 0;

  return (
    <div className="pet-card">
      <div className="pet-avatar">
        {getPetEmoji(pet.type)}
      </div>
      
      <h3>{pet.name}</h3>
      <p><strong>Tipo:</strong> {pet.type}</p>
      <p><strong>Poder:</strong> {pet.superPower}</p>
      <p><strong>Personalidad:</strong> {pet.personalidad}</p>
      
      <div className={`status-indicator ${isDead ? 'status-dead' : 'status-alive'}`}></div>
      <span>{isDead ? 'Muerta' : 'Viva'}</span>

      {message && (
        <div className={message.includes('¡Cuidado!') ? 'error' : 'success'} style={{ marginTop: '15px' }}>
          {message}
        </div>
      )}

      {/* Barras de vida */}
      <div style={{ marginTop: '20px' }}>
        <div>
          <strong>Salud:</strong> {pet.salud}%
          <div className="progress-bar">
            <div 
              className="progress-fill health" 
              style={{ 
                width: `${Math.max(0, Math.min(100, pet.salud))}%`
              }}
            ></div>
          </div>
        </div>

        <div>
          <strong>Felicidad:</strong> {pet.felicidad}%
          <div className="progress-bar">
            <div 
              className="progress-fill happiness" 
              style={{ 
                width: `${Math.max(0, Math.min(100, pet.felicidad))}%`
              }}
            ></div>
          </div>
        </div>

        <div>
          <strong>Sueño:</strong> {pet.sueno >= 0 ? pet.sueno : Math.abs(pet.sueno)}%
          <div className="progress-bar">
            <div 
              className="progress-fill sleep" 
              style={{ 
                width: `${Math.max(0, Math.min(100, (pet.sueno + 50)))}%`
              }}
            ></div>
          </div>
        </div>

        <div>
          <strong>Hambre:</strong> {pet.hambre}%
          <div className="progress-bar">
            <div 
              className="progress-fill hunger" 
              style={{ 
                width: `${Math.max(0, Math.min(100, pet.hambre))}%`
              }}
            ></div>
          </div>
        </div>

        <div>
          <strong>Limpieza:</strong> {pet.limpieza}%
          <div className="progress-bar">
            <div 
              className="progress-fill cleanliness" 
              style={{ 
                width: `${Math.max(0, Math.min(100, pet.limpieza))}%`
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="actions-grid">
        <button 
          className="btn" 
          onClick={() => handleAction('dormir')}
          disabled={loading || isDead || pet.sueno >= 100}
        >
          😴 Dormir
        </button>
        
        <button 
          className="btn" 
          onClick={() => handleAction('jugar')}
          disabled={loading || isDead || pet.sueno < 10 || pet.hambre > 80 || pet.limpieza < 20}
        >
          🎾 Jugar
        </button>
        
        <button 
          className="btn" 
          onClick={() => handleAction('alimentar')}
          disabled={loading || isDead}
        >
          🍖 Alimentar
        </button>
        
        <button 
          className="btn" 
          onClick={() => handleAction('banar')}
          disabled={loading || isDead}
        >
          🛁 Bañar
        </button>
        
        <button 
          className="btn" 
          onClick={() => handleAction('acariciar')}
          disabled={loading || isDead}
        >
          🥰 Acariciar
        </button>
        
        <button 
          className="btn" 
          onClick={() => handleAction('curar')}
          disabled={loading || isDead || pet.salud >= 100}
        >
          💊 Curar
        </button>
      </div>
    </div>
  );
};

export default PetCard; 