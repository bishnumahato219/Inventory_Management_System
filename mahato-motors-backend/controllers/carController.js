const Car = require("../models/car");
const fs = require("fs");
const path = require("path");

// GET ALL CARS
exports.getCars = async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ADD CAR
exports.addCar = async (req, res, next) => {
  try {
    const car = await Car.create({
      ...req.body,
      image: req.file ? "uploads/" + req.file.filename : null 
    });
    res.status(201).json(car);
  } catch (error) {
    next(error);
    res.status(400).json({ error: error.message });
  }
};

// UPDATE CAR (Safe Version)
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

    if (req.file) {
      if (car.image) {
        // YAHAN SAFE CHECK HAI: ENOENT error se bachne ke liye
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

// DELETE CAR (Safe Version)
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