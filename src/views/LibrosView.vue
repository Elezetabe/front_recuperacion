<template>
  <div class="page-container">
    <h1>Gestión de Libros</h1>

    <!-- Componente del formulario -->
    <LibroForm @libroCreado="obtenerLibros" />

    <!-- Tabla con barra de búsqueda integrada en tarjeta -->
    <v-card flat>
      <template #text>
        <v-text-field
          v-model="filtro"
          label="Buscar por título o autor"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
        />
      </template>

      <v-data-table
        :headers="headers"
        :items="librosFiltrados"
        item-value="id"
        class="elevation-1"
      >
        <!-- Campo Título -->
        <template v-slot:[`item.titulo`]="{ item }">
          <div v-if="editandoId !== item.id">{{ item.titulo }}</div>
          <v-text-field v-else v-model="libroEditado.titulo" hide-details dense />
        </template>

        <!-- Campo Autor -->
        <template v-slot:[`item.autor`]="{ item }">
          <div v-if="editandoId !== item.id">{{ item.autor }}</div>
          <v-text-field v-else v-model="libroEditado.autor" hide-details dense />
        </template>

        <!-- Campo Editorial -->
        <template v-slot:[`item.editorial`]="{ item }">
          <div v-if="editandoId !== item.id">{{ item.editorial }}</div>
          <v-text-field v-else v-model="libroEditado.editorial" hide-details dense />
        </template>

        <!-- Campo Año -->
        <template v-slot:[`item.fechaPublicacion`]="{ item }">
          <div v-if="editandoId !== item.id">{{ item.fechaPublicacion }}</div>
          <v-text-field
            v-else
            type="number"
            v-model.number="libroEditado.fechaPublicacion"
            hide-details
            dense
          />
        </template>

        <!-- Acciones -->
        <template v-slot:[`item.acciones`]="{ item }">
          <div v-if="editandoId === item.id">
            <v-btn icon color="success" @click="guardarEdicion(item.id)">
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
            <v-btn icon color="error" @click="cancelarEdicion">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
          <div v-else>
            <v-btn icon color="primary" @click="editarLibro(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon color="error" @click="eliminarLibro(item.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import Swal from 'sweetalert2'
import { ref, onMounted, computed } from 'vue'
import LibroForm from '@/components/LibrosFormulario.vue'
import {
  getLibros,
  deleteLibro,
  updateLibro,
} from '@/services/libroService'

interface Libro {
  id: number
  titulo: string
  autor: string
  editorial: string
  fechaPublicacion: number
}

const filtro = ref('')
const libros = ref<Libro[]>([])
const editandoId = ref<number | null>(null)
const libroEditado = ref<Partial<Libro>>({
  titulo: '',
  autor: '',
  editorial: '',
  fechaPublicacion: new Date().getFullYear(),
})

const headers = [
  { title: 'Título', key: 'titulo' },
  { title: 'Autor', key: 'autor' },
  { title: 'Editorial', key: 'editorial' },
  { title: 'Año', key: 'fechaPublicacion' },
  { title: 'Acciones', key: 'acciones', sortable: false },
]

// Obtener libros
const obtenerLibros = async () => {
  try {
    libros.value = await getLibros()
  } catch (error) {
    console.error('Error al obtener libros:', error)
  }
}

onMounted(obtenerLibros)

// Editar libro
const editarLibro = (libro: Libro) => {
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
  const { titulo, autor, editorial, fechaPublicacion } = libroEditado.value

  if (!titulo || !autor || !editorial || !fechaPublicacion) {
    Swal.fire('Campos incompletos', 'Por favor completa todos los campos.', 'warning')
    return
  }

  if (fechaPublicacion < 1000 || fechaPublicacion > new Date().getFullYear()) {
    Swal.fire('Año inválido', 'Ingresa un año de publicación válido.', 'error')
    return
  }

  const confirmacion = await Swal.fire({
    title: '¿Guardar cambios?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, guardar',
    cancelButtonText: 'Cancelar'
  })

  if (confirmacion.isConfirmed) {
    try {
      await updateLibro(id, {
        titulo,
        autor,
        editorial,
        fecha_publicacion: fechaPublicacion
      })
      editandoId.value = null
      obtenerLibros()
      Swal.fire('Actualizado', 'El libro fue editado exitosamente.', 'success')
    } catch (error) {
      console.error('Error al actualizar:', error)
      Swal.fire('Error', 'Hubo un problema al guardar los cambios.', 'error')
    }
  }
}

// Eliminar libro
const eliminarLibro = async (id: number) => {
  const confirmacion = await Swal.fire({
    title: '¿Eliminar este libro?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })

  if (confirmacion.isConfirmed) {
    try {
      await deleteLibro(id)
      await obtenerLibros()
      Swal.fire('Eliminado', 'El libro ha sido eliminado.', 'success')
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar el libro.', 'error')
      console.error(error)
    }
  }
}

// Filtrado
const librosFiltrados = computed(() =>
  libros.value.filter((libro) =>
    libro.titulo.toLowerCase().includes(filtro.value.toLowerCase()) ||
    libro.autor.toLowerCase().includes(filtro.value.toLowerCase())
  )
)
</script>

<style scoped>
.page-container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 1rem;
}

.v-card {
  margin-top: 2rem;
  width: 200%;
}

.v-btn {
  margin: 0 0.2rem;
}
</style>
