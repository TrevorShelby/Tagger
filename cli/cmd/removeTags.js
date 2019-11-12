const changeTagDir = require('../utils/changeTagDir')
const TagDirectory = require('../utils/tagDirectory')
const handleIssue = require('../utils/handleIssue')


module.exports = ({tagDirFilename='tag-dir.json', tags}) => {
	changeTagDir(
		tagDirFilename,
		tagDir => new TagDirectory(tagDir).removeTags(tags),
		() => handleIssue('success', '102')
	)
}