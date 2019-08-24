"""
    lib/util.py
    ---------------------------------------------------------------------------------------
    Some functions shared between Jupyter notebooks

"""

import codecs
from pdfannots import pdfannots
import pandas as pd
import os, glob, re
from IPython.display import display, Markdown

def getCodes():
    """Extract codes generated in the open-coding process from PDFs"""
    rep = lambda s, n: [ s for i in range(n) ]
    codec = codecs.lookup('cp1252')
    data = pd.DataFrame(columns=['org', 'article', 'analysis', 'index', 'cell', 'code'])
    code_re = r'\[([^\]]+)\]\s([A-za-z][^\n]+)\n?'  # ReExp for parsing my coding comments

    ptrn = os.path.join('.', 'notebooks', '**', '**', '*.html.pdf')
    for fn in glob.iglob(ptrn, recursive=False):
        org, article, analysis = fn.split('/')[2:]
        with open(fn, 'rb') as fobj:
            annots, outlines = pdfannots.process_file(fobj, codec, False)
        codes = []
        for annot in annots:
            if annot.contents != None:
                codes += re.findall(code_re, annot.contents)
        df = pd.DataFrame({
            'org': rep(org, len(codes)),
            'article': rep(article, len(codes)),
            'analysis': rep(analysis[:-9], len(codes)),  # slice off file extension
            'index': [ i for i in range(len(codes)) ],
            'cell': [ c[0].strip() for c in codes ],
            'code': [ c[1].strip().lower() for c in codes ]
        })
        data = data.append(df)
    return data


def displayMarkdown(msg):
    """A shortcut function for displaying text as Markdown """
    return display(Markdown(msg))