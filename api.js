 const express = require("express");
    require("./db/config");
    const cors = require("cors");
    

    const Jwt = require("jsonwebtoken");
    const jwtkey = "man-ors";

    const Roll = require("./db/roll");
    const User = require("./db/user")
    const College = require("./db/College")
    const Student = require("./db/Student");
    const Marksheet = require("./db/Marksheet");

    const port =process.env.PORT || 5000;

    const app = express();
    app.use(express.json());
    app.use(cors());

    // Registraytion Api
    app.post("/login", async (req, resp) => {
        if (req.body.loginId && req.body.password) {
            let user = await User.findOne(req.body);
            // console.log(user)
            if (user) {
                // jwt token start
                Jwt.sign({ user }, jwtkey, { expiresIn: "2h" }, (err, token) => {
                    if (err) {
                        resp.send({ result: "Token Error, Hence something went wrongs" })
                    } else {
                        resp.send({ user, auth: token });
                    }
                })
                // jwt token End
            } else {
                resp.send({ result: "No data found" })
            }
        } else {
            resp.send({ result: "Please Fill the form" })
        }
    })
    app.post("/register", async (req, resp) => {
        let data = await User.findOne({ loginId: req.body.loginId });
        // console.log(data)
        if (data == null) {
            if (req.body.rollId && req.body.loginId) {
                let user = new User(req.body);
                user = await user.save()
                // resp.send(user)
                // Jwt token Start
                Jwt.sign({ user }, jwtkey, { expiresIn: "2h" }, (err, token) => {
                    if (err) {
                        resp.send({ result: "Token error :- Something went wrong" })
                    }
                    resp.send({ user, auth: token })
                })
                // Jwt token End
            } else {
                resp.send({ result: "Fill the form" })
            }
        } else {
            resp.send({ result: "Login id already exist" })
        }
    })
    app.get("/register", verifyToken, async (req, resp) => {
        let user = await User.find();
        resp.send(user)
    })
    app.put('/register/:id', verifyToken, async (req, resp) => {
        const data = await User.findOne({ loginId: req.body.loginId, _id: req.params.id })
        console.log(data)
        if (req.body.rollId && req.body.loginId) {
            let user = await User.updateOne({ _id: req.params.id }, { $set: req.body })
            resp.send(user);
        } else {
            resp.send({ result: "Fill the form" })
        }
    })
    //crash
    app.get("/register/:id", verifyToken, async (req, resp) => {
        let user = await User.findOne({ _id: req.params.id })
        resp.send(user)
    })
    app.delete("/register/:id", verifyToken, async (req, resp) => {
        let user = await User.deleteOne({ _id: req.params.id })
        resp.send(user)
    })

    // Roll's Api 
    app.post('/roll', verifyToken, async (req, resp) => {
        if (req.body.name && req.body.discription) {
            let roll = new Roll(req.body);
            roll = await roll.save();
            resp.send(roll)
        } else {
            resp.send({ result: "Please fill the form" })
        }
    });
    // Roll list
    app.get('/roll', verifyToken, async (req, resp) => {
        let roll = await Roll.find();
        // resp.send(roll)
        if (Roll.length > 0) {
            resp.send(roll);
        } else {
            resp.send({ result: "no data found" });
        }
    })
    app.get('/roll/:id', verifyToken, async (req, resp) => {
        let roll = await Roll.findOne({ _id: req.params.id })
        resp.send(roll)
    })
    app.delete('/roll/:id', verifyToken, async (req, resp) => {
        let roll = await Roll.deleteOne({ _id: req.params.id })
        resp.send(roll)
    })
    app.put('/roll/:id', verifyToken, async (req, resp) => {
        let roll = await Roll.updateOne({ _id: req.params.id }, { $set: req.body })
        resp.send(roll)
    })

    // collegwe Api
    app.post("/college", verifyToken, async (req, resp) => {
        let data = await College.findOne({ collegeName: req.body.collegeName });
        console.log("data", data)
        if (req.body.collegeName && req.body.city && req.body.state && req.body.mobileNo && req.body.address) {
            if (data === null) {
                let clg = new College(req.body);
                clg = await clg.save()
                resp.send(clg)
            } else {
                resp.send({ result: "College name already exist" })
            }
        } else {
            resp.send({ result: "Please fill form" })
        }

    })
    app.put("/college/:id", verifyToken, async (req, resp) => {
        let data1 = await College.findOne({ collegeName: req.body.collegeName });
        let data2 = await College.findOne({ _id: req.params.id });
        // console.log(data1,data2)
        // // console.log("data", data)
        if (req.body.collegeName && req.body.city && req.body.state && req.body.mobileNo && req.body.address) {
            if (data1 === null || data1 != data2) {
                let clg = await College.updateOne({ _id: req.params.id }, { $set: req.body });
                resp.send(clg)
            } else {
                resp.send({ result: "College name already exist" })
            }
        } else {
            resp.send({ result: "Form must be fill" })
        }

    })
    app.get("/college", verifyToken, async (req, resp) => {
        let clg = await College.find();
        resp.send(clg)
    })
    app.get("/college/:id", verifyToken, async (req, resp) => {
        let clg = await College.findOne({ _id: req.params.id });
        resp.send(clg)
    })
    app.delete("/college/:id", verifyToken, async (req, resp) => {
        let clg = await College.deleteOne({ _id: req.params.id });
        resp.send(clg)
    })
    app.get("/college/search/:key", verifyToken, async (req, resp) => {
        // console.log(req.params.key) samll a doubt no send data my server is crashed
        let clg = await College.find({
            $or: [
                { collegeName: { $regex: req.params.key } },
                { address: { $regex: req.params.key } },
                { city: { $regex: req.params.key } },
                { state: { $regex: req.params.key } },
            ]
        })
        resp.send(clg)


    })
    // student api
    app.post('/student', verifyToken, async (req, resp) => {
        let data = await Student.findOne({ emailId: req.body.emailId })
        console.log(data)
        if (data == null) {
            if (req.body.firstName && req.body.lastName && req.body.emailId && req.body.collegeId && req.body.mobileNo) {
                let student = new Student(req.body)
                student = await student.save()
                resp.send(student)
            } else {
                resp.send({ result: "Fill the form" })
            }
        } else {
            resp.send({ result: "data Already exiet" })
        }
    })
    app.put("/student/:id", verifyToken, async (req, resp) => {
        let data1 = await Student.findOne({ _id: req.params.id })
        let data2 = await Student.findOne({ emailId: req.body.emailId })
        console.log(data1, data2)
        // console.log(data1.emailId === data2.emailId)

        if (data2 != null) {
            if (data1.emailId === data2.emailId) {
                let student = await Student.updateOne({ _id: req.params.id }, { $set: req.body })
                resp.send(student)
            } else {
                resp.send({ result: " Email id Already exiet" })
            }
        } else {
            if (req.body.emailId) {
                let student = await Student.updateOne({ _id: req.params.id }, { $set: req.body })
                resp.send(student)
            } else {
                resp.send({ result: " Fill the form" })
            }
        }
    })
    app.delete("/student/:id", verifyToken, async (req, resp) => {
        let student = await Student.deleteOne({ _id: req.params.id })
        resp.send(student)
    })
    app.get("/student", verifyToken, async (req, resp) => {
        let student = await Student.find()
        resp.send(student)
    })
    app.get("/student/:id", verifyToken, async (req, resp) => {
        let student = await Student.findOne({ _id: req.params.id })
        resp.send(student)
    })
    app.get("/student/search/:key", verifyToken, async (req, resp) => {
        // console.log(req.params.key.length)
        let student = await Student.find({
            $or: [
                { firstName: { $regex: req.params.key } },
                { lastName: { $regex: req.params.key } },
                { emailId: { $regex: req.params.key } },
            ]
        })
        resp.send(student)
    })
    // Marksheet Api
    app.post("/marksheet", verifyToken, async (req, resp) => {
        let data1 = await Marksheet.findOne({ studentId: req.body.studentId })
        let data2 = await Marksheet.findOne({ rollNo: req.body.rollNo })

        if (data1 != null || data2 != null) {
            if (data1 != null) {
                resp.send({ result: "Student id Already exist" })
            } else {
                resp.send({ result: "Roll no Already exist" })
            }
        } else {
            if (req.body.name && req.body.studentId && req.body.rollNo && req.body.physics && req.body.chemistry && req.body.maths) {
                let marksheet = new Marksheet(req.body)
                marksheet = await marksheet.save()
                resp.send(marksheet)
            } else {
                resp.send({ result: "Fill the form" })
            }
        }
    })

    // doubt error slve krna hai :- marksheet me studentId & rollno reapeat ho rha hai
    app.put("/marksheet/:id", verifyToken, async (req, resp) => {
        let data1 = await Marksheet.findOne({ studentId: req.body.studentId })
        let data2 = await Marksheet.findOne({ rollNo: req.body.rollNo })
        let data3 = await Marksheet.findOne({ _id: req.params.id })
        // console.log(data1, data2, data3)

        if (data1 !== null || data2 !== null) {

            if (data1 !== null && data2 !== null) {
                if (data1.id == data3.id && data2.id == data3.id) {
                    let marksheet = await Marksheet.updateOne({ _id: req.params.id }, { $set: req.body });
                    resp.send(marksheet)
                    // console.log("no change")
                } else if (data1.id == data3.id && data2.id != data3.id) {
                    resp.send({ result: "Roll number already exist" }) //
                } else if (data1.id != data3.id && data2.id == data3.id) {
                    resp.send({ result: "studentid already exist" }) //
                } else {
                    resp.send({ result: "Roll number and studentid both already exist" }) //
                    // console.log("rollno change and same roll")
                    // console.log("studentid  change and same studentid")
                    // console.log("both change both same")
                }
            } else if (data1 !== null && data1.studentId == data3.studentId) {
                let marksheet = await Marksheet.updateOne({ _id: req.params.id }, { $set: req.body });
                resp.send(marksheet)
                // console.log("rollno change but no same roll")
            } else if (data2 !== null && data2.rollNo == data3.rollNo) {
                let marksheet = await Marksheet.updateOne({ _id: req.params.id }, { $set: req.body });
                resp.send(marksheet)
                console.log("studentid  change but no same studentid")
            } else {
                resp.send({ result: "Something went wrong" })
            }
        } else {
            if (req.body.studentId && req.body.rollNo) {
                let marksheet = await Marksheet.updateOne({ _id: req.params.id }, { $set: req.body });
                resp.send(marksheet)
            } else {
                resp.send({ result: "Fill the form" })
            }
        }
    })
    app.delete("/marksheet/:id", verifyToken, async (req, resp) => {
        let marksheet = await Marksheet.deleteOne({ _id: req.params.id })
        resp.send(marksheet)
    })
    app.get("/marksheet", verifyToken, async (req, resp) => {
        let marksheet = await Marksheet.find()
        resp.send(marksheet)
    })
    app.get("/marksheet/:id", verifyToken, async (req, resp) => {
        let marksheet = await Marksheet.findOne({ _id: req.params.id })
        resp.send(marksheet)
    })

    // MiddleWare verifyToken for JWT verify token 
    function verifyToken(req, resp, next) {
        let token = req.headers['authorization']
        token = token.split(' ')[1]
        // console.log("Midleware working : ", token)

        if (token) {
            Jwt.verify(token, jwtkey, (err, valid) => {
                if (err) {
                    resp.status(401).send({ result: "Provide valid token" })
                } else {
                    next()
                }
            })
        } else {
            resp.status(403).send({ result: "please add tokem with headers" })
        }
    }
    app.listen(port, () => {
        console.log("run on http://localhost:5000")
    })

    // End api logic

