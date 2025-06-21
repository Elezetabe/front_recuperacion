<template>
  <v-card class="form-container">
    <v-card-title>Agregar nuevo libro</v-card-title>
    <v-card-text>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <v-text-field
            v-model="libro.titulo"
            label="Título"
            required
            clearable
          />
        </div>

        <div class="form-group">
          <v-text-field
            v-model="libro.autor"
            label="Autor"
            required
            clearable
          />
        </div>

        <div class="form-group">
          <v-text-field
            v-model="libro.editorial"
            label="Editorial"
            required
            clearable
          />
        </div>

        <div class="form-group">
          <v-text-field
            v-model.number="libro.fecha_publicacion"
            label="Año de publicación"
            type="number"
            required
            clearable
          />
        </div>

        <v-btn type="submit" color="success" class="mt-2">Guardar</v-btn>
        <v-btn color="error" class="mt-2" @click="limpiarLibro">Cancelar</v-btn>
      </form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { createLibro } from '@/services/libroService'
import Swal from 'sweetalert2'

// Emitimos un evento para actualizar la lista de libros en el componente padre
const emit = defineEmits(['libroCreado'])

const limpiarLibro = () => {
  libro.titulo = ''
  libro.autor = ''
  libro.editorial = ''
  libro.fecha_publicacion = new Date().getFullYear()
}

const libro = reactive({
  titulo: '',
  autor: '',
  editorial: '',
  fecha_publicacion: new Date().getFullYear(),
})

const handleSubmit = async () => {
  const { fecha_publicacion } = libro

  if (fecha_publicacion < 1000 || fecha_publicacion > new Date().getFullYear()) {
    Swal.fire('Año inválido', 'Ingresa un año de publicación válido.', 'error')
    return
  }

  try {
    await createLibro(libro)
    Swal.fire('Libro creado', 'Libro creado exitosamente.', 'success')
    emit('libroCreado') // Notifica al componente padre que se creó un libro

    // Limpia el formulario
    libro.titulo = ''
    libro.autor = ''
    libro.editorial = ''
    libro.fecha_publicacion = new Date().getFullYear()
  } catch (error) {
    console.error('Error al crear libro:', error)
    Swal.fire('Error', 'No se pudo crear el libro.', 'error')
  }
}
</script>

<style scoped>
.form-container {
  max-width: 500px;
  margin: 20px auto;
  padding: 1rem;
}

.v-btn {
  margin-right: 10px;
}
</style>
