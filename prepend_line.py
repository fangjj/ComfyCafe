#!/usr/bin/env python3

import os, sys

def go(line, where="."):
    for f in os.listdir(where):
        path = os.path.join(where, f)
        if os.path.isdir(path):
            go(line, path)
        else:
            if f.split(".")[-1] == "jsx":
                with open(path, "r") as i:
                    content = i.read()
                content = line + "\n\n" + content
                with open(path, "w") as o:
                    content = o.write(content)

go(sys.argv[2], sys.argv[1])
