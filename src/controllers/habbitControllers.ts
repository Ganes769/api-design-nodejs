import type { Response } from 'express'
import db from '../db/connection.ts'
import { habbits, habbitTags } from '../db/schema.ts'
import type { AuthenticatedRequest } from '../middleware/auth.ts'
import { desc, eq } from 'drizzle-orm'
export const createHabbit = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { name, description, frequency, targetCount = 1, tagsId } = req.body

    const result = await db.transaction(async (txs) => {
      const [newHabbit] = await txs
        .insert(habbits)
        .values({
          userId: req.user!.id,
          name,
          frequency,
          targetCount,
          description,
        })
        .returning()

      if (Array.isArray(tagsId) && tagsId.length > 0) {
        const habbitTagValues = tagsId.map((tagId: string) => ({
          habbitId: newHabbit.id,
          tagId,
        }))
        await txs.insert(habbitTags).values(habbitTagValues)
      }

      return newHabbit
    })

    return res.status(201).json({ message: 'habbit created', result })
  } catch (error) {
    // In case of any error, ensure we respond instead of hanging
    return res.status(500).json({ error: 'failed to create habbit' })
  }
}

export const getUserHabbits = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userHabits = await db.query.habbits.findMany({
      where: eq(habbits.userId, req.user!.id),
      with: {
        habbitTags: {
          with: {
            tags: true,
          },
        },
      },
      orderBy: [desc(habbits.createdAT)],
    })
    const habitsWithTags = userHabits.map((habit) => ({
      ...habit,
      tags: habit.habbitTags.map((ht) => ht.tags),
      // drop habbitTags from payload to avoid duplication/noise
      habbitTags: undefined as unknown as never,
    }))
    return res.status(200).json({ habits: habitsWithTags })
  } catch (error) {
    return res.status(500).json({ error: 'failed to fetch habbits' })
  }
}
