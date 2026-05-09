export const truncate = (text: string, length: number): string => {
	if (text.length <= length) return text;
	const truncated = text.slice(0, length - 3);
	const lastSpace = truncated.lastIndexOf(" ");
	return `${lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated}...`;
};
