require("dotenv").config();

const express         = require("express"),
      path            = require("path"),
      bodyParser      = require("body-parser"),
      cons            = require("consolidate"),
      pg              = require("pg"),
      app             = express();


const pool = new pg.Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ,
  host: process.env.DB_HOST ,
  port : process.env.DB_PORT,
  database: process.env.DB_DB
})

// pool.connect((err) => {
//   if (err) throw err;
//   else console.log("conected")
// })

app.engine('dust', cons.dust);
app.set("view engine", 'dust');
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", async(req,res) => {
  await pool.connect((err, client, done) => {
    if (err) throw err;
    // else console.log("conected")
    else {
      client.query(`SELECT * FROM recipies;`, (err, data) => {
       if (err) throw err;
       else res.render("index", {data: data.rows});
       done();
     })
    }
  });
});

app.post("/add", async(req,res) => {
  await pool.connect((err, client, done) => {
    if (err) throw err;
    // else console.log("conected")
    else {
      client.query(`INSERT INTO recipies(name, ingredients, directions) VALUES($1, $2, $3)`,
      [req.body.name, req.body.ingredients, req.body.directions],
       (err, data) => {
       if (err) throw err;
       else res.redirect("/")
       done();
     });
    }
  });
  });

  app.delete("/delete/:id", async(req,res) => {
    await pool.connect((err, client, done) => {
      if (err) throw err;
      // else console.log("conected")
      else {
        client.query(`DELETE FROM recipies WHERE id = $1`, [req.params.id]);
        done()
        res.send(200)
      }
    });
  });

  app.post("/edit", async(req,res) => {
    await pool.connect((err, client, done) => {
      if (err) throw err;
      // else console.log("conected")
      else {
        client.query(`UPDATE recipies SET name=$1 , ingredients=$2, directions = $3 WHERE id = $4`,
        [req.body.name, req.body.ingredients, req.body.directions, req.body.id]);
        done()
        res.redirect("/")
      }
    });
  });


app.listen(3000, () => {
  console.log("works...")
})
