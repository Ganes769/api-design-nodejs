import { Router } from 'express'
import { z } from 'zod'
import { validateBody } from '../middleware/validation.ts'
import { authencitatedToken } from '../middleware/auth.ts'
import {
  createHabbit,
  getUserHabbits,
  getHabbitById,
  updateHabbit,
  deleteHabbit,
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
router.get('/:id', getHabbitById)
router.patch('/:id', updateHabbit)
router.post('/', validateBody(createHabbitSchema), createHabbit)
router.delete('/:id', deleteHabbit)

export default router
