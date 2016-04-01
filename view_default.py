import os

def proc(i, line):
    if i == 4 or i == 5:
        return line.replace(";", ".default;")
    return line

where = "imports/ui/views/"
for f in os.listdir(where):
    path = os.path.join(where, f)
    with open(path) as r:
        content = [proc(i, line) for (i, line) in enumerate(r.readlines())]
    with open(path, "w") as w:
        w.write("".join(content))
