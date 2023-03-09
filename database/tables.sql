create table category(
    id varchar(40) not null,
    name varchar(200) not null
      PRIMARY KEY (id)
);

create table article (
    id VARCHAR(40) not NULL,
    title VARCHAR(200) NOT NULL,
    content text,
    category_id VARCHAR(40),
    PRIMARY KEY (id),
    FOREIGN KEY (category_id) REFERENCES category(id)
);

select * from article left join category on article.category_id = category.id;


select
    article.id,
    article.title,
    article.content,
    article.category_id,
    category.name as category_name
from article left join category on article.category_id = category.id;

 select max(quantityOrdered) from orderdetails;
select max(amount) from payments

select * from customers left join payments on customers.customerNumber=payments.customerNumber where amount=max('select max(amount) from payments') and salesRepEmployeeNumber=max('select max(salesRepEmployeeNumber) from customers');

-- hamgiin olon
select customerNumber, count(*) from payments group by customerNumber order by count(*) desc limit 1 ;

--hamgiin undur
select sum(amount) from payments group by customerNumber order by sum(amount) desc limit 1;


select distinct customers.customerNumber, customers.customerName, customers.contactLastName, customers.contactFirstName, customers.phone, customers.addressLine1, customers.city, customers.state, customers.postalCode, customers.country, customers.creditLimit, customers.salesRepEmployeeNumber from customers left join payments on customers.customerNumber=payments.customerNumber where customers.customerNumber=(select customerNumber from payments group by customerNumber order by count(*) desc limit 1) and customers.customerNumber=(select customerNumber from payments group by customerNumber order by sum(amount) desc limit 1);


select distinct customers.* from customers left join payments on customers.customerNumber=payments.customerNumber where customers.customerNumber=(select customerNumber from payments group by customerNumber order by count(*) desc limit 1) and customers.customerNumber=(select customerNumber from payments group by customerNumber order by sum(amount) desc limit 1);



select sum(creditLimit) from customers;


select orderNumber, sum(quantityOrdered) from orderdetails group by orderNumber order by sum(quantityOrdered) desc limit 1