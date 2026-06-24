import { prisma } from "@/db/prisma.js";

const seed = async () => {
	console.log("Seeding database with tags...");
	await prisma.tag.createMany({
		data: [
			{
				name: "tag-1",
				content: "This is the first tag.",
				desc: "The first tag in the database.",
				lastModifiedBy: "123456789012345678",
				uses: 2,
			},
			{
				name: "tag-2",
				content: "This is the second tag.",
				desc: "The second tag in the database.",
				lastModifiedBy: "123456789012345678",
				uses: 0,
			},
			{
				name: "tag-3",
				content: "This is the third tag.",
				desc: "The third tag in the database.",
				lastModifiedBy: "123456789012345678",
				uses: 0,
			},
			{
				name: "tag-4",
				content: "This is the fourth tag.",
				desc: "The fourth tag in the database.",
				lastModifiedBy: "123456789012345678",
				uses: 0,
			},
			{
				name: "tag-5",
				content: "This is the fifth tag.",
				desc: "The fifth tag in the database.",
				lastModifiedBy: "123456789012345678",
				uses: 0,
			},
			{
				name: "tag-6",
				content: "This is the sixth tag.",
				desc: "The sixth tag in the database.",
				lastModifiedBy: "123456789012345678",
				uses: 0,
			},
			{
				name: "tag-7",
				content: "This is the seventh tag.",
				desc: "The seventh tag in the database.",
				lastModifiedBy: "123456789012345678",
				uses: 0,
			},
			{
				name: "tag-8",
				content: "This is the eighth tag.",
				desc: "The eighth tag in the database.",
				lastModifiedBy: "123456789012345678",
				uses: 0,
			},
			{
				name: "tag-9",
				content: "This is the ninth tag.",
				desc: "The ninth tag in the database.",
				lastModifiedBy: "123456789012345678",
				uses: 0,
			},
			{
				name: "tag-10",
				content: "This is the tenth tag.",
				desc: "The tenth tag in the databased.",
				lastModifiedBy: "123456789012345678",
				uses: 0,
			},
			{
				name: "tag-11",
				content: "This is the eleventh tag.",
				desc: "The eleventh tag in the database.",
				lastModifiedBy: "123456789012345678",
				uses: 0,
			},
			{
				name: "tag-12",
				content: "This is the twelfth tag.",
				desc: "The twelfth tag in the database.",
				lastModifiedBy: "123456789012345678",
				uses: 0,
			},
			{
				name: "tag-13",
				content: "This is the thirteenth tag.",
				desc: "The thirteenth tag in the database.",
				lastModifiedBy: "123456789012345678",
				uses: 0,
			},
			{
				name: "tag-14",
				content: "This is the fourteenth tag.",
				desc: "The fourteenth tag in the database.",
				lastModifiedBy: "123456789012345678",
				uses: 3,
			},
			{
				name: "tag-15",
				content: "This is the fifteenth tag.",
				desc: "The fifteenth tag in the database.",
				lastModifiedBy: "123456789012345678",
				uses: 0,
			},
			{
				name: "tag-16",
				content: "This is the sixteenth tag.",
				desc: "The sixteenth tag in the database.",
				lastModifiedBy: "123456789012345678",
				uses: 0,
			},
			{
				name: "tag-17",
				content: "This is the seventeenth tag.",
				desc: "The seventeenth tag in the database.",
				lastModifiedBy: "123456789012345678",
				uses: 0,
			},
			{
				name: "tag-18",
				content: "This is the eighteenth tag.",
				desc: "The eighteenth tag in the database.",
				lastModifiedBy: "123456789012345678",
				uses: 0,
			},
			{
				name: "tag-19",
				content: "This is the nineteenth tag.",
				desc: "The nineteenth tag in the database.",
				lastModifiedBy: "123456789012345678",
				uses: 0,
			},
			{
				name: "tag-20",
				content: "This is the twentieth tag.",
				desc: "The twentieth tag in the database.",
				lastModifiedBy: "123456789012345678",
				uses: 0,
			},
			{
				name: "tag-21",
				content: "This is the twenty-first tag.",
				desc: "The twenty-first tag in the database.",
				lastModifiedBy: "123456789012345678",
				uses: 0,
			},
			{
				name: "tag-22",
				content: "This is the twenty-second tag.",
				desc: "The twenty-second tag in the database.",
				lastModifiedBy: "123456789012345678",
				uses: 0,
			},
			{
				name: "tag-23",
				content: "This is the twenty-third tag.",
				desc: "The twenty-third tag in the database.",
				lastModifiedBy: "123456789012345678",
				uses: 0,
			},
			{
				name: "format",
				content:
					"Did you know you can add syntax highlighting to code blocks in markdown? Just add the language name after the opening triple backticks. For example:\n\n> ```js\n> console.log('Hello, world!');\n> ```\n\nThis will render as:\n\n```js\nconsole.log('Hello, world!');\n```\n\nYou can replace `js` with other languages too, e.g. `php`, `css`, `html`, `ts`, `md`, `sql`, etc.",
				desc: "shows hows to format on discord",
				lastModifiedBy: "700622520570740791",
				uses: 6,
			},
			{
				name: "aab",
				content: "aab",
				desc: "aab",
				lastModifiedBy: "266279254831005697",
				uses: 0,
			},
			{
				name: "eb",
				content: "Eb is **NOT** D#. :angry:",
				desc: "This is Eb's tag.",
				lastModifiedBy: "700622520570740791",
				uses: 10,
			},
			{
				name: "md-test",
				content:
					'# Foo\n## Bar\n### Baz\n\n- Unordered\n- List\n\n1. Ordered\n2. List.\n\n||Spoiler.||\n~~Strike-through.~~\n*Italics.*\n**Bold.**\n\n```js\nalert("Hello, World!");\n```',
				desc: "Testing Markdown.",
				lastModifiedBy: "266279254831005697",
				uses: 4,
			},
			{
				name: "has-image",
				content:
					"Hello check this image out\n- some markdown\nhttps://cdn.discordapp.com/attachments/1427796163322708160/1502065513533280296/image.png?ex=69fe5b05&is=69fd0985&hm=1bf5c427e43aa4220f6dfa37c4258c2628ebcfa9a9572b576e9cf7365d3c449f&",
				desc: "has image",
				lastModifiedBy: "700622520570740791",
				uses: 2,
			},
			{
				name: "my-image-test",
				content:
					"https://cdn.discordapp.com/attachments/1427796163322708160/1502065513533280296/image.png?ex=69fe5b05&is=69fd0985&hm=1bf5c427e43aa4220f6dfa37c4258c2628ebcfa9a9572b576e9cf7365d3c449f&",
				desc: "My image test.",
				lastModifiedBy: "700622520570740791",
				uses: 1,
			},
			{
				name: "wiki",
				content: "The name's Pedia. Wiki Pedia.",
				desc: "Wiki.",
				lastModifiedBy: "700622520570740791",
				uses: 5,
			},
			{
				name: "long-desc",
				content: "...",
				desc: "This short description is actually a long description. This short description is actually a long description. This short description is actually a long description. This short description is actually a long description. This short description is actually a long description. This short description is actually a long description. This short description is actually a long description. This short description is actually a long description. This short description is actually a long description.",
				lastModifiedBy: "700622520570740791",
				uses: 5,
			},
		].map((tag) => ({
			...tag,
		})),
	});
	console.log("Database seeded with tags.");
};

seed();
