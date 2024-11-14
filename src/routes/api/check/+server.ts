import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import chunkHashes from './chunkHashes.json';
import { type GetCheckOutput } from './types';
import fnv from 'fnv-plus';

const chunkHashesSet = new Set(chunkHashes);

function fnvHash(digits: string): string {
	return fnv.fast1a32hex(digits);
}

export const GET: RequestHandler = ({ url }) => {
	const digits = url.searchParams.get('digits') ?? '';
	const hash = fnvHash(digits);

	const result = chunkHashesSet.has(hash);

	return json({ result } as GetCheckOutput);
};
