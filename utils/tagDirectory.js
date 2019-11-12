const Issue = {
	FILE_ALREADY_TAGGED: 1,
	NONEXISTENT_FILE: 2,
	NONEXISTENT_TAG: 3,
	TAG_NOT_IN_FILE: 4,
	FILE_NOT_IN_TAG: 5
}



const TagDirectory = class {
	constructor({files={}, tags={}}={}) {
		this.files = files
		this.tags = tags
	}

	tagFiles(files, tags, cb=()=>{}) {
		if(tags.length == 0)
			return
		files.forEach( file => {
			if(!(file in this.files))
				this.files[file] = []
			tags.forEach( tag => {
				if(!(tag in this.tags))
					this.tags[tag] = []
				if(this.tags[tag].includes(file)) {
					cb(Issue.FILE_ALREADY_TAGGED, file, tag)
					return
				}
				else {
					this.files[file].push(tag)
					this.tags[tag].push(file)
				}
			})
		})
	}

	untagFiles(files, tags, cb=()=>{}) {
		files.forEach( file => {
			if(!(file in this.files)) {
				cb(Issue.NONEXISTENT_FILE, file)
				return
			}
			tags.forEach( tag => {
				if(!(tag in this.tags)) {
					cb(Issue.NONEXISTENT_TAG, tag)
					return
				}
				const tagIndex = this.files[file].indexOf(tag)
				if(tagIndex == -1) {
					cb(Issue.TAG_NOT_IN_FILE, file, tag)
					return
				}
				const fileIndex = this.tags[tag].indexOf(file)
				if(fileIndex == -1) {
					cb(Issue.FILE_NOT_IN_TAG, file, tag)
					return
				}
				this.files[file].splice(tagIndex, 1)
				this.tags[tag].splice(fileIndex, 1)
			})
		})
	}

	removeTags(tags, cb=()=>{}) {
		tags.forEach( tag => {
			if(!(tag in this.tags)) {
				cb(Issue.NONEXISTENT_TAG, tag)
				return
			}
			this.tags[tag].forEach( taggedFile => {
				const tagIndex = this.files[taggedFile].indexOf(tag)
				this.files[taggedFile].splice(tagIndex, 1)
			})
			delete this.tags[tag]
		})
	}

	removeFiles(files, cb=()=>{}) {
		files.forEach( file => {
			if(!(file in this.files)) {
				cb(Issue.NONEXISTENT_FILE, file)
				return
			}
			this.files[file].forEach( tagWithFile => {
				const fileIndex = this.tags[tagWithFile].indexOf(file)
				this.tags[tagWithFile].splice(fileIndex, 1)
			})
			delete this.files[file]
		})
	}
}



module.exports = { Issue, TagDirectory }