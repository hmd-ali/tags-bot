import { basicErrorMessage } from "@/util/components/basic-message.js";
import type { ErrorMessage } from "./index.js";

export const Tags = {
	TagNotFound: (name) => basicErrorMessage(`Tag \`${name}\` not found.`),
	TagAlreadyExists: (name) =>
		basicErrorMessage(`Tag \`${name}\` already exists.`),
	MissingRole: basicErrorMessage(
		"You do not have the required role to use this command."
	),
	MissingPermissions: basicErrorMessage(
		"You do not have the required permissions to use this command."
	),
	OwnershipRequired: basicErrorMessage(
		"You must be the owner of this tag to use this command."
	),
} satisfies Record<string, ErrorMessage>;
