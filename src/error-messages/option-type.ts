import { basicErrorMessage } from "@/util/components/basic-message.js";
import type { ErrorMessage } from "./index.js";

export const OptionTypes = {
	WrongType: (expectedType: string, actualType: string) =>
		basicErrorMessage(
			`Expected option of type \`${expectedType}\`, but got \`${actualType}\`.`
		),
} satisfies Record<string, ErrorMessage>;
