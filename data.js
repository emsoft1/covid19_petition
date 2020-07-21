const https = require("https");

exports.getdata = function () {
    return new Promise((resolve, reject) => {
        const req = https.request(
            {
                method: "GET",
                host: "corona-virus-stats.herokuapp.com",
                path: "/api/v1/cases/general-stats",
            },
            (res) => {
                if (res.statusCode != 200) {
                    // cb(new Error("Non-200 status code: " + res.statusCode));
                    return;
                }

                let body = "";
                res.on("data", (chunk) => (body += chunk))
                    .on("end", () => {
                        body = JSON.parse(body);
                        resolve(body);
                        // console.log(body);
                    })
                    .on("error", (err) => {
                        reject(err);
                        // console.log(err);
                    });
            }
        );

        req.end();
    });
};
