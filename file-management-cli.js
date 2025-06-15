const fs = require('fs');
const path  = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const baseDir = process.cwd();

function prompt(){
    console.log('\n Choose an Option: \n');
    console.log('1. List files and folders');
    console.log('2. Create a file');
    console.log('3. Create a folder');
    console.log('4. Read a file');
    console.log('5. Write to a file');
    console.log('6. Rename a file/folder');
    console.log('7. Delete a file/folder');
    console.log('8. Exit\n');

    rl.question('Enter your choice: ' , (choice) => {
        switch(choice.trim()){
            case '1' :
                listFiles();
                break;

            case '2':
                rl.question('Enter file name: ', (filename) => {
                    fs.writeFileSync(path.join(baseDir, filename), '');
                    console.log("file created");
                    prompt();
                });
                break;

            case '3':
                rl.question('enter folder name: ', (folderName) => {
                    fs.mkdirSync(path.join(baseDir, folderName));
                    console.log("Folder created");
                    prompt();
                });
                break;

            case '4':
                rl.question('Enter file name to read: ', (filenName) => {
                    try{
                        const data = fs.readFileSync(path.join(baseDir, filenName), 'utf-8');
                        console.log('\n--- File contents ---\n');
                        console.log(data);
                    }catch(err){
                        console.error('Error reading file: ', err.message);
                    }
                    prompt();
                });
                break;

            case '5':
                rl.question('Enter file name to write to: ', (fileName) => {
                    rl.question('enter the content to be written: ' ,(content) => {
                        fs.writeFileSync(path.join(baseDir, fileName), content);
                        console.log('Content written.');
                        prompt();
                    });
                })
                break;

            case '6':
                rl.question('Enter current name: ', (oldName) => {
                    rl.question("Enter new name: " , (newName )=> {
                        fs.renameSync(path.join(baseDir, oldName), path.join(baseDir, newName));
                        console.log('Renamed successfully.');
                        prompt();
                    })
                })
                break;

            case '7':
                rl.question("Enter file/folder name to delete: " ,(target) =>{
                    const targetPath = path.join(baseDir, target);
                    try {
                        const stat = fs.statSync(targetPath);
                        if(stat.isDirectory()) {
                            fs.rmdirSync(targetPath);
                        }else{
                            fs.unlinkSync(targetPath);
                        }
                        console.log('Deleted successfully.');
                    } catch (error) {
                        console.error('Error deleting:', err.message);
                    }
                    prompt();
                });
                break;

            case '8':
                rl.close();
                break;
            default:
                console.log('Invalid choice. ');
                prompt();
                break;
        }
    })
}

function listFiles(){
    const files = fs.readdirSync(baseDir);
    console.log('\nFiles and folders in current directory:\n');
    files.forEach((f, i) => console.log(`${i + 1}. ${f}`));
    prompt();
}

prompt();