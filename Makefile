
supplemental : clean repo-list other-sup taxonomies 

taxonomies :
	jupyter nbconvert --to html --TemplateExporter.exclude_input=True "Unabridged Taxonomies.ipynb"
	mv "Unabridged Taxonomies.html" "Supplemental Materials/Unabridged Taxonomies.html"
	wkhtmltopdf "Supplemental Materials/Unabridged Taxonomies.html" "Supplemental Materials/Unabridged Taxonomies.pdf"

other-sup : 
	jupyter nbconvert --to pdf --TemplateExporter.exclude_input=True "Table Scraps Supplemental Materials 2.ipynb"
	mv "Table Scraps Supplemental Materials 2.pdf" "Supplemental Materials/Table Scraps Supplemental Materials 2.pdf"

repo-list : 
	jupyter nbconvert --to html --TemplateExporter.exclude_input=True "Repo List.ipynb"
	mv "Repo List.html" "Supplemental Materials/Repo List.html"
	wkhtmltopdf "Supplemental Materials/Repo List.html" "Supplemental Materials/Repo List.pdf"	

clean : 
	rm -f Supplemental\ Materials/Repo List.pdf Supplemental\ Materials/Table\ Scraps\ Supplemental\ Materials\ 2.pdf Supplemental\ Materials/*.html