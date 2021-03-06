# -*- coding: utf-8 -*-
import os
from shutil import copyfile
import json
from PIL import Image

# ---------- 1. Manage projects here. Generate projects.js ----------
projects = [
  {
    "name": "firebase_branding",
    "role": ["logo design", "brand identity"],
    "description": "Evolved the Firebase brand to represent a complete app platform and fit within the Google product family.",
    "rows": [
      ["logo-3x1.png","vertical_logo-3x4.png","logomark-1x1.png","knockout_logomark-1x1.png"],
      ["logo_colors-4x1.png","brand_colors-4x1.png"],
      ["final_explorations-4x1.png"],
      ["shape_explorations-3x1.png", "color_explorations-3x2.png"],
      ["concept_explorations-4x1.png"]
    ]
  },
  {
    "name": "avatars",
    "role": ["illustration"],
    "description": "Illustrated avatars for the Firebase UX team, as well as contributing avatars to the winners of the UX Gold Star Award for advocacy appreciation.",
    "rows": [
      ["Pedro-1x1.png", "Annie-1x1.png", "Tiffany-1x1.png", "Keum_Eun-1x1.png"],
      ["Allie-1x1.png", "Mei-1x1.png", "Tony-1x1.png", "Erik-1x1.png"],
      ["Maria-1x1.png", "Martini-1x1.png", "Jess-1x1.png", "Kevin-1x1.png", "Aaron-1x1.png", "Luyuan-1x1.png", "Osa-1x1.png"],
      ["Ben-1x1.png", "Maple-1x1.png", "Debbie-1x1.png", "Adrien-1x1.png"],
      ["Lori-1x1.png", "Sonakshi-1x1.png", "Roman-1x1.png", "Diego-1x1.png", "Amber-1x1.png", "Ryan-1x1.png"],
      ["Dave-1x1.png", "Ces-1x1.png", "Joel-1x1.png", "Jessica-1x1.png", "Greg-1x1.png", "Zewen-1x1.png", "Tim-1x1.png"],
      ["Ali-1x1.png", "Przemek-1x1.png", "Paul-1x1.png"],
      ["Bruce-1x1.png", "Richie-1x1.png", "Steve-1x1.png", "Catherine-1x1.png", "Rick-1x1.png"],
      ["Mikki-1x1.png", "Josh-1x1.png", "Quinlan-1x1.png", "Brian-1x1.png", "Kat-1x1.png"],
      ["Joey-1x1.png", "Claire-1x1.png", "Malea-1x1.png"],
    ]
  },
  {
    "name": "firebase_illustrations",
    "role": ["illustration", "brand identity"],
    "description": "Defined the visual style and created illustrations for the Firebase developer console and marketing content.",
    "rows": [
      ["AMob-1x1.png", "Analytics-1x1.png", "Database-1x1.png", "Firestore_indexing-1x1.png", "Datbase_backups-1x1.png"],
      ["Crashlytics-1x1.png", "Crash-1x1.png", "Crash_pending-1x1.png"],
      ["AWords-1x1.png", "Test_Lab-1x1.png", "Storage-1x1.png"],
      ["Notifications-1x1.png", "Cloud_Messaging-1x1.png", "Experiments_Notifications-1x1.png", "Hosting-1x1.png", "Performance-1x1.png"],
      ["Experiments_Config-1x1.png", "Config-1x1.png", "Predictions-1x1.png", "Auth-1x1.png", "App_Indexing-1x1.png", "Dynamic_Links-1x1.png"],
      ["Functions-1x1.png", "highfive-1x1.png", "relax-1x1.gif"],
      ["grow-1x1.png"]
    ]
  },
  {
    "name": "firebase_console",
    "role": ["visual & interaction design", "design patterns"],
    "description": "UX Lead for Firebase Develop features and cross-console design patterns. Primary designer for Realtime Database, Cloud Firestore and Storage.",
    "rows": [
      ["overview_illustrations-2x3.png", "firestore-4x3.png", "adding_data-4x3.png"],
      ["realtime_database-4x3.png", "rules_simulator-4x3.png", "feature_usage-4x3.png"],
      ["multi_bucket-4x3.png", "bucket_creation-4x3.png"],
      ["console_color-4x1.png"],
      ["messaging-1x1.png", "form_inputs-4x3.png"],
      ["usage_scorecards-3x2.png", "dialogs-4x3.png"]
    ]
  },
  {
    "name": "diary_comics",
    "role": ["illustration"],
    "description": "Drawings of everyday things.",
    "rows": [
      ["lands_end-2x3.jpg", "tiny_apartment-2x3.jpg"],
      ["baker_beach-3x2.jpg", "dog_sitting-2x3.jpg"],
      ["family-1x1.jpg", "angry-1x1.gif", "young_artist-3x2.png"]
    ]
  },
  {
    "name": "'i_love_you'_book",
    "role": ["illustrator", "author"],
    "description": "Book written and printed for my husband on Valentine's day.",
    "rows": [
      ["title-2x3.jpg", "morning-2x3.jpg", "night-2x3.jpg"],
      ["fight-2x3.jpg", "snuggle-2x3.jpg"],
      ["hug-2x3.jpg", "pug-2x3.jpg", "naked-2x3.jpg", "clothed-2x3.jpg", "old-2x3.jpg"],
      ["with-2x3.jpg", "not-2x3.jpg", "love-2x3.jpg", "yours-2x3.jpg", "mine-2x3.jpg", "valentine-2x3.jpg"]
    ]
  },
  {
    "name": "anatomy_&_human_figure",
    "role": ["illustration", "3D modeling", "sculpture", "drawing"],
    "description": "Variety of work in different mediums focusing on anatomy and the human form.",
    "rows": [
      ["skeletal-1x1.png", "circulatory-1x1.png"],
      ["master_anatomy_1-2x3.gif", "master_anatomy_2-2x3.gif", "cerebral_model-2x3.jpg", "fullbody_model-1x1.jpg"],
      ["female_sitting_in_chair-3x4.jpg", "female_sitting-3x4.jpg", "female_sitting_with_staff-3x4.jpg", "male_standing-3x4.jpg"],
      ["female_head-1x1.jpg", "male_head-1x1.jpg"]
    ]
  },
  {
    "name": "shoes",
    "role": ["painting"],
    "description": "Hand painted customized shoes.",
    "rows": [
      ["pie-4x3.jpg", "true_gryffindor-4x3.jpg"],
      ["the_hobbit-4x3.jpg", "rainbow_dinos-4x3.jpg"],
      ["doctor_who-3x2.jpg", "walking_on_clouds-1x1.jpg"]
    ]
  },
  {
    "name": "3d",
    "role": ["modeling", "texturing", "lighting"],
    "description": "Digital models, textures and lighting for animation using Maya, ZBrush and Mudbox.",
    "rows": [
      ["girl-1x1.png", "boots-1x1.png", "giraffe-2x3.png"],
      ["bedroom_window-3x2.png", "bedroom_door-3x2.png"]
    ]
  },
  {
    "name": "misc",
    "role": ["illustration", "character design", "logo design"],
    "description": "An assortment of small projects and doodles.",
    "rows": [
      ["corgi_chaos-4x1.gif"],
      ["pizza_fire_monster-1x1.png", "pie_fire_monster-1x1.png", "confused_fire_monster-1x1.png", "turkey_hacker-3x2.png"],
      ["angular_logo-1x1.png", "ngconf-1x1.png", "solid_city-3x1.png", "outline_city-3x1.png"],
      ["light_game_controller-1x1.png", "dark_game_controller-1x1.png", "casette-1x1.png", "gameboy-1x1.png", "gameboy_advance-1x1.png"],
      ["cat-1x1.jpg", "weekend_mode-1x1.jpg", "sunday_husband-1x1.jpg", "pita-1x1.jpg"],
      ["documentation-3x2.png", "code_snippets-3x2.png", "support-3x2.png"],
      ["love_potion-1x1.jpg", "nate_&_laura-1x1.jpg", "sarah_&_james-1x1.jpg", "party_corgi-3x1.png", "summertime_skepticism-1x1.jpg"],
      ["happy_cloud-1x1.png", "sick_cloud-1x1.png", "polar_paper-3x2.png"],
      ["developer_tools-3x1.png", "computer_lines-3x2.png", "developer_experts-4x1.png"],
      ["launch-4x3.png", "green_shadow_icons-3x1.png", "stations-3x2.png"]
    ]
  }
]

data = json.dumps(projects, indent=2, sort_keys=True)
with open('./app/scripts/projects.js', 'w') as f:
    js_file = """
    // -------------------- GENERATED --------------------
    // DO NOT EDIT ME, GO TO thumbnails.py!
    var projects = %s;
    module.exports = projects;
    """ % data
    f.write(js_file)

# -------------------- 2. Make thumbnails --------------------

base_path = './app/images/'
base_out_path = './app/images/generated/'

def ratio(img_name):
    x, y = img_name.split('-')[1].split('.')[0].split('x')
    return float(x) / float(y)

def ratio_to_thumbnail_size(ratios):
    rowWidth = 784.0
    padding = 16.0
    n = len(ratios)
    totalWidth = rowWidth - (padding*(n - 1))
    totalRatio = sum(ratios)
    rowHeight = totalWidth / totalRatio

    return [(int(2 * ratio * rowHeight), int(2 * rowHeight)) for ratio in ratios]

for project in projects:
    project_name = project['name']
    rows = project['rows']
    print(project_name)

    # Portfolio cover thumbnails
    # img = Image.open(base_path + project_name + '.png')
    # img.thumbnail((img.size[0] * 0.2, img.size[1] * 0.2), Image.ANTIALIAS)
    # out_path = base_out_path + 'thumbnails/' + project_name + '.png'
    # if not os.path.exists(os.path.dirname(out_path)):
    #     os.makedirs(os.path.dirname(out_path))
    # img.save(out_path)

    for row in rows:
        print(row)
        new_sizes = ratio_to_thumbnail_size(map(ratio, row))

        for img_name, new_size in zip(row, new_sizes):
            # Normal thumbnail
            in_path = base_path + 'projects/' + project_name + '/' + img_name
            out_path = base_out_path + 'thumbnails/' + project_name + '/' + img_name
            if not os.path.exists(os.path.dirname(out_path)):
                os.makedirs(os.path.dirname(out_path))
            if img_name.endswith('.gif'):
                copyfile(in_path, out_path)
            else:
                img = Image.open(in_path)
                img.thumbnail(new_size, Image.ANTIALIAS)
                img.save(out_path)

            # Tiny thumbnail
            img = Image.open(base_path + 'projects/' + project_name + '/' + img_name)
            tiny_size = (new_size[0] * 0.2, new_size[1] * 0.1);
            img.thumbnail(tiny_size, Image.ANTIALIAS)
            out_path = base_out_path + 'tiny/' + project_name + '/' + img_name
            if not os.path.exists(os.path.dirname(out_path)):
                os.makedirs(os.path.dirname(out_path))
            img.save(out_path)
