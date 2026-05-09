import {
	type ChatInputCommandInteraction,
	GuildMember,
	MessageFlags,
} from "discord.js";
import { TagsCache } from "@/cache/tags.js";
import { prisma } from "@/db/prisma.js";
import { env } from "@/env.js";

export const transferTagOwnership = async (
	interaction: ChatInputCommandInteraction
) => {
	const tagName = interaction.options.getString("name", true);
	const newOwner = interaction.options.getUser("new_owner", true);
	const commandUser = interaction.member;
	if (!(commandUser instanceof GuildMember)) {
		await interaction.reply({
			content: "An error occurred while verifying your permissions.",
			flags: MessageFlags.Ephemeral,
		});
		return;
	}
	const tag =
		TagsCache.get(tagName) ||
		(await prisma.tag.findUnique({ where: { name: tagName } }));
	if (!tag) {
		await interaction.reply({
			content: `Tag \`${tagName}\` not found.`,
			flags: MessageFlags.Ephemeral,
		});
		return;
	}
	const moderatorRole = await commandUser.guild.roles.fetch(
		env.roles.moderator
	);

	const isServerOwner = commandUser.guild.ownerId === commandUser.id;
	const isModerator =
		moderatorRole !== null &&
		commandUser.roles.highest.position >= moderatorRole.position;
	const isTagOwner = tag.userId === commandUser.id;

	if (!isServerOwner && !isModerator && !isTagOwner) {
		await interaction.reply({
			content: `You do not own the tag \`${tagName}\`. Only the owner and moderators can transfer ownership.`,
			flags: MessageFlags.Ephemeral,
		});
		return;
	}
	if (tag.userId === newOwner.id) {
		await interaction.reply({
			content: `Tag \`${tagName}\` is already owned by ${newOwner.tag}.`,
			flags: MessageFlags.Ephemeral,
		});
		return;
	}

	if (tag.userId !== interaction.user.id) {
	}

	try {
		const updatedTag = await prisma.tag.update({
			where: { name: tagName },
			data: { userId: newOwner.id },
		});
		TagsCache.set(updatedTag);

		await interaction.reply({
			content: `Ownership of tag "${tagName}" has been transferred to ${newOwner.tag}.`,
			flags: MessageFlags.Ephemeral,
		});
	} catch (error) {
		console.error("Error transferring tag ownership:", error);
		await interaction.reply({
			content: `An error occurred while transferring ownership of tag "${tagName}".`,
			flags: MessageFlags.Ephemeral,
		});
	}
};
