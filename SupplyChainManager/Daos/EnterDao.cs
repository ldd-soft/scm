using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SupplyChainManager.Models;
using System.Configuration;
using System.Linq.Expressions;
using System.Data.Linq;

namespace SupplyChainManager.Daos
{
    public class EnterDao
    {
        private SupplyChainManagerDataContext db = new SupplyChainManagerDataContext();

        public List<Enter> FindByPage(Page<Enter> page, ref int count)
        {
            List<Enter> result = new List<Enter>();
            if (page.Params.Count > 0)
            {
                Expression<Func<Enter, bool>> searchPredicate = PredicateExtensions.True<Enter>();
                string type = page.Params.ContainsKey("type") ? page.Params["type"] : "";
                foreach (var param in page.Params)
                {
                    switch (param.Key)
                    {
                        case "query":
                            string query = param.Value;
                            if (type == "明细")
                            {
                                List<int?> ids = db.EnterItem.Where(i => i.ItemId.ToString().Contains(query) || i.ItemNo.Contains(query) || i.ItemName.Contains(query) || i.MissProcess.Contains(query) || i.Remark.Contains(query)).Select(i => i.EnterId).ToList();
                                searchPredicate = searchPredicate.And(s => ids.Contains(s.Id));
                            }
                            else
                            {
                                searchPredicate = searchPredicate.And(s => s.Id.ToString().Contains(query) || s.EnterType.Contains(query) || s.RecordName.Contains(query) || s.StoreName.Contains(query) || s.CheckName.Contains(query) || s.AddName.Contains(query) || s.DeliverType.Contains(query) || s.DeliverName.Contains(query) || s.DeliverContact.Contains(query) || s.DeliverTel.Contains(query) || s.DeliverPayType.Contains(query) || s.Remark.Contains(query) || s.PurchaseId.ToString().Contains(query));
                            }

                            break;
                        case "date_from":
                            DateTime date_from = DateTime.Parse(param.Value);
                            if (type == "明细")
                            {
                                List<int?> ids = db.EnterItem.Where(i => i.DateProduct.HasValue && i.DateProduct.Value >= date_from).Select(i => i.EnterId).ToList();
                                searchPredicate = searchPredicate.And(s => ids.Contains(s.Id));
                            }
                            else
                            {
                                searchPredicate = searchPredicate.And(p => p.DateAdded.HasValue && p.DateAdded.Value >= date_from);
                            }
                            break;
                        case "date_to":
                            DateTime date_to = DateTime.Parse(param.Value);
                            if (type == "明细")
                            {
                                List<int?> ids = db.EnterItem.Where(i => i.DateProduct.HasValue && i.DateProduct.Value <= date_to).Select(i => i.EnterId).ToList();
                                searchPredicate = searchPredicate.And(s => ids.Contains(s.Id));
                            }
                            else
                            {
                                searchPredicate = searchPredicate.And(p => p.DateAdded.HasValue && p.DateAdded.Value <= date_to);
                            }
                            break;
                    }
                }
                result = db.Enter.Where(searchPredicate).ToList();
            }
            else
            {
                result = db.Enter.ToList();
            }
            count = result.Count;
            result = result.OrderByDescending(o => o.Id).Skip(page.Start).Take(page.Limit).ToList();
            return result;
        }

        public int Create(Enter enter)
        {
            ChangeItemEnterStock(enter);
            ChangeItemEnterBatch(enter);
            List<int> ids = new List<int>();
            if (enter.EnterType == "采购入库")
            {
                ChangePurchseItem(enter, ids);
            }
            db.Enter.InsertOnSubmit(enter);
            db.SubmitChanges();
            if (enter.EnterType == "采购入库")
            {
                ChangePurchase(ids);
            }
            return enter.Id;
        }

        private void ChangePurchase(List<int> ids)
        {
            foreach (var id in ids)
            {
                Purchase purchase = db.Purchase.Where(p => p.Id == id).FirstOrDefault();
                int missCount = purchase.PurchaseItem.Where(i => i.QuantityMiss == 0).Count();
                int processCount = purchase.PurchaseItem.Where(i => i.MissProcess != null && i.MissProcess.Contains("完成")).Count();
                if (missCount + processCount == purchase.PurchaseItem.Count)
                {
                    purchase.Status = "待结算";
                }
            }
            db.SubmitChanges();
        }

        private void ChangePurchseItem(Enter enter, List<int> ids)
        {
            foreach (var enterItem in enter.EnterItem)
            {
                PurchaseItem purchaseItem = db.PurchaseItem.Where(i => i.Id == enterItem.RecordId).FirstOrDefault();
                if (purchaseItem != null)
                {
                    purchaseItem.QuantityReal = (purchaseItem.QuantityReal ?? 0) + enterItem.QuantityReal;
                    purchaseItem.AmountReal = (purchaseItem.Promotion ?? purchaseItem.Price) * purchaseItem.QuantityReal;
                    purchaseItem.QuantityMiss = purchaseItem.Quantity - purchaseItem.QuantityReal;
                    purchaseItem.AmountMiss = (purchaseItem.Promotion ?? purchaseItem.Price) * purchaseItem.QuantityMiss;
                    purchaseItem.MissProcess = enterItem.MissProcess;

                    if (!ids.Contains(purchaseItem.PurchaseId.Value))
                    {
                        ids.Add(purchaseItem.PurchaseId.Value);
                    }
                }
            }
        }

        private void ChangeItemEnterBatch(Enter enter)
        {
            foreach (var enterItem in enter.EnterItem)
            {
                StockBatch lastest = db.StockBatch.Where(s => s.ItemId == enterItem.ItemId && s.StoreId == enterItem.StoreId && s.DateProduct == enterItem.DateProduct).OrderByDescending(s => s.DateEnter).FirstOrDefault();
                StockBatch stockBatch = new StockBatch();
                stockBatch.StoreId = enterItem.StoreId;
                stockBatch.StoreName = enterItem.StoreName;
                stockBatch.ItemId = enterItem.ItemId;
                stockBatch.ItemName = enterItem.ItemName;
                stockBatch.BatchNo = (lastest == null ? DateTime.Now.ToString("yyyyMMddhhmmssffff") : lastest.BatchNo);
                stockBatch.DateProduct = enterItem.DateProduct;
                Item item = db.Item.Where(i => i.Id == enterItem.ItemId).FirstOrDefault();
                stockBatch.Guarantee = item.Guarantee;
                stockBatch.InitCount = (lastest == null ? 0 : lastest.RealCount);
                stockBatch.EnterType = enter.EnterType;
                stockBatch.DateEnter = DateTime.Now;
                stockBatch.EnterCount = enterItem.QuantityReal;
                stockBatch.ExitType = "";
                stockBatch.ExitCount = 0;
                stockBatch.DateExit = null;
                stockBatch.RealCount = stockBatch.InitCount + stockBatch.EnterCount - stockBatch.ExitCount;
                stockBatch.TableName = "EnterItem";
                stockBatch.RecordGuid = enterItem.Guid;
                db.StockBatch.InsertOnSubmit(stockBatch);
            }
        }

        private void ChangeItemEnterStock(Enter enter)
        {
            foreach (var enterItem in enter.EnterItem)
            {
                ItemStock lastest = db.ItemStock.Where(s => s.ItemId == enterItem.ItemId && s.StoreId == enterItem.StoreId).OrderByDescending(s => s.DateEnter).FirstOrDefault();
                ItemStock itemStock = new ItemStock();
                itemStock.StoreId = enterItem.StoreId;
                itemStock.StoreName = enterItem.StoreName;
                itemStock.ItemId = enterItem.ItemId;
                itemStock.ItemName = enterItem.ItemName;
                itemStock.InitCount = (lastest == null ? 0 : lastest.RealCount);
                itemStock.InitPrice = 0;
                itemStock.InitAmount = (lastest == null ? 0 : lastest.RealAmount);
                itemStock.EnterType = enter.EnterType;
                itemStock.DateEnter = DateTime.Now;
                itemStock.EnterCount = enterItem.QuantityReal;
                itemStock.EnterPrice = enterItem.Price;
                itemStock.EnterAmount = enterItem.Price * enterItem.QuantityReal;
                itemStock.ExitType = "";
                itemStock.ExitCount = 0;
                itemStock.ExitPrice = 0;
                itemStock.ExitAmount = 0;
                itemStock.DateExit = null;
                itemStock.RealCount = itemStock.InitCount + itemStock.EnterCount - itemStock.ExitCount;
                itemStock.RealAmount = itemStock.InitAmount + itemStock.EnterAmount - itemStock.ExitAmount;
                itemStock.TableName = "EnterItem";
                string guid = Guid.NewGuid().ToString();
                enterItem.Guid = guid;
                itemStock.RecordGuid = guid;
                db.ItemStock.InsertOnSubmit(itemStock);
            }
        }

        public bool Delete(int id)
        {
            bool result = false;
            Enter enter = db.Enter.Where(u => u.Id == id).FirstOrDefault();
            db.Enter.DeleteOnSubmit(enter);
            try
            {
                db.SubmitChanges();
                result = true;
            }
            catch (Exception ex) { }
            return result;
        }

        public bool Update()
        {
            bool result = false;
            try
            {
                db.SubmitChanges();
                result = true;
            }
            catch (Exception ex) { }
            return result;
        }

        public Enter FindById(int id)
        {
            return db.Enter.SingleOrDefault(c => c.Id == id);
        }

        internal void DeleteItems(EntitySet<EnterItem> items)
        {
            db.EnterItem.DeleteAllOnSubmit(items);
        }

        public List<PurchaseItemView> ListEnterItem(Page<PurchaseItemView> page, ref int count)
        {
            List<PurchaseItemView> result = new List<PurchaseItemView>();
            Expression<Func<PurchaseItemView, bool>> searchPredicate = PredicateExtensions.True<PurchaseItemView>();
            searchPredicate = searchPredicate.And(s => s.Status == "待入库" && (s.QuantityReal != s.Quantity || !s.MissProcess.Contains("完成")));
            if (page.Params.Count > 0)
            {
                foreach (var param in page.Params)
                {
                    switch (param.Key)
                    {
                        case "query":
                            string query = param.Value;
                            searchPredicate = searchPredicate.And(s => s.ItemName.Contains(query) || s.Code.Contains(query) || s.Barcode.Contains(query));
                            break;
                        case "brand":
                            string brand = param.Value;
                            searchPredicate = searchPredicate.And(s => s.Brand == brand);
                            break;
                        case "supply_id":
                            int supply_id = int.Parse(param.Value);
                            searchPredicate = searchPredicate.And(s => s.SupplyId == supply_id);
                            break;

                    }
                }
            }
            result = db.PurchaseItemView.Where(searchPredicate).ToList();
            count = result.Count;
            result = result.OrderByDescending(o => o.Id).Skip(page.Start).Take(page.Limit).ToList();
            return result;
        }

        public List<Purchase> ListPurchase(Page<Purchase> page, ref int count)
        {
            List<Purchase> result = new List<Purchase>();
            Expression<Func<Purchase, bool>> searchPredicate = PredicateExtensions.True<Purchase>();
            searchPredicate = searchPredicate.And(s => s.Status == "待入库");
            if (page.Params.Count > 0)
            {
                foreach (var param in page.Params)
                {
                    switch (param.Key)
                    {
                        case "supply_id":
                            int supply_id = int.Parse(param.Value);
                            searchPredicate = searchPredicate.And(s => s.SupplyId == supply_id);
                            break;

                    }
                }
            }
            result = db.Purchase.Where(searchPredicate).ToList();
            count = result.Count;
            result = result.OrderByDescending(o => o.Id).Skip(page.Start).Take(page.Limit).ToList();
            return result;
        }

        public IQueryable<PurchaseItem> FindItemById(int id)
        {
            return db.PurchaseItem.Where(i => i.PurchaseId == id && i.QuantityReal != i.Quantity && (i.MissProcess == null || i.MissProcess.Contains("完成")));
        }
    }
}