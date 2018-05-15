const http = require('http')
const DAL = require('./DAL');
const pathData = '/data.xml'
const URL = require("url");
const fs = require("fs");
const qs = require('querystring');

http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`)
    res.setHeader("Content-type", "text/xml");
    if (req.method.toLocaleLowerCase() === 'get') {
        if (req.url === '/') {
            req.url = '/GUI.html'
        }
        const {
            pathname,
            query
        } = URL.parse(req.url, true);
        console.log(pathname, query)
        switch (pathname) {
            case '/danh-sach-dau-sach':
                return DAL.read(__dirname + pathData)
                    .then(data => {
                        res.end(data);
                    })
                    .catch(err => {
                        console.log(err + '')
                        res.end();
                    })
            default:
                return DAL.read(__dirname + req.url)
                    .then(data => {
                        res.setHeader("Content-type", "text/html");
                        res.end(data)
                    })
                    .catch(err => {
                        console.log(err + '');
                        res.end()
                    })
        }
    } else
    if (req.method.toLocaleLowerCase() === 'post') {
        let body = '';
        req.on('data', function (dataCm) {
            body += dataCm;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                req.connection.destroy();
        });

        req.on('end', function () {
            var postdata = qs.parse(body);
            switch (req.url) {
                case '/them-dau-sach':
                    DAL.insert(__dirname + pathData, {
                            Ten: postdata.Ten,
                            TacGia: postdata.TacGia,
                            TheLoai: postdata.TheLoai
                        })
                        .then(data => {
                            res.end(data);
                        })
                        .catch(err => {
                            console.log(err + '')
                            res.end();
                        })
                        break;

                case '/cap-nhat-dau-sach':
                    DAL.update(__dirname + pathData, {
                            MaDauSach: postdata.MaDauSach,
                            Ten: postdata.Ten,
                            TacGia: postdata.TacGia,
                            TheLoai: postdata.TheLoai
                        })
                        .then(data => {
                            res.end(data);
                        })
                        .catch(err => {
                            res.end();
                        })
                    break;
                case '/xoa-dau-sach':
                    DAL.delete(__dirname + pathData, postdata.MaDauSach)
                        .then(data => {
                            res.end(data);
                        })
                        .catch(err => {
                            res.end();
                        })
                    break;

                default:
                    res.end();
                    break;
            }
        })
    }
}).listen(3000, err => {
    if (err) {
        console.log(err + '');
    } else {
        console.log('server đang hoạt động ở http://localhost:3000');
    }
})