const fs = require("fs");
const xml2js = require("xml2js");

module.exports.read = path => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, buff) => {
            if (err) return reject(err);
            resolve(buff);
        });
    });
};

module.exports.insert = (path, data) => {
    return new Promise((resolve, reject) => {
        let buff = fs.readFileSync(path)
        //parse xml ra object
        xml2js.parseString(buff, (err, XMLDOM) => {
            if (err) {
                return reject(err)
            }
            let MaDauSachTiepTheo = 0;
            if (XMLDOM.DS_Dau_Sach.Dau_Sach === undefined) {
                XMLDOM.DS_Dau_Sach = {}
                XMLDOM.DS_Dau_Sach.Dau_Sach = [];
            } else {
                MaDauSachTiepTheo = parseInt(XMLDOM.DS_Dau_Sach.Dau_Sach[XMLDOM.DS_Dau_Sach.Dau_Sach.length - 1].$.MaDauSach) + 1;
            }
            XMLDOM.DS_Dau_Sach.Dau_Sach.push({
                $: {
                    'Ten': data.Ten,
                    'MaDauSach': MaDauSachTiepTheo,
                    'TacGia': data.TacGia,
                    'TheLoai': data.TheLoai
                }
            })

            //dịch ngược từ object ra xml
            const builder = new xml2js.Builder();
            const xmlres = builder.buildObject(XMLDOM);
            fs.writeFileSync(path, xmlres, {
                encoding: "utf-8",
                flag: "w"
            });
            resolve(xmlres)
        })
    })
}

module.exports.update = (path, data) => {
    return new Promise((resolve, reject) => {
        let buff = fs.readFileSync(path)
        //parse xml ra object
        xml2js.parseString(buff, (err, XMLDOM) => {
            if (err) {
                return reject(err)
            }
            for (let i = 0; i < XMLDOM.DS_Dau_Sach.Dau_Sach.length; i++) {
                if (XMLDOM.DS_Dau_Sach.Dau_Sach[i].$.MaDauSach == data.MaDauSach) {
                    XMLDOM.DS_Dau_Sach.Dau_Sach[i].$.Ten = data.Ten;
                    XMLDOM.DS_Dau_Sach.Dau_Sach[i].$.TacGia = data.TacGia;
                    XMLDOM.DS_Dau_Sach.Dau_Sach[i].$.TheLoai = data.TheLoai;
                    break;
                }
            }

            //dịch ngược từ object ra xml
            const builder = new xml2js.Builder();
            const xmlres = builder.buildObject(XMLDOM);
            fs.writeFileSync(path, xmlres, {
                encoding: "utf-8",
                flag: "w"
            });
            resolve(xmlres)
        })
    })
}

module.exports.delete = (path, MaDauSach) => {
    return new Promise((resolve, reject) => {
        let buff = fs.readFileSync(path)
        //parse xml ra object
        xml2js.parseString(buff, (err, XMLDOM) => {
            if (err) {
                return reject(err)
            }
            for (let i = 0; i < XMLDOM.DS_Dau_Sach.Dau_Sach.length; i++) {
                if (XMLDOM.DS_Dau_Sach.Dau_Sach[i].$.MaDauSach == MaDauSach) {
                    delete XMLDOM.DS_Dau_Sach.Dau_Sach[i];
                    break;
                }
            }

            //dịch ngược từ object ra xml
            const builder = new xml2js.Builder();
            const xmlres = builder.buildObject(XMLDOM);
            fs.writeFileSync(path, xmlres, {
                encoding: "utf-8",
                flag: "w"
            });
            resolve(xmlres)
        })
    })
}