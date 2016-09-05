Sam Thilmany | Portfolio Webpage
===================

This is the source code of my personal [portfolio website](https://thilmany.lu).
I had great fun programming it and I hope that it pleases you.

----------


Code
-------------

This website bases on the `Bootstrap` framework and mainly consists of `HTML`, `CSS` and `jQuery` code. The contact form is validated and send by a tiny `PHP` script. To reduce spam, a unique session cookie is set when the page is generated. If the `PHP` script checks the inputs of the contact form, the session cookie is compared with the one submitted by the form.

----------

I have programmed this website, as if it was a larger project. This is mainly noticeable in the partitioning of the `PHP` files. You will see that the email of the website owner – in this case my own – is outsourced. For larger projects, this `config.php`-file would contain all the private data such as the database connection, email addresses and such like.

This simplifies the maintenance of a project, since all personal data are stored in one file and thus can be updated centrally. Furthermore, it facilitates the work with a Git system like GitHub, since a tiny `.gitignore` entry prevents the upload of personal data to the repository.

Licence
-------------------

Please check the `LICENSE` file.
