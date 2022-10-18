const loginMiddleware = (req, res, next) => {
    const { username } = req.session
    const invalidFields = false
    const invalidCredentials = false
    

    // console.log('Entro al LoginMiddleware')
    // console.log('username: ', username)

    if(!username) {
        //return res.redirect("/api/login")
        return res.render("loginTemplate.ejs", { username, invalidFields, invalidCredentials })
    } else {
        console.log(`Ingreso el usuario ${username}`)
        return next()
    }
}

export { loginMiddleware }