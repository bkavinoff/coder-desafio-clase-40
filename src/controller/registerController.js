
const registerController = async (req, res) => {

    const invalidFields=false 
    const invalidPassword=false 
    const invalidUser=false
    const username=false

    await res.render("registerTemplate.ejs", { invalidFields, invalidPassword, invalidUser, username })
    
}

const postNewUser = async (req, res) => {
    console.log("Redirijo a la página de login")
    
    //return res.redirect("/api/login")
    const { username } = req.session
    const invalidFields = false
    const invalidCredentials = false

    await res.render("loginTemplate.ejs", { username, invalidFields, invalidCredentials })
}

export { registerController, postNewUser }