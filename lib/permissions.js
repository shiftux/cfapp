isAdmin = (userId) => {
  return Roles.userIsInRole(userId, 'admin')
}

isOwner = (userId, doc) => {
  if (userId && doc.userId === userId) {
    return true
  }
}

isHimself = (userId, doc) => {
  if (userId && doc._id === userId) {
    return true
  }
}

sameUser = (userId) => {
  return Meteor.userId() === userId
}