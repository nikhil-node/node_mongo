/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify"); // url slug example
const replaceTempleteData = require("./modules/replaceTempleteData");
// const msg = 'this is test application';
// console.log(msg);

/* Read content from file using fs module (Blocking or Sync way)*/
const textRead = fs.readFileSync("./text/sample.txt", "utf-8");
//console.log(textRead);

/** Write content to file using fs module (Blocking or Sync way) */
const textWrite = `This is sample text data written : ${textRead}.\n Created On ${Date.now(
  "Y-m-d"
)}`;
fs.writeFileSync("./text/output.txt", textWrite);
//console.log('File written successfully');

/** Read content from file using fs module (Non-blocking or Async way) */

fs.readFile("./text/sample.txt", "utf-8", (err, data) => {
  if (err) console.log("error");
  //console.log(data);
});
//console.log('It`s not done');
const extra = "This is last extra line added";
fs.readFile("./text/sample.txt", "utf-8", (err, data) => {
  // eslint-disable-next-line no-shadow
  fs.readFile(`./text/output.txt`, "utf-8", (err, data1) => {
    fs.writeFile(
      "./text/final.text",
      `${data}\n${data1}\n${extra}`,
      "utf-8",
      (err, data3) => {
        if (err) console.log("same erros");
        //console.log('done!!!');
      }
    );
  });
});

/** Server Create Example */
const readFile = fs.readFileSync(`${__dirname}/text/sample.json`, "utf-8");
const dataObj = JSON.parse(readFile);

const slug = dataObj.map((el) =>
  slugify(`${el.firstName}-${el.lastName}`, { lower: true })
); // slug url example url
//console.log(slug);

//User templete
const userTemplate = fs.readFileSync(
  `${__dirname}/templates/user-overview.html`,
  "utf-8"
);
const usersList = fs.readFileSync(
  `${__dirname}/templates/user-data.html`,
  "utf-8"
);
const usersView = fs.readFileSync(
  `${__dirname}/templates/user-view.html`,
  "utf-8"
);

const server = http.createServer((req, res) => {
  const urlPath = req.url;
  // eslint-disable-next-line node/no-deprecated-api
  const { query, pathname } = url.parse(req.url, true);
  if (urlPath === "/overview" || urlPath === "/overview/{:id}") {
    // eslint-disable-next-line no-template-curly-in-string
    res.end('<h1 style="color:blue">This is overview page `${id}`</h1>');
  } else if (urlPath === "/users") {
    // res.writeHead(200,{'Content-type':'text/html'});
    // res.end(userTemplate);
    res.writeHead(200, { "Content-type": "text/html" });
    const htmlObj = dataObj
      .map((el) => replaceTempleteData(usersList, el))
      .join("");
    const output = userTemplate.replace("{{USER_CARDS}}", htmlObj);
    //console.log(htmlObj);
    res.end(output);
  } else if (pathname === "/view-user") {
    res.writeHead(200, { "Content-type": "text/html" });
    const userview = dataObj[query.id];
    const output = replaceTempleteData(usersView, userview);
    // console.log(userview);
    res.end(output);
  } else if (urlPath === "/api/data") {
    // fs.readFile(`${__dirname}/text/sample.json`,'utf-8',(err,data) =>{
    //     const dataObj = JSON.parse(data);
    //     res.writeHead(200,{'Content-type':'text/html'});
    //     res.end(data);
    // });
    // const htmlObj = userData.map(el => replaceTempleteData(userCard,el))
    // res.writeHead(200,{'Content-type':'text/html'});
    // console.log(htmlObj);
    // res.end(readFile);
  } else if (urlPath === "/") {
    res.end(
      '<h1 style="color:blue">Yeah your server created successfully</h1>'
    );
  } else {
    res.writeHead(404);
    res.end('<h1 style="color:red">Page not found</h1>');
  }
});
server.listen(3000, () => {
  console.log("Server Started");
});
