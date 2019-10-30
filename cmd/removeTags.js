const changeTagDir = require('../utils/changeTagDir')
const TagDirectory = require('../utils/tagDirectory')
const printResults = require('../utils/printResults')


module.exports = ({tagDirFilename='tag-dir.json', tags}) => {
	changeTagDir(
		tagDirFilename,
		tagDir => {
			const results = new TagDirectory(tagDir).removeTags(tags)
			printResults(results, {
				missingTags: missingTag => `${missingTag} is not a tag.`,
				removedFiles: removedFile => `Removing ${removedFile} from the directory since it has no more tags.`
			})
		},
		() => console.log('Finished removing tags.')
	)
}