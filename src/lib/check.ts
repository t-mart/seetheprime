import { type GetCheckOutput } from '../routes/api/check/types';


export async function checkDigits(digits: string): Promise<boolean> {
	const response = await fetch(`/api/check?digits=${digits}`);
	const json = (await response.json()) as GetCheckOutput;
	return json.result;
}
