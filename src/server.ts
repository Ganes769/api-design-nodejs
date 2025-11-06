import express from 'express'
import authRoutes from './routes/authRoute.ts'
import userRoutes from './routes/userRoute.ts'

import habbitRoutes from './routes/habbitRoute.ts'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import { isTest } from '../env.ts'
import { errorHandler } from './middleware/errorhandler.ts'

const app = express()
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev', { skip: () => isTest() }))

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/habbit', habbitRoutes)
app.use(errorHandler)

export { app }
export default app
