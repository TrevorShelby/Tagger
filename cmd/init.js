const TagDirectoryFile = require('../utils/tagDirectoryFile')
const handleIssue = require('../utils/handleIssue')


module.exports = (tagDirFilename='tag-dir.json') => {
	tagDirFile = new TagDirectoryFile(tagDirFilename)
	if(tagDirFile.exists())
		handleIssue('error', '000', tagDirFile.filepath)
	else {
		tagDirFile.write({links: {}, tags: {}})
		handleIssue('info', '100', tagDirFile.filepath)
	}
}