import re
import json
import pprint as pp

ori_fs_path = "microeconomics.md"
obj_fs_path = "concept_name.json"
name_reg = r'\*\*(.*?)\*\*'

with open(ori_fs_path) as fs:
    titles = list(re.findall(name_reg, fs.read()))
    with open(obj_fs_path, "a") as obj:
        obj.write(json.dumps(titles))

        print("done!")