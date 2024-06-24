const express = require('express')
const fs = require('fs')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.get('/', (req, res) => {
  try {
    res.status(200).send('Servidor conectado')
  } catch (error) {
    res.status(501).send('error en el servidor')
  }
})

app.get('/canciones', (req, res) => {
  try {
    const canciones = JSON.parse(fs.readFileSync('repositorio.json'))
    res.status(200).json(canciones)
  } catch (error) {
    res.status(404).send('error al obtener la información')
  }
})

app.post('/canciones', (req, res) => {
  try {
    const cancion = req.body
    if (cancion.id == undefined || cancion.titulo == undefined || cancion.artista == undefined || cancion.tono == undefined) {
      throw new Error('Todos los campos son obligatorios')
    }
    const canciones = JSON.parse(fs.readFileSync('repositorio.json'))
    canciones.push(cancion)
    fs.writeFileSync('repositorio.json', JSON.stringify(canciones, null, 2))
    res.status(200).send({ message: 'Cancion creada con exito' })
  } catch (error) {
    res.status(404).send(`No se pudo crear la canción: ${error.message}`)
  }
})

app.put('/canciones/:id', (req, res) => {
  try {
    const { id } = req.params
    const cancion = req.body
    if (cancion.id == undefined || cancion.titulo == undefined || cancion.artista == undefined || cancion.tono == undefined) {
      throw new Error('Todos los campos son obligatorios')
    }
    const canciones = JSON.parse(fs.readFileSync('repositorio.json'))
    const index = canciones.findIndex(c => c.id == id)

    if (index === -1) {
      throw new Error('Debe ingresar un id valido')
    }
    canciones[index] = cancion
    fs.writeFileSync('repositorio.json', JSON.stringify(canciones, null, 2))
    res.status(200).json({ message: 'Canción modificada con exito' })
  } catch (error) {
    res.status(400).send(`No se pudo modificar la canción: ${error.message}`)
  }
})

app.delete('/canciones/:id', (req, res) => {
  try {
    const { id } = req.params
    const canciones = JSON.parse(fs.readFileSync('repositorio.json'))
    const index = canciones.findIndex(c => c.id == id)

    if (index === -1) {
      throw new Error('Debe ingresar un id valido')
    }
    canciones.splice(index, 1)
    fs.writeFileSync('repositorio.json', JSON.stringify(canciones, null, 2))
    res.status(200).json({ message: 'Canción eliminada con exito' })
  } catch (error) {
    res.status(404).send(`No se pudo eliminar la canción: ${error.message}`)
  }
})

app.listen(3000, () => console.log('conectada desde el puerto 3000'))
