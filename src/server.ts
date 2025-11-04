import express from 'express'
import authRoutes from './routes/authRoute.ts'
import userRoutes from './routes/userRoute.ts'

import habbitRoutes from './routes/habbitRoute.ts'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import { isTest } from '../env.ts'

const app = express()
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev', { skip: () => isTest() }))
app.get('/health', (req, res) => {
  res.json({ message: 'health kit' })
})
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/habbit', habbitRoutes)

export { app }
export default app
