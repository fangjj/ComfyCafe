#!/usr/bin/env python3

import os, sys

views = ""
for f in os.listdir("lib/views/"):
    name = f.replace(".jsx", "")
    views += 'import ' + name + ' from "./views/' + f + '";' + '\n'

path = "lib/routes.js"
with open(path, "r") as i:
    content = i.read()
content = views + "\n" + content
with open(path, "w") as o:
    content = o.write(content)
