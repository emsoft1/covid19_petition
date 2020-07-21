const express = require("express");
const app = express();
const db = require("./db");

const data = require("./data.js");
let hasssh = "";
if (process.env.PORT) {
    hasssh = process.env.hash;
} else {
    const sec = require("./secrets.json");
    hasssh = sec[0].hash;
}
const helmet = require("helmet");
const csurf = require("csurf");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);
const { hash, compare } = require("./bc");

app.use(helmet());
let cookieSession = require("cookie-session");
const hb = require("express-handlebars");
// const cookieParser = require("cookie-parser");
// app.use(cookieParser());

app.use(
    cookieSession({
        secret: hasssh, //sec[0].hash
        maxAge: 1000 * 60 * 60 * 24 * 14,
        cookie: {
            sameSite: true,
        },
    })
);
app.use(
    express.urlencoded({
        extended: false,
    })
);
app.use(csurf());
app.use(function (req, res, next) {
    res.locals.csrfToken = req.csrfToken();

    res.set("X-Frame-Options", "DENY");

    next();
});
app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use(express.static("./public"));

app.get("/thanks", (req, res) => {
    if (req.session.alreadysingsin == true) {
        // console.log("id", req.session.id);

        db.getcount()
            .then((results) => {
                db.getsin(req.session.id).then((resu) => {
                    db.getName(req.session.id).then((resname) => {
                        // console.log(results.rows[0].count);
                        // console.log(resu.rows[0]);
                        data.getdata()
                            .then((data) => {
                                res.render("thanks", {
                                    name: resname.rows[0].first,
                                    data: data.data,
                                    count: results.rows[0].count,
                                    imgsrc: resu.rows[0].signature,
                                });
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    });
                });
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        res.redirect("/");
    }
});
app.get("/", (req, res) => {
    req.session = null;
    res.redirect("/route");
});

app.get("/delets", (req, res) => {
    db.delets(req.session.id)
        .then(() => {
            req.session.alreadysingsin = null;
            res.redirect("/petition");
        })
        .catch((err) => {
            console.log("delet sing error", err);
        });
});
app.get("/deleta", (req, res) => {
    db.delets(req.session.id)
        .then(() => {
            db.deletp(req.session.id).then(() => {
                db.deleta(req.session.id).then(() => {
                    res.redirect("/");
                });
            });
        })
        .catch((err) => {
            console.log("delet account error", err);
        });
});
app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});
app.get("/route", (req, res) => {
    data.getdata()
        .then((data) => {
            res.render("route", {
                data: data.data,
            });
        })
        .catch((err) => {
            console.log(err);
        });
});
const editpage = function (req, res, error) {
    if (req.session.alreadysingsin) {
        db.getprofileedit(req.session.id)
            .then((results) => {
                console.log("what ever", results.rows);

                let showName = {};

                showName = {
                    name: results.rows[0].first,
                    last: results.rows[0].last,
                    email: results.rows[0].email,
                    age: Number(results.rows[0].age),
                    city: results.rows[0].city,
                    url: results.rows[0].url,
                    sign: results.rows[0].signature,
                };
                console.log(showName);
                data.getdata()
                    .then((data) => {
                        res.render("edit", {
                            db: showName,
                            err: error,
                            data: data.data,
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        res.redirect("/");
    }
};
app.get("/edit", (req, res) => {
    //console.log(req.params.city.slice(1));
    editpage(req, res);
});
app.get("/signerscity:city", (req, res) => {
    console.log(req.params.city.slice(1));

    if (req.session.alreadysingsin == true) {
        db.getNamesByCity(DOMPurify.sanitize(req.params.city.slice(1)))
            .then((results) => {
                console.log("what ever", results.rows);
                let showName = [];

                for (var i = 0; i < results.rows.length; i++) {
                    showName.push({
                        name: `${results.rows[i].first} ${results.rows[i].last}`,
                        age: results.rows[i].age,
                        city: results.rows[i].city,
                        url: results.rows[i].url,
                    });
                    // console.log(showName);
                }
                data.getdata()
                    .then((data) => {
                        res.render("signerscity", {
                            data: data.data,
                            names: showName,
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        res.redirect("/");
    }
});

app.get("/petition", (req, res) => {
    console.log("sing :::::::", req.session.alreadysingsin);

    if (req.session.alreadysingsin) {
        res.redirect("/edit");
    } else if (req.session.id) {
        data.getdata()
            .then((data) => {
                res.render("petition", {
                    data: data.data,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        res.redirect("/");
    }
});
app.get("/login", (req, res) => {
    data.getdata()
        .then((data) => {
            res.render("login", {
                data: data.data,
            });
        })
        .catch((err) => {
            console.log(err);
        });
});
app.get("/profile", (req, res) => {
    if (req.session.id) {
        data.getdata()
            .then((data) => {
                res.render("profile", {
                    data: data.data,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        res.redirect("/");
    }
});
app.get("/register", (req, res) => {
    data.getdata()
        .then((data) => {
            res.render("register", {
                data: data.data,
            });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get("/signers", (req, res) => {
    if (req.session.alreadysingsin == true) {
        db.getNames()
            .then((results) => {
                console.log(results.rows[0]);
                let showName = [];

                for (var i = 0; i < results.rows.length; i++) {
                    showName.push({
                        name: `${results.rows[i].first} ${results.rows[i].last}`,
                        age: results.rows[i].age,
                        city: results.rows[i].city,
                        url: results.rows[i].url,
                    });
                    // console.log(showName);
                }
                data.getdata()
                    .then((data) => {
                        res.render("signers", {
                            data: data.data,
                            names: showName,
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        res.redirect("/");
    }
});

app.post("/register", (req, res) => {
    // console.log(req.body);
    //res.render("register", {});

    if (
        req.body.name == "" ||
        req.body.last == "" ||
        req.body.email == "" ||
        req.body.pass == "" ||
        req.body["pass-com"] == ""
    ) {
        data.getdata()
            .then((data) => {
                res.render("register", {
                    data: data.data,
                    err: "one or more feild is empty",
                });
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        if (req.body.pass === req.body["pass-com"]) {
            console.log("pass is same");
            hash(req.body.pass)
                .then((hashp) => {
                    db.addName(
                        req.body.name,
                        req.body.last,
                        req.body.email,
                        hashp
                    ).then((results) => {
                        console.log("yyeess add");

                        req.session.id = results.rows[0].id;
                        console.log("id  reg::::", req.session.id);
                        res.redirect("/profile");
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            data.getdata()
                .then((data) => {
                    res.render("register", {
                        data: data.data,
                        err: "the password is not equal",
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }
});

app.post("/login", (req, res) => {
    // console.log(req.body);
    //res.render("register", {});
    if (req.body.email == "" || req.body.pass == "") {
        data.getdata()
            .then((data) => {
                res.render("login", {
                    data: data.data,
                    err: "one or more feild is empty",
                });
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        db.getpass(req.body.email)
            .then((hpass) => {
                compare(req.body.pass, hpass.rows[0].password)
                    .then((match) => {
                        // console.log("yyeess add");
                        // req.session.alreadysingreg = true;
                        // req.session.id = results.rows[0].id;
                        // res.redirect("/petition");
                        // console.log("match and id", match, hpass.rows[0].id);
                        if (!match) {
                            data.getdata()
                                .then((data) => {
                                    res.render("login", {
                                        data: data.data,
                                        err:
                                            "User name or password is not match",
                                    });
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        } else {
                            req.session.id = hpass.rows[0].id;
                            req.session.alreadysinglog = true;
                            //  console.log(req.session);

                            db.getsin(req.session.id)
                                .then((resu) => {
                                    console.log(
                                        "we going in ",
                                        resu.rows.length
                                    );
                                    if (resu.rows != 0) {
                                        req.session.alreadysingsin = true;
                                        console.log(
                                            "nabayad",
                                            req.session.alreadysingsin
                                        );

                                        res.redirect("/edit");
                                    } else {
                                        res.redirect("/petition");
                                    }
                                })
                                .catch((err) => {
                                    console.log("this is a error in sing", err);
                                    data.getdata()
                                        .then((data) => {
                                            res.render("login", {
                                                data: data.data,
                                                err: "no sign",
                                            });
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                        });
                                });
                        }
                    })
                    .catch((err) => {
                        console.log("should not happen her", err);
                    });
            })
            .catch((err) => {
                console.log(err);

                data.getdata()
                    .then((data) => {
                        res.render("login", {
                            data: data.data,
                            err: "User name or password is not match",
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            });
    }
});

app.post("/petition", (req, res) => {
    console.log("id ::::", req.session.id);

    //  console.log(req.body);
    if (req.body.canr == "") {
        data.getdata()
            .then((data) => {
                res.render("petition", {
                    data: data.data,
                    err: "you have to sign the petiton",
                });
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        db.addsin(req.body.canvasurl, req.session.id)
            .then(() => {
                console.log("yyeess add sin");
                req.session.alreadysingsin = true;
                //  console.log(req.session);

                res.redirect("/thanks");
            })
            .catch((err) => {
                console.log(err);
            });
    }
});

app.post("/profile", (req, res) => {
    //  console.log(req.body);
    let cleanUrl = DOMPurify.sanitize(req.body.url);
    let cleanC = DOMPurify.sanitize(req.body.city);
    console.log("id profile ::::", req.session.id);
    if (
        !typeof Number(req.body.age) == "number" ||
        !(Number(req.body.age) >= 0)
    ) {
        data.getdata()
            .then((data) => {
                res.render("profile", {
                    data: data.data,
                    err: "please set a valid Age !!!!",
                });
            })
            .catch((err) => {
                console.log(err);
            });
    } else if (
        cleanUrl &&
        !cleanUrl.startsWith("https://") &&
        !cleanUrl.startsWith("http://")
    ) {
        data.getdata()
            .then((data) => {
                res.render("profile", {
                    data: data.data,
                    err: "please set a valid web url !!!!",
                });
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        db.addprofile(req.body.age, cleanC, cleanUrl, req.session.id)
            .then(() => {
                console.log("yes the profile added");
                res.redirect("/petition");
            })
            .catch((err) => {
                console.log("adding profile had error", err);
            });
    }
});
app.post("/edit", (req, res) => {
    //  console.log(req.body);
    let cleanUrl = DOMPurify.sanitize(req.body.url);
    let cleanC = DOMPurify.sanitize(req.body.city);
    let pass = "";

    let run = true;
    if (
        !typeof Number(req.body.age) == "number" ||
        !(Number(req.body.age) >= 0)
    ) {
        editpage(req, res, "age is not valid");
    } else if (
        cleanUrl &&
        !cleanUrl.startsWith("https://") &&
        !cleanUrl.startsWith("http://")
    ) {
        editpage(req, res, "* please use a vlid Url !!!");
    } else if (
        req.body.name == "" ||
        req.body.last == "" ||
        req.body.email == ""
    ) {
        editpage(
            req,
            res,
            "first name and last name and email should be empty"
        );
    } else {
        db.getprofileedit(req.session.id)
            .then((results) => {
                db.getpass(results.rows[0].email).then((resultspass) => {
                    pass = resultspass.rows[0].password;
                    if (
                        !req.body["old-pass"] == "" ||
                        !req.body["new-pass"] == ""
                    ) {
                        compare(
                            req.body["old-pass"],
                            resultspass.rows[0].password
                        )
                            .then((match) => {
                                // console.log("yyeess add");
                                // req.session.alreadysingreg = true;
                                // req.session.id = results.rows[0].id;
                                // res.redirect("/petition");
                                // console.log("match and id", match, hpass.rows[0].id);
                                if (!match) {
                                    pass = resultspass.rows[0].password;
                                    run = false;
                                    console.log("not match");
                                    console.log("run in if", run);

                                    editpage(req, res, "pasword is not match ");
                                } else {
                                    if (req.body["new-pass"] == "") {
                                        editpage(
                                            req,
                                            res,
                                            "new pasword is should be feid  "
                                        );
                                    } else {
                                        hash(req.body["new-pass"]).then(
                                            (hashp) => {
                                                pass = hashp;
                                                db.addedituser(
                                                    req.body.name,
                                                    req.body.last,
                                                    req.body.email,
                                                    pass,
                                                    req.session.id
                                                ).then(() => {
                                                    db.addeditup(
                                                        req.body.age,
                                                        cleanC,
                                                        cleanUrl,
                                                        req.session.id
                                                    ).then(() => {
                                                        console.log(
                                                            "yes the edit update"
                                                        );
                                                        res.redirect("/thanks");
                                                    });
                                                });
                                            }
                                        );
                                    }
                                }
                            })
                            .catch((err) => {
                                console.log("pass compare err ", err);
                            });
                    } else {
                        pass = resultspass.rows[0].password;
                        db.addedituser(
                            req.body.name,
                            req.body.last,
                            req.body.email,
                            pass,
                            req.session.id
                        ).then(() => {
                            db.addeditup(
                                req.body.age,
                                cleanC,
                                cleanUrl,
                                req.session.id
                            ).then(() => {
                                console.log("yes the edit update");
                                res.redirect("/thanks");
                            });
                        });
                    }
                    console.log("pass", pass);
                    console.log("id", req.session.id);
                    console.log("run", run);
                });
            })
            .catch((err) => {
                console.log("adding profile had error", err);
            });
    }
});

app.listen(process.env.PORT || 8080, () => console.log("i am up in 8080"));
