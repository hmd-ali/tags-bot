// Matches 1–32 chars of alphanumeric, hyphen, or underscore
// and rejects purely numeric names.
const TAG_NAME_REGEX = /^(?!\d+$)[a-zA-Z0-9_-]{1,32}$/;

export const isValidTagName = (name: string): boolean =>
	TAG_NAME_REGEX.test(name);
