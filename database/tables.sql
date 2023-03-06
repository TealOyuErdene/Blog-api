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
