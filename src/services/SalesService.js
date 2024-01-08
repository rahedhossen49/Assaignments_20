const SalesModel = require("../Model/SalesModel");

exports.CalculateTotalRevenueByAllTransactionService = async (req, res) => {
  try {
    const result = await SalesModel.find();

    let totalRevenue = 0;

    result.forEach((element) => {
      let sellQuantity = element["quantity"];

      let sale_price = element["sale_price"];

      let companyPrice = element["companyPrice"];

      let profit = parseFloat(sale_price) - parseFloat(companyPrice);

      let PerProductRev = parseFloat(sellQuantity) * profit;

      totalRevenue += PerProductRev;
    });

    let data = `Total Revenue By All Transaction is ${totalRevenue} `;

    return { status: "Success", data: data };
  } catch (err) {
    console.error(
      "Error in CalculateTotalRevenueByAllTransactionService:",
      err
    );
    return { status: "fail", error: "Internal Server Error" };
  }
};

exports.TotalQuantitySoldForEachProductService = async (req, res) => {
  try {
    const result = await SalesModel.aggregate([
      {
        $project: {
          productName: "$product",
          SoldQuantity: "$quantity",
          LeftStock: { $subtract: ["$stock_qty", "$quantity"] },
        },
      },
    ]);

    return { status: "success", data: result };
  } catch (err) {
    console.error("Error in TotalQuantitySoldForEachProductService:", err);
    return { status: "fail", error: "Internal Server Error" };
  }
};

exports.RetrieveTopFiveProductsHighestRevenueService = async (req, res) => {
  try {
    let result = await SalesModel.find();

    let totalRevenue = 0;

    result.forEach(async (element) => {
      sellQuantity = element["quantity"];
      let sale_price = element["sale_price"];

      let companyPrice = element["companyPrice"];

      let profit = parseFloat(sale_price) - parseFloat(companyPrice);

      let PerProductRev = parseFloat(sellQuantity) * profit;

      totalRevenue += PerProductRev;

      let updateRevenueFiled = await SalesModel.updateOne(
        { _id: element["_id"] },
        { sell_revenue: totalRevenue }
      );
      return updateRevenueFiled;
    });

    let data = await SalesModel.aggregate([
      {
        $project: {
          product: 1,
          sell_revenue: 1,
        },
      },
      {
        $sort: {
          sell_revenue: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);

    return {
      status: "Success",
      Message:
        "Retrieve the top 5 products with the highest total revenue, along with their total revenue values",
      data: data,
    };
  } catch (err) {
    console.error(
      "Error in CalculateTotalRevenueByAllTransactionService:",
      err
    );
    return { status: "fail", error: "Internal Server Error" };
  }
};

exports.CalculateAveragePriceOfProductsService = async (req, res) => {
  try {
    const result = await SalesModel.aggregate([
      {
        $group: {
          _id: "$product",
          averagePrice: { $avg: "$price" },
        },
      },
      {
        $project: {
          _id: 0,
          product: "$_id",
          averagePrice: 1,
        },
      },
    ]);

    return { status: "success", data: result };
  } catch (err) {
    console.error("Error in CalculateAveragePriceOfProductsService:", err);
    return { status: "fail", error: "Internal Server Error" };
  }
};

exports.CalculateTotalRevenueByMonthYearService = async (req, res) => {
  try {
    const result = await SalesModel.aggregate([
      {
        $addFields: {
          date: { $toDate: "$date" },
        },
      },
      {
        $project: {
          yearMonth: { $dateToString: { format: "%Y-%m", date: "$date" } },
          sell_revenue: { $multiply: ["$quantity", "$price"] },
        },
      },
      {
        $group: {
          _id: "$yearMonth",
          totalRevenue: { $sum: "$sell_revenue" },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    return { status: "success", data: result };
  } catch (err) {
    console.error("Error in CalculateTotalRevenueByMonthYearService:", err);
    return { status: "fail", error: "Internal Server Error" };
  }
};

exports.HeightsSaleOnSingleDayService = async (req, res) => {
  try {
    const result = await SalesModel.aggregate([
      {
        $addFields: {
          date: { $toDate: "$date" },
        },
      },
      {
        $project: {
          product: 1,
          date: 1,
          quantity: 1,
        },
      },
      {
        $group: {
          _id: {
            date: "$date",
            product: "$product",
          },
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $sort: {
          totalQuantity: -1,
        },
      },
      {
        $limit: 1,
      },
      {
        $project: {
          _id: 0,
          product: "$_id.product",
          date: "$_id.date",
          totalQuantity: 1,
        },
      },
    ]);

    return { status: "success", data: result[0] };
  } catch (err) {
    console.error("Error in HeightsSaleOnSingleDayService:", err);
    return { status: "fail", error: "Internal Server Error" };
  }
};
