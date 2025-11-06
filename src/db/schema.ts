import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { email } from 'zod'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  firstname: varchar('first_name', { length: 50 }),
  lastname: varchar('last_name', { length: 50 }),
  createdAT: timestamp('creadtedAt').defaultNow().notNull(),
  updateedAT: timestamp('updatedAt').defaultNow().notNull(),
})

export const habbits = pgTable('habbits', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),
  frequency: varchar('frequency', { length: 20 }).notNull(),
  targetCount: integer('target_count').default(1),
  isActive: boolean('is_active').default(true).notNull(),
  createdAT: timestamp('creadtedAt').defaultNow().notNull(),
  updateedAT: timestamp('updatedAt').defaultNow().notNull(),
})
export const entries = pgTable('entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  habbitId: uuid('habbit_id')
    .references(() => habbits.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  completionDate: timestamp('completion_date').defaultNow().notNull(),
  note: text('note'),
  createdAT: timestamp('creadtedAt').defaultNow().notNull(),
})
export const tags = pgTable('tages', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  color: varchar('color', { length: 7 }).default('#'),
  createdAT: timestamp('creadtedAt').defaultNow().notNull(),
})
export const habbitTags = pgTable('habbitTags', {
  id: uuid('id').primaryKey().defaultRandom(),
  habbitId: uuid('habbit_id')
    .references(() => habbits.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  tagId: uuid('tag_id')
    .references(() => tags.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  createdAT: timestamp('creadtedAt').defaultNow().notNull(),
})
export const userRelations = relations(users, ({ many }) => ({
  habbits: many(habbits),
}))
export const habbitsRelations = relations(habbits, ({ one, many }) => ({
  user: one(users, {
    fields: [habbits.userId],
    references: [users.id],
  }),
  entries: many(entries),
  habbitTags: many(habbitTags),
}))
export const entriesRelations = relations(entries, ({ one }) => ({
  habbit: one(habbits, {
    fields: [entries.habbitId],
    references: [habbits.id],
  }),
}))

export const tagsRelations = relations(tags, ({ many }) => ({
  habbitTags: many(habbitTags),
}))
export const habbitTagsRelations = relations(habbitTags, ({ one }) => ({
  habbit: one(habbits, {
    fields: [habbitTags.habbitId],
    references: [habbits.id],
  }),
  tags: one(tags, { fields: [habbitTags.tagId], references: [tags.id] }),
}))

export type Users = typeof users.$inferSelect
export type Habbit = typeof habbits.$inferSelect
export type Entry = typeof entries.$inferSelect
export type Tags = typeof tags.$inferSelect
export type HabbitTags = typeof habbitTags.$inferSelect
export const insertUserSchema = createInsertSchema(users)
export const selectUserSchema = createSelectSchema(users)
