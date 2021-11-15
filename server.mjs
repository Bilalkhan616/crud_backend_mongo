// back-end connection

import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";

let currentUrl = 'mongodb+srv://dbBilal:Bilal12345@mydatabase.kw5tu.mongodb.net/mern-crud?retryWrites=true&w=majority'

mongoose.connect(currentUrl, () => {
    console.log("Database Connected Successfully!")
});
const User = mongoose.model('users', {
    name: String,
    email: String,
    address: String
});

const app = express();
const port = process.env.PORT || 3005;

app.use(express.json())
app.use(cors())
app.use(morgan('short'))

app.use((req, res, next) => {
    console.log('a request came', req.body)
    next();
})

app.get('/', (req, res) => {
    res.send("Welcome to the server back end")
})

//will send all user data

app.get('/users', (req, res) => {
    User.find({}, (error, users) => {
        if (!error) {
            res.send(users)
        }
        else {
            res.status(500).send("error occured")
        }
    })
})

//will get a specific user data

app.get('/users/:id', (req, res) => {
    User.findOne({ _id: req.params.id }, (err, user) => {
        if (!err) {
            res.send(user)
        }
        else {
            res.status(500).send("error occured")
        }
    })
})

//will post user data to the empty array

app.post('/user', (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        res.status(400).send("invalid data")
    }
    else {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        newUser.save()
            .then(() => {
            console.log("user created successfully!!")
            res.send("users created!!")
        })
        .catch((error)=>{
            console.log(error.message)
            res.status(500).send("error in database")
        });
    }
})

//will edit user data from the previously stored data

app.put('/users/:id', (req, res) => {
    let updateObj = {}

    if (req.body.name) {
        updateObj.name = req.body.name
    }
    if (req.body.email) {
        updateObj.email = req.body.email
    }
    if (req.body.password) {
        updateObj.password = req.body.password
    }

    User.findByIdAndUpdate(req.params.id, updateObj, { new: true },
        (err, data) => {
            if (!err) {
                res.send(data)
            } else {
                res.status(500).send("error occured")
            }
        })
})

// will delete user data from the given id

app.post('/user/delete', (req, res) => {
    User.findByIdAndRemove(req.body._id, (err, data) => {
        if (!err) {
            res.send("user deleted successfully!")

        }
        else {
            res.status(500).send("error occurred!")

        }
    })

})

// app.post('/user/update', (req, res) => {
//     users.map((item, index) => {
//         if (item.email == req.body.email) {
//             users.splice(index, 1, req.body.updateUserObj);
//         }
//     });

//     console.log(users);
//     res.send(users);
// })

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
