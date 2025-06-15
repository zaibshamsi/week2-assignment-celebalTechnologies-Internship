const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const baseDir = process.cwd();
const PORT = 3000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    //setting the header
    res.setHeader('Content-type', 'application/json');

    if (pathname === '/list') {
        const items = fs.readdirSync(baseDir);
        res.end(JSON.stringify({ files: items }));
    }
    else if (pathname === '/create-file' && req.method == 'GET') {

        const filename = query.name;
        if (!filename) return res.end(JSON.stringify({ error: 'filename is required ' }));

        fs.writeFileSync(path.join(baseDir, filename), '');
        res.end(JSON.stringify({ message: 'file created ' }));
    }
    else if (pathname === '/create-folder' && req.method === 'GET') {
        const folder = query.name;
        if (!folder) return res.end(JSON.stringify({ error: 'Folder name is required' }));
        fs.mkdirSync(path.join(baseDir, folder));
        res.end(JSON.stringify({ message: 'Folder created' }));
    }
    else if (pathname === '/read-file' && req.method === 'GET') {
        const filename = query.name;
        try {
            const content = fs.readFileSync(path.join(baseDir, filename), 'utf-8');
            res.end(JSON.stringify({ content }));
        } catch (err) {
            res.end(JSON.stringify({ error: 'File not found' }));
        }
    }
    else if (pathname === '/write-file' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const { name, content } = JSON.parse(body);
            if (!name) return res.end(JSON.stringify({ error: 'Filename is required' }));
            fs.writeFileSync(path.join(baseDir, name), content || '');
            res.end(JSON.stringify({ message: 'Content written' }));
        });
    }

    else if (pathname === '/rename' && req.method === 'GET') {
        const { oldName, newName } = query;
        if (!oldName || !newName) return res.end(JSON.stringify({ error: 'Both old and new names required' }));
        fs.renameSync(path.join(baseDir, oldName), path.join(baseDir, newName));
        res.end(JSON.stringify({ message: 'Renamed successfully' }));
    }
    else if (pathname === '/rename' && req.method === 'GET') {
        const { oldName, newName } = query;
        if (!oldName || !newName) return res.end(JSON.stringify({ error: 'Both old and new names required' }));
        fs.renameSync(path.join(baseDir, oldName), path.join(baseDir, newName));
        res.end(JSON.stringify({ message: 'Renamed successfully' }));

    } else if (pathname === '/delete' && req.method === 'GET') {
        const target = query.name;
        const targetPath = path.join(baseDir, target);
        try {
            const stat = fs.statSync(targetPath);
            if (stat.isDirectory()) {
                fs.rmdirSync(targetPath);
            } else {
                fs.unlinkSync(targetPath);
            }
            res.end(JSON.stringify({ message: 'Deleted successfully' }));
        } catch (err) {
            res.end(JSON.stringify({ error: 'Error deleting file/folder' }));
        }

    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Route not found' }));
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});