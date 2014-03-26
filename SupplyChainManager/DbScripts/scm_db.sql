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
   '客户表',
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
   '客户名称',
   'user', @CurrentUser, 'table', 'Client', 'column', 'ClientName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '联系电话',
   'user', @CurrentUser, 'table', 'Client', 'column', 'Tel'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '联系人',
   'user', @CurrentUser, 'table', 'Client', 'column', 'Contact'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '创建日期',
   'user', @CurrentUser, 'table', 'Client', 'column', 'DateCreated'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '创建人Id',
   'user', @CurrentUser, 'table', 'Client', 'column', 'CreatedId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '创建人名称',
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
   '客户商品映射',
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
   '商品Id',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'ItemId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '客户Id',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'ClientId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '客户名称',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'ClientName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '市场价',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'MarketPrice'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '进价',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'CostPrice'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '销售价',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'SalePrice'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '包退天数',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'ReturnDays'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '包换天数',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'ExchangeDays'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '包修天数',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'RepairDays'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '最小订货数量',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'MinOrderCount'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '销售类型',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'SaleType'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '备货天数',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'PrepareDays'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '供应商类别',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'SupplyType'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '税率',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'TaxRate'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '是否可采',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'IsOrder'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '供应商Id',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'SupplyId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '供应商名称',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'SupplyName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '创建日期',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'DateCreated'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '创建人Id',
   'user', @CurrentUser, 'table', 'ClientItem', 'column', 'CreatedId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '创建人名称',
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
   '公司表',
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
   '公司名称',
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
   '财务成本核算',
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
   '数据字典',
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
   '模块名称',
   'user', @CurrentUser, 'table', 'Dictionary', 'column', 'Module'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '字段名称',
   'user', @CurrentUser, 'table', 'Dictionary', 'column', 'Field'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '可选内容',
   'user', @CurrentUser, 'table', 'Dictionary', 'column', 'Options'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '上级编号',
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
   '库存表',
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
   '仓库Id',
   'user', @CurrentUser, 'table', 'Inventory', 'column', 'StockId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '仓库名称',
   'user', @CurrentUser, 'table', 'Inventory', 'column', 'StockName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '货位Id',
   'user', @CurrentUser, 'table', 'Inventory', 'column', 'PlaceId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '货位名称',
   'user', @CurrentUser, 'table', 'Inventory', 'column', 'PlaceName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '货架Id',
   'user', @CurrentUser, 'table', 'Inventory', 'column', 'ShelfId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '货架名称',
   'user', @CurrentUser, 'table', 'Inventory', 'column', 'ShelfName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '货品Id',
   'user', @CurrentUser, 'table', 'Inventory', 'column', 'ItemId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '货品名称',
   'user', @CurrentUser, 'table', 'Inventory', 'column', 'ItemName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '货品条码',
   'user', @CurrentUser, 'table', 'Inventory', 'column', 'ItemBarCode'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '存货数量',
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
   '库存明细表',
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
   '仓库Id',
   'user', @CurrentUser, 'table', 'InventoryItem', 'column', 'StockId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '仓库名称',
   'user', @CurrentUser, 'table', 'InventoryItem', 'column', 'StockName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '货位Id',
   'user', @CurrentUser, 'table', 'InventoryItem', 'column', 'PlaceId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '货位名称',
   'user', @CurrentUser, 'table', 'InventoryItem', 'column', 'PlaceName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '货架Id',
   'user', @CurrentUser, 'table', 'InventoryItem', 'column', 'ShelfId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '货架名称',
   'user', @CurrentUser, 'table', 'InventoryItem', 'column', 'ShelfName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '货品Id',
   'user', @CurrentUser, 'table', 'InventoryItem', 'column', 'ItemId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '货品名称',
   'user', @CurrentUser, 'table', 'InventoryItem', 'column', 'ItemName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '货品条码',
   'user', @CurrentUser, 'table', 'InventoryItem', 'column', 'ItemBarCode'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '货品批次',
   'user', @CurrentUser, 'table', 'InventoryItem', 'column', 'ItemBatchNo'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '货品生产日期',
   'user', @CurrentUser, 'table', 'InventoryItem', 'column', 'ItemProductionDate'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '货品有效期',
   'user', @CurrentUser, 'table', 'InventoryItem', 'column', 'ItemExpiringDate'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '货品保质期',
   'user', @CurrentUser, 'table', 'InventoryItem', 'column', 'ItemPeriod'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '批次Id',
   'user', @CurrentUser, 'table', 'InventoryItem', 'column', 'BatchId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '存货数量',
   'user', @CurrentUser, 'table', 'InventoryItem', 'column', 'Qty'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '入库日期',
   'user', @CurrentUser, 'table', 'InventoryItem', 'column', 'DateEntered'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '入库人Id',
   'user', @CurrentUser, 'table', 'InventoryItem', 'column', 'AddedId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '入库人名称',
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
   '商品表',
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
   '商品编码',
   'user', @CurrentUser, 'table', 'Item', 'column', 'ItemCode'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '商品名称',
   'user', @CurrentUser, 'table', 'Item', 'column', 'ItemName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '商品类别',
   'user', @CurrentUser, 'table', 'Item', 'column', 'ItemType'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '产品基本副标题',
   'user', @CurrentUser, 'table', 'Item', 'column', 'SubTitle'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '品牌',
   'user', @CurrentUser, 'table', 'Item', 'column', 'Brand'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '规格',
   'user', @CurrentUser, 'table', 'Item', 'column', 'Specification'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '条形码',
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
   '颜色',
   'user', @CurrentUser, 'table', 'Item', 'column', 'Color'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '样式',
   'user', @CurrentUser, 'table', 'Item', 'column', 'Style'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '长',
   'user', @CurrentUser, 'table', 'Item', 'column', 'Long'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '宽',
   'user', @CurrentUser, 'table', 'Item', 'column', 'Wide'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '高',
   'user', @CurrentUser, 'table', 'Item', 'column', 'High'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '单品毛重',
   'user', @CurrentUser, 'table', 'Item', 'column', 'NetWeight'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '计量单位',
   'user', @CurrentUser, 'table', 'Item', 'column', 'MeasureUnit'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '箱规',
   'user', @CurrentUser, 'table', 'Item', 'column', 'CartonSpec'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '产地',
   'user', @CurrentUser, 'table', 'Item', 'column', 'Producer'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '包装类型',
   'user', @CurrentUser, 'table', 'Item', 'column', 'Packages'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '保质天数',
   'user', @CurrentUser, 'table', 'Item', 'column', 'Guarantee'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '是否保质期管理',
   'user', @CurrentUser, 'table', 'Item', 'column', 'IsGuarantee'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '产品批次类型',
   'user', @CurrentUser, 'table', 'Item', 'column', 'BatchType'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '创建日期',
   'user', @CurrentUser, 'table', 'Item', 'column', 'DateCreated'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '创建人Id',
   'user', @CurrentUser, 'table', 'Item', 'column', 'CreatedId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '创建人名称',
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
   '模块表',
   'user', @CurrentUser, 'table', 'Module'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '模块Id',
   'user', @CurrentUser, 'table', 'Module', 'column', 'Id'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '上级Id',
   'user', @CurrentUser, 'table', 'Module', 'column', 'ParentId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '模块名称',
   'user', @CurrentUser, 'table', 'Module', 'column', 'Name'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '模块标题',
   'user', @CurrentUser, 'table', 'Module', 'column', 'Title'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '模块路径',
   'user', @CurrentUser, 'table', 'Module', 'column', 'Url'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '是否激活',
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
   '应付往来帐',
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
   '货位',
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
   '货位名称',
   'user', @CurrentUser, 'table', 'Place', 'column', 'PlaceName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '仓库Id',
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
   '包含入库、退货、出库、调拨',
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
   '采购订单',
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
   '供应商Id',
   'user', @CurrentUser, 'table', 'PurchaseOrder', 'column', 'SupplyId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '供应商名称',
   'user', @CurrentUser, 'table', 'PurchaseOrder', 'column', 'SupplyName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '货品Id',
   'user', @CurrentUser, 'table', 'PurchaseOrder', 'column', 'ItemId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '货品名称',
   'user', @CurrentUser, 'table', 'PurchaseOrder', 'column', 'ItemName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '采购日期',
   'user', @CurrentUser, 'table', 'PurchaseOrder', 'column', 'DatePurchased'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '采购数量',
   'user', @CurrentUser, 'table', 'PurchaseOrder', 'column', 'Count'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '采购单价',
   'user', @CurrentUser, 'table', 'PurchaseOrder', 'column', 'Price'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '采购金额',
   'user', @CurrentUser, 'table', 'PurchaseOrder', 'column', 'Amount'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '添加人Id',
   'user', @CurrentUser, 'table', 'PurchaseOrder', 'column', 'AddedId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '添加人名称',
   'user', @CurrentUser, 'table', 'PurchaseOrder', 'column', 'AddedName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '添加日期',
   'user', @CurrentUser, 'table', 'PurchaseOrder', 'column', 'DateAdded'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '采购计划Ids',
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
   '采购计划',
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
   '客户Id',
   'user', @CurrentUser, 'table', 'PurchasePlan', 'column', 'ClientId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '客户名称',
   'user', @CurrentUser, 'table', 'PurchasePlan', 'column', 'ClientName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '货品Id',
   'user', @CurrentUser, 'table', 'PurchasePlan', 'column', 'ItemId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '货品名称',
   'user', @CurrentUser, 'table', 'PurchasePlan', 'column', 'ItemName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '采购日期',
   'user', @CurrentUser, 'table', 'PurchasePlan', 'column', 'DatePurchased'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '采购数量',
   'user', @CurrentUser, 'table', 'PurchasePlan', 'column', 'Count'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '采购单价',
   'user', @CurrentUser, 'table', 'PurchasePlan', 'column', 'Price'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '采购金额',
   'user', @CurrentUser, 'table', 'PurchasePlan', 'column', 'Amount'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '添加人Id',
   'user', @CurrentUser, 'table', 'PurchasePlan', 'column', 'AddedId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '添加人名称',
   'user', @CurrentUser, 'table', 'PurchasePlan', 'column', 'AddedName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '添加日期',
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
   '采购运输',
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
   '应收往来帐',
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
   '销售订单',
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
   '包括：出库、退货、换货、调拨',
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
   '销售运输',
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
   '货架',
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
   '货架名称',
   'user', @CurrentUser, 'table', 'Shelf', 'column', 'ShelfName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '货位Id',
   'user', @CurrentUser, 'table', 'Shelf', 'column', 'PlaceId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '货仓Id',
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
   '仓库',
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
   '仓库名称',
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
   '仓库变动表',
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
   '变动类型',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'Type'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '单据号码',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'BillNo'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '仓库Id',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'StockId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '仓库名称',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'StockName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '货位Id',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'PlaceId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '货位名称',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'PlaceName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '货架Id',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'ShelfId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '货架名称',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'ShelfName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '货品Id',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'ItemId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '货品名称',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'ItemName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '货品条码',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'ItemBarCode'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '批次Id',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'BatchId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '本期数量',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'Qty'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '上期数量',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'PreQty'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '本期加减',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'Operation'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '本期余数',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'Balance'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '变动日期',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'DateEntered'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '变动人Id',
   'user', @CurrentUser, 'table', 'StockChange', 'column', 'AddedId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '变动人名称',
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
   '仓库运输',
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
   '供应商表',
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
   '供应商名称',
   'user', @CurrentUser, 'table', 'Supply', 'column', 'SupplyName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '联系电话',
   'user', @CurrentUser, 'table', 'Supply', 'column', 'Tel'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '联系人',
   'user', @CurrentUser, 'table', 'Supply', 'column', 'Contact'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '创建日期',
   'user', @CurrentUser, 'table', 'Supply', 'column', 'DateCreated'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '创建人Id',
   'user', @CurrentUser, 'table', 'Supply', 'column', 'CreatedId'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '创建人名称',
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
   '用户表',
   'user', @CurrentUser, 'table', 'User'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '用户Id',
   'user', @CurrentUser, 'table', 'User', 'column', 'Id'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '登录名',
   'user', @CurrentUser, 'table', 'User', 'column', 'Login'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '密码',
   'user', @CurrentUser, 'table', 'User', 'column', 'Password'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '姓名',
   'user', @CurrentUser, 'table', 'User', 'column', 'Name'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '职位',
   'user', @CurrentUser, 'table', 'User', 'column', 'Position'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '所在城市',
   'user', @CurrentUser, 'table', 'User', 'column', 'City'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '所在办公室',
   'user', @CurrentUser, 'table', 'User', 'column', 'Office'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '电话',
   'user', @CurrentUser, 'table', 'User', 'column', 'Tel'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '传真',
   'user', @CurrentUser, 'table', 'User', 'column', 'Fax'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '邮箱',
   'user', @CurrentUser, 'table', 'User', 'column', 'Email'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '性别',
   'user', @CurrentUser, 'table', 'User', 'column', 'Gender'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '出生年月',
   'user', @CurrentUser, 'table', 'User', 'column', 'Birthday'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '是否激活',
   'user', @CurrentUser, 'table', 'User', 'column', 'IsActive'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '是否休假',
   'user', @CurrentUser, 'table', 'User', 'column', 'IsHoliday'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '休假代理人',
   'user', @CurrentUser, 'table', 'User', 'column', 'AgentID'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '代理人名称',
   'user', @CurrentUser, 'table', 'User', 'column', 'AgentName'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '代理开始日期',
   'user', @CurrentUser, 'table', 'User', 'column', 'AgentBegin'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '代理结束日期',
   'user', @CurrentUser, 'table', 'User', 'column', 'AgentEnd'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '个人设置',
   'user', @CurrentUser, 'table', 'User', 'column', 'Profile'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '成本中心',
   'user', @CurrentUser, 'table', 'User', 'column', 'CostCenter'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '级别',
   'user', @CurrentUser, 'table', 'User', 'column', 'Level'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '预留字段1',
   'user', @CurrentUser, 'table', 'User', 'column', 'Reserve1'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '预留字段2',
   'user', @CurrentUser, 'table', 'User', 'column', 'Reserve2'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '预留字段3',
   'user', @CurrentUser, 'table', 'User', 'column', 'Reserve3'
go

declare @CurrentUser sysname
select @CurrentUser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   '预留字段4',
   'user', @CurrentUser, 'table', 'User', 'column', 'Reserve4'
go

