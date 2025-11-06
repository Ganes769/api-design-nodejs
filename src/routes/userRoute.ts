import { Router } from 'express'
import { authencitatedToken } from '../middleware/auth.ts'
const router = Router()
router.use(authencitatedToken)
router.get('/', (req, res) => {
  res.json({ mesaage: 'get all user' })
})
router.get('/:id', (req, res) => {
  res.json({ mesaage: 'get one  user' })
})
router.put('/:id', (req, res) => {
  res.json({ message: 'user updated' })
})
router.delete('/:id', (req, res) => {
  res.json({ message: 'user deleted' })
})
export default router
