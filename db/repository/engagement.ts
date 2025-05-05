import { EngagementEntity, engagementTable } from '../schema';
import { LOCALDB } from '../database';
import { SelectedFields } from 'drizzle-orm//sqlite-core';
import { eq, SQL } from 'drizzle-orm';

const EngagementRepository = {
    async getEngagement(id: string): Promise<EngagementEntity | undefined> {
        try {
            return undefined;
        } catch (error) {
            console.log('Failed to get engagement: ', error);
        }
    },

    /**
     * Get engagements
     * @param fields
     * @returns
     */
    async getEngagements<TSelection extends SelectedFields>(
        fields: TSelection = null
    ) {
        try {
            const res = await LOCALDB.select(engagementTable, fields);
            return res;
        } catch (error) {
            console.log('Failed to get engagement: ', error);
        }
    },

    /**
     * Insert new record
     * @param engagement
     * @returns
     */
    async insert(engagement: EngagementEntity) {
        try {
            return await LOCALDB.insert(engagementTable, {
                name: engagement.name,
                engagement_name: engagement.engagement_name,
                engagement_type: engagement.engagement_type,
                description: engagement.description,
                cover_image: engagement.cover_image,
                closing_date: engagement.closing_date,
                status: engagement.status,
                engagement_form: engagement.engagement_form,
                has_discussion_forum: engagement.has_discussion_forum,
                has_formal_submissions: engagement.has_formal_submissions,
                has_guestbook: engagement.has_guestbook,
                has_ideas: engagement.has_ideas,
                has_map: engagement.has_map,
                has_qa: engagement.has_qa,
                include_quick_poll: engagement.include_quick_poll,
                is_published: engagement.is_published,
                question: engagement.question,
                quick_poll: engagement.quick_poll,
                createdBy: engagement.createdBy,
                createdAt: engagement.createdAt || new Date(),
                updatedAt: engagement.updatedAt || new Date(),
            });
        } catch (error) {
            console.error('Failed to save engagement: ', error);
        }
    },

    /**
     * Update record
     * @param engagement
     * @returns
     */
    async update(engagement: EngagementEntity) {
        try {
            return await LOCALDB.update(
                engagementTable,
                {
                    name: engagement.name,
                    engagement_name: engagement.engagement_name,
                    engagement_type: engagement.engagement_type,
                    description: engagement.description,
                    cover_image: engagement.cover_image,
                    closing_date: engagement.closing_date,
                    status: engagement.status,
                    engagement_form: engagement.engagement_form,
                    has_discussion_forum: engagement.has_discussion_forum,
                    has_formal_submissions: engagement.has_formal_submissions,
                    has_guestbook: engagement.has_guestbook,
                    has_ideas: engagement.has_ideas,
                    has_map: engagement.has_map,
                    has_qa: engagement.has_qa,
                    include_quick_poll: engagement.include_quick_poll,
                    is_published: engagement.is_published,
                    question: engagement.question,
                    quick_poll: engagement.quick_poll,
                    // createdBy: engagement.createdBy,
                    // createdAt: engagement.createdAt || new Date(),
                    updatedAt: engagement.updatedAt || new Date(),
                },
                eq(engagementTable.name, engagement.name),
                { name: engagementTable.name }
            );
        } catch (error) {
            console.error('Failed to update engagement: ', error);
        }
    },

    async upsert(
        engagement: EngagementEntity
    ): Promise<EngagementEntity | undefined> {
        try {
            return undefined;
        } catch (error) {
            console.log('Failed to get engagement: ', error);
        }
    },

    /**
     * Delete single record
     * @param engagement
     * @returns
     */
    async delete(engagement: EngagementEntity | string) {
        try {
            const where =
                typeof engagement == 'string'
                    ? eq(engagementTable.name, engagement)
                    : eq(engagementTable.name, engagement.name);
            return await LOCALDB.remove(engagementTable, where, {
                name: engagementTable.name,
            });
        } catch (error) {
            console.error('Failed to delete engagement: ', error);
        }
    },

    /**
     * Delete all records
     * @param engagement
     * @returns
     */
    async deleteAll() {
        try {
            return await LOCALDB.remove(engagementTable, undefined, {
                name: engagementTable.name,
            });
        } catch (error) {
            console.error('Failed to delete engagement: ', error);
        }
    },
} as const;

export default EngagementRepository;
