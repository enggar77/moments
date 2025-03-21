import { query, mutation } from './_generated/server';
import { v } from 'convex/values';
import { ORGANIZER_EMAILS } from './constants';

export const createUser = mutation({
	args: {
		userId: v.string(),
		email: v.string(),
		name: v.string(),
	},
	handler: async (ctx, args) => {
		const isOrganizer = ORGANIZER_EMAILS.includes(args.email);

		const existingUser = await ctx.db
			.query('users')
			.withIndex('by_userId', (q) => q.eq('userId', args.userId))
			.first();

		if (existingUser) {
			return existingUser.userId;
		}

		return await ctx.db.insert('users', {
			userId: args.userId,
			email: args.email,
			name: args.name,
			role: isOrganizer ? 'organizer' : 'user',
			stripeConnectId: undefined,
		});
	},
});

export const getAllUsers = query({
	handler: async (ctx) => {
		// Fixed: using collect() instead of all()
		return await ctx.db.query('users').collect();
	},
});

export const getUser = query({
	args: { userId: v.string() },
	handler: async (ctx, args) => {
		return await ctx.db
			.query('users')
			.filter((q) => q.eq(q.field('userId'), args.userId))
			.first();
	},
});

export const getUsersStripeConnectId = query({
	args: { userId: v.string() },
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query('users')
			.filter((q) => q.eq(q.field('userId'), args.userId))
			.filter((q) => q.neq(q.field('stripeConnectId'), undefined))
			.first();
		return user?.stripeConnectId;
	},
});

export const updateOrCreateUserStripeConnectId = mutation({
	args: { userId: v.string(), stripeConnectId: v.string() },
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query('users')
			.withIndex('by_userId', (q) => q.eq('userId', args.userId))
			.first();

		if (!user) {
			throw new Error('User not found');
		}

		await ctx.db.patch(user._id, { stripeConnectId: args.stripeConnectId });
	},
});

export const deleteUser = mutation({
	args: { userId: v.string() },
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query('users')
			.withIndex('by_userId', (q) => q.eq('userId', args.userId))
			.first();

		if (!user) {
			throw new Error('User not found');
		}

		await ctx.db.delete(user._id);
	},
});

export const changeUserRole = mutation({
	args: { userId: v.string(), role: v.string() },
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query('users')
			.withIndex('by_userId', (q) => q.eq('userId', args.userId))
			.first();

		if (!user) {
			throw new Error('User not found');
		}

		await ctx.db.patch(user._id, { role: args.role });
	},
});
