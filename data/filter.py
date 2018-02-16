import re
import json

with open("zip_microeco.json") as fs:
	contents = json.loads(fs.read())
	
	for key in contents.keys():
		print(key, "+", contents[key])