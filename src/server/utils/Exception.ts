export class Exception {
	public readonly isException = true;

	constructor(
		public readonly code: number,
		public readonly msg: string,
		public readonly data?: Readonly<Record<string, unknown>>
	) {}
}
