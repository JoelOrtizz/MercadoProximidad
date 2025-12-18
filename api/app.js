import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3000

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('Conexión establecida.')
})

app.listen(PORT, () => {
  console.log(`Servidor escuchando a http://localhost:${PORT}`)
})