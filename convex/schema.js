import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
	users: defineTable({
		clerkId: v.string(),
		email: v.string(),
		name: v.string(),
		role: v.union(
			v.literal('admin'),
			v.literal('organizer'),
			v.literal('user')
		),
	}).index('by_clerkId', ['clerkId']),
});
