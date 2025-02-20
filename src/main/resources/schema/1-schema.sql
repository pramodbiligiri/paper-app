create table req_trigger_type (
    id serial NOT NULL UNIQUE PRIMARY KEY,
    name varchar (15)
);

insert into req_trigger_type(name) VALUES('test');
insert into req_trigger_type(name) VALUES('email');
insert into req_trigger_type(name) VALUES('user_action');

create table req_info (
    id bigserial NOT NULL UNIQUE PRIMARY KEY,
    req_type int,
    req_json jsonb,
    FOREIGN KEY (req_type) REFERENCES req_trigger_type (id)
);

create table req_audio (
    id bigserial NOT NULL UNIQUE PRIMARY KEY,
    req_id bigint,
    audio bytea,
    FOREIGN KEY (req_id) REFERENCES req_info (id)
)