import subprocess
import os
import time

main_folder = os.getcwd()
review_app = os.path.join(main_folder, "ReviewApp")
review_app_server = os.path.join(main_folder, "ReviewApp-server")


subprocess.Popen(["start", "cmd", "/K", f"cd {review_app} && npm start"], shell=True)

time.sleep(1)

subprocess.Popen(["start", "cmd", "/K", f"cd {review_app_server} && npm start"], shell=True)
