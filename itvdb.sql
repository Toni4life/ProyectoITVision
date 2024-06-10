PGDMP              
        |           itvdb    16.2    16.2 4               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    17270    itvdb    DATABASE     x   CREATE DATABASE itvdb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Spain.1252';
    DROP DATABASE itvdb;
                postgres    false                        3079    17271    pgcrypto 	   EXTENSION     <   CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
    DROP EXTENSION pgcrypto;
                   false                       0    0    EXTENSION pgcrypto    COMMENT     <   COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';
                        false    2                       1255    17308    actualizar_cantidad_coches()    FUNCTION     9  CREATE FUNCTION public.actualizar_cantidad_coches() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE clientes
    SET cantidad_coches = (
        SELECT COUNT(*)
        FROM vehiculos
        WHERE clienteid = NEW.clienteid
    )
    WHERE clienteid = NEW.clienteid;
    
    RETURN NEW;
END;
$$;
 3   DROP FUNCTION public.actualizar_cantidad_coches();
       public          postgres    false                       1255    17309 #   actualizar_cantidad_coches_delete()    FUNCTION     @  CREATE FUNCTION public.actualizar_cantidad_coches_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE clientes
    SET cantidad_coches = (
        SELECT COUNT(*)
        FROM vehiculos
        WHERE clienteid = OLD.clienteid
    )
    WHERE clienteid = OLD.clienteid;
    
    RETURN OLD;
END;
$$;
 :   DROP FUNCTION public.actualizar_cantidad_coches_delete();
       public          postgres    false            �            1259    17310    cliente_idd_seq    SEQUENCE     x   CREATE SEQUENCE public.cliente_idd_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.cliente_idd_seq;
       public          postgres    false            �            1259    17311    clientes    TABLE     �  CREATE TABLE public.clientes (
    clienteid bigint DEFAULT nextval('public.cliente_idd_seq'::regclass) NOT NULL,
    nombre character varying NOT NULL,
    apellidos character varying NOT NULL,
    fecha_nacimiento date NOT NULL,
    numero_telefono integer NOT NULL,
    dni character varying(9) NOT NULL,
    cantidad_coches integer DEFAULT 0,
    direccion character varying(255) NOT NULL,
    correo_electronico character varying(255) NOT NULL
);
    DROP TABLE public.clientes;
       public         heap    postgres    false    216            �            1259    17318 
   cuartafase    TABLE     �   CREATE TABLE public.cuartafase (
    numerobastidor character varying(255) NOT NULL,
    subgrupos jsonb NOT NULL,
    vehiculoid integer
);
    DROP TABLE public.cuartafase;
       public         heap    postgres    false            �            1259    17323    login    TABLE     �   CREATE TABLE public.login (
    id bigint NOT NULL,
    usuario character varying NOT NULL,
    "contraseña" character varying NOT NULL,
    rol character varying DEFAULT 'usuario'::character varying NOT NULL,
    clienteid integer NOT NULL
);
    DROP TABLE public.login;
       public         heap    postgres    false            �            1259    17329    login_id_seq    SEQUENCE     u   CREATE SEQUENCE public.login_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.login_id_seq;
       public          postgres    false    219                        0    0    login_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.login_id_seq OWNED BY public.login.id;
          public          postgres    false    220            �            1259    17330    primerafase    TABLE     �   CREATE TABLE public.primerafase (
    numerobastidor character varying(17) NOT NULL,
    km integer NOT NULL,
    fecha date NOT NULL,
    subgrupos jsonb NOT NULL,
    vehiculoid integer NOT NULL
);
    DROP TABLE public.primerafase;
       public         heap    postgres    false            �            1259    17335    segundafase    TABLE     �   CREATE TABLE public.segundafase (
    numerobastidor character varying(255) NOT NULL,
    combustible character varying(50) NOT NULL,
    emisiones integer NOT NULL,
    subgrupos jsonb NOT NULL,
    vehiculoid integer
);
    DROP TABLE public.segundafase;
       public         heap    postgres    false            �            1259    17340    tercerafase    TABLE     �   CREATE TABLE public.tercerafase (
    numerobastidor character varying(255) NOT NULL,
    freno_delantero integer NOT NULL,
    freno_trasero integer NOT NULL,
    subgrupos jsonb NOT NULL,
    vehiculoid integer
);
    DROP TABLE public.tercerafase;
       public         heap    postgres    false            �            1259    17345 	   vehiculos    TABLE     �  CREATE TABLE public.vehiculos (
    vehiculoid integer NOT NULL,
    numerobastidor character varying(50) NOT NULL,
    marca character varying(50),
    modelo character varying(50),
    tara integer,
    medidaneumaticos character varying(50),
    dimensiones character varying(100),
    combustible character varying(50),
    normativaeuro character varying(10),
    aniofabricacion integer,
    clienteid integer NOT NULL
);
    DROP TABLE public.vehiculos;
       public         heap    postgres    false            �            1259    17348    vehiculos_vehiculoid_seq    SEQUENCE     �   CREATE SEQUENCE public.vehiculos_vehiculoid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.vehiculos_vehiculoid_seq;
       public          postgres    false    224            !           0    0    vehiculos_vehiculoid_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.vehiculos_vehiculoid_seq OWNED BY public.vehiculos.vehiculoid;
          public          postgres    false    225            ]           2604    17349    login id    DEFAULT     d   ALTER TABLE ONLY public.login ALTER COLUMN id SET DEFAULT nextval('public.login_id_seq'::regclass);
 7   ALTER TABLE public.login ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    220    219            _           2604    17350    vehiculos vehiculoid    DEFAULT     |   ALTER TABLE ONLY public.vehiculos ALTER COLUMN vehiculoid SET DEFAULT nextval('public.vehiculos_vehiculoid_seq'::regclass);
 C   ALTER TABLE public.vehiculos ALTER COLUMN vehiculoid DROP DEFAULT;
       public          postgres    false    225    224                      0    17311    clientes 
   TABLE DATA           �   COPY public.clientes (clienteid, nombre, apellidos, fecha_nacimiento, numero_telefono, dni, cantidad_coches, direccion, correo_electronico) FROM stdin;
    public          postgres    false    217   MA                 0    17318 
   cuartafase 
   TABLE DATA           K   COPY public.cuartafase (numerobastidor, subgrupos, vehiculoid) FROM stdin;
    public          postgres    false    218   �E                 0    17323    login 
   TABLE DATA           K   COPY public.login (id, usuario, "contraseña", rol, clienteid) FROM stdin;
    public          postgres    false    219   �H                 0    17330    primerafase 
   TABLE DATA           W   COPY public.primerafase (numerobastidor, km, fecha, subgrupos, vehiculoid) FROM stdin;
    public          postgres    false    221   �K                 0    17335    segundafase 
   TABLE DATA           d   COPY public.segundafase (numerobastidor, combustible, emisiones, subgrupos, vehiculoid) FROM stdin;
    public          postgres    false    222   �P                 0    17340    tercerafase 
   TABLE DATA           l   COPY public.tercerafase (numerobastidor, freno_delantero, freno_trasero, subgrupos, vehiculoid) FROM stdin;
    public          postgres    false    223   pR                 0    17345 	   vehiculos 
   TABLE DATA           �   COPY public.vehiculos (vehiculoid, numerobastidor, marca, modelo, tara, medidaneumaticos, dimensiones, combustible, normativaeuro, aniofabricacion, clienteid) FROM stdin;
    public          postgres    false    224   V       "           0    0    cliente_idd_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.cliente_idd_seq', 69, true);
          public          postgres    false    216            #           0    0    login_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.login_id_seq', 27, true);
          public          postgres    false    220            $           0    0    vehiculos_vehiculoid_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.vehiculos_vehiculoid_seq', 26, true);
          public          postgres    false    225            a           2606    17352    clientes clientes_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_pkey PRIMARY KEY (clienteid);
 @   ALTER TABLE ONLY public.clientes DROP CONSTRAINT clientes_pkey;
       public            postgres    false    217            i           2606    17354    cuartafase cuartafase_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.cuartafase
    ADD CONSTRAINT cuartafase_pkey PRIMARY KEY (numerobastidor);
 D   ALTER TABLE ONLY public.cuartafase DROP CONSTRAINT cuartafase_pkey;
       public            postgres    false    218            k           2606    17356    login login_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.login
    ADD CONSTRAINT login_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.login DROP CONSTRAINT login_pkey;
       public            postgres    false    219            o           2606    17358    primerafase primerafase_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.primerafase
    ADD CONSTRAINT primerafase_pkey PRIMARY KEY (numerobastidor);
 F   ALTER TABLE ONLY public.primerafase DROP CONSTRAINT primerafase_pkey;
       public            postgres    false    221            q           2606    17360    segundafase segundafase_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.segundafase
    ADD CONSTRAINT segundafase_pkey PRIMARY KEY (numerobastidor);
 F   ALTER TABLE ONLY public.segundafase DROP CONSTRAINT segundafase_pkey;
       public            postgres    false    222            s           2606    17362    tercerafase tercerafase_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.tercerafase
    ADD CONSTRAINT tercerafase_pkey PRIMARY KEY (numerobastidor);
 F   ALTER TABLE ONLY public.tercerafase DROP CONSTRAINT tercerafase_pkey;
       public            postgres    false    223            m           2606    17364    login unique_clienteid 
   CONSTRAINT     V   ALTER TABLE ONLY public.login
    ADD CONSTRAINT unique_clienteid UNIQUE (clienteid);
 @   ALTER TABLE ONLY public.login DROP CONSTRAINT unique_clienteid;
       public            postgres    false    219            c           2606    17366 "   clientes unique_correo_electronico 
   CONSTRAINT     k   ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT unique_correo_electronico UNIQUE (correo_electronico);
 L   ALTER TABLE ONLY public.clientes DROP CONSTRAINT unique_correo_electronico;
       public            postgres    false    217            e           2606    17368    clientes unique_dni 
   CONSTRAINT     M   ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT unique_dni UNIQUE (dni);
 =   ALTER TABLE ONLY public.clientes DROP CONSTRAINT unique_dni;
       public            postgres    false    217            g           2606    17370    clientes unique_numero_telefono 
   CONSTRAINT     e   ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT unique_numero_telefono UNIQUE (numero_telefono);
 I   ALTER TABLE ONLY public.clientes DROP CONSTRAINT unique_numero_telefono;
       public            postgres    false    217            u           2606    17372 &   vehiculos vehiculos_numerobastidor_key 
   CONSTRAINT     k   ALTER TABLE ONLY public.vehiculos
    ADD CONSTRAINT vehiculos_numerobastidor_key UNIQUE (numerobastidor);
 P   ALTER TABLE ONLY public.vehiculos DROP CONSTRAINT vehiculos_numerobastidor_key;
       public            postgres    false    224            w           2606    17374    vehiculos vehiculos_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.vehiculos
    ADD CONSTRAINT vehiculos_pkey PRIMARY KEY (vehiculoid);
 B   ALTER TABLE ONLY public.vehiculos DROP CONSTRAINT vehiculos_pkey;
       public            postgres    false    224            ~           2620    17375     vehiculos vehiculos_after_delete    TRIGGER     �   CREATE TRIGGER vehiculos_after_delete AFTER DELETE ON public.vehiculos FOR EACH ROW EXECUTE FUNCTION public.actualizar_cantidad_coches_delete();
 9   DROP TRIGGER vehiculos_after_delete ON public.vehiculos;
       public          postgres    false    224    263                       2620    17376 '   vehiculos vehiculos_after_insert_update    TRIGGER     �   CREATE TRIGGER vehiculos_after_insert_update AFTER INSERT OR UPDATE ON public.vehiculos FOR EACH ROW EXECUTE FUNCTION public.actualizar_cantidad_coches();
 @   DROP TRIGGER vehiculos_after_insert_update ON public.vehiculos;
       public          postgres    false    224    262            y           2606    17377    login fk_clienteid    FK CONSTRAINT     }   ALTER TABLE ONLY public.login
    ADD CONSTRAINT fk_clienteid FOREIGN KEY (clienteid) REFERENCES public.clientes(clienteid);
 <   ALTER TABLE ONLY public.login DROP CONSTRAINT fk_clienteid;
       public          postgres    false    4705    219    217            }           2606    17382    vehiculos fk_clienteidvehiculo    FK CONSTRAINT     �   ALTER TABLE ONLY public.vehiculos
    ADD CONSTRAINT fk_clienteidvehiculo FOREIGN KEY (clienteid) REFERENCES public.clientes(clienteid);
 H   ALTER TABLE ONLY public.vehiculos DROP CONSTRAINT fk_clienteidvehiculo;
       public          postgres    false    4705    217    224            z           2606    17387    primerafase fk_vehiculoid    FK CONSTRAINT     �   ALTER TABLE ONLY public.primerafase
    ADD CONSTRAINT fk_vehiculoid FOREIGN KEY (vehiculoid) REFERENCES public.vehiculos(vehiculoid);
 C   ALTER TABLE ONLY public.primerafase DROP CONSTRAINT fk_vehiculoid;
       public          postgres    false    4727    224    221            {           2606    17392    segundafase fk_vehiculoid    FK CONSTRAINT     �   ALTER TABLE ONLY public.segundafase
    ADD CONSTRAINT fk_vehiculoid FOREIGN KEY (vehiculoid) REFERENCES public.vehiculos(vehiculoid);
 C   ALTER TABLE ONLY public.segundafase DROP CONSTRAINT fk_vehiculoid;
       public          postgres    false    4727    224    222            |           2606    17397    tercerafase fk_vehiculoid    FK CONSTRAINT     �   ALTER TABLE ONLY public.tercerafase
    ADD CONSTRAINT fk_vehiculoid FOREIGN KEY (vehiculoid) REFERENCES public.vehiculos(vehiculoid);
 C   ALTER TABLE ONLY public.tercerafase DROP CONSTRAINT fk_vehiculoid;
       public          postgres    false    4727    224    223            x           2606    17402    cuartafase fk_vehiculoid    FK CONSTRAINT     �   ALTER TABLE ONLY public.cuartafase
    ADD CONSTRAINT fk_vehiculoid FOREIGN KEY (vehiculoid) REFERENCES public.vehiculos(vehiculoid);
 B   ALTER TABLE ONLY public.cuartafase DROP CONSTRAINT fk_vehiculoid;
       public          postgres    false    224    4727    218               e  x�u�Mr�6���S� !���ĝ����cE��*���p��
���(^���K��@����d|��u�Q�k��0��%�,�xA���Fq�N��{w!�����)]1\�d.ʭ�`}�����_��,���ȭ�0c/H�`
���@�������`��F|U���7������#.t�½h�����	t�&��0r'�fg���z���!�ʭ.��{KL� �Wˤ'�|`��4�[���iϬ����u�oޔ�'��4�<N��I,��U+s�"F�h,�K���_�k�!��l(�9�E�d�O����(�ig��E��L�+{����o�瑴/��8�ۚƵh~��gS��{�XA��Ǫ�ӱ�QU��sx���F�Y~.�a�Q�ۂ ��4��%�z@�{a����̺~��Q�bc�*w��[(�Ht~��lQ���:'�u��1��>��d��\(�{fj�B|Ci#�>wͯM�Ih72�;��p/O��Z1N&b��қ�"7��)��2��+��8�����%2>�^��@{~$�]����yl��������~7���U�5�֒Ed��W4�V�4���)x�V/��d�H'1w��'�b2�h����G��6�Jͯ�s���p�\De7����%d���i{��	\�N氬e��^�w��̖��a��Z��nj
�=�:<�N�J	Z����R\��!�ۢ����ѿJ�0�&䖰���J�V���KmK�q���pwo���kS،dSr�՞�s�#4e�#�۷�h~v�E�������y+6��,#�*b����Ƶ�t�Փ0�Ĺ�H�m��4vx������'%i��;�_���Bh3���|�a����~v3��ͻ�����@��K=n!����)~�j����N3��k�=���Ɔ'�h:��b��W)�
aZ�F��ݭ�����kz�3����"��E��I:�\�hڌ��=���:��J��Ҍ���!y��&�đJ
�*|�lx��8>�����K�0G��$ٔ�����F�	<T�!�f�y���0vx�`t���nO�Am�����>�niF�f����?L�0p�/��^��	��9�|cI�B�ggg�<��2         �  x����R�0 �3~
���-��C��!�i{�����T�3C���GȋUɥ4�A:%D����j�������{��z���2?�7�\ٞE;��}�>_���g�g7���6�1%��2T-�D���-���O��`��&�36@'�"�t�
^�5#�%P��e��K.�E��֜���U���6meX{�� ��Q���[;0��ܿ2@G�FjW�������lh�M�O�������5e��eCJ���:F*��
ռ��$:@}*�g�D*Zk�i�2��;� 2��d�-�ɚ�֩�W�N���h+.��P�Њ� �TsZsTq֊��d�=ջY#.Ԭ�� 
�
5v���C���ܩ\��\j�T�c��M���G���YZƅɨ�,�ɤ�ܪ-8�f����i�[�1T��%)��ct�\�j͌#Ҫ)T;t�q����z�wpwp�����z��%i��i��xմIP�ƙ��}H4-SOM{�"δ/U3m�Øi�R��x�d�'})����sL��3�0VL�Xİ���<�ͽN'�I?���"�E�n/�_N[�2K���)��Nt�ip��d��Y�}K�=�Y�,b��X�|���,�q�A�Έ-�=�U�*��[[�b'�=�~�{�0�;��d�	��0+�j
������]?�a'i�u^Ϋ��?XZìaְ52,�3,x1�-{��g{���8a[s��yļ�W��^-b� fӼL�s�ak�5�f[�2�˖�8� ��R�         �  x��ջr�0�ZzjŒ/�2���`g�l#a���6�}��)R���b+fv��W���G���� �(-����7Q���"�"9:�"F��/�(p�(����5����ee�%›����� �+���p���듷���tB3|���%�;g��,�8�vFƉ\$�xԡ�� �� ��<g�����]�����NR�de�U߬�;1�և��bz�w.�v|����0^�yx��zr����r�ɪb�_�I<��b��5'�kخ���\Ɖm\�ر�20n�{;�Ӂ-�bO�f|�y��a�@�Ti�e8-��L�=/]l��搈z��{��LsTwy�a�=z���,�پc��K^}�`Lj�QмKv�B�~־�%��S�`/�5^mX'-{G0��n�����^��:o����g�"ta̩l>(
~k��o��k���(�Rl�/�Z��!6�#�h�|���b������j�M�	���=ix�|pm��	��7G+Uu��F�[`Fk����,���6��s�E�:ӥ�!v@?g�1F�/��@!S�z�u�.���*�IV4�ښ�1 v�c3Y	4�q�IVkƸOv�8���/��d	�,�r+P�3?S�-r�*�^��I]aX����ZP��Ry�pM��F�4Vs��Jט8$6�K�3Z)Y��mC��Z�,�T̴���� ����         #  x���rG���SL���_-7IbS.L�$���X�d��5��
P<����U/���%�4��"c�'��_wO��3�Z�r������Ǯ�����z~���Nt�	:�zU3��TU���U�P�����P��\5O��}ѻ�z�8i��/�b!z��OE{��0Z�L�!�j�)�R��$�)7�c^��۴�9B�A����b^�Z󹄂M��5ԁ���Z��r���缒Ֆ����*}v(+h���BU�x��2�(�<`��OM	d�.G�U�R�"�n�w�#9/�YI���\��^�]��j�P���G��8ވ�ZR��쳓F蚛�"�����L�Qk�����2]����;�,&
�C��52��SU*]&��I�����Fd���(Q���j$�c����&�Ĭ�2���@��ʹ�j�iҜ��j�o�/����f_;�'�Zt-���߱B"�чI0�|.E�`!��~���7J��i�̹�cL��GS8ا�:�48y�3����R�g�H}�s�ɔg+-���s5��[���s�s\3v�s�
�UY��rD ~:jҕR�Lp8�7�X�yi�s��,e�<���_��n�vS�'` NZM��
��ffOp���E%�d�z����on�k�Xj��������M!�t���in�%��g�7������<���Z�tǔ�1̙9�x]ݘ%�� 泝�.? W��B����$��J��͠^I�䛡�%\S�n7�\]Y�`�v0�,Tš�R�˷g`yT;�K*���Eu�х�g��]4yr��N2�'�' ����0(l��(M��	�R:�B�o�������phU#�ЪŠ�U�!C��`h7�5���[`����Thc��*ޏ	���*Zuh"���Bk�/�Ak<�/�������� (�*�DA�j��A��Uw%ZUWP��7�B$���!�=�7"�6 ����C���B?������l�� �#�#�#�#����z�?�?���@A7|���4��� ��n'�����������F���N��d�$���~�^�M����������m����=8>�����p���������������߭�?�;�����Q�O���q�ЏЏЏЏЏЏЏЏ���_��~����1����������ma��6�97���"@�?�?��������#�#�#��̧�����A@�G�w�����x�G�������2�%�?���9z.�         �  x��ֱN�0 �9~
+3;��-mP@� RbGuʂx &�/F�Ғ�t�Q��Y������Ƈ�<���fr�������J�q�ɵ��ټ6�݇�O�6��L�c��b8��qw����*kL7_�G�>���k=x��ټ4fF��4fs�Δ��X��Ca�t�H�i��꙲��M�r�^�g,�S���(Ӭ����i�q&��d��~=;�(��H���9B<N�ZS:u(�ȵ���������#�U$��Rzc����R��Aq#E
�͏䒜H>�1�+�dP�H���s�$�����R���a�%����QU��headt�V�R�(۝0�����xrpL�J"�c�R�x �>�Ba�P�O
W�b �p��z�<�o�k���J���J��8������� x�Rx�         �  x���n�@����X�
��x}6wq��T����bco�"��v�x�> W<B^�Y��j�n
=1Rm"��Όg?��G���O���~N��ơ8�[{����T;���>y�7�d9Uƃp��-�+IrNj�"r�A9��Y#�1_���rR��j��U��Yu��Uyǳ�a0Y�J���ߤ��\T\e���䁨!{ш�$�jĴ�_Z�+���f�y�2^p�/V�"������>i���_�1I�Ӳ˖?$�$��\�Z*�~�/�5��>v	y\�"�ٕ���όh��iQ��^����bR|��*]��G'�dU�)�mX��8�%ì-A�����F+Қ)f���J΋������2-e�/0����%;�&�BT�:*L.ɝZ�/!�O"W�������3�N;�����L�gμ��ix(�-�WX��*"[R���Ec��ʩ����u�3����iz\�:a��Y��L�2YA���/
��]����R�n.cP�q_�*Xm�C�Ԭ�\h��- /�
�l����F���F�(��������C/�d9N'V�X~rQ�����h7��Hv��2�n�87׍.kc��v����P7��b�Y���Fk�l�wxn��z���d���t�07�/�r�������J��0�0-ߵY�,G�#ˑ�7���}7����1��أV�P��y��B0_q��8G�#�痌��~�L&I2�y�%.u}+L�koб\<��?�bgu�P��v�<r9��r>�ݭ�O���Oӡ���T�QG�#���y��m�k�u=?�8q�Tߙ�#�<R�Q��?&��=�A���]�K��G�#�q;��G��
�ǧ)�X���q�e���?bo+�/��;��� ��-D��ܹ	O�8�׵C����==��������>�O���m�Q1��         E  x���Ar�8E׍S�6@��RTly�(�]��ʆ�06+��!���7��!�&)�)PJ\ސ����� �M�3��7��(=:���b���(��*$)AI:&]�c��=�$��e���Û<Ta'uY��?G	(4����D;�~�H�8g�z���[� TցBFKF'`]��v�[�4��U��:�m�Z0��4U���I'�Z��r����*��hh��+:6��`�m���:(��n>ͯ��49���N#�}�Y}��/4OӢ��6�/���:$^	/�|>�~~}��Be�(��] ���u�>o��c+\�)��-[�@��޼�ӉIӱԖ'?-�%?u����tlS��'-�)ݝ�=�E�t�J�|�r����(/Gt�`�\�2����nZL���vD�3���G`�k�T05����	i�	
��.�@:�W���Ho��z��8န��	��2�ii�F�	�l�P��U�[�X�>Ԭ$��#|�����6�aZ���ƺo���#
�H���}�6�.��w��Fl^ V@Vp�v�.B}�h���c y`��@�����H��^m���l^)� 9��"��S�~��|�y�q98os�a���a�J�q90����_iD��K�Iy�WU��߳��O��+"�*�{s�^������q�T+�f�ܢ���=W|K�{�,_�qy��KV����C��+Oe����Go�Pqy�,�T������d�����EU�:��d��7�$T�J^~�Ct��2l+��ۧLΠ�Z��br�Ns�<��͞|�o�:�5�D���������Ç|��Y�WC����C��������@�     