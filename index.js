let mysql = require('mysql');
let http = require('http');

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Bncvznczvzz1411',
    database: 'dbTest',
    charset: 'utf8_general_ci'
});

connection.connect(err => {
    if (err) {
        throw err.stack;
    } else {
        console.log('Connect success');
        let sql = "create table if not exists products(id int auto_increment primary key, name varchar(30) not null, price int not null)";
        connection.query(sql, err => {
            if (err) throw err;
            console.log('Create table success');
        });
    }
});

let server = http.createServer(async (req, res) => {
    try {
        if (req.url === '/product/create' && req.method === 'POST') {
            let buffers = [];
            for await (let chunk of req) {
                buffers.push(chunk);
            }
            let data = Buffer.concat(buffers).toString();
            let product = JSON.parse(data);
            let sqlCreate = `insert into products(name, price) values('${product.name}', ${+product.price});`;
            connection.query(sqlCreate, (err, results, fields) => {
                if (err) throw err;
                res.end(JSON.stringify(product));
            });
        }
    } catch (err) {
        return res.end(err.message);
    }
});

server.listen(8080, () => {
    console.log('http://localhost:8080');
});