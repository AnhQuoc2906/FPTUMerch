CREATE DATABASE FPTUMerch;

CREATE TABLE Role( -- Dùng để xác định vai trò của người đăng nhập
	RoleID nvarchar(255) not null Primary key,
	RoleName nvarchar(256) not null,
	RoleDescription nvarchar(max) null,
);

CREATE TABLE Users( -- Dành cho nhân viên sale/Admin Page
	UserID nvarchar(255) not null Primary key,
	FullName nvarchar(256) not null,
	Email nvarchar(255) not null,
	Password nvarchar(255) not null,
	Note nvarchar(255) null,
	RoleID nvarchar(255) not null FOREIGN KEY References Role(RoleID)
)

CREATE TABLE DiscountCode( -- Lưu trữ mã giảm giá và xác nhận đã xài bao nhiêu lần
	DiscountCodeID nvarchar(12) not null Primary Key, -- Mã
	Status bit not null, -- Mã có hoạt động không
	NumberOfTimes int not null, -- Số lượng người đã sử dụng mã này
)

CREATE TABLE Orders( -- Thông tin chính về order
	OrderID nvarchar(255) not null Primary key,
	DiscountCode nvarchar(12) null FOREIGN KEY References DiscountCode(DiscountCodeID), -- Có mã giảm giá không
	OrdererName nvarchar(255) not null, -- Người đặt hàng
	OrdererPhoneNumber nvarchar(10) not null, -- SDT giao hàng
	OrdererEmail nvarchar(255) not null, -- Email của người giao hàng
	DeliveryAddress nvarchar(255) not null, -- Địa chỉ giao hàng
	CreateDate datetime not null, -- Ngày đặt hàng
	Note nvarchar(255) not null,
)

CREATE TABLE Product( -- Thông tin về sản phẩm của Merch
	ProductID nvarchar(255) not null Primary key,
	ProductName nvarchar(255) not null,
	ProductDescription nvarchar(255) null,
	Price float not null,
	Note nvarchar(255) null,
)

CREATE TABLE OrderDetail(
	OrderDetailID nvarchar(255) not null Primary key,
	OrderID nvarchar(255) not null FOREIGN KEY References Orders(OrderID),
	ProductID nvarchar(255) not null FOREIGN KEY References Product(ProductID),
	Amount int not null,
		CHECK (Amount >0),
	CreateDate datetime not null,
)

---------------------------------------------------------------------------------
SELECT * FROM Role