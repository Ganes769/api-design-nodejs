import { Router } from 'express'
const router = Router()
router.post('/register', (req, res) => {
  res.status(201).json({ message: 'register router' })
})
router.post('/login', (req, res) => {
  res.status(201).json({ message: 'login router' })
})
export default router
