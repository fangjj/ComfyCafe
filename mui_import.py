#!/usr/bin/env python3

import os, sys

def go(where="lib/components/"):
    for f in os.listdir(where):
        path = os.path.join(where, f)
        if os.path.isdir(path):
            go(path)
        else:
            if f.split(".")[-1] == "jsx":
                with open(path, "r") as i:
                    content = i.read()
                if " = mui;" in content:
                    content = content.replace("let {", "import {")
                    content = content.replace("= mui;", 'from "material-ui";')
                    with open(path, "w") as o:
                        content = o.write(content)

go()
