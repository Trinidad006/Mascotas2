import {
  getAllPets,
  addPet,
  updatePet,
  deletePet,
  dormirPet,
  jugarPet,
  alimentarPet,
  banarPet,
  acariciarPet,
  curarPet,
  getPetVida
} from '../services/petServices.js';

export async function getAll(req, res) {
  try {
    const pets = await getAllPets(req.user);
    res.json(pets);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function create(req, res) {
  try {
    const petData = { ...req.body, ownerId: req.user.id };
    const pet = await addPet(petData);
    res.status(201).json({ message: 'Mascota creada', pet });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function update(req, res) {
  try {
    const pet = await updatePet(req.params.id, req.body, req.user);
    res.json({ message: 'Mascota actualizada', pet });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function remove(req, res) {
  try {
    const pet = await deletePet(req.params.id, req.user);
    res.json(pet);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
}

export async function dormir(req, res) {
  try {
    const pet = await dormirPet(req.params.id, req.user);
    res.json({ message: 'Mascota durmió', pet });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function jugar(req, res) {
  try {
    const pet = await jugarPet(req.params.id, req.user);
    res.json({ message: 'Mascota jugó', pet });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function alimentar(req, res) {
  try {
    const pet = await alimentarPet(req.params.id, req.user);
    res.json({ message: 'Mascota alimentada', pet });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function banar(req, res) {
  try {
    const pet = await banarPet(req.params.id, req.user);
    res.json({ message: 'Mascota bañada', pet });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function acariciar(req, res) {
  try {
    const pet = await acariciarPet(req.params.id, req.user);
    res.json({ message: 'Mascota acariciada', pet });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function curar(req, res) {
  try {
    const pet = await curarPet(req.params.id, req.user);
    res.json({ message: 'Mascota curada', pet });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function vida(req, res) {
  try {
    const estado = await getPetVida(req.params.id, req.user);
    res.json(estado);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
}
