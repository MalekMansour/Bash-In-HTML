document.addEventListener('DOMContentLoaded', function() {
  const commandInput = document.getElementById('commandInput');
  const output = document.getElementById('output');
  const commandHistory = [];
  let historyIndex = -1;
  let fileSystem = JSON.parse(localStorage.getItem('fileSystem')) || { 'root': [] };
  let currentDirectory = 'root';

  commandInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      const command = commandInput.value.trim().toLowerCase();
      commandHistory.push(command);
      historyIndex = commandHistory.length;
      output.innerHTML += `<div>User@Machine ~$ ${command}</div>`;
      handleCommand(command);
      commandInput.value = '';
      output.scrollTop = output.scrollHeight;
    } else if (event.key === 'ArrowUp') {
      if (historyIndex > 0) {
        historyIndex--;
        commandInput.value = commandHistory[historyIndex];
      }
    } else if (event.key === 'ArrowDown') {
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        commandInput.value = commandHistory[historyIndex];
      } else {
        commandInput.value = '';
      }
    }
  });

  function updateFileSystem() {
    localStorage.setItem('fileSystem', JSON.stringify(fileSystem));
  }

  function handleCommand(command) {
    switch (command) {
      case 'help':
        // Display available commands
        output.innerHTML += `
          <div>
            <pre>
              list of available commands:
              - help: show available commands
              - date: display the current date and time
              - echo [text]: display the given text
              - clear: clear the screen
              - ls: list files/directories
              - cd [directory]: change directory
              - mkdir [directory_name]: create a directory
              - rm [file]: remove a file
              - pwd: display current directory path
              - whoami: display current username
              - history: display command history
            </pre>
          </div>`;
        break;
      case 'date':
        // Display current date and time
        const currentDate = new Date().toLocaleString();
        output.innerHTML += `<div>${currentDate}</div>`;
        break;
      case 'clear':
        // Clear the output area
        output.innerHTML = '';
        break;
      case 'ls':
        const currentDirFiles = fileSystem[currentDirectory];
        if (currentDirFiles && currentDirFiles.length > 0) {
          output.innerHTML += `<div>${currentDirFiles.join('<br>')}</div>`;
        } else {
          output.innerHTML += '<div>No files/directories found.</div>';
        }
        break;
      case 'cd ..':
        const parentDirectory = currentDirectory === 'root' ? 'root' : currentDirectory.substring(0, currentDirectory.lastIndexOf('/'));
        if (fileSystem[parentDirectory]) {
          currentDirectory = parentDirectory;
          output.innerHTML += `<div>Moved to parent directory: /${currentDirectory}</div>`;
        } else {
          output.innerHTML += '<div>No parent directory found.</div>';
        }
        break;
      case 'cd':
        output.innerHTML += '<div>Usage: cd [directory]</div>';
        break;
      case 'mkdir':
        output.innerHTML += '<div>Usage: mkdir [directory_name]</div>';
        break;
      case 'rm':
        output.innerHTML += '<div>Usage: rm [file]</div>';
        break;
      case 'pwd':
        output.innerHTML += `<div>Current Directory: /${currentDirectory}</div>`;
        break;
      case 'whoami':
        output.innerHTML += '<div>User: John Doe</div>';
        break;
      case 'history':
        // Display command history
        output.innerHTML += `<div>${commandHistory.map((cmd, index) => `${index + 1}. ${cmd}`).join('<br>')}</div>`;
        break;
      case 'echo':
        output.innerHTML += '<div>Usage: echo [text]</div>';
        break;
      default:
        if (command.startsWith('echo ')) {
          const text = command.substring(5).trim();
          output.innerHTML += `<div>${text}</div>`;
        } else if (command.startsWith('mkdir ')) {
          const directoryName = command.substring(6).trim();
          const newPath = currentDirectory === 'root' ? `/${directoryName}` : `${currentDirectory}/${directoryName}`;
          if (!fileSystem[currentDirectory]) {
            fileSystem[currentDirectory] = [];
          }
          fileSystem[currentDirectory].push(directoryName);
          fileSystem[newPath] = [];
          updateFileSystem();
          output.innerHTML += `<div>Created directory: ${newPath}</div>`;
        } else if (command.startsWith('cd ')) {
          const targetDirectory = command.substring(3).trim();
          const newPath = targetDirectory === 'root' ? targetDirectory : `${currentDirectory}/${targetDirectory}`;
          if (fileSystem[newPath]) {
            currentDirectory = newPath;
            output.innerHTML += `<div>Changed directory to: /${currentDirectory}</div>`;
          } else {
            output.innerHTML += `<div>Directory '${targetDirectory}' not found.</div>`;
          }
        } else if (command.startsWith('rm ')) {
          // ... (existing rm handling)

        } else {
          output.innerHTML += `<div>'${command}' is not recognized as a command.</div>`;
        }
        break;
    }
  }
});

