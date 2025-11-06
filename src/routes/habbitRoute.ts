import { Router } from 'express'
import { z } from 'zod'
import { validateBody } from '../middleware/validation.ts'
import { authencitatedToken } from '../middleware/auth.ts'
import {
  createHabbit,
  getUserHabbits,
} from '../controllers/habbitControllers.ts'
const createHabbitSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  frequency: z.string().min(1),
  targetCount: z.number().int().positive().optional(),
  tagsId: z.array(z.string()).optional(),
})
const router = Router()
router.use(authencitatedToken)
router.get('/', getUserHabbits)
router.get('/:id', (req, res) => {
  res.json({ message: 'habbit' })
})
router.post('/', validateBody(createHabbitSchema), createHabbit)
router.delete('/:id', (req, res) => {
  res.json({ message: 'delete 1 create' })
})
router.post('/:id/complete', (req, res) => {
  res.json({ message: 'habbit complete' })
})
export default router
