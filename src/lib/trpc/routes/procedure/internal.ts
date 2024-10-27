import {
	add_child as doc_add_child,
	create as doc_create,
	get as doc_get,
	remove_child_from_name as doc_remove_child
} from '$trpc/routes/document/internal';
import fs from 'fs';
import path from 'path';

import parser from './latex/latex-log-parser';
import { compileTex } from './latex/tex-compiler';

function generate_workspace(id: string) {
	return fs.mkdtempSync(id);
}

export async function compile_latex(
	document_id: string,
	token: string,
	encoding: BufferEncoding,
	resource_name: string
) {
	const object = await doc_get(document_id, token);
	if (object.children.get(resource_name) != null) {
		await doc_remove_child(document_id, token, resource_name);
	}

	const txt = Buffer.from(object.bytes).toString(encoding);

	const workspace = generate_workspace(document_id);

	try {
		const latex_file = path.join(workspace, 'main.tex');
		const log_path = path.join(workspace, 'main.log');
		const pdf_path = path.join(workspace, 'main.pdf');
		fs.writeFileSync(latex_file, txt);

		await compileTex(latex_file);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const data: any[] = [];

		const stream = fs.readFileSync(log_path, {
			encoding: 'utf8'
		});

		const parsing_result = parser().parse(stream, { ignoreDuplicates: true });

		if (parsing_result.errors.length > 0) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			parsing_result.errors.forEach((item: any) => {
				data.push({
					row: --item.line,
					text: item.message,
					type: item.level
				});
			});
		}

		const ressource_id = await doc_create(token, document_id, true, Buffer.from([0]), {
			errors: data
		});

		await doc_add_child(document_id, token, resource_name, ressource_id);

		let pdf_data = undefined;

		if (fs.existsSync(pdf_path)) {
			pdf_data = Buffer.from(fs.readFileSync(pdf_path).buffer);

			const pdf_document_id = await doc_create(token, ressource_id, true, pdf_data);

			await doc_add_child(ressource_id, token, 'pdf', pdf_document_id);
		}

		const log_document_id = await doc_create(
			token,
			ressource_id,
			true,
			Buffer.from(fs.readFileSync(log_path).buffer),
			{ errors: data }
		);
		await doc_add_child(ressource_id, token, 'log', log_document_id);

		return { bytes: pdf_data, errors: data };
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
	} catch (e: any) {
		/* empty */
	} finally {
		fs.rmSync(workspace, { recursive: true, force: true });
	}
}
