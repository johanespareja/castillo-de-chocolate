
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const publicFolder = path.join(__dirname, "public");

const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".jpg": "image/jpeg",
    ".png": "image/png",
    ".svg": "image/svg+xml"
};

const server = http.createServer((req, res) => {

    let requestedPath = req.url.split("?")[0];

    if (requestedPath === "/") {
        requestedPath = "/index.html";
    }

    const filePath = path.join(
        publicFolder,
        path.normalize(requestedPath).replace(/^[/\\]+/, "")
    );

    if (!filePath.startsWith(publicFolder + path.sep) &&
        filePath !== path.join(publicFolder, "index.html")) {
        res.writeHead(403);
        return res.end("Acceso denegado");
    }

    fs.readFile(filePath, (error, content) => {

        if (error) {
            res.writeHead(404);
            return res.end("Archivo no encontrado");
        }

        const extension = path.extname(filePath);

        res.writeHead(200, {
            "Content-Type": mimeTypes[extension] ||
                "application/octet-stream"
        });

        res.end(content);
    });

});

server.listen(PORT, () => {
    console.log("--------------------------------");
    console.log(" CASTILLO DE CHOCOLATE");
    console.log("--------------------------------");
    console.log(`Servidor iniciado: http://localhost:${PORT}`);
});