import { integer, text, sqliteTable } from 'drizzle-orm/sqlite-core';

export const userTable = sqliteTable('user', {
    name: text().primaryKey(),
    email: text(),
    full_name: text(),
    password: text(),
});

export const engagementTable = sqliteTable('engagement', {
    name: text().primaryKey(),
    engagement_name: text().notNull(),
    engagement_type: text(),
    description: text(),
    cover_image: text(),
    closing_date: integer({ mode: 'timestamp' }),
    status: text(),
    engagement_form: text(),
    has_discussion_forum: integer({ mode: 'boolean' }),
    has_formal_submissions: integer({ mode: 'boolean' }),
    has_guestbook: integer({ mode: 'boolean' }),
    has_ideas: integer({ mode: 'boolean' }),
    has_map: integer({ mode: 'boolean' }),
    has_qa: integer({ mode: 'boolean' }),
    include_quick_poll: integer({ mode: 'boolean' }),
    is_published: integer({ mode: 'boolean' }),
    question: text(),
    quick_poll: text(),
    createdBy: text(),
    createdAt: integer({ mode: 'timestamp' }),
    updatedAt: integer({ mode: 'timestamp' }),
});

// Export to use as an interface in your app
export type UserEntity = typeof userTable.$inferSelect;
export type EngagementEntity = typeof engagementTable.$inferSelect;
