<template>
  <div class="form-container">
    <h2>Agregar nuevo libro</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="titulo">Título:</label>
        <input v-model="libro.titulo" type="text" id="titulo" required />
      </div>

      <div class="form-group">
        <label for="autor">Autor:</label>
        <input v-model="libro.autor" type="text" id="autor" required />
      </div>

      <div class="form-group">
        <label for="editorial">Editorial:</label>
        <input v-model="libro.editorial" type="text" id="editorial" required />
      </div>

      <div class="form-group">
        <label for="fecha_publicacion">Año de publicación:</label>
        <input v-model.number="libro.fecha_publicacion" type="number" id="fecha_publicacion" required />
      </div>

      <button type="submit">Guardar libro</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { createLibro } from '@/services/libroService'

// Emitimos un evento para actualizar la lista de libros en el componente padre
const emit = defineEmits(['libroCreado'])

const libro = reactive({
  titulo: '',
  autor: '',
  editorial: '',
  fecha_publicacion: new Date().getFullYear(),
})

const handleSubmit = async () => {
  try {
    await createLibro(libro)
    emit('libroCreado') // Notifica al componente padre que se creó un libro
    // Limpia el formulario
    libro.titulo = ''
    libro.autor = ''
    libro.editorial = ''
    libro.fecha_publicacion = new Date().getFullYear()
  } catch (error) {
    console.error('Error al crear libro:', error)
  }
}
</script>

<style scoped>
.form-container {
  max-width: 500px;
  margin: 20px auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.form-group {
  margin-bottom: 1rem;
}
label {
  display: block;
  font-weight: bold;
}
input {
  width: 100%;
  padding: 8px;
  margin-top: 4px;
}
button {
  background-color: #42b983;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #369d77;
}
</style>
