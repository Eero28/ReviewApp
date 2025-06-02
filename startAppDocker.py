import subprocess

project_name = "nestjs-expo-app"

compose_command = f"docker-compose -p {project_name} up --build"

# Launch Docker 
subprocess.Popen(["start", "cmd", "/K", compose_command], shell=True)
