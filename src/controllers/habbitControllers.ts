import type { Response } from 'express'
import db from '../db/connection.ts'
import { habbits, habbitTags } from '../db/schema.ts'
import type { AuthenticatedRequest } from '../middleware/auth.ts'
import { and, desc, eq } from 'drizzle-orm'
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
export const getHabbitById = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const id = req.params.id

    const habbit = await db.query.habbits.findFirst({
      where: and(eq(habbits.id, id), eq(habbits.userId, req.user!.id)),
      with: {
        habbitTags: {
          with: {
            tags: true,
          },
        },
      },
    })

    if (!habbit) {
      return res.status(404).json({ error: 'habbit not found' })
    }

    const habbitWithTags = {
      ...habbit,
      tags: habbit.habbitTags.map((ht) => ht.tags),
      habbitTags: undefined as unknown as never,
    }

    return res.status(200).json({ habbit: habbitWithTags })
  } catch (error) {
    return res.status(500).json({ error: 'failed to fetch habbit' })
  }
}

export const updateHabbit = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const id = req.params.id
    const { tagId, ...updates } = req.body
    const result = await db.transaction(async (tx) => {
      const [updateHabbit] = await tx
        .update(habbits)
        .set({ ...updates, updateedAT: new Date() })
        .where(and(eq(habbitTags.id, id), eq(habbits.userId, req.user.id)))
        .returning()
      if (tagId !== undefined) {
        await tx.delete(habbitTags).where(eq(habbitTags.habbitId, id))
      }
      if (tagId.length > 0) {
        const habbittagvalue = tagId.map((tagId) => ({
          habbitId: id,
          tagId,
        }))
        await tx.insert(habbitTags).values(habbittagvalue)
      }
      if (!updateHabbit) {
        return res.status(401).json({ message: 'habbbit not found' })
      }
      return updateHabbit
    })
    res.json({ message: 'habbit updated' })
  } catch (error) {}
}

export const deleteHabbit = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const id = req.params.id

    const result = await db.transaction(async (tx) => {
      // First, delete associated habbitTags
      await tx.delete(habbitTags).where(eq(habbitTags.habbitId, id))

      // Then delete the habit itself
      const [deletedHabbit] = await tx
        .delete(habbits)
        .where(and(eq(habbits.id, id), eq(habbits.userId, req.user!.id)))
        .returning()

      return deletedHabbit
    })

    if (!result) {
      return res.status(404).json({ error: 'habbit not found' })
    }

    return res.status(200).json({ message: 'habbit deleted successfully' })
  } catch (error) {
    return res.status(500).json({ error: 'failed to delete habbit' })
  }
}
