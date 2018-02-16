import re
import json
import pprint as pp

def main():
	reg_title = r'\*\*(.*?)\*\*'
	reg_content = r' - (.*)'
	fs_path = "microeconomics.md"
	file_json_topic = "microeconomics.json"
	file_related_topics = "topic-link.json"

	with open(fs_path) as fs:
		contents = fs.read()

		titles, contents = reform_content(contents, reg_title, reg_content)
		title_list = list(enumerate(titles))
		contents_list = list(enumerate(contents))
		related_topics = find_related_topics(title_list, contents_list)
		dict_topics = list(zip(titles, contents))

		with open(file_json_topic, "w") as fjt:
			fjt.write(json.dumps(dict_topics))

		with open(file_related_topics, "w") as frt:
			frt.write(json.dumps(related_topics))

	print("Writing process has been successful")


def reform_content(contents, reg_title, reg_content):
	titles = re.findall(reg_title, contents)
	contents = re.findall(reg_content, contents)

	return titles, contents

def find_related_topics(titles, contents):
	related_topics = {}

	for title_group in titles:
		title_index = title_group[0]
		title = title_group[1]
		reg = str(title)
		related_items = []

		for content_group in contents:
			content_index = content_group[0]
			content = str(content_group[1])

			if (re.search(reg, content) != None and content_index != title_index):
				related_items.append(content_index)
			
		
		#print(related_items)
		if (related_items != []):
			related_topics[title_index] = {
				"num": len(related_items),
				"topics": related_items
			}
	pp.pprint(related_topics)

	return related_topics

main()