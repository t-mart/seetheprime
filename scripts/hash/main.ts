import { readFileSync, writeFileSync } from 'fs';
import { createHash } from 'crypto';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fnv from 'fnv-plus';

const primeURL = 'https://www.mersenne.org/primes/digits/M136279841.zip';
const chunkSize = 419;

// precomputed values for validation
const primeStringLength = 41024320;
const primeStringSHA256Hash = '14b98acc8e181001c699ad6a4cabe3858ba011fb782d570628312482bc8a2cde';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const primeFileName = 'm136279841.txt';
const primeFilePath = join(scriptDir, primeFileName);

const outPath = join(scriptDir, '../../src/routes/api/check/chunkHashes.json');

const setupErrorInstructions = `Ensure you've downloaded the correct prime from ${primeURL} and extracted ${primeFilePath} to the same directory as this script.`;

let fileData: string;
try {
	fileData = readFileSync(primeFilePath, 'utf8');
} catch (err) {
	// check if the error is a file not found error
	if (err.code === 'ENOENT') {
		console.error(`Prime not found. ${setupErrorInstructions}`);
		process.exit(1);
	} else {
		throw err;
	}
}

// do some basic validation. here, digit length
const digits = fileData.replace(/\D/g, '');
if (digits.length !== primeStringLength) {
	console.error(`Digit length check: ❌. ${setupErrorInstructions}`);
	process.exit(1);
}
console.log(`Digit length check: ✅`);

// and hash
const hash = createHash('sha256').update(digits).digest('hex');
if (hash !== primeStringSHA256Hash) {
	console.error(`Hash check: ❌. ${setupErrorInstructions}`);
	process.exit(1);
}
console.log(`Hash check: ✅`);

function* stringChunks() {
	for (let i = 0; i < digits.length; i += chunkSize) {
		yield digits.slice(i, i + chunkSize);
	}
}

const chunkHashes: string[] = [...stringChunks()].map((chunk) => fnv.fast1a32hex(chunk));

writeFileSync(outPath, JSON.stringify(chunkHashes));

// console log the absolute path to the chunkHashes.json file
console.log(`Chunk hashes written to ${outPath}`);
