const path = require('path')
const { readTagDirectory, writeTagDirectory } = require('../tagDirIo')
const notify = require('../tagDirNotifications')


module.exports = ({tagDirFilename='tag-dir.json', filenames}) => {
	const tagDir = readTagDirectory(tagDirFilename)
	const filepaths = filenames.map(filename => path.resolve(process.cwd(), filename))
	tagDir.addFiles(filepaths, notify)
	writeTagDirectory(tagDirFilename, tagDir)
}