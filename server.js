const http = require('http')
const https = require('https')
const fs = require('fs')

const urlArr = [
'http://img.zcool.cn/community/01e505554437be0000019ae95582a2.jpg@900w_1l_2o_100sh.jpg',
'http://static.pig66.com/uploadfile/2017/1102/20171102095531217.png',
'http://static.pig66.com/uploadfile/2017/1024/20171024061038994.jpg',
'http://pic18.nipic.com/20120107/5817249_164207424196_2.jpg',
'http://static.pig66.com/uploadfile/2017/1103/20171103104840363.png',
'http://ps3.tgbus.com/UploadFiles/201108/20110808184137501.jpg',
'http://img2.imgtn.bdimg.com/it/u=3872769505,807259313&fm=26&gp=0.jpg',
'http://img0.bdstatic.com/static/searchdetail/img/logo-2X_0c4ef02.png',
]

urlArr.forEach(url => {
    getImg(url)
})

function getImg(url, name) {
    if(url.startsWith('https://')) {
        https.get(url, res => {
            const { statusCode } = res
            if ( statusCode === 301 ) {
                const url = res.headers['location']
                return getImg(url)
            }
            let img = []
            let size = 0
            // 将图片地址以【.】符号分割，取最后一项，即为格式后缀
            const _arr = url.split('.')
            const format = _arr[_arr.length - 1]
            // 如果没有传入图片，则使用随机数
            const _name = name ? name : 'image-' + Math.floor(Number(new Date()) * Number(Math.random()))
            res.on('data', chunk => {
                img.push(chunk)
                size += chunk.length
            })
            res.on('end', () => {
                // 合并 Buffer
                const buffer = Buffer.concat(img, size)
                fs.writeFile(`img/${_name}.${format}`, buffer, (err) => {
                    if (err) {
                        return console.error(err);
                    }
                    console.log("数据写入成功！");
                })
            })
        })
    } else {
        http.get(url, {encoding: null}, res => {
            const { statusCode } = res
            if ( statusCode === 301 ) {
                const url = res.headers['location']
                return getImg(url)
            }
            let img = []
            let size = 0
            // 将图片地址以【.】符号分割，取最后一项，即为格式后缀
            const _arr = url.split('.')
            const format = _arr[_arr.length - 1]
            // 如果没有传入图片名字，则使用随机数
            const _name = name ? name : 'image-' + Math.floor(Number(new Date()) * Number(Math.random()))
            res.on('data', chunk => {
                img.push(chunk)
                size += chunk.length
            })
            res.on('end', (data) => {
                // 合并 Buffer
                const buffer = Buffer.concat(img, size)
                fs.writeFile(`img/${_name}.${format}`, buffer, (err) => {
                    if (err) {
                        return console.error(err);
                    }
                    console.log("数据写入成功！");
                })
            })
        })
    }
}