FROM jupyter/scipy-notebook
RUN conda install -c r r-irkernel r-tidyverse r-lubridate r-reshape2
RUN conda install -c conda-forge geopandas r-janitor
RUN conda install altair requests
RUN pip install fecfile pdfminer.six treelib agate