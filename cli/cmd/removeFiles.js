const path = require('path')
const { readTagDirectory, writeTagDirectory } = require('../tagDirIo')
const notify = require('../tagDirNotifications')


//NOTE: This will not delete files from the local file system, only from the tag-based directory.
module.exports = ({tagDirFilename='tag-dir.json', filenames}) => {
	const tagDir = readTagDirectory(tagDirFilename)
	const filepaths = filenames.map(filename => path.resolve(process.cwd(), filename))
	tagDir.removeFiles(filepaths, notify)
	writeTagDirectory(tagDirFilename, tagDir)
}