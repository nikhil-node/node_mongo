const fs = require('fs');
const server = require('http').createServer();


server.on('request',(req,res)=>{
    //Solution 1
    fs.readFile('./text/test-sample.txt',(err,data)=>{
        if(err) console.log(err);
        res.end(data);
    })
    //Solution 2
    // const readable = fs.createReadStream('./text/test-sample.txt');
    // readable.on('data',chunk =>{
    //     res.write(chunk);
    // });
    // readable.on('end',() =>{
    //     res.end();
    // });
    // readable.on('error', err =>{
    //     console.log(err);
    //     res.statusCode = 500;
    //     res.end('File not found');
    // });

    //solution 3
    // const readable = fs.createReadStream('./text/test-sample.txt');
    // readable.pipe(res);
    // readableSource.pipe(writeable distionation)
});

server.listen(3002,'localhost',()=>{
    console.log('Listing...');
})