import type { Request, Response } from 'express'
import { comparePasswords, hashPassword } from '../utils/password.ts'
import db from '../db/connection.ts'
import { users } from '../db/schema.ts'
import { generateToken } from '../utils/jwt.ts'
import { eq } from 'drizzle-orm'

export const register = async (req: Request, res: Response) => {
  try {
    const { email, username, password, firstname, lastname } = req.body
    const hashpassword = await hashPassword(password)
    const [user] = await db
      .insert(users)
      .values({
        email,
        username,
        firstname,
        lastname,
        password: hashpassword,
      })
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        firstname: users.firstname,
        lastname: users.lastname,
        createdAt: users.createdAT,
      })
    const token = await generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    })
    res.status(201).json({ message: 'User created successfully', user, token })
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: 'server error' })
  }
}
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    })
    if (!user) {
      return res.status(401).json({ message: 'user doesnt exsist' })
    }
    const isValidPassword = await comparePasswords(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ message: 'invalid cred' })
    }
    const token = await generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    })
    return res.json({
      message: 'login success',
      token,
    })
  } catch (e) {
    console.log('error', e)
  }
}
