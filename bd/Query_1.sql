DELIMITER //

CREATE FUNCTION obtener_email_oficina(p_codigo VARCHAR(10))
RETURNS VARCHAR(100)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_email VARCHAR(100);

    SELECT email
    INTO v_email
    FROM employees
    WHERE officeCode = p_codigo
    LIMIT 1;

    RETURN v_email;
END //

DELIMITER ;

SELECT obtener_email_oficina('OF001');




DELIMITER //

CREATE FUNCTION calcular_total_detalle(
    p_orderNumber INT,
    p_productCode VARCHAR(15)
)
RETURNS DECIMAL(15,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE v_cantidad INT;
    DECLARE v_precio DOUBLE;
    DECLARE v_total DECIMAL(15,2);
    DECLARE v_descuento DECIMAL(5,2);

    -- Obtener cantidad y precio desde la tabla
    SELECT quantityOrdered, priceEach
    INTO v_cantidad, v_precio
    FROM orderdetails
    WHERE orderNumber = p_orderNumber
      AND productCode = p_productCode
    LIMIT 1;

    -- Si no existe el registro
    IF v_cantidad IS NULL THEN
        RETURN 0;
    END IF;

    -- Calcular total base
    SET v_total = v_cantidad * v_precio;

    -- Aplicar reglas de descuento
    IF v_cantidad > 50 THEN
        SET v_descuento = 0.20;
    ELSEIF v_cantidad > 20 THEN
        SET v_descuento = 0.10;
    ELSE
        SET v_descuento = 0.00;
    END IF;

    -- Aplicar descuento
    SET v_total = v_total - (v_total * v_descuento);

    RETURN v_total;
END //

DELIMITER ;

SELECT calcular_total_detalle(10100, 'S18_1749');
