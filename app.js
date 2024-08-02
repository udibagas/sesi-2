const { createServer } = require("node:http");
const fs = require("fs");

const server = createServer((req, res) => {
  // logging
  let date = new Date().toLocaleString("id", { dateStyle: "full" });
  const log = `[${date} ${req.url}]\n`;

  fs.appendFile("./access.log", log, (err) => {
    if (err) console.log(err.message);
  });

  fs.readFile("./data/users.json", "utf-8", (err, data) => {
    const users = JSON.parse(data);
    const template = fs.readFileSync("./users.html", "utf-8");

    res.writeHead(200, { "Content-Type": "text/html" });
    let table = `
    <table border="1">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Gender</th>
        </tr>
      </thead>
      <tbody>
    `;

    for (let user of users) {
      table += `
      <tr>
          <td>${user.first_name}</td>
          <td>${user.email}</td>
          <td>${user.gender}</td>
        </tr>
    `;
    }

    table += `
      </tbody>
    </table>
    `;

    res.write(template.replace("{{ table }}", table));
    res.end();
  });
});

// starts a simple http server locally on port 3000
server.listen(3000, "127.0.0.1", () => {
  console.log("Listening on 127.0.0.1:3000");
});
