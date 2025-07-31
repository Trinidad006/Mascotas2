import Pet from '../models/petModel.js';

function checkIfDead(pet) {
  if (pet.salud <= 0) return true;
  if (pet.felicidad <= 0) return true;
  if (pet.sueno <= -50) return true;
  if (pet.hambre >= 100) return true;
  if (pet.limpieza <= 0) return true;
  return false;
}

async function saveAndCheckDeath(pet) {
  if (checkIfDead(pet)) {
    pet.isDead = true;
  }
  await pet.save();
  return pet;
}

export async function getAllPets(user) {
  if (user.role === 'admin') return await Pet.find();
  return await Pet.find({ ownerId: user.id });
}

export async function addPet(petData) {
  const newPet = new Pet(petData);
  await newPet.save();
  return newPet.toObject();
}

export async function getPetsByOwnerId(ownerId) {
  return await Pet.find({ ownerId });
}

export async function updatePet(id, updateData, user) {
  const pet = await Pet.findById(id);
  if (!pet) throw new Error('Mascota no encontrada');
  if (user.role !== 'admin' && pet.ownerId !== user.id) throw new Error('No autorizado');
  if (pet.isDead) throw new Error('No se puede modificar una mascota muerta');
  Object.assign(pet, updateData);
  return await saveAndCheckDeath(pet);
}

export async function deletePet(id, user) {
  const pet = await Pet.findById(id);
  if (!pet) throw new Error('Mascota no encontrada');
  if (user.role !== 'admin' && pet.ownerId !== user.id) throw new Error('No autorizado');
  await Pet.findByIdAndDelete(id);
  return { message: 'Mascota eliminada' };
}

function verificarRestricciones(pet, accion) {
  if (pet.isDead) throw new Error('No se puede realizar esta acción, la mascota ha muerto.');
  if (accion === 'jugar' && (pet.sueno > 80 || pet.limpieza < 20 || pet.hambre > 80)) throw new Error('No se puede jugar: mascota cansada, sucia o hambrienta.');
  if (accion === 'alimentar' && (pet.felicidad >= 100 || pet.hambre === 0)) throw new Error('No se puede alimentar: felicidad al máximo o hambre en 0.');
  if (accion === 'dormir' && pet.sueno <= 0) throw new Error('No se puede dormir: mascota descansada.');
}

export async function dormirPet(id, user) {
  const pet = await Pet.findById(id);
  verificarRestricciones(pet, 'dormir');
  let suenoPerdido = pet.personalidad === 'perezosa' ? 30 : pet.personalidad === 'juguetona' ? 10 : 20;
  pet.sueno -= suenoPerdido; // BAJAR el sueño cuando duerme
  if (pet.sueno < 0) pet.sueno = 0; // No puede bajar de 0
  if (pet.sueno < 20) pet.felicidad += 5;
  if (pet.felicidad > 100) pet.felicidad = 100;
  if (pet.hambre > 80 || pet.limpieza < 20) pet.salud -= 10;
  return await saveAndCheckDeath(pet);
}

export async function jugarPet(id, user) {
  const pet = await Pet.findById(id);
  verificarRestricciones(pet, 'jugar');
  if (pet.hambre > 80 || pet.limpieza < 20) pet.salud -= 10;
  let felicidadGanada = pet.personalidad === 'juguetona' ? 20 : pet.personalidad === 'perezosa' ? 5 : 10;
  let suenoGanado = pet.personalidad === 'perezosa' ? 20 : 10; // SUBIR el sueño cuando juega
  pet.felicidad += felicidadGanada;
  if (pet.felicidad > 100) pet.felicidad = 100;
  pet.sueno += suenoGanado; // SUBIR el sueño cuando juega
  if (pet.sueno > 100) pet.sueno = 100;
  return await saveAndCheckDeath(pet);
}

export async function alimentarPet(id, user) {
  const pet = await Pet.findById(id);
  if (pet.isDead) throw new Error('No se puede realizar esta acción, la mascota ha muerto.');
  let advertencia = null;
  // Penalización por sobrealimentación
  if (pet.felicidad >= 100 || pet.hambre === 0) {
    pet.salud -= 10;
    advertencia = '¡Cuidado! Sobrealimentación: la salud de la mascota ha bajado.';
  } else {
    if (pet.limpieza < 20) pet.salud -= 10;
    pet.hambre -= 30;
    if (pet.hambre < 0) pet.hambre = 0;
    pet.felicidad += pet.personalidad === 'triste' ? 5 : 10;
    if (pet.felicidad > 100) pet.felicidad = 100;
  }
  await saveAndCheckDeath(pet);
  if (advertencia) {
    return { pet, advertencia };
  }
  return pet;
}

export async function banarPet(id, user) {
  const pet = await Pet.findById(id);
  verificarRestricciones(pet, 'banar');
  if (pet.hambre > 80) pet.salud -= 10;
  pet.limpieza = 100;
  if (pet.personalidad === 'enojona') {
    pet.felicidad -= 10;
    if (pet.felicidad < 0) pet.felicidad = 0;
  }
  return await saveAndCheckDeath(pet);
}

export async function acariciarPet(id, user) {
  const pet = await Pet.findById(id);
  verificarRestricciones(pet, 'acariciar');
  pet.felicidad += pet.personalidad === 'triste' ? 5 : 10;
  if (pet.felicidad > 100) pet.felicidad = 100;
  return await saveAndCheckDeath(pet);
}

export async function curarPet(id, user) {
  const pet = await Pet.findById(id);
  verificarRestricciones(pet, 'curar');
  pet.salud += 20;
  if (pet.salud > 100) pet.salud = 100;
  
  // Bajar felicidad y limpieza al curar (como en la vida real)
  pet.felicidad -= 10;
  if (pet.felicidad < 0) pet.felicidad = 0;
  pet.limpieza -= 15;
  if (pet.limpieza < 0) pet.limpieza = 0;
  
  return await saveAndCheckDeath(pet);
}

export async function getPetVida(id, user) {
  const pet = await Pet.findById(id);
  if (!pet) throw new Error('Mascota no encontrada');
  if (user.role !== 'admin' && pet.ownerId !== user.id) throw new Error('No autorizado');
  return pet.toObject();
} 