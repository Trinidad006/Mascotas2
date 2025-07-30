import React, { useState } from 'react';
import { petService } from '../services/api';

const PetCard = ({ pet, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAction = async (action) => {
    if (!pet || !pet._id) {
      console.error('Mascota inválida:', pet);
      setMessage('Error: Mascota inválida');
      return;
    }

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
          console.error('Acción no válida:', action);
          return;
      }

      console.log('Resultado de la acción:', result);
      setMessage(`¡Acción ${action} realizada con éxito!`);
      setTimeout(() => setMessage(''), 3000);

      // Recargar mascota desde servidor inmediatamente
      try {
        console.log('Recargando mascota desde servidor...');
        const updatedPet = await petService.getVida(pet._id);
        console.log('Mascota actualizada desde servidor:', updatedPet);
        
        // Validar y actualizar la mascota
        const validatedPet = {
          _id: updatedPet._id,
          name: updatedPet.name || pet.name,
          type: updatedPet.type || pet.type,
          superPower: updatedPet.superPower || pet.superPower,
          personalidad: updatedPet.personalidad || pet.personalidad,
          salud: updatedPet.salud !== undefined ? updatedPet.salud : pet.salud,
          felicidad: updatedPet.felicidad !== undefined ? updatedPet.felicidad : pet.felicidad,
          sueno: updatedPet.sueno !== undefined ? updatedPet.sueno : pet.sueno,
          hambre: updatedPet.hambre !== undefined ? updatedPet.hambre : pet.hambre,
          limpieza: updatedPet.limpieza !== undefined ? updatedPet.limpieza : pet.limpieza,
          isDead: updatedPet.isDead !== undefined ? updatedPet.isDead : pet.isDead,
          ownerId: updatedPet.ownerId || pet.ownerId
        };
        
        console.log('Mascota validada para actualizar:', validatedPet);
        onUpdate(validatedPet);
      } catch (reloadError) {
        console.error('Error recargando mascota:', reloadError);
        // Si no se puede recargar, usar el resultado de la acción
        if (result && result._id) {
          console.log('Usando resultado de la acción como fallback:', result);
          onUpdate(result);
        }
      }
    } catch (error) {
      console.error('Error en acción:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Error al realizar la acción';
      setMessage(errorMessage);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const getPetEmoji = (type) => {
    if (!type) return '🐾';
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

  if (!pet || !pet._id) {
    return (
      <div className="pet-card">
        <div className="error">Error: Mascota inválida</div>
      </div>
    );
  }

  const isDead = pet.isDead || 
    (pet.salud !== undefined && pet.salud <= 0) || 
    (pet.felicidad !== undefined && pet.felicidad <= 0) || 
    (pet.sueno !== undefined && pet.sueno <= -50) || 
    (pet.hambre !== undefined && pet.hambre >= 100) || 
    (pet.limpieza !== undefined && pet.limpieza <= 0);

  return (
    <div className="pet-card">
      <div className="pet-avatar">{getPetEmoji(pet.type)}</div>
      <h3>{pet.name || 'Sin nombre'}</h3>
      <p><strong>Tipo:</strong> {pet.type || 'Desconocido'}</p>
      <p><strong>Poder:</strong> {pet.superPower || 'Sin poder'}</p>
      <p><strong>Personalidad:</strong> {pet.personalidad || 'Normal'}</p>
      
      <div className={`status-indicator ${isDead ? 'status-dead' : 'status-alive'}`}></div>
      <span>{isDead ? 'Muerta' : 'Viva'}</span>

      {message && (
        <div className={message.includes('Error') ? 'error' : 'success'} style={{ marginTop: '15px' }}>
          {message}
        </div>
      )}

      {/* BARRAS DE VIDA COMPLETAMENTE ESTÁTICAS */}
      <div style={{ marginTop: '20px' }}>
        <div>
          <strong>Salud:</strong> {pet.salud !== undefined ? pet.salud : 100}%
          <div className="progress-bar">
            <div className="progress-fill health" style={{ width: `${Math.max(0, Math.min(100, pet.salud || 100))}%` }}></div>
          </div>
        </div>
        <div>
          <strong>Felicidad:</strong> {pet.felicidad !== undefined ? pet.felicidad : 100}%
          <div className="progress-bar">
            <div className="progress-fill happiness" style={{ width: `${Math.max(0, Math.min(100, pet.felicidad || 100))}%` }}></div>
          </div>
        </div>
        <div>
          <strong>Sueño:</strong> {pet.sueno !== undefined ? (pet.sueno >= 0 ? pet.sueno : Math.abs(pet.sueno)) : 0}%
          <div className="progress-bar">
            <div className="progress-fill sleep" style={{ width: `${Math.max(0, Math.min(100, (pet.sueno || 0) + 50))}%` }}></div>
          </div>
        </div>
        <div>
          <strong>Hambre:</strong> {pet.hambre !== undefined ? pet.hambre : 0}%
          <div className="progress-bar">
            <div className="progress-fill hunger" style={{ width: `${Math.max(0, Math.min(100, pet.hambre || 0))}%` }}></div>
          </div>
        </div>
        <div>
          <strong>Limpieza:</strong> {pet.limpieza !== undefined ? pet.limpieza : 100}%
          <div className="progress-bar">
            <div className="progress-fill cleanliness" style={{ width: `${Math.max(0, Math.min(100, pet.limpieza || 100))}%` }}></div>
          </div>
        </div>
      </div>

      {/* BOTONES DE ACCIÓN - FUERA DE CUALQUIER CONTENEDOR INTERACTIVO */}
      <div style={{ 
        marginTop: '20px', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '10px',
        position: 'relative',
        zIndex: 1000
      }}>
        <button 
          className="btn" 
          onClick={() => handleAction('dormir')}
          disabled={loading}
          style={{ 
            padding: '10px', 
            fontSize: '14px',
            position: 'relative',
            zIndex: 1001
          }}
        >
          😴 Dormir
        </button>
        
        <button 
          className="btn" 
          onClick={() => handleAction('jugar')}
          disabled={loading}
          style={{ 
            padding: '10px', 
            fontSize: '14px',
            position: 'relative',
            zIndex: 1001
          }}
        >
          🎾 Jugar
        </button>
        
        <button 
          className="btn" 
          onClick={() => handleAction('alimentar')}
          disabled={loading}
          style={{ 
            padding: '10px', 
            fontSize: '14px',
            position: 'relative',
            zIndex: 1001
          }}
        >
          🍖 Alimentar
        </button>
        
        <button 
          className="btn" 
          onClick={() => handleAction('banar')}
          disabled={loading}
          style={{ 
            padding: '10px', 
            fontSize: '14px',
            position: 'relative',
            zIndex: 1001
          }}
        >
          🛁 Bañar
        </button>
        
        <button 
          className="btn" 
          onClick={() => handleAction('acariciar')}
          disabled={loading}
          style={{ 
            padding: '10px', 
            fontSize: '14px',
            position: 'relative',
            zIndex: 1001
          }}
        >
          🥰 Acariciar
        </button>
        
        <button 
          className="btn" 
          onClick={() => handleAction('curar')}
          disabled={loading}
          style={{ 
            padding: '10px', 
            fontSize: '14px',
            position: 'relative',
            zIndex: 1001
          }}
        >
          💊 Curar
        </button>
      </div>
    </div>
  );
};

export default PetCard; 