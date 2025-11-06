import { Router } from 'express'
import { z } from 'zod'
import { validateBody } from '../middleware/validation.ts'
import { authencitatedToken } from '../middleware/auth.ts'
const createHabbitSchema = z.object({
  name: z.string(),
})
const router = Router()
router.use(authencitatedToken)
router.get('/', (req, res) => {
  res.json({ message: 'habbit' })
})
router.get('/:id', (req, res) => {
  res.json({ message: 'habbit' })
})
router.post('/', validateBody(createHabbitSchema), (req, res) => {
  res.json({ message: 'habbit' })
})
router.delete('/:id', (req, res) => {
  res.json({ message: 'delete 1 create' })
})
router.post('/:id/complete', (req, res) => {
  res.json({ message: 'habbit complete' })
})
export default router
