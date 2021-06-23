import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
	{
		name: 'Alice',
		email: 'alice@gmail.com',
		password: '$2a$10$TLtC603wy85MM./ot/pvEec0w2au6sjPaOmLpLQFbxPdpJH9fDwwS',
		posts: {
			create: [
				{
					title: 'Alice first Post',
					content: 'first post',
					publised: true,
				}
			]
		}
	},
	{
		name: 'Talmeez',
		email: 'talmeez@gmail.com',
		password: '$2a$10$TLtC603wy85MM./ot/pvEec0w2au6sjPaOmLpLQFbxPdpJH9fDwwS',
		posts: {
			create: [
				{
					title: 'Talmeez first Post',
					content: 'first post',
				}
			]
		}
	}
];


async function main() {
	console.log(`Start seeding...`);
	for (const u of userData) {
		const user = await prisma.user.create({
			data: u,
		});
		console.log(`Created user with id: ${user.id}`);
	}
	console.log('Seeding finished.');
}

main()
	.catch((e) => {
		console.log(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	})