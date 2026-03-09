-- 1. Mostrar el nombre de los alumnos sin teléfono.
    select p.nombre, p.apellido1, p.apellido2 from persona p where p.tipo = 'alumno';
-- 2. Nombre completo y fecha de nacimiento de alumnos nacidos en 1992.
    select p.nombre, p.apellido1, p.apellido2 from persona p where p.tipo = 'alumno' and year(p.fecha_nacimiento) = '1992';
-- 3. Profesores sin teléfono y nif terminado en L.
    select p.nombre, p.apellido1, p.apellido2, p.nif from persona p where p.tipo = 'profesor' and p.nif like '%L';
-- 4. Nombre de las asignaturas del 2do cuatrimestre, 1er curso, grado 7
    select a.nombre from asignatura a where a.cuatrimestre='2' and a.curso='1' and a.id_grado='7';
-- 5. Nombre completo de las alumnas matriculadas en Ingeniería Informática (Plan 2015).
    select p.nombre, p.apellido1, p.apellido2 from persona p
        left join alumno_se_matricula_asignatura a on p.id = a.id_alumno
        left join asignatura asi on a.id_asignatura = asi.id
        where asi.id_grado='4' and p.sexo='M' group by p.nombre, p.apellido1, p.apellido2;
-- 6.  Nombre completo de los profesores y su departamento.
    select p.nombre, p.apellido1, p.apellido2, d.nombre from  persona p
        inner join profesor pr on p.id = pr.id_profesor
        inner join departamento d on pr.id_departamento = d.id;
-- 7. ¿Cuales son las asignaturas y el curso escolar del alumno con nif "89542419S".
    select a.nombre from asignatura a inner join alumno_se_matricula_asignatura al on a.id = al.id_asignatura
    inner join persona p on al.id_alumno = p.id where p.nif = '89542419S';

-- 8. Nombre del profesor que imparte mas asignaturas.  x
    select p.nombre, count(a.id_profesor) AS materias from persona p inner join profesor pr on p.id = pr.id_profesor
    inner join asignatura a on pr.id_profesor = a.id_profesor
    group by p.nombre order by materias desc limit 1 ;

-- 9. Nombre de los profesores que no imparten asignaturas.
    select p.nombre from persona p
        left join profesor pr on p.id = pr.id_profesor
        left join asignatura a on a.id_profesor= pr.id_profesor
        where a.id_profesor is null;

-- 10. ¿Cuáles son los departamentos con asignaturas nunca impartidas.
    select d.nombre from departamento d left join profesor p on d.id = p.id_departamento
    left join asignatura a on a.id_profesor = p.id_profesor
    where a.id_profesor is null group by d.nombre;

-- 11. ¿Cuál es el total de alumnas?
    select count(p.nombre) from persona p where p.sexo='M' and p.tipo='alumno';

-- 12. Nombre de los alumnos que han repetido al menos una asignatura.
    SELECT DISTINCT p.nombre, p.apellido1, p.apellido2
    FROM persona p
    JOIN alumno_se_matricula_asignatura ama ON p.id = ama.id_alumno
    GROUP BY ama.id_alumno, ama.id_asignatura
    HAVING COUNT(ama.id_curso_escolar) > 1;
-- 13. Mostrar todos los departamentos con número de profesores.
    select d.nombre, count(p.id_profesor) from departamento d
        left join profesor p on d.id = p.id_departamento
        group by d.id,d.nombre;
-- 14. ¿Cuáles son los grados con más de 40 asignaturas?
    select g.nombre, count(g.nombre) AS materias from grado g left join asignatura a on g.id = a.id_grado
     group by g.nombre having materias>40;
-- 15. Mostrar el número de asignaturas impartidas por profesor.
    select p.nombre, count(a.id_profesor) AS materias from persona p inner join profesor pr on p.id = pr.id_profesor
    inner join asignatura a on pr.id_profesor = a.id_profesor
    group by p.nombre ;
-- 16. ¿Quién es el alumno más joven?
    select p.nombre, p.fecha_nacimiento from persona p where p.tipo='alumno' order by p.fecha_nacimiento desc limit 1;
-- 17. Alumnos que no se han matriculado en ninguna asignatura.
    select p.nombre from persona p left join alumno_se_matricula_asignatura al on p.id = al.id_alumno
    where p.tipo='alumno' and al.id_alumno is null ;
-- 18. ¿Cuál es el departamento que tiene el mayor número de profesores?
    select d.nombre, count(p.id_profesor) AS profesores from departamento d
        left join profesor p on d.id = p.id_departamento
        group by d.nombre order by profesores desc limit 1;
-- 19. Nombres de los profesores que imparten solo asignaturas de un mismo grado.
    select p.nombre from persona p  inner join profesor pr on p.id = pr.id_profesor
    inner join asignatura a on pr.id_profesor = a.id_profesor
    group by p.nombre having count(distinct a.id_grado)=1;

-- 20. Departamentos que tienen más profesores que el promedio.
    select d.nombre AS AL from departamento d
    inner join profesor p on d.id = p.id_departamento
    group by d.nombre having count(p.id_profesor) > (select avg(conteo) FROM (SELECT COUNT(id_profesor) AS conteo FROM profesor GROUP BY id_departamento) AS subconsulta )





--   Nivel Intermedio (Uso de HAVING y DISTINCT)
-- 1 Mostrar el nombre de los alumnos que están matriculados en asignaturas de un solo grado distinto.
    select p.nombre from persona p  inner join alumno_se_matricula_asignatura al on p.id = al.id_alumno
    inner join asignatura a on al.id_asignatura = a.id
    group by p.id, p.nombre having  count(distinct  a.id_grado)=1;
-- 2 Listar los nombres de los profesores que imparten asignaturas en más de dos grados diferentes.

-- Mostrar el nombre de los grados que tienen más de 10 asignaturas registradas.

--  Mostrar los nombres de los alumnos que se han matriculado en la misma asignatura en más de 2 cursos escolares distintos (repetidores constantes).

--  Listar los departamentos que tienen exactamente 1 profesor asignado.

-- Nivel Avanzado (Subconsultas y Promedios)
--  Mostrar los nombres de las asignaturas que tienen un número de créditos mayor al promedio de créditos de todas las asignaturas.

-- Grados populares: Listar los nombres de los grados que tienen un número de alumnos matriculados superior al promedio de alumnos por grado.

-- Departamentos grandes: Mostrar el nombre de los departamentos que tienen un número de profesores mayor que el promedio de profesores por departamento (similar al que tenías, pero asegúrate de que el promedio considere incluso departamentos con 0 profesores).

-- Alumnos destacados: Mostrar el nombre de los alumnos que están matriculados en más asignaturas que el promedio de asignaturas por alumno en el curso escolar actual.

-- Profesores con pocos alumnos: Listar los nombres de los profesores que imparten clases a un número total de alumnos menor al promedio de alumnos por profesor en toda la universidad.