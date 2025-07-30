import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { petService } from '../services/api';
import PetCard from './PetCard';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPet, setNewPet] = useState({
    name: '',
    type: 'Perro',
    superPower: '',
    personalidad: 'normal'
  });

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      setLoading(true);
      console.log('Cargando mascotas...');
      const petsData = await petService.getAll();
      console.log('Mascotas cargadas (raw):', petsData);
      
      // Verificar que cada mascota tenga los campos necesarios
      const validatedPets = petsData.map(pet => {
        console.log('Validando mascota:', pet);
        return {
          _id: pet._id,
          name: pet.name || 'Sin nombre',
          type: pet.type || 'Desconocido',
          superPower: pet.superPower || 'Sin poder',
          personalidad: pet.personalidad || 'normal',
          salud: pet.salud !== undefined ? pet.salud : 100,
          felicidad: pet.felicidad !== undefined ? pet.felicidad : 100,
          sueno: pet.sueno !== undefined ? pet.sueno : 0,
          hambre: pet.hambre !== undefined ? pet.hambre : 0,
          limpieza: pet.limpieza !== undefined ? pet.limpieza : 100,
          isDead: pet.isDead || false,
          ownerId: pet.ownerId
        };
      });
      
      console.log('Mascotas validadas:', validatedPets);
      setPets(validatedPets);
    } catch (error) {
      console.error('Error cargando mascotas:', error);
      setError('Error al cargar las mascotas: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePet = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      console.log('Creando mascota:', newPet);
      
      // Validar datos antes de enviar
      if (!newPet.name.trim()) {
        setError('El nombre es requerido');
        return;
      }
      
      if (!newPet.superPower.trim()) {
        setError('El poder especial es requerido');
        return;
      }
      
      // Verificar si ya existe una mascota con el mismo nombre
      const existingPet = pets.find(pet => pet.name.toLowerCase() === newPet.name.toLowerCase());
      if (existingPet) {
        setError('Ya existe una mascota con ese nombre. Usa un nombre diferente.');
        return;
      }
      
      const createdPet = await petService.create(newPet);
      console.log('Mascota creada:', createdPet);
      
      // Validar la mascota creada antes de agregarla
      const validatedPet = {
        _id: createdPet._id,
        name: createdPet.name || newPet.name,
        type: createdPet.type || newPet.type,
        superPower: createdPet.superPower || newPet.superPower,
        personalidad: createdPet.personalidad || newPet.personalidad,
        salud: createdPet.salud !== undefined ? createdPet.salud : 100,
        felicidad: createdPet.felicidad !== undefined ? createdPet.felicidad : 100,
        sueno: createdPet.sueno !== undefined ? createdPet.sueno : 0,
        hambre: createdPet.hambre !== undefined ? createdPet.hambre : 0,
        limpieza: createdPet.limpieza !== undefined ? createdPet.limpieza : 100,
        isDead: createdPet.isDead || false,
        ownerId: createdPet.ownerId
      };
      
      console.log('Mascota validada para agregar:', validatedPet);
      setPets(prevPets => [...prevPets, validatedPet]);
      setNewPet({ name: '', type: 'Perro', superPower: '', personalidad: 'normal' });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creando mascota:', error);
      setError('Error al crear la mascota: ' + (error.response?.data?.error || error.message));
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleUpdatePet = (updatedPet) => {
    try {
      console.log('Actualizando mascota:', updatedPet);
      setPets(prevPets => prevPets.map(pet => pet._id === updatedPet._id ? updatedPet : pet));
    } catch (error) {
      console.error('Error actualizando mascota:', error);
      setError('Error al actualizar la mascota');
    }
  };

  const handleDeletePet = async (petId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta mascota?')) {
      try {
        console.log('Eliminando mascota:', petId);
        await petService.delete(petId);
        setPets(prevPets => prevPets.filter(pet => pet._id !== petId));
      } catch (error) {
        console.error('Error eliminando mascota:', error);
        setError('Error al eliminar la mascota: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Cargando mascotas...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🐾 Dashboard de Mascotas</h1>
        <p>¡Bienvenido, {user?.name}! Cuida de tus mascotas virtuales</p>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Mis Mascotas ({pets.length})</h2>
          <div>
            <button 
              className="btn" 
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? 'Cancelar' : '➕ Nueva Mascota'}
            </button>
            <button 
              className="btn" 
              onClick={logout}
              style={{ background: 'linear-gradient(45deg, #ff6b9d, #c44569)', marginLeft: '10px' }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        {/* Formulario para crear nueva mascota */}
        {showCreateForm && (
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#ff6b9d', marginBottom: '25px' }}>✨ Crear Nueva Mascota</h3>
            <form onSubmit={handleCreatePet}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label>Nombre:</label>
                  <input
                    type="text"
                    value={newPet.name}
                    onChange={(e) => setNewPet({...newPet, name: e.target.value})}
                    required
                    placeholder="Nombre de la mascota"
                  />
                </div>
                
                <div className="form-group">
                  <label>Tipo:</label>
                  <select
                    value={newPet.type}
                    onChange={(e) => setNewPet({...newPet, type: e.target.value})}
                  >
                    <option value="Perro">🐕 Perro</option>
                    <option value="Gato">🐱 Gato</option>
                    <option value="Conejo">🐰 Conejo</option>
                    <option value="Hamster">🐹 Hamster</option>
                    <option value="Pájaro">🐦 Pájaro</option>
                    <option value="Pez">🐠 Pez</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Poder Especial:</label>
                  <input
                    type="text"
                    value={newPet.superPower}
                    onChange={(e) => setNewPet({...newPet, superPower: e.target.value})}
                    required
                    placeholder="Poder especial de la mascota"
                  />
                </div>
                
                <div className="form-group">
                  <label>Personalidad:</label>
                  <select
                    value={newPet.personalidad}
                    onChange={(e) => setNewPet({...newPet, personalidad: e.target.value})}
                  >
                    <option value="normal">😊 Normal</option>
                    <option value="perezosa">😴 Perezosa</option>
                    <option value="juguetona">🎾 Juguetona</option>
                    <option value="triste">😢 Triste</option>
                    <option value="enojona">😠 Enojona</option>
                  </select>
                </div>
              </div>
              
              <button type="submit" className="btn" style={{ marginTop: '20px', width: '100%' }}>
                ✨ Crear Mascota
              </button>
            </form>
          </div>
        )}

        {/* Lista de mascotas */}
        {pets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255, 255, 255, 0.6)' }}>
            <h3>No tienes mascotas aún</h3>
            <p>¡Crea tu primera mascota virtual!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '25px' }}>
            {pets.map(pet => (
              <div key={pet._id}>
                <PetCard pet={pet} onUpdate={handleUpdatePet} />
                <div style={{ textAlign: 'center', marginTop: '15px' }}>
                  <button 
                    className="btn" 
                    onClick={() => handleDeletePet(pet._id)}
                    style={{ background: 'linear-gradient(45deg, #ff6b9d, #c44569)' }}
                  >
                    🗑️ Eliminar Mascota
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 