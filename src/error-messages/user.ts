import { basicErrorMessage } from "@/util/components/basic-message.js";
import type { ErrorMessage } from "./index.js";

export const User = {
	UnableToVerifyPermissions: basicErrorMessage(
		"An error occurred while verifying your permissions."
	),
} satisfies Record<string, ErrorMessage>;
