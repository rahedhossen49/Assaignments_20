const {
  CalculateTotalRevenueByAllTransaction,
  TotalQuantitySoldForEachProduct,
  RetrieveTopFiveProductsHighestRevenue,
  CalculateAveragePriceOfProducts,
  CalculateTotalRevenueByMonthYear,
  HeightsSaleOnSingleDay,
} = require("../controllers/SalesController");

const router = require("express").Router();

router.get("/total-revenue", CalculateTotalRevenueByAllTransaction);
router.get("/quantity-by-product", TotalQuantitySoldForEachProduct);
router.get("/top-product", RetrieveTopFiveProductsHighestRevenue);
router.get("/average-price", CalculateAveragePriceOfProducts);
router.get("/revenue-by-month", CalculateTotalRevenueByMonthYear);
router.get("/highest-quantity-sold", HeightsSaleOnSingleDay);

module.exports = router;
