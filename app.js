const bodyParser = require("body-parser")
const express = require("express")
const request = require("request")
const https = require("https")
const mailchimp = require("@mailchimp/mailchimp_marketing");

const listID = "3bce4ef787"
mailchimp.setConfig({
  apiKey: "6228f68b5b0fa87c6dbc71bb9b0a05b7-us11",
  server: "us11",
})

const app = express()

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html")
})
app.post("/", function(req ,res) {
    var firstName = req.body.fName
    var lastName = req.body.lName
    var email = req.body.email

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    var jsonData = JSON.stringify(data)
    
    const response = mailchimp.lists.batchListMembers(listID, jsonData)
    response.then(function(result){
        if (!result.error_count){
            res.sendFile(__dirname + "/success.html")
        }
        else {
            res.sendFile(__dirname + "/failure.html")
        }
    })
})
app.post("/failure", function(req, res){
    res.redirect("/")
})
app.listen(process.env.PORT || 3000, function() {
    console.log("server 3000 is spinning up")
})

//APi KEY:
// 6228f68b5b0fa87c6dbc71bb9b0a05b7-us11

// Audience ID:
// 3bce4ef787