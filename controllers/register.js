const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {  // if any of these are empty
    // must RETURN this so that it ends here if false, and the rest of the code won't get run
    return res.status(400).json('incorrect form submission');
  }
  const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')  // return all the columns
          .insert({        // insert into users
            email: loginEmail[0],  // since loginEmail is an array, just return the (only) string in it.
            name: name,
            joined: new Date()
          })
          .then(user => {
            // console.log;
            // res.json(database.users[database.users.length-1]);  // by returning('*'), no need for this anymore
            res.json(user[0]);
          })
      })
      .then(trx.commit)     // or else database tables won't update
      .catch(trx.rollback)
    })

    .catch(err => res.status(400).json(err))  // the error "email already exists" is giving away info, so just say "unable to join"
    // .catch(err => res.status(400).json('Unable to register'))
}

module.exports = {
  handleRegister: handleRegister
}
