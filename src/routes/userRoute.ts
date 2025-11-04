import { Router } from 'express'
const router = Router()
router.get('/', (req, res) => {
  res.json({ mesaage: 'get all user' })
})
router.get('/:xid', (req, res) => {
  res.json({ mesaage: 'get one  user' })
})
router.put('/:id', (req, res) => {
  res.json({ message: 'user updated' })
})
router.delete('/:id', (req, res) => {
  res.json({ message: 'user deleted' })
})
export default router
