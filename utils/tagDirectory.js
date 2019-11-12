const NotificationType = {
	ERROR: 0,
	WARNING: 1,
	INFO: 2
}

const Notification = {
	FILE_ALREADY_EXISTS: 0,
	FILE_ALREADY_TAGGED: 1,
	NONEXISTENT_FILE: 2,
	NONEXISTENT_TAG: 3,
	TAG_NOT_IN_FILE: 4,
	FILE_NOT_IN_TAG: 5,
	ADDED_FILE: 6,
	TAGGED_FILE: 7,
	UNTAGGED_FILE: 8,
	REMOVED_FILE: 9,
	ADDED_TAG: 10,
	REMOVED_TAG: 11
}
Notification.types = {
	[Notification.FILE_ALREADY_EXISTS]: NotificationType.WARNING,
	[Notification.FILE_ALREADY_TAGGED]: NotificationType.WARNING,
	[Notification.NONEXISTENT_FILE]: NotificationType.WARNING,
	[Notification.NONEXISTENT_TAG]: NotificationType.WARNING,
	[Notification.TAG_NOT_IN_FILE]: NotificationType.WARNING,
	[Notification.FILE_NOT_IN_TAG]: NotificationType.ERROR,
	[Notification.ADDED_FILE]: NotificationType.INFO,
	[Notification.TAGGED_FILE]: NotificationType.INFO,
	[Notification.UNTAGGED_FILE]: NotificationType.INFO,
	[Notification.REMOVED_FILE]: NotificationType.INFO,
	[Notification.ADDED_TAG]: NotificationType.INFO,
	[Notification.REMOVED_TAG]: NotificationType.INFO
}



const TagDirectory = class {
	constructor({files={}, tags={}}={}) {
		this.files = files
		this.tags = tags
	}

	addFiles(files, cb=()=>{}) {
		files.forEach( file => {
			if(file in this.files) {
				cb(Notification.FILE_ALREADY_EXISTS, file)
				return
			}
			this.files[file] = []
			cb(Notification.ADDED_FILE, file)
		})
	}

	tagFiles(files, tags, cb=()=>{}) {
		files.forEach( file => {
			if(!(file in this.files)) {
				cb(Notification.NONEXISTENT_FILE, file)
				return
			}
			tags.forEach( tag => {
				if(!(tag in this.tags)) {
					this.tags[tag] = []
					cb(Notification.ADDED_TAG, tag)
				}
				if(this.tags[tag].includes(file)) {
					cb(Notification.FILE_ALREADY_TAGGED, file, tag)
					return
				}
				this.files[file].push(tag)
				this.tags[tag].push(file)
				cb(Notification.TAGGED_FILE, file, tag)
			})
		})
	}

	//it would be appropriate for cb to throw an error if the TAG_NOT_IN_FILE notification is
	//applied to it.
	untagFiles(files, tags, cb=()=>{}) {
		files.forEach( file => {
			if(!(file in this.files)) {
				cb(Notification.NONEXISTENT_FILE, file)
				return
			}
			tags.forEach( tag => {
				if(!(tag in this.tags)) {
					cb(Notification.NONEXISTENT_TAG, tag)
					return
				}
				const tagIndex = this.files[file].indexOf(tag)
				if(tagIndex == -1) {
					cb(Notification.TAG_NOT_IN_FILE, file, tag)
					return
				}
				const fileIndex = this.tags[tag].indexOf(file)
				if(fileIndex == -1) {
					cb(Notification.FILE_NOT_IN_TAG, file, tag)
					return
				}
				this.files[file].splice(tagIndex, 1)
				this.tags[tag].splice(fileIndex, 1)
				cb(Notification.UNTAGGED_FILE, file, tag)
			})
		})
	}

	removeTags(tags, cb=()=>{}) {
		tags.forEach( tag => {
			if(!(tag in this.tags)) {
				cb(Notification.NONEXISTENT_TAG, tag)
				return
			}
			this.tags[tag].forEach( taggedFile => {
				const tagIndex = this.files[taggedFile].indexOf(tag)
				this.files[taggedFile].splice(tagIndex, 1)
				cb(Notification.UNTAGGED_FILE, taggedFile, tag)
			})
			delete this.tags[tag]
			cb(Notification.REMOVED_TAG, tag)
		})
	}

	removeFiles(files, cb=()=>{}) {
		files.forEach( file => {
			if(!(file in this.files)) {
				cb(Notification.NONEXISTENT_FILE, file)
				return
			}
			this.files[file].forEach( tagWithFile => {
				const fileIndex = this.tags[tagWithFile].indexOf(file)
				this.tags[tagWithFile].splice(fileIndex, 1)
			})
			delete this.files[file]
			cb(Notification.REMOVED_FILE, file)
		})
	}
}



module.exports = { Notification, NotificationType, TagDirectory }