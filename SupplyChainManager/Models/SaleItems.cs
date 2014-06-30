using System;

namespace SupplyChainManager.Models
{
    [ExcelSheet(Name = "Sheet1")]
    public class SaleItems : System.ComponentModel.INotifyPropertyChanged
    {
        private int itemId;
        private int quantity;
        private decimal price;

        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;
        public SaleItems()
        {
        }
        protected virtual void SendPropertyChanged(string propertyName)
        {
            System.ComponentModel.PropertyChangedEventHandler handler = PropertyChanged;
            if (handler != null)
            {
                handler(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
            }
        }

        [ExcelColumn(Name = "商品编号", Storage = "itemId")]
        public int ItemId
        {
            get
            {
                return this.itemId;
            }

            set
            {
                this.itemId = value;
                SendPropertyChanged("ItemId");
            }
        }

        [ExcelColumn(Name = "数量", Storage = "quantity")]
        public int Quantity
        {
            get
            {
                return this.quantity;
            }

            set
            {
                this.quantity = value;
                SendPropertyChanged("Quantity");
            }
        }

        [ExcelColumn(Name = "销售价格", Storage = "price")]
        public decimal Price
        {
            get
            {
                return this.price;
            }

            set
            {
                this.price = value;
                SendPropertyChanged("Price");
            }
        }
    }
}
