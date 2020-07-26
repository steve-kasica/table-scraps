"""
    lib/util.py
    ---------------------------------------------------------------------------------------
    Some functions shared between Jupyter notebooks.

"""

import codecs
from pdfannots import pdfannots
import pandas as pd
import os, glob, re, yaml
from IPython.display import display, Markdown

def getCodes():
    """Extract codes generated in the open-coding process from PDFs"""
    rep = lambda s, n: [ s for i in range(n) ]
    codec = codecs.lookup('cp1252')
    data = pd.DataFrame(columns=['org', 'analysis', 'notebook', 'index', 'cell', 'code'])
    code_re = r'\[([^\]]+)\]\s([A-za-z][^\n]+)\n?'  # ReExp for parsing my coding comments

    ptrn = os.path.join('.', 'notebooks', '**', '**', '*.html.pdf')
    for fn in glob.iglob(ptrn, recursive=False):
        org, analysis, notebook = fn.split('/')[2:]
        with open(fn, 'rb') as fobj:
            annots, outlines = pdfannots.process_file(fobj, codec, False)
        codes = []
        for annot in annots:
            if annot.contents != None:
                codes += re.findall(code_re, annot.contents)
        df = pd.DataFrame({
            'org': rep(org, len(codes)),
            'analysis': rep(analysis, len(codes)),
            'notebook': rep(notebook[:-9], len(codes)),  # slice off file extension
            'index': [ i for i in range(len(codes)) ],
            'cell': [ c[0].strip() for c in codes ],
            'code': [ c[1].strip().lower() for c in codes ]
        })
        data = data.append(df)
    return data


def getCitations():
    """Export the citations list in README.md as a data frame"""
    regxp = r'\n([^\n\.\#]+)\.\s\((\d{4}),\s(\w+)\s(\d+)\)\.\s([^\.]+\.)\s\*([^\*]+)\*\.\sRetrieved from https:\/\/(?:[^\/]+\/){2}(.*)\n'
    with open('README.md') as readme:
        content = readme.read()
    citations = re.findall(regxp,content)
    citations = pd.DataFrame(citations, columns=['journalist', 'year', 'month', 'date', 'analysis', 'organization', 'path'])
    citations.replace(to_replace=r'data/tree/master/|data-projects/tree/master/|2016/05/|st-methods/tree/master/', 
                      value='', 
                      regex=True, 
                      inplace=True)
    return citations

def displayMarkdown(msg):
    """A shortcut function for displaying text as Markdown """
    return display(Markdown(msg))

def getCodeset(fn):
    """Parse YAML file into a codeset dataframe"""
    with open(fn, 'r') as f:
        code_yaml = yaml.safe_load(f)
    
    codes = []

    def preTreeWalk(pNode, node, func, lvl=0):
        """ A recursive, pre-order traversal of the code groups YAML structure"""
        leaf = 'sub' not in node.keys()
        func(pNode, node, lvl, leaf)
        if not leaf:
            for child in node['sub']:
                preTreeWalk(node, child, func, lvl + 1)

    parseYaml = lambda parent, child, lvl, leaf: codes.append({
        'parent': parent.get('name', '').lower(),
        'name': child.get('alias', child['name']),
        'desc': child['desc'],
#        'shortcode': calcShortcode(codes[-1], child, lvl),
        'level': lvl,
        'is_leaf': leaf
    })

    for grp in code_yaml:
        preTreeWalk({'name': 'root'}, grp, parseYaml)

    codes = pd.DataFrame(codes)#[['parent', 'name', 'desc', 'level', 'is_leaf']]
    return codes
