#!/usr/bin/env python3

import os

def descend(path):
    for fp in os.listdir(path):
        full = os.path.join(path, fp)
        if os.path.isdir(full):
            descend(full)
        else:
            ext = fp.split(".")[-1]
            if ext in ["js", "jsx"]:
                with open(full, 'r') as f:
                    data = f.read()
                imports_lodash = "import _ from \"lodash\";" in data
                uses_lodash = "_." in data
                if uses_lodash and not imports_lodash:
                    print(full + " uses lodash but doesn't import it!")
                    data = "import _ from \"lodash\";\n" + data
                    with open(full, 'w') as f:
                        f.write(data)
                    print(full + " fixed.")

descend("imports")
descend("client")
descend("server")
