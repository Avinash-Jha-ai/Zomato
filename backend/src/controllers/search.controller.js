import productModel from "../models/product.model.js";


export const searchProducts = async (req, res) => {
  const {
    query,
    veg,
    minPrice,
    maxPrice,
    sort
  } = req.query;

  try {
    const filter = {};

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }

    if (veg !== undefined) {
      filter.veg = veg === "true";
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let sortOption = {};
    if (sort === "price_low") sortOption.price = 1;
    if (sort === "price_high") sortOption.price = -1;
    if (sort === "new") sortOption.createdAt = -1;

    const products = await productModel
      .find(filter)
      .sort(sortOption);

    return res.status(200).json({
      success: true,
      totalProducts: products.length,
      products
    });

  } catch (error) {
    console.log("error in search:", error);
    return res.status(500).json({
      success: false,
      message: "error in search",
      error: error.message
    });
  }
};