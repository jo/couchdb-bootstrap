function(newDoc, oldDoc, userCtx, secObj) {
  if (userCtx.roles.indexOf('_admin') === -1) {
    throw({
      forbidden: 'Admins only.'
    })
  }
}
