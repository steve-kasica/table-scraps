FROM jupyter/scipy-notebook
RUN conda install -c r r-irkernel r-tidyverse r-lubridate r-reshape2
RUN conda install -c conda-forge geopandas r-janitor
RUN conda install altair requests
RUN pip install --use-mirrors fecfile pdfminer.six treelib agate

# Install Jupyter Notebook extensions
RUN pip install --use-mirrors jupyter_contrib_nbextensions && jupyter contrib nbextension install --user && jupyter nbextension enable freeze/main