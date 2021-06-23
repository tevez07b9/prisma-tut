import { asNexusMethod, makeSchema, objectType } from "nexus";
import { Context } from "./context";
import { DateTimeResolver } from 'graphql-scalars';

export const DateTime = asNexusMethod(DateTimeResolver, 'date');

const User = objectType({
	name: 'User',
	definition(t) {
		t.nonNull.int('id')
		t.string('name')
		t.nonNull.string('email')
		t.nonNull.list.nonNull.field('posts', {
			type: 'Post',
			resolve: (parent, _, context: Context) => {
				return context.prisma.user
					.findUnique({
						where: { id: parent.id || undefined }
					})
					.posts()
			}
		})
	}
})

const Post = objectType({
	name: 'Post',
	definition(t) {
		t.nonNull.int('id')
		t.nonNull.field('createdAt', { type: 'DateTime' })
		t.nonNull.field('updatedAt', { type: 'DateTime' })
		t.nonNull.string('title')	
		t.string('content')
		t.nonNull.boolean('published')
		t.nonNull.int('viewCount')
		t.field('author', {
			type: 'User',
			resolve: (parent, _, context: Context) => {
				return context.prisma.post
					.findUnique({
						where: { id: parent.id || undefined }
					})
					.author()
			}
		})

	}
})

const Query = objectType({
	name: 'Query',
	definition(t) {
		t.nonNull.list.nonNull.field('allUsers', {
			type: 'User',
			resolve: (_parent, _args, context: Context) => {
				return context.prisma.user.findMany()
			}
		})

		t.nonNull.list.nonNull.field('allPosts', {
			type: 'Post',
			resolve: (_parent, _args, context: Context) => {
				return context.prisma.post.findMany()
			}
		})
	}
});

export const schema = makeSchema({
	types: [Query, User, Post, DateTime],
	outputs: {
		schema: __dirname + '/../schema.graphql',
		typegen: __dirname + '/generated/nexus.ts',
	},
	contextType: {
		module: require.resolve('./context'),
		export: 'Context',
	},
	sourceTypes: {
		modules: [
			{
				module: '@prisma/client',
				alias: 'prisma',
			}
		]
	}
});