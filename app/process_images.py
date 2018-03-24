# -*- coding: utf-8 -*-
import os
import glob
import json
from PIL import Image

base_path = './app/images/projects'
extensions = ['.png', '.gif', '.jpg', '.jpeg']

def is_image(file_path):
    return any(map(lambda end: file_path.lower().endswith(end), extensions))

def safeget(dct, *keys):
    for key in keys:
        try:
            dct = dct[key]
        except KeyError:
            return None
    return dct

min_height = 200
min_width = 200
errors = []

metadata = {
    'test_project': {
        'role': ['mind reader', 'hot chocolate drinker'],
        'description': 'Wow this project is so cool'
    }
    # "role": ["mind reader","hot chocolate drinker"],
    # "description": "another project _wow",
}

projects = []

project_paths = os.walk(base_path).next()[1]
for project_path in project_paths:
    project = {
        'name': project_path,
        'role': safeget(metadata, project_path, 'role') or [],
        'description': safeget(metadata, project_path, 'description') or '',
        'pieces': []
    }

    for file_name in os.walk(base_path + '/' + project_path).next()[2]:
        if is_image(file_name):
            img = Image.open(base_path + '/' + project_path + '/' + file_name)
            width, height = img.size
            if height < min_height or width < min_width:
                errors.append(file_name)
            project['pieces'].append({
                'name': file_name,
                'height': height,
                'width': width
            })

    projects.append(project)

data = json.dumps(projects, indent=2, sort_keys=True)
print(data)
with open('./app/scripts/projects.js', 'w') as f:
    js_file = """
    // -------------------- GENERATED --------------------
    // DO NOT EDIT ME, GO TO process_images.py!

    var projects = %s;

    module.exports = projects;
    """ % data

    f.write(js_file)

if errors:
    print('it too smol ¯\_(ツ)_/¯ ' * 100)
    print(errors)
