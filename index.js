const getPort = require('get-port');

const defaultConfig = require('./util/config');
const serveDirectory = require('./util/serve-dir');
const { getDir } = require('./util/helpers');
const mdToPdf = require('./util/md-to-pdf');

/**
 * Convert a markdown file to PDF.
 *
 * @param {string} mdFile path to markdown file
 * @param {*} [config] config object
 *
 * @returns the path that the PDF was written to
 */
module.exports = async (mdFile, config) => {
	if (typeof mdFile !== 'string') {
		throw new TypeError(`mdFile has to be a string, received ${typeof mdFile}`);
	}

	const port = await getPort();
	const server = await serveDirectory(mdFile.length < 255 ? getDir(mdFile) : __dirname, port);

	config = { ...defaultConfig, ...config, pdf_options: { ...defaultConfig.pdf_options, ...config.pdf_options } };

	const pdf = await mdToPdf(mdFile, config, port);

	server.close();

	return pdf;
};
