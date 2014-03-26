/*==============================================================*/
/* DBMS name:      Microsoft SQL Server 2008                    */
/* Created on:     2014/3/26 13:31:49                           */
/*==============================================================*/


if exists (select 1
            from  sysobjects
           where  id = object_id('Client')
            and   type = 'U')
   drop table Client
go

if exists (select 1
            from  sysobjects
           where  id = object_id('ClientItem')
            and   type = 'U')
   drop table ClientItem
go

if exists (select 1
            from  sysobjects
           where  id = object_id('Company')
            and   type = 'U')
   drop table Company
go

if exists (select 1
            from  sysobjects
           where  id = object_id('Cost')
            and   type = 'U')
   drop table Cost
go

if exists (select 1
            from  sysobjects
           where  id = object_id('Dictionary')
            and   type = 'U')
   drop table Dictionary
go

if exists (select 1
            from  sysobjects
           where  id = object_id('Inventory')
            and   type = 'U')
   drop table Inventory
go

if exists (select 1
            from  sysobjects
           where  id = object_id('InventoryItem')
            and   type = 'U')
   drop table InventoryItem
go

if exists (select 1
            from  sysobjects
           where  id = object_id('Item')
            and   type = 'U')
   drop table Item
go

if exists (select 1
            from  sysobjects
           where  id = object_id('Module')
            and   type = 'U')
   drop table Module
go

if exists (select 1
            from  sysobjects
           where  id = object_id('PayAccount')
            and   type = 'U')
   drop table PayAccount
go

if exists (select 1
            from  sysobjects
           where  id = object_id('Place')
            and   type = 'U')
   drop table Place
go

if exists (select 1
            from  sysobjects
           where  id = object_id('PoStock')
            and   type = 'U')
   drop table PoStock
go

if exists (select 1
            from  sysobjects
           where  id = object_id('PurchaseOrder')
            and   type = 'U')
   drop table PurchaseOrder
go

if exists (select 1
            from  sysobjects
           where  id = object_id('PurchasePlan')
            and   type = 'U')
   drop table PurchasePlan
go

if exists (select 1
            from  sysobjects
           where  id = object_id('PurchaseTrans')
            and   type = 'U')
   drop table PurchaseTrans
go

if exists (select 1
            from  sysobjects
           where  id = object_id('SalesAccount')
            and   type = 'U')
   drop table SalesAccount
go

if exists (select 1
            from  sysobjects
           where  id = object_id('SalesOrder')
            and   type = 'U')
   drop table SalesOrder
go

if exists (select 1
            from  sysobjects
           where  id = object_id('SalesStock')
            and   type = 'U')
   drop table SalesStock
go

if exists (select 1
            from  sysobjects
           where  id = object_id('SalesTrans')
            and   type = 'U')
   drop table SalesTrans
go

if exists (select 1
            from  sysobjects
           where  id = object_id('Shelf')
            and   type = 'U')
   drop table Shelf
go

if exists (select 1
            from  sysobjects
           where  id = object_id('Stock')
            and   type = 'U')
   drop table Stock
go

if exists (select 1
            from  sysobjects
           where  id = object_id('StockChange')
            and   type = 'U')
   drop table StockChange
go

if exists (select 1
            from  sysobjects
           where  id = object_id('StockTrans')
            and   type = 'U')
   drop table StockTrans
go

if exists (select 1
            from  sysobjects
           where  id = object_id('Supply')
            and   type = 'U')
   drop table Supply
go

if exists (select 1
            from  sysobjects
           where  id = object_id('"User"')
            and   type = 'U')
   drop table "User"
go

/*==============================================================*/
/* Table: Client                                                */
/*==============================================================*/
create table Client (
   Id                   int                  identity,
   ClientName           varchar(200)         null,
   Tel                  varchar(200)         null,
   Contact              varchar(200)         null,
   DateCreated          datetime             null,
   CreatedId            int                  null,
   CreatedName          varchar(50)          null,
   constraint PK_CLIENT primary key (Id)
)
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sys.sp_addextendedproperty 'MS_Description', 
   '�ͻ���',
   'user', @CurrentUser, 'table', 'Client'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Id',
   'user', @CurrentUser, 'table', 'Client', 'column', 'Id'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�ͻ�����',
   'user', @CurrentUser, 'table', 'Client', 'column', 'ClientName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��ϵ�绰',
   'user', @CurrentUser, 'table', 'Client', 'column', 'Tel'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��ϵ��',
   'user', @CurrentUser, 'table', 'Client', 'column', 'Contact'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��������',
   'user', @CurrentUser, 'table', 'Client', 'column', 'DateCreated'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '������Id',
   'user', @CurrentUser, 'table', 'Client', 'column', 'CreatedId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '����������',
   'user', @CurrentUser, 'table', 'Client', 'column', 'CreatedName'
go

/*==============================================================*/
/* Table: ClientItem                                            */
/*==============================================================*/
create table ClientItem (
   Id                   int                  identity,
   ItemId               int                  null,
   ClientId             int                  null,
   ClientName           varchar(200)         null,
   MarketPrice          decimal(9,2)         null,
   CostPrice            decimal(9,2)         null,
   SalePrice            decimal(9,2)         null,
   ReturnDays           int                  null,
   ExchangeDays         int                  null,
   RepairDays           int                  null,
   MinOrderCount        int                  null,
   SaleType             varchar(50)          null,
   PrepareDays          int                  null,
   SupplyType           varchar(200)         null,
   TaxRate              decimal(9,2)         null,
   IsOrder              bit                  null,
   SupplyId             int                  null,
   SupplyName           varchar(200)         null,
   DateCreated          datetime             null,
   CreatedId            int                  null,
   CreatedName          varchar(50)          null,
   constraint PK_CLIENTITEM primary key (Id)
)
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sys.sp_addextendedproperty 'MS_Description', 
   '�ͻ���Ʒӳ��',
   'user', @CurrentUser, 'table', 'ClientItem'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Id',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'Id'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��ƷId',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'ItemId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�ͻ�Id',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'ClientId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�ͻ�����',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'ClientName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�г���',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'MarketPrice'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '����',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'CostPrice'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '���ۼ�',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'SalePrice'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��������',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'ReturnDays'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��������',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'ExchangeDays'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��������',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'RepairDays'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��С��������',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'MinOrderCount'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��������',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'SaleType'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��������',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'PrepareDays'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��Ӧ�����',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'SupplyType'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '˰��',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'TaxRate'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�Ƿ�ɲ�',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'IsOrder'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��Ӧ��Id',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'SupplyId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��Ӧ������',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'SupplyName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��������',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'DateCreated'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '������Id',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'CreatedId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '����������',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'CreatedName'
go

/*==============================================================*/
/* Table: Company                                               */
/*==============================================================*/
create table Company (
   Id                   int                  identity,
   CompanyName          varchar(200)         null,
   constraint PK_COMPANY primary key (Id)
)
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sys.sp_addextendedproperty 'MS_Description', 
   '��˾��',
   'user', @CurrentUser, 'table', 'Company'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Id',
   'user', @CurrentUser, 'table', 'Company', 'column', 'Id'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��˾����',
   'user', @CurrentUser, 'table', 'Company', 'column', 'CompanyName'
go

/*==============================================================*/
/* Table: Cost                                                  */
/*==============================================================*/
create table Cost (
   Id                   int                  identity,
   constraint PK_COST primary key (Id)
)
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sys.sp_addextendedproperty 'MS_Description', 
   '����ɱ�����',
   'user', @CurrentUser, 'table', 'Cost'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Id',
   'user', @CurrentUser, 'table', 'Cost', 'column', 'Id'
go

/*==============================================================*/
/* Table: Dictionary                                            */
/*==============================================================*/
create table Dictionary (
   Id                   int                  identity,
   Module               varchar(50)          null,
   Field                varchar(100)         null,
   Options              varchar(max)         null,
   ParentId             int                  null,
   constraint PK_DICTIONARY primary key (Id)
)
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sys.sp_addextendedproperty 'MS_Description', 
   '�����ֵ�',
   'user', @CurrentUser, 'table', 'Dictionary'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Id',
   'user', @CurrentUser, 'table', 'Dictionary', 'column', 'Id'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'ģ������',
   'user', @CurrentUser, 'table', 'Dictionary', 'column', 'Module'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�ֶ�����',
   'user', @CurrentUser, 'table', 'Dictionary', 'column', 'Field'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��ѡ����',
   'user', @CurrentUser, 'table', 'Dictionary', 'column', 'Options'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�ϼ����',
   'user', @CurrentUser, 'table', 'Dictionary', 'column', 'ParentId'
go

/*==============================================================*/
/* Table: Inventory                                             */
/*==============================================================*/
create table Inventory (
   Id                   int                  identity,
   StockId              int                  null,
   StockName            varchar(200)         null,
   PlaceId              int                  null,
   PlaceName            varchar(200)         null,
   ShelfId              int                  null,
   ShelfName            varchar(200)         null,
   ItemId               int                  null,
   ItemName             varchar(200)         null,
   ItemBarCode          varchar(200)         null,
   Qty                  decimal(9,2)         null,
   constraint PK_INVENTORY primary key (Id)
)
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sys.sp_addextendedproperty 'MS_Description', 
   '����',
   'user', @CurrentUser, 'table', 'Inventory'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Id',
   'user', @CurrentUser, 'table', 'Inventory', 'column', 'Id'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�ֿ�Id',
   'user', @CurrentUser, 'table', 'Inventory', 'column', 'StockId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�ֿ�����',
   'user', @CurrentUser, 'table', 'Inventory', 'column', 'StockName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��λId',
   'user', @CurrentUser, 'table', 'Inventory', 'column', 'PlaceId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��λ����',
   'user', @CurrentUser, 'table', 'Inventory', 'column', 'PlaceName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '����Id',
   'user', @CurrentUser, 'table', 'Inventory', 'column', 'ShelfId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��������',
   'user', @CurrentUser, 'table', 'Inventory', 'column', 'ShelfName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��ƷId',
   'user', @CurrentUser, 'table', 'Inventory', 'column', 'ItemId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��Ʒ����',
   'user', @CurrentUser, 'table', 'Inventory', 'column', 'ItemName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��Ʒ����',
   'user', @CurrentUser, 'table', 'Inventory', 'column', 'ItemBarCode'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�������',
   'user', @CurrentUser, 'table', 'Inventory', 'column', 'Qty'
go

/*==============================================================*/
/* Table: InventoryItem                                         */
/*==============================================================*/
create table InventoryItem (
   Id                   int                  identity,
   StockId              int                  null,
   StockName            varchar(200)         null,
   PlaceId              int                  null,
   PlaceName            varchar(200)         null,
   ShelfId              int                  null,
   ShelfName            varchar(200)         null,
   ItemId               int                  null,
   ItemName             varchar(200)         null,
   ItemBarCode          varchar(200)         null,
   ItemBatchNo          varchar(200)         null,
   ItemProductionDate   datetime             null,
   ItemExpiringDate     datetime             null,
   ItemPeriod           decimal(9,2)         null,
   BatchId              int                  null,
   Qty                  decimal(9,2)         null,
   DateEntered          datetime             null,
   AddedId              int                  null,
   AddedName            varchar(50)          null,
   constraint PK_INVENTORYITEM primary key (Id)
)
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sys.sp_addextendedproperty 'MS_Description', 
   '�����ϸ��',
   'user', @CurrentUser, 'table', 'InventoryItem'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Id',
   'user', @CurrentUser, 'table', 'InventoryItem', 'column', 'Id'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�ֿ�Id',
   'user', @CurrentUser, 'table', 'InventoryItem', 'column', 'StockId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�ֿ�����',
   'user', @CurrentUser, 'table', 'InventoryItem', 'column', 'StockName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��λId',
   'user', @CurrentUser, 'table', 'InventoryItem', 'column', 'PlaceId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��λ����',
   'user', @CurrentUser, 'table', 'InventoryItem', 'column', 'PlaceName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '����Id',
   'user', @CurrentUser, 'table', 'InventoryItem', 'column', 'ShelfId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��������',
   'user', @CurrentUser, 'table', 'InventoryItem', 'column', 'ShelfName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��ƷId',
   'user', @CurrentUser, 'table', 'InventoryItem', 'column', 'ItemId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��Ʒ����',
   'user', @CurrentUser, 'table', 'InventoryItem', 'column', 'ItemName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��Ʒ����',
   'user', @CurrentUser, 'table', 'InventoryItem', 'column', 'ItemBarCode'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��Ʒ����',
   'user', @CurrentUser, 'table', 'InventoryItem', 'column', 'ItemBatchNo'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��Ʒ��������',
   'user', @CurrentUser, 'table', 'InventoryItem', 'column', 'ItemProductionDate'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��Ʒ��Ч��',
   'user', @CurrentUser, 'table', 'InventoryItem', 'column', 'ItemExpiringDate'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��Ʒ������',
   'user', @CurrentUser, 'table', 'InventoryItem', 'column', 'ItemPeriod'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '����Id',
   'user', @CurrentUser, 'table', 'InventoryItem', 'column', 'BatchId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�������',
   'user', @CurrentUser, 'table', 'InventoryItem', 'column', 'Qty'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�������',
   'user', @CurrentUser, 'table', 'InventoryItem', 'column', 'DateEntered'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�����Id',
   'user', @CurrentUser, 'table', 'InventoryItem', 'column', 'AddedId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '���������',
   'user', @CurrentUser, 'table', 'InventoryItem', 'column', 'AddedName'
go

/*==============================================================*/
/* Table: Item                                                  */
/*==============================================================*/
create table Item (
   Id                   int                  identity,
   ItemCode             varchar(200)         null,
   ItemName             varchar(200)         null,
   ItemType             varchar(200)         null,
   SubTitle             varchar(200)         null,
   Brand                varchar(200)         null,
   Specification        varchar(200)         null,
   BarCode              varchar(200)         null,
   SKU                  varchar(200)         null,
   Color                varchar(200)         null,
   Style                varchar(200)         null,
   Long                 decimal(9,2)         null,
   Wide                 decimal(9,2)         null,
   High                 decimal(9,2)         null,
   NetWeight            decimal(9,2)         null,
   MeasureUnit          varchar(50)          null,
   CartonSpec           decimal(9,2)         null,
   Producer             varchar(200)         null,
   Packages             varchar(200)         null,
   Guarantee            int                  null,
   IsGuarantee          bit                  null,
   BatchType            varchar(50)          null,
   DateCreated          datetime             null,
   CreatedId            int                  null,
   CreatedName          varchar(50)          null,
   constraint PK_ITEM primary key (Id)
)
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sys.sp_addextendedproperty 'MS_Description', 
   '��Ʒ��',
   'user', @CurrentUser, 'table', 'Item'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Id',
   'user', @CurrentUser, 'table', 'Item', 'column', 'Id'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��Ʒ����',
   'user', @CurrentUser, 'table', 'Item', 'column', 'ItemCode'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��Ʒ����',
   'user', @CurrentUser, 'table', 'Item', 'column', 'ItemName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��Ʒ���',
   'user', @CurrentUser, 'table', 'Item', 'column', 'ItemType'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��Ʒ����������',
   'user', @CurrentUser, 'table', 'Item', 'column', 'SubTitle'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Ʒ��',
   'user', @CurrentUser, 'table', 'Item', 'column', 'Brand'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '���',
   'user', @CurrentUser, 'table', 'Item', 'column', 'Specification'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '������',
   'user', @CurrentUser, 'table', 'Item', 'column', 'BarCode'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'SKU',
   'user', @CurrentUser, 'table', 'Item', 'column', 'SKU'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��ɫ',
   'user', @CurrentUser, 'table', 'Item', 'column', 'Color'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��ʽ',
   'user', @CurrentUser, 'table', 'Item', 'column', 'Style'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��',
   'user', @CurrentUser, 'table', 'Item', 'column', 'Long'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��',
   'user', @CurrentUser, 'table', 'Item', 'column', 'Wide'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��',
   'user', @CurrentUser, 'table', 'Item', 'column', 'High'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��Ʒë��',
   'user', @CurrentUser, 'table', 'Item', 'column', 'NetWeight'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '������λ',
   'user', @CurrentUser, 'table', 'Item', 'column', 'MeasureUnit'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '���',
   'user', @CurrentUser, 'table', 'Item', 'column', 'CartonSpec'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '����',
   'user', @CurrentUser, 'table', 'Item', 'column', 'Producer'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��װ����',
   'user', @CurrentUser, 'table', 'Item', 'column', 'Packages'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��������',
   'user', @CurrentUser, 'table', 'Item', 'column', 'Guarantee'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�Ƿ����ڹ���',
   'user', @CurrentUser, 'table', 'Item', 'column', 'IsGuarantee'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��Ʒ��������',
   'user', @CurrentUser, 'table', 'Item', 'column', 'BatchType'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��������',
   'user', @CurrentUser, 'table', 'Item', 'column', 'DateCreated'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '������Id',
   'user', @CurrentUser, 'table', 'Item', 'column', 'CreatedId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '����������',
   'user', @CurrentUser, 'table', 'Item', 'column', 'CreatedName'
go

/*==============================================================*/
/* Table: Module                                                */
/*==============================================================*/
create table Module (
   Id                   varchar(50)          not null,
   ParentId             varchar(50)          not null,
   Name                 varchar(50)          not null,
   Title                varchar(50)          not null,
   Url                  varchar(500)         not null,
   IsActive             bit                  not null,
   constraint PK_MODULE primary key (Id)
)
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sys.sp_addextendedproperty 'MS_Description', 
   'ģ���',
   'user', @CurrentUser, 'table', 'Module'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'ģ��Id',
   'user', @CurrentUser, 'table', 'Module', 'column', 'Id'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�ϼ�Id',
   'user', @CurrentUser, 'table', 'Module', 'column', 'ParentId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'ģ������',
   'user', @CurrentUser, 'table', 'Module', 'column', 'Name'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'ģ�����',
   'user', @CurrentUser, 'table', 'Module', 'column', 'Title'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'ģ��·��',
   'user', @CurrentUser, 'table', 'Module', 'column', 'Url'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�Ƿ񼤻�',
   'user', @CurrentUser, 'table', 'Module', 'column', 'IsActive'
go

/*==============================================================*/
/* Table: PayAccount                                            */
/*==============================================================*/
create table PayAccount (
   Id                   int                  identity,
   constraint PK_PAYACCOUNT primary key (Id)
)
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sys.sp_addextendedproperty 'MS_Description', 
   'Ӧ��������',
   'user', @CurrentUser, 'table', 'PayAccount'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Id',
   'user', @CurrentUser, 'table', 'PayAccount', 'column', 'Id'
go

/*==============================================================*/
/* Table: Place                                                 */
/*==============================================================*/
create table Place (
   Id                   int                  identity,
   PlaceName            varchar(200)         null,
   StockId              int                  null,
   constraint PK_PLACE primary key (Id)
)
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sys.sp_addextendedproperty 'MS_Description', 
   '��λ',
   'user', @CurrentUser, 'table', 'Place'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Id',
   'user', @CurrentUser, 'table', 'Place', 'column', 'Id'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��λ����',
   'user', @CurrentUser, 'table', 'Place', 'column', 'PlaceName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�ֿ�Id',
   'user', @CurrentUser, 'table', 'Place', 'column', 'StockId'
go

/*==============================================================*/
/* Table: PoStock                                               */
/*==============================================================*/
create table PoStock (
   Id                   int                  identity,
   constraint PK_POSTOCK primary key (Id)
)
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sys.sp_addextendedproperty 'MS_Description', 
   '������⡢�˻������⡢����',
   'user', @CurrentUser, 'table', 'PoStock'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Id',
   'user', @CurrentUser, 'table', 'PoStock', 'column', 'Id'
go

/*==============================================================*/
/* Table: PurchaseOrder                                         */
/*==============================================================*/
create table PurchaseOrder (
   Id                   int                  identity,
   SupplyId             int                  null,
   SupplyName           varchar(200)         null,
   ItemId               int                  null,
   ItemName             varchar(200)         null,
   DatePurchased        datetime             null,
   Count                decimal(9,2)         null,
   Price                decimal(9,2)         null,
   Amount               decimal(9,2)         null,
   AddedId              int                  null,
   AddedName            varchar(50)          null,
   DateAdded            datetime             null,
   PurchasePlanIds      varchar(200)         null,
   constraint PK_PURCHASEORDER primary key (Id)
)
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sys.sp_addextendedproperty 'MS_Description', 
   '�ɹ�����',
   'user', @CurrentUser, 'table', 'PurchaseOrder'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Id',
   'user', @CurrentUser, 'table', 'PurchaseOrder', 'column', 'Id'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��Ӧ��Id',
   'user', @CurrentUser, 'table', 'PurchaseOrder', 'column', 'SupplyId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��Ӧ������',
   'user', @CurrentUser, 'table', 'PurchaseOrder', 'column', 'SupplyName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��ƷId',
   'user', @CurrentUser, 'table', 'PurchaseOrder', 'column', 'ItemId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��Ʒ����',
   'user', @CurrentUser, 'table', 'PurchaseOrder', 'column', 'ItemName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�ɹ�����',
   'user', @CurrentUser, 'table', 'PurchaseOrder', 'column', 'DatePurchased'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�ɹ�����',
   'user', @CurrentUser, 'table', 'PurchaseOrder', 'column', 'Count'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�ɹ�����',
   'user', @CurrentUser, 'table', 'PurchaseOrder', 'column', 'Price'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�ɹ����',
   'user', @CurrentUser, 'table', 'PurchaseOrder', 'column', 'Amount'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�����Id',
   'user', @CurrentUser, 'table', 'PurchaseOrder', 'column', 'AddedId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '���������',
   'user', @CurrentUser, 'table', 'PurchaseOrder', 'column', 'AddedName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�������',
   'user', @CurrentUser, 'table', 'PurchaseOrder', 'column', 'DateAdded'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�ɹ��ƻ�Ids',
   'user', @CurrentUser, 'table', 'PurchaseOrder', 'column', 'PurchasePlanIds'
go

/*==============================================================*/
/* Table: PurchasePlan                                          */
/*==============================================================*/
create table PurchasePlan (
   Id                   int                  identity,
   ClientId             int                  null,
   ClientName           varchar(200)         null,
   ItemId               int                  null,
   ItemName             varchar(200)         null,
   DatePurchased        datetime             null,
   Count                decimal(9,2)         null,
   Price                decimal(9,2)         null,
   Amount               decimal(9,2)         null,
   AddedId              int                  null,
   AddedName            varchar(50)          null,
   DateAdded            datetime             null,
   constraint PK_PURCHASEPLAN primary key (Id)
)
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sys.sp_addextendedproperty 'MS_Description', 
   '�ɹ��ƻ�',
   'user', @CurrentUser, 'table', 'PurchasePlan'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Id',
   'user', @CurrentUser, 'table', 'PurchasePlan', 'column', 'Id'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�ͻ�Id',
   'user', @CurrentUser, 'table', 'PurchasePlan', 'column', 'ClientId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�ͻ�����',
   'user', @CurrentUser, 'table', 'PurchasePlan', 'column', 'ClientName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��ƷId',
   'user', @CurrentUser, 'table', 'PurchasePlan', 'column', 'ItemId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��Ʒ����',
   'user', @CurrentUser, 'table', 'PurchasePlan', 'column', 'ItemName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�ɹ�����',
   'user', @CurrentUser, 'table', 'PurchasePlan', 'column', 'DatePurchased'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�ɹ�����',
   'user', @CurrentUser, 'table', 'PurchasePlan', 'column', 'Count'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�ɹ�����',
   'user', @CurrentUser, 'table', 'PurchasePlan', 'column', 'Price'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�ɹ����',
   'user', @CurrentUser, 'table', 'PurchasePlan', 'column', 'Amount'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�����Id',
   'user', @CurrentUser, 'table', 'PurchasePlan', 'column', 'AddedId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '���������',
   'user', @CurrentUser, 'table', 'PurchasePlan', 'column', 'AddedName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�������',
   'user', @CurrentUser, 'table', 'PurchasePlan', 'column', 'DateAdded'
go

/*==============================================================*/
/* Table: PurchaseTrans                                         */
/*==============================================================*/
create table PurchaseTrans (
   Id                   int                  identity,
   constraint PK_PURCHASETRANS primary key (Id)
)
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sys.sp_addextendedproperty 'MS_Description', 
   '�ɹ�����',
   'user', @CurrentUser, 'table', 'PurchaseTrans'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Id',
   'user', @CurrentUser, 'table', 'PurchaseTrans', 'column', 'Id'
go

/*==============================================================*/
/* Table: SalesAccount                                          */
/*==============================================================*/
create table SalesAccount (
   Id                   int                  not null,
   constraint PK_SALESACCOUNT primary key (Id)
)
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sys.sp_addextendedproperty 'MS_Description', 
   'Ӧ��������',
   'user', @CurrentUser, 'table', 'SalesAccount'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Id',
   'user', @CurrentUser, 'table', 'SalesAccount', 'column', 'Id'
go

/*==============================================================*/
/* Table: SalesOrder                                            */
/*==============================================================*/
create table SalesOrder (
   Id                   int                  identity,
   constraint PK_SALESORDER primary key (Id)
)
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sys.sp_addextendedproperty 'MS_Description', 
   '���۶���',
   'user', @CurrentUser, 'table', 'SalesOrder'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Id',
   'user', @CurrentUser, 'table', 'SalesOrder', 'column', 'Id'
go

/*==============================================================*/
/* Table: SalesStock                                            */
/*==============================================================*/
create table SalesStock (
   Id                   int                  identity,
   constraint PK_SALESSTOCK primary key (Id)
)
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sys.sp_addextendedproperty 'MS_Description', 
   '���������⡢�˻�������������',
   'user', @CurrentUser, 'table', 'SalesStock'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Id',
   'user', @CurrentUser, 'table', 'SalesStock', 'column', 'Id'
go

/*==============================================================*/
/* Table: SalesTrans                                            */
/*==============================================================*/
create table SalesTrans (
   Id                   int                  identity,
   constraint PK_SALESTRANS primary key (Id)
)
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sys.sp_addextendedproperty 'MS_Description', 
   '��������',
   'user', @CurrentUser, 'table', 'SalesTrans'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Id',
   'user', @CurrentUser, 'table', 'SalesTrans', 'column', 'Id'
go

/*==============================================================*/
/* Table: Shelf                                                 */
/*==============================================================*/
create table Shelf (
   Id                   int                  not null,
   ShelfName            varchar(200)         null,
   PlaceId              int                  null,
   StockId              int                  null,
   constraint PK_SHELF primary key (Id)
)
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sys.sp_addextendedproperty 'MS_Description', 
   '����',
   'user', @CurrentUser, 'table', 'Shelf'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Id',
   'user', @CurrentUser, 'table', 'Shelf', 'column', 'Id'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��������',
   'user', @CurrentUser, 'table', 'Shelf', 'column', 'ShelfName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��λId',
   'user', @CurrentUser, 'table', 'Shelf', 'column', 'PlaceId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '����Id',
   'user', @CurrentUser, 'table', 'Shelf', 'column', 'StockId'
go

/*==============================================================*/
/* Table: Stock                                                 */
/*==============================================================*/
create table Stock (
   Id                   int                  identity,
   StockName            varchar(200)         null,
   constraint PK_STOCK primary key (Id)
)
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sys.sp_addextendedproperty 'MS_Description', 
   '�ֿ�',
   'user', @CurrentUser, 'table', 'Stock'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Id',
   'user', @CurrentUser, 'table', 'Stock', 'column', 'Id'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�ֿ�����',
   'user', @CurrentUser, 'table', 'Stock', 'column', 'StockName'
go

/*==============================================================*/
/* Table: StockChange                                           */
/*==============================================================*/
create table StockChange (
   Id                   int                  identity,
   Type                 varchar(50)          null,
   BillNo               varchar(50)          null,
   StockId              int                  null,
   StockName            varchar(200)         null,
   PlaceId              int                  null,
   PlaceName            varchar(200)         null,
   ShelfId              int                  null,
   ShelfName            varchar(200)         null,
   ItemId               int                  null,
   ItemName             varchar(200)         null,
   ItemBarCode          varchar(200)         null,
   BatchId              int                  null,
   Qty                  decimal(9,2)         null,
   PreQty               decimal(9,2)         null,
   Operation            varchar(50)          null,
   Balance              decima(9,2)          null,
   DateEntered          datetime             null,
   AddedId              int                  null,
   AddedName            varchar(50)          null,
   constraint PK_STOCKCHANGE primary key (Id)
)
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sys.sp_addextendedproperty 'MS_Description', 
   '�ֿ�䶯��',
   'user', @CurrentUser, 'table', 'StockChange'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Id',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'Id'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�䶯����',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'Type'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '���ݺ���',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'BillNo'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�ֿ�Id',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'StockId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�ֿ�����',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'StockName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��λId',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'PlaceId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��λ����',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'PlaceName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '����Id',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'ShelfId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��������',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'ShelfName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��ƷId',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'ItemId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��Ʒ����',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'ItemName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��Ʒ����',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'ItemBarCode'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '����Id',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'BatchId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��������',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'Qty'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��������',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'PreQty'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '���ڼӼ�',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'Operation'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��������',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'Balance'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�䶯����',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'DateEntered'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�䶯��Id',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'AddedId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�䶯������',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'AddedName'
go

/*==============================================================*/
/* Table: StockTrans                                            */
/*==============================================================*/
create table StockTrans (
   Id                   int                  identity,
   constraint PK_STOCKTRANS primary key (Id)
)
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sys.sp_addextendedproperty 'MS_Description', 
   '�ֿ�����',
   'user', @CurrentUser, 'table', 'StockTrans'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Id',
   'user', @CurrentUser, 'table', 'StockTrans', 'column', 'Id'
go

/*==============================================================*/
/* Table: Supply                                                */
/*==============================================================*/
create table Supply (
   Id                   int                  identity,
   SupplyName           varchar(200)         null,
   Tel                  varchar(200)         null,
   Contact              varchar(200)         null,
   DateCreated          datetime             null,
   CreatedId            int                  null,
   CreatedName          varchar(50)          null,
   constraint PK_SUPPLY primary key (Id)
)
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sys.sp_addextendedproperty 'MS_Description', 
   '��Ӧ�̱�',
   'user', @CurrentUser, 'table', 'Supply'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Id',
   'user', @CurrentUser, 'table', 'Supply', 'column', 'Id'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��Ӧ������',
   'user', @CurrentUser, 'table', 'Supply', 'column', 'SupplyName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��ϵ�绰',
   'user', @CurrentUser, 'table', 'Supply', 'column', 'Tel'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��ϵ��',
   'user', @CurrentUser, 'table', 'Supply', 'column', 'Contact'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��������',
   'user', @CurrentUser, 'table', 'Supply', 'column', 'DateCreated'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '������Id',
   'user', @CurrentUser, 'table', 'Supply', 'column', 'CreatedId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '����������',
   'user', @CurrentUser, 'table', 'Supply', 'column', 'CreatedName'
go

/*==============================================================*/
/* Table: "User"                                                */
/*==============================================================*/
create table "User" (
   Id                   int                  identity,
   Login                varchar(50)          null,
   Password             varchar(200)         null,
   Name                 varchar(50)          null,
   Position             varchar(50)          null,
   City                 varchar(20)          null,
   Office               varchar(20)          null,
   Tel                  varchar(50)          null,
   Fax                  varchar(20)          null,
   Email                varchar(20)          null,
   Gender               varchar(20)          null,
   Birthday             datetime             null,
   IsActive             bit                  null,
   IsHoliday            bit                  null,
   AgentID              int                  null,
   AgentName            varchar(50)          null,
   AgentBegin           datetime             null,
   AgentEnd             datetime             null,
   Profile              varchar(max)         null,
   CostCenter           varchar(50)          null,
   Level                int                  null,
   Reserve1             int                  null,
   Reserve2             varchar(200)         null,
   Reserve3             varchar(200)         null,
   Reserve4             varchar(200)         null,
   constraint PK_USER primary key (Id)
)
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sys.sp_addextendedproperty 'MS_Description', 
   '�û���',
   'user', @CurrentUser, 'table', 'User'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�û�Id',
   'user', @CurrentUser, 'table', 'User', 'column', 'Id'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��¼��',
   'user', @CurrentUser, 'table', 'User', 'column', 'Login'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '����',
   'user', @CurrentUser, 'table', 'User', 'column', 'Password'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '����',
   'user', @CurrentUser, 'table', 'User', 'column', 'Name'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'ְλ',
   'user', @CurrentUser, 'table', 'User', 'column', 'Position'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '���ڳ���',
   'user', @CurrentUser, 'table', 'User', 'column', 'City'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '���ڰ칫��',
   'user', @CurrentUser, 'table', 'User', 'column', 'Office'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�绰',
   'user', @CurrentUser, 'table', 'User', 'column', 'Tel'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '����',
   'user', @CurrentUser, 'table', 'User', 'column', 'Fax'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '����',
   'user', @CurrentUser, 'table', 'User', 'column', 'Email'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�Ա�',
   'user', @CurrentUser, 'table', 'User', 'column', 'Gender'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��������',
   'user', @CurrentUser, 'table', 'User', 'column', 'Birthday'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�Ƿ񼤻�',
   'user', @CurrentUser, 'table', 'User', 'column', 'IsActive'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�Ƿ��ݼ�',
   'user', @CurrentUser, 'table', 'User', 'column', 'IsHoliday'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�ݼٴ�����',
   'user', @CurrentUser, 'table', 'User', 'column', 'AgentID'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '����������',
   'user', @CurrentUser, 'table', 'User', 'column', 'AgentName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '����ʼ����',
   'user', @CurrentUser, 'table', 'User', 'column', 'AgentBegin'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�����������',
   'user', @CurrentUser, 'table', 'User', 'column', 'AgentEnd'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '��������',
   'user', @CurrentUser, 'table', 'User', 'column', 'Profile'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '�ɱ�����',
   'user', @CurrentUser, 'table', 'User', 'column', 'CostCenter'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '����',
   'user', @CurrentUser, 'table', 'User', 'column', 'Level'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Ԥ���ֶ�1',
   'user', @CurrentUser, 'table', 'User', 'column', 'Reserve1'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Ԥ���ֶ�2',
   'user', @CurrentUser, 'table', 'User', 'column', 'Reserve2'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Ԥ���ֶ�3',
   'user', @CurrentUser, 'table', 'User', 'column', 'Reserve3'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Ԥ���ֶ�4',
   'user', @CurrentUser, 'table', 'User', 'column', 'Reserve4'
go

