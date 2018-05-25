import re
import json
import random
import pprint as pp

def main():
	reg_title = r'\*\*(.*?)\*\*'
	reg_content = r' - (.*)'
	fs_path = "microeconomics.md"
	file_related_topics = "new-content.json"

	with open(fs_path) as fs:
		contents = fs.read()

		related_topics = reform_content(contents, reg_title, reg_content)
		render_topics = render_mode(related_topics)

		pp.pprint(render_topics[2])

		with open(file_related_topics, "w") as frt:
		 	frt.write(json.dumps(render_topics))

	print("Done! NP!")


def reform_content(contents, reg_title, reg_content):
	titles = list(enumerate(re.findall(reg_title, contents)))
	contents = list(enumerate(re.findall(reg_content, contents)))
	related_topics = find_related_topics(titles, contents)

	return related_topics

def find_related_topics(titles, contents):
	related_topics = []

	for title_group in titles:
		title_index = title_group[0]
		title = title_group[1]
		this_content = contents[title_index][1]
		topics_groups = {}
		related_items = []

		for content_group in contents:
			content_index = content_group[0]
			content = str(content_group[1])

			if (re.search(title, content) != None and content_index != title_index):
				related_items.append(content_index)
			
		
		#print(related_items)
		topics_groups["title"] = title
		topics_groups["content"] = this_content
		topics_groups["related_topics"] = related_items

		related_topics.append(topics_groups)
	pp.pprint(related_topics[3])

	return related_topics

def render_mode(relations):
	maxNum = 0
	min_radius = 25
	rad_mag_const = 200
	max_saturacy = 230

	for relation in relations:
		maxNum = max(maxNum, len(relation["related_topics"]))
	
	for relation in relations:
		render = {}
		coe = len(relation["related_topics"]) / maxNum
		render["radius"] = min_radius + rad_mag_const * coe
		render["fillColor"] = "#" + str(hex(round(max_saturacy * coe)))[2:]*3
		render["speed"] = [random.random()-.5, random.random()-.5]
		relation["render"] = render
	
	return relations

main()