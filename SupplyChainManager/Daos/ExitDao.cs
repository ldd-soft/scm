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
    public class ExitDao
    {
        private SupplyChainManagerDataContext db = new SupplyChainManagerDataContext();

        public List<Exit> FindByPage(Page<Exit> page, ref int count)
        {
            List<Exit> result = new List<Exit>();
            if (page.Params.Count > 0)
            {
                Expression<Func<Exit, bool>> searchPredicate = PredicateExtensions.True<Exit>();
                foreach (var param in page.Params)
                {
                    switch (param.Key)
                    {
                        case "query":
                            string query = param.Value;
                            searchPredicate = searchPredicate.And(s => s.RecordName.Contains(query) || s.DeliverName.Contains(query));
                            break;
                    }
                }
                result = db.Exit.Where(searchPredicate).ToList();
            }
            else
            {
                result = db.Exit.ToList();
            }
            count = result.Count;
            result = result.OrderByDescending(o => o.Id).Skip(page.Start).Take(page.Limit).ToList();
            return result;
        }

        public int Create(Exit exit)
        {
            ChangeItemExitStock(exit);
            ChangeItemExitBatch(exit);
            List<int> ids = new List<int>();
            if (exit.ExitType == "销售出库")
            {
                ChangeSaleItem(exit, ids);
            }
            db.Exit.InsertOnSubmit(exit);
            db.SubmitChanges();
            if (exit.ExitType == "销售出库")
            {
                ChangeSale(ids);
            }
            return exit.Id;
        }

        private void ChangeSale(List<int> ids)
        {
            foreach (var id in ids)
            {
                Sale sale = db.Sale.Where(p => p.Id == id).FirstOrDefault();
                int missCount = sale.SaleItem.Where(i => i.QuantityMiss == 0).Count();
                int processCount = sale.SaleItem.Where(i => i.MissProcess != null && i.MissProcess.Contains("完成")).Count();
                if (missCount + processCount == sale.SaleItem.Count)
                {
                    sale.Status = "待结算";
                }
            }
            db.SubmitChanges();
        }

        private void ChangeSaleItem(Exit exit, List<int> ids)
        {
            foreach (var exitItem in exit.ExitItem)
            {
                SaleItem saleItem = db.SaleItem.Where(i => i.Id == exitItem.RecordId).FirstOrDefault();
                if (saleItem != null)
                {
                    saleItem.QuantityReal = (saleItem.QuantityReal ?? 0) + exitItem.QuantityReal;
                    saleItem.AmountReal = (saleItem.Promotion ?? saleItem.Price) * saleItem.QuantityReal;
                    saleItem.QuantityMiss = saleItem.Quantity - saleItem.QuantityReal;
                    saleItem.AmountMiss = (saleItem.Promotion ?? saleItem.Price) * saleItem.QuantityMiss;
                    if (!ids.Contains(saleItem.SaleId.Value))
                    {
                        ids.Add(saleItem.SaleId.Value);
                    }
                }
            }
        }

        private void ChangeItemExitBatch(Exit exit)
        {
            foreach (var exitItem in exit.ExitItem)
            {
                StockBatch lastest = db.StockBatch.Where(s => s.Id == exitItem.BatchId).OrderByDescending(s => s.DateExit).FirstOrDefault();
                StockBatch stockBatch = new StockBatch();
                stockBatch.StoreId = exitItem.StoreId;
                stockBatch.StoreName = exitItem.StoreName;
                stockBatch.ItemId = exitItem.ItemId;
                stockBatch.ItemName = exitItem.ItemName;
                stockBatch.BatchNo = (lastest == null ? "" : lastest.BatchNo);
                stockBatch.DateProduct = exitItem.DateProduct;
                stockBatch.Guarantee = (lastest == null ? 365 : lastest.Guarantee);
                stockBatch.InitCount = (lastest == null ? 0 : lastest.RealCount);
                stockBatch.EnterType = "";
                stockBatch.DateEnter = DateTime.Now;
                stockBatch.EnterCount = 0;
                stockBatch.ExitType = exit.ExitType;
                stockBatch.DateExit = DateTime.Now;
                stockBatch.ExitCount = exitItem.QuantityReal;
                stockBatch.RealCount = stockBatch.InitCount + stockBatch.EnterCount - stockBatch.ExitCount;
                stockBatch.TableName = "ExitItem";
                stockBatch.RecordGuid = exitItem.Guid;
                db.StockBatch.InsertOnSubmit(stockBatch);
            }
        }

        private void ChangeItemExitStock(Exit exit)
        {
            foreach (var exitItem in exit.ExitItem)
            {
                ItemStock lastest = db.ItemStock.Where(s => s.ItemId == exitItem.ItemId && s.StoreId == exitItem.StoreId).OrderByDescending(s => s.DateEnter).FirstOrDefault();
                ItemStock itemStock = new ItemStock();
                itemStock.StoreId = exitItem.StoreId;
                itemStock.StoreName = exitItem.StoreName;
                itemStock.ItemId = exitItem.ItemId;
                itemStock.ItemName = exitItem.ItemName;
                itemStock.InitCount = (lastest == null ? 0 : lastest.RealCount);
                itemStock.InitPrice = 0;
                itemStock.InitAmount = (lastest == null ? 0 : lastest.RealAmount);
                itemStock.EnterType = "";
                itemStock.DateEnter = DateTime.Now;
                itemStock.EnterCount = 0;
                itemStock.EnterPrice = 0;
                itemStock.EnterAmount = 0;
                itemStock.ExitType = exit.ExitType;
                itemStock.ExitCount = exitItem.QuantityReal;
                itemStock.ExitPrice = exitItem.Price;
                itemStock.ExitAmount = exitItem.Price * exitItem.QuantityReal;
                itemStock.DateExit = DateTime.Now;
                itemStock.RealCount = itemStock.InitCount + itemStock.EnterCount - itemStock.ExitCount;
                itemStock.RealAmount = itemStock.InitAmount + itemStock.EnterAmount - itemStock.ExitAmount;
                itemStock.TableName = "ExitItem";
                string guid = Guid.NewGuid().ToString();
                exitItem.Guid = guid;
                itemStock.RecordGuid = guid;
                db.ItemStock.InsertOnSubmit(itemStock);
            }
        }

        public bool Delete(int id)
        {
            bool result = false;
            Exit exit = db.Exit.Where(u => u.Id == id).FirstOrDefault();
            db.Exit.DeleteOnSubmit(exit);
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

        public Exit FindById(int id)
        {
            return db.Exit.SingleOrDefault(c => c.Id == id);
        }

        internal void DeleteItems(EntitySet<ExitItem> items)
        {
            db.ExitItem.DeleteAllOnSubmit(items);
        }

        public List<SaleItemView> ListExitItem(Page<SaleItemView> page, ref int count)
        {
            List<SaleItemView> result = new List<SaleItemView>();
            Expression<Func<SaleItemView, bool>> searchPredicate = PredicateExtensions.True<SaleItemView>();
            searchPredicate = searchPredicate.And(s => s.Status == "待出库" && (s.QuantityReal != s.Quantity || !s.MissProcess.Contains("完成")));
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
                        case "client_id":
                            int client_id = int.Parse(param.Value);
                            searchPredicate = searchPredicate.And(s => s.ClientId == client_id);
                            break;
                        case "store_id":
                            int store_id = int.Parse(param.Value);
                            searchPredicate = searchPredicate.And(s => s.StoreId == store_id);
                            break;
                    }
                }
            }
            result = db.SaleItemView.Where(searchPredicate).ToList();
            count = result.Count;
            result = result.OrderByDescending(o => o.Id).Skip(page.Start).Take(page.Limit).ToList();
            return result;
        }
    }
}