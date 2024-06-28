# Imports
import datetime
import os
import subprocess

# Variables
current_directory = './root'

# MAIN User Input
def main():
    global user_input
    user_input = input(f"User@Bash ~ Admin {current_directory}$ ")
    if user_input == 'help':
            help_interface()
    elif user_input.startswith("echo "):
        echo()
    elif user_input == "date":
        date()
    elif user_input == "clear":
         clear_screen()
    elif user_input == "ls":
        list_current_directory()
    elif user_input.startswith("mkdir "):
        make_directory()
    elif user_input.startswith("rm "):
        remove_file()
    elif user_input.startswith("cd "):
        change_directory()
    elif user_input == "pwd":
        print_working_directory()
    elif user_input.startswith("cat "):
        display_file_content()
    elif user_input.startswith("catimg "):  
        display_image()
    elif user_input == "whoami":
        print("Admin")
    elif user_input.startswith("git clone "):
        git_clone()  
    elif user_input == "exit":
        quit()
        '''
    else:
        print("Command",user_input,"not reconized.")
        '''
         
# echo
def echo():
    word = user_input[5:]
    print(word)

# date
def date():
    current_date = datetime.datetime.now()
    print(current_date.strftime("%Y-%m-%d"))

# clear
def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

# list directory (ls)
def list_current_directory():
    if os.path.exists(current_directory) and os.path.isdir(current_directory):
        files = os.listdir(current_directory)
        print(f"Contents of '{current_directory}' directory:")
        for file in files:
            print(file)
    else:
        print(f"'{current_directory}' directory not found or is not a directory.")

# make directory (mdkir)
def make_directory():
    directory_name = user_input[6:]
    try:
        os.mkdir(f'{current_directory}/{directory_name}')
        print(f"Directory '{directory_name}' created successfully.")
    except FileExistsError:
        print(f"Directory '{directory_name}' already exists.")

# remove Directory/File (rm)
def remove_file():
    file_name = user_input[3:].strip()
    file_path = os.path.join(current_directory, file_name)

    if os.path.exists(file_path):
        try:
            # Remove Directory
            if os.path.isdir(file_path):
                os.rmdir(file_path) 
                print(f"Directory '{file_name}' removed successfully.")
            # Remove File
            else:
                os.remove(file_path) 
                print(f"File '{file_name}' removed successfully.")
        except OSError as e:
            print(f"Error: {e}")
    else:
        print(f"File '{file_name}' not found.")

# change directory (cd)
def change_directory():
    global current_directory
    directory = user_input[3:]
    if directory == '..':
        current_directory = os.path.dirname(current_directory)
    else:
        new_directory = os.path.join(current_directory, directory)
        if os.path.exists(new_directory) and os.path.isdir(new_directory):
            current_directory = new_directory
        else:
            print(f"Directory '{directory}' not found.")

# print working directory (pwd)
def print_working_directory():
    if current_directory == '':
        print("Current directory: none")
    else:
        print(f"Current directory: {current_directory}")

# cat
def display_file_content():
    file_name = user_input[4:].strip()
    file_path = os.path.join(current_directory, file_name)

    if os.path.exists(file_path) and os.path.isfile(file_path):
        with open(file_path, 'r') as file:
            content = file.read()
            print(f"Contents of '{file_name}':")
            print(content)
    else:
        print(f"File '{file_name}' not found.")

# catimg
def display_image():
    file_name = user_input[7:].strip() 
    file_path = os.path.join(current_directory, file_name)

    if os.path.exists(file_path) and os.path.isfile(file_path):
        try:
            if os.name == 'posix':  # Linux
                os.system(f'display "{file_path}"')
            elif os.name == 'nt':  # Windows
                os.system(f'start "" "{file_path}"')
            elif sys.platform == 'darwin':  # macOS
                os.system(f'open "{file_path}"')
        except Exception as e:
            print(f"Error opening image: {e}")
    else:
        print(f"File '{file_name}' not found.")

# git
def git_clone():
    repo_url = user_input[9:].strip()  
    try:
        subprocess.run(['git', 'clone', repo_url], cwd=current_directory, check=True)
        print(f"Repository cloned successfully from '{repo_url}'")
    except subprocess.CalledProcessError as e:
        print(f"Error cloning repository: {e}")

# Bash help Interface (help)
def help_interface():
    print("help")
    print("echo [name]")
    print("date")
    print("clear")
    print("mkdir [folder name]")
    print("rm [folder name]")
    print("cd [folder name]")
    print("cd ..")
    print("cat [file name]")
    print("catimg [image name]")
    print("ls")
    print("pwd")
    print("whoami")
    print("history")
    print("git clone")
    print("exit")

while True:
    main()


