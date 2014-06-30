-- 2014.5.21 添加"查询商品库存"函数
create function GetItemSumStock()
returns table
return 
select s.ItemId, SUM(s.RealCount) as RealCount from (select StoreId, ItemId, MAX(DateEnter) as DateEnter from ItemStock group by StoreId, ItemId) g inner join ItemStock s on g.StoreId = s.StoreId and g.ItemId = s.ItemId and g.DateEnter = s.DateEnter group by s.ItemId
-- 2014.5.21 添加"商品实时库存"视图
-- 2014.6.19 修改视图，使用左连接
CREATE VIEW [dbo].[ItemStockView]
AS
SELECT     dbo.Item.*, GetItemSumStock_1.RealCount
FROM         dbo.Item LEFT JOIN
                      dbo.GetItemSumStock() AS GetItemSumStock_1 ON dbo.Item.Id = GetItemSumStock_1.ItemId

-- 2014.5.25 添加"查询商品批次库存"函数
-- 2014.6.19 修改函数，增加效期计算
create function GetItemBatchStock()
returns table
return 
select s.Id as BatchId, s.BatchNo, s.StoreId, s.StoreName, s.DateProduct, ROUND(CAST(DATEDIFF(day, '2014-06-01', getdate()) as FLOAT )/ s.Guarantee, 2) as ValidDate, s.ItemId, s.RealCount from (select StoreId, ItemId, dateproduct, MAX(DateEnter) as DateEnter from StockBatch group by StoreId, ItemId, dateproduct) g inner join StockBatch s on g.StoreId = s.StoreId and g.ItemId = s.ItemId and g.dateproduct = s.dateproduct and g.DateEnter = s.DateEnter 

-- 2014.5.25 添加"商品实时批次库存"视图
-- 2014.6.19 修改视图，增加效期等
CREATE VIEW [dbo].[ItemBatchStockView]
AS
SELECT     dbo.Item.Id AS ItemId, dbo.Item.ItemName, dbo.Item.Code, dbo.Item.ItemType, dbo.Item.SubTitle, dbo.Item.Brand, dbo.Item.Spec, dbo.Item.Barcode, dbo.Item.Color, 
                      dbo.Item.Style, dbo.Item.Long, dbo.Item.Wide, dbo.Item.High, dbo.Item.NetWeight, dbo.Item.Unit, dbo.Item.BoxCount, dbo.Item.Producer, dbo.Item.Packages, 
                      dbo.Item.Guarantee, dbo.Item.IsGuarantee, dbo.Item.BatchType, dbo.Item.DateCreated, dbo.Item.CreatedId, dbo.Item.CreatedName, dbo.Item.IsStoped, 
                      dbo.Item.LimitCount, GetItemBatchStock_1.BatchId AS Id, GetItemBatchStock_1.BatchNo, GetItemBatchStock_1.StoreId, GetItemBatchStock_1.StoreName, 
                      GetItemBatchStock_1.DateProduct, GetItemBatchStock_1.RealCount, GetItemBatchStock_1.ValidDate
FROM         dbo.Item INNER JOIN
                      dbo.GetItemBatchStock() AS GetItemBatchStock_1 ON dbo.Item.Id = GetItemBatchStock_1.ItemId

-- 2014.5.26 添加"采购明细"视图
CREATE VIEW [dbo].[PurchaseItemView]
AS
SELECT     dbo.PurchaseItem.*, dbo.Purchase.SupplyId, dbo.Purchase.SupplyName, dbo.Purchase.SupplyType, dbo.Purchase.AddId, dbo.Purchase.AddName, 
                      dbo.Purchase.DateAdded, dbo.Purchase.Status, dbo.Item.Brand, dbo.Item.Code
FROM         dbo.Purchase INNER JOIN
                      dbo.PurchaseItem ON dbo.Purchase.Id = dbo.PurchaseItem.PurchaseId INNER JOIN
                      dbo.Item ON dbo.PurchaseItem.ItemId = dbo.Item.Id

-- 2014.5.26 添加"销售明细"视图
CREATE VIEW [dbo].[SaleItemView]
AS
SELECT     dbo.SaleItem.*, dbo.Sale.ClientId, dbo.Sale.ClientName, dbo.Sale.AddId, dbo.Sale.AddName, dbo.Sale.DateAdded, dbo.Sale.ClientStore, dbo.Sale.Address, 
                      dbo.Sale.Contact, dbo.Sale.Tel, dbo.Sale.Status, dbo.Item.Code, dbo.Item.Brand
FROM         dbo.Sale INNER JOIN
                      dbo.SaleItem ON dbo.Sale.Id = dbo.SaleItem.SaleId INNER JOIN
                      dbo.Item ON dbo.SaleItem.ItemId = dbo.Item.Id