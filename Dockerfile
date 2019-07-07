# Data journalism Jupyter Dockerfile
# A docker image for doing data journalism in Project Jupyter

# Use the Jupyter scipy notebook base image
FROM jupyter/scipy-notebook

# Add the R Jupyter kernel and install some R packages
RUN conda install -c r r-irkernel r-tidyverse r-lubridate r-reshape2

# Install Python3 and R packages used in notebooks
RUN conda install -c conda-forge geopandas r-janitor
RUN conda install altair requests
RUN pip install fecfile pdfminer.six treelib agate

# Install Jupyter Notebook extensions because I like them
RUN pip install jupyter_contrib_nbextensions \
    && jupyter contrib nbextension install --user \
    && conda install -c conda-forge jupyter_nbextensions_configurator

# Add the Python 2.7 Jupyter kernel
RUN wget https://bootstrap.pypa.io/get-pip.py \
    && python2.7 get-pip.py --user \
    && python2.7 ~/.local/bin/pip2.7 install ipykernel --user \
    && python2.7 -m ipykernel install --user

# Install Python 2.7 modules
RUN ~/.local/bin/pip2.7 install pandas xlrd latimes-calculate timeout_decorator geopy geopandas matplotlib --user