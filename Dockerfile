FROM jupyter/scipy-notebook
RUN conda install -c conda-forge geopandas 
RUN conda install altair requests
RUN pip install fecfile