#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { randomBytes, pbkdf2Sync, createCipheriv } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_PATH = join(__dirname, '_content.html');
const INDEX_PATH = join(__dirname, 'index.html');
const ITER = 250000;
const START = '<!-- ENCRYPTED_CONTENT_START -->';
const END = '<!-- ENCRYPTED_CONTENT_END -->';

function promptHidden(question) {
	return new Promise((resolve, reject) => {
		const stdin = process.stdin;
		const stdout = process.stdout;
		stdout.write(question);
		stdin.resume();
		stdin.setEncoding('utf8');
		stdin.setRawMode(true);
		let value = '';
		const onData = (char) => {
			const str = char.toString('utf8');
			for (const c of str) {
				const code = c.charCodeAt(0);
				if (code === 10 || code === 13 || code === 4) {
					stdin.setRawMode(false);
					stdin.pause();
					stdin.removeListener('data', onData);
					stdout.write('\n');
					return resolve(value);
				}
				if (code === 3) {
					stdin.setRawMode(false);
					stdin.pause();
					stdin.removeListener('data', onData);
					return reject(new Error('aborted'));
				}
				if (code === 8 || code === 127) {
					value = value.slice(0, -1);
				} else if (code >= 32) {
					value += c;
				}
			}
		};
		stdin.on('data', onData);
	});
}

async function main() {
	const content = await readFile(CONTENT_PATH, 'utf8');
	const index = await readFile(INDEX_PATH, 'utf8');

	const startIdx = index.indexOf(START);
	const endIdx = index.indexOf(END);
	if (startIdx === -1 || endIdx === -1) {
		throw new Error(`Could not find ${START} / ${END} markers in index.html`);
	}

	const password = await promptHidden('Password: ');
	const confirm = await promptHidden('Confirm:  ');
	if (password !== confirm) {
		console.error('Passwords do not match.');
		process.exit(1);
	}
	if (!password) {
		console.error('Empty password.');
		process.exit(1);
	}

	const normalized = password.trim().toLowerCase();

	const salt = randomBytes(16);
	const iv = randomBytes(12);
	const key = pbkdf2Sync(normalized, salt, ITER, 32, 'sha256');

	const cipher = createCipheriv('aes-256-gcm', key, iv);
	const encrypted = Buffer.concat([cipher.update(content, 'utf8'), cipher.final()]);
	const authTag = cipher.getAuthTag();
	const ct = Buffer.concat([encrypted, authTag]);

	const blob = {
		salt: salt.toString('base64'),
		iv: iv.toString('base64'),
		ct: ct.toString('base64'),
		iter: ITER,
	};

	const replacement =
		START +
		'\n<script type="application/json" id="encrypted-content">\n' +
		JSON.stringify(blob) +
		'\n</script>\n' +
		END;

	const next =
		index.slice(0, startIdx) +
		replacement +
		index.slice(endIdx + END.length);

	await writeFile(INDEX_PATH, next, 'utf8');

	console.log(`Encrypted ${content.length} chars -> ${ct.length} bytes ciphertext.`);
	console.log(`Wrote ${INDEX_PATH}`);
}

main().catch((err) => {
	console.error(err.message || err);
	process.exit(1);
});
