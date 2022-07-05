const User = require("../model/user.js");
const jwt = require("jsonwebtoken");
var Imap = require('imap'),
    inspect = require('util').inspect;

exports.createUser = async (req, res) => {
    const user = req.body
    const newUser = new User(user);

    try {
        console.log(newUser);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(404)
    }
}

exports.login = async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
        password: req.body.password,
    })
    console.log(req.body.password);


    if (user) {
        const token = jwt.sign(
            {
                email: user.email,
                password: user.password,
                userType: user.userType,
            },
            'secret123'
        )

        return res.json({ status: 'ok', user: token })
    } else {

        var imap = new Imap({
            user: (req.body.email).split('@')[0],
            password: req.body.password,
            host: 'mailhost.csd.uoc.gr',
            port: 993,
            tls: true
        });



        imap.once('ready', async () => {
            console.log('connection successful');
            //res.status(201).send("User Authenticated");
            let data = {
                username: req.body.email,
                password: req.body.password,
                userType: 'student'
            }
            const newUser = new User(data);
            try {
                console.log(newUser);
                await newUser.save();
                //res.status(201).json(newUser);
                //Send the token
                const tokenUser = jwt.sign(
                    {
                        email: data.email,
                        password: data.password,
                        userType: data.userType,
                    },
                    'secret123'
                )

                return res.json({ status: 'ok', user: tokenUser })
            } catch (err) {
                res.status(404)
            }
            imap.end();
        });

        imap.once('error', function (err) {
            console.log(err);
            res.status(404).send(err.message)
        });

        imap.once('end', function () {
            console.log('Connection ended');
        });

        imap.connect();

        // if (flag == 1) {
        //     //Create new User  
        //     let data = {
        //         username: req.body.email,
        //         password: req.body.password,
        //         userType: 'student'
        //     }
        //     const newUser = new User(data);
        //     try {
        //         console.log(newUser);
        //         await newUser.save();
        //         //res.status(201).json(newUser);
        //         //Send the token
        //         const tokenUser = jwt.sign(
        //             {
        //                 email: data.email,
        //                 password: data.password,
        //                 userType: data.userType,
        //             },
        //             'secret123'
        //         )

        //         return res.json({ status: 'ok', user: tokenUser })
        //     } catch (err) {
        //         res.status(404)
        //     }
        // } else {
        //     return res.json({ status: 'error', user: false })
        // }
    }

}