const spicedPg = require("spiced-pg");

var db = spicedPg(
    process.env.DATABASE_URL || "postgres:postgres:postgres@localhost:5432/ddbb"
);
module.exports.getName = (id) => {
    return db.query(`SELECT first  FROM users WHERE id = $1`, [id]);
};
module.exports.getpass = (email) => {
    return db.query(`SELECT password ,id FROM users WHERE email = $1`, [email]);
};
module.exports.delets = (id) => {
    return db.query(`DELETE FROM signatures WHERE user_id = $1`, [id]);
};
module.exports.deleta = (id) => {
    return db.query(`DELETE FROM users WHERE id = $1`, [id]);
};
module.exports.deletp = (id) => {
    return db.query(`DELETE FROM user_profiles WHERE user_id = $1`, [id]);
};
module.exports.getNamesByCity = (city) => {
    console.log(city);

    return db.query(
        `SELECT users.first , users.last ,user_profiles.age ,user_profiles.city ,user_profiles.url    
        FROM signatures 
        LEFT JOIN users
        ON signatures.user_id = users.id 
        LEFT JOIN user_profiles
        ON user_profiles.user_id =signatures.user_id  
        WHERE LOWER(user_profiles.city) = LOWER($1)`,
        [city]
    );
};

module.exports.getprofileedit = (id) => {
    // console.log(city);

    return db.query(
        `SELECT users.first , users.last ,users.email  ,signatures.signature,user_profiles.age ,user_profiles.city ,user_profiles.url    
        FROM signatures 
        LEFT JOIN users
        ON signatures.user_id = users.id 
        LEFT JOIN user_profiles
        ON user_profiles.user_id =signatures.user_id  
        WHERE users.id =$1`,
        [id]
    );
};

module.exports.getNames = () => {
    return db.query(
        `SELECT users.first , users.last ,user_profiles.age ,user_profiles.city ,user_profiles.url    FROM signatures 
        JOIN users
        ON  signatures.user_id = users.id 
        LEFT JOIN user_profiles
        ON user_profiles.user_id =users.id`
    );
};
// module.exports.getNames = () => {
//     return db.query(`SELECT first , last  FROM users`);
// };
module.exports.getcount = () => {
    return db.query(`SELECT COUNT (signature) FROM signatures`);
};
module.exports.getsin = (id) => {
    return db.query(`SELECT signature  FROM signatures WHERE user_id = $1`, [
        id,
    ]);
};

module.exports.addName = (name, last, email, password) => {
    return db.query(
        `
    INSERT INTO users (first , last , email, password)
    VALUES ($1, $2,$3,$4)
    RETURNING id `,
        [name, last, email, password]
    );
};

module.exports.addsin = (sin, id) => {
    return db.query(
        `
    INSERT INTO signatures (signature , user_id )
    VALUES ($1, $2)
    RETURNING id `,
        [sin, id]
    );
};
module.exports.addprofile = (age, city, url, id) => {
    return db.query(
        `
    INSERT INTO user_profiles (age ,city,url, user_id )
    VALUES ($1, $2,$3,$4)
    RETURNING id `,
        [age || null, city, url, id]
    );
};
module.exports.addedituser = (first, last, email, pass, id) => {
    console.log("id in db ", id);

    return db.query(
        `
    INSERT INTO users (id,first, last, email,password)
    VALUES ($1, $2, $3,$4,$5) 
    ON CONFLICT (id)
    DO UPDATE SET first = $2, last = $3 ,email = $4 , password= $5 ;
     `,
        [id, first, last, email, pass]
    );
};

module.exports.addeditup = (age, city, url, id) => {
    return db.query(
        `
    INSERT INTO user_profiles (age, city, url,user_id)
    VALUES ($2, $3, $4,$1) 
    ON CONFLICT (user_id)
    DO UPDATE SET age = $2, city = $3 ,url = $4 ;
     `,
        [id, age, city, url]
    );
};

// db.query("SELECT * FROM actors")
//     .then(function (result) {
//         //console.log(result.rows);
//     })
//     .catch(function (err) {
//         //   console.log(err);
//     });
