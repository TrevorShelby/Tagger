const { readTagDirectory, writeTagDirectory } = require('../tagDirIo')
const notify = require('../tagDirNotifications')


module.exports = ({tagDirFilename='tag-dir.json', tags}) => {
	const tagDir = readTagDirectory(tagDirFilename)
	tagDir.removeTags(tags, notify)
	writeTagDirectory(tagDirFilename, tagDir)
}