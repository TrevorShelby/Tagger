module.exports = class TagDirectory {
	constructor({files={}, tags={}}={}) {
		this.files = files
		this.tags = tags
	}

	tagFiles(files, tags) {
		const results = {
			alreadyTaggedFiles: []
		}
		files.forEach( file => {
			if(!(file in this.files))
				this.files[file] = []
			tags.forEach( tag => {
				if(!(tag in this.tags))
					this.tags[tag] = []
				if(this.tags[tag].includes(file)) {
					results.alreadyTaggedFiles.push({file, tag})
					return
				}
				else {
					this.files[file].push(tag)
					this.tags[tag].push(file)
				}
			})
		})
		return results
	}

	untagFiles(files, tags) {
		const results = {
			missingFiles: [],
			missingTags: [],
			filesWithoutTag: [],
			tagsWithoutFile: [],
			removedFiles: []
		}
		files.forEach( file => {
			if(!(file in this.files)) {
				results.missingFiles.push(file)
				return
			}
			tags.forEach( tag => {
				if(!(tag in this.tags)) {
					results.missingTags.push(tag)
					return
				}
				const tagIndex = this.files[file].indexOf(tag)
				if(tagIndex == -1) {
					results.filesWithoutTag.push({file, tag})
					return
				}
				const fileIndex = this.tags[tag].indexOf(file)
				if(fileIndex == -1) {
					results.tagsWithoutFile.push({file, tag})
					return
				}
				this.files[file].splice(tagIndex, 1)
				this.tags[tag].splice(fileIndex, 1)
			})
			if(this.files[file].length == 0) {
				delete this.files[file]
				results.removedFiles.push(file)
			}
		})
		return results
	}

	removeTags(tags) {
		const results = {
			missingTags: [],
			removedFiles: []
		}
		tags.forEach( tag => {
			if(!(tag in this.tags)) {
				results.missingTags.push(tag)
				return
			}
			this.tags[tag].forEach( taggedFile => {
				const tagIndex = this.files[taggedFile].indexOf(tag)
				this.files[taggedFile].splice(tagIndex, 1)
				if(this.files[taggedFile].length == 0) {
					delete this.files[taggedFile]
					results.removedFiles.push(taggedFile)
				}
			})
			delete this.tags[tag]
		})
		return results
	}

	removeFiles(files) {
		const results = {
			missingFiles: []	
		}
		files.forEach( file => {
			if(!(file in this.files)) {
				results.missingFiles.push(files)
				return
			}
			this.files[file].forEach( tagWithFile => {
				const fileIndex = this.tags[tagWithFile].indexOf(file)
				this.tags[tagWithFile].splice(fileIndex, 1)
			})
			delete this.files[file]
		})
		return results
	}
}

// const tagDir = new TagDirectory()
// tagDir.tagFiles(['doofus', 'buffoon', 'goon', 'mook', 'hooligan'], ['double-o'])

// tagDir.tagFiles(['gremlin', 'goblin'], ['monster'])

// tagDir.tagFiles(['schmuck', 'doofus', 'buffoon'], ['idiot'])

// tagDir.tagFiles(['gremlin', 'goblin', 'goon', 'mook', 'hooligan', 'ruffian', 'yobbo'], ['troublemaker'])

// tagDir.tagFiles(['schmuck', 'gremlin', 'goblin'], ['favorites'])


// console.log(tagDir.files)
// console.log()
// console.log(tagDir.tags)
// console.log()
// console.log()

// tagDir.removeTags(['troublemaker'])

// console.log(tagDir.files)
// console.log()
// console.log(tagDir.tags)