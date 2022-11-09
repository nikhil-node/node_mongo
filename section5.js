const { rejects } = require('assert');
const fs = require('fs');
const superagent =  require('superagent');
import dogFile from './readPro.js';
// const readFilePro = file = {
//     return new Promise((resolve,reject)=>{
//         fs.readFile(file,(err,data)=>{
//             if(err) reject('I cound not file in path');
//             resolve(data);
//         });
//     })
// };


dogFile(`${__dirname}/text/dog.txt`).then(data =>{
    console.log(data);
})

fs.readFile(`${__dirname}/text/dog.txt`,(err,data) =>{
   // console.log(`Breed Name :${data}`);
    
    // Callback in callback example
    // superagent.get(`https://dog.ceo/api/breed/${data}/images/random`).end((err,res)=>{
    //     //console.log(res.body.message);
    //     fs.writeFile(`${__dirname}/text/dog-img.txt`, res.body.message, err => {
    //         console.log('Random dog name saved to file');
    //     })
    // })

    // superagent.get(`https://dog.ceo/api/breed/${data}/images/random`).then(res =>{
    //     fs.writeFile(`${__dirname}/text/dog-img.txt`, res.body.message, err => {
    //         console.log('Random dog name saved to file');
    //     })
    // }).catch(err => {
    //     console.log(err.message);
    // })
});