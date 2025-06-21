import axios from "axios";
const API_URL = 'http://localhost:3333/libros';

export const getLibros = async () => {
    const response = await axios.get(API_URL);
    return response.data;
}

export const getLibro = async (id: number) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
}

export const createLibro = async (libro: any) => {
  const response = await axios.post(API_URL, {
    titulo: libro.titulo,
    autor: libro.autor,
    editorial: libro.editorial,
    fecha_publicacion: libro.fecha_publicacion, // ← campo en snake_case
  })
  return response.data
}

export const updateLibro = async (id: number, libro: any) => {
  const response = await axios.put(`${API_URL}/${id}`, {
    titulo: libro.titulo,
    autor: libro.autor,
    editorial: libro.editorial,
    fecha_publicacion: libro.fecha_publicacion, // ← campo en snake_case
  })
  return response.data
}

export const deleteLibro = async (id: number) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
}
