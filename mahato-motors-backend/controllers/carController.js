const Car = require("../models/car");
const fs = require("fs");
const path = require("path");


// SKU GENERATOR

const generateSKU = (car) => {
  const model = car.modelName.substring(0, 3).toUpperCase();
  const variant = car.variant.substring(0, 2).toUpperCase();
  const color = car.color.substring(0, 2).toUpperCase();
  const year = new Date().getFullYear();
  const random = Math.floor(100 + Math.random() * 900);

  return `${model}-${variant}-${color}-${year}-${random}`;
};

// GET ALL CARS 
exports.getCars = async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ADD CAR (WITH SKU + BARCODE)

exports.addCar = async (req, res, next) => {
  try {
    const sku = generateSKU(req.body);
    const barcode = sku; // Simple approach (barcode = SKU)

    const car = await Car.create({
      ...req.body,
      sku,
      barcode,
      image: req.file ? "uploads/" + req.file.filename : null
    });

    res.status(201).json(car);
  } catch (error) {
    next(error);
    res.status(400).json({ error: error.message });
  }
};

// UPDATE CAR (SKU WILL NOT CHANGE)

exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });

    const updateData = {
      modelName: req.body.modelName || car.modelName,
      variant: req.body.variant || car.variant,
      fuelType: req.body.fuelType || car.fuelType,
      color: req.body.color || car.color,
      exShowroomPrice: req.body.exShowroomPrice || car.exShowroomPrice,
      onRoadPrice: req.body.onRoadPrice || car.onRoadPrice,
      stock: req.body.stock !== undefined ? req.body.stock : car.stock,
    };

    Object.assign(car, updateData);

    // Image update (safe delete old image)
    if (req.file) {
      if (car.image) {
        const oldPath = path.join(__dirname, "..", car.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      car.image = "uploads/" + req.file.filename;
    }

    await car.save();
    res.json(car);

  } catch (error) {
    console.error("Update Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// DELETE CAR (SAFE VERSION)

exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });

    if (car.image) {
      const imgPath = path.join(__dirname, "..", car.image);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    await car.deleteOne();
    res.json({ message: "Car deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


  //  SCAN CAR BY BARCODE (STOCK REDUCE)
  
exports.scanCar = async (req, res) => {
  try {
    const { barcode } = req.body;

    const car = await Car.findOne({ barcode });

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    if (car.stock <= 0) {
      return res.status(400).json({ message: "Out of stock" });
    }

    car.stock -= 1;
    await car.save();

    res.json({
      message: "Stock updated successfully",
      car
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};