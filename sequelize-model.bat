SET host=localhost
SET db=BD-Novedades
SET port=5432
SET user=postgres
SET pass=admin5

SET dialect=postgres

SET schema=public
SET table=cliente

sequelize-auto -h %host% -d %db% -u %user% -x %pass% -p %port%  --dialect %dialect% -o ./api-novedades/connection/models/db-novedades -l esm