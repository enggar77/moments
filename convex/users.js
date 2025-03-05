import { query, mutation } from './_generated/server';
import { v } from 'convex/values';
import { ADMIN_EMAILS, ORGANIZER_EMAILS } from '../src/components/utils';

export const createUser = mutation({
	args: {
		clerkId: v.string(),
		email: v.string(),
		name: v.string(),
	},
	handler: async (ctx, args) => {
		const existingUser = await ctx.db
			.query('users')
			.filter((q) => q.eq(q.field('clerkId'), args.clerkId))
			.first();

		if (existingUser) {
			return existingUser._id;
		}

		return await ctx.db.insert('users', {
			clerkId: args.clerkId,
			email: args.email,
			name: args.name,
			role: ORGANIZER_EMAILS.includes(args.email)
				? 'organizer'
				: ADMIN_EMAILS.includes(args.email)
					? 'admin'
					: 'user',
		});
	},
});

export const getAllUsers = query({
	handler: async (ctx) => {
		return await ctx.db.query('users').all();
	},
});

export const getUserById = query({
	args: {
		clerkId: v.string(),
	},
	handler: async (ctx, args) => {
		return await ctx.db
			.query('users')
			.filter((q) => q.eq(q.field('clerkId'), args.clerkId))
			.first();
	},
});
