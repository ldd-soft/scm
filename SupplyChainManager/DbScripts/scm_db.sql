USE [SupplyChainManager]
GO
/****** Object:  Table [dbo].[Orders]    Script Date: 05/14/2014 17:00:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Orders](
	[Id] [int] IDENTITY(5000000,1) NOT NULL,
	[SupplyId] [int] NULL,
	[SupplyName] [varchar](200) NULL,
	[ClientId] [int] NULL,
	[ClientName] [varchar](200) NULL,
	[DateOrder] [datetime] NULL,
	[SupplyType] [varchar](20) NULL,
	[Status] [varchar](20) NULL,
	[AddId] [int] NULL,
	[AddName] [varchar](20) NULL,
	[DateAdded] [datetime] NULL,
	[CheckId] [int] NULL,
	[CheckName] [varchar](20) NULL,
	[DateChecked] [datetime] NULL,
	[ApproveId] [int] NULL,
	[ApproveName] [varchar](20) NULL,
	[DateApproved] [datetime] NULL,
	[Remark] [varchar](1000) NULL,
 CONSTRAINT [PK_ORDERS] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Module]    Script Date: 05/14/2014 17:00:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Module](
	[Id] [varchar](50) NOT NULL,
	[ParentId] [varchar](50) NOT NULL,
	[Name] [varchar](50) NOT NULL,
	[Title] [varchar](50) NOT NULL,
	[Url] [varchar](500) NOT NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_MODULE] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Item]    Script Date: 05/14/2014 17:00:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Item](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ItemCode] [varchar](200) NULL,
	[ItemName] [varchar](200) NULL,
	[ItemType] [varchar](200) NULL,
	[SubTitle] [varchar](200) NULL,
	[Brand] [varchar](200) NULL,
	[Specification] [varchar](200) NULL,
	[BarCode] [varchar](200) NULL,
	[SKU] [varchar](200) NULL,
	[Color] [varchar](200) NULL,
	[Style] [varchar](200) NULL,
	[Long] [decimal](9, 2) NULL,
	[Wide] [decimal](9, 2) NULL,
	[High] [decimal](9, 2) NULL,
	[NetWeight] [decimal](9, 2) NULL,
	[MeasureUnit] [varchar](50) NULL,
	[CartonSpec] [decimal](9, 2) NULL,
	[Producer] [varchar](200) NULL,
	[Packages] [varchar](200) NULL,
	[Guarantee] [int] NULL,
	[IsGuarantee] [bit] NULL,
	[BatchType] [varchar](50) NULL,
	[DateCreated] [datetime] NULL,
	[CreatedId] [int] NULL,
	[CreatedName] [varchar](50) NULL,
 CONSTRAINT [PK_ITEM] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Dictionary]    Script Date: 05/14/2014 17:00:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Dictionary](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Module] [varchar](50) NULL,
	[Field] [varchar](100) NULL,
	[Options] [varchar](max) NULL,
	[OrderNo] [int] NULL,
	[TableName] [varchar](50) NULL,
	[RecordId] [int] NULL,
 CONSTRAINT [PK_DICTIONARY] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[ClientItem]    Script Date: 05/14/2014 17:00:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[ClientItem](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ItemId] [int] NULL,
	[ClientId] [int] NULL,
	[ClientName] [varchar](200) NULL,
	[MarketPrice] [decimal](9, 2) NULL,
	[CostPrice] [decimal](9, 2) NULL,
	[SalePrice] [decimal](9, 2) NULL,
	[ReturnDays] [int] NULL,
	[ExchangeDays] [int] NULL,
	[RepairDays] [int] NULL,
	[MinOrderCount] [int] NULL,
	[SaleType] [varchar](50) NULL,
	[PrepareDays] [int] NULL,
	[SupplyType] [varchar](200) NULL,
	[TaxRate] [decimal](9, 2) NULL,
	[IsOrder] [bit] NULL,
	[SupplyId] [int] NULL,
	[SupplyName] [varchar](200) NULL,
	[DateCreated] [datetime] NULL,
	[CreatedId] [int] NULL,
	[CreatedName] [varchar](50) NULL,
 CONSTRAINT [PK_CLIENTITEM] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Client]    Script Date: 05/14/2014 17:00:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Client](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ClientName] [varchar](200) NULL,
	[Tel] [varchar](200) NULL,
	[Contact] [varchar](200) NULL,
 CONSTRAINT [PK_CLIENT] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[User]    Script Date: 05/14/2014 17:00:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[User](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Login] [varchar](50) NULL,
	[Password] [varchar](200) NULL,
	[Name] [varchar](50) NULL,
	[Position] [varchar](50) NULL,
	[City] [varchar](20) NULL,
	[Office] [varchar](20) NULL,
	[Tel] [varchar](50) NULL,
	[Fax] [varchar](20) NULL,
	[Email] [varchar](20) NULL,
	[Gender] [varchar](20) NULL,
	[Birthday] [datetime] NULL,
	[IsActive] [bit] NULL,
	[IsHoliday] [bit] NULL,
	[AgentID] [int] NULL,
	[AgentName] [varchar](50) NULL,
	[AgentBegin] [datetime] NULL,
	[AgentEnd] [datetime] NULL,
	[Profile] [varchar](max) NULL,
	[CostCenter] [varchar](50) NULL,
	[Level] [int] NULL,
	[Reserve1] [int] NULL,
	[Reserve2] [varchar](200) NULL,
	[Reserve3] [varchar](200) NULL,
	[Reserve4] [varchar](200) NULL,
 CONSTRAINT [PK_USER] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Supply]    Script Date: 05/14/2014 17:00:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Supply](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[SupplyName] [varchar](200) NULL,
	[Tel] [varchar](200) NULL,
	[Contact] [varchar](200) NULL,
 CONSTRAINT [PK_SUPPLY] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Sale]    Script Date: 05/14/2014 17:00:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Sale](
	[Id] [int] NOT NULL,
	[OrderId] [int] NULL,
	[PoNo] [varchar](50) NULL,
	[StoreId] [int] NULL,
	[StoreName] [varchar](50) NULL,
	[Address] [varchar](500) NULL,
	[Contact] [varchar](50) NULL,
	[Tel] [varchar](50) NULL,
	[ItemId] [int] NULL,
	[ItemName] [varchar](150) NULL,
	[ItemNo] [varchar](50) NULL,
	[Barcode] [varchar](50) NULL,
	[Spec] [varchar](50) NULL,
	[Unit] [varchar](50) NULL,
	[Quantity] [int] NULL,
	[SalePrice] [decimal](14, 4) NULL,
	[SaleDiscount] [decimal](14, 4) NULL,
	[SaleAmount] [decimal](14, 4) NULL,
	[QuantitySent] [int] NULL,
	[AmountSent] [decimal](14, 4) NULL,
	[QuantityMiss] [int] NULL,
	[AmountMiss] [decimal](14, 4) NULL,
	[MissProcess] [varchar](1000) NULL,
	[Remark] [varchar](1000) NULL,
 CONSTRAINT [PK_SALE] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Purchase]    Script Date: 05/14/2014 17:00:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Purchase](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[OrderId] [int] NULL,
	[PoNo] [varchar](50) NULL,
	[ItemId] [int] NULL,
	[ItemName] [varchar](150) NULL,
	[ItemNo] [varchar](50) NULL,
	[Barcode] [varchar](50) NULL,
	[Spec] [varchar](50) NULL,
	[Unit] [varchar](50) NULL,
	[Quantity] [int] NULL,
	[PurchasePrice] [decimal](14, 4) NULL,
	[PurchaseDiscount] [decimal](14, 4) NULL,
	[PurchaseAmount] [decimal](14, 4) NULL,
	[QuantityReceived] [int] NULL,
	[AmountReceived] [decimal](14, 4) NULL,
	[QuantityMiss] [int] NULL,
	[AmountMiss] [decimal](14, 4) NULL,
	[MissProcess] [varchar](1000) NULL,
	[Remark] [varchar](1000) NULL,
 CONSTRAINT [PK_PURCHASE] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  ForeignKey [FK_PURCHASE_REFERENCE_ORDERS]    Script Date: 05/14/2014 17:00:40 ******/
ALTER TABLE [dbo].[Purchase]  WITH CHECK ADD  CONSTRAINT [FK_PURCHASE_REFERENCE_ORDERS] FOREIGN KEY([OrderId])
REFERENCES [dbo].[Orders] ([Id])
GO
ALTER TABLE [dbo].[Purchase] CHECK CONSTRAINT [FK_PURCHASE_REFERENCE_ORDERS]
GO
/****** Object:  ForeignKey [FK_SALE_REFERENCE_ORDERS]    Script Date: 05/14/2014 17:00:40 ******/
ALTER TABLE [dbo].[Sale]  WITH CHECK ADD  CONSTRAINT [FK_SALE_REFERENCE_ORDERS] FOREIGN KEY([OrderId])
REFERENCES [dbo].[Orders] ([Id])
GO
ALTER TABLE [dbo].[Sale] CHECK CONSTRAINT [FK_SALE_REFERENCE_ORDERS]
GO
