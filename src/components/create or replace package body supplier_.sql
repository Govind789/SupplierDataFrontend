create or replace package body supplier_pkg as
   procedure sup_import_csv (
      p_data in t_varchar2_tab
   ) is

      type t_sup_id is
         table of number;
      type t_sup_name is
         table of varchar2(100);
      type t_name is
         table of varchar2(100);
      type t_phone is
         table of varchar2(15);
      type t_email is
         table of varchar2(50);
      type t_address is
         table of varchar2(200);
      type t_city is
         table of varchar2(50);
      type t_state is
         table of varchar2(30);
      type t_postal_code is
         table of number(6);
      type t_country is
         table of varchar2(50);
      type t_tax_id is
         table of varchar2(50);
      p_sup_ids      t_sup_id := t_sup_id();
      p_sup_names    t_sup_name := t_sup_name();
      p_names        t_name := t_name();
      p_phones       t_phone := t_phone();
      p_emails       t_email := t_email();
      p_addresses    t_address := t_address();
      p_cities       t_city := t_city();
      p_states       t_state := t_state();
      p_postal_codes t_postal_code := t_postal_code();
      p_countries    t_country := t_country();
      p_tax_ids      t_tax_id := t_tax_id();
      l_line         varchar2(4000);
      l_error_msg    clob := null;
   begin
      for i in 1..p_data.count loop
         l_line := p_data(i);
         declare
            l_row_error   varchar2(1000) := null;
            l_sup_id      number;
            l_sup_name    varchar2(100);
            l_name        varchar2(100);
            l_phone       varchar2(15);
            l_email       varchar2(50);
            l_address     varchar2(200);
            l_city        varchar2(30);
            l_state       varchar2(50);
            l_postal_code varchar2(20);
            l_country     varchar2(30);
            l_tax_id      varchar2(20);
         begin
            l_sup_id := to_number ( regexp_substr(
               l_line,
               '[^,]+',
               1,
               1
            ) );
            l_sup_name := regexp_substr(
               l_line,
               '[^,]+',
               1,
               2
            );
            l_name := regexp_substr(
               l_line,
               '[^,]+',
               1,
               3
            );
            l_phone := regexp_substr(
               l_line,
               '[^,]+',
               1,
               4
            );
            l_email := regexp_substr(
               l_line,
               '[^,]+',
               1,
               5
            );
            l_address := regexp_substr(
               l_line,
               '[^,]+',
               1,
               6
            );
            l_city := regexp_substr(
               l_line,
               '[^,]+',
               1,
               7
            );
            l_state := regexp_substr(
               l_line,
               '[^,]+',
               1,
               8
            );
            l_postal_code := regexp_substr(
               l_line,
               '[^,]+',
               1,
               9
            );
            l_country := regexp_substr(
               l_line,
               '[^,]+',
               1,
               10
            );
            l_tax_id := regexp_substr(
               l_line,
               '[^,]+',
               1,
               11
            );

            if l_sup_id is null then
               l_row_error := l_row_error || 'ID is required; ';
            end if;
            if l_sup_name is null then
               l_row_error := l_row_error || 'Supplier name is required; ';
            end if;

            if
               l_city is not null and 
               l_state is not null and 
               l_postal_code is not null
            then
                -- safe existence check: case-insensitive + trimmed + handle numeric pincode
                declare
                    l_cnt number;
                    l_pincode_v varchar2(50) := trim(to_char(l_postal_code)); -- use to_char to handle number/varchar
                begin
                select count(*)
                    into l_cnt
                    from pincode_master pm
                    join city_master cm
                    on pm.city_id = cm.city_id
                    and pm.state_id = cm.state_id
                    join state_master sm
                    on pm.state_id = sm.state_id
                    where upper(trim(cm.city_name)) = upper(trim(l_city))
                    and upper(trim(sm.state_name)) = upper(trim(l_state))
                    and trim(to_char(pm.pincode)) = trim(l_pincode_v);  -- <-- ensure pm.pincode exists / correct name

                    if l_cnt = 0 then
                        l_row_error := l_row_error || 'City does not exist; ';
                    end if;
                end;
            end if;


            -- if l_state is not null then
            --    declare
            --       l_cnt number;
            --    begin
            --       select count(*)
            --         into l_cnt
            --         from lookupvalue l2
            --        where l2.lookup_id = (
            --             select lookup_id
            --               from lookupcategory
            --              where lookup_value = 'State'
            --          )
            --          and l2.nomenclature = l_state;
            --       if l_cnt = 0 then
            --          l_row_error := l_row_error || 'State does not exist; ';
            --       end if;
            --    end;
            -- end if;


            -- if l_postal_code is not null then
            --    declare
            --       l_cnt number;
            --    begin
            --       select count(*)
            --         into l_cnt
            --         from lookupvalue l2
            --        where l2.lookup_id = (
            --             select lookup_id
            --               from lookupcategory
            --              where lookup_value = 'Postal Code'
            --          )
            --          and l2.nomenclature = l_postal_code;
            --       if l_cnt = 0 then
            --          l_row_error := l_row_error || 'Postal Code does not exist; ';
            --       end if;
            --    end;
            -- end if;


            if l_phone is null then
               l_row_error := l_row_error || 'Phone is required; ';
            elsif not regexp_like(
               l_phone,
               '^[1-9][0-9]{9,14}$'
            ) then
               l_row_error := l_row_error || 'Phone is invalid; ';
            end if;

            if l_email is null then
               l_row_error := l_row_error || 'Email is required; ';
            elsif not regexp_like(
               l_email,
               '^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
            ) then
               l_row_error := l_row_error || 'Email is invalid; ';
            end if;


            if l_row_error is not null then
               l_error_msg := l_error_msg
                              || 'Row '
                              || i
                              || ': '
                              || l_row_error
                              || chr(10);
            else
               p_sup_ids.extend;
               p_sup_ids(p_sup_ids.count) := l_sup_id;
               p_sup_names.extend;
               p_sup_names(p_sup_names.count) := l_sup_name;
               p_names.extend;
               p_names(p_names.count) := l_name;
               p_phones.extend;
               p_phones(p_phones.count) := l_phone;
               p_emails.extend;
               p_emails(p_emails.count) := l_email;
               p_addresses.extend;
               p_addresses(p_addresses.count) := l_address;
               p_cities.extend;
               p_cities(p_cities.count) := l_city;
               p_states.extend;
               p_states(p_states.count) := l_state;
               p_postal_codes.extend;
               p_postal_codes(p_postal_codes.count) := to_number ( l_postal_code );
               p_countries.extend;
               p_countries(p_countries.count) := l_country;
               p_tax_ids.extend;
               p_tax_ids(p_tax_ids.count) := l_tax_id;
            end if;

         end; -- row processing
      end loop;

      forall j in p_sup_ids.first..p_sup_ids.last
         insert into suppliers_masters (
            sup_id,
            sup_name,
            contact_name,
            contact_phone,
            contact_email,
            address,
            city,
            state,
            postal_code,
            country,
            tax_id
         ) values ( p_sup_ids(j),
                    p_sup_names(j),
                    p_names(j),
                    p_phones(j),
                    p_emails(j),
                    p_addresses(j),
                    p_cities(j),
                    p_states(j),
                    p_postal_codes(j),
                    p_countries(j),
                    p_tax_ids(j) );

      -- After all rows, if any errors, raise once
      if l_error_msg is not null then
         raise_application_error(
            -20000,
            'Errors found:'
            || chr(10)
            || l_error_msg
         );
      end if;
   end sup_import_csv;


   procedure sup_import (
      p_sup_id      in number,
      p_sup_name    in varchar2,
      p_name        in varchar2,
      p_phone       in varchar2,
      p_email       in varchar2,
      p_address     in varchar2,
      p_city        in varchar2,
      p_state       in varchar2,
      p_postal_code in number,
      p_country     in varchar2,
      p_tax_id      in varchar2
   ) is
      l_error_msg clob := null;
      l_row_error varchar2(1000) := null;
   begin
        if p_sup_id is null then
            l_row_error := l_row_error || 'ID is required; ';
        end if;
        if p_sup_name is null then
            l_row_error := l_row_error || 'Supplier name is required; ';
        end if;
      
        if
            p_city is not null and
            p_state is not null and
            p_postal_code is not null
        then
            declare
                    l_cnt number;
                    l_pincode_v varchar2(50) := trim(to_char(p_postal_code)); -- use to_char to handle number/varchar
            begin
                select count(*)
                    into l_cnt
                    from pincode_master pm
                    join city_master cm
                    on pm.city_id = cm.city_id
                    and pm.state_id = cm.state_id
                    join state_master sm
                    on pm.state_id = sm.state_id
                    where upper(trim(cm.city_name)) = upper(trim(p_city))
                    and upper(trim(sm.state_name)) = upper(trim(p_state))
                    and trim(to_char(pm.pincode)) = trim(l_pincode_v);  -- <-- ensure pm.pincode exists / correct name

                    if l_cnt = 0 then
                        l_row_error := l_row_error || 'City does not exist; ';
                    end if;
            end;
        end if;


        if p_phone is null then
            l_row_error := l_row_error || 'Phone is required; ';
        elsif not regexp_like(
            p_phone,
            '^[1-9][0-9]{9,14}$'
        ) then
            l_row_error := l_row_error || 'Phone is invalid; ';
        end if;

        if p_email is null then
            l_row_error := l_row_error || 'Email is required; ';
        elsif not regexp_like(
            p_email,
            '^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
        ) then
            l_row_error := l_row_error || 'Email is invalid; ';
        end if;


        if l_row_error is not null then
            l_error_msg := l_error_msg
                            || ': '
                            || l_row_error
                            || chr(10);
        else
            insert into suppliers_masters (
                sup_id,
                sup_name,
                contact_name,
                contact_phone,
                contact_email,
                address,
                city,
                state,
                postal_code,
                country,
                tax_id
            ) values ( p_sup_id,
                        p_sup_name,
                        p_name,
                        p_phone,
                        p_email,
                        p_address,
                        p_city,
                        p_state,
                        p_postal_code,
                        p_country,
                        p_tax_id );
        end if;
        if l_error_msg is not null then
            raise_application_error(
                -20000,
                'Errors found:'
                || chr(10)
                || l_error_msg
            );
        end if;
   exception
        when value_error then
            raise_application_error(
                -20018,
                'Invalid datatype or value passed'
            );
        when dup_val_on_index then
            raise_application_error(
                -20019,
                'Duplicate value found (Email or Phone may already exist)'
            );
        when others then
            raise_application_error(
                -20020,
                'Unexpected error: ' || sqlerrm
            );
   end sup_import;


    procedure sup_export (
        p_result out sys_refcursor
    ) is
    begin
        open p_result for 
        select * from suppliers_masters where 1 = 1;
    end sup_export;

end supplier_pkg;



/

select count(*)
from pincode_master pm
join city_master cm
on pm.city_id = cm.city_id
and pm.state_id = cm.state_id
join state_master sm
on pm.state_id = sm.state_id
where upper(trim(cm.city_name)) = upper(trim('Mumbai'))
and upper(trim(sm.state_name)) = upper(trim('Maharashtra'))
and upper(trim(to_char(pm.pincode))) = upper('400001');

/



