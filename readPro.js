module.exports = (file) => new Promise((resolve,reject)=>{
    fs.readFile(file,(err,data)=>{
        if(err) reject('I cound not file in path');
        resolve(data);
    });
})