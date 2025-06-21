<template>
  <div class="page-container">
    <h1>Gestión de Libros</h1>

    <!-- Componente del formulario -->
    <LibroForm @libroCreado="obtenerLibros" />

    <input
  v-model="filtro"
  placeholder="Buscar por título o autor"
  class="filtro"
/>

    <!-- Tabla de libros -->
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Título</th>
          <th>Autor</th>
          <th>Editorial</th>
          <th>Año</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="libro in librosFiltrados" :key="libro.id">
          <td>{{ libro.id }}</td>
          <td v-if="editandoId !== libro.id">{{ libro.titulo }}</td>
          <td v-else><input v-model="libroEditado.titulo" /></td>

          <td v-if="editandoId !== libro.id">{{ libro.autor }}</td>
          <td v-else><input v-model="libroEditado.autor" /></td>

          <td v-if="editandoId !== libro.id">{{ libro.editorial }}</td>
          <td v-else><input v-model="libroEditado.editorial" /></td>

          <td v-if="editandoId !== libro.id">{{ libro.fechaPublicacion }}</td>
          <td v-else>
            <input type="number" v-model.number="libroEditado.fechaPublicacion" />
          </td>

          <td>
            <div v-if="editandoId === libro.id">
              <button @click="guardarEdicion(libro.id)">Guardar</button>
              <button @click="cancelarEdicion">Cancelar</button>
            </div>
            <div v-else>
              <button @click="editarLibro(libro)">Editar</button>
              <button @click="eliminarLibro(libro.id)">Eliminar</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
const filtro = ref('')
import { ref, onMounted, computed } from 'vue'
import LibroForm from '@/components/LibrosFormulario.vue'
import {
  getLibros,
  deleteLibro,
  updateLibro,
} from '@/services/libroService'

const libros = ref<any[]>([])
const editandoId = ref<number | null>(null)
const libroEditado = ref<any>({
  titulo: '',
  autor: '',
  editorial: '',
  fecha_publicacion: new Date().getFullYear(),
})

// Obtener libros al iniciar
const obtenerLibros = async () => {
  try {
    libros.value = await getLibros()
  } catch (error) {
    console.error('Error al obtener libros:', error)
  }
}

onMounted(obtenerLibros)

// Editar libro
const editarLibro = (libro: any) => {
  editandoId.value = libro.id
  libroEditado.value = { ...libro }
}

// Cancelar edición
const cancelarEdicion = () => {
  editandoId.value = null
  libroEditado.value = {}
}

// Guardar edición
const guardarEdicion = async (id: number) => {
  try {
    await updateLibro(id, libroEditado.value)
    editandoId.value = null
    obtenerLibros()
  } catch (error) {
    console.error('Error al actualizar libro:', error)
  }
}

// Eliminar libro
const eliminarLibro = async (id: number) => {
  try {
    if (confirm('¿Estás seguro de eliminar este libro?')) {
      await deleteLibro(id)
      obtenerLibros()
    }
  } catch (error) {
    console.error('Error al eliminar libro:', error)
  }
}

// Filtrar libros
const librosFiltrados = computed(() => {
  return libros.value.filter((libro) =>
    libro.titulo.toLowerCase().includes(filtro.value.toLowerCase()) ||
    libro.autor.toLowerCase().includes(filtro.value.toLowerCase())
  )
})
</script>

<style scoped>
.page-container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 1rem;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 2rem;
}
th, td {
  border: 1px solid #ddd;
  padding: 0.75rem;
  text-align: left;
}
th {
  background-color: #f3f3f3;
}
input {
  width: 100%;
  padding: 5px;
}
button {
  margin-right: 0.5rem;
  padding: 0.4rem 0.8rem;
  border: none;
  background-color: #42b983;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #369d77;
}

.filtro {
  padding: 8px;
  width: 100%;
  margin: 1rem 0;
  font-size: 16px;
}
</style>
